import { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import './styles/globals.css';
import './styles/layout.css';
import './styles/typography.css';
import './styles/radio-group.css';
import './styles/file-info.css';
import './styles/upload-controls.css';
import './styles/modal.css';
import { processDocument } from './utils/mockApi';

function App() {
  const handleSignOut = () => {
    console.log('Sign out clicked');
  };

  const [documentType, setDocumentType] = useState('Paystub');
  const [uploadedFiles, setUploadedFiles] = useState<{id: string, name: string, size: number, type: string}[]>([]);
  const [selectedFile, setSelectedFile] = useState<{id: string, name: string, size: number, type: string} | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [processingResult, setProcessingResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);



  const addFile = async (file: File) => {
    // Check if file with same name already exists
    const isDuplicate = uploadedFiles.some(existingFile => existingFile.name === file.name);
    
    if (isDuplicate) {
      setShowModal(true);
      return;
    }
    
    const newFile = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: documentType
    };
    
    // Send POST request to AWS API
    const endpoint = 'http://copa-a-appli-xy2jnn96xnau-1399784121.us-west-2.elb.amazonaws.com/upload-pdf';
    
    try {
      console.log(`Executing post request to: ${endpoint}`);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      formData.append('fileSize', file.size.toString());
      formData.append('documentType', documentType);
      formData.append('contentType', file.type);
      formData.append('timestamp', new Date().toISOString());
      
      await fetch(endpoint, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: formData
      });
    } catch (error) {
      console.error('Failed to send document upload notification:', error);
    }
    
    setUploadedFiles(prev => [...prev, newFile]);

    setSelectedFile(newFile);
  };

  const deleteFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / 1024 / 1024;
    return mb < 1 ? `${(bytes / 1024).toFixed(0)} KB` : `${mb.toFixed(2)} MB`;
  };

  const renderExplainabilityInfo = (explainabilityInfo: any) => {
    const getConfidenceClass = (confidence: number): string => {
      if (confidence > 0.9) return 'confidence-high';
      if (confidence >= 0.6) return 'confidence-medium';
      return 'confidence-low';
    };

    const confidenceValues: number[] = [];
    
    const flattenFields = (obj: any, prefix: string = ''): JSX.Element[] => {
      const items: JSX.Element[] = [];
      
      Object.entries(obj).forEach(([key, value]) => {
        const fullKey = prefix ? `${prefix} ${key}` : key;
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          if ((value as any).confidence !== undefined) {
            confidenceValues.push((value as any).confidence);
            items.push(
              <div key={fullKey} className="field-item">
                <span className="field-key">{fullKey}:</span>
                <span className="field-value">{(value as any).value}</span>
                <span className={`field-confidence ${getConfidenceClass((value as any).confidence)}`}>({Math.round((value as any).confidence * 100)}%)</span>
              </div>
            );
          } else {
            items.push(...flattenFields(value, fullKey));
          }
        }
      });
      
      return items;
    };

    const fields = flattenFields(explainabilityInfo);
    
    const avgConfidence = confidenceValues.length > 0 ? confidenceValues.reduce((a, b) => a + b, 0) / confidenceValues.length : 0;
    const minConfidence = confidenceValues.length > 0 ? Math.min(...confidenceValues) : 0;
    const maxConfidence = confidenceValues.length > 0 ? Math.max(...confidenceValues) : 0;
    const medianConfidence = confidenceValues.length > 0 ? (() => {
      const sorted = [...confidenceValues].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    })() : 0;

    const getBackgroundColor = (confidence: number): string => {
      if (confidence > 0.9) return '#e8f5e8';
      if (confidence >= 0.6) return '#fff8e1';
      return '#ffeaea';
    };

    const getConfidenceLevel = (confidence: number): string => {
      if (confidence > 0.9) return 'High';
      if (confidence >= 0.6) return 'Medium';
      return 'Low';
    };

    return (
      <div className="explainability-content" style={{backgroundColor: getBackgroundColor(avgConfidence)}}>
        <div className="confidence-stats">
          <h4>Confidence Statistics</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Confidence:</span>
              <span className={`stat-value ${getConfidenceClass(avgConfidence)}`}>{getConfidenceLevel(avgConfidence)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Minimum:</span>
              <span className={`stat-value ${getConfidenceClass(minConfidence)}`}>{Math.round(minConfidence * 100)}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Median:</span>
              <span className={`stat-value ${getConfidenceClass(medianConfidence)}`}>{Math.round(medianConfidence * 100)}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Average:</span>
              <span className={`stat-value ${getConfidenceClass(avgConfidence)}`}>{Math.round(avgConfidence * 100)}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Maximum:</span>
              <span className={`stat-value ${getConfidenceClass(maxConfidence)}`}>{Math.round(maxConfidence * 100)}%</span>
            </div>
          </div>
        </div>
        <div className="field-details">
          {fields}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (selectedFile) {
      setIsLoading(true);
      setLoadingProgress(0);
      setProcessingResult(null);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
      
      processDocument(selectedFile.name)
        .then(result => {
          setLoadingProgress(100);
          setTimeout(() => {
            setProcessingResult(result);
            setIsLoading(false);
            clearInterval(progressInterval);
          }, 300);
        })
        .catch(error => {
          console.error('Failed to fetch processing result:', error);
          setProcessingResult(null);
          setIsLoading(false);
          clearInterval(progressInterval);
        });
    } else {
      setProcessingResult(null);
      setIsLoading(false);
      setLoadingProgress(0);
    }
  }, [selectedFile]);

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
                <label className="radio-option">
                  <input
                    type="radio"
                    name="documentType"
                    value="Paystub"
                    checked={documentType === 'Paystub'}
                    onChange={(e) => setDocumentType(e.target.value)}
                  />
                  <span>Paystub</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="documentType"
                    value="Other"
                    checked={documentType === 'Other'}
                    onChange={(e) => setDocumentType(e.target.value)}
                  />
                  <span>Other</span>
                </label>
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
                <div key={file.id} className={`file-item ${selectedFile?.id === file.id ? 'selected' : ''}`} onClick={() => setSelectedFile(file)}>
                  <div className="file-details">
                    <p><strong>Name:</strong> {file.name}</p>
                    <p><strong>Type:</strong> {file.type}</p>
                    <p><strong>Size:</strong> {formatFileSize(file.size)}</p>
                  </div>
                  <button 
                    className="delete-btn" 
                    onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="results-section">
          <h2 className="section-title">Intelligent Document Processing Results</h2>
          {uploadedFiles.length === 0 ? (
            <p className="section-description">
              Upload a document to see processing results here
            </p>
          ) : selectedFile ? (
            <div className="file-display">
              {isLoading ? (
                <div className="loading-container">
                  <div className="loading-text">Processing document... {Math.round(loadingProgress)}%</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: `${loadingProgress}%`}}></div>
                  </div>
                </div>
              ) : processingResult ? (
                <div className="processing-result" style={processingResult.explainability_info ? {
                  backgroundColor: (() => {
                    const confidenceValues: number[] = [];
                    const extractConfidence = (obj: any) => {
                      Object.values(obj).forEach((value: any) => {
                        if (typeof value === 'object' && value !== null) {
                          if (value.confidence !== undefined) {
                            confidenceValues.push(value.confidence);
                          } else {
                            extractConfidence(value);
                          }
                        }
                      });
                    };
                    extractConfidence(processingResult.explainability_info);
                    const avgConfidence = confidenceValues.length > 0 ? confidenceValues.reduce((a, b) => a + b, 0) / confidenceValues.length : 0;
                    if (avgConfidence > 0.9) return '#e8f5e8';
                    if (avgConfidence >= 0.6) return '#fff8e1';
                    return '#ffeaea';
                  })()
                } : {}}>
                  {processingResult.explainability_info ? 
                    renderExplainabilityInfo(processingResult.explainability_info) :
                    <pre>{JSON.stringify(processingResult, null, 2)}</pre>
                  }
                </div>
              ) : null}
            </div>
          ) : (
            <p className="section-description">
              Click on a file to view details
            </p>
          )}
        </div>
      </main>

      <Footer />
      
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Duplicate File</h3>
            <p>A file with this name has already been uploaded.</p>
            <button className="modal-btn" onClick={() => setShowModal(false)}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
