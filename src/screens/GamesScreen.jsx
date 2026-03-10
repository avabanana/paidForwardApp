import React, { useState } from "react";

export default function GamesScreen({ userTier, onGameEnd }) {
  const [activeGame, setActiveGame] = useState(null); 
  const [playing, setPlaying] = useState(false);
  const [money, setMoney] = useState(0);
  const [day, setDay] = useState(1);
  const [gameResult, setGameResult] = useState(null); 
  
  const [tradeFeedback, setTradeFeedback] = useState(null); 

  const tierSettings = {
    elementary: {
      currencySymbol: "⭐",
      startingCash: 60, // Increased slightly
      totalDays: 7,
      icon: "🦁",
      themeColor: "#fbbf24",
      scenarios: [
        { q: "You found a cool toy for 20⭐! Do you buy it or keep your stars?", optA: ["Buy Toy", 20], optB: ["Save Stars", 0] },
        { q: "You're thirsty! Buy a fancy juice for 10⭐ or drink water for free?", optA: ["Fancy Juice", 10], optB: ["Free Water", 0] },
        { q: "A friend wants to trade stickers. Pay 5⭐ for a rare one or keep your stars?", optA: ["Rare Sticker", 5], optB: ["Keep Stars", 0] },
        { q: "You found 10⭐ helping clean up! Add it to your pouch?", optA: ["Add Stars", -10], optB: ["Skip", 0] }, // Negative cost = gain
        { q: "Ice cream truck outside! Spend 12⭐ or skip it?", optA: ["Buy Ice Cream", 12], optB: ["Skip It", 0] },
        { q: "New video game for 35⭐ - tempting! Budget it or pass?", optA: ["Buy Game", 35], optB: ["Pass", 0] },
        { q: "Friend's birthday gift - 8⭐ or 0⭐?", optA: ["Nice Gift", 8], optB: ["Homemade", 0] }
      ],
      marketScenarios: [
        { q: "Lemonade Stand: Spend 10⭐ on lemons. Big chance for profit!", optA: ["Sell Juice", 10], optB: ["Skip", 0] },
        { q: "Cookie Sale: Spend 15⭐ to bake. 60% success rate!", optA: ["Bake", 15], optB: ["Skip", 0] },
        { q: "Snow cone stand: Risk 20⭐ or save?", optA: ["Risk It", 20], optB: ["Save", 0] },
        { q: "Craft market: Spend 18⭐ on supplies. Will anyone buy?", optA: ["Try It", 18], optB: ["Skip", 0] },
        { q: "Tutoring: Invest 12⭐ in materials. Risky!", optA: ["Invest", 12], optB: ["Skip", 0] },
        { q: "Pool cleaning gig: Spend 8⭐ on tools. Might work!", optA: ["Invest", 8], optB: ["Skip", 0] },
        { q: "Final gamble: Use 25⭐ for your biggest venture yet?", optA: ["Go Big", 25], optB: ["Play Safe", 0] }
      ],
      marketReasons: {
        success: [
          "It was a super sunny day! Everyone wanted a cold drink.",
          "A group of friends loved your treats and bought them all!",
          "You did such a great job that customers gave you extra tips!",
          "Your items were so cool they sold out in minutes!"
        ],
        failure: [
          "Oh no! It rained today and customers stayed home.",
          "The shop raised the price of your supplies.",
          "A neighbor opened a similar stand right next to yours.",
          "You accidentally dropped some supplies and had to buy more."
        ]
      },
      savingScenarios: [
        { q: "You found 5⭐ under your pillow. Add to savings or spend it?", optA: ["Spend it", 5], optB: ["Save it", 0] },
        { q: "Your piggy bank is full. Add another 10⭐ or buy a small toy?", optA: ["Buy Toy", 10], optB: ["Add to Savings", 0] },
        { q: "A neighbor offers you 5⭐ for helping with chores. Keep or save?", optA: ["Keep it", 5], optB: ["Save it", 0] },
        { q: "Your allowance comes in. Spend it or move to savings?", optA: ["Spend it", 15], optB: ["Save it", 0] }
      ]
    },
    adult: {
      currencySymbol: "$",
      startingCash: 800, // Increased starting cash
      totalDays: 15,
      icon: "💼",
      themeColor: "#2563eb",
      scenarios: [
        { q: "Rent: $300 studio or $150 shared with chaos?", optA: ["Studio", 300], optB: ["Shared", 150] },
        { q: "Transport: $80 subway pass or $120 pay-per-ride?", optA: ["Pass", 80], optB: ["Pay-Per-Ride", 120] },
        { q: "Groceries: $90 organic or $40 basics?", optA: ["Organic", 90], optB: ["Basics", 40] },
        { q: "Car tire emergency: $120 new or $50 patch?", optA: ["New Tire", 120], optB: ["Patch", 50] },
        { q: "Side hustle income: Spend 1 hour to earn $60?", optA: ["Work", -60], optB: ["Rest", 0] },
        { q: "Health insurance: $60 or risk a fine later?", optA: ["Pay", 60], optB: ["Risk It", 0] },
        { q: "Internet: $70 fast or $35 slow?", optA: ["Fast", 70], optB: ["Slow", 35] },
        { q: "Mid-month Paycheck! Receive $200?", optA: ["Deposit", -200], optB: ["Deposit", -200] },
        { q: "Retirement fund: Lock away $100 now?", optA: ["Invest", 100], optB: ["Keep", 0] },
        { q: "Accountant: $50 pro or $0 DIY taxes?", optA: ["Pro", 50], optB: ["DIY", 0] },
        { q: "Professional development: $75 course?", optA: ["Enroll", 75], optB: ["Skip", 0] },
        { q: "Home repair: $200 plumber or DIY risk?", optA: ["Plumber", 200], optB: ["DIY", 0] },
        { q: "Dental checkup: $150 or skip?", optA: ["Checkup", 150], optB: ["Skip", 0] },
        { q: "Car maintenance: $180 service or ignore?", optA: ["Service", 180], optB: ["Ignore", 0] },
        { q: "Bonus Gift: You won a $50 prize!", optA: ["Claim", -50], optB: ["Claim", -50] }
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
      ],
      marketReasons: {
        success: [
          "The company beat earnings expectations this quarter!",
          "A new patent was approved, driving stock prices up.",
          "Market sentiment shifted bullish on this sector today.",
          "Your investment saw a massive spike after a viral social media trend."
        ],
        failure: [
          "Oh no! The company's stocks went down today due to regulatory issues.",
          "Market volatility caused a sudden dip in your portfolio.",
          "Higher interest rates are cooling off investor interest in this asset.",
          "An unexpected CEO departure sparked a brief market panic."
        ]
      },
      savingScenarios: [
        { q: "You got a tax refund. Put it in savings or splurge?", optA: ["Splurge", 120], optB: ["Save it", 0] },
        { q: "Your pay raise arrived! Shift it to savings or spend more?", optA: ["Spend more", 110], optB: ["Save more", 0] },
        { q: "You found extra cash in an old coat. Add it to savings?", optA: ["Treat yourself", 60], optB: ["Save it", 0] },
        { q: "You can set aside $100 for your future. Do it?", optA: ["Spend it", 100], optB: ["Save it", 0] }
      ]
    }
  };

  const config = tierSettings[userTier] || tierSettings.adult;
  const scenarios = activeGame === 'Market' ? config.marketScenarios : activeGame === 'Save' ? config.savingScenarios : config.scenarios;
  const currentScenario = scenarios[Math.min(day - 1, scenarios.length - 1)];

  const handleChoice = (cost) => {
    if (tradeFeedback) return; 

    let outcomeMoney = money;
    let feedback = null;

    if (activeGame === 'Market') {
      if (cost === 0) {
        processNextStep(money); 
      } else {
        const success = Math.random() > 0.45; 
        const amount = success ? cost : -cost;
        const newTotal = money + amount;
        
        const reasons = success ? config.marketReasons.success : config.marketReasons.failure;
        const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
        
        setTradeFeedback({ success, amount: Math.abs(amount), reason: randomReason, outcomeMoney: newTotal });
      }
    } else if (activeGame === 'Save') {
      if (cost === 0) {
        const bonus = Math.max(10, Math.round(config.startingCash * 0.05));
        outcomeMoney = money + bonus;
      } else {
        outcomeMoney = money - cost;
      }
      processNextStep(outcomeMoney);
    } else {
      // In Budgeting, cost 0 doesn't automatically give +10 anymore to stay realistic, 
      // but the scenarios themselves now include income.
      outcomeMoney = money - cost;
      processNextStep(outcomeMoney);
    }
  };

  const processNextStep = (outcomeMoney) => {
    setTradeFeedback(null); 
    
    if (outcomeMoney <= 0) {
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
      
      let won = false;
      if (activeGame === 'Market') {
        won = outcomeMoney >= config.startingCash * 1.1;
      } else if (activeGame === 'Save') {
        won = outcomeMoney >= config.startingCash * 1.2;
      } else {
        // BUDGETING: Win if you still have 30% of your starting cash at the end.
        won = outcomeMoney >= config.startingCash * 0.3;
      }
      
      setGameResult(won ? 'won' : 'lost');
      if (onGameEnd) onGameEnd(won ? 'won' : 'lost');
    }
  };

  // ... (resetGame and return statements remain exactly the same as previous)
  const resetGame = () => {
    if (onGameEnd && playing && !gameResult) onGameEnd('quit');
    setPlaying(false);
    setGameResult(null);
    setDay(1);
    setActiveGame(null);
    setMoney(0);
    setTradeFeedback(null);
  };

  if (gameResult) {
    const isWin = gameResult === 'won';
    return (
      <div style={gStyles.resultContainer}>
        <div style={{...gStyles.resultCard, background: isWin ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'}}>
          <div style={gStyles.resultEmoji}>{isWin ? '🎉🏆' : '💔😢'}</div>
          <h1 style={gStyles.resultTitle}>{isWin ? 'YOU WON!' : 'GAME OVER!'}</h1>
          <div style={gStyles.resultDetails}>
            <div style={gStyles.statRow}><span>Start:</span><b>{config.currencySymbol}{config.startingCash}</b></div>
            <div style={gStyles.statRow}><span>End:</span><b style={{fontSize: '22px'}}>{config.currencySymbol}{money}</b></div>
          </div>
          <div style={gStyles.resultActions}>
            <button style={{ ...gStyles.playBtn, background: '#fff', color: isWin ? '#059669' : '#dc2626' }} onClick={resetGame}>Play Again</button>
            <button style={{ ...gStyles.playBtn, background: 'rgba(255,255,255,0.2)', color: '#fff' }} onClick={resetGame}>Exit</button>
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
          <div style={{...gStyles.stat, color: money < (config.startingCash * 0.2) ? '#ef4444' : config.themeColor}}>
            {config.currencySymbol} {money}
          </div>
        </div>

        <div style={gStyles.actionCard}>
          {tradeFeedback ? (
            <div style={gStyles.feedbackOverlay}>
              <h1 style={{ fontSize: '60px', margin: '0' }}>{tradeFeedback.success ? '🚀' : '📉'}</h1>
              <h2 style={{ color: tradeFeedback.success ? '#10b981' : '#ef4444', margin: '10px 0' }}>
                {tradeFeedback.success ? `+${config.currencySymbol}${tradeFeedback.amount}` : `-${config.currencySymbol}${tradeFeedback.amount}`}
              </h2>
              <p style={{ fontWeight: '600', padding: '0 10px', color: '#475569' }}>{tradeFeedback.reason}</p>
              <button 
                style={{...gStyles.choiceBtn, background: config.themeColor, marginTop: '20px', width: '150px'}} 
                onClick={() => processNextStep(tradeFeedback.outcomeMoney)}
              >
                Continue
              </button>
            </div>
          ) : (
            <>
              <h2 style={gStyles.scenarioTitle}>{activeGame} Adventure</h2>
              <p style={gStyles.scenarioText}>{currentScenario.q}</p>
              <div style={gStyles.choiceRow}>
                <button style={{...gStyles.choiceBtn, background: config.themeColor}} onClick={() => handleChoice(currentScenario.optA[1])}>
                  {currentScenario.optA[0]} ({currentScenario.optA[1] < 0 ? `+${config.currencySymbol}${Math.abs(currentScenario.optA[1])}` : `${config.currencySymbol}${currentScenario.optA[1]}`})
                </button>
                <button style={gStyles.choiceBtnSecondary} onClick={() => handleChoice(currentScenario.optB[1])}>
                  {currentScenario.optB[0]}
                </button>
              </div>
            </>
          )}
        </div>
        <button onClick={resetGame} style={gStyles.quitBtn}>Quit Game</button>
      </div>
    );
  }

  return (
    <div style={gStyles.menuContainer}>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { id: 'Budget', title: 'Budgeting Basics', icon: config.icon, color: config.themeColor, desc: 'Keep your balance high by spending wisely.' },
          { id: 'Market', title: 'Investing Adventure', icon: '📈', color: '#8b5cf6', desc: 'Take calculated risks to grow your wealth.' },
          { id: 'Save', title: 'Savings Sprint', icon: '💰', color: '#10b981', desc: 'The safer path to steady growth.' }
        ].map(game => (
          <div key={game.id} style={{ ...gStyles.promoCard, borderTop: `8px solid ${game.color}`, width: '280px' }}>
            <div style={gStyles.gameIcon}>{game.icon}</div>
            <h3>{game.title}</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>{game.desc}</p>
            <button style={{ ...gStyles.playBtn, background: game.color }} onClick={() => { setMoney(config.startingCash); setActiveGame(game.id); setPlaying(true); }}>
              Play
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const gStyles = {
  menuContainer: { display: 'flex', justifyContent: 'center', padding: '40px 20px' },
  promoCard: { background: '#fff', padding: '25px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
  gameIcon: { fontSize: '40px', marginBottom: '10px' },
  playBtn: { width: '100%', padding: '12px', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  gameContainer: { maxWidth: '450px', margin: '0 auto' },
  statusBar: { display: 'flex', justifyContent: 'space-between', padding: '15px 20px', background: '#fff', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' },
  stat: { fontWeight: '800', fontSize: '16px' },
  actionCard: { background: '#fff', padding: '40px 30px', borderRadius: '25px', textAlign: 'center', minHeight: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' },
  feedbackOverlay: { animation: 'fadeIn 0.3s ease-in', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  scenarioTitle: { fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' },
  scenarioText: { color: '#1e293b', marginBottom: '30px', fontSize: '18px', fontWeight: '700' },
  choiceRow: { display: 'flex', flexDirection: 'column', gap: '10px' },
  choiceBtn: { padding: '15px', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' },
  choiceBtnSecondary: { padding: '15px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer' },
  quitBtn: { display: 'block', margin: '20px auto', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontWeight: 'bold' },
  resultContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' },
  resultCard: { padding: '50px 40px', borderRadius: '35px', textAlign: 'center', maxWidth: '500px', color: '#fff' },
  resultEmoji: { fontSize: '60px', marginBottom: '15px' },
  resultTitle: { fontSize: '36px', fontWeight: '900', margin: '0 0 20px 0' },
  resultDetails: { background: 'rgba(255,255,255,0.15)', padding: '20px', borderRadius: '15px', marginBottom: '25px' },
  statRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  resultActions: { display: 'flex', flexDirection: 'column', gap: '10px' }
};