"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon, FileText } from "lucide-react";
import Image from "next/image";
import type { FormField } from "@/types/form-config";
import type { FieldRendererProps } from "./form-field-renderer";

interface FileFieldValue {
  urls: string[];
  names: string[];
}

export function FileField({ field, value, onChange, error, disabled = false }: FieldRendererProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  // Parse value from different formats
  const fileValue = value as FileFieldValue | string[] | string | null | undefined;
  let urls: string[] = [];

  if (Array.isArray(fileValue)) {
    urls = fileValue;
  } else if (typeof fileValue === "string" && fileValue) {
    urls = [fileValue];
  } else if (fileValue && typeof fileValue === "object" && "urls" in fileValue) {
    urls = fileValue.urls || [];
  }

  // Generate previews for images
  useEffect(() => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const imageUrls = urls.filter((url) =>
      imageExtensions.some((ext) => url.toLowerCase().endsWith(ext))
    );
    setPreviews(imageUrls);
  }, [urls]);

  const maxFiles = field.validation?.max || 5;
  const maxFileSize = 5 * 1024 * 1024; // 5MB
  const acceptedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
  ];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check limit
    if (urls.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate files
    const invalidFiles = Array.from(files).filter((file) => {
      if (!acceptedTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}`);
        return true;
      }
      if (file.size > maxFileSize) {
        toast.error(`File too large: ${file.name} (max 5MB)`);
        return true;
      }
      return false;
    });

    if (invalidFiles.length > 0) {
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload/temp-files", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || "Upload failed");
        }

        return response.json();
      });

      const results = await Promise.all(uploadPromises);
      const newUrls = results.map((r) => r.url);

      // Update value maintaining format
      const updatedUrls = [...urls, ...newUrls];
      onChange(updatedUrls);

      toast.success(`Successfully uploaded ${results.length} file(s)`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload files");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleRemove = (urlToRemove: string) => {
    const updatedUrls = urls.filter((url) => url !== urlToRemove);
    onChange(updatedUrls.length > 0 ? updatedUrls : null);
  };

  const isImage = (url: string) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  const getFileName = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1] || url;
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={field.id} className={error ? "text-destructive" : ""}>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>

      {field.placeholder && <p className="text-muted-foreground text-sm">{field.placeholder}</p>}

      <div className="space-y-3">
        {/* Upload Button */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || isUploading || urls.length >= maxFiles}
            onClick={() => document.getElementById(`file-input-${field.id}`)?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload File"}
          </Button>
          <span className="text-muted-foreground text-xs">
            {urls.length} / {maxFiles} files
          </span>
          <input
            id={`file-input-${field.id}`}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,application/pdf"
            multiple
            className="hidden"
            onChange={handleUpload}
            disabled={disabled || isUploading || urls.length >= maxFiles}
          />
        </div>

        {/* File List */}
        {urls.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {urls.map((url) => (
              <Card key={url} className="group relative">
                <CardContent className="p-2">
                  {isImage(url) ? (
                    <div className="bg-muted relative aspect-square overflow-hidden rounded-md">
                      <Image
                        src={url}
                        alt={getFileName(url)}
                        fill
                        className="object-cover"
                        sizes="(max-width: 150px) 100vw, 150px"
                      />
                    </div>
                  ) : (
                    <div className="bg-muted flex aspect-square items-center justify-center rounded-md">
                      <FileText className="text-muted-foreground h-8 w-8" />
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => handleRemove(url)}
                    disabled={disabled}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <p
                    className="text-muted-foreground mt-1 truncate text-xs"
                    title={getFileName(url)}
                  >
                    {getFileName(url)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center text-center">
                {field.type === "file" ? (
                  <FileText className="text-muted-foreground mb-3 h-10 w-10" />
                ) : (
                  <ImageIcon className="text-muted-foreground mb-3 h-10 w-10" />
                )}
                <p className="text-muted-foreground text-sm">No files uploaded</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Upload up to {maxFiles} files (images or PDF, max 5MB each)
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
