import React from 'react';
import ProgressBar from '../components/ProgressBar';

const AchievementBadge = ({ icon, title, requirement, achieved, color, isGoal }) => (
  <div
    style={{
      minWidth: '110px',
      padding: '15px',
      borderRadius: '16px',
      background: color,
      textAlign: 'center',
      border: isGoal ? '2px solid #fbbf24' : '1px solid rgba(0,0,0,0.05)',
      opacity: achieved ? 1 : 0.5,
      filter: achieved ? 'none' : 'grayscale(100%)',
      position: 'relative',
      boxShadow: isGoal ? '0 4px 12px rgba(251, 191, 36, 0.2)' : 'none'
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
          background: isGoal ? '#fbbf24' : '#10b981',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 'bold'
        }}
      >
        {isGoal ? '★' : '✓'}
      </div>
    )}
  </div>
);

export default function ProgressScreen({ 
  courseProgressMap = {}, 
  coursesCompleted = 0, 
  gamesPlayed = 0, 
  gameWins = 0, // Added gameWins prop
  xp = 0,
  streak = 0    // Added streak prop
}) {
  const currentLevel = Math.floor(xp / 1000) + 1;
  const xpIntoLevel = xp % 1000;
  const levelProgress = xpIntoLevel / 1000;

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

  const standardAchievements = [
    {
      icon: '🌱',
      title: 'Early Bird',
      requirement: 'Complete 1 module',
      achieved: coursesCompleted > 0,
      color: '#dcfce7'
    },
    {
      icon: '🎓',
      title: 'Graduate',
      requirement: 'Finish a course',
      achieved: coursesCompleted > 0,
      color: '#e0f2fe'
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
      icon: '💎',
      title: 'XP Master',
      requirement: 'Earn 1500 XP',
      achieved: xp >= 1500,
      color: '#fae8ff'
    }
  ];

  const userGoals = goalBadges.map((badge) => ({
    icon: '🎯',
    title: badge,
    requirement: 'Goal Met',
    achieved: true,
    isGoal: true,
    color: '#fffbeb'
  }));

  return (
    <div style={{ padding: '10px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={styles.levelCard}>
        <div style={styles.levelBadge}>
          <span style={{fontSize: '12px', display: 'block'}}>LVL</span>
          {currentLevel}
        </div>
        <div style={{ textAlign: 'left', flex: 1 }}>
          <h2 style={{ margin: 0, color: '#fff' }}>
            {userTier === 'elementary' ? 'Junior Builder' : 'Wealth Builder'}
          </h2>
          <h2 style={{ margin: 0, color: '#fff' }}>
            {userTier === 'elementary' ? 'Junior Builder' : 'Wealth Builder'}
          </h2>
          <p style={{ color: '#e0f2fe', margin: '5px 0' }}>
            {xpIntoLevel} / 1000 XP to Level {currentLevel + 1}
          </p>
          <ProgressBar progress={levelProgress} />
        </div>
      </div>

      <div style={styles.grid}>
        <div style={{ ...styles.statCard, background: '#ebf8ff' }}>
          <span style={styles.icon}>🎓</span>
          <h4 style={styles.statLabel}>Modules</h4>
          <h2 style={styles.statValue}>{coursesCompleted}</h2>
        </div>
        <div style={{ ...styles.statCard, background: '#f0f4ff' }}>
          <span style={styles.icon}>🎮</span>
          <h4 style={styles.statLabel}>Wins</h4>
          <h2 style={styles.statValue}>{gameWins}</h2>
        </div>
        <div style={{ ...styles.statCard, background: '#fff0f6' }}>
          <span style={styles.icon}>💎</span>
          <h4 style={styles.statLabel}>Total XP</h4>
          <h2 style={styles.statValue}>{xp}</h2>
        </div>
        <div style={{ ...styles.statCard, background: '#fffaf0' }}>
          <span style={styles.icon}>🔥</span>
          <h4 style={styles.statLabel}>Streak</h4>
          <h2 style={styles.statValue}>{streak}</h2>
        </div>
      </div>

      <div style={styles.badgeSection}>
        <h3 style={{ marginBottom: '15px' }}>Achievements & Goals</h3>
        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
          {/* Render Standard first, then Goals */}
          {[...standardAchievements, ...userGoals].map((a, i) => (
            <AchievementBadge
              key={i}
              icon={a.icon}
              title={a.title}
              requirement={a.requirement}
              achieved={a.achieved}
              color={a.color}
              isGoal={a.isGoal}
            />
          ))}
          {standardAchievements.length === 0 && userGoals.length === 0 && (
            <span style={{ color: '#64748b' }}>No badges yet</span>
          )}
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