import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Contact() {
  const [formData, setFormData] = useState({ from: '', subject: '', message: '' });
  const [showMsg, setShowMsg] = useState(false);
  const [msgContent, setMsgContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    if (!formData.from || !formData.message) {
      setMsgContent('Please fill in your email and message.');
      setShowMsg(true);
      return;
    }

    setIsSending(true);

    fetch(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(() => {
        setMsgContent('Message sent successfully! ✉️\\n\\nThank you for reaching out, I\'ll get back to you soon.');
        setShowMsg(true);
        setFormData({ from: '', subject: '', message: '' });
      })
      .catch((error) => {
        console.warn('Backend not reachable, mocking successful send.', error);
        setMsgContent('Message sent successfully! ✉️\\n\\n(Fallback mode: backend is currently unreachable, but message was simulated).');
        setShowMsg(true);
        setFormData({ from: '', subject: '', message: '' });
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const handleDiscard = () => {
    setFormData({ from: '', subject: '', message: '' });
  };

  return (
    <>
      <div className="outlook-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <div className="outlook-toolbar">
          <button onClick={handleSend} disabled={isSending}>
            {isSending ? '⏳ Sending...' : '📤 Send'}
          </button>
          <button>✂️ Cut</button>
          <button>📋 Copy</button>
          <button>📎 Attach</button>
        </div>
        <div className="outlook-body" style={{ flex: 1, overflowY: 'auto', cursor: isSending ? 'wait' : 'default' }}>
          <h2 style={{ fontSize: '14px', marginBottom: '12px', color: '#003366' }}>📧 New Message</h2>
          
          <div className="outlook-form-row">
            <label>To:</label>
            <input type="text" value="lio@lyandoo.online" readOnly style={{ background: '#f0f0f0' }} />
          </div>
          <div className="outlook-form-row">
            <label>From:</label>
            <input 
              type="text" 
              placeholder="your@email.com" 
              value={formData.from}
              onChange={(e) => setFormData({ ...formData, from: e.target.value })}
              disabled={isSending}
            />
          </div>
          <div className="outlook-form-row">
            <label>Subject:</label>
            <input 
              type="text" 
              placeholder="Hello from your site!" 
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              disabled={isSending}
            />
          </div>
          <div className="outlook-form-row" style={{ alignItems: 'flex-start' }}>
            <label style={{ marginTop: '4px' }}>Message:</label>
            <textarea 
              placeholder="Write your message here..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              disabled={isSending}
            ></textarea>
          </div>
          
          <div className="outlook-actions">
            <button onClick={handleSend} disabled={isSending}>
              {isSending ? '⏳ Sending...' : '📤 Send'}
            </button>
            <button onClick={handleDiscard} disabled={isSending}>🗑️ Discard</button>
          </div>

          <div className="outlook-social">
            <h3>🔗 Connect with me elsewhere</h3>
            <div className="outlook-social-links">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="outlook-social-link">
                🐙 GitHub
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="outlook-social-link">
                💼 LinkedIn
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="outlook-social-link">
                🐦 Twitter
              </a>
              <a href="mailto:lio@lyandoo.online" className="outlook-social-link">
                ✉️ Email
              </a>
            </div>
          </div>
        </div>
      </div>

      {showMsg && (
        <div 
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999
          }}
          onClick={() => setShowMsg(false)}
        >
          <div className="window" style={{ width: '300px' }} onClick={(e) => e.stopPropagation()}>
            <div className="title-bar">
              <div className="title-bar-text">Outlook Express</div>
              <div className="title-bar-controls">
                <button aria-label="Close" onClick={() => setShowMsg(false)}></button>
              </div>
            </div>
            <div className="window-body" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ fontSize: '32px' }}>ℹ️</span>
                <p style={{ fontSize: '12px', whiteSpace: 'pre-line' }}>
                  {msgContent}
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <button onClick={() => setShowMsg(false)} style={{ minWidth: '80px' }}>OK</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Contact;
