import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= breakpoint);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [breakpoint]);

  return isMobile;
}

function TitleBar({ title, icon, isMaximized, isMobile, onMinimize, onMaximize, onClose }) {
  return (
    <div className="title-bar" onDoubleClick={!isMobile ? onMaximize : undefined}>
      <div className="title-bar-text">
        <span className="title-bar-icon-text">
          {typeof icon === 'string' && icon.length <= 2 ? icon : '📄'}
        </span>
        <span>{title}</span>
      </div>
      <div className="title-bar-controls">
        <button aria-label="Minimize" onClick={onMinimize}></button>
        {!isMobile && (
          <button aria-label={isMaximized ? 'Restore' : 'Maximize'} onClick={onMaximize}></button>
        )}
        <button aria-label="Close" onClick={onClose}></button>
      </div>
    </div>
  );
}

function Window({ windowData, isFocused, onFocus, onMinimize, onMaximize, onClose }) {
  const isMobile = useIsMobile();

  if (windowData.isMinimized) {
    return null;
  }

  const { title, icon, width, height, x, y, isMaximized, zIndex, contentComponent: ContentComponent } = windowData;

  // --- Mobile: always render as a full-screen-like panel (no drag/resize) ---
  if (isMobile) {
    return (
      <div
        className={`window xp-window mobile-window ${isFocused ? '' : 'inactive'}`}
        style={{ zIndex }}
        onMouseDownCapture={onFocus}
        onTouchStartCapture={onFocus}
      >
        <TitleBar
          title={title}
          icon={icon}
          isMaximized={true}
          isMobile={true}
          onMinimize={onMinimize}
          onMaximize={onMaximize}
          onClose={onClose}
        />
        <div className="window-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ContentComponent />
        </div>
      </div>
    );
  }

  // --- Desktop: maximized ---
  if (isMaximized) {
    return (
      <div
        className={`window xp-window maximized ${isFocused ? '' : 'inactive'}`}
        style={{ zIndex }}
        onMouseDownCapture={onFocus}
      >
        <TitleBar
          title={title}
          icon={icon}
          isMaximized={true}
          isMobile={false}
          onMinimize={onMinimize}
          onMaximize={onMaximize}
          onClose={onClose}
        />
        <div className="window-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ContentComponent />
        </div>
      </div>
    );
  }

  // --- Desktop: normal windowed mode with drag/resize ---
  return (
    <Rnd
      default={{ x, y, width, height }}
      minWidth={250}
      minHeight={150}
      bounds="parent"
      dragHandleClassName="title-bar"
      onMouseDownCapture={onFocus}
      style={{ zIndex, display: 'flex', flexDirection: 'column' }}
      className={`window xp-window ${isFocused ? '' : 'inactive'}`}
    >
      <TitleBar
        title={title}
        icon={icon}
        isMaximized={false}
        isMobile={false}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onClose={onClose}
      />
      <div className="window-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <ContentComponent />
      </div>
    </Rnd>
  );
}

export default Window;
