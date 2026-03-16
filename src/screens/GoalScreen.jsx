import React, { useState, useEffect } from 'react';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot
} from 'firebase/firestore';

const SUGGESTED_GOALS = [
  { name: 'Emergency Fund', target: 500, emoji: '🛟', color: '#dbeafe' },
  { name: 'New Laptop', target: 1200, emoji: '💻', color: '#ede9fe' },
  { name: 'Summer Trip', target: 800, emoji: '✈️', color: '#fef3c7' },
  { name: 'New Phone', target: 900, emoji: '📱', color: '#d1fae5' },
  { name: 'Car Fund', target: 3000, emoji: '🚗', color: '#fee2e2' }
];

export default function GoalScreen({ currentUser = 'guest', userTier = 'adult', userId, db, onAchievementUnlocked }) {
  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [depositInputs, setDepositInputs] = useState({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationName, setCelebrationName] = useState('');
  const [loading, setLoading] = useState(true);

  const goalsRef = userId && db ? doc(db, 'user_goals', userId) : null;

  // Load goals from Firestore — scoped strictly to this userId
  useEffect(() => {
    if (!goalsRef) { setLoading(false); return; }
    const unsub = onSnapshot(goalsRef, (snap) => {
      if (snap.exists()) {
        setGoals(snap.data().goals || []);
      } else {
        setGoals([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [userId]);

  const saveGoals = async (updated) => {
    if (!goalsRef) return;
    setGoals(updated);
    await setDoc(goalsRef, { goals: updated, userId, username: currentUser }, { merge: true });
  };

  const totalSaved = goals.reduce((sum, g) => sum + (g.current || 0), 0);
  const totalTarget = goals.reduce((sum, g) => sum + (g.target || 0), 0);
  const completionPercent = totalTarget ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  const addGoal = (e) => {
    e.preventDefault();
    if (!goalName.trim() || !targetAmount) return;
    const newGoal = {
      id: Date.now(),
      name: goalName.trim(),
      target: parseFloat(targetAmount),
      current: 0,
      completed: false,
      emoji: '🎯',
      color: '#e0e7ff'
    };
    saveGoals([...goals, newGoal]);
    setGoalName('');
    setTargetAmount('');
  };

  const addSuggestedGoal = (suggested) => {
    const already = goals.find(g => g.name === suggested.name);
    if (already) return;
    const newGoal = {
      id: Date.now(),
      name: suggested.name,
      target: suggested.target,
      current: 0,
      completed: false,
      emoji: suggested.emoji,
      color: suggested.color
    };
    saveGoals([...goals, newGoal]);
  };

  const updateMoney = (id, amount) => {
    const updated = goals.map(g => {
      if (g.id !== id) return g;
      const newTotal = Math.max(0, (g.current || 0) + amount);
      const isNowDone = newTotal >= g.target;
      if (isNowDone && !g.completed) {
        triggerCelebration(g.name, g.emoji);
      }
      return { ...g, current: newTotal, completed: isNowDone };
    });
    saveGoals(updated);
  };

  const triggerCelebration = (name, emoji) => {
    setCelebrationName(`${emoji} ${name}`);
    setShowCelebration(true);
    if (onAchievementUnlocked) onAchievementUnlocked(`Goal complete: ${name}!`);
    setTimeout(() => setShowCelebration(false), 3200);
  };

  const deleteGoal = (id) => {
    saveGoals(goals.filter(g => g.id !== id));
  };

  const handleCustomDeposit = (id) => {
    const amount = parseFloat(depositInputs[id]);
    if (!amount || amount <= 0) return;
    updateMoney(id, amount);
    setDepositInputs(prev => ({ ...prev, [id]: '' }));
  };

  const isChild = userTier === 'elementary';

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontFamily: "'Inter', system-ui, sans-serif" }}>
        Loading your goals...
      </div>
    );
  }

  return (
    <div style={{
      padding: '24px',
      fontFamily: isChild ? 'Comic Sans MS, Comic Neue, cursive' : "'Inter', system-ui, sans-serif",
      maxWidth: '900px',
      margin: '0 auto',
      position: 'relative'
    }}>

      {/* Celebration overlay */}
      {showCelebration && (
        <div style={styles.celebrationOverlay}>
          <div style={styles.celebrationCard}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>🎉</div>
            <h2 style={{ margin: '0 0 6px', color: '#1e293b', fontSize: '24px' }}>Goal Complete!</h2>
            <p style={{ margin: '0 0 4px', fontWeight: '700', fontSize: '18px', color: '#6366f1' }}>{celebrationName}</p>
            <p style={{ color: '#64748b', margin: 0 }}>You're a Financial Master!</p>
          </div>
        </div>
      )}

      <div style={styles.pageHeader}>
        <div>
          <div style={styles.pageBadge}>🎯 Savings Goals</div>
          <h2 style={styles.pageTitle}>Your Financial Goals</h2>
          <p style={styles.pageSubtitle}>Set targets, track deposits, and celebrate every win.</p>
        </div>
      </div>

      {/* Overall progress */}
      {goals.length > 0 && (
        <div style={styles.summaryCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>Overall Progress</h3>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
                Saved <strong style={{ color: '#2563eb' }}>${totalSaved.toLocaleString()}</strong> of <strong>${totalTarget.toLocaleString()}</strong>
              </p>
            </div>
            <div style={styles.percentBadge}>{completionPercent}%</div>
          </div>
          <div style={styles.progressBg}>
            <div style={{ ...styles.progressFill, width: `${completionPercent}%`, background: 'linear-gradient(90deg,#6366f1,#2563eb)' }} />
          </div>
        </div>
      )}

      {/* Suggested goals */}
      <div style={styles.sectionCard}>
        <h3 style={styles.sectionTitle}>💡 Quick-Start Goals</h3>
        <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 14px' }}>Tap to instantly add a common savings goal.</p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {SUGGESTED_GOALS.map((s) => {
            const added = goals.some(g => g.name === s.name);
            return (
              <button
                key={s.name}
                onClick={() => addSuggestedGoal(s)}
                disabled={added}
                style={{
                  ...styles.suggestBtn,
                  background: added ? '#f1f5f9' : s.color,
                  color: added ? '#94a3b8' : '#1e293b',
                  borderColor: added ? '#e2e8f0' : 'transparent',
                  cursor: added ? 'not-allowed' : 'pointer'
                }}
              >
                <span style={{ fontSize: '18px' }}>{s.emoji}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '700', fontSize: '13px' }}>{s.name}</div>
                  <div style={{ fontSize: '11px', opacity: 0.7 }}>${s.target.toLocaleString()}</div>
                </div>
                {added && <span style={{ fontSize: '11px', marginLeft: '4px' }}>✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add custom goal */}
      <div style={styles.sectionCard}>
        <h3 style={styles.sectionTitle}>➕ Add a Custom Goal</h3>
        <form onSubmit={addGoal} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            style={styles.input}
            placeholder="What are you saving for?"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
          />
          <input
            style={{ ...styles.input, maxWidth: '160px' }}
            type="number"
            min="1"
            placeholder="Target ($)"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
          />
          <button type="submit" style={styles.addBtn}>Add Goal</button>
        </form>
      </div>

      {/* Goals grid */}
      {goals.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎯</div>
          <p style={{ fontWeight: '700', color: '#1e293b', margin: '0 0 4px' }}>No goals yet</p>
          <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>Add a suggested goal above or create your own!</p>
        </div>
      ) : (
        <div style={styles.goalsGrid}>
          {goals.map(goal => {
            const progress = Math.min(100, ((goal.current || 0) / goal.target) * 100);
            return (
              <div key={goal.id} style={{
                ...styles.goalCard,
                borderColor: goal.completed ? '#22c55e' : '#e2e8f0',
                background: goal.completed ? 'linear-gradient(135deg,#f0fdf4,#dcfce7)' : '#fff'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '24px' }}>{goal.emoji || '🎯'}</span>
                    <strong style={{ color: goal.completed ? '#166534' : '#1e293b', fontSize: '15px' }}>
                      {goal.name}
                    </strong>
                  </div>
                  <button onClick={() => deleteGoal(goal.id)} style={styles.delBtn}>✕</button>
                </div>

                <div style={styles.progressBg}>
                  <div style={{
                    ...styles.progressFill,
                    width: `${progress}%`,
                    background: goal.completed
                      ? 'linear-gradient(90deg,#22c55e,#16a34a)'
                      : 'linear-gradient(90deg,#6366f1,#2563eb)'
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0', fontSize: '13px', color: '#64748b' }}>
                  <span>${(goal.current || 0).toLocaleString()} saved</span>
                  <span style={{ fontWeight: '700', color: goal.completed ? '#166534' : '#1e293b' }}>
                    {Math.round(progress)}% of ${goal.target.toLocaleString()}
                  </span>
                </div>

                {goal.completed ? (
                  <div style={styles.completedBadge}>🏆 Goal Met!</div>
                ) : (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', marginTop: '8px' }}>
                    <button onClick={() => updateMoney(goal.id, 20)} style={styles.depositBtn}>+$20</button>
                    <button onClick={() => updateMoney(goal.id, 50)} style={styles.depositBtn}>+$50</button>
                    <button onClick={() => updateMoney(goal.id, 100)} style={styles.depositBtn}>+$100</button>
                    <input
                      type="number"
                      min="1"
                      placeholder="Custom"
                      value={depositInputs[goal.id] || ''}
                      onChange={(e) => setDepositInputs(prev => ({ ...prev, [goal.id]: e.target.value }))}
                      style={styles.customInput}
                    />
                    <button onClick={() => handleCustomDeposit(goal.id)} style={styles.depositBtn}>
                      Deposit
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  pageHeader: { marginBottom: '24px' },
  pageBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: '#e0e7ff', color: '#3730a3',
    borderRadius: '999px', padding: '5px 12px',
    fontSize: '12px', fontWeight: '700', marginBottom: '8px'
  },
  pageTitle: { margin: '0 0 4px', fontSize: '30px', fontWeight: '800', color: '#111827' },
  pageSubtitle: { margin: 0, color: '#64748b', fontSize: '15px' },
  summaryCard: {
    background: 'linear-gradient(135deg,#1e3a8a,#3b82f6)',
    borderRadius: '20px', padding: '20px 24px',
    marginBottom: '18px', color: '#fff'
  },
  percentBadge: {
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '999px', padding: '8px 16px',
    fontWeight: '800', fontSize: '18px'
  },
  sectionCard: {
    background: '#fff', borderRadius: '18px',
    padding: '20px', marginBottom: '18px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    border: '1px solid #f1f5f9'
  },
  sectionTitle: { margin: '0 0 4px', fontSize: '16px', fontWeight: '700', color: '#111827' },
  suggestBtn: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '10px 14px', borderRadius: '14px',
    border: '2px solid transparent', fontFamily: 'inherit',
    transition: 'opacity 0.2s'
  },
  input: {
    flex: 1, padding: '11px 14px', borderRadius: '12px',
    border: '1px solid #cbd5e1', fontSize: '14px',
    fontFamily: 'inherit', minWidth: '140px'
  },
  addBtn: {
    padding: '11px 22px', background: 'linear-gradient(135deg,#6366f1,#2563eb)',
    color: '#fff', border: 'none', borderRadius: '12px',
    cursor: 'pointer', fontWeight: '700', fontSize: '14px',
    whiteSpace: 'nowrap'
  },
  emptyState: {
    textAlign: 'center', padding: '40px 20px',
    background: '#f8fafc', borderRadius: '18px',
    border: '1px dashed #cbd5e1'
  },
  goalsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '16px'
  },
  goalCard: {
    padding: '18px', borderRadius: '16px',
    border: '2px solid', boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
  },
  progressBg: {
    height: '8px', background: '#e2e8f0',
    borderRadius: '999px', overflow: 'hidden'
  },
  progressFill: {
    height: '100%', borderRadius: '999px',
    transition: 'width 0.5s ease'
  },
  completedBadge: {
    marginTop: '10px', textAlign: 'center',
    background: '#dcfce7', color: '#166534',
    borderRadius: '10px', padding: '8px',
    fontWeight: '800', fontSize: '13px'
  },
  depositBtn: {
    padding: '7px 10px', borderRadius: '8px',
    border: '1px solid #e2e8f0', cursor: 'pointer',
    background: '#f8fafc', fontWeight: '700',
    fontSize: '12px', fontFamily: 'inherit'
  },
  customInput: {
    width: '70px', padding: '7px 8px',
    borderRadius: '8px', border: '1px solid #e2e8f0',
    fontSize: '12px', fontFamily: 'inherit'
  },
  delBtn: {
    border: 'none', background: 'none',
    cursor: 'pointer', color: '#94a3b8',
    fontSize: '16px', padding: '0 2px', lineHeight: 1
  },
  celebrationOverlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 999, backdropFilter: 'blur(4px)'
  },
  celebrationCard: {
    background: '#fff', borderRadius: '24px',
    padding: '40px 48px', textAlign: 'center',
    boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
    border: '3px solid #fbbf24'
  }
};