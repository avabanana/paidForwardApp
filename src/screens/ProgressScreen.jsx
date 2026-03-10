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
    <div style={{ padding: '10px' }}>
      {/* Level Header */}
      <div style={styles.levelCard}>
        <div style={styles.levelBadge}>LVL {currentLevel}</div>
        <div style={{ textAlign: 'left', flex: 1 }}>
          <h2 style={{ margin: 0, color: '#fff' }}>
            {userTier === 'elementary' ? 'Junior Builder' : 'Wealth Builder'}
          </h2>
          <p style={{ color: '#e0f2fe', margin: '5px 0' }}>
            {xpIntoLevel} / 1000 XP to Level {currentLevel + 1}
          </p>
          <ProgressBar progress={levelProgress} />
        </div>
      </div>

      {/* Grid Stats */}
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
          <h4 style={styles.statLabel}>XP</h4>
          <h2 style={styles.statValue}>{xp}</h2>
        </div>
        <div style={{ ...styles.statCard, background: '#fffaf0' }}>
          <span style={styles.icon}>🔥</span>
          <h4 style={styles.statLabel}>Streak</h4>
          <h2 style={styles.statValue}>{streak}</h2>
        </div>
      </div>

      {/* Badges Section */}
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