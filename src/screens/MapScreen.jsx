import React from 'react';

export default function MapScreen() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3 style={{ color: '#333' }}>Global Impact Map</h3>
      <div style={{ 
        height: '400px', 
        background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', 
        borderRadius: '16px', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        border: '2px dashed #0ea5e9',
        marginTop: '20px'
      }}>
        <span style={{ fontSize: '50px', marginBottom: '10px' }}>🌍</span>
        <p style={{ color: '#0369a1', fontWeight: 'bold' }}>Interactive Map Loading...</p>
        <p style={{ color: '#0c4a6e', fontSize: '14px' }}>Visualizing community growth in real-time.</p>
      </div>
    </div>
  );
}