import React, { useEffect, useState } from 'react';

const dailyTips = [
  'Tip: Track one small purchase today and think about how it fits into your budget.',
  'Tip: Saving just a little bit every day adds up quickly over a year.',
  'Tip: When you earn money, try saving 10% first before spending the rest.',
  'Tip: Compare prices before you buy to make sure you get the best deal.',
  'Tip: Setting a savings goal makes it easier to say no to impulse buys.'
];

const getTodayKey = () => new Date().toISOString().slice(0, 10);

export default function HomeScreen({ onNavigate }) {
  const [tip, setTip] = useState(dailyTips[0]);

  useEffect(() => {
    const stored = localStorage.getItem('pf_daily_tip');
    const today = getTodayKey();

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) {
          setTip(parsed.tip);
          return;
        }
      } catch {
        // ignore
      }
    }

    const nextTip = dailyTips[Math.floor(Math.random() * dailyTips.length)];
    setTip(nextTip);
    localStorage.setItem('pf_daily_tip', JSON.stringify({ date: today, tip: nextTip }));
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Your Financial Future Starts Here 🚀</h1>
        <p style={styles.heroSubtitle}>Learn, play, and make a global impact. Every lesson you complete helps fund community projects worldwide.</p>
        <div style={styles.dailyTip}>
          <strong>Daily Tip:</strong> {tip}
        </div>
      </div>

      <div style={styles.statsRow}>
        <div style={{...styles.infoCard, borderTop: '4px solid #4A90E2'}}>
          <h3>📚 Learn</h3>
          <p>Master money with bite-sized lessons.</p>
          <button onClick={() => onNavigate('Courses')} style={styles.linkBtn}>Open Courses</button>
        </div>
        <div style={{...styles.infoCard, borderTop: '4px solid #10b981'}}>
          <h3>🎮 Play</h3>
          <p>Test your skills in the Budget Arcade.</p>
          <button onClick={() => onNavigate('Games')} style={styles.linkBtn}>Play Games</button>
        </div>
        <div style={{...styles.infoCard, borderTop: '4px solid #f59e0b'}}>
          <h3>🌍 Impact</h3>
          <p>See how you're changing the world.</p>
          <button onClick={() => onNavigate('Map')} style={styles.linkBtn}>View Map</button>
        </div>
      </div>

      <div style={styles.ctaSection}>
        <button onClick={() => onNavigate('Progress')} style={styles.mainBtn}>
          🔥 View Your Personal Progress
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px', textAlign: 'center' },
  hero: { 
    background: 'linear-gradient(120deg, #4A90E2 0%, #63b3ed 100%)', 
    padding: '40px 20px', 
    borderRadius: '24px', 
    color: '#fff',
    marginBottom: '30px',
    boxShadow: '0 10px 20px rgba(74, 144, 226, 0.2)'
  },
  heroTitle: { fontSize: '2.5rem', margin: '0 0 10px 0' },
  heroSubtitle: { fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' },
  dailyTip: { marginTop: '20px', padding: '14px', borderRadius: '16px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.35)', fontWeight: '600' },
  statsRow: { display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '30px' },
  infoCard: { 
    background: '#fff', 
    padding: '20px', 
    borderRadius: '16px', 
    flex: '1 1 250px', 
    maxWidth: '300px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    textAlign: 'left'
  },
  linkBtn: { background: 'none', border: 'none', color: '#4A90E2', fontWeight: 'bold', cursor: 'pointer', padding: 0, marginTop: '10px' },
  ctaSection: { marginTop: '20px' },
  mainBtn: { 
    padding: '18px 36px', 
    fontSize: '1.1rem', 
    background: '#1a1a1a', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '12px', 
    fontWeight: 'bold', 
    cursor: 'pointer',
    transition: 'transform 0.2s'
  }
};