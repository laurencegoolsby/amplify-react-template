import { UploadedFile } from '../hooks/useFileUpload';
import ExplainabilityRenderer from './ExplainabilityRenderer';

interface ResultsDisplayProps {
  uploadedFiles: UploadedFile[];
  selectedFile: UploadedFile | null;
  uploadInProgress: boolean;
  uploadProgress: number;
  processingResult: any;
  showResults: boolean;
}

export default function ResultsDisplay({ 
  uploadedFiles, 
  selectedFile, 
  uploadInProgress, 
  uploadProgress, 
  processingResult, 
  showResults 
}: ResultsDisplayProps) {
  if (uploadedFiles.length === 0) {
    return (
      <p className="section-description">
        Upload a document to see processing results here
      </p>
    );
  }

  if (!selectedFile) {
    return (
      <p className="section-description">
        Click on a file to view details
      </p>
    );
  }

  return (
    <div className="file-display">
      {uploadInProgress ? (
        <div className="loading-container">
          <div className="loading-text">Uploading... {Math.round(uploadProgress)}%</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${uploadProgress}%`}}></div>
          </div>
        </div>
      ) : selectedFile?.apiResponse ? (
        <div style={{width: '100%', padding: '20px'}}>
          <div style={{backgroundColor: '#f8fbff', border: '1px solid #e1e5e9', borderRadius: '8px', padding: '16px', overflow: 'auto'}}>
            <pre style={{margin: 0, fontSize: '12px', color: '#5a6c7d', whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}>
              {JSON.stringify(selectedFile.apiResponse, null, 2)}
            </pre>
          </div>
        </div>
      ) : processingResult && showResults ? (
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
            <ExplainabilityRenderer explainabilityInfo={processingResult.explainability_info} /> :
            <pre>{JSON.stringify(processingResult, null, 2)}</pre>
          }
        </div>
      ) : null}
    </div>
  );
}