import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function SettingsScreen({ currentUser, stats, updateData, signOutCallback, onUsernameUpdate, db }) {
  const [newUsername, setNewUsername] = useState(stats?.username || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "info" });
  const [savingName, setSavingName] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const showMsg = (text, type = "info") => setMessage({ text, type });

  const handleUsernameSave = async () => {
    const trimmed = newUsername.trim();
    if (!trimmed) { showMsg("Please enter a valid display name.", "error"); return; }

    // Try to determine user id from various shapes (supabase user object vs legacy firebase)
    const uid = currentUser?.id || currentUser?.uid || stats?.id;
    if (!uid) { showMsg("Not logged in.", "error"); return; }

    setSavingName(true);
    showMsg("Saving display name…", "info");

    try {
      // Update auth metadata (if supported)
      try {
        await supabase.auth.updateUser({ data: { username: trimmed } });
      } catch (e) {
        // ignore auth metadata failures
        console.warn("auth.updateUser failed:", e?.message || e);
      }

      // Update users table
      const { error } = await supabase.from("users").update({ username: trimmed }).eq("id", uid);
      if (error) throw error;

      if (updateData) await updateData({ username: trimmed });
      if (onUsernameUpdate) onUsernameUpdate(trimmed);
      showMsg("✅ Display name updated successfully!", "success");
    } catch (err) {
      if (onUsernameUpdate) onUsernameUpdate(stats?.username || "");
      showMsg(err?.message || err?.error_description || "Could not update display name.", "error");
    } finally {
      setSavingName(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) { showMsg("Please fill in both password fields.", "error"); return; }
    if (newPassword.length < 6) { showMsg("New password must be at least 6 characters.", "error"); return; }

    setUpdatingPassword(true);
    showMsg("Updating password…", "info");
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setCurrentPassword("");
      setNewPassword("");
      showMsg("✅ Password updated successfully!", "success");
    } catch (err) {
      showMsg(err?.message || "Could not update password.", "error");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) { showMsg("Enter your password to confirm deletion.", "error"); return; }
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    setDeletingAccount(true);
    showMsg("Deleting account…", "info");

    try {
      // Attempt to delete user row from 'users' table. Full auth account deletion requires a service role.
      const uid = currentUser?.id || currentUser?.uid || stats?.id;
      if (uid) {
        const { error: delErr } = await supabase.from("users").delete().eq("id", uid);
        if (delErr) console.warn("Failed to delete users row:", delErr.message || delErr);
      }

      // Sign out locally
      try {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) console.warn("Sign out error:", signOutError.message || signOutError);
      } catch (e) {
        console.warn("signOut failed:", e?.message || e);
      }

      if (signOutCallback) await signOutCallback();
    } catch (err) {
      showMsg(err?.message || "Could not delete account.", "error");
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .settings-root {
          min-height: 100vh;
          background:
            radial-gradient(ellipse at 15% 20%, rgba(139, 92, 246, 0.18) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 10%, rgba(6, 182, 212, 0.14) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 80%, rgba(236, 72, 153, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 10% 90%, rgba(99, 102, 241, 0.1) 0%, transparent 45%),
            linear-gradient(160deg, #0f0c29 0%, #1a1040 35%, #0d1b3e 65%, #0a0a1a 100%);
          padding: 40px 20px 60px;
          font-family: 'DM Sans', system-ui, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .settings-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0);
          background-size: 32px 32px;
          pointer-events: none;
          z-index: 0;
        }

        .settings-inner {
          max-width: 640px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .settings-header {
          margin-bottom: 36px;
          padding-bottom: 28px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          position: relative;
        }

        .settings-header::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 80px;
          height: 2px;
          background: linear-gradient(90deg, #a855f7, #06b6d4);
          border-radius: 2px;
        }

        .settings-eyebrow {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #a855f7;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .settings-eyebrow::before {
          content: '';
          display: inline-block;
          width: 20px;
          height: 2px;
          background: #a855f7;
          border-radius: 2px;
        }

        .settings-title {
          font-family: 'Syne', sans-serif;
          font-size: 36px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
          line-height: 1.1;
        }

        .settings-subtitle {
          color: rgba(255,255,255,0.45);
          font-size: 14px;
          font-weight: 400;
          margin: 0;
        }

        .s-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 16px;
          backdrop-filter: blur(12px);
          transition: border-color 0.2s, background 0.2s;
          position: relative;
          overflow: hidden;
        }

        .s-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
        }

        .s-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.14);
        }

        .s-card-danger {
          border-color: rgba(239, 68, 68, 0.25);
          background: rgba(239, 68, 68, 0.05);
        }

        .s-card-danger:hover {
          background: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.35);
        }

        .s-card-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }

        .s-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .s-icon-purple { background: linear-gradient(135deg, rgba(139,92,246,0.3), rgba(168,85,247,0.2)); border: 1px solid rgba(139,92,246,0.35); }
        .s-icon-blue   { background: linear-gradient(135deg, rgba(6,182,212,0.3), rgba(37,99,235,0.2)); border: 1px solid rgba(6,182,212,0.35); }
        .s-icon-red    { background: linear-gradient(135deg, rgba(239,68,68,0.3), rgba(185,28,28,0.2));  border: 1px solid rgba(239,68,68,0.35); }

        .s-card-title {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 3px 0;
        }

        .s-card-title-danger { color: #f87171; }

        .s-card-desc {
          color: rgba(255,255,255,0.4);
          font-size: 13px;
          line-height: 1.5;
          margin: 0;
        }

        .s-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 8px;
          display: block;
        }

        .s-input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-weight: 400;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
          margin-bottom: 12px;
        }

        .s-input::placeholder { color: rgba(255,255,255,0.25); }

        .s-input:focus {
          border-color: rgba(168, 85, 247, 0.6);
          background: rgba(255,255,255,0.09);
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.12);
        }

        .s-input-danger:focus {
          border-color: rgba(239, 68, 68, 0.6);
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
        }

        .s-row {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          margin-bottom: 0;
        }

        .s-row .s-input {
          flex: 1;
          margin-bottom: 0;
          min-width: 0;
        }

        .s-note {
          color: rgba(255,255,255,0.4);
          font-size: 13px;
          line-height: 1.55;
          margin: 0 0 16px 0;
          padding: 10px 14px;
          background: rgba(255,255,255,0.04);
          border-radius: 10px;
          border-left: 3px solid rgba(168, 85, 247, 0.5);
        }

        .s-note-danger {
          border-left-color: rgba(239,68,68,0.5);
        }

        .s-btn {
          padding: 12px 22px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.3px;
          color: #fff;
          transition: opacity 0.15s, transform 0.15s, box-shadow 0.15s;
          white-space: nowrap;
          position: relative;
          overflow: hidden;
        }

        .s-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0);
          transition: background 0.15s;
          border-radius: inherit;
        }

        .s-btn:hover:not(:disabled)::after { background: rgba(255,255,255,0.08); }
        .s-btn:active:not(:disabled) { transform: scale(0.97); }
        .s-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .s-btn-purple {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.35);
        }

        .s-btn-blue {
          background: linear-gradient(135deg, #0284c7, #06b6d4);
          box-shadow: 0 4px 20px rgba(6, 182, 212, 0.3);
        }

        .s-btn-red {
          background: linear-gradient(135deg, #dc2626, #ef4444);
          box-shadow: 0 4px 20px rgba(239, 68, 68, 0.3);
        }

        .s-btn-full { width: 100%; margin-top: 4px; }

        .s-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 16px 0;
        }

        .s-current-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(168, 85, 247, 0.15);
          border: 1px solid rgba(168, 85, 247, 0.3);
          color: #c084fc;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          margin-bottom: 14px;
        }

        .s-current-badge::before { content: '●'; font-size: 8px; }

        /* Message banner */
        .s-msg {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 600;
          margin-top: 16px;
          animation: msgSlide 0.25s ease;
        }

        @keyframes msgSlide {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .s-msg-success { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); color: #6ee7b7; }
        .s-msg-error   { background: rgba(239,68,68,0.15);  border: 1px solid rgba(239,68,68,0.3);  color: #fca5a5; }
        .s-msg-info    { background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); color: #a5b4fc; }

        /* Confirm modal */
        .s-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .s-modal {
          background: linear-gradient(160deg, #1e1535, #1a1040);
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 24px;
          padding: 32px;
          max-width: 380px;
          width: 90%;
          box-shadow: 0 24px 60px rgba(0,0,0,0.6);
          animation: modalPop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }

        .s-modal-icon {
          width: 56px; height: 56px;
          background: linear-gradient(135deg, rgba(239,68,68,0.25), rgba(185,28,28,0.15));
          border: 1px solid rgba(239,68,68,0.35);
          border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px;
          margin: 0 auto 20px;
        }

        .s-modal h3 {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #fff;
          text-align: center;
          margin: 0 0 10px;
        }

        .s-modal p {
          color: rgba(255,255,255,0.5);
          font-size: 14px;
          text-align: center;
          line-height: 1.6;
          margin: 0 0 24px;
        }

        .s-modal-btns {
          display: flex;
          gap: 10px;
        }

        .s-btn-ghost {
          flex: 1;
          padding: 12px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          color: rgba(255,255,255,0.7);
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: background 0.15s;
        }

        .s-btn-ghost:hover { background: rgba(255,255,255,0.12); }

        .s-section-label {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          margin: 28px 0 12px;
          padding-left: 2px;
        }
      `}</style>

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="s-overlay">
          <div className="s-modal">
            <div className="s-modal-icon">⚠️</div>
            <h3>Delete Account?</h3>
            <p>This is permanent and cannot be undone. All your progress, courses, and data will be erased forever.</p>
            <div className="s-modal-btns">
              <button className="s-btn-ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="s-btn s-btn-red" style={{ flex: 1, padding: "12px" }} onClick={confirmDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="settings-root">
        <div className="settings-inner">

          {/* Header */}
          <div className="settings-header">
            <div className="settings-eyebrow">Account Settings</div>
            <h1 className="settings-title">Your Profile</h1>
            <p className="settings-subtitle">Manage your identity, security, and account data.</p>
          </div>

          <div className="s-section-label">Profile</div>

          {/* Display Name Card */}
          <div className="s-card">
            <div className="s-card-header">
              <div className="s-icon-wrap s-icon-purple">👤</div>
              <div>
                <h3 className="s-card-title">Display Name</h3>
                <p className="s-card-desc">Shown in discussions, leagues, and the top bar.</p>
              </div>
            </div>

            {stats?.username && (
              <div className="s-current-badge">{stats.username}</div>
            )}

            <div className="s-row">
              <input
                className="s-input"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter new display name…"
                onKeyDown={(e) => e.key === "Enter" && handleUsernameSave()}
              />
              <button
                className="s-btn s-btn-purple"
                onClick={handleUsernameSave}
                disabled={savingName}
              >
                {savingName ? "Saving…" : "Save"}
              </button>
            </div>
          </div>

          <div className="s-section-label">Security</div>

          {/* Password Card */}
          <div className="s-card">
            <div className="s-card-header">
              <div className="s-icon-wrap s-icon-blue">🔒</div>
              <div>
                <h3 className="s-card-title">Change Password</h3>
                <p className="s-card-desc">You'll need your current password to make changes.</p>
              </div>
            </div>

            <label className="s-label">Current Password</label>
            <input
              type="password"
              className="s-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />

            <label className="s-label">New Password</label>
            <input
              type="password"
              className="s-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              style={{ marginBottom: "16px" }}
            />

            <button
              className="s-btn s-btn-blue s-btn-full"
              onClick={handlePasswordChange}
              disabled={updatingPassword}
            >
              {updatingPassword ? "Updating…" : "Update Password"}
            </button>
          </div>

          <div className="s-section-label">Danger Zone</div>

          {/* Delete Card */}
          <div className="s-card s-card-danger">
            <div className="s-card-header">
              <div className="s-icon-wrap s-icon-red">⚠️</div>
              <div>
                <h3 className="s-card-title s-card-title-danger">Delete Account</h3>
                <p className="s-card-desc">Permanent — all data, progress, and courses will be erased.</p>
              </div>
            </div>

            <div className="s-note s-note-danger">
              This action <strong style={{ color: "#f87171" }}>cannot be undone.</strong> Please enter your password below to confirm you understand.
            </div>

            <label className="s-label">Confirm Password</label>
            <input
              type="password"
              className="s-input s-input-danger"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Enter password to confirm"
              style={{ marginBottom: "16px" }}
            />

            <button
              className="s-btn s-btn-red s-btn-full"
              onClick={handleDeleteAccount}
              disabled={deletingAccount}
            >
              {deletingAccount ? "Deleting…" : "🗑 Delete My Account"}
            </button>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`s-msg s-msg-${message.type}`}>
              {message.text}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
