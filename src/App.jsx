import React, { useState } from 'react';
// Import your screens
import HomeScreen from './screens/HomeScreen';
import CoursesScreen from './screens/CoursesScreen';
import GamesScreen from './screens/GamesScreen';
import DiscussionScreen from './screens/DiscussionScreen';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');

  const handleAuth = (e) => {
    e.preventDefault();
    if (showSignUp && parseInt(age) < 13) {
      alert("Registration failed: You must be at least 13 years old to join PaidForward.");
      return;
    }
    setIsLoggedIn(true);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home': return <HomeScreen />;
      case 'Courses': return <CoursesScreen />;
      case 'Games': return <GamesScreen />;
      case 'Discussion': return <DiscussionScreen />;
      default: return <HomeScreen />;
    }
  };

  // --- AUTHENTICATION VIEW (Now Adaptable) ---
  if (!isLoggedIn) {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
           <h1 style={styles.logo}>PaidForward</h1>
        </header>
        <main style={styles.content}>
          <div style={styles.card}> {/* Using the same card style as the main app */}
            <h2 style={styles.tabTitle}>{showSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            <p style={styles.placeholderText}>Please enter your details to access the PaidForward platform.</p>
            <hr style={styles.divider} />
            
            <form onSubmit={handleAuth} style={styles.form}>
              <div style={styles.inputGroup}>
                <input 
                  type="email" placeholder="Email Address" required 
                  style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                  type="password" placeholder="Password" required 
                  style={styles.input} value={password} onChange={(e) => setPassword(e.target.value)}
                />
                {showSignUp && (
                  <input 
                    type="number" placeholder="Your Age" required 
                    style={styles.input} value={age} onChange={(e) => setAge(e.target.value)}
                  />
                )}
              </div>
              <button type="submit" style={styles.primaryBtn}>
                {showSignUp ? 'Sign Up' : 'Login'}
              </button>
            </form>
            
            <p onClick={() => setShowSignUp(!showSignUp)} style={styles.toggleText}>
              {showSignUp ? 'Already have an account? Login here' : 'New to PaidForward? Create an account'}
            </p>
          </div>
        </main>
      </div>
    );
  }

  // --- MAIN APP VIEW ---
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>PaidForward</h1>
        <div style={styles.headerRight}>
          <span style={styles.userEmail}>{email}</span>
          <button onClick={() => setIsLoggedIn(false)} style={styles.logoutBtn}>Logout</button>
        </div>
      </header>

      <main style={styles.content}>
        <div style={styles.screenWrapper}>
          <div style={styles.card}>
            <h2 style={styles.tabTitle}>{activeTab}</h2>
            <hr style={styles.divider} />
            {renderScreen()}
          </div>
        </div>
      </main>

      <nav style={styles.navBar}>
  {['Home', 'Courses', 'Games', 'Discussion'].map((tab) => {
    // Logic: If the tab is Discussion and the age is under 14, don't show the button
    if (tab === 'Discussion' && parseInt(age) < 14) {
      return null; 
    }

    return (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        style={{
          ...styles.navItem,
          color: activeTab === tab ? '#4A90E2' : '#666',
          borderTop: activeTab === tab ? '4px solid #4A90E2' : '4px solid transparent',
          backgroundColor: activeTab === tab ? '#f0f7ff' : 'transparent',
        }}
      >
        {tab}
      </button>
    );
  })}
</nav>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f5f7f8',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: { 
    padding: '1rem 2rem', 
    backgroundColor: '#fff', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    zIndex: 10
  },
  logo: { fontSize: '1.5rem', margin: 0, color: '#4A90E2', fontWeight: '800' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '15px' },
  userEmail: { fontSize: '14px', color: '#666' },
  logoutBtn: { padding: '5px 10px', borderRadius: '5px', border: '1px solid #ddd', cursor: 'pointer', background: '#fff' },
  
  content: { 
    flex: 1, 
    padding: '2rem', 
    overflowY: 'auto',
    display: 'flex',
    justifyContent: 'center' // Centers the card horizontally
  },
  screenWrapper: { width: '100%', maxWidth: '1200px' },
  
  card: { 
    backgroundColor: '#fff', 
    padding: '2.5rem', 
    borderRadius: '16px', 
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    width: '100%',
    maxWidth: '1200px', // Now matches the main content width
    height: 'fit-content'
  },
  tabTitle: { marginTop: 0, fontSize: '1.75rem', color: '#1a1a1a' },
  divider: { border: '0', borderTop: '1px solid #eee', margin: '1rem 0 1.5rem 0' },
  placeholderText: { color: '#666', marginBottom: '1rem' },

  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { 
    padding: '14px', 
    borderRadius: '8px', 
    border: '1px solid #ddd', 
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box' 
  },
  primaryBtn: { 
    padding: '14px', 
    backgroundColor: '#4A90E2', 
    color: 'white', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontWeight: 'bold', 
    fontSize: '16px',
    width: '100%',
    maxWidth: '300px', // Keeps the button from being too wide on desktop
    alignSelf: 'center'
  },
  toggleText: { marginTop: '20px', color: '#4A90E2', cursor: 'pointer', textAlign: 'center', fontWeight: '600' },

  navBar: { height: '80px', backgroundColor: '#fff', display: 'flex', borderTop: '1px solid #eee' },
  navItem: { flex: 1, background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }
};

export default App;