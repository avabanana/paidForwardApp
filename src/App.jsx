import React, { useState } from 'react';
import HomeScreen from './screens/HomeScreen.jsx';
import CoursesScreen from './screens/CoursesScreen.jsx';
import GamesScreen from './screens/GamesScreen.jsx';
import DiscussionScreen from './screens/DiscussionScreen.jsx';
import ProgressScreen from './screens/ProgressScreen.jsx'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [userTier, setUserTier] = useState('adult'); 
  const [courseProgress, setCourseProgress] = useState(0);
  const [coursesCompleted, setCoursesCompleted] = useState(0); // counts individual lessons/modules finished
  const [lastModuleCount, setLastModuleCount] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [xp, setXp] = useState(0);

  const currentYear = new Date().getFullYear();
  const userAge = birthYear ? currentYear - parseInt(birthYear) : 0;
  const canAccessDiscussion = userAge >= 14;

  const getUsers = () => {
    const saved = localStorage.getItem('paidForwardUsers');
    return saved ? JSON.parse(saved) : [];
  };

  const saveUserUpdates = (updates) => {
    const allUsers = getUsers();
    const updated = allUsers.map(u => {
      if (u.email === email) {
        return { ...u, ...updates };
      }
      return u;
    });
    localStorage.setItem('paidForwardUsers', JSON.stringify(updated));
  };

  // second arg optionally carries how many modules/lessons have been completed so far
  const updateGlobalProgress = (newProgress, modulesDone = 0) => {
    // if we received a module count and it increased compared to the last call,
    // treat each additional finished module as a "course" for progress statistics
    if (modulesDone > lastModuleCount) {
      const delta = modulesDone - lastModuleCount;
      setCoursesCompleted(prev => {
        const newCount = prev + delta;
        saveUserUpdates({ coursesCompleted: newCount });
        return newCount;
      });
      setXp(prev => {
        const newXp = prev + delta * 100;
        saveUserUpdates({ xp: newXp });
        return newXp;
      });
      setLastModuleCount(modulesDone);
    }

    setCourseProgress(newProgress);
    saveUserUpdates({ progress: newProgress });
  };

  const handleGameEnd = (result) => {
    // count finished/abandoned games
    setGamesPlayed(prev => {
      const newCount = prev + 1;
      saveUserUpdates({ gamesPlayed: newCount });
      return newCount;
    });
    setXp(prev => {
      const newXp = prev + 100;
      saveUserUpdates({ xp: newXp });
      return newXp;
    });
    // we could do something with result if needed
  };

  const handleAuth = (e) => {
    e.preventDefault();
    const allUsers = getUsers();

    if (isSignUp) {
      if (!birthYear || userAge < 6) {
        alert("Please enter a valid birth year (6+).");
        return;
      }
      
      let tier = 'adult';
      if (userAge <= 10) tier = 'elementary';
      else if (userAge <= 13) tier = 'middle';

      const newUser = { 
        email, username, password, birthYear, tier, progress: 0,
        coursesCompleted: 0,
        gamesPlayed: 0,
        xp: 0
      };
      localStorage.setItem('paidForwardUsers', JSON.stringify([...allUsers, newUser]));
      setUserTier(tier);
      setCourseProgress(0);
      setCoursesCompleted(0);
      setGamesPlayed(0);
      setXp(0);
      setIsLoggedIn(true);
    } else {
      const user = allUsers.find(u => u.email === email && u.password === password);
      if (user) {
        setUsername(user.username);
        setUserTier(user.tier);
        setBirthYear(user.birthYear);
        setCourseProgress(user.progress || 0);
        setCoursesCompleted(user.coursesCompleted || 0);
        setGamesPlayed(user.gamesPlayed || 0);
        setXp(user.xp || 0);
        setIsLoggedIn(true);
      } else {
        alert("Invalid credentials");
      }
    }
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home': return <HomeScreen onNavigate={(tab) => setActiveTab(tab)} />;
      case 'Courses': return <CoursesScreen globalProgress={courseProgress} setGlobalProgress={updateGlobalProgress} userTier={userTier} username={username} />;
      case 'Games': return <GamesScreen userTier={userTier} onGameEnd={handleGameEnd} />;
      case 'Discussion': 
        return canAccessDiscussion ? <DiscussionScreen currentUser={username} /> : <HomeScreen onNavigate={(tab) => setActiveTab(tab)} />;
      case 'Progress': return <ProgressScreen globalProgress={courseProgress} userTier={userTier} coursesCompleted={coursesCompleted} gamesPlayed={gamesPlayed} xp={xp} />; 
      default: return <HomeScreen onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.authPage}>
        <div style={styles.authCard}>
          <h1 style={styles.authLogo}>PaidForward</h1>
          <form style={styles.authForm} onSubmit={handleAuth}>
            {isSignUp && (
              <>
                <input style={styles.input} placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                <input style={styles.input} type="number" placeholder="Birth Year" value={birthYear} onChange={e => setBirthYear(e.target.value)} />
              </>
            )}
            <input style={styles.input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input style={styles.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit" style={styles.authBtn}>{isSignUp ? "Sign Up" : "Sign In"}</button>
          </form>
          <p style={styles.switchText} onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Already have an account? Sign In" : "New? Sign Up"}
          </p>
        </div>
      </div>
    );
  }

  const tabs = ['Home', 'Courses', 'Games', 'Progress'];
  if (canAccessDiscussion) tabs.push('Discussion');

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 
            style={{...styles.logo, cursor: 'pointer'}} 
            onClick={() => setActiveTab('Home')}
          >
            PaidForward
          </h1>
          <nav style={styles.navBar}>
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{...styles.navItem, color: activeTab === tab ? '#2563eb' : '#64748b'}}>{tab}</button>
            ))}
          </nav>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.userInfo}>
            <span style={styles.userNameDisplay}>{username} <small style={styles.tierTag}>{userTier}</small></span>
            <span style={styles.userEmailDisplay}>{email}</span>
          </div>
          <button onClick={() => setIsLoggedIn(false)} style={styles.logoutBtn}>Logout</button>
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
  headerLeft: { display: 'flex', alignItems: 'center', gap: '40px' },
  logo: { color: '#2563eb', fontSize: '22px', fontWeight: 'bold' },
  navBar: { display: 'flex', gap: '20px' },
  navItem: { background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '20px' },
  userInfo: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  userNameDisplay: { fontWeight: 'bold', color: '#1e293b', fontSize: '14px' },
  tierTag: { fontSize: '10px', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', marginLeft: '5px', textTransform: 'uppercase' },
  userEmailDisplay: { color: '#64748b', fontSize: '11px' },
  logoutBtn: { padding: '8px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer', background: '#fff' },
  main: { padding: '30px' }
};

export default App;