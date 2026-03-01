import React, { useState, useEffect } from "react";

export default function DiscussionScreen({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [replyText, setReplyText] = useState({}); // Tracking text per post ID

  // 1. Load posts & Listen for changes in other tabs
  useEffect(() => {
    const loadPosts = () => {
      const savedPosts = localStorage.getItem("paidForwardPosts");
      if (savedPosts) setPosts(JSON.parse(savedPosts));
    };

    loadPosts();

    // Sync across tabs/windows
    window.addEventListener("storage", loadPosts);
    return () => window.removeEventListener("storage", loadPosts);
  }, []);

  // 2. Save posts helper
  const savePosts = (updatedPosts) => {
    setPosts(updatedPosts);
    localStorage.setItem("paidForwardPosts", JSON.stringify(updatedPosts));
  };

  const handlePost = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const postObj = {
      id: Date.now(),
      user: currentUser,
      text: newPost,
      timestamp: new Date().toLocaleString(),
      likes: [],
      replies: []
    };

    savePosts([postObj, ...posts]);
    setNewPost("");
  };

  const deletePost = (id) => {
    savePosts(posts.filter((p) => p.id !== id));
  };

  const handleLike = (id) => {
    const updated = posts.map(p => {
      if (p.id === id) {
        const hasLiked = p.likes.includes(currentUser);
        const newLikes = hasLiked 
          ? p.likes.filter(u => u !== currentUser) 
          : [...p.likes, currentUser];
        return { ...p, likes: newLikes };
      }
      return p;
    });
    savePosts(updated);
  };

  const handleReply = (postId) => {
    if (!replyText[postId]?.trim()) return;

    const updated = posts.map(p => {
      if (p.id === postId) {
        const newReply = {
          id: Date.now(),
          user: currentUser,
          text: replyText[postId],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        return { ...p, replies: [...p.replies, newReply] };
      }
      return p;
    });

    savePosts(updated);
    setReplyText({ ...replyText, [postId]: "" }); // Clear input
  };

  return (
    <div style={dStyles.container}>
      <h2 style={dStyles.title}>Community Discussion</h2>
      
      <form onSubmit={handlePost} style={dStyles.postBox}>
        <textarea
          style={dStyles.textarea}
          placeholder="Ask a question or share a win..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button type="submit" style={dStyles.postBtn}>Post</button>
      </form>

      <div style={dStyles.feed}>
        {posts.map((post) => (
          <div key={post.id} style={dStyles.postCard}>
            <div style={dStyles.postHeader}>
              <span style={dStyles.userName}>{post.user}</span>
              <span style={dStyles.time}>{post.timestamp}</span>
            </div>
            <p style={dStyles.postText}>{post.text}</p>
            
            <div style={dStyles.actions}>
              <button 
                onClick={() => handleLike(post.id)} 
                style={{...dStyles.actionLink, color: post.likes.includes(currentUser) ? '#2563eb' : '#64748b'}}
              >
                ❤️ {post.likes.length} {post.likes.includes(currentUser) ? 'Liked' : 'Like'}
              </button>
              
              {post.user === currentUser && (
                <button onClick={() => deletePost(post.id)} style={dStyles.deleteBtn}>Delete</button>
              )}
            </div>

            {/* Replies Section */}
            <div style={dStyles.repliesSection}>
              {post.replies.map(reply => (
                <div key={reply.id} style={dStyles.replyItem}>
                  <span style={dStyles.replyUser}>{reply.user}: </span>
                  <span style={dStyles.replyText}>{reply.text}</span>
                </div>
              ))}
              
              <div style={dStyles.replyInputRow}>
                <input 
                  style={dStyles.replyInput}
                  placeholder="Write a reply..."
                  value={replyText[post.id] || ""}
                  onChange={(e) => setReplyText({...replyText, [post.id]: e.target.value})}
                />
                <button onClick={() => handleReply(post.id)} style={dStyles.replyBtn}>Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const dStyles = {
  container: { maxWidth: '700px', margin: '0 auto' },
  title: { color: '#1e293b', marginBottom: '20px' },
  postBox: { background: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px' },
  textarea: { width: '100%', height: '60px', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', resize: 'none' },
  postBtn: { alignSelf: 'flex-end', padding: '8px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  feed: { display: 'flex', flexDirection: 'column', gap: '20px' },
  postCard: { background: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  postHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  userName: { fontWeight: 'bold', color: '#2563eb' },
  time: { fontSize: '11px', color: '#94a3b8' },
  postText: { color: '#334155', marginBottom: '15px' },
  actions: { display: 'flex', gap: '15px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '10px' },
  actionLink: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  deleteBtn: { background: 'none', border: 'none', color: '#ef4444', fontSize: '13px', cursor: 'pointer' },
  repliesSection: { paddingLeft: '15px', borderLeft: '3px solid #f1f5f9' },
  replyItem: { marginBottom: '8px', fontSize: '14px' },
  replyUser: { fontWeight: 'bold', color: '#475569' },
  replyText: { color: '#64748b' },
  replyInputRow: { display: 'flex', gap: '10px', marginTop: '10px' },
  replyInput: { flex: 1, padding: '6px 12px', borderRadius: '20px', border: '1px solid #e2e8f0', fontSize: '13px' },
  replyBtn: { background: 'none', border: 'none', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }
};