import React, { useState } from "react";

export default function GamesScreen({ userTier, onGameEnd }) {
  const [activeGame, setActiveGame] = useState(null); // 'Budget' or 'Market'
  const [playing, setPlaying] = useState(false);
  const [money, setMoney] = useState(0);
  const [day, setDay] = useState(1);
  const [gameResult, setGameResult] = useState(null); // 'won' or 'lost'

  const tierSettings = {
    elementary: {
      currencySymbol: "⭐",
      startingCash: 50,
      totalDays: 7,
      icon: "🦁",
      themeColor: "#fbbf24",
      scenarios: [
        { q: "You found a cool toy for 20⭐! Do you buy it or keep your stars?", optA: ["Buy Toy", 20], optB: ["Save Stars", 0] },
        { q: "You're thirsty! Buy a fancy juice for 10⭐ or drink water for free?", optA: ["Fancy Juice", 10], optB: ["Free Water", 0] },
        { q: "A friend wants to trade stickers. Pay 5⭐ for a rare one or keep your stars?", optA: ["Rare Sticker", 5], optB: ["Keep Stars", 0] },
        { q: "You lost a library book. Pay 15⭐ to replace it or use your coupon?", optA: ["Pay Stars", 15], optB: ["Use Coupon", 0] },
        { q: "Ice cream truck outside! Spend 12⭐ or skip it?", optA: ["Buy Ice Cream", 12], optB: ["Skip It", 0] },
        { q: "New video game for 35⭐ - tempting! Budget it or pass?", optA: ["Buy Game", 35], optB: ["Pass", 0] },
        { q: "Friend's birthday gift - 8⭐ or 0⭐?", optA: ["Nice Gift", 8], optB: ["Homemade", 0] }
      ],
      marketScenarios: [
        { q: "Lemonade Stand: Spend 10⭐ on lemons. 50/50 chance to make profit!", optA: ["Sell Juice", 10], optB: ["Skip", 0] },
        { q: "Cookie Sale: Spend 15⭐ to bake. 60% success rate!", optA: ["Bake", 15], optB: ["Skip", 0] },
        { q: "Snow cone stand: Risk 20⭐ or save?", optA: ["Risk It", 20], optB: ["Save", 0] },
        { q: "Craft market: Spend 18⭐ on supplies. Will anyone buy?", optA: ["Try It", 18], optB: ["Skip", 0] },
        { q: "Tutoring: Invest 12⭐ in materials. Risky!", optA: ["Invest", 12], optB: ["Skip", 0] },
        { q: "Pool cleaning gig: Spend 8⭐ on tools. Might work!", optA: ["Invest", 8], optB: ["Skip", 0] },
        { q: "Final gamble: Use 25⭐ to start your biggest venture yet?", optA: ["Go Big", 25], optB: ["Play Safe", 0] }
      ]
    },
    middle: {
      currencySymbol: "$",
      startingCash: 150,
      totalDays: 8,
      icon: "🛹",
      themeColor: "#10b981",
      scenarios: [
        { q: "Everyone's wearing 'Cool-Kicks' ($80). Feel the pressure?", optA: ["Buy Kicks", 80], optB: ["Keep Shoes", 0] },
        { q: "Lunch: Pizza party ($15) or packed lunch (free)?", optA: ["Pizza Party", 15], optB: ["Packed Lunch", 0] },
        { q: "Phone screen cracked! Fix it ($40) or tough it out?", optA: ["Fix Screen", 40], optB: ["Live with It", 0] },
        { q: "New video game dropped ($30). Now or sale?", optA: ["Buy Now", 30], optB: ["Wait for Sale", 0] },
        { q: "Concert tickets ($45). Worth it?", optA: ["Go", 45], optB: ["Skip", 0] },
        { q: "New backpack for school ($35). Need it?", optA: ["Buy", 35], optB: ["Use Old One", 0] },
        { q: "Streaming services ($25/month). Keep them?", optA: ["Keep All", 25], optB: ["Cancel", 0] },
        { q: "Impulse buy: Trendy hat ($18). Last chance!", optA: ["Buy", 18], optB: ["Pass", 0] }
      ],
      marketScenarios: [
        { q: "Resell sneakers: Buy $100, sell for $180-50. Risk it?", optA: ["Buy/Flip", 100], optB: ["Pass", 0] },
        { q: "Print t-shirts: Spend $50, might lose or double money.", optA: ["Print Shirts", 50], optB: ["Skip", 0] },
        { q: "Social media content: Invest $60 in gear. Uncertain return.", optA: ["Invest", 60], optB: ["Skip", 0] },
        { q: "Resell video games: Spend $75, risky market.", optA: ["Buy", 75], optB: ["Pass", 0] },
        { q: "Dropshipping trial: $40 to start. 40% fail rate.", optA: ["Try It", 40], optB: ["Skip", 0] },
        { q: "Tutoring service: Spend $30 on ads. Might flop.", optA: ["Advertise", 30], optB: ["Skip", 0] },
        { q: "Freelance platform: $45 investment. Competitive field.", optA: ["Subscribe", 45], optB: ["Skip", 0] },
        { q: "Last shot: Spend $80 on your biggest gamble yet!", optA: ["Go Big", 80], optB: ["Play Safe", 0] }
      ]
    },
    adult: {
      currencySymbol: "$",
      startingCash: 500,
      totalDays: 15,
      icon: "💼",
      themeColor: "#2563eb",
      scenarios: [
        { q: "Rent: $300 studio or $150 shared with chaos?", optA: ["Studio", 300], optB: ["Shared", 150] },
        { q: "Transport: $80 subway pass or $120 pay-per-ride?", optA: ["Pass", 80], optB: ["Pay-Per-Ride", 120] },
        { q: "Groceries: $90 organic or $40 basics?", optA: ["Organic", 90], optB: ["Basics", 40] },
        { q: "Car tire emergency: $120 new or $50 patch?", optA: ["New Tire", 120], optB: ["Patch", 50] },
        { q: "Side hustle: $40 supplies or skip it?", optA: ["Invest", 40], optB: ["Skip", 0] },
        { q: "Health insurance: $60 or risk a fine later?", optA: ["Pay", 60], optB: ["Risk It", 0] },
        { q: "Internet: $70 fast or $35 slow?", optA: ["Fast", 70], optB: ["Slow", 35] },
        { q: "Friend's wedding: $100 gift or $20 card?", optA: ["Gift", 100], optB: ["Card", 20] },
        { q: "Retirement fund: Lock away $100 now?", optA: ["Invest", 100], optB: ["Keep", 0] },
        { q: "Accountant: $50 pro or $0 DIY taxes?", optA: ["Pro", 50], optB: ["DIY", 0] },
        { q: "Professional development: $75 course?", optA: ["Enroll", 75], optB: ["Skip", 0] },
        { q: "Home repair: $200 plumber or DIY risk?", optA: ["Plumber", 200], optB: ["DIY", 0] },
        { q: "Dental checkup: $150 or skip?", optA: ["Checkup", 150], optB: ["Skip", 0] },
        { q: "Car maintenance: $180 service or ignore?", optA: ["Service", 180], optB: ["Ignore", 0] },
        { q: "Final test: $250 investment opportunity. Real or scam?", optA: ["Invest", 250], optB: ["Pass", 0] }
      ],
      marketScenarios: [
        { q: "Crypto: $200 volatile coin. 50% to triple or lose all!", optA: ["Invest", 200], optB: ["Skip", 0] },
        { q: "Options trading: $150 contract. High risk!", optA: ["Trade", 150], optB: ["Skip", 0] },
        { q: "Penny stocks: $300 shares. Undervalued or scam?", optA: ["Buy", 300], optB: ["Skip", 0] },
        { q: "Real estate crowdfund: $400 minimum. 30% fail rate.", optA: ["Invest", 400], optB: ["Skip", 0] },
        { q: "Startup equity: $250 pre-seed round. Risky!", optA: ["Invest", 250], optB: ["Skip", 0] },
        { q: "Forex: $180 trade. Highly volatile.", optA: ["Trade", 180], optB: ["Skip", 0] },
        { q: "MLM opportunity: $120 startup. Sketchy vibes?", optA: ["Join", 120], optB: ["Pass", 0] },
        { q: "Business loan: Borrow $500 at risky interest?", optA: ["Borrow", 500], optB: ["Skip", 0] },
        { q: "Friend's business: $300 loan, might never return.", optA: ["Loan", 300], optB: ["Decline", 0] },
        { q: "Hot IPO: $350 allocation. Hype-driven?", optA: ["Buy", 350], optB: ["Skip", 0] },
        { q: "Emerging market fund: $280 bet on growth.", optA: ["Invest", 280], optB: ["Skip", 0] },
        { q: "Meme stock surge: $400 FOMO move. Bad idea?", optA: ["Buy", 400], optB: ["Skip", 0] },
        { q: "Crypto NFT: $200 collectible. Bubble?", optA: ["Buy", 200], optB: ["Skip", 0] },
        { q: "Private equity: $450 opportunity. Exclusive!", optA: ["Invest", 450], optB: ["Pass", 0] },
        { q: "FINAL GAMBLE: All-in on something risky or finish safe?", optA: ["All In", 350], optB: ["Conservative", 0] }
      ]
    }
  };

  const config = tierSettings[userTier] || tierSettings.adult;
  const scenarios = activeGame === 'Market' ? config.marketScenarios : config.scenarios;
  const currentScenario = scenarios[Math.min(day - 1, scenarios.length - 1)];

  const handleChoice = (cost) => {
    // Logic for Market Game (Random luck)
    let outcomeMoney = money - cost;
    if (activeGame === 'Market' && cost > 0) {
      const success = Math.random() > 0.5;
      outcomeMoney = success ? money + (cost * 2) : money - cost;
    }

    if (outcomeMoney <= 0) {
      alert("You've run out of money! Game over.");
      setMoney(0);
      setGameResult('lost');
      if (onGameEnd) onGameEnd('lost');
      return;
    }
    
    const maxDays = scenarios.length;
    if (day < maxDays) {
      setMoney(outcomeMoney);
      setDay(day + 1);
    } else {
      setMoney(outcomeMoney);
      setGameResult('won');
      if (onGameEnd) onGameEnd('won');
    }
  };

  const resetGame = () => {
    // count quit as a played game
    if (onGameEnd && playing && !gameResult) {
      onGameEnd('quit');
    }

    setPlaying(false);
    setGameResult(null);
    setDay(1);
    setActiveGame(null);
    setMoney(0);
  };

  if (gameResult) {
    const isWin = gameResult === 'won';
    const winThreshold = config.startingCash * 1.5;
    const didWellEnough = money >= config.startingCash * 0.8;
    
    return (
      <div style={gStyles.resultContainer}>
        <div style={{...gStyles.resultCard, background: isWin ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'}}>
          <div style={gStyles.resultEmoji}>{isWin ? '🎉🏆' : '💔😢'}</div>
          <h1 style={gStyles.resultTitle}>{isWin ? 'YOU WON!' : 'GAME OVER!'}</h1>
          
          <div style={gStyles.resultDetails}>
            <div style={gStyles.statRow}>
              <span>Starting Balance:</span>
              <span style={{fontWeight: 'bold'}}>{config.currencySymbol}{config.startingCash}</span>
            </div>
            <div style={gStyles.statRow}>
              <span>Final Balance:</span>
              <span style={{fontWeight: 'bold', fontSize: '20px'}}>{config.currencySymbol}{money}</span>
            </div>
            <div style={gStyles.statRow}>
              <span>Change:</span>
              <span style={{fontWeight: 'bold', color: money >= config.startingCash ? '#4ade80' : '#f87171'}}>
                {money >= config.startingCash ? '+' : ''}{config.currencySymbol}{money - config.startingCash}
              </span>
            </div>
          </div>

          <div style={gStyles.resultMessage}>
            {isWin ? (
              <>
                <p>🌟 Excellent money management! You survived all {config.totalDays} rounds!</p>
                {money > config.startingCash && <p>💪 You even grew your wealth! Amazing!</p>}
              </>
            ) : (
              <>
                <p>💸 You ran out of money and couldn't continue.</p>
                {money === 0 && <p>Zero balance reached. You learned a valuable lesson about budgeting!</p>}
                <p>💡 Tip: Balance your spending and save for emergencies.</p>
              </>
            )}
          </div>

          <div style={gStyles.resultActions}>
            <button style={{...gStyles.playBtn, background: '#fff', color: isWin ? '#059669' : '#dc2626'}} onClick={resetGame}>
              Play Again
            </button>
            <button style={{...gStyles.playBtn, background: 'rgba(255,255,255,0.2)', color: '#fff'}} onClick={resetGame}>
              Back to Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (playing) {
    return (
      <div style={gStyles.gameContainer}>
        <div style={{...gStyles.statusBar, borderTop: `5px solid ${config.themeColor}`}}>
          <div style={gStyles.stat}>📅 {activeGame === 'Market' ? 'Trade' : 'Day'} {day}/{scenarios.length}</div>
          <div style={{...gStyles.stat, color: money < 30 ? '#ef4444' : config.themeColor}}>
            {config.currencySymbol} Balance: {money}
          </div>
        </div>
        <div style={gStyles.actionCard}>
          <h2 style={gStyles.scenarioTitle}>{activeGame} Mode</h2>
          <p style={gStyles.scenarioText}>{currentScenario.q}</p>
          <div style={gStyles.choiceRow}>
            <button style={{...gStyles.choiceBtn, background: config.themeColor}} onClick={() => handleChoice(currentScenario.optA[1])}>
              {currentScenario.optA[0]} ({config.currencySymbol}{currentScenario.optA[1]})
            </button>
            <button style={gStyles.choiceBtnSecondary} onClick={() => handleChoice(currentScenario.optB[1])}>
              {currentScenario.optB[0]}
            </button>
          </div>
        </div>
        <button onClick={resetGame} style={gStyles.quitBtn}>Quit</button>
      </div>
    );
  }

  return (
    <div style={gStyles.menuContainer}>
       <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center'}}>
          {/* Game 1: Original Budget Game */}
          <div style={{...gStyles.promoCard, borderTop: `8px solid ${config.themeColor}`, width: '300px'}}>
            <div style={gStyles.gameIcon}>{config.icon}</div>
            <h3>Budgeting Basics</h3>
            <button style={{...gStyles.playBtn, background: config.themeColor}} onClick={() => { setMoney(config.startingCash); setActiveGame('Budget'); setPlaying(true); }}>Play Budgeting</button>
          </div>
          
          {/* Game 2: NEW Market Game */}
          <div style={{...gStyles.promoCard, borderTop: `8px solid #8b5cf6`, width: '300px'}}>
            <div style={gStyles.gameIcon}>📈</div>
            <h3>Market Mania</h3>
            <button style={{...gStyles.playBtn, background: '#8b5cf6'}} onClick={() => { setMoney(config.startingCash); setActiveGame('Market'); setPlaying(true); }}>Play Investing</button>
          </div>

          {/* Game 3: Second Budget‑style Game */}
          <div style={{...gStyles.promoCard, borderTop: `8px solid ${config.themeColor}`, width: '300px'}}>
            <div style={gStyles.gameIcon}>{config.icon}</div>
            <h3>Budget Blitz</h3>
            <button style={{...gStyles.playBtn, background: config.themeColor}} onClick={() => { setMoney(config.startingCash); setActiveGame('Budget2'); setPlaying(true); }}>Play Budget Blitz</button>
          </div>
       </div>
    </div>
  );
}

const gStyles = {
  menuContainer: { display: 'flex', justifyContent: 'center', padding: '40px 20px' },
  promoCard: { background: '#fff', padding: '30px', borderRadius: '32px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.06)' },
  gameIcon: { fontSize: '50px', marginBottom: '10px' },
  playBtn: { width: '100%', padding: '15px', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', marginTop: '10px' },
  gameContainer: { maxWidth: '500px', margin: '0 auto' },
  statusBar: { display: 'flex', justifyContent: 'space-between', padding: '20px', background: '#fff', borderRadius: '20px', marginBottom: '20px' },
  stat: { fontWeight: '900', fontSize: '18px' },
  actionCard: { background: '#fff', padding: '30px', borderRadius: '30px', textAlign: 'center' },
  scenarioTitle: { fontSize: '12px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' },
  scenarioText: { color: '#1e293b', marginBottom: '30px', fontSize: '18px', fontWeight: '700' },
  choiceRow: { display: 'flex', flexDirection: 'column', gap: '10px' },
  choiceBtn: { padding: '15px', color: '#fff', border: 'none', borderRadius: '15px', cursor: 'pointer' },
  choiceBtnSecondary: { padding: '15px', background: '#f1f5f9', border: 'none', borderRadius: '15px', cursor: 'pointer' },
  quitBtn: { display: 'block', margin: '20px auto', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' },
  resultContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px', background: '#f1f5f9' },
  resultCard: { background: '#fff', padding: '60px 40px', borderRadius: '40px', textAlign: 'center', maxWidth: '600px', boxShadow: '0 40px 80px rgba(0,0,0,0.15)', color: '#fff' },
  resultEmoji: { fontSize: '80px', marginBottom: '20px' },
  resultTitle: { fontSize: '48px', fontWeight: '900', margin: '0 0 30px 0' },
  resultDetails: { background: 'rgba(255,255,255,0.2)', padding: '30px', borderRadius: '24px', marginBottom: '30px', textAlign: 'left' },
  statRow: { display: 'flex', justifyContent: 'space-between', fontSize: '18px', marginBottom: '15px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.3)' },
  resultMessage: { fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' },
  resultActions: { display: 'flex', flexDirection: 'column', gap: '15px' }
};