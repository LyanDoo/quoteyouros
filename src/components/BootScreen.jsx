import React from 'react';

function BootScreen() {
  return (
    <div id="boot-screen">
      <div className="boot-logo">
        <div className="boot-windows-flag">
          <span className="flag-red"></span>
          <span className="flag-green"></span>
          <span className="flag-blue"></span>
          <span className="flag-yellow"></span>
        </div>
        <div className="boot-text">
          <span className="boot-microsoft">Microsoft</span>
          <span className="boot-windows-text">Windows</span>
          <span className="boot-xp">XP</span>
        </div>
      </div>
      <div className="boot-progress">
        <div className="boot-progress-bar"></div>
      </div>
    </div>
  );
}

export default BootScreen;
