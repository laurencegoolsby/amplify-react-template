import { useAuthenticator } from '@aws-amplify/ui-react';
import FileUpload from './components/FileUpload';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import './styles/globals.css';
import './styles/layout.css';
import './styles/typography.css';

function App() {
  const { signOut } = useAuthenticator();

  return (
    <div className="app-container">
      <Header onSignOut={signOut} />
      
      <main className="main-content">
        <div className="upload-section">
          <h2 className="section-title">Document Upload</h2>
          <p className="section-description">
            Upload your documents for automated processing and analysis
          </p>
          <FileUpload onUploadComplete={(result) => console.log('Upload complete:', result)} />
        </div>
        
        <div className="results-section">
          <h2 className="section-subtitle">Processing Results</h2>
          <p className="results-text">
            Upload a document to see processing results here
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
