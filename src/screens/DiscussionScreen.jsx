import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function DiscussionScreen({ currentUser, streak = 0, db, userId }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [showMine, setShowMine] = useState(false);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(true);

  // Helper to determine if the current user owns a post or reply
  // This handles both the ID string and the Display Name fallback
  const isPostOwner = (post) => {
    if (userId && post.userId) {
      return String(post.userId) === String(userId);
    }
    return post.user === currentUser;
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("discussion_posts")
        .select("*")
        .order("createdAt", { ascending: false });
      
      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.warn("Could not fetch discussion posts:", err.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // Refresh every 5 seconds to catch new posts from other users
    const id = setInterval(() => fetchPosts(), 5000);
    return () => clearInterval(id);
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    try {
      const payload = {
        user: currentUser || "Guest",
        userId: userId || "", // Ensure this is stored as a string
        text: newPost.trim(),
        createdAt: new Date().toISOString(),
        likes: [],
        reactions: { thumbs: [], laugh: [] },
        replies: []
      };

      const { error } = await supabase.from("discussion_posts").insert([payload]);
      if (error) throw error;
      
      setNewPost("");
      // Immediately fetch so the post appears without waiting for the interval
      await fetchPosts();
    } catch (err) {
      console.warn("Failed to post:", err.message || err);
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      const { error } = await supabase.from("discussion_posts").delete().eq("id", postId);
      if (error) throw error;
      await fetchPosts();
    } catch (err) {
      console.warn("Failed to delete post:", err.message || err);
    }
  };

  const toggleReaction = async (postId, type, post) => {
    const actorId = userId || currentUser || "Guest";
    try {
      let updated;
      if (type === "like") {
        const arr = post.likes || [];
        const hasReacted = arr.includes(actorId);
        updated = { likes: hasReacted ? arr.filter((a) => a !== actorId) : [...arr, actorId] };
      } else {
        const reactions = post.reactions || { thumbs: [], laugh: [] };
        const arr = reactions[type] || [];
        const hasReacted = arr.includes(actorId);
        const newReactions = { ...reactions, [type]: hasReacted ? arr.filter((a) => a !== actorId) : [...arr, actorId] };
        updated = { reactions: newReactions };
      }

      const { error } = await supabase.from("discussion_posts").update(updated).eq("id", postId);
      if (error) throw error;
      await fetchPosts();
    } catch (err) {
      console.warn("Failed to toggle reaction:", err.message || err);
    }
  };

  const handleReply = async (postId, currentReplies) => {
    const text = replyText[postId]?.trim();
    if (!text) return;
    try {
      const newReply = {
        id: Date.now(),
        user: currentUser || "Guest",
        userId: userId || "",
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      const updatedReplies = [...(currentReplies || []), newReply];
      const { error } = await supabase.from("discussion_posts").update({ replies: updatedReplies }).eq("id", postId);
      if (error) throw error;
      setReplyText((prev) => ({ ...prev, [postId]: "" }));
      await fetchPosts();
    } catch (err) {
      console.warn("Failed to add reply:", err.message || err);
    }
  };

  const deleteReply = async (postId, replyId, currentReplies) => {
    try {
      const updated = (currentReplies || []).filter((r) => r.id !== replyId);
      const { error } = await supabase.from("discussion_posts").update({ replies: updated }).eq("id", postId);
      if (error) throw error;
      await fetchPosts();
    } catch (err) {
      console.warn("Failed to delete reply:", err.message || err);
    }
  };

  // Logic: Show all posts by default. If showMine is true, filter by the helper.
  const visiblePosts = showMine ? posts.filter((p) => isPostOwner(p)) : posts;

  return (
    <div style={dStyles.container}>
      <h2 style={dStyles.title}>💬 Community Discussion</h2>
      <div style={dStyles.topRow}>
        <span style={dStyles.subText}>Share questions, tips, and wins with others.</span>
        <button style={dStyles.toggleBtn} onClick={() => setShowMine((p) => !p)}>
          {showMine ? "Showing: My Posts" : "Showing: All Posts"}
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
        {loading && posts.length === 0 ? (
          <div style={dStyles.emptyState}><p>Loading posts...</p></div>
        ) : visiblePosts.length === 0 ? (
          <div style={dStyles.emptyState}>
            <p style={{ margin: 0 }}>No posts found.</p>
            <p style={{ margin: 0, color: "#64748b", fontSize: '13px' }}>
              {showMine ? "You haven't posted anything yet." : "Be the first to start the conversation!"}
            </p>
          </div>
        ) : (
          visiblePosts.map((post) => {
            const isOwner = isPostOwner(post);
            const actorId = userId || currentUser || "Guest";

            return (
              <div key={post.id} style={dStyles.postCard}>
                <div style={dStyles.postHeader}>
                  <div style={dStyles.userInfo}>
                    <span style={dStyles.userAvatar}>{(post.user || "G")[0].toUpperCase()}</span>
                    <div>
                      <span style={dStyles.userName}>{post.user}</span>
                      {isOwner && streak > 1 && <span style={dStyles.streakTag}>🔥 {streak}</span>}
                      {isOwner && <span style={dStyles.youBadge}>you</span>}
                    </div>
                  </div>
                  <span style={dStyles.time}>
                    {post.createdAt ? new Date(post.createdAt).toLocaleString() : "just now"}
                  </span>
                </div>

                <p style={dStyles.postText}>{post.text}</p>

                <div style={dStyles.actions}>
                  <button
                    onClick={() => toggleReaction(post.id, "like", post)}
                    style={{
                      ...dStyles.actionLink,
                      color: (post.likes || []).includes(actorId) ? "#e11d48" : "#64748b"
                    }}
                  >
                    ❤️ {(post.likes || []).length}
                  </button>
                  <button
                    onClick={() => toggleReaction(post.id, "thumbs", post)}
                    style={{
                      ...dStyles.actionLink,
                      color: (post.reactions?.thumbs || []).includes(actorId) ? "#2563eb" : "#64748b"
                    }}
                  >
                    👍 {(post.reactions?.thumbs || []).length}
                  </button>
                  <button
                    onClick={() => toggleReaction(post.id, "laugh", post)}
                    style={{
                      ...dStyles.actionLink,
                      color: (post.reactions?.laugh || []).includes(actorId) ? "#d97706" : "#64748b"
                    }}
                  >
                    😂 {(post.reactions?.laugh || []).length}
                  </button>
                  
                  {/* DELETE BUTTON: Only visible to original poster */}
                  {isOwner && (
                    <button onClick={() => deletePost(post.id)} style={dStyles.deleteBtn}>
                      🗑 Delete
                    </button>
                  )}
                </div>

                <div style={dStyles.repliesSection}>
                  {(post.replies || []).map((reply) => {
                    const isReplyOwner = (userId && reply.userId) ? String(reply.userId) === String(userId) : reply.user === currentUser;
                    return (
                      <div key={reply.id} style={dStyles.replyItem}>
                        <span style={dStyles.replyUser}>{reply.user}</span>
                        {isReplyOwner && <span style={dStyles.youBadgeSmall}>you</span>}
                        <span style={dStyles.replySep}>·</span>
                        <span style={dStyles.replyText}>{reply.text}</span>
                        {isReplyOwner && (
                          <button
                            onClick={() => deleteReply(post.id, reply.id, post.replies)}
                            style={dStyles.replyDeleteBtn}
                          >
                            delete
                          </button>
                        )}
                      </div>
                    );
                  })}

                  <div style={dStyles.replyInputRow}>
                    <input
                      style={dStyles.replyInput}
                      placeholder="Write a reply..."
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
            );
          })
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