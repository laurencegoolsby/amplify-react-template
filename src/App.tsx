import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import FileUpload from './components/FileUpload';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import './styles/globals.css';
import './styles/layout.css';
import './styles/typography.css';

const client = generateClient<Schema>();

function App() {
  const { signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content">
        <div className="upload-section">
          <h2 className="section-title">Document Upload</h2>
          <p className="section-description">
            Upload your documents for automated processing and analysis
          </p>
          <FileUpload onUploadComplete={(result) => console.log('Upload complete:', result)} />
        </div>
        
        <div className="results-section">
          <h3 className="section-subtitle">Processing Results</h3>
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
