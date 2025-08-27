import { useState } from 'react';
import FileUpload from './components/FileUpload';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import './styles/globals.css';
import './styles/layout.css';
import './styles/typography.css';
import './styles/radio-group.css';
import './styles/file-info.css';
import './styles/upload-controls.css';

function App() {
  const handleSignOut = () => {
    console.log('Sign out clicked');
  };

  const [documentType, setDocumentType] = useState('Personal Information');
  const [uploadedFiles, setUploadedFiles] = useState<{id: string, name: string, size: number, type: string}[]>([]);

  const addFile = (file: File) => {
    const newFile = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: documentType
    };
    setUploadedFiles(prev => [...prev, newFile]);
  };

  const deleteFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  return (
    <div className="app-container">
      <Header onSignOut={handleSignOut} />
      
      <main className="main-content">
        <div className="upload-section">
          <h2 className="section-title">Document Upload</h2>          
          <div className="upload-controls">
            <div className="document-type-selector">
              <h3 className="selector-title">Document Type:</h3>
              <div className="radio-group">
                {['Personal Information', 'Income', 'Miscellaneous'].map((type) => (
                  <label key={type} className="radio-option">
                    <input
                      type="radio"
                      name="documentType"
                      value={type}
                      checked={documentType === type}
                      onChange={(e) => setDocumentType(e.target.value)}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="upload-wrapper">
              <FileUpload onUploadComplete={(result) => console.log('Upload complete:', result)} onFileSelect={addFile} />
            </div>
          </div>
          
          {uploadedFiles.length > 0 && (
            <div className="files-list">
              <h3 className="selector-title">Uploaded Files:</h3>
              {uploadedFiles.map((file) => (
                <div key={file.id} className="file-item">
                  <div className="file-details">
                    <p><strong>Name:</strong> {file.name}</p>
                    <p><strong>Type:</strong> {file.type}</p>
                    <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button 
                    className="delete-btn" 
                    onClick={() => deleteFile(file.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="results-section">
          <h2 className="section-title">Processing Results</h2>
          {uploadedFiles.length === 0 && (
            <p className="section-description">
              Upload a document to see processing results here
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
