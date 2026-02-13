import React from 'react';
import ProgressBar from '../components/ProgressBar';

export default function ProgressScreen() {
  return (
    <div style={{ padding: '10px' }}>
      {/* Level Header */}
      <div style={styles.levelCard}>
        <div style={styles.levelBadge}>LVL 2</div>
        <div style={{ textAlign: 'left', flex: 1 }}>
          <h2 style={{ margin: 0, color: '#fff' }}>Wealth Builder</h2>
          <p style={{ color: '#e0f2fe', margin: '5px 0' }}>You're in the top 15% of learners this week!</p>
          <ProgressBar progress={0.65} />
          <span style={{ fontSize: '12px', color: '#e0f2fe' }}>850 / 1200 XP to Level 3</span>
        </div>
      </div>

      {/* Grid Stats */}
      <div style={styles.grid}>
        <div style={{ ...styles.statCard, background: '#ebf8ff' }}>
          <span style={styles.icon}>🎓</span>
          <h4 style={styles.statLabel}>Courses Finished</h4>
          <h2 style={styles.statValue}>3</h2>
        </div>
        <div style={{ ...styles.statCard, background: '#f0fff4' }}>
          <span style={styles.icon}>💎</span>
          <h4 style={styles.statLabel}>Impact Points</h4>
          <h2 style={styles.statValue}>1,250</h2>
        </div>
        <div style={{ ...styles.statCard, background: '#fffaf0' }}>
          <span style={styles.icon}>🔥</span>
          <h4 style={styles.statLabel}>Day Streak</h4>
          <h2 style={styles.statValue}>5</h2>
        </div>
      </div>

      {/* Badges Section */}
      <div style={styles.badgeSection}>
        <h3 style={{ marginBottom: '15px' }}>Your Achievements</h3>
        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
          <Badge icon="🌱" title="Early Bird" color="#dcfce7" />
          <Badge icon="💰" title="Budget King" color="#fef3c7" />
          <Badge icon="🧠" title="Quiz Whiz" color="#e0e7ff" />
          <Badge icon="🤝" title="Helper" color="#fae8ff" />
        </div>
      </div>
    </div>
  );
}

const Badge = ({ icon, title, color }) => (
  <div style={{ 
    minWidth: '90px', padding: '15px', borderRadius: '16px', 
    background: color, textAlign: 'center', border: '1px solid rgba(0,0,0,0.05)' 
  }}>
    <div style={{ fontSize: '30px', marginBottom: '5px' }}>{icon}</div>
    <div style={{ fontSize: '11px', fontWeight: 'bold' }}>{title}</div>
  </div>
);

const styles = {
  levelCard: { 
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', 
    padding: '30px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px' 
  },
  levelBadge: { 
    width: '70px', height: '70px', borderRadius: '50%', background: '#fff', 
    color: '#1e3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center', 
    fontSize: '20px', fontWeight: '900', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' 
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px', marginBottom: '25px' },
  statCard: { padding: '20px', borderRadius: '16px', textAlign: 'center' },
  icon: { fontSize: '24px', display: 'block', marginBottom: '5px' },
  statLabel: { margin: 0, fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' },
  statValue: { margin: '5px 0 0 0', fontSize: '24px', color: '#333' },
  badgeSection: { background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }
};