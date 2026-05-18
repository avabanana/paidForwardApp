// app.jsx
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './context/UserContext';

import HomeScreen from './screens/HomeScreen.jsx';
import CoursesScreen from './screens/CoursesScreen.jsx';
import GamesScreen from './screens/GamesScreen.jsx';
import DiscussionScreen from './screens/DiscussionScreen.jsx';
import ProgressScreen from './screens/ProgressScreen.jsx';
import GoalScreen from './screens/GoalScreen.jsx';
import SalaryScreen from './screens/SalaryScreen.jsx';
import LeagueScreen from './screens/LeagueScreen.jsx';
import MapScreen from './screens/MapScreen.jsx';
import SettingsScreen from './screens/SettingsScreen.jsx';
import OnboardingScreen from './screens/OnboardingScreen.jsx';
import WelcomeScreen from './screens/WelcomeScreen.jsx';
import TourOverlay from './components/TourOverlay.jsx';

const EMPTY_STATS = {
  xp: 0,
  gameWins: 0,
  gamesPlayed: 0,
  coursesCompleted: 0,
  streak: 0,
  tier: 'adult',
  username: '',
  courseProgressMap: {},
  birthYear: null,
  lastLogin: null,
  achievements: []
};

// Helpers to read/write the user record directly in PAIDFORWARD_USERS
const getLocalUsers = () => JSON.parse(localStorage.getItem('PAIDFORWARD_USERS') || '[]');
const saveLocalUsers = (users) => localStorage.setItem('PAIDFORWARD_USERS', JSON.stringify(users));

const persistUser = (updated) => {
  const users = getLocalUsers();
  const idx = users.findIndex(u => u.id === updated.id);
  if (idx !== -1) {
    users[idx] = updated;
  } else {
    users.push(updated);
  }
  saveLocalUsers(users);
  localStorage.setItem('PAIDFORWARD_CURRENT_USER', JSON.stringify(updated));
};

function App() {
  const { user, signIn, signOut } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('Home');
  const [achievementPopup, setAchievementPopup] = useState('');
  const [stats, setStats] = useState(EMPTY_STATS);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);

  const displayName = stats.username || user?.username || 'Guest';

  const triggerAchievementPopup = (label) => {
    setAchievementPopup(label);
    setTimeout(() => setAchievementPopup(''), 3500);
  };

  // When user logs in, load their stats from PAIDFORWARD_USERS
  useEffect(() => {
    if (!user) {
      setStats(EMPTY_STATS);
      return;
    }

    const users = getLocalUsers();
    const fresh = users.find(u => u.id === user.id);
    if (fresh) {
      const { password: _pw, ...safeStats } = fresh;
      setStats(prev => ({ ...prev, ...safeStats }));
    } else {
      // Fallback: use whatever came in from signIn
      const { password: _pw, ...safeStats } = user;
      setStats(prev => ({ ...prev, ...safeStats }));
    }

    // Show welcome screen for brand new accounts (no prior welcome_shown flag)
    const hasSeenWelcome = localStorage.getItem(`welcome_shown_${user.id}`);
    const isNew = !user.lastLogin || user.createdAt === user.lastLogin;
    if (!hasSeenWelcome && isNew) {
      setShowWelcome(true);
    }
  }, [user]);

  // Persist stats changes back to storage whenever stats updates
  const updateData = (updates) => {
    if (!user) return;

    setStats(prev => {
      const next = { ...prev };
      Object.entries(updates).forEach(([key, value]) => {
        if (key === 'courseProgressMap' && typeof value === 'object') {
          next.courseProgressMap = { ...(prev.courseProgressMap || {}), ...value };
        } else {
          next[key] = value;
        }
      });
      // Write the full merged record back to PAIDFORWARD_USERS
      persistUser({ ...next, id: user.id, password: _getPassword(user.id) });
      return next;
    });
  };

  // Helper: fetch password without exposing it in state
  const _getPassword = (id) => {
    const users = getLocalUsers();
    return users.find(u => u.id === id)?.password || '';
  };

  // Daily streak logic
  useEffect(() => {
    if (!user || !stats.username) return;
    const today = new Date().toISOString().slice(0, 10);
    if (stats.lastLogin === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    const nextStreak = stats.lastLogin === yesterdayStr ? (stats.streak || 0) + 1 : 1;

    updateData({ lastLogin: today, streak: nextStreak });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, stats.lastLogin]);

  const handleGameEnd = (status) => {
    const updates = {
      gamesPlayed: (parseInt(stats.gamesPlayed, 10) || 0) + 1,
      xp: (parseInt(stats.xp, 10) || 0) + (status === 'won' ? 250 : 50)
    };
    if (status === 'won') updates.gameWins = (parseInt(stats.gameWins, 10) || 0) + 1;
    updateData(updates);
  };

  const handleCourseComplete = (courseId) => {
    const key = `course_${courseId}`;
    if (stats.courseProgressMap?.[key] >= 1) return;
    updateData({
      coursesCompleted: (parseInt(stats.coursesCompleted, 10) || 0) + 1,
      xp: (parseInt(stats.xp, 10) || 0) + 150,
      courseProgressMap: { ...stats.courseProgressMap, [key]: 1 }
    });
  };

  const handleSignOut = () => {
    signOut();
    setActiveTab('Home');
  };

  const handleWelcomeComplete = (result) => {
    setShowWelcome(false);
    localStorage.setItem(`welcome_shown_${user?.id}`, 'true');
    if (result?.startTour) setShowTour(true);
  };

  const handleUsernameUpdate = (newName) => {
    setStats(prev => ({ ...prev, username: newName }));
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':     return <HomeScreen userTier={stats.tier} onNavigate={(tab) => setActiveTab(tab)} />;
      case 'Courses':  return <CoursesScreen courseProgressMap={stats.courseProgressMap} setCourseProgressMap={(progressKey, value) => updateData({ courseProgressMap: { ...(stats.courseProgressMap || {}), [progressKey]: value } })} onCourseComplete={handleCourseComplete} userTier={stats.tier} username={displayName} />;
      case 'Games':    return <GamesScreen userTier={stats.tier} onGameEnd={handleGameEnd} onNavigate={(tab) => setActiveTab(tab)} />;
      case 'Discussion': return <DiscussionScreen currentUser={displayName} streak={stats.streak} userId={user?.id} />;
      case 'Progress': return <ProgressScreen xp={stats.xp} gameWins={stats.gameWins} gamesPlayed={stats.gamesPlayed} streak={stats.streak} coursesCompleted={stats.coursesCompleted} userTier={stats.tier} userId={user?.id} achievements={stats.achievements || []} updateData={updateData} onAchievementUnlocked={triggerAchievementPopup} onNavigate={(tab) => setActiveTab(tab)} />;
      case 'Goals':    return <GoalScreen currentUser={displayName} userTier={stats.tier} userId={user?.id} onAchievementUnlocked={triggerAchievementPopup} />;
      case 'Map':      return <MapScreen />;
      case 'Leagues':  return <LeagueScreen currentUser={displayName} userId={user?.id} />;
      case 'Salary':   return <SalaryScreen />;
      case 'Settings': return <SettingsScreen currentUser={user} stats={stats} updateData={updateData} signOutCallback={handleSignOut} onUsernameUpdate={handleUsernameUpdate} />;
      default:         return <HomeScreen onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  if (!user) {
    return <OnboardingScreen onAuth={signIn} />;
  }

  return (
    <div style={styles.container}>
      {achievementPopup && <div style={styles.achievementToast}>🏆 {achievementPopup}</div>}

      {showWelcome && (
        <WelcomeScreen
          username={displayName}
          onWelcomeComplete={handleWelcomeComplete}
          userTier={stats.tier}
        />
      )}

      {showTour && (
        <TourOverlay onTourComplete={() => setShowTour(false)} />
      )}

      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.logo} onClick={() => setActiveTab('Home')}>PaidForward</h1>
          <div style={styles.logoDot} />
        </div>

        <nav style={styles.navBar}>
          {[
            'Home', 'Courses', 'Games', 'Progress',
            ...(stats.tier !== 'elementary' ? ['Discussion'] : [])
          ].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                data-tour={tab.toLowerCase()}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...styles.navItem,
                  color: isActive ? '#4338ca' : '#94a3b8',
                  background: isActive ? 'rgba(255,255,255,0.7)' : 'transparent',
                  boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.03)' : 'none'
                }}
              >
                {tab}
              </button>
            );
          })}
        </nav>

        <div style={styles.headerRight}>
          <button onClick={() => setActiveTab('Settings')} style={{ ...styles.settingsIconButton, background: activeTab === 'Settings' ? '#fff' : 'transparent' }}>⚙️</button>
          <div style={styles.userChip}>
            <span style={styles.userAvatar}>{(displayName || 'G')[0].toUpperCase()}</span>
            <div style={{ textAlign: 'left' }}>
              <div style={styles.usernameText}>{displayName}</div>
              <div style={styles.streakText}>🔥 {stats.streak || 1} day streak</div>
            </div>
          </div>
          <button onClick={handleSignOut} style={styles.logoutBtn}>Logout</button>
        </div>
      </header>

      <main style={styles.main}>{renderScreen()}</main>
    </div>
  );
}

