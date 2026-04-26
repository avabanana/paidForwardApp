import React, { useState, useEffect, useContext } from 'react';
import { supabase } from './supabaseClient';
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

function App() {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('Home');
  const [achievementPopup, setAchievementPopup] = useState('');
  const [stats, setStats] = useState(EMPTY_STATS);

  const displayName = stats.username || user?.user_metadata?.username || user?.email?.split('@')[0] || 'Guest';

  const triggerAchievementPopup = (label) => {
    setAchievementPopup(label);
    setTimeout(() => setAchievementPopup(''), 3500);
  };

  useEffect(() => {
    if (!user) {
      setStats(EMPTY_STATS);
      return;
    }

    const fetchUserData = async () => {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setStats({
          ...EMPTY_STATS,
          ...data,
          username: data.username || user.user_metadata?.username || user.email?.split('@')[0],
        });
      }
    };

    fetchUserData();
  }, [user]);

  const updateData = async (updates) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id);

    if (!error) {
      setStats((prev) => {
        const next = { ...prev };
        Object.entries(updates).forEach(([key, value]) => {
          if (key === 'courseProgressMap' && typeof value === 'object') {
            next.courseProgressMap = { ...(prev.courseProgressMap || {}), ...value };
          } else {
            next[key] = value;
          }
        });
        return next;
      });
    }
  };

  useEffect(() => {
    if (!user || !stats.username) return;
    const today = new Date().toISOString().slice(0, 10);
    if (stats.lastLogin === today) return;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    const nextStreak = stats.lastLogin === yesterdayStr ? (stats.streak || 0) + 1 : 1;
    
    updateData({ lastLogin: today, streak: nextStreak });
  }, [user, stats.lastLogin, stats.streak, stats.username, updateData]);

  const handleGameEnd = (status) => {
    const updates = {
      gamesPlayed: (stats.gamesPlayed || 0) + 1,
      xp: (stats.xp || 0) + (status === 'won' ? 250 : 50)
    };
    if (status === 'won') updates.gameWins = (stats.gameWins || 0) + 1;
    updateData(updates);
  };

  const handleCourseComplete = (courseId) => {
    const key = `course_${courseId}`;
    const alreadyCompleted = stats.courseProgressMap?.[courseId] >= 1 || stats.courseProgressMap?.[key] >= 1;
    if (alreadyCompleted) return;
    
    const newCount = (stats.coursesCompleted || 0) + 1;
    const updates = { 
      coursesCompleted: newCount, 
      xp: (stats.xp || 0) + 150, 
      courseProgressMap: { ...stats.courseProgressMap, [key]: 1 } 
    };
    updateData(updates);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setActiveTab('Home');
  };

  const handleUsernameUpdate = (newName) => {
    setStats((prev) => ({ ...prev, username: newName }));
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home': return <HomeScreen userTier={stats.tier} onNavigate={(tab) => setActiveTab(tab)} />;
      case 'Courses': return <CoursesScreen courseProgressMap={stats.courseProgressMap} setCourseProgressMap={(id, prog) => updateData({ [`courseProgressMap.${id}`]: prog })} onCourseComplete={handleCourseComplete} userTier={stats.tier} username={displayName} />;
      case 'Games': return <GamesScreen userTier={stats.tier} onGameEnd={handleGameEnd} onNavigate={(tab) => setActiveTab(tab)} />;
      case 'Discussion': return <DiscussionScreen currentUser={displayName} streak={stats.streak} userId={user?.id} />;
      case 'Progress': return <ProgressScreen xp={stats.xp} gameWins={stats.gameWins} gamesPlayed={stats.gamesPlayed} streak={stats.streak} coursesCompleted={stats.coursesCompleted} userTier={stats.tier} userId={user?.id} achievements={stats.achievements || []} updateData={updateData} onAchievementUnlocked={triggerAchievementPopup} onNavigate={(tab) => setActiveTab(tab)} />;
      case 'Goals': return <GoalScreen currentUser={displayName} userTier={stats.tier} userId={user?.id} onAchievementUnlocked={triggerAchievementPopup} />;
      case 'Map': return <MapScreen />;
      case 'Leagues': return <LeagueScreen currentUser={displayName} userId={user?.id} />;
      case 'Salary': return <SalaryScreen />;
      case 'Settings': return <SettingsScreen currentUser={user} stats={stats} updateData={updateData} signOutCallback={handleSignOut} onUsernameUpdate={handleUsernameUpdate} />;
      default: return <HomeScreen onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  if (!user) {
    return <OnboardingScreen />;
  }

  return (
    <div style={styles.container}>
      {achievementPopup && <div style={styles.achievementToast}>🏆 {achievementPopup}</div>}

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
  achievementToast: { position:'fixed', top:'70px', right:'20px', background:'linear-gradient(135deg,#1f2937,#374151)', color:'#fff', borderRadius:'14px', padding:'14px 20px', boxShadow:'0 8px 24px rgba(0,0,0,0.3)', zIndex:9999, fontWeight:'700', fontSize:'15px', border:'1px solid rgba(255,255,255,0.1)', animation:'fadeInDown 0.3s ease' },
  container: { minHeight:'100vh', background:'linear-gradient(180deg, #eef7ff 0%, #f8fafc 35%, #ffffff 100%)', fontFamily:"'Inter', system-ui, sans-serif", paddingTop:'12px' },
  header: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '16px 24px', 
    margin: '0 12px 0 12px',
    borderRadius: '24px',
    background: 'linear-gradient(90deg, rgba(240,240,255,0.85), rgba(232,245,240,0.85), rgba(255,248,232,0.85), rgba(255,240,240,0.85))',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.7)',
    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
    position: 'sticky', 
    top: '0', 
    zIndex: 100 
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
  logo: { fontSize: '20px', fontWeight: '900', color: '#1e1b4b', cursor: 'pointer', margin: 0, letterSpacing: '-0.5px' },
  logoDot: { width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1' },
  navBar: { 
    display: 'flex', 
    gap: '4px', 
    background: 'rgba(255,255,255,0.55)', 
    padding: '6px', 
    borderRadius: '18px',
    border: '1px solid rgba(255,255,255,0.55)'
  },
  navItem: { 
    background: 'none', border: 'none', borderRadius: '12px', fontSize: '14px', 
    cursor: 'pointer', padding: '8px 16px', fontWeight: '700', transition: 'all 0.2s' 
  },
  headerRight: { display: 'flex', alignItems: 'center', gap: '14px' },
  userChip: { 
    display: 'flex', alignItems: 'center', gap: '10px', 
    padding: '4px 12px 4px 6px', borderRadius: '14px',
    background: 'rgba(255,255,255,0.4)',
    border: '1px solid rgba(255,255,255,0.5)'
  },
  userAvatar: { 
    width: '32px', height: '32px', borderRadius: '10px', 
    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', 
    fontWeight: '800', fontSize: '14px' 
  },
  usernameText: { fontWeight: '800', fontSize: '13px', color: '#1e1b4b' },
  streakText: { fontSize: '10px', color: '#64748b', fontWeight: '600' },
  settingsIconButton: { 
    fontSize: '20px', padding: '6px', 
    cursor: 'pointer', borderRadius: '10px', transition: 'all 0.2s',
    border: '1px solid rgba(255,255,255,0.4)'
  },
  logoutBtn: { 
    padding: '8px 16px', background: '#1e1b4b', color: '#fff', 
    border: 'none', borderRadius: '12px', cursor: 'pointer', 
    fontWeight: '700', fontSize: '13px' 
  },
  main: { padding:'24px' }
};

export default App;