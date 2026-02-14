"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  orderId: string;
  kitId: string;
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export function ImageUpload({
  orderId,
  kitId,
  images,
  onImagesChange,
  maxImages = 5,
  disabled = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("orderId", orderId);
        formData.append("kitId", kitId);

        const response = await fetch("/api/upload/reference-images", {
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
      const newImages = results.map((r) => r.url);
      onImagesChange([...images, ...newImages]);

      toast.success(`Successfully uploaded ${results.length} image(s)`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload images");
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleDelete = async (imageUrl: string) => {
    try {
      // Extract path from URL (assumes standard Supabase URL format)
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split("/order-reference-images/");
      const path = pathParts[1];

      const response = await fetch("/api/upload/reference-images", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      onImagesChange(images.filter((img) => img !== imageUrl));
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {images.length} / {maxImages} images
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || isUploading || images.length >= maxImages}
          onClick={() => document.getElementById(`file-upload-${kitId}`)?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? "Uploading..." : "Upload Images"}
        </Button>
        <input
          id={`file-upload-${kitId}`}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          multiple
          className="hidden"
          onChange={handleUpload}
          disabled={disabled || isUploading || images.length >= maxImages}
        />
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {images.map((imageUrl) => (
            <Card key={imageUrl} className="group relative">
              <CardContent className="p-2">
                <div className="bg-muted relative aspect-square overflow-hidden rounded-md">
                  <Image
                    src={imageUrl}
                    alt="Reference image"
                    fill
                    className="object-cover"
                    sizes="(max-width: 200px) 100vw, 200px"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => handleDelete(imageUrl)}
                    disabled={disabled}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <ImageIcon className="text-muted-foreground mb-4 h-12 w-12" />
              <p className="text-muted-foreground text-sm">No reference images yet</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Upload up to {maxImages} images to help us understand your requirements
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
