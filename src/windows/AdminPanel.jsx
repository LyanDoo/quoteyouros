import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function AdminPanel() {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeSection, setActiveSection] = useState('blog'); // 'blog' | 'projects' | 'messages'

  // Data states
  const [blogs, setBlogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [galleryList, setGalleryList] = useState([]);
  const [aboutContent, setAboutContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // CRUD Modal states
  const [editorModal, setEditorModal] = useState(null); // null | { type: 'blog'|'project', mode: 'add'|'edit', data: ... }
  const [messageViewModal, setMessageViewModal] = useState(null); // null | message object

  // Fetch data based on active section
  const fetchData = () => {
    if (!token) return;
    setIsLoading(true);
    setStatusMsg('');

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    if (activeSection === 'blog') {
      fetch(`${API_URL}/api/blog`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch blogs');
          return res.json();
        })
        .then(data => {
          // Normalize API response structures
          const list = data.data || data;
          setBlogs(Array.isArray(list) ? list : []);
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setBlogs([]);
          setIsLoading(false);
        });
    } else if (activeSection === 'projects') {
      fetch(`${API_URL}/api/projects`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch projects');
          return res.json();
        })
        .then(data => {
          const list = data.data || data;
          setProjects(Array.isArray(list) ? list : []);
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setProjects([]);
          setIsLoading(false);
        });
    } else if (activeSection === 'messages') {
      fetch(`${API_URL}/api/messages`, { headers })
        .then(res => {
          if (res.status === 401 || res.status === 403) {
            handleLogout();
            throw new Error('Unauthorized');
          }
          if (!res.ok) throw new Error('Failed to fetch messages');
          return res.json();
        })
        .then(data => {
          const list = data.data || data;
          setMessages(Array.isArray(list) ? list : []);
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setMessages([]);
          setIsLoading(false);
        });
    } else if (activeSection === 'about') {
      fetch(`${API_URL}/api/profile/about`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch about me content');
          return res.json();
        })
        .then(data => {
          const text = data.data?.about || data.about || '';
          setAboutContent(text);
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setAboutContent('');
          setIsLoading(false);
        });
    } else if (activeSection === 'gallery') {
      fetch(`${API_URL}/api/gallery`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch gallery items');
          return res.json();
        })
        .then(data => {
          const list = data.data || data;
          setGalleryList(Array.isArray(list) ? list : []);
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setGalleryList([]);
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeSection, token]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Invalid username or password');
        }
        return res.json();
      })
      .then(data => {
        // Assume API returns token in data.token or data.data.token
        const tokenString = data.token || data.data?.token || data.data || '';
        if (!tokenString) throw new Error('Token not returned from API');
        
        localStorage.setItem('admin_token', tokenString);
        setToken(tokenString);
        setLoginForm({ email: '', password: '' });
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoginError(err.message || 'Login failed. Please try again.');
        setIsLoading(false);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken('');
    setBlogs([]);
    setProjects([]);
    setMessages([]);
    setGalleryList([]);
  };

  const handleSaveAbout = (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setStatusMsg('');

    fetch(`${API_URL}/api/profile/about`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ about: aboutContent })
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          handleLogout();
          throw new Error('Unauthorized session. Please login again.');
        }
        if (!res.ok) throw new Error('Save operation failed');
        return res.json();
      })
      .then(() => {
        alert('About Me content updated successfully.');
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert(err.message || 'Operation failed');
        setIsLoading(false);
      });
  };

  // CRUD Operations
  const handleSave = (e) => {
    e.preventDefault();
    if (!editorModal) return;

    const { type, mode, data } = editorModal;
    const isEdit = mode === 'edit';
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit 
      ? `${API_URL}/api/${type}/${data.id || data.ID}`
      : `${API_URL}/api/${type}`;

    setIsLoading(true);
    
    const isGallery = type === 'gallery';
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    if (!isGallery) {
      headers['Content-Type'] = 'application/json';
    }

    let body;
    if (isGallery) {
      const formData = new FormData();
      formData.append('title', data.title || data.Title || '');
      formData.append('Title', data.title || data.Title || '');
      formData.append('description', data.description || data.Description || '');
      formData.append('Description', data.description || data.Description || '');
      if (data.file) {
        formData.append('image', data.file);
        formData.append('Image', data.file);
      } else if (data.image || data.Image) {
        formData.append('image', data.image || data.Image);
        formData.append('Image', data.image || data.Image);
      }
      body = formData;
    } else {
      body = JSON.stringify(data);
    }

    fetch(url, {
      method,
      headers,
      body
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          handleLogout();
          throw new Error('Unauthorized session. Please login again.');
        }
        if (!res.ok) throw new Error('Save operation failed');
        return res.json();
      })
      .then(() => {
        setEditorModal(null);
        fetchData();
      })
      .catch(err => {
        console.error(err);
        alert(err.message || 'Operation failed');
        setIsLoading(false);
      });
  };

  const handleDelete = (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    setIsLoading(true);
    fetch(`${API_URL}/api/${type}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          handleLogout();
          throw new Error('Unauthorized');
        }
        if (!res.ok) throw new Error('Delete operation failed');
        fetchData();
      })
      .catch(err => {
        console.error(err);
        alert(err.message || 'Delete operation failed');
        setIsLoading(false);
      });
  };

  // Format datetime
  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // ==========================================
  // RENDER LOGON SCREEN
  // ==========================================
  if (!token) {
    return (
      <div className="logon-window-container">
        <div className="window logon-window">
          <div className="title-bar logon-title-bar">
            <div className="title-bar-text">Log On to Windows</div>
            <div className="title-bar-controls">
              <button aria-label="Help" disabled></button>
            </div>
          </div>
          <div className="window-body logon-body-content">
            <div className="logon-banner">
              <div className="logon-logo-text">Windows<span>XP</span></div>
              <div className="logon-banner-subtitle">To manage your website console, please enter your credentials.</div>
            </div>
            
            <form onSubmit={handleLogin} className="logon-form">
              <div className="logon-form-fields">
                <div className="logon-field-row">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="logon-field-row">
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {loginError && (
                <div className="logon-error-msg">
                  ❌ {loginError}
                </div>
              )}

              <div className="logon-actions-row">
                <button type="submit" className="logon-btn" disabled={isLoading}>
                  {isLoading ? 'Wait...' : 'OK'}
                </button>
                <button type="button" className="logon-btn" onClick={() => setLoginForm({ email: '', password: '' })} disabled={isLoading}>
                  Clear
                </button>
                <button type="button" className="logon-btn" onClick={handleLogout} disabled={isLoading}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER ADMIN DASHBOARD (CONSOLE ROOT)
  // ==========================================
  return (
    <div className="console-layout">
      {/* Console Menu Bar */}
      <div className="console-menubar">
        <span>File</span>
        <span>Action</span>
        <span>View</span>
        <span>Favorites</span>
        <span>Window</span>
        <span>Help</span>
        <span style={{ flex: 1 }}></span>
        <span onClick={handleLogout} className="console-logoff-link">🚪 Log Off</span>
      </div>

      <div className="console-workspace">
        {/* Left TreeView Navigation */}
        <div className="console-sidebar">
          <div className="console-tree-root">📁 Console Root</div>
          <div className="console-tree-subtree">
            <div className="console-tree-node">
              <span>📁 Administrative Tools</span>
              <div className="console-tree-children">
                <div 
                  className={`console-tree-item ${activeSection === 'blog' ? 'selected' : ''}`}
                  onClick={() => setActiveSection('blog')}
                >
                  📝 Blog Manager
                </div>
                <div 
                  className={`console-tree-item ${activeSection === 'projects' ? 'selected' : ''}`}
                  onClick={() => setActiveSection('projects')}
                >
                  📁 Project Manager
                </div>
                <div 
                  className={`console-tree-item ${activeSection === 'messages' ? 'selected' : ''}`}
                  onClick={() => setActiveSection('messages')}
                >
                  📧 Messages Log
                </div>
                <div 
                  className={`console-tree-item ${activeSection === 'about' ? 'selected' : ''}`}
                  onClick={() => setActiveSection('about')}
                >
                  ℹ️ About Me Manager
                </div>
                <div 
                  className={`console-tree-item ${activeSection === 'gallery' ? 'selected' : ''}`}
                  onClick={() => setActiveSection('gallery')}
                >
                  🖼️ NFT Gallery Manager
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="console-main-panel">
          <div className="console-panel-header">
            <h2>
              {activeSection === 'blog' 
                ? 'Blog Posts' 
                : activeSection === 'projects' 
                ? 'Projects' 
                : activeSection === 'messages' 
                ? 'User Messages' 
                : activeSection === 'about' 
                ? 'About Me Editor' 
                : 'NFT Gallery Manager'}
            </h2>
            {activeSection !== 'messages' && activeSection !== 'about' && (
              <button 
                onClick={() => setEditorModal({
                  type: activeSection,
                  mode: 'add',
                  data: activeSection === 'blog' 
                    ? { title: '', Title: '', date: new Date().toISOString().split('T')[0], Date: new Date().toISOString().split('T')[0], excerpt: '', Excerpt: '', content: '', Content: '' }
                    : activeSection === 'projects'
                    ? { name: '', Name: '', icon: '📂', Icon: '📂', desc: '', Desc: '', tech: '', Tech: '', url: '', URL: '', Url: '' }
                    : { title: '', Title: '', description: '', Description: '', image: '', Image: '' }
                })}
              >
                ➕ New {activeSection === 'blog' ? 'Post' : activeSection === 'projects' ? 'Project' : 'NFT Photo'}
              </button>
            )}
          </div>

          <div className="console-panel-body" style={{ cursor: isLoading ? 'wait' : 'default' }}>
            {isLoading && (
              <div className="console-loading-bar">Connecting to database...</div>
            )}

            {/* BLOG TABLE */}
            {activeSection === 'blog' && (
              <table className="console-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Excerpt</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.length === 0 ? (
                    <tr><td colSpan="4" className="table-empty">No blog posts found.</td></tr>
                  ) : (
                    blogs.map(post => {
                      const id = post.id || post.ID;
                      return (
                        <tr key={id}>
                          <td><strong>{post.title || post.Title}</strong></td>
                          <td>{post.date || post.Date}</td>
                          <td>{post.excerpt || post.Excerpt}</td>
                          <td>
                            <div className="table-actions">
                              <button onClick={() => setEditorModal({ type: 'blog', mode: 'edit', data: post })}>Edit</button>
                              <button onClick={() => handleDelete('blog', id)} className="delete-btn">Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}

            {/* PROJECTS TABLE */}
            {activeSection === 'projects' && (
              <table className="console-table">
                <thead>
                  <tr>
                    <th>Icon</th>
                    <th>Name</th>
                    <th>Technologies</th>
                    <th>URL</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.length === 0 ? (
                    <tr><td colSpan="5" className="table-empty">No projects found.</td></tr>
                  ) : (
                    projects.map(proj => {
                      const id = proj.id || proj.ID;
                      return (
                        <tr key={id}>
                          <td style={{ fontSize: '18px', textAlign: 'center' }}>{proj.icon || proj.Icon}</td>
                          <td><strong>{proj.name || proj.Name}</strong></td>
                          <td>{proj.tech || proj.Tech}</td>
                          <td><a href={proj.url || proj.URL} target="_blank" rel="noreferrer">{proj.url || proj.URL}</a></td>
                          <td>
                            <div className="table-actions">
                              <button onClick={() => setEditorModal({ type: 'projects', mode: 'edit', data: proj })}>Edit</button>
                              <button onClick={() => handleDelete('projects', id)} className="delete-btn">Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}

            {/* MESSAGES TABLE */}
            {activeSection === 'messages' && (
              <table className="console-table">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>Subject</th>
                    <th>Received At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.length === 0 ? (
                    <tr><td colSpan="4" className="table-empty">No messages found.</td></tr>
                  ) : (
                    messages.map(msg => {
                      const id = msg.id || msg.ID;
                      return (
                        <tr key={id} className="clickable-row" onClick={() => setMessageViewModal(msg)}>
                          <td><strong>{msg.FromEmail || msg.from || msg.From}</strong></td>
                          <td>{msg.subject || msg.Subject}</td>
                          <td>{formatDateTime(msg.created_at || msg.CreatedAt)}</td>
                          <td>
                            <button onClick={(e) => { e.stopPropagation(); setMessageViewModal(msg); }}>View</button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}

            {/* ABOUT ME EDITOR */}
            {activeSection === 'about' && (
              <div className="console-about-editor">
                <div style={{ marginBottom: '12px', fontSize: '11px', color: '#555' }}>
                  This text is shown in the <strong>About Me</strong> (Notepad) window on the desktop. Plain text formatting (newlines and tabs) is preserved.
                </div>
                <textarea
                  value={aboutContent}
                  onChange={(e) => setAboutContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Tab') {
                      e.preventDefault();
                      const { selectionStart, selectionEnd } = e.target;
                      const value = e.target.value;
                      const newValue = value.substring(0, selectionStart) + '\t' + value.substring(selectionEnd);
                      setAboutContent(newValue);
                      const target = e.target;
                      setTimeout(() => {
                        target.selectionStart = target.selectionEnd = selectionStart + 1;
                      }, 0);
                    }
                  }}
                  className="console-about-textarea"
                  style={{
                    width: '100%',
                    minHeight: '320px',
                    fontFamily: '"Lucida Console", "Courier New", monospace',
                    fontSize: '12px',
                    padding: '8px',
                    boxSizing: 'border-box',
                    border: '1px solid #7f9db9',
                    resize: 'vertical',
                    backgroundColor: '#fff',
                    color: '#000',
                    lineHeight: '1.5'
                  }}
                />
                <div className="console-about-actions" style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button onClick={handleSaveAbout} disabled={isLoading}>
                    💾 Save Changes
                  </button>
                  <button onClick={fetchData} disabled={isLoading}>
                    🔄 Reload
                  </button>
                </div>
              </div>
            )}

            {/* GALLERY TABLE */}
            {activeSection === 'gallery' && (
              <table className="console-table">
                <thead>
                  <tr>
                    <th>Thumbnail</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {galleryList.length === 0 ? (
                    <tr><td colSpan="4" className="table-empty">No gallery photos found.</td></tr>
                  ) : (
                    galleryList.map(item => {
                      const id = item.id || item.ID;
                      return (
                        <tr key={id}>
                          <td style={{ textAlign: 'center', verticalAlign: 'middle', width: '80px' }}>
                            <img 
                              src={item.image || item.Image || item.image_url || item.ImageUrl} 
                              alt={item.title || item.Title} 
                              style={{ width: '48px', height: '48px', objectFit: 'cover', border: '1px solid #7f9db9' }} 
                            />
                          </td>
                          <td><strong>{item.title || item.Title}</strong></td>
                          <td>{item.description || item.Description}</td>
                          <td>
                            <div className="table-actions">
                              <button onClick={() => setEditorModal({ type: 'gallery', mode: 'edit', data: item })}>Edit</button>
                              <button onClick={() => handleDelete('gallery', id)} className="delete-btn">Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ==========================================
          BLOG/PROJECT EDIT MODAL
          ========================================== */}
      {editorModal && (
        <div className="console-modal-overlay">
          <div className="window console-editor-window">
            <div className="title-bar">
              <div className="title-bar-text">
                {editorModal.mode === 'add' ? 'New' : 'Edit'} {editorModal.type === 'blog' ? 'Blog Post' : 'Project'}
              </div>
              <div className="title-bar-controls">
                <button aria-label="Close" onClick={() => setEditorModal(null)}></button>
              </div>
            </div>
            <div className="window-body">
              <form onSubmit={handleSave} className="console-form">
                {editorModal.type === 'blog' ? (
                  <>
                    <div className="console-form-row">
                      <label>Title:</label>
                      <input 
                        type="text" 
                        value={editorModal.data.title || editorModal.data.Title || ''} 
                        onChange={(e) => setEditorModal({
                          ...editorModal,
                          data: { ...editorModal.data, title: e.target.value, Title: e.target.value }
                        })}
                        required
                      />
                    </div>
                    <div className="console-form-row">
                      <label>Date:</label>
                      <input 
                        type="date" 
                        value={editorModal.data.date || editorModal.data.Date || ''} 
                        onChange={(e) => setEditorModal({
                          ...editorModal,
                          data: { ...editorModal.data, date: e.target.value, Date: e.target.value }
                        })}
                        required
                      />
                    </div>
                    <div className="console-form-row">
                      <label>Excerpt:</label>
                      <input 
                        type="text" 
                        value={editorModal.data.excerpt || editorModal.data.Excerpt || ''} 
                        onChange={(e) => setEditorModal({
                          ...editorModal,
                          data: { ...editorModal.data, excerpt: e.target.value, Excerpt: e.target.value }
                        })}
                        required
                      />
                    </div>
                    <div className="console-form-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                      <label style={{ marginBottom: '4px' }}>Content (HTML allowed):</label>
                      <textarea 
                        value={editorModal.data.content || editorModal.data.Content || ''} 
                        onChange={(e) => setEditorModal({
                          ...editorModal,
                          data: { ...editorModal.data, content: e.target.value, Content: e.target.value }
                        })}
                        onKeyDown={(e) => {
                          if (e.key === 'Tab') {
                            e.preventDefault();
                            const { selectionStart, selectionEnd } = e.target;
                            const value = e.target.value;
                            const newValue = value.substring(0, selectionStart) + '\t' + value.substring(selectionEnd);
                            setEditorModal({
                              ...editorModal,
                              data: {
                                ...editorModal.data,
                                content: newValue,
                                Content: newValue
                              }
                            });
                            // Keep cursor position
                            const target = e.target;
                            setTimeout(() => {
                              target.selectionStart = target.selectionEnd = selectionStart + 1;
                            }, 0);
                          }
                        }}
                        required
                        style={{ minHeight: '180px', fontFamily: 'Courier New, monospace' }}
                      />
                    </div>
                  </>
                ) : editorModal.type === 'projects' ? (
                  <>
                    <div className="console-form-row">
                      <label>Name:</label>
                      <input 
                        type="text" 
                        value={editorModal.data.name || editorModal.data.Name || ''} 
                        onChange={(e) => setEditorModal({
                          ...editorModal,
                          data: { ...editorModal.data, name: e.target.value, Name: e.target.value }
                        })}
                        required
                      />
                    </div>
                    <div className="console-form-row">
                      <label>Icon (Emoji):</label>
                      <input 
                        type="text" 
                        value={editorModal.data.icon || editorModal.data.Icon || ''} 
                        onChange={(e) => setEditorModal({
                          ...editorModal,
                          data: { ...editorModal.data, icon: e.target.value, Icon: e.target.value }
                        })}
                        required
                        maxLength={4}
                      />
                    </div>
                    <div className="console-form-row">
                      <label>Description:</label>
                      <input 
                        type="text" 
                        value={editorModal.data.desc || editorModal.data.Desc || ''} 
                        onChange={(e) => setEditorModal({
                          ...editorModal,
                          data: { ...editorModal.data, desc: e.target.value, Desc: e.target.value }
                        })}
                        required
                      />
                    </div>
                    <div className="console-form-row">
                      <label>Technologies:</label>
                      <input 
                        type="text" 
                        value={editorModal.data.tech || editorModal.data.Tech || ''} 
                        onChange={(e) => setEditorModal({
                          ...editorModal,
                          data: { ...editorModal.data, tech: e.target.value, Tech: e.target.value }
                        })}
                        required
                        placeholder="React, CSS, etc."
                      />
                    </div>
                    <div className="console-form-row">
                      <label>Repository URL:</label>
                      <input 
                        type="text" 
                        value={editorModal.data.url || editorModal.data.URL || editorModal.data.Url || ''} 
                        onChange={(e) => setEditorModal({
                          ...editorModal,
                          data: { ...editorModal.data, url: e.target.value, URL: e.target.value, Url: e.target.value }
                        })}
                        required
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="console-form-row">
                      <label>Title:</label>
                      <input 
                        type="text" 
                        value={editorModal.data.title || editorModal.data.Title || ''} 
                        onChange={(e) => setEditorModal({
                          ...editorModal,
                          data: { ...editorModal.data, title: e.target.value, Title: e.target.value }
                        })}
                        required
                      />
                    </div>
                    <div className="console-form-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                      <label style={{ marginBottom: '4px' }}>NFT Image File:</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const previewUrl = URL.createObjectURL(file);
                            setEditorModal({
                              ...editorModal,
                              data: { 
                                ...editorModal.data, 
                                file: file,
                                previewUrl: previewUrl
                              }
                            });
                          }
                        }}
                        required={editorModal.mode === 'add'}
                      />
                      {editorModal.mode === 'edit' && (
                        <span style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                          * Leave blank to keep existing image.
                        </span>
                      )}
                    </div>
                    {(editorModal.data.previewUrl || editorModal.data.image || editorModal.data.Image) && (
                      <div className="console-form-row" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '10px', color: '#666', marginBottom: '4px' }}>
                          {editorModal.data.file ? 'Selected Image Preview:' : 'Current Image:'}
                        </span>
                        <img 
                          src={editorModal.data.previewUrl || editorModal.data.image || editorModal.data.Image} 
                          alt="Preview" 
                          style={{ maxWidth: '120px', maxHeight: '120px', objectFit: 'contain', border: '1px solid #7f9db9' }} 
                        />
                      </div>
                    )}
                    <div className="console-form-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                      <label style={{ marginBottom: '4px' }}>Description:</label>
                      <textarea 
                        value={editorModal.data.description || editorModal.data.Description || ''} 
                        onChange={(e) => setEditorModal({
                          ...editorModal,
                          data: { ...editorModal.data, description: e.target.value, Description: e.target.value }
                        })}
                        required
                        style={{ minHeight: '80px', fontFamily: 'inherit' }}
                      />
                    </div>
                  </>
                )}

                <div className="console-form-actions">
                  <button type="submit" disabled={isLoading}>Save</button>
                  <button type="button" onClick={() => setEditorModal(null)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MESSAGE DETAIL VIEW MODAL
          ========================================== */}
      {messageViewModal && (
        <div className="console-modal-overlay">
          <div className="window console-message-window" style={{ width: '400px' }}>
            <div className="title-bar">
              <div className="title-bar-text">Message Viewer</div>
              <div className="title-bar-controls">
                <button aria-label="Close" onClick={() => setMessageViewModal(null)}></button>
              </div>
            </div>
            <div className="window-body">
              <div className="msg-viewer-row">
                <strong>From:</strong> <span>{messageViewModal.FromEmail || messageViewModal.from || messageViewModal.From}</span>
              </div>
              <div className="msg-viewer-row">
                <strong>Subject:</strong> <span>{messageViewModal.subject || messageViewModal.Subject}</span>
              </div>
              <div className="msg-viewer-row">
                <strong>Received:</strong> <span>{formatDateTime(messageViewModal.created_at || messageViewModal.CreatedAt)}</span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '12px 0' }} />
              <div className="msg-viewer-body">
                {messageViewModal.message || messageViewModal.Message}
              </div>
              <div className="msg-viewer-actions">
                <button onClick={() => setMessageViewModal(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
