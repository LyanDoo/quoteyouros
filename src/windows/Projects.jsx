import React, { useState, useEffect } from 'react';

const FALLBACK_PROJECTS = [
  {
    id: 1,
    name: 'QuoteYourOS',
    icon: '🖥️',
    desc: 'This very site! A Windows XP-themed personal portfolio.',
    tech: 'React, Vite, XP.css',
    url: 'https://lyandoo.online'
  },
  {
    id: 2,
    name: 'Project Bengkel',
    icon: '🔧',
    desc: 'Workshop management system with backoffice features.',
    tech: 'TypeScript, Node.js',
    url: '#'
  },
  {
    id: 3,
    name: 'API Gateway',
    icon: '🚀',
    desc: 'Custom API gateway with auth and rate limiting.',
    tech: 'Node.js, Express',
    url: '#'
  },
  {
    id: 4,
    name: 'Portfolio v1',
    icon: '🎨',
    desc: 'Previous portfolio site (retired).',
    tech: 'React, CSS',
    url: '#'
  },
  {
    id: 5,
    name: 'CLI Toolkit',
    icon: '⌨️',
    desc: 'Collection of command-line utilities.',
    tech: 'Python',
    url: '#'
  },
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function to normalize API response data
const normalizeProject = (project) => {
  return {
    id: project.ID || project.id,
    name: project.Name || project.name,
    icon: project.Icon || project.icon,
    desc: project.Desc || project.desc,
    tech: project.Tech || project.tech,
    url: project.URL || project.url,
  };
};

function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/projects`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        // Extract the data array from the response and normalize each project
        const projectList = (data.data || []).map(normalizeProject);
        // If no projects from API, use fallback
        if (projectList.length === 0) {
          setProjects(FALLBACK_PROJECTS);
        } else {
          setProjects(projectList);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.warn('Backend not reachable, using fallback projects.', error);
        setProjects(FALLBACK_PROJECTS);
        setIsLoading(false);
      });
  }, []);

  if (selectedProject) {
    return (
      <div className="explorer-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <div className="explorer-toolbar">
          <button onClick={() => setSelectedProject(null)}>← Back</button>
          <button>Forward</button>
          <button>Up</button>
        </div>
        <div className="explorer-address-bar">
          <label>Address</label>
          <input type="text" value={`C:\\Users\\Lio\\My Projects\\${selectedProject.name}`} readOnly />
        </div>
        <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '48px' }}>{selectedProject.icon}</span>
            <div>
              <h2 style={{ fontSize: '16px', margin: '0 0 4px' }}>{selectedProject.name}</h2>
              <p style={{ fontSize: '11px', color: '#666' }}>Type: Project Folder</p>
            </div>
          </div>
          <div style={{ background: '#f4f4f0', border: '1px solid #d0d0c0', padding: '12px', borderRadius: '3px', marginBottom: '12px' }}>
            <p style={{ fontSize: '12px', marginBottom: '8px' }}><strong>Description:</strong></p>
            <p style={{ fontSize: '12px', marginBottom: '8px' }}>{selectedProject.desc}</p>
            <p style={{ fontSize: '12px' }}><strong>Technologies:</strong> {selectedProject.tech}</p>
          </div>
          {selectedProject.url !== '#' ? (
            <button onClick={() => window.open(selectedProject.url, '_blank')}>🌐 Open in Browser</button>
          ) : (
            <button disabled>🔒 Private Repository</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="explorer-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div className="explorer-toolbar">
        <button disabled>Back</button>
        <button disabled>Forward</button>
        <button disabled>Up</button>
        <button>Search</button>
        <button>Folders</button>
      </div>
      <div className="explorer-address-bar">
        <label>Address</label>
        <input type="text" value="C:\Users\Lio\My Projects" readOnly />
      </div>
      <div className="explorer-body">
        <div className="explorer-sidebar">
          <div className="explorer-sidebar-section">
            <div className="explorer-sidebar-title">📋 Project Tasks</div>
            <div className="explorer-sidebar-body">
              <span className="explorer-sidebar-link">View all projects</span>
              <span className="explorer-sidebar-link">Recent updates</span>
            </div>
          </div>
          <div className="explorer-sidebar-section">
            <div className="explorer-sidebar-title">📍 Other Places</div>
            <div className="explorer-sidebar-body">
              <span className="explorer-sidebar-link">My Documents</span>
              <span className="explorer-sidebar-link">Desktop</span>
              <span className="explorer-sidebar-link">My Computer</span>
            </div>
          </div>
        </div>
        <div className="explorer-main" style={{ cursor: isLoading ? 'wait' : 'default' }}>
          {isLoading && projects.length === 0 ? (
            <div style={{ padding: '8px' }}>Connecting to server...</div>
          ) : projects.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              <p style={{ fontSize: '14px' }}>📁 No projects found.</p>
              <p style={{ fontSize: '12px', color: '#999' }}>Projects will appear here when added.</p>
            </div>
          ) : (
            projects.map((proj) => (
              <div key={proj.id || proj.name} className="explorer-item" onDoubleClick={() => setSelectedProject(proj)}>
                <div className="explorer-item-icon">{proj.icon}</div>
                <div className="explorer-item-label">{proj.name}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Projects;
