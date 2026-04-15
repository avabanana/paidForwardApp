import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  deleteUser,
  updateProfile,
  setPersistence,
  browserSessionPersistence
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  collection,
  addDoc,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

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

const firebaseConfig = {
  apiKey: "AIzaSyD6VbFwVhA-nPGXyPRN9llr0lXIrSTqwtM",
  authDomain: "paidforward-42c2f.firebaseapp.com",
  projectId: "paidforward-42c2f",
  storageBucket: "paidforward-42c2f.firebasestorage.app",
  messagingSenderId: "171038802962",
  appId: "1:171038802962:web:ec70ec0f503bd9615a84cb",
  measurementId: "G-90HBZKHPC7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db, auth };

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
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [achievementPopup, setAchievementPopup] = useState('');
  const [stats, setStats] = useState(EMPTY_STATS);

  const triggerAchievementPopup = (label) => {
    setAchievementPopup(label);
    setTimeout(() => setAchievementPopup(''), 3500);
  };

  useEffect(() => {
    setPersistence(auth, browserSessionPersistence).catch(() => {});

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setStats(EMPTY_STATS);
        return;
      }

      setUser(currentUser);
      const userDocRef = doc(db, "users", currentUser.uid);
      const unsubscribeData = onSnapshot(userDocRef, (docSnap) => {
        const data = docSnap.exists() ? docSnap.data() : {};
        // Use Firebase Auth displayName as source of truth
        const resolvedUsername =
          currentUser.displayName ||
          data.username ||
          currentUser.email?.split('@')[0] ||
          'Guest';

        setStats((prev) => ({
          ...EMPTY_STATS,
          ...data,
          username: resolvedUsername,
          tier: data.tier || 'adult',
          courseProgressMap: { ...(data.courseProgressMap || {}) },
          achievements: data.achievements || [],
          lastLogin: data.lastLogin || null,
        }));
      });
      return () => unsubscribeData();
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user || !stats.username) return;
    const today = new Date().toISOString().slice(0, 10);
    if (stats.lastLogin === today) return;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    const nextStreak = stats.lastLogin === yesterdayStr ? (stats.streak || 0) + 1 : 1;
    setStats((prev) => ({ ...prev, lastLogin: today, streak: nextStreak }));
    updateData({ lastLogin: today, streak: nextStreak });
  }, [user, stats.lastLogin]);

  const updateData = async (updates) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userRef, updates);
    } catch (e) {
      await setDoc(doc(db, "users", user.uid), updates, { merge: true });
    }
    setStats((prev) => {
      const next = { ...prev };
      Object.entries(updates).forEach(([key, value]) => {
        if (key === 'courseProgressMap' && typeof value === 'object') {
          next.courseProgressMap = { ...(prev.courseProgressMap || {}), ...value };
        } else if (key.startsWith('courseProgressMap.')) {
          const field = key.replace('courseProgressMap.', '');
          next.courseProgressMap = { ...(prev.courseProgressMap || {}), [field]: value };
        } else {
          next[key] = value;
        }
      });
      return next;
    });
  };

  const handleGameEnd = (status) => {
    const updates = {
      gamesPlayed: (stats.gamesPlayed || 0) + 1,
      xp: (stats.xp || 0) + (status === 'won' ? 250 : 50)
    };
    if (status === 'won') updates.gameWins = (stats.gameWins || 0) + 1;
    setStats((prev) => ({ ...prev, ...updates }));
    updateData(updates);
  };

  const normalizeCourseKey = (id) => `course_${id}`;

  const handleCourseComplete = (courseId) => {
    const key = normalizeCourseKey(courseId);
    const alreadyCompleted = stats.courseProgressMap?.[courseId] >= 1 || stats.courseProgressMap?.[key] >= 1;
    if (alreadyCompleted) return;
    const newCount = (stats.coursesCompleted || 0) + 1;
    const updates = { coursesCompleted: newCount, xp: (stats.xp || 0) + 150, [`courseProgressMap.${key}`]: 1 };
    setStats((prev) => ({ ...prev, ...updates, courseProgressMap: { ...(prev.courseProgressMap || {}), [key]: 1 } }));
    updateData(updates);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setStats(EMPTY_STATS);
      setActiveTab('Home');
    } catch (err) { console.warn('Error signing out', err); }
  };

  const handleUsernameUpdate = (newName) => {
    setStats((prev) => ({ ...prev, username: newName }));
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      await setPersistence(auth, browserSessionPersistence);
      if (isSignUp) {
        if (!birthYear) throw new Error('Please enter your birth year.');
        if (!username.trim()) throw new Error('Please choose a username.');
        const numericYear = parseInt(birthYear, 10);
        const age = new Date().getFullYear() - numericYear;
        const tier = age >= 14 ? 'adult' : 'elementary';
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(res.user, { displayName: username.trim() });
        await setDoc(doc(db, "users", res.user.uid), {
          username: username.trim(), email, xp: 0, gameWins: 0, gamesPlayed: 0, coursesCompleted: 0,
          streak: 1, tier, birthYear: numericYear, courseProgressMap: {}, achievements: [],
          lastLogin: new Date().toISOString().slice(0, 10)
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) { alert(err.message); }
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home': return <HomeScreen userTier={stats.tier} onNavigate={(tab) => setActiveTab(tab)} />;
      case 'Courses': return <CoursesScreen courseProgressMap={stats.courseProgressMap} setCourseProgressMap={(id, prog) => updateData({ [`courseProgressMap.${id}`]: prog })} onCourseComplete={handleCourseComplete} userTier={stats.tier} username={stats.username} />;
      case 'Games': return <GamesScreen userTier={stats.tier} onGameEnd={handleGameEnd} onNavigate={(tab) => setActiveTab(tab)} />;
      case 'Discussion': return <DiscussionScreen currentUser={stats.username} streak={stats.streak} db={db} userId={user?.uid} />;
      case 'Progress': return <ProgressScreen xp={stats.xp} gameWins={stats.gameWins} gamesPlayed={stats.gamesPlayed} streak={stats.streak} coursesCompleted={stats.coursesCompleted} userTier={stats.tier} userId={user?.uid} db={db} achievements={stats.achievements || []} updateData={updateData} onAchievementUnlocked={triggerAchievementPopup} onNavigate={(tab) => setActiveTab(tab)} />;
      case 'Goals': return <GoalScreen currentUser={stats.username} userTier={stats.tier} userId={user?.uid} db={db} onAchievementUnlocked={triggerAchievementPopup} />;
      case 'Map': return <MapScreen />;
      case 'Leagues': return <LeagueScreen currentUser={stats.username} userId={user?.uid} db={db} />;
      case 'Salary': return <SalaryScreen />;
      case 'Settings': return <SettingsScreen currentUser={user} stats={stats} updateData={updateData} signOutCallback={handleSignOut} onUsernameUpdate={handleUsernameUpdate} db={db} />;
      default: return <HomeScreen onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  if (!user) {
    return (
      <div style={styles.authPage}>
        <div style={styles.blob1} /><div style={styles.blob2} /><div style={styles.blob3} />
        <style>{`input::placeholder { color: rgba(255,255,255,0.75) !important; opacity: 1; } @keyframes fadeInDown { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }`}</style>
        <div style={styles.authCard}>
          <div style={styles.brandBar}>
            <div style={styles.logoWrap}><span style={styles.logoIcon}>💸</span><h1 style={styles.authLogo}>PaidForward</h1></div>
            <p style={styles.authSubtitle}>Learn money, play games, and build lifetime habits.</p>
            <div style={styles.pillRow}><span style={styles.pill}>📈 Investing</span><span style={styles.pill}>💰 Saving</span><span style={styles.pill}>🎮 Games</span></div>
          </div>
          <form style={styles.authForm} onSubmit={handleAuth}>
            {isSignUp && (
              <><div style={styles.inputWrap}><span style={styles.inputIcon}>👤</span><input style={styles.input} placeholder="Choose a username" value={username} onChange={(e) => setUsername(e.target.value)} /></div>
                <div style={styles.inputWrap}><span style={styles.inputIcon}>🎂</span><input style={styles.input} type="number" min="1900" max={new Date().getFullYear()} placeholder="Birth year" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} /></div></>
            )}
            <div style={styles.inputWrap}><span style={styles.inputIcon}>✉️</span><input style={styles.input} type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
            <div style={styles.inputWrap}><span style={styles.inputIcon}>🔒</span><input style={styles.input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
            <button type="submit" style={styles.authBtn}>{isSignUp ? '🚀 Create Free Account' : '✨ Sign In'}</button>
          </form>
          <p style={styles.switchText} onClick={() => setIsSignUp(!isSignUp)}>{isSignUp ? 'Already have an account? Sign In →' : "New here? Create an account →"}</p>
        </div>
      </div>
    );
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
            <span style={styles.userAvatar}>{(stats.username || 'G')[0].toUpperCase()}</span>
            <div style={{ textAlign: 'left' }}>
              <div style={styles.usernameText}>{stats.username || 'Guest'}</div>
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
  // Logic-preserving Auth Styles
  authPage: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 70%, #7c3aed 100%)', fontFamily:"'Inter', system-ui, sans-serif", position:'relative', overflow:'hidden' },
  blob1: { position:'absolute', top:'-80px', left:'-80px', width:'320px', height:'320px', borderRadius:'50%', background:'rgba(139,92,246,0.35)', filter:'blur(60px)', zIndex:0 },
  blob2: { position:'absolute', bottom:'-60px', right:'-60px', width:'280px', height:'280px', borderRadius:'50%', background:'rgba(99,102,241,0.4)', filter:'blur(50px)', zIndex:0 },
  blob3: { position:'absolute', top:'40%', left:'60%', width:'200px', height:'200px', borderRadius:'50%', background:'rgba(236,72,153,0.25)', filter:'blur(50px)', zIndex:0 },
  authCard: { background:'rgba(255,255,255,0.08)', backdropFilter:'blur(24px)', padding:'44px 40px', borderRadius:'28px', boxShadow:'0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)', maxWidth:'420px', width:'100%', position:'relative', zIndex:1, border:'1px solid rgba(255,255,255,0.15)' },
  brandBar: { textAlign:'center', marginBottom:'32px' },
  logoWrap: { display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', marginBottom:'10px' },
  logoIcon: { fontSize:'36px' },
  authLogo: { fontSize:'34px', fontWeight:'800', margin:0, color:'#fff', letterSpacing:'-0.5px' },
  authSubtitle: { color:'rgba(255,255,255,0.75)', fontSize:'15px', margin:'8px 0 16px' },
  pillRow: { display:'flex', gap:'8px', justifyContent:'center', flexWrap:'wrap' },
  pill: { background:'rgba(255,255,255,0.15)', color:'#fff', borderRadius:'999px', padding:'4px 12px', fontSize:'12px', fontWeight:'600', border:'1px solid rgba(255,255,255,0.2)' },
  authForm: { display:'flex', flexDirection:'column', gap:'14px' },
  inputWrap: { display:'flex', alignItems:'center', gap:'10px', background:'rgba(255,255,255,0.12)', borderRadius:'14px', padding:'4px 14px', border:'1px solid rgba(255,255,255,0.2)' },
  inputIcon: { fontSize:'18px' },
  input: { flex:1, padding:'13px 4px', background:'transparent', border:'none', color:'#fff', fontSize:'15px', outline:'none' },
  authBtn: { padding:'16px', borderRadius:'14px', border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', fontSize:'16px', fontWeight:'700', cursor:'pointer', boxShadow:'0 8px 24px rgba(99,102,241,0.5)', marginTop:'4px' },
  switchText: { textAlign:'center', marginTop:'20px', cursor:'pointer', color:'rgba(255,255,255,0.7)', fontSize:'14px', fontWeight:'600' },
  achievementToast: { position:'fixed', top:'70px', right:'20px', background:'linear-gradient(135deg,#1f2937,#374151)', color:'#fff', borderRadius:'14px', padding:'14px 20px', boxShadow:'0 8px 24px rgba(0,0,0,0.3)', zIndex:9999, fontWeight:'700', fontSize:'15px', border:'1px solid rgba(255,255,255,0.1)', animation:'fadeInDown 0.3s ease' },
  
  // THEMED NAV BAR
  container: { minHeight:'100vh', background:'#f8fafc', fontFamily:"'Inter', system-ui, sans-serif" },
  header: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '12px 24px', 
    margin: '12px 12px 0 12px',
    borderRadius: '24px',
    // Theme-matching gradient shift
    background: 'linear-gradient(90deg, rgba(240,240,255,0.7), rgba(232,245,240,0.7), rgba(255,248,232,0.7), rgba(255,240,240,0.7))',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.6)',
    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
    position: 'sticky', 
    top: '12px', 
    zIndex: 100 
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
  logo: { fontSize: '20px', fontWeight: '900', color: '#1e1b4b', cursor: 'pointer', margin: 0, letterSpacing: '-0.5px' },
  logoDot: { width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1' },
  navBar: { 
    display: 'flex', 
    gap: '4px', 
    background: 'rgba(255,255,255,0.3)', 
    padding: '4px', 
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.4)'
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
    border: 'none', fontSize: '20px', padding: '6px', 
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