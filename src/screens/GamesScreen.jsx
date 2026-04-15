import React, { useState, useRef } from "react";

const STOCK_FAIL_REASONS = [
  "The company missed its quarterly earnings by 40%. Investors panicked and sold off.",
  "A major competitor launched a cheaper product, gutting the stock's market share overnight.",
  "The CEO was caught in an accounting scandal. Trading was halted before you could exit.",
  "Supply chain disruptions in Southeast Asia crippled production for the quarter.",
  "The Fed raised interest rates unexpectedly, hammering growth stocks across the board.",
  "A short-seller published a damning report calling the company a 'house of cards.'",
  "Regulatory fines worth $2B were announced. The stock dropped 38% in a single session.",
  "A data breach exposed 50 million user records. Customer trust collapsed overnight.",
  "The company's key patent was invalidated in court, wiping out its competitive moat.",
  "Macroeconomic fears triggered a broad market sell-off. Your position took collateral damage.",
];

const STOCK_WIN_REASONS = [
  "Strong earnings beat expectations by 25%. Institutional buyers piled in.",
  "The company announced a surprise share buyback program. Stock jumped 18%.",
  "A partnership with a major tech giant was announced. Momentum traders flooded in.",
  "Inflation data came in lower than expected — growth stocks surged across the board.",
  "The company's new product launch broke pre-order records. Revenue guidance revised upward.",
  "A prominent hedge fund disclosed a large stake. Retail investors followed the signal."
];

