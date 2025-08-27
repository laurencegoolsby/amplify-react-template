import { useState } from 'react';
import './FileUpload.css';

interface FileUploadProps {
  onUploadComplete?: (result: { key: string; url: string }) => void;
  onFileSelect?: (file: File) => void;
}

export default function FileUpload({ onUploadComplete, onFileSelect }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = async (file: File) => {
    onFileSelect?.(file);

    setUploading(true);
    
    try {
      // Get presigned URL from your API
      const response = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          metadata: {
            uploadedAt: new Date().toISOString(),
            userAgent: navigator.userAgent
          }
        })
      });

      const { uploadUrl, key } = await response.json();

      // Upload directly to CloudFront/S3
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
          'x-amz-meta-uploaded-at': new Date().toISOString(),
          'x-amz-meta-original-name': file.name
        }
      });

      onUploadComplete?.({ key, url: uploadUrl.split('?')[0] });
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
      event.target.value = ''; // Reset input to allow same file again
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  return (
    <div className={`upload-container ${dragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}>
      <div
        className="upload-zone"
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
      >
        <input
          type="file"
          onChange={handleFileUpload}
          disabled={uploading}
          className="file-input"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="upload-label">
          <div className="upload-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="upload-text">
            <h3>Drop files here or click to upload</h3>
            <p>Supports PDF, DOC, DOCX, and image files</p>
          </div>
        </label>
        {uploading && (
          <div className="upload-progress">
            <div className="spinner"></div>
            <span>Processing...</span>
          </div>
        )}
      </div>
    </div>
  );
}