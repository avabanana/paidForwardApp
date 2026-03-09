import React from 'react';
import ProgressBar from '../components/ProgressBar';

const AchievementBadge = ({ icon, title, requirement, achieved, color }) => (
  <div
    style={{
      minWidth: '110px',
      padding: '15px',
      borderRadius: '16px',
      background: color,
      textAlign: 'center',
      border: '1px solid rgba(0,0,0,0.05)',
      opacity: achieved ? 1 : 0.4,
      filter: achieved ? 'none' : 'grayscale(100%)',
      position: 'relative',
      transition: 'all 0.3s ease'
    }}
    title={achieved ? `Unlocked: ${requirement}` : `Locked: ${requirement}`}
  >
    <div style={{ fontSize: '30px', marginBottom: '5px' }}>{icon}</div>
    <div style={{ fontSize: '11px', fontWeight: 'bold' }}>{title}</div>
    <div style={{ fontSize: '10px', color: '#334155', marginTop: '5px' }}>{requirement}</div>
    {achieved && (
      <div
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: '#10b981',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        ✓
      </div>
    )}
  </div>
);

export default function ProgressScreen({ 
  coursesCompleted = 0, 
  gameWins = 0, 
  gamesPlayed = 0, 
  xp = 0, 
  streak = 0,
  userTier = 'adult'
}) {
  const currentLevel = Math.floor(xp / 1000) + 1;
  const xpIntoLevel = xp % 1000;
  const levelProgress = xpIntoLevel / 1000;

  // Adaptive Titles based on Tier
  const getLevelTitle = () => {
    const titles = {
      elementary: ['Seed Sower', 'Star Saver', 'Junior Builder', 'Coin Captain'],
      middle: ['Budgeter', 'Goal Getter', 'Wealth Builder', 'Market Master'],
      adult: ['Financial Novice', 'Asset Allocator', 'Portfolio Pro', 'Fiscal Legend']
    };
    const tierTitles = titles[userTier] || titles.adult;
    return tierTitles[Math.min(currentLevel - 1, tierTitles.length - 1)];
  };

  const [goalBadges, setGoalBadges] = React.useState([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('pf_achievements');
    if (saved) {
      try {
        setGoalBadges(JSON.parse(saved));
      } catch {
        setGoalBadges([]);
      }
    }
  }, []);

  const achievementList = [
    {
      icon: '🌱',
      title: 'Early Bird',
      requirement: 'Complete 1 module',
      achieved: coursesCompleted > 0,
      color: '#dcfce7'
    },
    {
      icon: '🎮',
      title: 'Game On',
      requirement: 'Play 1 game',
      achieved: gamesPlayed > 0,
      color: '#fef3c7'
    },
    {
      icon: '🏆',
      title: 'Winner',
      requirement: 'Win 1 game',
      achieved: gameWins > 0,
      color: '#e0e7ff'
    },
    {
      icon: '🔥',
      title: 'Dedicated',
      requirement: '3 Day Streak',
      achieved: streak >= 3,
      color: '#ffedd5'
    },
    {
      icon: '💎',
      title: 'XP Master',
      requirement: 'Earn 1500 XP',
      achieved: xp >= 1500,
      color: '#fae8ff'
    },
    ...goalBadges.map((badge, i) => ({
      icon: '🏅',
      title: badge,
      requirement: 'Goal completed',
      achieved: true,
      color: '#f1f5f9'
    }))
  ];

  return (
    <div style={{ padding: '10px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={styles.levelCard}>
        <div style={styles.levelBadge}>
          <span style={{fontSize: '12px', display: 'block'}}>LVL</span>
          {currentLevel}
        </div>
        <div style={{ textAlign: 'left', flex: 1 }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '24px' }}>{getLevelTitle()}</h2>
          <p style={{ color: '#e0f2fe', margin: '5px 0', fontSize: '14px' }}>
            {xpIntoLevel} / 1000 XP to Level {currentLevel + 1}
          </p>
          <ProgressBar progress={levelProgress} />
        </div>
      </div>

      <div style={styles.grid}>
        <StatCard icon="🎓" label="Modules" value={coursesCompleted} color="#ebf8ff" />
        <StatCard icon="🎮" label="Games" value={gamesPlayed} color="#f0f4ff" />
        <StatCard icon="💎" label="Total XP" value={xp} color="#fff0f6" />
        <StatCard icon="🔥" label="Streak" value={streak} color="#fffaf0" />
      </div>

      <div style={styles.badgeSection}>
        <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '800' }}>Your Achievements</h3>
        <div style={styles.badgeScroll}>
          {achievementList.map((a, i) => (
            <AchievementBadge key={i} {...a} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper component for cleaner JSX
const StatCard = ({ icon, label, value, color }) => (
  <div style={{ ...styles.statCard, background: color }}>
    <span style={styles.icon}>{icon}</span>
    <h4 style={styles.statLabel}>{label}</h4>
    <h2 style={styles.statValue}>{value}</h2>
  </div>
);

const styles = {
  levelCard: { 
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', 
    padding: '30px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px',
    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
  },
  levelBadge: { 
    width: '75px', height: '75px', borderRadius: '20px', background: '#fff', 
    color: '#1e3a8a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
    fontSize: '28px', fontWeight: '900', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' 
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '25px' },
  statCard: { padding: '20px', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.02)' },
  icon: { fontSize: '24px', display: 'block', marginBottom: '8px' },
  statLabel: { margin: 0, fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' },
  statValue: { margin: '5px 0 0 0', fontSize: '28px', color: '#1e293b', fontWeight: '800' },
  badgeSection: { background: '#fff', padding: '25px', borderRadius: '24px', border: '1px solid #f1f5f9' },
  badgeScroll: { display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '15px', msOverflowStyle: 'none', scrollbarWidth: 'none' }
};