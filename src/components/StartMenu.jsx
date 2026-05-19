import React, { useState } from 'react';

const LEFT_ITEMS = [
  { icon: '📝', label: 'About Me', app: 'about-me' },
  { icon: '📁', label: 'My Projects', app: 'projects' },
  { icon: '🌐', label: 'Blog', app: 'blog' },
  { icon: '📄', label: 'Resume', app: 'resume' },
  { icon: '📧', label: 'Contact Me', app: 'contact' },
];

const RIGHT_ITEMS = [
  { icon: '💻', label: 'My Computer' },
  { icon: '📂', label: 'My Documents' },
  { icon: '🎨', label: 'Control Panel' },
  { icon: '🖨️', label: 'Printers' },
  { icon: '❓', label: 'Help & Support' },
  { icon: '🔍', label: 'Search' },
  { icon: '▶️', label: 'Run...' },
];

function StartMenu({ isOpen, closeMenu, openApp }) {
  const [showShutdown, setShowShutdown] = useState(false);

  if (!isOpen && !showShutdown) return null;

  return (
    <>
      {isOpen && (
        <div id="start-menu" onClick={(e) => e.stopPropagation()}>
          <div className="start-menu-header">
            <div className="start-menu-avatar">👤</div>
            <div className="start-menu-username">Lio</div>
          </div>
          <div className="start-menu-body">
            <div className="start-menu-left">
              {LEFT_ITEMS.map((item, index) => (
                <div
                  key={index}
                  className="start-menu-item"
                  onClick={() => {
                    closeMenu();
                    if (item.app) openApp(item.app, item.icon);
                  }}
                >
                  <div className="start-menu-item-icon">{item.icon}</div>
                  <div className="start-menu-item-label">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="start-menu-divider"></div>
            <div className="start-menu-right">
              {RIGHT_ITEMS.map((item, index) => (
                <div key={index} className="start-menu-item">
                  <div className="start-menu-item-icon">{item.icon}</div>
                  <div className="start-menu-item-label">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="start-menu-footer">
            <button 
              className="start-menu-footer-btn"
              onClick={() => {
                closeMenu();
                setShowShutdown(true);
              }}
            >
              <span className="shutdown-icon">⏻</span> Turn Off Computer
            </button>
          </div>
        </div>
      )}

      {showShutdown && (
        <div 
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000
          }}
          onClick={() => setShowShutdown(false)}
        >
          <div className="window" style={{ width: '320px' }} onClick={(e) => e.stopPropagation()}>
            <div className="title-bar">
              <div className="title-bar-text">Turn Off Computer</div>
            </div>
            <div className="window-body" style={{ padding: '16px', textAlign: 'center' }}>
              <p style={{ marginBottom: '16px', fontSize: '12px' }}>
                Are you sure you want to turn off the computer? 😄
              </p>
              <p style={{ marginBottom: '16px', fontSize: '11px', color: '#666' }}>
                (Don't worry, this is just a website!)
              </p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button onClick={() => setShowShutdown(false)}>Cancel</button>
                <button onClick={() => {
                  document.body.innerHTML = '<div style="background:#000;color:#fff;height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column;font-family:Tahoma;"><p>Windows is shutting down...</p><p style="font-size:12px;margin-top:12px;color:#888;">Just kidding! Refresh to restart 🔄</p></div>';
                }}>Turn Off</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StartMenu;
