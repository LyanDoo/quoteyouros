import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Resume() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadResume = async () => {
      try {
        const res = await fetch(`${API_URL}/api/profile/resume/download`);
        if (!res.ok) throw new Error('API responded with error');
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setIsLoading(false);
      } catch (error) {
        console.warn('Failed to load resume PDF.', error);
        setError('Could not load resume PDF');
        setIsLoading(false);
      }
    };

    loadResume();

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, []);

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'Resume_Lio.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isLoading) {
    return (
      <div className="wordpad-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <div className="wordpad-toolbar">
          <button disabled>📄 New</button>
          <button disabled>📂 Open</button>
          <button disabled>💾 Save</button>
          <button disabled>🖨️ Print</button>
          <span style={{ flex: 1 }}></span>
          <button disabled>⬇️ Download PDF</button>
        </div>
        <div className="wordpad-body" style={{ flex: 1, overflowY: 'auto', cursor: 'wait' }}>
          <p>Loading resume PDF...</p>
        </div>
      </div>
    );
  }

  if (error || !pdfUrl) {
    return (
      <div className="wordpad-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <div className="wordpad-toolbar">
          <button>📄 New</button>
          <button>📂 Open</button>
          <button>💾 Save</button>
          <button>🖨️ Print</button>
          <span style={{ flex: 1 }}></span>
          <button disabled>⬇️ Download PDF</button>
        </div>
        <div className="wordpad-body" style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            <p style={{ fontSize: '14px' }}>📄 Could not load resume PDF.</p>
            <p style={{ fontSize: '12px', color: '#999' }}>Error: {error || 'Unknown error'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wordpad-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div className="wordpad-toolbar">
        <button>📄 New</button>
        <button>📂 Open</button>
        <button>💾 Save</button>
        <button>🖨️ Print</button>
        <span style={{ flex: 1 }}></span>
        <button onClick={handleDownload}>⬇️ Download PDF</button>
      </div>
      <div className="wordpad-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div className="resume-iframe-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <iframe
            src={pdfUrl}
            style={{
              flex: 1,
              border: 'none',
              borderRadius: '3px'
            }}
            title="Resume PDF"
          />
        </div>
        <div className="resume-mobile-fallback">
          <div className="resume-mobile-card">
            <span className="resume-mobile-icon">📄</span>
            <h3>Resume_Lio.pdf</h3>
            <p>
              PDFs are best viewed by downloading or opening in a new tab on mobile devices.
            </p>
            <button 
              className="resume-download-btn"
              onClick={handleDownload}
            >
              ⬇️ View / Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resume;
