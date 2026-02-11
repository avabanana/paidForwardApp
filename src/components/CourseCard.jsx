import React from 'react';
import ProgressBar from "./ProgressBar"; // Ensure ProgressBar.jsx exists!

export default function CourseCard({ title, progress, locked }) {
  return (
    <div style={{
      ...styles.card,
      opacity: locked ? 0.6 : 1,
      cursor: locked ? 'not-allowed' : 'pointer'
    }}>
      <h3 style={styles.title}>{title}</h3>
      
      {locked ? (
        <p style={styles.lockedText}>🔒 Locked</p>
      ) : (
        <div style={styles.infoContainer}>
          <p style={styles.progressLabel}>Progress: {Math.round(progress * 100)}%</p>
          <ProgressBar progress={progress} />
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '12px',
    marginBottom: '15px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    transition: 'transform 0.1s ease',
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '18px',
    color: '#333',
  },
  lockedText: {
    color: '#888',
    fontSize: '14px',
    fontStyle: 'italic',
  },
  infoContainer: {
    marginTop: '10px',
  },
  progressLabel: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '5px',
  }
};