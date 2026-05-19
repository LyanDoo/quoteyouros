import React, { useState, useEffect } from 'react';
import BootScreen from './components/BootScreen';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';
import ContextMenu from './components/ContextMenu';
import Window from './components/Window';
import { getAppContent } from './windows/registry';

function App() {
  const [showBoot, setShowBoot] = useState(true);
  const [windows, setWindows] = useState([]);
  const [focusedWindowId, setFocusedWindowId] = useState(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [zIndexCounter, setZIndexCounter] = useState(100);
  const [windowIdCounter, setWindowIdCounter] = useState(0);

  useEffect(() => {
    // Hide boot screen after 3.5 seconds
    const timer = setTimeout(() => {
      setShowBoot(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const openApp = (appModule, icon) => {
    // Check if it's already open
    const existingWindow = windows.find((w) => w.appId === appModule);
    if (existingWindow) {
      focusWindow(existingWindow.id);
      if (existingWindow.isMinimized) {
        restoreWindow(existingWindow.id);
      }
      return;
    }

    const appConfig = getAppContent(appModule);
    if (!appConfig) return;

    const newId = `win-${windowIdCounter + 1}`;
    const offset = ((windowIdCounter + 1) % 10) * 28;
    const newZIndex = zIndexCounter + 1;

    setWindowIdCounter((prev) => prev + 1);
    setZIndexCounter(newZIndex);

    setWindows((prev) => [
      ...prev,
      {
        id: newId,
        appId: appModule,
        title: appConfig.title,
        icon: icon,
        width: appConfig.width || 500,
        height: appConfig.height || 400,
        x: 60 + offset,
        y: 30 + offset,
        contentComponent: appConfig.component,
        isMinimized: false,
        isMaximized: false,
        zIndex: newZIndex,
      },
    ]);
    setFocusedWindowId(newId);
  };

  const focusWindow = (id) => {
    setZIndexCounter((prev) => {
      const newZ = prev + 1;
      setWindows((prevWindows) =>
        prevWindows.map((w) => (w.id === id ? { ...w, zIndex: newZ } : w))
      );
      return newZ;
    });
    setFocusedWindowId(id);
  };

  const minimizeWindow = (id) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  };

  const restoreWindow = (id) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: false } : w))
    );
    focusWindow(id);
  };

  const toggleMaximize = (id) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      )
    );
    focusWindow(id);
  };

  const closeWindow = (id) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    if (focusedWindowId === id) {
      setFocusedWindowId(null); // Simple fallback, ideally focus next highest z-index
    }
  };

  const toggleStartMenu = () => {
    setStartMenuOpen((prev) => !prev);
  };

  const closeStartMenu = () => {
    setStartMenuOpen(false);
  };

  return (
    <>
      {showBoot && <BootScreen />}
      
      {!showBoot && (
        <div id="desktop" onClick={closeStartMenu}>
          <Desktop openApp={openApp} />
          
          <ContextMenu />

          <div id="windows-container">
            {windows.map((win) => (
              <Window
                key={win.id}
                windowData={win}
                isFocused={focusedWindowId === win.id}
                onFocus={() => focusWindow(win.id)}
                onMinimize={() => minimizeWindow(win.id)}
                onMaximize={() => toggleMaximize(win.id)}
                onClose={() => closeWindow(win.id)}
              />
            ))}
          </div>

          <StartMenu 
            isOpen={startMenuOpen} 
            closeMenu={closeStartMenu} 
            openApp={openApp} 
          />
          
          <Taskbar
            windows={windows}
            focusedWindowId={focusedWindowId}
            onWindowClick={(id) => {
              const win = windows.find((w) => w.id === id);
              if (win.isMinimized) {
                restoreWindow(id);
              } else if (focusedWindowId === id) {
                minimizeWindow(id);
              } else {
                focusWindow(id);
              }
            }}
            toggleStartMenu={toggleStartMenu}
            startMenuOpen={startMenuOpen}
          />
        </div>
      )}
    </>
  );
}

export default App;
