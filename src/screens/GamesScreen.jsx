import React, { useState } from "react";

export default function GamesScreen() {
  const [playing, setPlaying] = useState(false);
  const [money, setMoney] = useState(100);
  const [day, setDay] = useState(1);

  const handleChoice = (cost, scenarioText) => {
    if (money - cost < 0) {
      alert("Transaction Declined! You don't have enough money for that.");
      return;
    }
    setMoney(prev => prev - cost);
    if (day < 7) {
      setDay(day + 1);
    } else {
      alert(`Week Complete! You survived with $${money - cost} left. Great job!`);
      setPlaying(false);
      setDay(1);
      setMoney(100);
    }
  };

  if (playing) {
    return (
      <div style={gStyles.gameContainer}>
        <div style={gStyles.statusBar}>
          <div style={gStyles.stat}>📅 Day {day}/7</div>
          <div style={{...gStyles.stat, color: money < 20 ? '#ef4444' : '#10b981'}}>💰 Balance: ${money}</div>
        </div>
        
        <div style={gStyles.actionCard}>
          <div style={gStyles.iconCircle}>💳</div>
          <h2 style={gStyles.scenarioTitle}>Daily Decision</h2>
          <p style={gStyles.scenarioText}>
            {day === 1 && "It's Monday! Do you want to buy a $15 meal kit for the week or eat out for $40?"}
            {day === 2 && "You need a notebook for class. Buy a fancy one for $12 or a basic one for $3?"}
            {day === 3 && "Your friends want to see a movie. Tickets and popcorn are $25, or stay home and stream for free?"}
            {day >= 4 && "An unexpected bill arrived! Pay the $20 fee or call to negotiate (costs $5 processing)?"}
          </p>
          
          <div style={gStyles.choiceRow}>
            <button style={gStyles.choiceBtn} onClick={() => handleChoice(20, "")}>Option A (Expensive)</button>
            <button style={{...gStyles.choiceBtn, background: '#1a1a1a'}} onClick={() => handleChoice(5, "")}>Option B (Budget)</button>
          </div>
        </div>

        <button onClick={() => setPlaying(false)} style={gStyles.quitBtn}>Abort Mission</button>
      </div>
    );
  }

  return (
    <div style={gStyles.menuContainer}>
      <div style={gStyles.promoCard}>
        <div style={gStyles.gameIcon}>🎮</div>
        <h3 style={{fontSize: '24px', margin: '10px 0'}}>Budget Master</h3>
        <p style={{color: '#64748b', fontSize: '15px', marginBottom: '25px', lineHeight: '1.5'}}>
          Test your financial survival skills. Can you make $100 last a full week?
        </p>
        <button style={gStyles.playBtn} onClick={() => setPlaying(true)}>Start Challenge</button>
      </div>
    </div>
  );
}

const gStyles = {
  menuContainer: { display: 'flex', justifyContent: 'center', padding: '20px' },
  promoCard: { 
    background: '#fff', padding: '40px', borderRadius: '28px', textAlign: 'center', 
    boxShadow: '0 15px 35px rgba(0,0,0,0.1)', width: '100%', maxWidth: '350px',
    border: '1px solid #f1f5f9'
  },
  gameIcon: { fontSize: '60px', marginBottom: '10px' },
  playBtn: { 
    width: '100%', padding: '16px', background: '#4A90E2', color: '#fff', 
    border: 'none', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer',
    fontSize: '16px', boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)'
  },
  gameContainer: { maxWidth: '500px', margin: '0 auto', animation: 'fadeIn 0.5s ease' },
  statusBar: { 
    display: 'flex', justifyContent: 'space-between', padding: '20px 25px', 
    background: '#fff', borderRadius: '20px', marginBottom: '20px', 
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' 
  },
  stat: { fontWeight: '800', fontSize: '18px', color: '#1e293b' },
  actionCard: { 
    background: '#fff', padding: '40px', borderRadius: '30px', 
    boxShadow: '0 20px 40px rgba(0,0,0,0.08)', textAlign: 'center',
    border: '1px solid #f1f5f9'
  },
  iconCircle: { 
    width: '60px', height: '60px', background: '#eff6ff', borderRadius: '50%', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', 
    fontSize: '30px', margin: '0 auto 20px auto' 
  },
  scenarioTitle: { fontSize: '24px', color: '#1e293b', marginBottom: '10px' },
  scenarioText: { color: '#64748b', lineHeight: '1.7', marginBottom: '35px', fontSize: '16px' },
  choiceRow: { display: 'flex', flexDirection: 'column', gap: '12px' },
  choiceBtn: { 
    padding: '18px', background: '#4A90E2', color: '#fff', border: 'none', 
    borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px',
    transition: 'transform 0.2s'
  },
  quitBtn: { 
    display: 'block', margin: '25px auto', background: 'none', border: 'none', 
    color: '#94a3b8', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' 
  }
};