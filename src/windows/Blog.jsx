import React, { useState } from 'react';

const BLOG_POSTS = [
  {
    id: 1,
    title: 'Why I Built a Windows XP Personal Site',
    date: '2026-05-19',
    excerpt: 'A deep dive into the nostalgia-driven decision to build my portfolio as a retro desktop experience.',
    content: (
      <>
        <p>There's something magical about Windows XP. For many of us who grew up in the early 2000s, it was the first operating system we truly used. The iconic "Bliss" wallpaper, the Luna blue theme, the startup sound — these are deeply embedded in our collective digital memory.</p>
        <p>When I decided to rebuild my personal site, I wanted something that would immediately stand out. Not another minimalist single-page portfolio, but something that tells a story about who I am as a developer.</p>
        <p>Building an OS-in-a-browser turned out to be an incredibly fun engineering challenge. Window management, z-index stacking, drag-and-drop — these are problems that real OS developers have to solve, scaled down to a web context.</p>
        <p>The entire site is built with React, Vite, and the excellent XP.css library. It's a great blend of retro styling and modern component architecture.</p>
        <p>I hope you enjoy exploring this site as much as I enjoyed building it! 🎉</p>
      </>
    )
  },
  {
    id: 2,
    title: 'Getting Started with Backend Development',
    date: '2026-05-10',
    excerpt: 'My journey from frontend to full-stack, and tips for developers making the same transition.',
    content: (
      <>
        <p>When I first started coding, I was all about the frontend. HTML, CSS, making things look pretty. But eventually, I hit a wall — I needed data, APIs, databases.</p>
        <p>The jump from frontend to backend was initially intimidating. SQL queries, server architecture, authentication — it felt like learning to code all over again.</p>
        <p>Here are a few tips that helped me:</p>
        <p><strong>1. Start with Node.js</strong> — If you already know JavaScript, Node.js is the natural bridge. You already know the language; you just need to learn the ecosystem.</p>
        <p><strong>2. Build a REST API</strong> — Pick a simple project and build a full CRUD API. A todo app is fine. The point is to understand the request-response cycle.</p>
        <p><strong>3. Learn SQL basics</strong> — ORMs are great, but understanding raw SQL gives you superpowers when debugging.</p>
        <p><strong>4. Deploy early</strong> — Don't wait until your project is "done." Deploy it to a VPS or cloud platform early so you learn the DevOps side too.</p>
      </>
    )
  },
  {
    id: 3,
    title: 'My Development Setup in 2026',
    date: '2026-04-28',
    excerpt: 'A look at my current tools, editor config, and workflow optimizations.',
    content: (
      <>
        <p>Every developer has their own setup, and I love seeing what others use. Here's my current stack:</p>
        <p><strong>Editor:</strong> VS Code with a carefully curated set of extensions. Gemini Code Assist is my AI pair programmer of choice.</p>
        <p><strong>Terminal:</strong> Windows Terminal with PowerShell. I've got a custom prompt that shows git status, Node version, and current project.</p>
        <p><strong>Version Control:</strong> Git, obviously. I use conventional commits and keep my branches clean.</p>
        <p><strong>Hosting:</strong> My own VPS. I like having full control over the server, and it's a great way to learn Linux administration.</p>
        <p><strong>Languages:</strong> TypeScript for everything backend. React for frontend projects. Python for scripting.</p>
        <p>The key to a good setup isn't having the fanciest tools — it's having tools you understand deeply and can customize to your workflow.</p>
      </>
    )
  },
];

function Blog() {
  const [selectedPost, setSelectedPost] = useState(null);

  if (selectedPost) {
    return (
      <div className="ie-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <div className="ie-toolbar">
          <button onClick={() => setSelectedPost(null)}>← Back</button>
          <button disabled>→ Forward</button>
          <button>🔄 Refresh</button>
          <button onClick={() => setSelectedPost(null)}>🏠 Home</button>
        </div>
        <div className="ie-address-bar">
          <label>Address</label>
          <input type="text" value={`https://app.lyandoo.online/blog/${selectedPost.id}`} readOnly />
          <button>Go</button>
        </div>
        <div className="ie-body">
          <button className="blog-back-btn" onClick={() => setSelectedPost(null)}>← Back to posts</button>
          <h1>{selectedPost.title}</h1>
          <p style={{ color: '#666', fontSize: '11px', marginBottom: '16px' }}>📅 {selectedPost.date} · By Lio</p>
          <div className="blog-full-content">
            {selectedPost.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ie-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div className="ie-toolbar">
        <button disabled>← Back</button>
        <button disabled>→ Forward</button>
        <button onClick={() => window.location.reload()}>🔄 Refresh</button>
        <button>🏠 Home</button>
      </div>
      <div className="ie-address-bar">
        <label>Address</label>
        <input type="text" value="https://app.lyandoo.online/blog" readOnly />
        <button>Go</button>
      </div>
      <div className="ie-body">
        <h1>📰 Lio's Blog</h1>
        <p style={{ marginBottom: '16px', color: '#555' }}>Thoughts on code, tech, and building things.</p>
        <div>
          {BLOG_POSTS.map(post => (
            <div key={post.id} className="blog-post-card" onClick={() => setSelectedPost(post)}>
              <h3>{post.title}</h3>
              <div className="blog-date">📅 {post.date}</div>
              <p>{post.excerpt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Blog;