const styles = {
  achievementToast: { position: 'fixed', top: '70px', right: '20px', background: 'linear-gradient(135deg,#1f2937,#374151)', color: '#fff', borderRadius: '14px', padding: '14px 20px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', zIndex: 9999, fontWeight: '700', fontSize: '15px', border: '1px solid rgba(255,255,255,0.1)', animation: 'fadeInDown 0.3s ease' },
  container: { minHeight: '100vh', background: 'linear-gradient(180deg, #eef7ff 0%, #f8fafc 35%, #ffffff 100%)', fontFamily: "'Inter', system-ui, sans-serif", paddingTop: '12px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', margin: '0 12px 0 12px', borderRadius: '24px', background: 'linear-gradient(90deg, rgba(240,240,255,0.85), rgba(232,245,240,0.85), rgba(255,248,232,0.85), rgba(255,240,240,0.85))', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.7)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)', position: 'sticky', top: '0', zIndex: 100 },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
  logo: { fontSize: '20px', fontWeight: '900', color: '#1e1b4b', cursor: 'pointer', margin: 0, letterSpacing: '-0.5px' },
  logoDot: { width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1' },
  navBar: { display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.55)', padding: '6px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.55)' },
  navItem: { background: 'none', border: 'none', borderRadius: '12px', fontSize: '14px', cursor: 'pointer', padding: '8px 16px', fontWeight: '700', transition: 'all 0.2s' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '14px' },
  userChip: { display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 12px 4px 6px', borderRadius: '14px', background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.5)' },
  userAvatar: { width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px' },
  usernameText: { fontWeight: '800', fontSize: '13px', color: '#1e1b4b' },
  streakText: { fontSize: '10px', color: '#64748b', fontWeight: '600' },
  settingsIconButton: { fontSize: '20px', padding: '6px', cursor: 'pointer', borderRadius: '10px', transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.4)' },
  logoutBtn: { padding: '8px 16px', background: '#1e1b4b', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' },
  main: { padding: '24px' }
};

export default App;
