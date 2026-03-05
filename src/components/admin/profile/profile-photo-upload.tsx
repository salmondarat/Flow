"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

interface ProfilePhotoUploadProps {
  currentImage?: string;
  onImageChange: (file: File | null) => void;
  isUploading?: boolean;
}

export function ProfilePhotoUpload({
  currentImage,
  onImageChange,
  isUploading = false,
}: ProfilePhotoUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(currentImage);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMountedRef = useRef(true);

  // Update preview when currentImage prop changes
  useEffect(() => {
    setPreview(currentImage);
  }, [currentImage]);

  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
      return "Invalid file type. Please upload JPG, PNG, or WebP.";
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return "File size exceeds 1MB limit.";
    }

    return null;
  }, []);

  const handleFile = useCallback(
    (file: File | null) => {
      setError(null);

      if (!file) {
        setPreview(undefined);
        onImageChange(null);
        return;
      }

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      // Create preview using FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isMountedRef.current) {
          setPreview(reader.result as string);
          onImageChange(file);
        }
      };
      reader.readAsDataURL(file);
    },
    [validateFile, onImageChange]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleFile(file);
    // Reset input value so same file can be selected again
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (isUploading) return;

    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClearImage = () => {
    setPreview(undefined);
    onImageChange(null);
    setError(null);
  };

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative flex items-center justify-center">
        {/* Photo Upload Area */}
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "group relative flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 transition-all duration-200",
            isDragging
              ? "border-primary bg-primary/5"
              : preview
              ? "border-gray-200 dark:border-gray-700"
              : "border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500",
            isUploading && "cursor-not-allowed opacity-50"
          )}
        >
          {preview ? (
            <>
              {/* Image Preview */}
              <img
                src={preview}
                alt="Profile preview"
                className="h-full w-full object-cover"
                draggable={false}
              />

              {/* Overlay with clear button */}
              {!isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearImage();
                    }}
                    className="h-full w-full bg-transparent text-white hover:bg-black/20"
                  >
                    <Camera className="h-6 w-6" />
                    <span className="sr-only">Change photo</span>
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Empty State */}
              <div className="flex flex-col items-center gap-1 text-center p-2">
                <Upload className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Upload
                </span>
              </div>

              {isDragging && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                  <Upload className="h-8 w-8 text-primary animate-bounce" />
                </div>
              )}
            </>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_TYPES.join(",")}
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
            aria-label="Upload profile photo"
          />

          {/* Loading Spinner */}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {/* Helper Text */}
      <p className="text-xs text-muted-foreground">
        JPG, PNG, or WebP (max 1MB)
      </p>
    </div>
  );
}
