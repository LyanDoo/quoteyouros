import React from 'react';

function AboutMe() {
  return (
    <div className="notepad-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div className="notepad-menubar">
        <span>File</span>
        <span>Edit</span>
        <span>Format</span>
        <span>View</span>
        <span>Help</span>
      </div>
      <div className="notepad-body" style={{ flex: 1, overflow: 'auto' }}>
{`========================================
         Welcome to Lio's Desktop!
========================================

Hi there! 👋

I'm Lio, a software engineer who loves building 
things that live on the internet.

I created this site as a fun Windows XP-themed 
personal space where you can explore my work, 
read my thoughts, and get in touch.

Feel free to double-click around the desktop 
to discover more about me!

─────────────────────────────────────

🔧 What I do:
  • Full-stack web development
  • Backend systems & APIs
  • Creative side projects

🌐 Find me at:
  • Website: app.lyandoo.online
  • GitHub: github.com/lio

─────────────────────────────────────

Thanks for visiting! 
Have a great day! 🎉

// Last modified: ${new Date().toLocaleDateString()}
// File: about_me.txt
`}
      </div>
    </div>
  );
}

export default AboutMe;
