"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Upload, File, CheckCircle, AlertCircle, Clock } from "lucide-react";

type DocumentStatus = "verified" | "needs_review" | "pending";

export interface Document {
  id: string;
  name: string;
  size?: number;
  status: DocumentStatus;
}

export interface DocumentUploadProps {
  documents: Document[];
  onUpload: (files: FileList) => void;
  className?: string;
}

const statusConfig: Record<
  DocumentStatus,
  { label: string; icon: React.ElementType; bgClass: string; textClass: string }
> = {
  verified: {
    label: "Verified",
    icon: CheckCircle,
    bgClass: "bg-emerald/15",
    textClass: "text-emerald",
  },
  needs_review: {
    label: "Needs Review",
    icon: AlertCircle,
    bgClass: "bg-gold-tone/15",
    textClass: "text-gold-tone",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    bgClass: "bg-platinum/15",
    textClass: "text-pewter",
  },
};

function formatFileSize(bytes?: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentUpload({ documents, onUpload, className }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        onUpload(e.dataTransfer.files);
      }
    },
    [onUpload]
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onUpload(e.target.files);
        e.target.value = "";
      }
    },
    [onUpload]
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop zone */}
      <button
        type="button"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed bg-ivory px-6 py-10 transition-all cursor-pointer",
          isDragging
            ? "border-sapphire bg-sapphire-muted"
            : "border-platinum hover:border-sapphire hover:bg-sapphire-muted/50"
        )}
      >
        <Upload
          className={cn(
            "h-8 w-8 transition-colors",
            isDragging ? "text-sapphire" : "text-silver"
          )}
        />
        <div className="text-center">
          <p className="text-sm font-medium text-charcoal">
            Drag files here or click to browse
          </p>
          <p className="mt-1 text-xs text-pewter">
            PDF, JPG, PNG up to 25MB each
          </p>
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png,.webp"
      />

      {/* File list */}
      {documents.length > 0 && (
        <ul className="space-y-2">
          {documents.map((doc) => {
            const config = statusConfig[doc.status];
            const StatusIcon = config.icon;

            return (
              <li
                key={doc.id}
                className="flex items-center gap-3 rounded-lg border border-platinum/50 bg-white px-4 py-3"
              >
                <File className="h-4 w-4 shrink-0 text-pewter" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-charcoal">
                    {doc.name}
                  </p>
                  {doc.size && (
                    <p className="text-xs text-pewter">
                      {formatFileSize(doc.size)}
                    </p>
                  )}
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                    config.bgClass,
                    config.textClass
                  )}
                >
                  <StatusIcon className="h-3 w-3" />
                  {config.label}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
