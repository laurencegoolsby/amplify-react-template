import { useState } from 'react';
import FileUpload from './components/FileUpload';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import Alert from './components/Alert';
import DocumentTypeSelector from './components/DocumentTypeSelector';
import FilesList from './components/FilesList';
import ResultsDisplay from './components/ResultsDisplay';
import { useAlert } from './hooks/useAlert';
import { useFileUpload } from './hooks/useFileUpload';
import { uploadFile } from './services/uploadService';
import { formatFileSize, validateFileSize, validateFileType } from './utils/fileUtils';
import './styles/globals.css';
import './styles/layout.css';
import './styles/typography.css';
import './styles/radio-group.css';
import './styles/file-info.css';
import './styles/upload-controls.css';
import './styles/modal.css';

function App() {
  const [documentType, setDocumentType] = useState('Paystub');
  
  const alert = useAlert();
  const fileUpload = useFileUpload();

  const handleSignOut = () => {
    console.log('Sign out clicked');
  };
  const addFile = async (file: File) => {
    if (!validateFileType(file)) {
      alert.showAlertMessage('Please select a PDF or image file. Only PDF documents and images are supported.', 'error');
      return;
    }
    
    if (!validateFileSize(file)) {
      alert.showAlertMessage('File size exceeds 10MB limit. Please choose a smaller file.', 'error');
      return;
    }

    const newFile = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: documentType
    };
    
    fileUpload.setUploadInProgress(true);
    fileUpload.setUploadProgress(0);
    
    try {
      const responseData = await uploadFile(file, documentType, fileUpload.setUploadProgress);
      
      setTimeout(() => {
        fileUpload.setUploadInProgress(false);
        fileUpload.addFile(newFile);
        fileUpload.updateFileWithResponse(newFile.id, responseData);
        alert.showAlertMessage('Document uploaded successfully!', 'success');
      }, 500);
    } catch (error) {
      console.error('Failed to send document upload notification:', error);
      setTimeout(() => {
        fileUpload.setUploadInProgress(false);
        const errorMessage = error instanceof Error && error.message.includes('HTTP error') 
          ? 'Upload failed. Please try again.' 
          : 'Network error. Please check your connection.';
        alert.showAlertMessage(errorMessage, 'error');
      }, 500);
    }
  };





  return (
    <div className="app-container">
      <Alert 
        show={alert.showAlert}
        message={alert.alertMessage}
        type={alert.alertType}
        fading={alert.alertFading}
        onClose={alert.closeAlert}
      />
      <Header onSignOut={handleSignOut} />
      
      <main className="main-content">
        <div className="upload-section">
          <h2 className="section-title">Document Upload</h2>          
          <div className="upload-controls">
            <DocumentTypeSelector 
              documentType={documentType}
              onDocumentTypeChange={setDocumentType}
            />
            
            <div className="upload-wrapper">
              <FileUpload onUploadComplete={(result) => console.log('Upload complete:', result)} onFileSelect={addFile} />
            </div>
          </div>
          
          <FilesList 
            files={fileUpload.uploadedFiles}
            selectedFile={fileUpload.selectedFile}
            onFileSelect={fileUpload.setSelectedFile}
            formatFileSize={formatFileSize}
          />
        </div>
        
        <div className="results-section">
          <h2 className="section-title">Intelligent Document Processing Results</h2>
          <ResultsDisplay 
            uploadedFiles={fileUpload.uploadedFiles}
            selectedFile={fileUpload.selectedFile}
            uploadInProgress={fileUpload.uploadInProgress}
            uploadProgress={fileUpload.uploadProgress}
            processingResult={null}
            showResults={false}
          />
        </div>
      </main>

      <Footer />
      

    </div>
  );
}

export default App;
