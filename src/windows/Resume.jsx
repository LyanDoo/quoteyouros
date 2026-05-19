import React from 'react';

function Resume() {
  const handleDownload = () => {
    alert('Resume download feature coming soon!\\nFor now, feel free to screenshot or contact me directly.');
  };

  return (
    <div className="wordpad-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div className="wordpad-toolbar">
        <button>📄 New</button>
        <button>📂 Open</button>
        <button>💾 Save</button>
        <button>🖨️ Print</button>
        <span style={{ flex: 1 }}></span>
        <button onClick={handleDownload}>⬇️ Download PDF</button>
      </div>
      <div className="wordpad-format-bar">
        <select style={{ fontSize: '10px' }}>
          <option>Times New Roman</option>
          <option>Arial</option>
          <option>Tahoma</option>
        </select>
        <select style={{ fontSize: '10px', width: '50px' }}>
          <option>12</option>
          <option>14</option>
          <option>16</option>
        </select>
        <button style={{ fontWeight: 'bold', fontSize: '10px', padding: '2px 6px' }}>B</button>
        <button style={{ fontStyle: 'italic', fontSize: '10px', padding: '2px 6px' }}>I</button>
        <button style={{ textDecoration: 'underline', fontSize: '10px', padding: '2px 6px' }}>U</button>
      </div>
      <div className="wordpad-body" style={{ flex: 1, overflowY: 'auto' }}>
        <h1>Lio</h1>
        <p className="resume-subtitle">
          Software Engineer · app.lyandoo.online
        </p>

        <h2>📋 Summary</h2>
        <p>Passionate software engineer with experience in full-stack web development, 
        backend systems, and creative problem solving. I love building things that are 
        both functional and delightful to use.</p>

        <h2>💼 Experience</h2>
        
        <div className="resume-job">
          <div className="resume-job-header">
            <span className="resume-job-title">Full-Stack Developer</span>
            <span className="resume-job-date">2024 - Present</span>
          </div>
          <h3>Freelance / Personal Projects</h3>
          <ul>
            <li>Built and maintained multiple web applications using TypeScript and Node.js</li>
            <li>Developed REST APIs with authentication, rate limiting, and database integration</li>
            <li>Deployed and managed applications on personal VPS infrastructure</li>
            <li>Created QuoteYourOS — a Windows XP-themed personal portfolio site</li>
          </ul>
        </div>

        <div className="resume-job">
          <div className="resume-job-header">
            <span className="resume-job-title">Backend Developer</span>
            <span className="resume-job-date">2023 - 2024</span>
          </div>
          <h3>Workshop Management System (Project Bengkel)</h3>
          <ul>
            <li>Designed and implemented backoffice API for company management</li>
            <li>Built subscription and billing system</li>
            <li>Implemented sales commission tracking</li>
            <li>Worked with TypeScript, Express, and relational databases</li>
          </ul>
        </div>

        <h2>🛠️ Skills</h2>
        <ul>
          <li><strong>Languages:</strong> TypeScript, JavaScript, Python, SQL</li>
          <li><strong>Frontend:</strong> HTML5, CSS3, React, Vite</li>
          <li><strong>Backend:</strong> Node.js, Express, REST APIs</li>
          <li><strong>Databases:</strong> PostgreSQL, MySQL, MongoDB</li>
          <li><strong>DevOps:</strong> Linux, VPS, Docker, Git</li>
        </ul>

        <h2>🎓 Education</h2>
        <div className="resume-job">
          <div className="resume-job-header">
            <span className="resume-job-title">Computer Science</span>
            <span className="resume-job-date">—</span>
          </div>
          <p>Self-taught + continuous learning through online courses and building projects.</p>
        </div>

        <h2>🌐 Links</h2>
        <ul>
          <li>Website: <a href="https://app.lyandoo.online" style={{ color: '#0066cc' }}>app.lyandoo.online</a></li>
          <li>GitHub: <a href="#" style={{ color: '#0066cc' }}>github.com/lio</a></li>
        </ul>
      </div>
    </div>
  );
}

export default Resume;
