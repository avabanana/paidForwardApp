import React from 'react';
import ProgressBar from '../components/ProgressBar';

const AchievementBadge = ({ icon, title, requirement, achieved }) => (
  <div 
    style={{
      ...styles.badge, 
      opacity: achieved ? 1 : 0.4,
      filter: achieved ? 'none' : 'grayscale(100%)',
    }} 
    title={achieved ? `Unlocked: ${requirement}` : `Locked: ${requirement}`}
  ) {
    return (
      <div style={styles.badgeContent}>
        <div style={styles.badgeIcon}>{icon}</div>
        <div style={styles.badgeText}>{title}</div>
        {achieved && <div style={styles.checkMark}>✓</div>}
      </div>
    );
  }
};

export default function ProgressScreen({ 
  courseProgressMap = {}, 
  coursesCompleted = 0, 
  gamesPlayed = 0, 
  gameWins = 0, // Added gameWins prop
  xp = 0,
  streak = 0    // Added streak prop
}) {
  // derive level and xp progress
  const level = Math.floor(xp / 1000) + 1;
  const xpThisLevel = xp - (level - 1) * 1000;
  const xpProgress = Math.min(xpThisLevel / 1000, 1);

  const achievementList = [];
  if (coursesCompleted > 0) achievementList.push({ icon: '🌱', title: 'Early Bird', color: '#dcfce7' });
  if (gamesPlayed > 0) achievementList.push({ icon: '💰', title: 'Budget King', color: '#fef3c7' });
  if (globalProgress > 0) achievementList.push({ icon: '🧠', title: 'Quiz Whiz', color: '#e0e7ff' });
  if (xp >= 1500) achievementList.push({ icon: '🤝', title: 'Helper', color: '#fae8ff' });

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
          <h4 style={styles.statLabel}>Modules Completed</h4>
          <h2 style={styles.statValue}>{coursesCompleted}</h2>
        </div>
        <div style={{ ...styles.statCard, background: '#f0f4ff' }}>
          <span style={styles.icon}>🏆</span>
          <h4 style={styles.statLabel}>Game Wins</h4>
          <h2 style={styles.statValue}>{gameWins}</h2>
        </div>
        <div style={{ ...styles.statCard, background: '#fff0f6' }}>
          <span style={styles.icon}>💎</span>
          <h4 style={styles.statLabel}>Total XP</h4>
          <h2 style={styles.statValue}>{xp}</h2>
        </div>
        <div style={{ ...styles.statCard, background: '#fffaf0' }}>
          <span style={styles.icon}>🔥</span>
          <h4 style={styles.statLabel}>Day Streak</h4>
          <h2 style={styles.statValue}>{streak}</h2>
        </div>
      </div>

      {/* Badges Section */}
      <div style={styles.badgeSection}>
        <h3 style={{ marginBottom: '5px' }}>Your Achievements</h3>
        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '15px' }}>
          Hover over a badge to see how you earned it!
        </p>
        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
          {achievementList.length > 0 ? (
            achievementList.map((a, i) => <Badge key={i} icon={a.icon} title={a.title} color={a.color} />)
          ) : (
            <span style={{ color: '#64748b' }}>No badges yet. Keep learning to unlock them!</span>
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