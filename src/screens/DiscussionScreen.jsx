import React, { useState } from 'react';

export default function DiscussionScreen({ currentUser }) {
  const [messages, setMessages] = useState([
    { id: 1, user: 'GlobalSaver', text: 'Just finished the Finance 101 course! 🚀', time: '2h ago' },
    { id: 2, user: 'ImpactLead', text: 'Welcome to the community! Check out the map to see our current project.', time: '1h ago' }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      user: currentUser || 'Member', // This uses the prop we passed!
      text: inputText,
      time: 'Just now'
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatHeader}>
        <h3>Community Discussion</h3>
        <p>Chatting as <strong>@{currentUser || 'Member'}</strong></p>
      </div>

      <div style={styles.messageList}>
        {messages.map((msg) => (
          <div key={msg.id} style={{
            ...styles.messageBubble,
            alignSelf: msg.user === currentUser ? 'flex-end' : 'flex-start',
            backgroundColor: msg.user === currentUser ? '#2563eb' : '#f1f5f9',
            color: msg.user === currentUser ? '#fff' : '#1e293b'
          }}>
            <span style={styles.userName}>@{msg.user}</span>
            <p style={styles.msgText}>{msg.text}</p>
            <span style={styles.time}>{msg.time}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} style={styles.inputArea}>
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Share your thoughts..." 
          style={styles.input} 
        />
        <button type="submit" style={styles.sendBtn}>Post</button>
      </form>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '500px' },
  chatHeader: { marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' },
  messageList: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', padding: '10px' },
  messageBubble: { 
    padding: '12px 16px', 
    borderRadius: '18px', 
    maxWidth: '70%', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    position: 'relative'
  },
  userName: { fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '4px', opacity: 0.8 },
  msgText: { margin: 0, fontSize: '15px', lineHeight: '1.4' },
  time: { fontSize: '10px', marginTop: '4px', display: 'block', opacity: 0.6, textAlign: 'right' },
  inputArea: { display: 'flex', gap: '10px', marginTop: '20px', padding: '10px', background: '#f8fafc', borderRadius: '16px' },
  input: { flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' },
  sendBtn: { padding: '0 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }
};