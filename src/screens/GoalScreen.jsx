import React, { useState, useEffect } from 'react';

const GoalScreen = () => {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('pf_goals');
    return saved ? JSON.parse(saved) : [];
  });

  // Track unlocked achievements
  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem('pf_achievements');
    return saved ? JSON.parse(saved) : [];
  });

  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    localStorage.setItem('pf_goals', JSON.stringify(goals));
    localStorage.setItem('pf_achievements', JSON.stringify(achievements));
  }, [goals, achievements]);

  const addGoal = (e) => {
    e.preventDefault();
    if (!goalName || !targetAmount) return;
    const newGoal = {
      id: Date.now(),
      name: goalName,
      target: parseFloat(targetAmount),
      current: 0,
      completed: false
    };
    setGoals([...goals, newGoal]);
    setGoalName('');
    setTargetAmount('');
  };

  const updateMoney = (id, amount) => {
    setGoals(goals.map(g => {
      if (g.id === id) {
        const newTotal = Math.max(0, g.current + amount);
        const isNowDone = newTotal >= g.target;
        
        // If they just finished, trigger achievement
        if (isNowDone && !g.completed) {
          triggerAchievement(g.name);
        }
        
        return { ...g, current: newTotal, completed: isNowDone };
      }
      return g;
    }));
  };

  const triggerAchievement = (name) => {
    setShowCelebration(true);
    if (!achievements.includes(name)) {
      setAchievements(prev => [...prev, name]);
    }
    setTimeout(() => setShowCelebration(false), 3000); // Hide after 3 secs
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      {/* Celebration Overlay */}
      {showCelebration && (
        <div style={styles.celebration}>
          <h1 style={{fontSize: '50px'}}>🎉</h1>
          <h2>Goal Achieved!</h2>
          <p>You're a Financial Master!</p>
        </div>
      )}

      <h2 style={{ color: '#2563eb' }}>🎯 Savings Goals</h2>
      
      {/* Achievement Gallery */}
      <div style={styles.badgeShelf}>
        <p style={{fontSize: '12px', fontWeight: 'bold', color: '#64748b'}}>YOUR BADGES:</p>
        <div style={{display: 'flex', gap: '10px'}}>
          {achievements.length === 0 && <small>Complete a goal to earn your first badge!</small>}
          {achievements.map((ach, i) => (
            <div key={i} title={ach} style={styles.badge}>🏆</div>
          ))}
        </div>
      </div>

      <form onSubmit={addGoal} style={styles.form}>
        <input style={styles.input} placeholder="What are you saving for?" value={goalName} onChange={(e) => setGoalName(e.target.value)} />
        <input style={styles.input} type="number" placeholder="Amount ($)" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} />
        <button type="submit" style={styles.btn}>Add Goal</button>
      </form>

      <div style={styles.grid}>
        {goals.map(goal => {
           const progress = Math.min(100, (goal.current / goal.target) * 100);
           return (
            <div key={goal.id} style={styles.card(goal.completed)}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{color: goal.completed ? '#166534' : '#1e293b'}}>{goal.name}</strong>
                <button onClick={() => deleteGoal(goal.id)} style={styles.delBtn}>×</button>
                </div>
                <div style={styles.progressBg}>
                <div style={styles.progressBar(progress, goal.completed)} />
                </div>
                <p style={{fontSize: '14px'}}>${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</p>
                {!goal.completed && (
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <button onClick={() => updateMoney(goal.id, 20)} style={styles.smallBtn}>+$20</button>
                        <button onClick={() => updateMoney(goal.id, 100)} style={styles.smallBtn}>+$100</button>
                    </div>
                )}
                {goal.completed && <div style={{color: '#166534', fontWeight: 'bold', fontSize: '12px'}}>GOAL MET! 🏆</div>}
            </div>
           )
        })}
      </div>
    </div>
  );
};

const styles = {
  celebration: {
    position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -20%)',
    background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 0 50px rgba(0,0,0,0.2)',
    zIndex: 100, textAlign: 'center', border: '4px solid #fbbf24'
  },
  badgeShelf: { background: '#fff', padding: '15px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #e2e8f0' },
  badge: { fontSize: '24px', background: '#fef3c7', padding: '5px', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fbbf24' },
  form: { display: 'flex', gap: '10px', marginBottom: '20px' },
  input: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', flex: 1 },
  btn: { padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
  card: (comp) => ({ padding: '15px', borderRadius: '12px', border: `2px solid ${comp ? '#22c55e' : '#e2e8f0'}`, background: comp ? '#f0fdf4' : 'white' }),
  progressBg: { height: '10px', background: '#e2e8f0', borderRadius: '5px', margin: '10px 0', overflow: 'hidden' },
  progressBar: (width, comp) => ({ height: '100%', width: `${width}%`, background: comp ? '#22c55e' : '#2563eb', transition: 'width 0.5s ease-out' }),
  smallBtn: { flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer', background: '#fff', fontWeight: 'bold' },
  delBtn: { border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '18px' }
};

export default GoalScreen;