import React, { useState, useEffect } from 'react';

const FALLBACK_RESUME_DATA = {
  name: 'Lio',
  subtitle: 'Software Engineer · app.lyandoo.online',
  summary: 'Passionate software engineer with experience in full-stack web development, backend systems, and creative problem solving. I love building things that are both functional and delightful to use.',
  experience: [
    {
      title: 'Full-Stack Developer',
      date: '2024 - Present',
      company: 'Freelance / Personal Projects',
      highlights: [
        'Built and maintained multiple web applications using TypeScript and Node.js',
        'Developed REST APIs with authentication, rate limiting, and database integration',
        'Deployed and managed applications on personal VPS infrastructure',
        'Created QuoteYourOS — a Windows XP-themed personal portfolio site'
      ]
    },
    {
      title: 'Backend Developer',
      date: '2023 - 2024',
      company: 'Workshop Management System (Project Bengkel)',
      highlights: [
        'Designed and implemented backoffice API for company management',
        'Built subscription and billing system',
        'Implemented sales commission tracking',
        'Worked with TypeScript, Express, and relational databases'
      ]
    }
  ],
  skills: [
    { category: 'Languages', list: 'TypeScript, JavaScript, Python, SQL' },
    { category: 'Frontend', list: 'HTML5, CSS3, React, Vite' },
    { category: 'Backend', list: 'Node.js, Express, REST APIs' },
    { category: 'Databases', list: 'PostgreSQL, MySQL, MongoDB' },
    { category: 'DevOps', list: 'Linux, VPS, Docker, Git' }
  ],
  education: [
    {
      degree: 'Computer Science',
      date: '—',
      details: 'Self-taught + continuous learning through online courses and building projects.'
    }
  ],
  links: [
    { label: 'Website', url: 'https://app.lyandoo.online', display: 'app.lyandoo.online' },
    { label: 'GitHub', url: '#', display: 'github.com/lio' }
  ]
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Resume() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/profile/resume`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((json) => {
        setData(json);
        setIsLoading(false);
      })
      .catch((error) => {
        console.warn('Backend not reachable, using fallback resume data.', error);
        setData(FALLBACK_RESUME_DATA);
        setIsLoading(false);
      });
  }, []);

  const handleDownload = () => {
    window.open(`${API_URL}/api/profile/resume/download`, '_blank');
  };

  if (isLoading || !data) {
    return (
      <div className="wordpad-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <div className="wordpad-toolbar">
          <button disabled>📄 New</button>
          <button disabled>📂 Open</button>
          <button disabled>💾 Save</button>
          <button disabled>🖨️ Print</button>
          <span style={{ flex: 1 }}></span>
          <button disabled>⬇️ Download PDF</button>
        </div>
        <div className="wordpad-body" style={{ flex: 1, overflowY: 'auto', cursor: 'wait' }}>
          <p>Loading resume data from server...</p>
        </div>
      </div>
    );
  }

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
        <select style={{ fontSize: '10px' }} defaultValue="Times New Roman">
          <option>Times New Roman</option>
          <option>Arial</option>
          <option>Tahoma</option>
        </select>
        <select style={{ fontSize: '10px', width: '50px' }} defaultValue="14">
          <option>12</option>
          <option>14</option>
          <option>16</option>
        </select>
        <button style={{ fontWeight: 'bold', fontSize: '10px', padding: '2px 6px' }}>B</button>
        <button style={{ fontStyle: 'italic', fontSize: '10px', padding: '2px 6px' }}>I</button>
        <button style={{ textDecoration: 'underline', fontSize: '10px', padding: '2px 6px' }}>U</button>
      </div>
      <div className="wordpad-body" style={{ flex: 1, overflowY: 'auto' }}>
        <h1>{data.name}</h1>
        <p className="resume-subtitle">{data.subtitle}</p>

        <h2>📋 Summary</h2>
        <p>{data.summary}</p>

        <h2>💼 Experience</h2>
        {data.experience.map((exp, idx) => (
          <div key={idx} className="resume-job">
            <div className="resume-job-header">
              <span className="resume-job-title">{exp.title}</span>
              <span className="resume-job-date">{exp.date}</span>
            </div>
            <h3>{exp.company}</h3>
            <ul>
              {exp.highlights.map((highlight, hIdx) => (
                <li key={hIdx}>{highlight}</li>
              ))}
            </ul>
          </div>
        ))}

        <h2>🛠️ Skills</h2>
        <ul>
          {data.skills.map((skill, idx) => (
            <li key={idx}><strong>{skill.category}:</strong> {skill.list}</li>
          ))}
        </ul>

        <h2>🎓 Education</h2>
        {data.education.map((edu, idx) => (
          <div key={idx} className="resume-job">
            <div className="resume-job-header">
              <span className="resume-job-title">{edu.degree}</span>
              <span className="resume-job-date">{edu.date}</span>
            </div>
            <p>{edu.details}</p>
          </div>
        ))}

        <h2>🌐 Links</h2>
        <ul>
          {data.links.map((link, idx) => (
            <li key={idx}>
              {link.label}: <a href={link.url} target="_blank" rel="noreferrer" style={{ color: '#0066cc' }}>{link.display}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Resume;
