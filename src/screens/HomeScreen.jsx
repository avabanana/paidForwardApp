import React from 'react';

export default function HomeScreen({ onNavigate }) {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <p style={{ color: '#666' }}>Welcome back! What would you like to do today?</p>
      
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
        <button 
          onClick={() => onNavigate('Progress')} 
          style={actionBtn}
        >
          View Progress
        </button>
        <button 
          onClick={() => onNavigate('Map')} 
          style={actionBtn}
        >
          See Global Map
        </button>
      </div>
    </div>
  );
}

const actionBtn = {
  padding: '12px 24px',
  backgroundColor: '#4A90E2',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'transform 0.1s'
};