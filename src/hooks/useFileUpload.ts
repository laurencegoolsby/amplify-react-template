import { useState } from 'react';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  apiResponse?: any;
}

export const useFileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadInProgress, setUploadInProgress] = useState(false);

  const addFile = (file: UploadedFile) => {
    setUploadedFiles(prev => [...prev, file]);
    setSelectedFile(file);
  };

  const updateFileWithResponse = (fileId: string, apiResponse: any) => {
    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, apiResponse } : f
    ));
    setSelectedFile(prev => prev?.id === fileId ? { ...prev, apiResponse } : prev);
  };

  return {
    uploadedFiles,
    selectedFile,
    uploadProgress,
    uploadInProgress,
    setSelectedFile,
    setUploadProgress,
    setUploadInProgress,
    addFile,
    updateFileWithResponse
  };
};