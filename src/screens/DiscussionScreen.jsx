import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";

export default function DiscussionScreen({ currentUser, streak = 0, db, userId }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [showMine, setShowMine] = useState(false);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "discussion_posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPosts(data);
      setLoading(false);
    });
    return () => unsub();
  }, [db]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !db) return;
    await addDoc(collection(db, "discussion_posts"), {
      user: currentUser || "Guest",
      userId: userId || "",
      text: newPost.trim(),
      createdAt: serverTimestamp(),
      likes: [],
      reactions: { thumbs: [], laugh: [] },
      replies: []
    });
    setNewPost("");
  };

  const deletePost = async (postId) => {
    if (!db) return;
    await deleteDoc(doc(db, "discussion_posts", postId));
  };

  const toggleReaction = async (postId, type, currentReactions) => {
    if (!db) return;
    const postRef = doc(db, "discussion_posts", postId);
    const field = type === "like" ? "likes" : `reactions.${type}`;
    const arr = type === "like"
      ? (currentReactions.likes || [])
      : (currentReactions.reactions?.[type] || []);
    const hasReacted = arr.includes(currentUser);
    await updateDoc(postRef, {
      [field]: hasReacted ? arrayRemove(currentUser) : arrayUnion(currentUser)
    });
  };

  const handleReply = async (postId, currentReplies) => {
    const text = replyText[postId]?.trim();
    if (!text || !db) return;
    const newReply = {
      id: Date.now(),
      user: currentUser || "Guest",
      userId: userId || "",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    const postRef = doc(db, "discussion_posts", postId);
    await updateDoc(postRef, { replies: [...(currentReplies || []), newReply] });
    setReplyText((prev) => ({ ...prev, [postId]: "" }));
  };

  const deleteReply = async (postId, replyId, currentReplies) => {
    if (!db) return;
    const postRef = doc(db, "discussion_posts", postId);
    await updateDoc(postRef, {
      replies: (currentReplies || []).filter((r) => r.id !== replyId)
    });
  };

  const visiblePosts = showMine ? posts.filter((p) => p.user === currentUser) : posts;

  return (
    <div style={dStyles.container}>
      <h2 style={dStyles.title}>💬 Community Discussion</h2>
      <div style={dStyles.topRow}>
        <span style={dStyles.subText}>Share questions, tips, and wins with others.</span>
        <button style={dStyles.toggleBtn} onClick={() => setShowMine((p) => !p)}>
          {showMine ? "Show all posts" : "Show my posts"}
        </button>
      </div>

      <form onSubmit={handlePost} style={dStyles.postBox}>
        <div style={dStyles.postInputHeader}>
          <span style={dStyles.postingAs}>Posting as <strong>{currentUser || "Guest"}</strong></span>
        </div>
        <textarea
          style={dStyles.textarea}
          placeholder="Ask a question or share a win..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button type="submit" style={dStyles.postBtn}>Post</button>
      </form>

      <div style={dStyles.feed}>
        {loading ? (
          <div style={dStyles.emptyState}><p>Loading posts...</p></div>
        ) : visiblePosts.length === 0 ? (
          <div style={dStyles.emptyState}>
            <p style={{ margin: 0 }}>No posts yet.</p>
            <p style={{ margin: 0, color: "#64748b" }}>
              {showMine ? "Create a post to see it here." : "Be the first to post!"}
            </p>
          </div>
        ) : (
          visiblePosts.map((post) => (
            <div key={post.id} style={dStyles.postCard}>
              <div style={dStyles.postHeader}>
                <div style={dStyles.userInfo}>
                  <span style={dStyles.userAvatar}>{(post.user || "G")[0].toUpperCase()}</span>
                  <div>
                    <span style={dStyles.userName}>{post.user}</span>
                    {post.user === currentUser && streak > 1 && (
                      <span style={dStyles.streakTag}>🔥 {streak}</span>
                    )}
                    {post.user === currentUser && (
                      <span style={dStyles.youBadge}>you</span>
                    )}
                  </div>
                </div>
                <span style={dStyles.time}>
                  {post.createdAt?.toDate
                    ? post.createdAt.toDate().toLocaleString()
                    : "just now"}
                </span>
              </div>

              <p style={dStyles.postText}>{post.text}</p>

              <div style={dStyles.actions}>
                <button
                  onClick={() => toggleReaction(post.id, "like", post)}
                  style={{
                    ...dStyles.actionLink,
                    color: (post.likes || []).includes(currentUser) ? "#e11d48" : "#64748b"
                  }}
                >
                  ❤️ {(post.likes || []).length}
                </button>
                <button
                  onClick={() => toggleReaction(post.id, "thumbs", post)}
                  style={{
                    ...dStyles.actionLink,
                    color: (post.reactions?.thumbs || []).includes(currentUser) ? "#2563eb" : "#64748b"
                  }}
                >
                  👍 {(post.reactions?.thumbs || []).length}
                </button>
                <button
                  onClick={() => toggleReaction(post.id, "laugh", post)}
                  style={{
                    ...dStyles.actionLink,
                    color: (post.reactions?.laugh || []).includes(currentUser) ? "#d97706" : "#64748b"
                  }}
                >
                  😂 {(post.reactions?.laugh || []).length}
                </button>
                {post.user === currentUser && (
                  <button onClick={() => deletePost(post.id)} style={dStyles.deleteBtn}>
                    🗑 Delete
                  </button>
                )}
              </div>

              <div style={dStyles.repliesSection}>
                {(post.replies || []).map((reply) => (
                  <div key={reply.id} style={dStyles.replyItem}>
                    <span style={dStyles.replyUser}>{reply.user}</span>
                    {reply.user === currentUser && (
                      <span style={dStyles.youBadgeSmall}>you</span>
                    )}
                    <span style={dStyles.replySep}>·</span>
                    <span style={dStyles.replyText}>{reply.text}</span>
                    {reply.user === currentUser && (
                      <button
                        onClick={() => deleteReply(post.id, reply.id, post.replies)}
                        style={dStyles.replyDeleteBtn}
                      >
                        delete
                      </button>
                    )}
                  </div>
                ))}

                <div style={dStyles.replyInputRow}>
                  <input
                    style={dStyles.replyInput}
                    placeholder={`Reply as ${currentUser || "Guest"}...`}
                    value={replyText[post.id] || ""}
                    onChange={(e) =>
                      setReplyText((prev) => ({ ...prev, [post.id]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleReply(post.id, post.replies);
                    }}
                  />
                  <button
                    onClick={() => handleReply(post.id, post.replies)}
                    style={dStyles.replyBtn}
                  >
                    Reply
                  </button>
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
  container: { maxWidth: "700px", margin: "0 auto", fontFamily: "'Inter', system-ui, sans-serif" },
  title: { color: "#1e293b", marginBottom: "20px", fontSize: "28px" },
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
  subText: { color: "#64748b", fontSize: "14px" },
  toggleBtn: {
    background: "#f1f5f9", border: "1px solid #e2e8f0",
    borderRadius: "999px", padding: "6px 14px", cursor: "pointer", fontSize: "12px", fontWeight: "600"
  },
  postBox: {
    background: "#fff", padding: "20px", borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)", marginBottom: "28px",
    display: "flex", flexDirection: "column", gap: "10px"
  },
  postInputHeader: { display: "flex", alignItems: "center" },
  postingAs: { fontSize: "13px", color: "#64748b" },
  textarea: {
    width: "100%", height: "70px", padding: "12px",
    borderRadius: "10px", border: "1px solid #e2e8f0",
    resize: "none", fontSize: "14px", fontFamily: "inherit",
    boxSizing: "border-box"
  },
  postBtn: {
    alignSelf: "flex-end", padding: "9px 22px",
    background: "#2563eb", color: "#fff", border: "none",
    borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "14px"
  },
  feed: { display: "flex", flexDirection: "column", gap: "18px" },
  postCard: {
    background: "#fff", padding: "20px", borderRadius: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9"
  },
  postHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" },
  userInfo: { display: "flex", alignItems: "center", gap: "10px" },
  userAvatar: {
    width: "34px", height: "34px", borderRadius: "50%",
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "800", fontSize: "14px", flexShrink: 0
  },
  userName: { fontWeight: "700", color: "#1e293b", fontSize: "14px" },
  streakTag: {
    fontSize: "11px", background: "#ffedd5", color: "#c2410c",
    padding: "2px 6px", borderRadius: "8px", marginLeft: "6px"
  },
  youBadge: {
    fontSize: "10px", background: "#dbeafe", color: "#1d4ed8",
    padding: "2px 6px", borderRadius: "8px", marginLeft: "6px", fontWeight: "700"
  },
  youBadgeSmall: {
    fontSize: "10px", background: "#dbeafe", color: "#1d4ed8",
    padding: "1px 5px", borderRadius: "6px", marginLeft: "4px", fontWeight: "700"
  },
  time: { fontSize: "11px", color: "#94a3b8" },
  postText: { color: "#334155", marginBottom: "14px", lineHeight: "1.6", fontSize: "15px" },
  actions: {
    display: "flex", gap: "12px", borderBottom: "1px solid #f1f5f9",
    paddingBottom: "10px", marginBottom: "10px", flexWrap: "wrap"
  },
  actionLink: {
    background: "none", border: "none", cursor: "pointer",
    fontSize: "13px", fontWeight: "600", padding: "2px 4px"
  },
  deleteBtn: {
    background: "none", border: "none", color: "#ef4444",
    fontSize: "13px", cursor: "pointer", fontWeight: "600", marginLeft: "auto"
  },
  repliesSection: { paddingLeft: "14px", borderLeft: "3px solid #f1f5f9" },
  replyItem: {
    marginBottom: "8px", fontSize: "13px",
    display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px"
  },
  replyUser: { fontWeight: "700", color: "#475569" },
  replySep: { color: "#cbd5e1" },
  replyText: { color: "#64748b" },
  replyInputRow: { display: "flex", gap: "8px", marginTop: "10px" },
  replyInput: {
    flex: 1, padding: "7px 14px", borderRadius: "20px",
    border: "1px solid #e2e8f0", fontSize: "13px", fontFamily: "inherit"
  },
  replyBtn: {
    background: "#2563eb", border: "none", color: "#fff",
    fontWeight: "700", cursor: "pointer", fontSize: "13px",
    borderRadius: "20px", padding: "7px 16px"
  },
  replyDeleteBtn: {
    background: "none", border: "none", color: "#ef4444",
    fontWeight: "600", cursor: "pointer", fontSize: "11px"
  },
  emptyState: {
    padding: "30px", textAlign: "center", color: "#64748b",
    border: "1px dashed #cbd5e1", borderRadius: "16px"
  }
};