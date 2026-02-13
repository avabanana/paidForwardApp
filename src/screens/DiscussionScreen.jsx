import React, { useState } from 'react';

export default function DiscussionScreen() {
  const [posts, setPosts] = useState([
    { id: 1, user: 'Admin', text: 'Welcome to the PaidForward Community! Be kind.', likes: 10 },
    { id: 2, user: 'FutureDev', text: 'Does anyone have a good resource for learning CSS Flexbox?', likes: 3 }
  ]);
  const [newPost, setNewPost] = useState("");

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post = { id: Date.now(), user: 'Anonymous User', text: newPost, likes: 0 };
    setPosts([post, ...posts]);
    setNewPost("");
  };

  return (
    <div style={styles.container}>
      <p style={styles.text}>Ask questions and share experiences with others.</p>
      
      <div style={styles.inputArea}>
        <textarea 
          style={styles.textarea} 
          placeholder="Start a conversation..." 
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button style={styles.postBtn} onClick={handlePost}>Post Message</button>
      </div>

      <div style={styles.feed}>
        {posts.map(post => (
          <div key={post.id} style={styles.postCard}>
            <div style={styles.postHeader}>
              <span style={styles.userName}>@{post.user}</span>
            </div>
            <p style={styles.postText}>{post.text}</p>
            <div style={styles.postActions}>
              <button style={styles.likeBtn}>❤️ {post.likes}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '10px', maxWidth: '800px' },
  text: { color: '#666', marginBottom: '20px' },
  inputArea: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' },
  textarea: { width: '100%', height: '80px', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box' },
  postBtn: { alignSelf: 'flex-end', backgroundColor: '#4A90E2', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' },
  feed: { display: 'flex', flexDirection: 'column', gap: '15px' },
  postCard: { padding: '20px', backgroundColor: '#fefefe', borderRadius: '12px', border: '1px solid #eee' },
  userName: { fontWeight: 'bold', color: '#4A90E2', fontSize: '14px' },
  postText: { margin: '10px 0', fontSize: '16px', color: '#333' },
  likeBtn: { background: 'none', border: 'none', color: '#888', cursor: 'pointer' }
};