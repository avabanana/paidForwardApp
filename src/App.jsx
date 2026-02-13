import React, { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import CoursesScreen from './screens/CoursesScreen';
import GamesScreen from './screens/GamesScreen';
import DiscussionScreen from './screens/DiscussionScreen';

// FORCED RE-IMPORT:
import MapScreen from './screens/MapScreen';
import ProgressScreen from './screens/ProgressScreen';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home': return <HomeScreen onNavigate={setActiveTab} />;
      case 'Courses': return <CoursesScreen />;
      case 'Games': return <GamesScreen />;
      case 'Discussion': return <DiscussionScreen />;
      case 'Progress': return <ProgressScreen />; 
      case 'Map': return <MapScreen />;
      default: return <HomeScreen onNavigate={setActiveTab} />;
    }
  };

  // --- LOGIN VIEW ---
  if (!isLoggedIn) {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.logo}>PaidForward</h1>
        </header>
        <main style={styles.content}>
          <div style={styles.card} className="auth-card">
            <h2 style={styles.tabTitle}>Welcome</h2>
            <div style={styles.form}>
              <input 
                type="email" placeholder="Email" style={styles.input} 
                value={email} onChange={(e) => setEmail(e.target.value)} 
              />
              <input 
                type="number" placeholder="Age" style={styles.input} 
                value={age} onChange={(e) => setAge(e.target.value)} 
              />
              <button style={styles.primaryBtn} onClick={() => setIsLoggedIn(true)}>
                Login
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --- MAIN APP VIEW ---
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.logo}>PaidForward</h1>
        </div>

        <nav style={styles.navBar}>
          {['Home', 'Courses', 'Games', 'Discussion'].map((tab) => {
            // Discussion age gate
            if (tab === 'Discussion' && parseInt(age) < 14) return null;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...styles.navItem,
                  color: activeTab === tab ? '#4A90E2' : '#666',
                  borderBottom: activeTab === tab ? '3px solid #4A90E2' : '3px solid transparent',
                }}
              >
                {tab}
              </button>
            );
          })}
        </nav>

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
    fontFamily: 'system-ui, -apple-system, sans-serif' 
  },
  header: { 
    height: '60px', 
    padding: '0 2rem', 
    backgroundColor: '#fff', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    zIndex: 10 
  },
  headerLeft: { display: 'flex', alignItems: 'center' },
  logo: { 
    fontSize: '1.25rem', 
    margin: 0, 
    color: '#4A90E2', 
    fontWeight: '800',
    marginRight: '40px' 
  },
  navBar: { 
    display: 'flex', 
    height: '100%', 
    flex: 1, 
    justifyContent: 'center',
    gap: '10px'
  },
  navItem: { 
    padding: '0 20px', 
    height: '100%', 
    background: 'none', 
    border: 'none', 
    cursor: 'pointer', 
    fontWeight: '700', 
    fontSize: '14px', 
    display: 'flex', 
    alignItems: 'center',
    transition: 'all 0.2s ease'
  },
  headerRight: { display: 'flex', alignItems: 'center', gap: '15px' },
  userEmail: { fontSize: '13px', color: '#888' },
  logoutBtn: { 
    padding: '6px 12px', 
    borderRadius: '6px', 
    border: '1px solid #ddd', 
    cursor: 'pointer', 
    background: '#fff', 
    fontSize: '12px' 
  },
  content: { 
    flex: 1, 
    padding: '2rem', 
    display: 'flex', 
    justifyContent: 'center', 
    overflowY: 'auto' 
  },
  screenWrapper: { width: '100%', maxWidth: '1200px' },
  card: { 
    backgroundColor: '#fff', 
    padding: '2.5rem', 
    borderRadius: '16px', 
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)', 
    width: '100%',
    height: 'fit-content'
  },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { 
    padding: '12px', 
    borderRadius: '8px', 
    border: '1px solid #ddd', 
    fontSize: '16px', 
    width: '100%', 
    boxSizing: 'border-box' 
  },
  primaryBtn: { 
    padding: '12px', 
    backgroundColor: '#4A90E2', 
    color: 'white', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontWeight: 'bold' 
  },
  tabTitle: { margin: '0 0 10px 0', fontSize: '1.75rem' },
  divider: { border: '0', borderTop: '1px solid #eee', margin: '1rem 0 1.5rem 0' }
};

export default App;