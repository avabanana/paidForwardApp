import React, { useState, useEffect } from "react";
import { db } from '../firebase'; 
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  orderBy, 
  serverTimestamp, 
  doc, 
  deleteDoc, 
  updateDoc 
} from "firebase/firestore";

export default function DiscussionScreen({ currentUser, streak = 0 }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [showMine, setShowMine] = useState(false);
  const [replyText, setReplyText] = useState({}); 

  // Sync with Firestore in real-time
  useEffect(() => {
    const q = query(collection(db, "discussions"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Handle Firestore timestamps vs local strings
          timestamp: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleString() : "Just now",
          likes: data.likes || [],
          reactions: data.reactions || { thumbs: [], laugh: [] },
          replies: data.replies || []
        };
      });
      setPosts(fetchedPosts);
    });

    return () => unsubscribe();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    await addDoc(collection(db, "discussions"), {
      user: currentUser || "Ava",
      text: newPost,
      createdAt: serverTimestamp(),
      likes: [],
      reactions: { thumbs: [], laugh: [] },
      replies: []
    });

    setNewPost("");
  };

  const deletePost = async (id) => {
    await deleteDoc(doc(db, "discussions", id));
  };

  const toggleReaction = async (id, type) => {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    let updates = {};
    if (type === 'like') {
      const hasLiked = post.likes.includes(currentUser);
      updates.likes = hasLiked
        ? post.likes.filter(u => u !== currentUser)
        : [...post.likes, currentUser];
    } else {
      const reactions = post.reactions;
      const current = reactions[type] || [];
      const hasReacted = current.includes(currentUser);
      updates.reactions = {
        ...reactions,
        [type]: hasReacted ? current.filter(u => u !== currentUser) : [...current, currentUser]
      };
    }

    await updateDoc(doc(db, "discussions", id), updates);
  };

  const handleReply = async (postId) => {
    if (!replyText[postId]?.trim()) return;

    const post = posts.find(p => p.id === postId);
    const newReply = {
      id: Date.now(),
      user: currentUser || "Ava",
      text: replyText[postId],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    await updateDoc(doc(db, "discussions", postId), {
      replies: [...post.replies, newReply]
    });

    setReplyText({ ...replyText, [postId]: "" });
  };

  const visiblePosts = showMine ? posts.filter((p) => p.user === currentUser) : posts;

  return (
    <div style={dStyles.container}>
      <h2 style={dStyles.title}>Community Discussion</h2>
      <div style={dStyles.topRow}>
        <span style={dStyles.subText}>Share questions, tips, and wins with others.</span>
        <button style={dStyles.toggleBtn} onClick={() => setShowMine((prev) => !prev)}>
          {showMine ? 'Show all posts' : 'Show my posts'}
        </button>
      </div>

      <form onSubmit={handlePost} style={dStyles.postBox}>
        <textarea
          style={dStyles.textarea}
          placeholder="Ask a question or share a win..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button type="submit" style={dStyles.postBtn}>Post as {currentUser || "Ava"}</button>
      </form>

      <div style={dStyles.feed}>
        {visiblePosts.length === 0 ? (
          <div style={dStyles.emptyState}>
            <p style={{ margin: 0 }}>No posts yet.</p>
            <p style={{ margin: 0, color: '#64748b' }}>
              {showMine ? 'Create a post to see it here.' : 'Be the first to post!' }
            </p>
          </div>
        ) : (
          visiblePosts.map((post) => (
            <div key={post.id} style={dStyles.postCard}>
              <div style={dStyles.postHeader}>
                <span style={dStyles.userName}>
                  {post.user}
                  {post.user === currentUser && streak > 1 && (
                    <span style={dStyles.streakTag}> 🔥{streak}</span>
                  )}
                </span>
                <span style={dStyles.time}>{post.timestamp}</span>
              </div>
              <p style={dStyles.postText}>{post.text}</p>

              <div style={dStyles.actions}>
                <button
                  onClick={() => toggleReaction(post.id, 'like')}
                  style={{ ...dStyles.actionLink, color: post.likes.includes(currentUser) ? '#2563eb' : '#64748b' }}
                >
                  ❤️ {post.likes.length} {post.likes.includes(currentUser) ? 'Liked' : 'Like'}
                </button>

                <button
                  onClick={() => toggleReaction(post.id, 'thumbs')}
                  style={{ ...dStyles.actionLink, color: (post.reactions?.thumbs || []).includes(currentUser) ? '#2563eb' : '#64748b' }}
                >
                  👍 {(post.reactions?.thumbs || []).length}
                </button>

                <button
                  onClick={() => toggleReaction(post.id, 'laugh')}
                  style={{ ...dStyles.actionLink, color: (post.reactions?.laugh || []).includes(currentUser) ? '#2563eb' : '#64748b' }}
                >
                  😂 {(post.reactions?.laugh || []).length}
                </button>

                {post.user === currentUser && (
                  <button onClick={() => deletePost(post.id)} style={dStyles.deleteBtn}>Delete</button>
                )}
              </div>

              <div style={dStyles.repliesSection}>
                {post.replies.map((reply) => (
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
                    onChange={(e) => setReplyText({ ...replyText, [post.id]: e.target.value })}
                  />
                  <button onClick={() => handleReply(post.id)} style={dStyles.replyBtn}>Reply</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const dStyles = {
  container: { maxWidth: '700px', margin: '0 auto' },
  title: { color: '#1e293b', marginBottom: '20px' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  subText: { color: '#64748b', fontSize: '14px' },
  toggleBtn: { background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '999px', padding: '6px 14px', cursor: 'pointer', fontSize: '12px' },
  postBox: { background: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px' },
  // FIX: Added boxSizing and width
  textarea: { width: '100%', height: '80px', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', resize: 'none', boxSizing: 'border-box' },
  postBtn: { alignSelf: 'flex-end', padding: '8px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  feed: { display: 'flex', flexDirection: 'column', gap: '20px' },
  postCard: { background: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  postHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  userName: { fontWeight: 'bold', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '6px' },
  streakTag: { fontSize: '12px', background: '#ffedd5', color: '#c2410c', padding: '2px 6px', borderRadius: '10px', marginLeft: '6px' },
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
  // FIX: Added boxSizing
  replyInput: { flex: 1, padding: '8px 12px', borderRadius: '20px', border: '1px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' },
  replyBtn: { background: 'none', border: 'none', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' },
  emptyState: { padding: '30px', textAlign: 'center', color: '#64748b', border: '1px dashed #cbd5e1', borderRadius: '16px' }
};