import React, { useState } from 'react';

const ICON_DATA = [
  { id: 'about', label: 'LyanDoo.txt', icon: '📝', appModule: 'about-me' },
  { id: 'projects', label: 'My Projects', icon: '📁', appModule: 'projects' },
  { id: 'blog', label: 'Blog', icon: '🌐', appModule: 'blog' },
  { id: 'resume', label: 'Resume.doc', icon: '📄', appModule: 'resume' },
  { id: 'contact', label: 'Contact Me', icon: '📧', appModule: 'contact' },
  { id: 'admin', label: 'Administrative Tools', icon: '⚙️', appModule: 'admin' },
  { id: 'recycle', label: 'Recycle Bin', icon: '🗑️', appModule: null },
];

function DraggableIcon({ data, openApp, isSelected, onSelect }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastTapRef = React.useRef(0);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left mouse button

    e.stopPropagation();
    onSelect(data.id);

    const startX = e.clientX - pos.x;
    const startY = e.clientY - pos.y;
    let dragged = false;

    const handleMouseMove = (moveEvent) => {
      dragged = true;
      setIsDragging(true);
      setPos({
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY,
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      if (dragged) {
        // Snap to an invisible 74x74 grid relative to original position
        setPos((current) => ({
          x: Math.round(current.x / 74) * 74,
          y: Math.round(current.y / 74) * 74,
        }));
      }

      setTimeout(() => setIsDragging(false), 50);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handle touch-based double-tap for mobile (since onDoubleClick doesn't work reliably on touch)
  const handleTouchEnd = (e) => {
    e.stopPropagation();
    onSelect(data.id);

    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // Double-tap detected — open the app
      if (data.appModule) {
        openApp(data.appModule, data.icon);
      }
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  return (
    <div
      className={`desktop-icon ${isSelected ? 'selected' : ''}`}
      onMouseDown={handleMouseDown}
      onDoubleClick={(e) => {
        e.stopPropagation();
        if (data.appModule) {
          openApp(data.appModule, data.icon);
        }
      }}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        zIndex: isDragging ? 10 : 1,
        pointerEvents: 'auto', // override parent pointer-events: none
      }}
    >
      <div
        className="desktop-icon-img"
        style={{
          fontSize: '40px',
          lineHeight: '48px',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {data.icon}
      </div>
      <div className="desktop-icon-label">{data.label}</div>
    </div>
  );
}

function Desktop({ openApp }) {
  const [selectedIconId, setSelectedIconId] = useState(null);

  const handleDesktopClick = (e) => {
    // Deselect if clicking directly on the desktop background
    if (e.target.id === 'desktop' || e.target.id === 'desktop-icons') {
      setSelectedIconId(null);
    }
  };

  return (
    <div id="desktop-icons" onClick={handleDesktopClick}>
      {ICON_DATA.map((data) => (
        <DraggableIcon
          key={data.id}
          data={data}
          openApp={openApp}
          isSelected={selectedIconId === data.id}
          onSelect={setSelectedIconId}
        />
      ))}
    </div>
  );
}

export default Desktop;
