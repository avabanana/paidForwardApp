import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function OnboardingScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [birthYear, setBirthYear] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        if (!birthYear) throw new Error('Please enter your birth year.');
        if (!username.trim()) throw new Error('Please choose a username.');
        
        const numericYear = parseInt(birthYear, 10);
        const age = new Date().getFullYear() - numericYear;
        const tier = age >= 14 ? 'adult' : 'elementary';

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username.trim(),
              tier: tier,
              birthYear: numericYear
            }
          }
        });

        if (error) throw error;

        // Create the initial profile in the 'users' table
        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            username: username.trim(),
            email,
            xp: 0,
            gameWins: 0,
            gamesPlayed: 0,
            coursesCompleted: 0,
            streak: 1,
            tier,
            birthYear: numericYear,
            courseProgressMap: {},
            achievements: [],
            lastLogin: new Date().toISOString().slice(0, 10)
          }]);
        
        if (profileError) throw profileError;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      alert(err.message);
    }
  };

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
            <>
              <div style={styles.inputWrap}><span style={styles.inputIcon}>👤</span><input style={styles.input} placeholder="Choose a username" value={username} onChange={(e) => setUsername(e.target.value)} /></div>
              <div style={styles.inputWrap}><span style={styles.inputIcon}>🎂</span><input style={styles.input} type="number" min="1900" max={new Date().getFullYear()} placeholder="Birth year" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} /></div>
            </>
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

const styles = {
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
};

export default OnboardingScreen;