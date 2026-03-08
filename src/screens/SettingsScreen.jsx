import React, { useState } from 'react';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

export default function SettingsScreen({ currentUser, stats, updateData }) {
  const [newUsername, setNewUsername] = useState(stats.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleUsernameSave = async () => {
    if (!newUsername.trim()) return;
    await updateData({ username: newUsername.trim() });
    setMessage('Username updated!');
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      setMessage('Please enter both current and new passwords.');
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      setMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Settings</h2>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Profile</h3>
        <p style={styles.note}>Change your display name shown in the app.</p>
        <div style={styles.row}>
          <input
            style={styles.input}
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Display name"
          />
          <button style={styles.button} onClick={handleUsernameSave}>Save</button>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Change Password</h3>
        <p style={styles.note}>You need your current password to make changes.</p>
        <input
          type="password"
          style={styles.input}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
        />
        <input
          type="password"
          style={styles.input}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
        />
        <button style={styles.button} onClick={handlePasswordChange}>Update password</button>
      </div>

      {message && <div style={styles.message}>{message}</div>}
    </div>
  );
}

const styles = {
  container: { maxWidth: '680px', margin: '0 auto', padding: '20px' },
  title: { fontSize: '28px', marginBottom: '12px' },
  card: { background: '#fff', padding: '18px', borderRadius: '18px', boxShadow: '0 12px 24px rgba(0,0,0,0.05)', marginBottom: '18px' },
  cardTitle: { margin: '0 0 8px 0' },
  note: { color: '#64748b', marginBottom: '12px' },
  row: { display: 'flex', gap: '10px', alignItems: 'center' },
  input: { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '12px' },
  button: { padding: '12px 18px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' },
  message: { padding: '12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', color: '#0369a1' }
};
