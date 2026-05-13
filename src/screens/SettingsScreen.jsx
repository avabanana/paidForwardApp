import React, { useState } from "react";

export default function SettingsScreen({ currentUser, stats, updateData, signOutCallback, onUsernameUpdate }) {
  const [newUsername, setNewUsername] = useState(stats?.username || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "info" });
  const [savingName, setSavingName] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const showMsg = (text, type = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "info" }), 3000);
  };

  // Helper to get/set local storage users
  const getLocalUsers = () => JSON.parse(localStorage.getItem("PAIDFORWARD_USERS") || "[]");
  const saveLocalUsers = (users) => localStorage.setItem("PAIDFORWARD_USERS", JSON.stringify(users));

  const handleUsernameSave = () => {
    const trimmed = newUsername.trim();
    if (!trimmed) { showMsg("Please enter a valid name.", "error"); return; }
    
    setSavingName(true);
    const users = getLocalUsers();
    // Find user by their current username
    const userIndex = users.findIndex(u => u.username === (stats?.username || currentUser?.username));

    if (userIndex !== -1) {
      users[userIndex].username = trimmed;
      saveLocalUsers(users);
      
      // Update session storage if you use it for the active user
      localStorage.setItem("PAIDFORWARD_CURRENT_USER", JSON.stringify(users[userIndex]));
      
      if (updateData) updateData({ ...stats, username: trimmed });
      if (onUsernameUpdate) onUsernameUpdate(trimmed);
      showMsg("✅ Username updated locally!", "success");
    } else {
      showMsg("User profile not found in storage.", "error");
    }
    setSavingName(false);
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword) { showMsg("Please fill in both fields.", "error"); return; }
    
    setUpdatingPassword(true);
    const users = getLocalUsers();
    const userIndex = users.findIndex(u => u.username === (stats?.username || currentUser?.username));

    if (userIndex !== -1) {
      if (users[userIndex].password !== currentPassword) {
        showMsg("Current password is incorrect.", "error");
      } else {
        users[userIndex].password = newPassword;
        saveLocalUsers(users);
        showMsg("✅ Password reset successfully!", "success");
        setCurrentPassword("");
        setNewPassword("");
      }
    } else {
      showMsg("User profile not found.", "error");
    }
    setUpdatingPassword(false);
  };

  const handleDeleteAccount = () => {
    const users = getLocalUsers();
    const user = users.find(u => u.username === (stats?.username || currentUser?.username));
    
    if (user && user.password === deletePassword) {
      setShowDeleteConfirm(true);
    } else {
      showMsg("Incorrect password to delete.", "error");
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    setDeletingAccount(true);
    
    const users = getLocalUsers();
    const filtered = users.filter(u => u.username !== (stats?.username || currentUser?.username));
    
    saveLocalUsers(filtered);
    localStorage.removeItem("PAIDFORWARD_CURRENT_USER");
    
    showMsg("Account deleted.", "info");
    if (signOutCallback) signOutCallback();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@700;800&display=swap');

        .settings-root {
          min-height: 100vh;
          background: #fdfbff;
          background-image: 
            radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.04) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(168, 85, 247, 0.04) 0px, transparent 50%);
          padding: 60px 20px;
          font-family: 'DM Sans', sans-serif;
          color: #1e293b;
        }

        .settings-inner {
          max-width: 640px;
          margin: 0 auto;
        }

        .settings-header {
          margin-bottom: 40px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 24px;
        }

        .settings-eyebrow {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #6366f1;
          margin-bottom: 8px;
        }

        .settings-title {
          font-family: 'Syne', sans-serif;
          font-size: 34px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .s-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 32px;
          margin-bottom: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          transition: transform 0.2s ease;
        }

        .s-card:hover {
          transform: translateY(-2px);
        }

        .s-card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .s-icon-wrap {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .s-icon-purple { background: #f5f3ff; color: #8b5cf6; }
        .s-icon-blue   { background: #eff6ff; color: #3b82f6; }
        .s-icon-red    { background: #fff1f1; color: #ef4444; }

        .s-card-title {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .s-card-desc {
          color: #64748b;
          font-size: 14px;
          margin-top: 2px;
        }

        .s-label {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 8px;
          display: block;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .s-input {
          width: 100%;
          padding: 14px 18px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          color: #1e293b;
          font-size: 15px;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
          margin-bottom: 14px;
        }

        .s-input:focus {
          border-color: #6366f1;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        .s-row {
          display: flex;
          gap: 12px;
        }

        .s-row .s-input { margin-bottom: 0; flex: 1; }

        .s-btn {
          padding: 14px 28px;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          font-weight: 700;
          font-size: 14px;
          color: #fff;
          transition: all 0.2s ease;
        }

        .s-btn:hover { filter: brightness(1.05); transform: translateY(-1px); }
        .s-btn:active { transform: translateY(0); }
        .s-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .s-btn-purple { background: #6366f1; box-shadow: 0 4px 10px rgba(99, 102, 241, 0.2); }
        .s-btn-blue   { background: #3b82f6; box-shadow: 0 4px 10px rgba(59, 130, 246, 0.2); }
        .s-btn-red    { background: #ef4444; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.2); }
        .s-btn-full   { width: 100%; }

        .s-current-badge {
          display: inline-block;
          background: #f1f5f9;
          color: #475569;
          font-size: 13px;
          font-weight: 600;
          padding: 6px 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          border: 1px solid #e2e8f0;
        }

        .s-note-danger {
          color: #b91c1c;
          background: #fef2f2;
          padding: 18px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 24px;
          border: 1px solid #fee2e2;
        }

        .s-msg {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          padding: 14px 28px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          z-index: 2000;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          color: #fff;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }

        .s-msg-success { background: #10b981; }
        .s-msg-error   { background: #f43f5e; }
        .s-msg-info    { background: #6366f1; }

        .s-overlay {
          position: fixed; inset: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000;
        }

        .s-modal {
          background: #fff;
          border-radius: 28px;
          padding: 40px;
          max-width: 420px;
          width: 90%;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .s-modal h3 { font-family: 'Syne', sans-serif; font-size: 24px; margin: 0 0 12px; color: #0f172a; }
        .s-modal p { color: #64748b; font-size: 15px; margin-bottom: 32px; line-height: 1.6; }

        .s-modal-btns { display: flex; gap: 14px; }
        .s-btn-ghost { background: #f1f5f9; color: #475569; flex: 1; }
        .s-btn-ghost:hover { background: #e2e8f0; }

        .s-section-label {
          font-size: 12px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin: 40px 0 16px 4px;
        }
      `}</style>

      {showDeleteConfirm && (
        <div className="s-overlay">
          <div className="s-modal">
            <div style={{fontSize:'48px', marginBottom:'16px'}}>⚠️</div>
            <h3>Delete Account?</h3>
            <p>This will remove all your local progress, high scores, and course completions. This cannot be undone.</p>
            <div className="s-modal-btns">
              <button className="s-btn s-btn-ghost" onClick={() => setShowDeleteConfirm(false)}>Go Back</button>
              <button className="s-btn s-btn-red" style={{flex:1}} onClick={confirmDelete}>Delete Forever</button>
            </div>
          </div>
        </div>
      )}

      <div className="settings-root">
        <div className="settings-inner">
          
          <div className="settings-header">
            <div className="settings-eyebrow">User Settings</div>
            <h1 className="settings-title">My Account</h1>
          </div>

          <div className="s-section-label">Profile</div>
          <div className="s-card">
            <div className="s-card-header">
              <div className="s-icon-wrap s-icon-purple">👤</div>
              <div>
                <h3 className="s-card-title">Display Name</h3>
                <p className="s-card-desc">Change how you appear on the platform.</p>
              </div>
            </div>
            <div className="s-current-badge">Logged in as: <strong>{stats?.username || currentUser?.username}</strong></div>
            <div className="s-row">
              <input
                className="s-input"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter new username..."
              />
              <button className="s-btn s-btn-purple" onClick={handleUsernameSave} disabled={savingName}>
                Update
              </button>
            </div>
          </div>

          <div className="s-section-label">Security</div>
          <div className="s-card">
            <div className="s-card-header">
              <div className="s-icon-wrap s-icon-blue">🔑</div>
              <div>
                <h3 className="s-card-title">Privacy & Security</h3>
                <p className="s-card-desc">Update your local storage password.</p>
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
              placeholder="Min. 6 characters"
            />
            <button className="s-btn s-btn-blue s-btn-full" onClick={handlePasswordChange} disabled={updatingPassword}>
              Reset Password
            </button>
          </div>

          <div className="s-section-label">Danger</div>
          <div className="s-card" style={{borderColor: '#fee2e2', background: '#fffafa'}}>
            <div className="s-card-header">
              <div className="s-icon-wrap s-icon-red">🛑</div>
              <div>
                <h3 className="s-card-title" style={{color: '#ef4444'}}>Close Account</h3>
                <p className="s-card-desc">Wipe all your local data from this device.</p>
              </div>
            </div>
            <div className="s-note-danger">Wiping your data will clear your course progress and league rank permanently.</div>
            <label className="s-label">Confirm Password</label>
            <input
              type="password"
              className="s-input"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Enter password to confirm"
            />
            <button className="s-btn s-btn-red s-btn-full" onClick={handleDeleteAccount} disabled={deletingAccount}>
              Wipe Data & Logout
            </button>
          </div>

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