export default function GamesScreen({ userTier, onGameEnd, onNavigate }) {
  const [activeGame, setActiveGame] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [money, setMoney] = useState(0);
  const [day, setDay] = useState(1);
  const [gameResult, setGameResult] = useState(null);
  const [tradeMessage, setTradeMessage] = useState(null);
  const [waitingNext, setWaitingNext] = useState(false);

  const moneyRef = useRef(0);

  const tierSettings = {
    elementary: {
      currencySymbol: "⭐",
      startingCash: 50,
      icon: "🦁",
      themeColor: "#f59e0b",
      gradient: "linear-gradient(135deg,#f59e0b,#f97316)",
      winMultiplier: 0.75,
      saveWinMultiplier: 1.2,
      marketWinMultiplier: 1.1,
      scenarios: [
        { q: "You found a cool toy for 5⭐! Buy it or keep your stars?", optA: ["Buy Toy", 5], optB: ["Save Stars", 0] },
        { q: "You're thirsty! Buy fancy juice for 4⭐ or drink water for free?", optA: ["Fancy Juice", 4], optB: ["Free Water", 0] },
        { q: "Pay 3⭐ for a rare sticker or keep your stars?", optA: ["Rare Sticker", 3], optB: ["Keep Stars", 0] },
        { q: "You earned 8⭐ helping clean up! Save it or spend on snacks (3⭐)?", optA: ["Spend on Snacks", 3], optB: ["Save All", 0] },
        { q: "Ice cream truck! Spend 5⭐ or skip it?", optA: ["Buy Ice Cream", 5], optB: ["Skip It", 0] },
        { q: "New card game for 8⭐. Buy it or pass?", optA: ["Buy Game", 8], optB: ["Pass", 0] },
        { q: "Friend's birthday gift — spend 4⭐ or make something free?", optA: ["Nice Gift", 4], optB: ["Homemade", 0] }
      ],
      marketScenarios: [
        { q: "Lemonade Stand: Spend 10⭐ on lemons. Risk it for profit!", optA: ["Invest", 10], optB: ["Skip", 0] },
        { q: "Cookie Sale: Spend 15⭐ to bake. Will it pay off?", optA: ["Bake Cookies", 15], optB: ["Skip", 0] },
        { q: "Snow cone stand: Risk 12⭐ or save?", optA: ["Set Up Stand", 12], optB: ["Save", 0] },
        { q: "Craft market: Spend 8⭐ on supplies. Will anyone buy?", optA: ["Try It", 8], optB: ["Skip", 0] },
        { q: "Tutoring: Invest 10⭐ in materials. Risky!", optA: ["Invest", 10], optB: ["Skip", 0] },
        { q: "Pool cleaning gig: Spend 8⭐ on tools.", optA: ["Invest", 8], optB: ["Skip", 0] },
        { q: "Final gamble: Use 12⭐ to start your biggest venture yet?", optA: ["Go Big", 12], optB: ["Play Safe", 0] }
      ],
      marketReasons: {
        success: ["Super sunny day! Everyone wanted a cold drink.", "Friends loved your treats and bought them all!", "Customers gave you extra tips!", "Your items sold out in minutes!"],
        failure: ["It rained and customers stayed home.", "The shop raised prices on your supplies.", "A neighbor opened a similar stand nearby.", "You dropped some supplies and had to buy more."]
      },
      savingScenarios: [
        { q: "You found 5⭐ under your pillow. Save it or spend?", optA: ["Spend it", 5], optB: ["Save it", 0] },
        { q: "Your piggy bank is full. Add 10⭐ or buy a small toy?", optA: ["Buy Toy", 10], optB: ["Add to Savings", 0] },
        { q: "A neighbor offers 5⭐ for chores. Keep or save?", optA: ["Keep it", 5], optB: ["Save it", 0] },
        { q: "Your allowance comes in. Spend it or save?", optA: ["Spend it", 8], optB: ["Save it", 0] }
      ]
    },
    adult: {
      currencySymbol: "$",
      startingCash: 1000,
      icon: "💼",
      themeColor: "#6366f1",
      gradient: "linear-gradient(135deg,#6366f1,#4f46e5)",
      // Budget win threshold: keep at least 60% of starting cash after smart choices
      winMultiplier: 0.6,
      saveWinMultiplier: 1.3,
      marketWinMultiplier: 1.15,
      scenarios: [
        // Each scenario: cheaper option saves money vs expensive option
        // Choosing the cheaper option each time lets you easily hit 60% threshold
        { q: "Rent: $400 studio apartment or $200 shared room?", optA: ["Studio – $400", 400], optB: ["Shared Room – $200", 200] },
        { q: "Transport: $80 monthly bus pass or $140 rideshare?", optA: ["Bus Pass – $80", 80], optB: ["Rideshares – $140", 140] },
        { q: "Groceries: $60 budget basics or $120 premium organic?", optA: ["Budget Basics – $60", 60], optB: ["Premium Organic – $120", 120] },
        { q: "Emergency: $50 tire patch or $180 new tire you don't need yet?", optA: ["Patch – $50", 50], optB: ["New Tire – $180", 180] },
        { q: "Entertainment: $15 streaming or $80 cable TV?", optA: ["Streaming – $15", 15], optB: ["Cable TV – $80", 80] },
        { q: "Health insurance: $60/month keeps you covered — skip or pay?", optA: ["Pay Insurance – $60", 60], optB: ["Skip It – $0", 0] },
        { q: "Internet: $35 basic plan or $90 gigabit overkill?", optA: ["Basic – $35", 35], optB: ["Gigabit – $90", 90] },
        { q: "Work lunch: $8 packed lunch or $25 restaurant every day?", optA: ["Pack Lunch – $8", 8], optB: ["Restaurant – $25", 25] },
        { q: "Side hustle: $40 in supplies could earn back double — invest?", optA: ["Invest – $40", 40], optB: ["Skip – $0", 0] },
        { q: "Annual dental checkup: $90 now or risk a $600 crown later?", optA: ["Checkup – $90", 90], optB: ["Skip – $0", 0] },
      ],
      marketScenarios: [
        { q: "Crypto: $200 in a volatile altcoin. 50% chance to triple or lose everything!", optA: ["Invest – $200", 200], optB: ["Skip", 0] },
        { q: "Options trading: $150 contract. Complex and high-risk!", optA: ["Trade – $150", 150], optB: ["Skip", 0] },
        { q: "Penny stocks: $300 in shares. Undervalued gem or scam?", optA: ["Buy In – $300", 300], optB: ["Skip", 0] },
        { q: "Real estate crowdfund: $400 minimum. 30% historical fail rate.", optA: ["Invest – $400", 400], optB: ["Skip", 0] },
        { q: "Startup equity: $250 in pre-seed round. Very risky!", optA: ["Invest – $250", 250], optB: ["Skip", 0] },
        { q: "Forex trading: $180 trade. Highly volatile currency pair.", optA: ["Trade – $180", 180], optB: ["Skip", 0] },
        { q: "MLM opportunity: $120 startup fee. Sketchy business model?", optA: ["Join – $120", 120], optB: ["Pass", 0] },
        { q: "Friend's business: $300 informal loan. May never return.", optA: ["Loan It – $300", 300], optB: ["Decline", 0] },
        { q: "Hot IPO: $350 allocation. All hype, no profits yet.", optA: ["Buy In – $350", 350], optB: ["Skip", 0] },
        { q: "Meme stock surge: $400 FOMO trade. Classic retail trap?", optA: ["Buy In – $400", 400], optB: ["Skip", 0] },
      ],
      savingScenarios: [
        { q: "You got a $120 tax refund. Save it or splurge?", optA: ["Splurge – $120", 120], optB: ["Save it", 0] },
        { q: "Pay raise came through. Lifestyle inflate or save more?", optA: ["Spend more – $110", 110], optB: ["Save more", 0] },
        { q: "Found $60 in an old coat. Treat yourself or add to savings?", optA: ["Treat yourself – $60", 60], optB: ["Save it", 0] },
        { q: "Set aside $100 for your future self. Do it?", optA: ["Spend it – $100", 100], optB: ["Save it", 0] }
      ]
    }
  };

  const config = tierSettings[userTier] || tierSettings.adult;

  const scenarios =
    activeGame === 'Market' ? config.marketScenarios
    : activeGame === 'Save'  ? config.savingScenarios
    : config.scenarios;

  const resetGame = (countAsPlayed = false) => {
    if (countAsPlayed && onGameEnd) onGameEnd('lost');
    setPlaying(false);
    setGameResult(null);
    setActiveGame(null);
    setMoney(0);
    moneyRef.current = 0;
    setDay(1);
    setTradeMessage(null);
    setWaitingNext(false);
  };

  const endGame = (finalMoney) => {
    const winThreshold =
      activeGame === 'Market' ? config.startingCash * config.marketWinMultiplier
      : activeGame === 'Save'  ? config.startingCash * config.saveWinMultiplier
      : config.startingCash * config.winMultiplier;

    const won = finalMoney >= winThreshold;
    setMoney(finalMoney);
    setGameResult(won ? 'won' : 'lost');
    if (onGameEnd) onGameEnd(won ? 'won' : 'lost');
  };

  // Budget/Save: optA is usually the expensive choice, optB is the smart/cheap choice
  const handleChoice = (cost) => {
    let updated = money;

    if (activeGame === 'Save') {
      // Choosing optB (cost=0) adds savings bonus; optA (cost>0) spends money
      updated = cost === 0
        ? money + Math.max(10, Math.round(config.startingCash * 0.05))
        : money - cost;
    } else if (activeGame === 'Budget') {
      // Straightforward: just subtract cost, no multiplier penalty
      updated = cost === 0
        ? money + Math.max(20, Math.round(config.startingCash * 0.02))
        : money - cost;
    } else {
      updated = cost === 0 ? money + 10 : money - cost;
    }

    if (updated <= 0) {
      setMoney(0);
      setGameResult('lost');
      if (onGameEnd) onGameEnd('lost');
      return;
    }

    if (day >= scenarios.length) {
      endGame(updated);
      return;
    }

    setMoney(updated);
    setDay(d => d + 1);
  };

  const handleMarketChoice = (opt) => {
    if (waitingNext) return;
    const amount = opt[1];

    if (amount === 0) {
      const newMoney = moneyRef.current;
      if (day >= scenarios.length) { endGame(newMoney); return; }
      setDay(newMoney => newMoney + 1);
      setDay(d => d + 1);
      setTradeMessage(`⏭ Skipped trade. Balance: ${config.currencySymbol}${moneyRef.current}`);
      return;
    }

    const success = Math.random() < 0.5;
    const currentMoney = moneyRef.current;
    let newMoney, msg;

    if (success) {
      const profit = Math.max(10, Math.round(amount * (0.8 + Math.random() * 0.8)));
      newMoney = currentMoney + profit;
      const reason = STOCK_WIN_REASONS[Math.floor(Math.random() * STOCK_WIN_REASONS.length)];
      msg = `✅ +${config.currencySymbol}${profit} profit! ${reason}`;
    } else {
      const loss = Math.round(amount * (0.6 + Math.random() * 0.6));
      newMoney = Math.max(0, currentMoney - loss);
      const reason = STOCK_FAIL_REASONS[Math.floor(Math.random() * STOCK_FAIL_REASONS.length)];
      msg = `❌ -${config.currencySymbol}${loss} lost. ${reason}`;
    }

    moneyRef.current = newMoney;
    setMoney(newMoney);
    setTradeMessage(msg);
    setWaitingNext(true);

    if (newMoney <= 0) {
      setTimeout(() => { setGameResult('lost'); if (onGameEnd) onGameEnd('lost'); setWaitingNext(false); }, 1800);
      return;
    }
    if (day >= scenarios.length) {
      setTimeout(() => { endGame(newMoney); setWaitingNext(false); }, 1800);
      return;
    }
    setTimeout(() => { setDay(d => d + 1); setTradeMessage(null); setWaitingNext(false); }, 1800);
  };

  if (gameResult) {
    const isWin = gameResult === 'won';
    const winThreshold =
      activeGame === 'Market' ? config.startingCash * config.marketWinMultiplier
      : activeGame === 'Save'  ? config.startingCash * config.saveWinMultiplier
      : config.startingCash * config.winMultiplier;
    const gameLabel = activeGame === 'Market' ? 'Investing' : activeGame === 'Save' ? 'Savings' : 'Budgeting';

    return (
      <div style={gS.resultContainer}>
        <div style={{ ...gS.resultCard, background: isWin ? 'linear-gradient(135deg,#064e3b,#059669)' : 'linear-gradient(135deg,#4c0519,#be123c)' }}>
          <div style={gS.resultEmoji}>{isWin ? '🏆🎉' : '💔😤'}</div>
          <h1 style={gS.resultTitle}>{isWin ? 'YOU WON!' : 'GAME OVER'}</h1>
          <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'16px', margin:'0 0 24px' }}>{gameLabel} Adventure</p>
          <div style={gS.resultDetails}>
            <div style={gS.statRow}><span>Started with</span><strong>{config.currencySymbol}{config.startingCash}</strong></div>
            <div style={gS.statRow}><span>Ended with</span><strong style={{ fontSize:'22px' }}>{config.currencySymbol}{money}</strong></div>
            <div style={gS.statRow}><span>Win goal</span><strong>{config.currencySymbol}{Math.round(winThreshold)}</strong></div>
          </div>
          <div style={gS.resultMessage}>
            {isWin
              ? <p>🎯 You hit the {gameLabel} goal! Great decision-making under pressure.</p>
              : <p>💸 You didn't quite hit the goal. Every attempt teaches you something — try again!</p>
            }
          </div>
          <div style={gS.resultActions}>
            <button
              style={{ ...gS.actionBtn, background:'#fff', color: isWin ? '#059669' : '#be123c' }}
              onClick={() => {
                setGameResult(null); setDay(1);
                setMoney(config.startingCash); moneyRef.current = config.startingCash;
                setTradeMessage(null); setWaitingNext(false); setPlaying(true);
              }}
            >🔄 Play Again</button>
            <button style={{ ...gS.actionBtn, background:'rgba(255,255,255,0.15)', color:'#fff' }} onClick={resetGame}>← Back to Games</button>
          </div>
        </div>
      </div>
    );
  }

  if (playing) {
    const currentScenario = scenarios[Math.min(day - 1, scenarios.length - 1)];
    const dayLabel = activeGame === 'Market' ? 'Trade' : 'Day';
    const progressPct = ((day - 1) / scenarios.length) * 100;
    const themeGradient = activeGame === 'Market' ? 'linear-gradient(135deg,#7c3aed,#6366f1)' : activeGame === 'Save' ? 'linear-gradient(135deg,#059669,#10b981)' : config.gradient;

    return (
      <div style={gS.gameContainer}>
        <div style={{ ...gS.gameHeader, borderTop: `5px solid ${config.themeColor}` }}>
          <div>
            <div style={{ fontSize:'11px', fontWeight:'800', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'1px' }}>
              {activeGame === 'Market' ? '📈 Investing Adventure' : activeGame === 'Save' ? '💰 Savings Sprint' : '📊 Budgeting Basics'}
            </div>
            <div style={{ fontWeight:'900', fontSize:'17px', color:'#1e293b', marginTop:'2px' }}>
              {dayLabel} {day} / {scenarios.length}
            </div>
          </div>
          <div style={{
            ...gS.balanceChip,
            background: money < config.startingCash * 0.3 ? '#fee2e2' : money < config.startingCash * 0.6 ? '#fef3c7' : '#d1fae5',
            color: money < config.startingCash * 0.3 ? '#991b1b' : money < config.startingCash * 0.6 ? '#92400e' : '#065f46'
          }}>
            <span style={{ fontSize:'11px', fontWeight:'600', display:'block', opacity:0.7 }}>Balance</span>
            <span style={{ fontWeight:'900', fontSize:'18px' }}>{config.currencySymbol}{money}</span>
          </div>
        </div>

        <div style={{ height:'6px', background:'#e2e8f0', borderRadius:'999px', marginBottom:'16px', overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${progressPct}%`, background: themeGradient, borderRadius:'999px', transition:'width 0.3s' }} />
        </div>

        <div style={gS.scenarioCard}>
          <p style={gS.scenarioText}>{currentScenario.q}</p>

          {tradeMessage && (
            <div style={{
              ...gS.tradeMsg,
              background: tradeMessage.startsWith('✅') ? '#d1fae5' : tradeMessage.startsWith('⏭') ? '#f1f5f9' : '#fee2e2',
              borderColor: tradeMessage.startsWith('✅') ? '#6ee7b7' : tradeMessage.startsWith('⏭') ? '#e2e8f0' : '#fca5a5'
            }}>{tradeMessage}</div>
          )}

          {!waitingNext && (
            <div style={gS.choiceRow}>
              <button
                style={{ ...gS.choiceBtn, background: themeGradient }}
                onClick={() => activeGame === 'Market' ? handleMarketChoice(currentScenario.optA) : handleChoice(currentScenario.optA[1])}
              >
                <span style={gS.choiceBtnLabel}>{currentScenario.optA[0]}</span>
                <span style={gS.choiceBtnCost}>{currentScenario.optA[1] > 0 ? `${config.currencySymbol}${currentScenario.optA[1]}` : 'Free'}</span>
              </button>
              <button
                style={gS.choiceBtnSecondary}
                onClick={() => activeGame === 'Market' ? handleMarketChoice(currentScenario.optB) : handleChoice(currentScenario.optB[1])}
              >
                <span style={gS.choiceBtnLabel}>{currentScenario.optB[0]}</span>
                <span style={{ ...gS.choiceBtnCost, color:'#64748b' }}>{currentScenario.optB[1] > 0 ? `${config.currencySymbol}${currentScenario.optB[1]}` : 'Free'}</span>
              </button>
            </div>
          )}

          {waitingNext && <div style={{ textAlign:'center', color:'#94a3b8', marginTop:'16px', fontSize:'13px' }}>Next trade loading…</div>}
        </div>

        <button onClick={() => resetGame(true)} style={gS.quitBtn}>Quit game</button>
      </div>
    );
  }

  // Game menu
  const games = [
    { id:'Budget', icon:'📊', title:'Budgeting Basics', desc:'Make smart spending choices across 10 real-life scenarios. Keep 60% of your cash to win.', gradient:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'#6366f1' },
    { id:'Market', icon:'📈', title:'Investing Adventure', desc:'Trade stocks, manage risk vs reward, and try to grow your portfolio.', gradient:'linear-gradient(135deg,#7c3aed,#6366f1)', color:'#7c3aed' },
    { id:'Save',   icon:'💰', title:'Savings Sprint', desc:'Build your savings balance by consistently making the smart choice.', gradient:'linear-gradient(135deg,#10b981,#059669)', color:'#10b981' },
  ];

  return (
    <div style={gS.menuContainer}>
      <div style={gS.menuHeader}>
        <h2 style={gS.menuTitle}>🎮 Financial Games</h2>
        <p style={gS.menuSub}>Pick a game and put your money knowledge to the test.</p>
      </div>

      <div style={gS.gamesGrid}>
        {games.map((g) => (
          <div key={g.id} style={gS.gameCard}>
            <div style={{ ...gS.gameCardTop, background: g.gradient }}>
              <div style={{ fontSize:'48px', marginBottom:'10px' }}>{g.icon}</div>
              <h3 style={{ margin:0, color:'#fff', fontSize:'20px', fontWeight:'800' }}>{g.title}</h3>
            </div>
            <div style={gS.gameCardBottom}>
              <p style={gS.gameCardDesc}>{g.desc}</p>
              <button
                style={{ ...gS.playBtn, background: g.gradient }}
                onClick={() => {
                  setMoney(config.startingCash); moneyRef.current = config.startingCash;
                  setDay(1); setActiveGame(g.id);
                  setGameResult(null); setTradeMessage(null); setWaitingNext(false);
                  setPlaying(true);
                }}
              >▶ Play {g.title}</button>
            </div>
          </div>
        ))}
      </div>

      <div style={gS.extraRow}>
        <div style={gS.cardPromo}>
          <div style={gS.promoTitle}>💼 Salary Simulator</div>
          <p style={gS.promoText}>Input a salary and view taxes, take-home pay, and savings ideas.</p>
          <button style={gS.promoBtn} onClick={() => onNavigate?.('Salary')}>Open Salary Planner</button>
        </div>
        <div style={gS.cardPromo}>
          <div style={gS.promoTitle}>🏆 Classroom Leagues</div>
          <p style={gS.promoText}>Join leagues, answer challenges, and compete in friendly finance matches.</p>
          <button style={{ ...gS.promoBtn, background:'linear-gradient(135deg,#7c3aed,#6366f1)' }} onClick={() => onNavigate?.('Leagues')}>Open Leagues</button>
        </div>
      </div>
    </div>
  );
}

const gS = {
  menuContainer: { maxWidth:'900px', margin:'0 auto', padding:'24px 16px', fontFamily:"'Inter', system-ui, sans-serif" },
  menuHeader: { marginBottom:'24px' },
  menuTitle: { margin:'0 0 6px', fontSize:'30px', fontWeight:'900', color:'#111827' },
  menuSub: { margin:0, color:'#64748b', fontSize:'15px' },
  gamesGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:'20px' },
  gameCard: { borderRadius:'22px', overflow:'hidden', boxShadow:'0 12px 36px rgba(0,0,0,0.1)', border:'1px solid rgba(0,0,0,0.06)' },
  gameCardTop: { padding:'32px 24px', textAlign:'center' },
  gameCardBottom: { background:'#fff', padding:'20px' },
  gameCardDesc: { color:'#64748b', fontSize:'14px', lineHeight:'1.6', margin:'0 0 16px' },
  playBtn: { width:'100%', padding:'13px', color:'#fff', border:'none', borderRadius:'12px', fontWeight:'800', cursor:'pointer', fontSize:'15px', fontFamily:'inherit' },
  gameContainer: { maxWidth:'560px', margin:'0 auto', padding:'0 16px 40px', fontFamily:"'Inter', system-ui, sans-serif" },
  gameHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px', background:'#fff', borderRadius:'16px', marginBottom:'12px', boxShadow:'0 4px 12px rgba(0,0,0,0.06)' },
  balanceChip: { borderRadius:'12px', padding:'8px 16px', textAlign:'right' },
  scenarioCard: { background:'#fff', padding:'28px', borderRadius:'20px', boxShadow:'0 8px 24px rgba(0,0,0,0.08)' },
  scenarioText: { color:'#1e293b', fontSize:'18px', fontWeight:'700', lineHeight:'1.5', marginBottom:'20px' },
  tradeMsg: { padding:'12px 16px', borderRadius:'12px', border:'2px solid', marginBottom:'16px', fontSize:'14px', fontWeight:'600', lineHeight:'1.5' },
  choiceRow: { display:'flex', flexDirection:'column', gap:'10px' },
  choiceBtn: { padding:'15px 18px', color:'#fff', border:'none', borderRadius:'14px', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', fontFamily:'inherit' },
  choiceBtnSecondary: { padding:'15px 18px', background:'#f8fafc', border:'2px solid #e2e8f0', borderRadius:'14px', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', fontFamily:'inherit' },
  choiceBtnLabel: { fontWeight:'700', fontSize:'15px' },
  choiceBtnCost: { fontSize:'13px', fontWeight:'600', color:'rgba(255,255,255,0.85)' },
  quitBtn: { display:'block', margin:'20px auto 0', background:'none', border:'none', color:'#94a3b8', cursor:'pointer', fontSize:'13px', fontFamily:'inherit' },
  resultContainer: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'80vh', padding:'20px', fontFamily:"'Inter', system-ui, sans-serif" },
  resultCard: { padding:'48px 36px', borderRadius:'32px', textAlign:'center', maxWidth:'520px', width:'100%', boxShadow:'0 32px 80px rgba(0,0,0,0.2)', color:'#fff' },
  resultEmoji: { fontSize:'72px', marginBottom:'16px' },
  resultTitle: { fontSize:'44px', fontWeight:'900', margin:'0 0 8px' },
  resultDetails: { background:'rgba(255,255,255,0.15)', padding:'20px 24px', borderRadius:'18px', marginBottom:'20px', textAlign:'left' },
  statRow: { display:'flex', justifyContent:'space-between', fontSize:'16px', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.2)' },
  resultMessage: { fontSize:'15px', lineHeight:'1.6', marginBottom:'24px', opacity:0.9 },
  resultActions: { display:'flex', flexDirection:'column', gap:'12px' },
  actionBtn: { padding:'14px', border:'none', borderRadius:'14px', fontWeight:'800', cursor:'pointer', fontSize:'15px', fontFamily:'inherit' },
  extraRow: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'18px', marginTop:'24px' },
  cardPromo: { background:'#fff', borderRadius:'20px', padding:'22px', boxShadow:'0 12px 28px rgba(15,23,42,0.08)', border:'1px solid #e2e8f0' },
  promoTitle: { fontSize:'18px', fontWeight:'800', marginBottom:'10px' },
  promoText: { color:'#475569', fontSize:'14px', lineHeight:'1.65', marginBottom:'18px' },
  promoBtn: { width:'100%', padding:'12px 16px', borderRadius:'14px', border:'none', background:'linear-gradient(135deg,#2563eb,#6366f1)', color:'#fff', cursor:'pointer', fontWeight:'700', fontSize:'14px' },
};
