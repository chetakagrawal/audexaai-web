'use client';

import React, { useRef } from 'react';
import Button from '@/components/ui/Button';

interface EvidenceUploaderProps {
  onFilesSelected: (files: File[]) => void;
  isUploading: boolean;
}

export default function EvidenceUploader({
  onFilesSelected,
  isUploading,
}: EvidenceUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
      <Button
        variant="outline"
        onClick={handleClick}
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload Evidence'}
      </Button>
    </div>
  );
}

