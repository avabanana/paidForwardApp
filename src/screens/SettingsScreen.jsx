import React, { useState } from "react";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  updateProfile
} from "firebase/auth";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function SettingsScreen({ currentUser, stats, updateData, signOutCallback, onUsernameUpdate, db }) {
  const [newUsername, setNewUsername] = useState(stats?.username || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "info" });
  const [savingName, setSavingName] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const showMsg = (text, type = "info") => setMessage({ text, type });

  const handleUsernameSave = async () => {
    const trimmed = newUsername.trim();
    if (!trimmed) { showMsg("Please enter a valid display name.", "error"); return; }
    if (!currentUser) { showMsg("Not logged in.", "error"); return; }

    // Optimistic update — header changes instantly
    if (onUsernameUpdate) onUsernameUpdate(trimmed);
    setSavingName(true);
    showMsg("✅ Display name updated!", "success");

    try {
      await updateProfile(currentUser, { displayName: trimmed });
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, { username: trimmed });
      await updateData({ username: trimmed });
    } catch (err) {
      // Roll back optimistic update on failure
      if (onUsernameUpdate) onUsernameUpdate(stats?.username || "");
      showMsg(err.message || "Could not update display name.", "error");
    } finally {
      setSavingName(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) { showMsg("Please fill in both password fields.", "error"); return; }
    if (newPassword.length < 6) { showMsg("New password must be at least 6 characters.", "error"); return; }

    setUpdatingPassword(true);
    // Optimistic feedback
    showMsg("✅ Password updated successfully!", "success");
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      showMsg(err.message || "Could not update password.", "error");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) { showMsg("Enter your password to confirm deletion.", "error"); return; }
    const confirmed = window.confirm("⚠️ This will permanently delete your account and all data. Are you sure?");
    if (!confirmed) return;

    setDeletingAccount(true);
    showMsg("Deleting account…", "info");

    try {
      const credential = EmailAuthProvider.credential(currentUser.email, deletePassword);
      await reauthenticateWithCredential(currentUser, credential);

      // Delete Firestore doc first, then the auth user
      if (db && currentUser.uid) {
        await deleteDoc(doc(db, "users", currentUser.uid));
      }
      await deleteUser(currentUser);

      // signOutCallback clears local state
      if (signOutCallback) await signOutCallback();
    } catch (err) {
      showMsg(err.message || "Could not delete account.", "error");
      setDeletingAccount(false);
    }
  };

  const msgColors = {
    success: { bg: "#d1fae5", border: "#6ee7b7", text: "#065f46" },
    error:   { bg: "#fee2e2", border: "#fca5a5", text: "#991b1b" },
    info:    { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8" }
  };

  return (
    <div style={s.container}>
      <h2 style={s.title}>⚙️ Settings</h2>
      <p style={s.subtitle}>Manage your account, password, and preferences.</p>

      {/* Display Name */}
      <div style={s.card}>
        <div style={s.cardIcon}>👤</div>
        <div style={s.cardBody}>
          <h3 style={s.cardTitle}>Display Name</h3>
          <p style={s.note}>
            Shown in discussions, leagues, and the top bar.
            Currently: <strong>{stats?.username || "—"}</strong>
          </p>
          <div style={s.inputRow}>
            <input
              style={s.input}
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="New display name"
              onKeyDown={(e) => e.key === "Enter" && handleUsernameSave()}
            />
            <button
              style={{ ...s.button, opacity: savingName ? 0.6 : 1, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
              onClick={handleUsernameSave}
              disabled={savingName}
            >
              {savingName ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Password */}
      <div style={s.card}>
        <div style={s.cardIcon}>🔒</div>
        <div style={s.cardBody}>
          <h3 style={s.cardTitle}>Change Password</h3>
          <p style={s.note}>You'll need your current password to make changes.</p>
          <input type="password" style={s.inputFull} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password" />
          <input type="password" style={s.inputFull} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password (min. 6 characters)" />
          <button
            style={{ ...s.button, opacity: updatingPassword ? 0.6 : 1, background: 'linear-gradient(135deg,#0ea5e9,#2563eb)' }}
            onClick={handlePasswordChange}
            disabled={updatingPassword}
          >
            {updatingPassword ? "Updating…" : "Update Password"}
          </button>
        </div>
      </div>

      {/* Delete */}
      <div style={{ ...s.card, borderLeft: "4px solid #dc2626" }}>
        <div style={s.cardIcon}>⚠️</div>
        <div style={s.cardBody}>
          <h3 style={{ ...s.cardTitle, color: "#dc2626" }}>Delete Account</h3>
          <p style={s.note}>
            This is <strong>permanent and cannot be undone.</strong> All your progress, courses, and data will be erased.
          </p>
          <input
            type="password"
            style={s.inputFull}
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            placeholder="Confirm your password to delete"
          />
          <button
            style={{ ...s.button, background: 'linear-gradient(135deg,#dc2626,#b91c1c)', opacity: deletingAccount ? 0.6 : 1 }}
            onClick={handleDeleteAccount}
            disabled={deletingAccount}
          >
            {deletingAccount ? "Deleting…" : "🗑 Delete My Account"}
          </button>
        </div>
      </div>

      {message.text && (
        <div style={{
          padding: "14px 16px",
          background: msgColors[message.type].bg,
          border: `1px solid ${msgColors[message.type].border}`,
          borderRadius: "12px",
          color: msgColors[message.type].text,
          fontWeight: "600",
          fontSize: "14px"
        }}>
          {message.text}
        </div>
      )}
    </div>
  );
}

const s = {
  container: { maxWidth:"620px", margin:"0 auto", padding:"20px", fontFamily:"'Inter', system-ui, sans-serif" },
  title: { fontSize:"28px", marginBottom:"4px", color:"#111827" },
  subtitle: { color:"#64748b", marginBottom:"24px", fontSize:"15px" },
  card: {
    background:"#fff", borderRadius:"18px",
    boxShadow:"0 8px 24px rgba(0,0,0,0.06)",
    border:"1px solid #e2e8f0",
    marginBottom:"18px",
    display:"flex", gap:"16px", padding:"20px", alignItems:"flex-start"
  },
  cardIcon: { fontSize:"28px", flexShrink:0, marginTop:"2px" },
  cardBody: { flex:1 },
  cardTitle: { margin:"0 0 6px 0", fontSize:"17px", fontWeight:"700", color:"#111827" },
  note: { color:"#64748b", marginBottom:"14px", fontSize:"14px", lineHeight:"1.5" },
  inputRow: { display:"flex", gap:"10px", alignItems:"center" },
  input: { flex:1, padding:"11px 14px", borderRadius:"12px", border:"1px solid #cbd5e1", fontSize:"14px", fontFamily:"inherit", minWidth:0 },
  inputFull: { width:"100%", padding:"11px 14px", borderRadius:"12px", border:"1px solid #cbd5e1", marginBottom:"12px", fontSize:"14px", fontFamily:"inherit", boxSizing:"border-box" },
  button: { padding:"11px 20px", color:"#fff", border:"none", borderRadius:"12px", cursor:"pointer", fontWeight:"700", fontSize:"14px", whiteSpace:"nowrap" }
};
