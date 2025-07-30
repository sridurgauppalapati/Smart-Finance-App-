import React, { useState } from 'react';
import axios from 'axios';

const PDFUploader = ({ onTransactionsImported }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setResult(null);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('bankStatement', file);

    try {
      const response = await axios.post('http://localhost:5001/api/pdf/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setResult(response.data);
      if (onTransactionsImported) {
        onTransactionsImported(response.data.transactions);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setResult({ error: error.response?.data?.error || 'Upload failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pdf-uploader">
      <h3>Import Bank Statement</h3>
      
      <div className="upload-section">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={loading}
        />
        
        {file && (
          <div className="file-info">
            <p>Selected: {file.name}</p>
            <button onClick={handleUpload} disabled={loading}>
              {loading ? 'Processing...' : 'Import Transactions'}
            </button>
          </div>
        )}
      </div>

      {result && (
        <div className={`result ${result.error ? 'error' : 'success'}`}>
          {result.error ? (
            <p>Error: {result.error}</p>
          ) : (
            <div>
              <p>✅ {result.message}</p>
              <div className="transactions-preview">
                {result.transactions.slice(0, 3).map((t, i) => (
                  <div key={i} className="transaction-item">
                    <span className={t.type}>{t.type}</span>
                    <span>₹{t.amount}</span>
                    <span>{t.description}</span>
                  </div>
                ))}
                {result.transactions.length > 3 && (
                  <p>...and {result.transactions.length - 3} more</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PDFUploader;