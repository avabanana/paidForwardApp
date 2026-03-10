import React, { useState, useEffect } from 'react';

// Import auth and db from your new firebase.js file
import { auth, db } from './firebase'; 

// Keep the specific Firebase functions you need for App.jsx logic
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged,
  signOut 
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  onSnapshot, 
  updateDoc 
} from "firebase/firestore";

import HomeScreen from './screens/HomeScreen.jsx';
import CoursesScreen from './screens/CoursesScreen.jsx';
import GamesScreen from './screens/GamesScreen.jsx';
import DiscussionScreen from './screens/DiscussionScreen.jsx';
import ProgressScreen from './screens/ProgressScreen.jsx'; 
import GoalScreen from './screens/GoalScreen.jsx';
import SalaryScreen from './screens/SalaryScreen.jsx';
import LeagueScreen from './screens/LeagueScreen.jsx';
import SettingsScreen from './screens/SettingsScreen.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [birthYear, setBirthYear] = useState('');
  
  const [notification, setNotification] = useState(null);

  const [stats, setStats] = useState({
    xp: 0,
    gameWins: 0,
    gamesPlayed: 0,
    coursesCompleted: 0,
    streak: 0,
    tier: 'adult',
    username: '',
    courseProgressMap: {},
    birthYear: null,
    lastLogin: null
  });

  // Listener for Data
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const unsubscribeData = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setStats(prev => ({
              ...prev,
              ...data
            }));
          }
        });
        return () => unsubscribeData();
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Updated Streak Logic
  useEffect(() => {
    if (!user || !stats.username) return;

    const now = new Date();
    const todayStr = now.toLocaleDateString('en-CA'); 
    
    if (stats.lastLogin === todayStr) return;

    const lastLoginDate = stats.lastLogin ? new Date(stats.lastLogin) : null;
    let nextStreak = stats.streak || 0;

    if (lastLoginDate) {
      const diffTime = Math.abs(now - lastLoginDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        nextStreak += 1;
      } else if (diffDays > 1) {
        nextStreak = 1;
      }
    } else {
      nextStreak = 1;
    }

    updateData({ lastLogin: todayStr, streak: nextStreak });
  }, [user, stats.lastLogin]);

  const updateData = async (updates) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, updates);
  };

  const triggerNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleGameEnd = (status) => {
    const xpGain = status === 'won' ? 250 : 50;
    const updates = {
      gamesPlayed: (stats.gamesPlayed || 0) + 1,
      xp: stats.xp + xpGain
    };

    if (status === 'won') {
      updates.gameWins = (stats.gameWins || 0) + 1;
      triggerNotification("🏆 Achievement Unlocked: Budget King!");
    }

    setStats(prev => ({ ...prev, ...updates }));
    updateData(updates);
  };

  const normalizeCourseKey = (id) => `course_${id}`;

  const handleCourseComplete = (courseId) => {
    const key = normalizeCourseKey(courseId);
    const alreadyCompleted = stats.courseProgressMap?.[key] === 1;
    if (alreadyCompleted) return;

    const updates = {
      coursesCompleted: (stats.coursesCompleted || 0) + 1,
      xp: (stats.xp || 0) + 500, // Higher reward for full course
      [`courseProgressMap.${key}`]: 1
    };

    triggerNotification("🎓 Course Mastered! +150 XP");

    setStats(prev => ({
      ...prev,
      ...updates,
      courseProgressMap: { ...(prev.courseProgressMap || {}), [key]: 1 }
    }));

    updateData(updates);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        if (!birthYear) throw new Error('Please enter your birth year.');
        const numericYear = parseInt(birthYear, 10);
        const age = new Date().getFullYear() - numericYear;
        const tier = age >= 14 ? 'adult' : 'elementary';

        const res = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", res.user.uid), {
          username, email, xp: 0, gameWins: 0, gamesPlayed: 0, coursesCompleted: 0,
          streak: 1, tier, birthYear: numericYear, courseProgressMap: {}, lastLogin: new Date().toLocaleDateString('en-CA')
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) { alert(err.message); }
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home': return <HomeScreen onNavigate={(tab) => setActiveTab(tab)} />;
      case 'Courses': 
        return <CoursesScreen 
          courseProgressMap={stats.courseProgressMap || {}} 
          updateCourseProgress={(id, prog) => updateData({ [`courseProgressMap.course_${id}`]: prog })} 
          onCourseComplete={handleCourseComplete}
          userTier={stats.tier} 
          username={stats.username} 
        />;
      case 'Games': return <GamesScreen userTier={stats.tier} onGameEnd={handleGameEnd} />;
      case 'Discussion': return <DiscussionScreen currentUser={stats.username} streak={stats.streak} />;
      case 'Progress': 
        return <ProgressScreen 
          xp={stats.xp} 
          gameWins={stats.gameWins} 
          gamesPlayed={stats.gamesPlayed}
          streak={stats.streak} 
          coursesCompleted={stats.coursesCompleted}
          userTier={stats.tier}
          username={stats.username}
        />;
      case 'Goals': return <GoalScreen />;
      case 'Leagues': return <LeagueScreen currentUser={stats.username} />;
      case 'Salary': return <SalaryScreen />;
      case 'Settings': return <SettingsScreen currentUser={user} stats={stats} updateData={updateData} />;
      default: return <HomeScreen onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  if (!user) {
    return (
      <div style={styles.authPage}>
        <div style={styles.authCard}>
          <h1 style={styles.authLogo}>PaidForward</h1>
          <form style={styles.authForm} onSubmit={handleAuth}>
            {isSignUp && (
              <>
                <input style={styles.input} placeholder="Username" onChange={e => setUsername(e.target.value)} />
                <input
                  style={styles.input}
                  type="number"
                  placeholder="Birth Year"
                  value={birthYear}
                  onChange={e => setBirthYear(e.target.value)}
                />
              </>
            )}
            <input style={styles.input} type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <input style={styles.input} type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            <button type="submit" style={styles.authBtn}>{isSignUp ? "Sign Up" : "Sign In"}</button>
          </form>
          <p style={styles.switchText} onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Already have an account? Sign In" : "New? Create Account"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {notification && (
        <div style={styles.notificationToast}>
          {notification}
        </div>
      )}

      <header style={styles.header}>
        <h1 style={styles.logo} onClick={() => setActiveTab('Home')}>PaidForward</h1>
        <nav style={styles.navBar}>
          {[
            'Home', 'Courses', 'Games', 'Progress', 'Goals', 'Leagues',
            ...(stats.tier !== 'elementary' ? ['Discussion'] : []),
            'Salary', 'Settings'
          ].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{...styles.navItem, color: activeTab === tab ? '#2563eb' : '#64748b'}}>{tab}</button>
          ))}
        </nav>
        <div style={styles.headerRight}>
          <div style={styles.userBadge}>
            <span style={styles.usernameText}>👤 {stats.username || 'User'}</span>
            <div style={styles.streakDisplay}>🔥 {stats.streak}</div>
          </div>
          <button onClick={() => signOut(auth)} style={styles.logoutBtn}>Logout</button>
        </div>
      </header>
      <main style={styles.main}>{renderScreen()}</main>
    </div>
  );
}

