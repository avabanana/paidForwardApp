import React from 'react';

export default function MapScreen() {
  return (
    <div style={styles.outerWrapper}>
      <div style={styles.bgLayer} />
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerBadge}>🌍 Global Impact</div>
          <h2 style={styles.title}>Community Growth Map</h2>
          <p style={styles.subtitle}>See how financial literacy is spreading worldwide.</p>
        </div>
        
        <div style={styles.mapPlaceholder}>
          <span style={{ fontSize: '50px', marginBottom: '10px', display: 'block' }}>🌍</span>
          <p style={{ color: '#0369a1', fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>Interactive Map Loading...</p>
          <p style={{ color: '#0c4a6e', fontSize: '14px', marginBottom: 0 }}>Visualizing community growth in real-time.</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  outerWrapper: { position: 'relative', minHeight: '100vh', margin: '-24px', padding: '24px', background: 'linear-gradient(160deg, #f0f0ff 0%, #e8f5f0 30%, #fff8e8 60%, #fff0f0 100%)', fontFamily: "'Inter', system-ui, sans-serif" },
  bgLayer: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 10% 10%, rgba(99,102,241,0.12) 0%, transparent 50%), radial-gradient(ellipse at 90% 80%, rgba(16,185,129,0.1) 0%, transparent 50%)', pointerEvents: 'none', zIndex: 0 },
  container: { maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 },
  header: { marginBottom: '32px' },
  headerBadge: { display: 'inline-block', background: 'rgba(99,102,241,0.12)', borderRadius: '999px', padding: '8px 16px', fontSize: '13px', fontWeight: '700', color: '#4338ca', marginBottom: '12px' },
  title: { margin: '0 0 8px', fontSize: '32px', fontWeight: '900', color: '#1e1b4b' },
  subtitle: { margin: '0', fontSize: '15px', color: '#64748b', lineHeight: 1.6 },
  mapPlaceholder: { 
    height: '400px', 
    background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', 
    borderRadius: '24px', 
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'center',
    border: '2px dashed #0ea5e9',
    boxShadow: '0 20px 50px rgba(0,0,0,0.08)'
  }
};