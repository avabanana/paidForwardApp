import React, { useState } from "react";

export default function GamesScreen() {
  const [playing, setPlaying] = useState(false);
  const [money, setMoney] = useState(100);

  const handleChoice = (cost) => {
    setMoney(prev => prev - cost);
    if (money - cost <= 0) alert("You ran out of funds! Try a different strategy.");
  };

  if (playing) {
    return (
      <div style={gameWrapper}>
        <button onClick={() => setPlaying(false)} style={backBtn}>← Back to Games</button>
        <div style={gameDashboard}>
          <h2>Budget Master</h2>
          <div style={balanceCard}>Wallet: ${money}</div>
          <p style={{ fontSize: '18px', margin: '20px 0' }}>You need lunch. The cafeteria is $12, but packing a sandwich is $3. What do you do?</p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button style={choiceBtn} onClick={() => handleChoice(12)}>Buy Cafeteria ($12)</button>
            <button style={choiceBtn} onClick={() => handleChoice(3)}>Pack Lunch ($3)</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={card}>
        <h3>🎮 Budget Master</h3>
        <p>Can you survive a week on a limited budget?</p>
        <button style={startBtn} onClick={() => setPlaying(true)}>Start Playing</button>
      </div>
    </div>
  );
}

const gameWrapper = { padding: '20px', backgroundColor: '#f0f9ff', borderRadius: '15px' };
const balanceCard = { fontSize: '32px', fontWeight: 'bold', color: '#059669', margin: '10px 0' };
const choiceBtn = { padding: '15px 25px', backgroundColor: '#4A90E2', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' };
const card = { padding: '20px', border: '1px solid #eee', borderRadius: '15px', width: '280px' };
const startBtn = { width: '100%', padding: '10px', backgroundColor: '#4A90E2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const backBtn = { background: 'none', border: 'none', color: '#4A90E2', cursor: 'pointer', fontWeight: 'bold' };
const gameDashboard = { textAlign: 'center' };