const styles = {
  // ... existing styles ...
  authPage: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'sans-serif' },
  authCard: { background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '350px' },
  authLogo: { color: '#2563eb', textAlign: 'center', marginBottom: '20px' },
  authForm: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box', width: '100%' },
  authBtn: { padding: '14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  switchText: { textAlign: 'center', marginTop: '15px', fontSize: '14px', cursor: 'pointer', color: '#2563eb' },
  container: { background: '#f1f5f9', minHeight: '100vh', fontFamily: 'sans-serif', position: 'relative' },
  container: { background: '#f1f5f9', minHeight: '100vh', fontFamily: 'sans-serif', position: 'relative' },
  header: { height: '70px', background: '#fff', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0' },
  logo: { color: '#2563eb', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer' },
  navBar: { display: 'flex', gap: '20px' },
  navItem: { background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '15px' },
  userBadge: { display: 'flex', alignItems: 'center', gap: '10px', padding: '5px 15px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' },
  usernameText: { fontSize: '14px', fontWeight: '700', color: '#1e293b' },
  streakDisplay: { color: '#ea580c', fontWeight: 'bold', fontSize: '14px' },
  logoutBtn: { padding: '8px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer', background: '#fff', fontSize: '13px' },
  main: { padding: '30px' },
  notificationToast: {
    position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
    background: '#1e293b', color: '#fff', padding: '15px 30px', borderRadius: '50px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 1000, fontWeight: 'bold',
    animation: 'slideDown 0.5s ease-out'
  }
};

export default App;