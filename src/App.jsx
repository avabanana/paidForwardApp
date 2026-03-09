import React, { useState, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen.jsx';
import CoursesScreen from './screens/CoursesScreen.jsx';
import GamesScreen from './screens/GamesScreen.jsx';
import DiscussionScreen from './screens/DiscussionScreen.jsx';
import ProgressScreen from './screens/ProgressScreen.jsx'; 
import GoalScreen from './screens/GoalScreen.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [userTier, setUserTier] = useState('adult'); 
  
  // STATS STATE
  const [courseProgressMap, setCourseProgressMap] = useState({}); 
  const [coursesCompleted, setCoursesCompleted] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [gameWins, setGameWins] = useState(0); // Added for ProgressScreen tracking
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  
  // UI STATE
  const [notification, setNotification] = useState(null);

  const currentYear = new Date().getFullYear();
  const userAge = birthYear ? currentYear - parseInt(birthYear) : 0;
  const canAccessDiscussion = userAge >= 14;

  // --- UTILS ---
  const getUsers = () => {
    const saved = localStorage.getItem('paidForwardUsers');
    return saved ? JSON.parse(saved) : [];
  };

  const triggerPopup = (title, message) => {
    setNotification({ title, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const saveUserUpdates = (updates) => {
    const allUsers = getUsers();
    const updated = allUsers.map(u => {
      if (u.email === email) return { ...u, ...updates };
      return u;
    });
    localStorage.setItem('paidForwardUsers', JSON.stringify(updated));
  };

  // --- LOGIC ---
  const updateStreak = (user) => {
    const today = new Date().toISOString().split('T')[0];
    const lastLogin = user.lastLoginDate;
    let newStreak = user.streak || 0;

    if (!lastLogin) {
      newStreak = 1;
    } else {
      const lastDate = new Date(lastLogin);
      const todayDate = new Date(today);
      const diffDays = Math.ceil(Math.abs(todayDate - lastDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) newStreak += 1;
      else if (diffDays > 1) newStreak = 1;
    }

    setStreak(newStreak);
    saveUserUpdates({ streak: newStreak, lastLoginDate: today });
  };

  const updateCourseProgress = (courseId, newProgress) => {
    setCourseProgressMap(prev => {
      const isFinished = newProgress === 1.0 && prev[courseId] !== 1.0;
      const updatedMap = { ...prev, [courseId]: newProgress };
      
      if (isFinished) {
        setCoursesCompleted(c => c + 1);
        setXp(x => x + 500);
        triggerPopup("📚 Course Mastered!", "You've earned 500 XP and a new certificate.");
        saveUserUpdates({ courseProgressMap: updatedMap, coursesCompleted: coursesCompleted + 1, xp: xp + 500 });
      } else {
        setXp(x => x + 50);
        saveUserUpdates({ courseProgressMap: updatedMap, xp: xp + 50 });
      }
      return updatedMap;
    });
  };

  const handleGameEnd = (status) => {
    const isWin = status === 'won';
    
    setGamesPlayed(prev => {
      const newCount = prev + 1;
      saveUserUpdates({ gamesPlayed: newCount });
      return newCount;
    });

    if (isWin) {
      setGameWins(prev => {
        const newWins = prev + 1;
        saveUserUpdates({ gameWins: newWins });
        return newWins;
      });
      setXp(prev => prev + 250);
      triggerPopup("💰 Big Winner!", "You successfully grew your portfolio and earned 250 XP!");
    } else {
      setXp(prev => prev + 50);
      triggerPopup("📉 Market Lesson", "You gained experience! +50 XP");
    }
  };

  const handleAuth = (e) => {
    e.preventDefault();
    const allUsers = getUsers();

    if (isSignUp) {
      if (!birthYear || userAge < 6) return alert("Please enter a valid birth year.");
      
      let tier = 'adult';
      if (userAge <= 10) tier = 'elementary';
      else if (userAge <= 13) tier = 'middle';

      const newUser = { 
        email, username, password, birthYear, tier, 
        courseProgressMap: {}, coursesCompleted: 0, gamesPlayed: 0, gameWins: 0, xp: 0,
        streak: 1, lastLoginDate: new Date().toISOString().split('T')[0]
      };
      localStorage.setItem('paidForwardUsers', JSON.stringify([...allUsers, newUser]));
      setUserTier(tier);
      setStreak(1);
      setIsLoggedIn(true);
    } else {
      const user = allUsers.find(u => u.email === email && u.password === password);
      if (user) {
        setUsername(user.username);
        setUserTier(user.tier);
        setBirthYear(user.birthYear);
        setCourseProgressMap(user.courseProgressMap || {});
        setCoursesCompleted(user.coursesCompleted || 0);
        setGamesPlayed(user.gamesPlayed || 0);
        setGameWins(user.gameWins || 0);
        setXp(user.xp || 0);
        updateStreak(user);
        setIsLoggedIn(true);
      } else {
        alert("Invalid credentials");
      }
    }
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home': return <HomeScreen onNavigate={(tab) => setActiveTab(tab)} />;
      case 'Courses': return <CoursesScreen courseProgressMap={courseProgressMap} setCourseProgressMap={updateCourseProgress} userTier={userTier} username={username} />;
      case 'Games': return <GamesScreen userTier={userTier} onGameEnd={handleGameEnd} />;
      case 'Discussion': return canAccessDiscussion ? <DiscussionScreen currentUser={username} /> : <HomeScreen onNavigate={(tab) => setActiveTab(tab)} />;
      case 'Progress': return <ProgressScreen courseProgressMap={courseProgressMap} userTier={userTier} coursesCompleted={coursesCompleted} gamesPlayed={gamesPlayed} gameWins={gameWins} xp={xp} streak={streak} />; 
      case 'Goals': return <GoalScreen />;
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
          <p style={styles.switchText} onClick={() => setIsSignUp(!isSignUp)}>{isSignUp ? "Already have an account? Sign In" : "New? Sign Up"}</p>
        </div>
      </div>
    );
  }

  const tabs = ['Home', 'Courses', 'Games', 'Progress', 'Goals'];
  if (canAccessDiscussion) tabs.push('Discussion');

  return (
    <div style={styles.container}>
      {/* Achievement Popup Notification */}
      {notification && (
        <div style={styles.popup}>
          <div style={styles.popupIcon}>🌟</div>
          <div>
            <div style={styles.popupTitle}>{notification.title}</div>
            <div style={styles.popupSub}>{notification.message}</div>
          </div>
        </div>
      )}

      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={{...styles.logo, cursor: 'pointer'}} onClick={() => setActiveTab('Home')}>PaidForward</h1>
          <nav style={styles.navBar}>
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{...styles.navItem, color: activeTab === tab ? '#2563eb' : '#64748b'}}>{tab}</button>
            ))}
          </nav>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.streakDisplay}>🔥 {streak} Day Streak</div>
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
  streakDisplay: { background: '#fff7ed', color: '#ea580c', padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px', border: '1px solid #ffedd5' },
  userInfo: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  userNameDisplay: { fontWeight: 'bold', color: '#1e293b', fontSize: '14px' },
  tierTag: { fontSize: '10px', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', marginLeft: '5px', textTransform: 'uppercase' },
  userEmailDisplay: { color: '#64748b', fontSize: '11px' },
  logoutBtn: { padding: '8px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer', background: '#fff' },
  main: { padding: '30px' },
  // Achievement Popup Styling
  popup: {
    position: 'fixed', bottom: '20px', right: '20px',
    background: '#1e293b', color: '#fff', padding: '16px 24px',
    borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 9999,
  },
  popupTitle: { fontWeight: '800', fontSize: '14px', color: '#fbbf24' },
  popupSub: { fontSize: '12px', color: '#cbd5e1' },
  popupIcon: { fontSize: '24px' }
};

export default App;