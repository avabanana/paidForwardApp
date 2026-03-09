import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged,
  signOut 
} from "firebase/auth";
import { 
  getFirestore, 
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

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [birthYear, setBirthYear] = useState('');
  
  // Achievement Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '' });

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
            setStats(prev => ({ ...prev, ...docSnap.data() }));
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

    const today = new Date().toISOString().slice(0, 10);
    if (stats.lastLogin === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    let nextStreak = stats.streak || 0;
    if (stats.lastLogin === yesterdayStr) {
      nextStreak += 1;
      triggerToast(`Streak Continued! 🔥 ${nextStreak} Days`);
    } else {
      nextStreak = 1; // Reset or Start streak
      triggerToast("Welcome Back! Day 1 Streak Started.");
    }

    updateData({ lastLogin: today, streak: nextStreak });
  }, [user, stats.username]); 

  const triggerToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 4000);
  };

  const updateData = async (updates) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, updates);
  };

  const handleGameEnd = (status) => {
    const xpGained = status === 'won' ? 250 : 50;
    const updates = {
      gamesPlayed: (stats.gamesPlayed || 0) + 1,
      xp: (stats.xp || 0) + xpGained
    };

    if (status === 'won') {
      updates.gameWins = (stats.gameWins || 0) + 1;
      triggerToast(`Victory! +${xpGained} XP 🏆`);
    } else {
      triggerToast(`Game Over. +${xpGained} XP`);
    }

    updateData(updates);
  };

  const handleCourseComplete = (courseId, title) => {
    const key = `course_${courseId}`;
    if (stats.courseProgressMap?.[key] >= 1) return;

    const updates = {
      coursesCompleted: (stats.coursesCompleted || 0) + 1,
      xp: (stats.xp || 0) + 500, // Higher reward for full course
      [`courseProgressMap.${key}`]: 1
    };

    triggerToast(`Achievement Unlocked: Mastered ${title || 'Course'}! 🎓`);
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
          streak: 1, tier, birthYear: numericYear, courseProgressMap: {}, lastLogin: new Date().toISOString().slice(0, 10)
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
      {toast.show && (
        <div style={styles.toast}>
          {toast.message}
        </div>
      )}
      <header style={styles.header}>
        <h1 style={styles.logo} onClick={() => setActiveTab('Home')}>PaidForward</h1>
        <nav style={styles.navBar}>
          {['Home', 'Courses', 'Games', 'Progress', 'Goals', 'Leagues', ...(stats.tier !== 'elementary' ? ['Discussion'] : []), 'Salary', 'Settings'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{...styles.navItem, color: activeTab === tab ? '#2563eb' : '#64748b'}}>{tab}</button>
          ))}
        </nav>
        <div style={styles.headerRight}>
          <div style={styles.userInfo}>
            <span style={styles.userNameDisplay}>{stats.username}</span>
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
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' },
  authBtn: { padding: '14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  switchText: { textAlign: 'center', marginTop: '15px', fontSize: '14px', cursor: 'pointer', color: '#2563eb' },
  container: { background: '#f1f5f9', minHeight: '100vh', fontFamily: 'sans-serif', position: 'relative' },
  header: { height: '70px', background: '#fff', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0' },
  logo: { color: '#2563eb', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer' },
  navBar: { display: 'flex', gap: '20px' },
  navItem: { background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '20px' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
  userNameDisplay: { fontWeight: 'bold', color: '#334155', fontSize: '14px' },
  streakDisplay: { background: '#fff7ed', color: '#ea580c', padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px', border: '1px solid #ffedd5' },
  logoutBtn: { padding: '8px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer', background: '#fff' },
  main: { padding: '30px' },
  toast: { position: 'fixed', bottom: '30px', right: '30px', background: '#1e293b', color: '#fff', padding: '15px 25px', borderRadius: '12px', boxShadow: '0 10px 15px rgba(0,0,0,0.2)', zIndex: 1000, animation: 'slideIn 0.3s ease-out' }
};

export default App;