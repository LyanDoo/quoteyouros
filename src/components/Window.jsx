import React from 'react';
import { Rnd } from 'react-rnd';

function Window({ windowData, isFocused, onFocus, onMinimize, onMaximize, onClose }) {
  if (windowData.isMinimized) {
    return null; // or we could render it hidden, but null is cleaner for React
  }

  const { title, icon, width, height, x, y, isMaximized, zIndex, contentComponent: ContentComponent } = windowData;

  // Render a full-screen div if maximized, otherwise use Rnd
  if (isMaximized) {
    return (
      <div
        className={`window xp-window maximized ${isFocused ? '' : 'inactive'}`}
        style={{ zIndex }}
        onMouseDownCapture={onFocus}
      >
        <div className="title-bar" onDoubleClick={onMaximize}>
          <div className="title-bar-text">
            <span className="title-bar-icon-text">
              {typeof icon === 'string' && icon.length <= 2 ? icon : '📄'}
            </span>
            <span>{title}</span>
          </div>
          <div className="title-bar-controls">
            <button aria-label="Minimize" onClick={onMinimize}></button>
            <button aria-label="Restore" onClick={onMaximize}></button>
            <button aria-label="Close" onClick={onClose}></button>
          </div>
        </div>
        <div className="window-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ContentComponent />
        </div>
      </div>
    );
  }

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
      // Since xp-window has absolute position and transitions that might conflict with rnd,
      // react-rnd uses absolute positioning natively.
    >
      <div className="title-bar" onDoubleClick={onMaximize}>
        <div className="title-bar-text">
          <span className="title-bar-icon-text">
            {typeof icon === 'string' && icon.length <= 2 ? icon : '📄'}
          </span>
          <span>{title}</span>
        </div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" onClick={onMinimize}></button>
          <button aria-label="Maximize" onClick={onMaximize}></button>
          <button aria-label="Close" onClick={onClose}></button>
        </div>
      </div>
      <div className="window-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <ContentComponent />
      </div>
    </Rnd>
  );
}

export default Window;
