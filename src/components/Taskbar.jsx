import React, { useEffect, useState } from 'react';

function Taskbar({ windows, focusedWindowId, onWindowClick, toggleStartMenu, startMenuOpen }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes().toString().padStart(2, '0');
      const period = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      setTimeStr(`${h12}:${m} ${period}`);
    };

    updateClock();
    const intervalId = setInterval(updateClock, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div id="taskbar">
      <button 
        id="start-button" 
        className={startMenuOpen ? 'active' : ''} 
        onClick={(e) => {
          e.stopPropagation();
          toggleStartMenu();
        }}
      >
        <span className="start-flag">🪟</span> Start
      </button>
      
      <div id="taskbar-buttons">
        {windows.map((win) => {
          const isActive = win.id === focusedWindowId && !win.isMinimized;
          return (
            <button
              key={win.id}
              className={`taskbar-btn ${isActive ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onWindowClick(win.id);
              }}
            >
              <span className="taskbar-btn-icon">
                {typeof win.icon === 'string' && win.icon.length <= 2 ? win.icon : '📄'}
              </span>
              <span className="taskbar-btn-label" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {win.title}
              </span>
            </button>
          );
        })}
      </div>

      <div id="system-tray">
        <span id="clock">{timeStr}</span>
      </div>
    </div>
  );
}

export default Taskbar;
