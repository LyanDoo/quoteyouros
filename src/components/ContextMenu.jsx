import React, { useState, useEffect } from 'react';

function ContextMenu() {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleContextMenu = (e) => {
      // Show only if clicking on the desktop background
      if (
        e.target.closest('#taskbar') ||
        e.target.closest('#start-menu') ||
        e.target.closest('.xp-window')
      ) {
        return;
      }

      e.preventDefault();
      
      const maxX = window.innerWidth - 160 - 4;
      const maxY = window.innerHeight - 150 - 40;
      
      setPosition({
        x: Math.min(e.clientX, maxX),
        y: Math.min(e.clientY, maxY),
      });
      setVisible(true);
    };

    const handleClick = () => {
      if (visible) setVisible(false);
    };

    document.getElementById('desktop')?.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.getElementById('desktop')?.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div 
      className="context-menu" 
      style={{ display: 'block', left: position.x, top: position.y }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="context-menu-item">Arrange Icons</div>
      <div className="context-menu-item" onClick={() => window.location.reload()}>Refresh</div>
      <div className="context-menu-separator"></div>
      <div className="context-menu-item">New →</div>
      <div className="context-menu-separator"></div>
      <div className="context-menu-item" onClick={() => {
        alert('QuoteYourOS v1.0\\nA personal site by Lio\\nhttps://app.lyandoo.online');
        setVisible(false);
      }}>Properties</div>
    </div>
  );
}

export default ContextMenu;
