import React, { useState, useEffect } from 'react';

const FALLBACK_BLOG_POSTS = [
  {
    id: 1,
    title: 'Why I Built a Windows XP Personal Site',
    date: '2026-05-19',
    excerpt: 'A deep dive into the nostalgia-driven decision to build my portfolio as a retro desktop experience.',
    content: `<p>There's something magical about Windows XP. For many of us who grew up in the early 2000s, it was the first operating system we truly used. The iconic "Bliss" wallpaper, the Luna blue theme, the startup sound — these are deeply embedded in our collective digital memory.</p>
<p>When I decided to rebuild my personal site, I wanted something that would immediately stand out. Not another minimalist single-page portfolio, but something that tells a story about who I am as a developer.</p>
<p>Building an OS-in-a-browser turned out to be an incredibly fun engineering challenge. Window management, z-index stacking, drag-and-drop — these are problems that real OS developers have to solve, scaled down to a web context.</p>
<p>The entire site is built with React, Vite, and the excellent XP.css library. It's a great blend of retro styling and modern component architecture.</p>
<p>I hope you enjoy exploring this site as much as I enjoyed building it! 🎉</p>`
  },
  {
    id: 2,
    title: 'Getting Started with Backend Development',
    date: '2026-05-10',
    excerpt: 'My journey from frontend to full-stack, and tips for developers making the same transition.',
    content: `<p>When I first started coding, I was all about the frontend. HTML, CSS, making things look pretty. But eventually, I hit a wall — I needed data, APIs, databases.</p>
<p>The jump from frontend to backend was initially intimidating. SQL queries, server architecture, authentication — it felt like learning to code all over again.</p>
<p>Here are a few tips that helped me:</p>
<p><strong>1. Start with Node.js</strong> — If you already know JavaScript, Node.js is the natural bridge. You already know the language; you just need to learn the ecosystem.</p>
<p><strong>2. Build a REST API</strong> — Pick a simple project and build a full CRUD API. A todo app is fine. The point is to understand the request-response cycle.</p>
<p><strong>3. Learn SQL basics</strong> — ORMs are great, but understanding raw SQL gives you superpowers when debugging.</p>
<p><strong>4. Deploy early</strong> — Don't wait until your project is "done." Deploy it to a VPS or cloud platform early so you learn the DevOps side too.</p>`
  },
  {
    id: 3,
    title: 'My Development Setup in 2026',
    date: '2026-04-28',
    excerpt: 'A look at my current tools, editor config, and workflow optimizations.',
    content: `<p>Every developer has their own setup, and I love seeing what others use. Here's my current stack:</p>
<p><strong>Editor:</strong> VS Code with a carefully curated set of extensions. Gemini Code Assist is my AI pair programmer of choice.</p>
<p><strong>Terminal:</strong> Windows Terminal with PowerShell. I've got a custom prompt that shows git status, Node version, and current project.</p>
<p><strong>Version Control:</strong> Git, obviously. I use conventional commits and keep my branches clean.</p>
<p><strong>Hosting:</strong> My own VPS. I like having full control over the server, and it's a great way to learn Linux administration.</p>
<p><strong>Languages:</strong> TypeScript for everything backend. React for frontend projects. Python for scripting.</p>
<p>The key to a good setup isn't having the fanciest tools — it's having tools you understand deeply and can customize to your workflow.</p>`
  },
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function to format ISO datetime to human-readable format
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Helper function to format datetime with time
const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper function to normalize API response data
const normalizeBlogPost = (post) => {
  return {
    id: post.ID || post.id,
    title: post.Title || post.title,
    date: formatDate(post.Date || post.date),
    excerpt: post.Excerpt || post.excerpt,
    content: post.Content || post.content,
  };
};

function Blog() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentForm, setCommentForm] = useState({ authorName: '', authorEmail: '', content: '', rating: 0 });
  const [commentPage, setCommentPage] = useState(1);

  useEffect(() => {
    fetch(`${API_URL}/api/blog`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        // Extract the data array from the response and normalize each post
        const blogPosts = (data.data || []).map(normalizeBlogPost);
        setPosts(blogPosts);
        setIsLoading(false);
      })
      .catch((error) => {
        console.warn('Backend not reachable, using fallback blog posts.', error);
        setPosts(FALLBACK_BLOG_POSTS);
        setIsLoading(false);
      });
  }, []);

  const handlePostClick = (postSummary) => {
    setIsLoading(true);
    setSelectedPost(postSummary); // Set initially to show UI
    setComments([]);
    setCommentPage(1);
    setCommentForm({ authorName: '', authorEmail: '', content: '', rating: 0 });

    fetch(`${API_URL}/api/blog/${postSummary.id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        // Handle both response object with data property and direct post object
        const post = data.data ? normalizeBlogPost(data.data) : normalizeBlogPost(data);
        setSelectedPost(post);
        setIsLoading(false);
        // Fetch comments for this post
        fetchComments(postSummary.id, 1);
      })
      .catch((error) => {
        console.warn('Backend not reachable, using fallback post detail.', error);
        const fallbackDetail = FALLBACK_BLOG_POSTS.find(p => p.id === postSummary.id);
        setSelectedPost(fallbackDetail || postSummary);
        setIsLoading(false);
      });
  };

  const fetchComments = (postId, page = 1) => {
    setCommentsLoading(true);
    fetch(`${API_URL}/api/blog/${postId}/comments?page=${page}&limit=10`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch comments');
        return res.json();
      })
      .then((data) => {
        setComments(data.data?.comments || []);
        setCommentPage(page);
        setCommentsLoading(false);
      })
      .catch((error) => {
        console.warn('Failed to load comments.', error);
        setComments([]);
        setCommentsLoading(false);
      });
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!commentForm.content.trim()) return;

    fetch(`${API_URL}/api/blog/${selectedPost.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        author_name: commentForm.authorName || 'Anonymous',
        author_email: commentForm.authorEmail || null,
        content: commentForm.content,
        rating: commentForm.rating || null
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to post comment');
        return res.json();
      })
      .then(() => {
        setCommentForm({ authorName: '', authorEmail: '', content: '', rating: 0 });
        fetchComments(selectedPost.id, 1);
      })
      .catch((error) => {
        console.warn('Failed to post comment.', error);
        alert('Failed to post comment. Please try again.');
      });
  };

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
          <input type="text" value={`https://lyandoo.online/blog/${selectedPost.id}`} readOnly />
          <button>Go</button>
        </div>
        <div className="ie-body" style={{ cursor: isLoading ? 'wait' : 'default' }}>
          <button className="blog-back-btn" onClick={() => setSelectedPost(null)}>← Back to posts</button>
          <h1>{selectedPost.title}</h1>
          <p className="blog-meta">📅 {selectedPost.date} · By Lyandoo</p>
          <div
            className="blog-full-content"
            dangerouslySetInnerHTML={{ __html: selectedPost.content || '<p>Loading content...</p>' }}
          />

          {/* Comments Section */}
          <hr className="blog-divider" />
          <div className="blog-comments-section">
            <h2 className="blog-comments-title">💬 Comments ({comments.length})</h2>

            {/* Post Comment Form */}
            <div className="blog-comment-form-container">
              <h3 className="blog-comment-form-title">Leave a Comment</h3>
              <form onSubmit={handlePostComment}>
                <input
                  type="text"
                  placeholder="Your Name (optional)"
                  value={commentForm.authorName}
                  onChange={(e) => setCommentForm({ ...commentForm, authorName: e.target.value })}
                  className="blog-comment-input"
                />
                <input
                  type="email"
                  placeholder="Your Email (optional)"
                  value={commentForm.authorEmail}
                  onChange={(e) => setCommentForm({ ...commentForm, authorEmail: e.target.value })}
                  className="blog-comment-input"
                />
                <textarea
                  placeholder="Your comment..."
                  value={commentForm.content}
                  onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                  required
                  className="blog-comment-textarea"
                />
                <div className="blog-comment-rating-container">
                  <label>Rating:</label>
                  <div className="blog-comment-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setCommentForm({ ...commentForm, rating: star })}
                        className={`blog-comment-star-btn ${commentForm.rating >= star ? 'active' : ''}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="blog-comment-submit-btn"
                >
                  Post Comment
                </button>
              </form>
            </div>

            {/* Comments List */}
            {commentsLoading ? (
              <p className="blog-comments-loading">Loading comments...</p>
            ) : comments.length === 0 ? (
              <p className="blog-comments-empty">No comments yet. Be the first to comment!</p>
            ) : (
              <div className="blog-comments-list">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="blog-comment-item"
                  >
                    <div className="blog-comment-header">
                      <strong className="blog-comment-author">{comment.author_name}</strong>
                      <span className="blog-comment-time">{formatDateTime(comment.created_at)}</span>
                    </div>
                    {comment.rating && (
                      <div className="blog-comment-rating-stars">
                        {'★'.repeat(comment.rating)}<span className="star-inactive">{'★'.repeat(5 - comment.rating)}</span>
                      </div>
                    )}
                    <p className="blog-comment-content">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
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
        <input type="text" value="https://lyandoo.online/blog" readOnly />
        <button>Go</button>
      </div>
      <div className="ie-body" style={{ cursor: isLoading ? 'wait' : 'default' }}>
        <h1>📰 Log Dumped</h1>
        <p style={{ marginBottom: '16px', color: '#555' }}>At the intersection of tech, arts, and society</p>

        {isLoading && posts.length === 0 ? (
          <p>Connecting to server...</p>
        ) : posts.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            <p style={{ fontSize: '14px' }}>📝 No blog posts yet.</p>
            <p style={{ fontSize: '12px', color: '#999' }}>Check back soon for new content!</p>
          </div>
        ) : (
          <div>
            {posts.map(post => (
              <div key={post.id} className="blog-post-card" onClick={() => handlePostClick(post)}>
                <h3>{post.title}</h3>
                <div className="blog-date">📅 {post.date}</div>
                <p>{post.excerpt}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Blog;
