import React, { useState, useEffect, useCallback, useRef } from 'react';
import BootScreen from './components/BootScreen';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';
import ContextMenu from './components/ContextMenu';
import Window from './components/Window';
import AdwarePopup from './components/AdwarePopup';
import { getAppContent, VALID_ROUTES } from './windows/registry';

const ADWARE_IMAGES = ['/adware1.png', '/adware2.png', '/adware3.png'];

function App() {
  const [showBoot, setShowBoot] = useState(true);
  const [windows, setWindows] = useState([]);
  const [focusedWindowId, setFocusedWindowId] = useState(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [zIndexCounter, setZIndexCounter] = useState(100);
  const [windowIdCounter, setWindowIdCounter] = useState(0);
  const [adwarePopups, setAdwarePopups] = useState([]);
  const [adwareZIndex, setAdwareZIndex] = useState(1000);

  // Track whether we're handling a popstate to avoid pushing duplicate history entries
  const isPopstateRef = useRef(false);
  // Store the initial path to open after boot
  const initialPathRef = useRef(window.location.pathname);

  useEffect(() => {
    // Hide boot screen after 3.5 seconds
    const timer = setTimeout(() => {
      setShowBoot(false);
      // Generate 1-2 random adware pop-ups after boot screen
      const numPopups = Math.random() > 0.5 ? 2 : 1;
      const newPopups = [];
      for (let i = 0; i < numPopups; i++) {
        const randomImage = ADWARE_IMAGES[Math.floor(Math.random() * ADWARE_IMAGES.length)];
        newPopups.push({
          id: `adware-${Date.now()}-${i}`,
          zIndex: 1000 + i,
          imageSrc: randomImage,
        });
      }
      setAdwarePopups(newPopups);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Helper: extract route slug from a pathname
  const getRouteSlug = (pathname) => {
    const slug = pathname.replace(/^\/+/, '').replace(/\/+$/, '');
    return slug || null;
  };

  // Helper: update the browser URL without triggering popstate
  const updateUrl = useCallback((path) => {
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  }, []);

  const openApp = useCallback((appModule, icon) => {
    setWindows((prev) => {
      // Check if it's already open
      const existingWindow = prev.find((w) => w.appId === appModule);
      if (existingWindow) {
        // Focus & restore if minimized — handled via setTimeout to avoid batching issues
        setTimeout(() => {
          focusWindow(existingWindow.id);
          if (existingWindow.isMinimized) {
            restoreWindow(existingWindow.id);
          }
        }, 0);
        return prev;
      }

      const appConfig = getAppContent(appModule);
      if (!appConfig) return prev;

      const nextIdCounter = prev.length > 0
        ? Math.max(...prev.map((w) => parseInt(w.id.replace('win-', ''), 10))) + 1
        : 1;
      const newId = `win-${nextIdCounter}`;
      const offset = (nextIdCounter % 10) * 28;

      setZIndexCounter((prevZ) => {
        const newZIndex = prevZ + 1;
        setFocusedWindowId(newId);
        return newZIndex;
      });

      // Update URL to reflect the opened app (unless handling a popstate)
      if (!isPopstateRef.current) {
        updateUrl(`/${appModule}`);
      }

      return [
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
          zIndex: 101 + prev.length,
        },
      ];
    });
  }, [updateUrl]);

  const focusWindow = useCallback((id) => {
    setZIndexCounter((prev) => {
      const newZ = prev + 1;
      setWindows((prevWindows) =>
        prevWindows.map((w) => (w.id === id ? { ...w, zIndex: newZ } : w))
      );
      return newZ;
    });
    setFocusedWindowId(id);

    // Update URL to the focused window's app
    setWindows((prev) => {
      const win = prev.find((w) => w.id === id);
      if (win && !isPopstateRef.current) {
        updateUrl(`/${win.appId}`);
      }
      return prev;
    });
  }, [updateUrl]);

  const minimizeWindow = useCallback((id) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  }, []);

  const restoreWindow = useCallback((id) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: false } : w))
    );
    focusWindow(id);
  }, [focusWindow]);

  const toggleMaximize = useCallback((id) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      )
    );
    focusWindow(id);
  }, [focusWindow]);

  const closeWindow = useCallback((id) => {
    setWindows((prev) => {
      const remaining = prev.filter((w) => w.id !== id);

      // Update URL: if there are remaining windows, show the top one; otherwise go to /
      if (!isPopstateRef.current) {
        if (remaining.length > 0) {
          const topWindow = remaining.reduce((a, b) => (a.zIndex > b.zIndex ? a : b));
          updateUrl(`/${topWindow.appId}`);
          setFocusedWindowId(topWindow.id);
        } else {
          updateUrl('/');
          setFocusedWindowId(null);
        }
      } else {
        if (remaining.length > 0) {
          const topWindow = remaining.reduce((a, b) => (a.zIndex > b.zIndex ? a : b));
          setFocusedWindowId(topWindow.id);
        } else {
          setFocusedWindowId(null);
        }
      }

      return remaining;
    });
  }, [updateUrl]);

  // Open window from initial URL after boot screen finishes
  useEffect(() => {
    if (showBoot) return;

    const slug = getRouteSlug(initialPathRef.current);
    if (slug && VALID_ROUTES[slug]) {
      const route = VALID_ROUTES[slug];
      // Small delay so the desktop renders first
      const timer = setTimeout(() => {
        openApp(route.appModule, route.icon);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showBoot, openApp]);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopstate = () => {
      isPopstateRef.current = true;
      const slug = getRouteSlug(window.location.pathname);

      if (slug && VALID_ROUTES[slug]) {
        const route = VALID_ROUTES[slug];
        // Open the app for this route (openApp handles already-open case)
        openApp(route.appModule, route.icon);
      } else {
        // Path is "/" — we don't close windows on back, just update focus
        // This keeps behavior non-destructive
      }

      // Reset the flag after the current event loop
      setTimeout(() => {
        isPopstateRef.current = false;
      }, 0);
    };

    window.addEventListener('popstate', handlePopstate);
    return () => window.removeEventListener('popstate', handlePopstate);
  }, [openApp]);

  const toggleStartMenu = () => {
    setStartMenuOpen((prev) => !prev);
  };

  const closeStartMenu = () => {
    setStartMenuOpen(false);
  };

  const closeAdwarePopup = (id) => {
    setAdwarePopups((prev) => prev.filter((p) => p.id !== id));
  };

  const focusAdwarePopup = (id) => {
    setAdwareZIndex((prev) => prev + 1);
    setAdwarePopups((prev) =>
      prev.map((p) => (p.id === id ? { ...p, zIndex: adwareZIndex + 1 } : p))
    );
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

          {/* Adware Pop-ups */}
          {adwarePopups.map((popup) => (
            <AdwarePopup
              key={popup.id}
              id={popup.id}
              onClose={closeAdwarePopup}
              onFocus={() => focusAdwarePopup(popup.id)}
              zIndex={popup.zIndex}
              imageSrc={popup.imageSrc}
            />
          ))}

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

