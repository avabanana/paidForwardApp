import React from 'react';

export default function DiscussionScreen() {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Community Discussion</h2>
      <p style={styles.text}>
        Ask questions, share experiences, and learn from others in a moderated space.
      </p>
      
      {/* Placeholder for future posts */}
      <div style={styles.postPlaceholder}>
        <p style={{ color: '#888' }}>Discussion feed coming soon...</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  },
  text: {
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#666',
  },
  postPlaceholder: {
    marginTop: '30px',
    padding: '40px',
    border: '2px dashed #ccc',
    borderRadius: '12px',
    textAlign: 'center',
    backgroundColor: '#fafafa'
  }
};