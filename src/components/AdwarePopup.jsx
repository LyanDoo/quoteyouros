import React, { useState } from 'react';

function AdwarePopup({ id, onClose, onFocus, zIndex, imageSrc }) {
  const [isDragging, setIsDragging] = useState(false);
  const [pos, setPos] = useState({ x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 });
  const [size, setSize] = useState({ width: 400, height: 350 });
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left mouse button
    if (e.target.closest('.adware-close-btn')) return; // Don't drag when clicking close

    onFocus();
    setIsDragging(true);
    const startX = e.clientX - pos.x;
    const startY = e.clientY - pos.y;

    const handleMouseMove = (moveEvent) => {
      setPos({
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY,
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex,
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(to bottom, #0a246a, #1084d7)',
        border: '2px solid',
        borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
        boxShadow: '1px 1px 0 #ffffff inset, 1px 1px 0 #dfdfdf',
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          background: 'linear-gradient(to right, #0a246a, #1084d7)',
          padding: '2px 2px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'grab',
          userSelect: 'none',
          borderBottom: '1px solid #dfdfdf',
        }}
      >
        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '11px', paddingLeft: '4px' }}>
          ⚠️ SYSTEM NOTIFICATION
        </span>
        <button
          className="adware-close-btn"
          onClick={() => onClose(id)}
          style={{
            background: 'linear-gradient(to bottom, #dfdfdf, #808080)',
            border: '1px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            padding: '0',
            width: '16px',
            height: '14px',
            marginRight: '2px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '10px',
            color: 'black',
          }}
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          background: '#c0c0c0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '10px',
        }}
      >
        <img
          src={imageSrc}
          alt="Welcome"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          background: '#c0c0c0',
          borderTop: '1px solid #dfdfdf',
          padding: '4px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '4px',
        }}
      >
        <button
          onClick={() => onClose(id)}
          style={{
            background: 'linear-gradient(to bottom, #dfdfdf, #808080)',
            border: '1px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            padding: '3px 12px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '11px',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default AdwarePopup;
