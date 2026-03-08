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
  
  const [stats, setStats] = useState({
    xp: 0,
    gameWins: 0,
    coursesCompleted: 0,
    streak: 0,
    tier: 'adult',
    username: '',
    courseProgressMap: {}
  });

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const unsubscribeData = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setStats(docSnap.data());
          }
        });
        return () => unsubscribeData();
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const updateData = async (updates) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, updates);
  };

  const handleGameEnd = (status) => {
    if (status === 'won') {
      updateData({ 
        gameWins: stats.gameWins + 1, 
        xp: stats.xp + 250 
      });
    } else {
      updateData({ xp: stats.xp + 50 });
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", res.user.uid), {
          username, email, xp: 0, gameWins: 0, coursesCompleted: 0, 
          streak: 1, tier: 'adult', courseProgressMap: {}
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
          courseProgressMap={stats.courseProgressMap} 
          setCourseProgressMap={(id, prog) => updateData({ [`courseProgressMap.${id}`]: prog })} 
          userTier={stats.tier} 
          username={stats.username} 
        />;
      case 'Games': return <GamesScreen userTier={stats.tier} onGameEnd={handleGameEnd} />;
      case 'Discussion': return <DiscussionScreen currentUser={stats.username} />;
      case 'Progress': 
        return <ProgressScreen 
          xp={stats.xp} 
          gameWins={stats.gameWins} 
          streak={stats.streak} 
          coursesCompleted={stats.coursesCompleted}
          userTier={stats.tier}
        />;
      case 'Goals': return <GoalScreen />;
      default: return <HomeScreen onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  if (!user) {
    return (
      <div style={styles.authPage}>
        <div style={styles.authCard}>
          <h1 style={styles.authLogo}>PaidForward</h1>
          <form style={styles.authForm} onSubmit={handleAuth}>
            {isSignUp && <input style={styles.input} placeholder="Username" onChange={e => setUsername(e.target.value)} />}
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
      <header style={styles.header}>
        <h1 style={styles.logo} onClick={() => setActiveTab('Home')}>PaidForward</h1>
        <nav style={styles.navBar}>
          {['Home', 'Courses', 'Games', 'Progress', 'Goals', 'Discussion'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{...styles.navItem, color: activeTab === tab ? '#2563eb' : '#64748b'}}>{tab}</button>
          ))}
        </nav>
        <div style={styles.headerRight}>
          <div style={styles.streakDisplay}>🔥 {stats.streak}</div>
          <button onClick={() => signOut(auth)} style={styles.logoutBtn}>Logout</button>
        </div>
      </header>
      <main style={styles.main}>{renderScreen()}</main>
    </div>
  );
}

const styles = {
  authPage: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'sans-serif' },
  authCard: { background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '350px' },
  authLogo: { color: '#2563eb', textAlign: 'center', marginBottom: '20px' },
  authForm: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' },
  authBtn: { padding: '14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  switchText: { textAlign: 'center', marginTop: '15px', fontSize: '14px', cursor: 'pointer', color: '#2563eb' },
  container: { background: '#f1f5f9', minHeight: '100vh', fontFamily: 'sans-serif' },
  header: { height: '70px', background: '#fff', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0' },
  logo: { color: '#2563eb', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer' },
  navBar: { display: 'flex', gap: '20px' },
  navItem: { background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '20px' },
  streakDisplay: { background: '#fff7ed', color: '#ea580c', padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px', border: '1px solid #ffedd5' },
  logoutBtn: { padding: '8px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer', background: '#fff' },
  main: { padding: '30px' }
};

export default App;