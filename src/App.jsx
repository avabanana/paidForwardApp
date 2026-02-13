import React, { useState } from 'react';
import HomeScreen from './screens/HomeScreen.jsx';
import CoursesScreen from './screens/CoursesScreen.jsx';
import GamesScreen from './screens/GamesScreen.jsx';
import DiscussionScreen from './screens/DiscussionScreen.jsx';
import ProgressScreen from './screens/ProgressScreen.jsx'; 
import MapScreen from './screens/MapScreen.jsx';

function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('Home');
  
  // User Profile Data
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Global Progress State (Shared across screens)
  const [courseProgress, setCourseProgress] = useState(0);

  // Handle Login/Signup
  const handleAuth = (e) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !username)) {
      alert("Please fill in all fields!");
      return;
    }
    setIsLoggedIn(true);
  };

  // Nav Click Handler (Resets the screen to its default state)
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home': 
        return <HomeScreen onNavigate={handleTabClick} />;
      
      case 'Courses': 
        return (
          <CoursesScreen 
            key={activeTab + Date.now()} 
            globalProgress={courseProgress} 
            setGlobalProgress={setCourseProgress} 
          />
        );
      
      case 'Games': 
        return <GamesScreen key={activeTab + Date.now()} />;
      
      case 'Discussion': 
        return <DiscussionScreen currentUser={username || email.split('@')[0]} />;
      
      case 'Progress': 
        return <ProgressScreen globalProgress={courseProgress} />; 
      
      case 'Map': 
        return <MapScreen />;
        
      default: 
        return <HomeScreen onNavigate={handleTabClick} />;
    }
  };

  // --- LOGIN / SIGNUP VIEW ---
  if (!isLoggedIn) {
    return (
      <div style={styles.authPage}>
        <div style={styles.authBlob1}></div>
        <div style={styles.authBlob2}></div>
        
        <div style={styles.authCard}>
          <div style={styles.authHeader}>
            <h1 style={styles.authLogo}>PaidForward</h1>
            <p style={styles.authSubtitle}>
              {isSignUp ? "Join the movement for global change." : "Welcome back to your impact dashboard."}
            </p>
          </div>

          <form style={styles.authForm} onSubmit={handleAuth}>
            {isSignUp && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Username</label>
                <input 
                  type="text" placeholder="ImpactMaker2026" style={styles.input} 
                  value={username} onChange={(e) => setUsername(e.target.value)} 
                />
              </div>
            )}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input 
                type="email" placeholder="name@example.com" style={styles.input} 
                value={email} onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input 
                type="password" placeholder="••••••••" style={styles.input} 
                value={password} onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            
            <button type="submit" style={styles.authBtn}>
              {isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          <p style={styles.switchText}>
            {isSignUp ? "Already have an account?" : "Don't have an account yet?"}
            <span style={styles.switchLink} onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? " Sign In" : " Sign Up"}
            </span>
          </p>
        </div>
      </div>
    );
  }

  // --- MAIN APPLICATION VIEW ---
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>PaidForward</h1>
        
        <nav style={styles.navBar}>
          {['Home', 'Courses', 'Games', 'Discussion'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              style={{
                ...styles.navItem,
                color: activeTab === tab ? '#2563eb' : '#64748b',
                borderBottom: activeTab === tab ? '3px solid #2563eb' : '3px solid transparent',
              }}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div style={styles.profileSection}>
          <div style={styles.userInfo}>
            <span style={styles.userDisplayName}>{username || email.split('@')[0]}</span>
            <span style={styles.userEmail}>{email}</span>
          </div>
          <div style={styles.avatar}>{(username || email)[0] ? (username || email)[0].toUpperCase() : 'U'}</div>
          <button onClick={() => setIsLoggedIn(false)} style={styles.logoutBtn}>Logout</button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          {renderScreen()}
        </div>
      </main>
    </div>
  );
}

// --- STYLES OBJECT ---
const styles = {
  authPage: { 
    height: '100vh', width: '100vw', background: '#f8fafc', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', 
    position: 'relative', overflow: 'hidden', fontFamily: 'Inter, system-ui, sans-serif'
  },
  authBlob1: { position: 'absolute', width: '400px', height: '400px', background: '#dbeafe', borderRadius: '50%', top: '-100px', right: '-100px', zIndex: 0 },
  authBlob2: { position: 'absolute', width: '300px', height: '300px', background: '#eff6ff', borderRadius: '50%', bottom: '-50px', left: '-50px', zIndex: 0 },
  authCard: { 
    width: '100%', maxWidth: '420px', background: 'rgba(255, 255, 255, 0.8)', 
    backdropFilter: 'blur(12px)', padding: '40px', borderRadius: '32px', 
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)', zIndex: 1, border: '1px solid #fff'
  },
  authHeader: { textAlign: 'center', marginBottom: '32px' },
  authLogo: { fontSize: '32px', fontWeight: '900', color: '#1e3a8a', margin: '0 0 8px 0', letterSpacing: '-1px' },
  authSubtitle: { color: '#64748b', fontSize: '15px', lineHeight: '1.5' },
  authForm: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#475569', marginLeft: '4px' },
  input: { 
    padding: '14px 18px', borderRadius: '16px', border: '1px solid #e2e8f0', 
    fontSize: '16px', outline: 'none', background: '#fff' 
  },
  authBtn: { 
    marginTop: '10px', padding: '16px', background: '#2563eb', color: '#fff', 
    border: 'none', borderRadius: '16px', fontWeight: '700', fontSize: '16px', 
    cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)' 
  },
  switchText: { textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748b' },
  switchLink: { color: '#2563eb', fontWeight: '700', cursor: 'pointer', marginLeft: '4px' },
  container: { background: '#f1f5f9', minHeight: '100vh', width: '100vw', fontFamily: 'Inter, system-ui, sans-serif' },
  header: { 
    height: '80px', background: '#fff', padding: '0 40px', display: 'flex', 
    alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0' 
  },
  logo: { fontSize: '22px', fontWeight: '900', color: '#2563eb' },
  navBar: { display: 'flex', gap: '30px', height: '100%' },
  navItem: { background: 'none', border: 'none', fontWeight: '700', fontSize: '15px', cursor: 'pointer', height: '100%' },
  profileSection: { display: 'flex', alignItems: 'center', gap: '15px' },
  userInfo: { textAlign: 'right', display: 'flex', flexDirection: 'column' },
  userDisplayName: { fontWeight: '800', fontSize: '14px', color: '#1e293b' },
  userEmail: { fontSize: '11px', color: '#94a3b8' },
  avatar: { 
    width: '40px', height: '40px', borderRadius: '14px', background: '#dbeafe', 
    color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' 
  },
  logoutBtn: { padding: '8px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },
  main: { padding: '40px', display: 'flex', justifyContent: 'center' },
  card: { background: '#fff', borderRadius: '32px', width: '100%', maxWidth: '1100px', padding: '40px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }
};

export default App;