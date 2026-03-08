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
  const [depositInputs, setDepositInputs] = useState({});
  const [showCelebration, setShowCelebration] = useState(false);

  const totalSaved = goals.reduce((sum, g) => sum + g.current, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
  const completionPercent = totalTarget ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  const suggestedGoals = [
    { name: 'Emergency fund', target: 500 },
    { name: 'New laptop', target: 1200 },
    { name: 'Summer trip', target: 800 }
  ];

  const addSuggestedGoal = (suggested) => {
    const newGoal = {
      id: Date.now(),
      name: suggested.name,
      target: suggested.target,
      current: 0,
      completed: false
    };
    setGoals((prev) => [...prev, newGoal]);
  };

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

  const handleCustomDeposit = (id) => {
    const amount = parseFloat(depositInputs[id]);
    if (!amount || amount <= 0) return;
    updateMoney(id, amount);
    setDepositInputs(prev => ({ ...prev, [id]: '' }));
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

      <div style={styles.summaryCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div>
            <h3 style={{ margin: 0 }}>Overall Savings Progress</h3>
            <p style={{ margin: '6px 0 0', color: '#64748b' }}>
              You have saved <strong>${totalSaved.toLocaleString()}</strong> of <strong>${totalTarget.toLocaleString()}</strong>.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>{completionPercent}%</p>
            <small style={{ color: '#64748b' }}>toward your combined goals</small>
          </div>
        </div>
        <div style={styles.progressBarContainer}>
          <div style={styles.progressBarFill(completionPercent)} />
        </div>
      </div>

      <div style={styles.suggestionCard}>
        <h3 style={{ margin: 0, marginBottom: '10px' }}>Need inspiration?</h3>
        <p style={{ margin: '0 0 10px', color: '#64748b' }}>
          Add a suggested goal in one tap to jumpstart your savings plan.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {suggestedGoals.map((suggested) => (
            <div key={suggested.name} style={styles.suggestedItem}>
              <div>
                <strong>{suggested.name}</strong>
                <div style={{ fontSize: '12px', color: '#64748b' }}>${suggested.target.toLocaleString()} goal</div>
              </div>
              <button style={styles.suggestionBtn} onClick={() => addSuggestedGoal(suggested)}>
                Add
              </button>
            </div>
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
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <button onClick={() => updateMoney(goal.id, 20)} style={styles.smallBtn}>+$20</button>
                        <button onClick={() => updateMoney(goal.id, 100)} style={styles.smallBtn}>+$100</button>
                        <input
                          type="number"
                          min="1"
                          placeholder="Custom"
                          value={depositInputs[goal.id] || ''}
                          onChange={(e) => setDepositInputs(prev => ({ ...prev, [goal.id]: e.target.value }))}
                          style={styles.smallInput}
                        />
                        <button
                          onClick={() => handleCustomDeposit(goal.id)}
                          style={styles.smallBtn}
                        >
                          Deposit
                        </button>
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
  progressBarContainer: { height: '10px', width: '100%', background: '#e2e8f0', borderRadius: '6px', marginTop: '10px', overflow: 'hidden' },
  progressBarFill: (pct) => ({ height: '100%', width: `${pct}%`, background: '#2563eb', transition: 'width 0.5s ease-out' }),
  summaryCard: { padding: '16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', marginBottom: '18px' },
  suggestionCard: { padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', marginBottom: '18px' },
  suggestedItem: { flex: '1 1 200px', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' },
  suggestionBtn: { padding: '8px 12px', borderRadius: '10px', border: '1px solid #2563eb', background: '#2563eb', color: 'white', cursor: 'pointer', fontWeight: 'bold' },
  smallBtn: { flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer', background: '#fff', fontWeight: 'bold' },
  smallInput: { flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' },
  delBtn: { border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '18px' }
};

export default GoalScreen;