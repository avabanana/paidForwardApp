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
  "The lead product failed Phase 3 clinical trials. Biotech investors fled immediately.",
  "Rising inflation crushed consumer spending data, dragging the whole retail sector down.",
  "A geopolitical conflict disrupted commodity prices the company depended on.",
  "The startup burned through cash faster than projected and announced an emergency dilutive offering.",
  "Insider selling by executives spooked retail investors into a mass exit."
];

const STOCK_WIN_REASONS = [
  "Strong earnings beat expectations by 25%. Institutional buyers piled in.",
  "The company announced a surprise share buyback program. Stock jumped 18%.",
  "A partnership with a major tech giant was announced. Momentum traders flooded in.",
  "Inflation data came in lower than expected — growth stocks surged across the board.",
  "The company's new product launch broke pre-order records. Revenue guidance revised upward.",
  "A prominent hedge fund disclosed a large stake. Retail investors followed the signal."
];

export default function GamesScreen({ userTier, onGameEnd }) {
  const [activeGame, setActiveGame] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [money, setMoney] = useState(0);
  const [day, setDay] = useState(1);
  const [gameResult, setGameResult] = useState(null);
  const [tradeMessage, setTradeMessage] = useState(null);
  const [waitingNext, setWaitingNext] = useState(false); // for Market: show trade result before advancing

  const moneyRef = useRef(0); // track money synchronously in Market game

  const tierSettings = {
    elementary: {
      currencySymbol: "⭐",
      startingCash: 50,
      icon: "🦁",
      themeColor: "#fbbf24",
      winMultiplier: 0.8,   // need 80% of start to win budget
      saveWinMultiplier: 1.2,
      marketWinMultiplier: 1.1,
      scenarios: [
        { q: "You found a cool toy for 20⭐! Do you buy it or keep your stars?", optA: ["Buy Toy", 20], optB: ["Save Stars", 0] },
        { q: "You're thirsty! Buy a fancy juice for 10⭐ or drink water for free?", optA: ["Fancy Juice", 10], optB: ["Free Water", 0] },
        { q: "A friend wants to trade stickers. Pay 5⭐ for a rare one or keep your stars?", optA: ["Rare Sticker", 5], optB: ["Keep Stars", 0] },
        { q: "You lost a library book. Pay 15⭐ to replace it or use your coupon?", optA: ["Pay Stars", 15], optB: ["Use Coupon", 0] },
        { q: "Ice cream truck outside! Spend 12⭐ or skip it?", optA: ["Buy Ice Cream", 12], optB: ["Skip It", 0] },
        { q: "New video game for 35⭐ - tempting! Budget it or pass?", optA: ["Buy Game", 35], optB: ["Pass", 0] },
        { q: "Friend's birthday gift - 8⭐ or make something?", optA: ["Nice Gift", 8], optB: ["Homemade", 0] }
      ],
      marketScenarios: [
        { q: "Lemonade Stand: Spend 10⭐ on lemons. Risk it for profit!", optA: ["Invest", 10], optB: ["Skip", 0] },
        { q: "Cookie Sale: Spend 15⭐ to bake. Will it pay off?", optA: ["Bake Cookies", 15], optB: ["Skip", 0] },
        { q: "Snow cone stand: Risk 20⭐ or save?", optA: ["Set Up Stand", 20], optB: ["Save", 0] },
        { q: "Craft market: Spend 18⭐ on supplies. Will anyone buy?", optA: ["Try It", 18], optB: ["Skip", 0] },
        { q: "Tutoring: Invest 12⭐ in materials. Risky!", optA: ["Invest", 12], optB: ["Skip", 0] },
        { q: "Pool cleaning gig: Spend 8⭐ on tools.", optA: ["Invest", 8], optB: ["Skip", 0] },
        { q: "Final gamble: Use 25⭐ to start your biggest venture yet?", optA: ["Go Big", 25], optB: ["Play Safe", 0] }
      ],
      savingScenarios: [
        { q: "You found 5⭐ under your pillow. Add to savings or spend it?", optA: ["Spend it", 5], optB: ["Save it", 0] },
        { q: "Your piggy bank is full. Add another 10⭐ or buy a small toy?", optA: ["Buy Toy", 10], optB: ["Add to Savings", 0] },
        { q: "A neighbor offers 5⭐ for chores. Keep or save?", optA: ["Keep it", 5], optB: ["Save it", 0] },
        { q: "Your allowance comes in. Spend it or move to savings?", optA: ["Spend it", 15], optB: ["Save it", 0] }
      ]
    },
    adult: {
      currencySymbol: "$",
      startingCash: 500,
      icon: "💼",
      themeColor: "#2563eb",
      winMultiplier: 0.9,
      saveWinMultiplier: 1.2,
      marketWinMultiplier: 1.1,
      scenarios: [
        { q: "Rent: $300 studio or $150 shared apartment?", optA: ["Studio", 300], optB: ["Shared", 150] },
        { q: "Transport: $80 monthly pass or $120 pay-per-ride?", optA: ["Monthly Pass", 80], optB: ["Pay-Per-Ride", 120] },
        { q: "Groceries: $90 organic or $40 basics?", optA: ["Organic", 90], optB: ["Basics", 40] },
        { q: "Car tire emergency: $120 new tire or $50 patch?", optA: ["New Tire", 120], optB: ["Patch", 50] },
        { q: "Side hustle: $40 in supplies or skip?", optA: ["Invest", 40], optB: ["Skip", 0] },
        { q: "Health insurance: $60/month or risk a fine?", optA: ["Pay Insurance", 60], optB: ["Risk It", 0] },
        { q: "Internet: $70 fast plan or $35 slow plan?", optA: ["Fast", 70], optB: ["Slow", 35] },
        { q: "Friend's wedding: $100 gift or $20 card?", optA: ["Nice Gift", 100], optB: ["Card", 20] },
        { q: "Retirement fund: Lock away $100 now?", optA: ["Invest", 100], optB: ["Skip", 0] },
        { q: "Accountant: $50 pro or DIY taxes for free?", optA: ["Hire Pro", 50], optB: ["DIY", 0] },
        { q: "Professional development: $75 online course?", optA: ["Enroll", 75], optB: ["Skip", 0] },
        { q: "Home repair: $200 plumber or risky DIY?", optA: ["Plumber", 200], optB: ["DIY", 0] },
        { q: "Dental checkup: $150 now or skip?", optA: ["Checkup", 150], optB: ["Skip", 0] },
        { q: "Car maintenance: $180 service or ignore warning light?", optA: ["Service", 180], optB: ["Ignore", 0] },
        { q: "Final test: $250 investment opportunity — real or scam?", optA: ["Invest", 250], optB: ["Pass", 0] }
      ],
      marketScenarios: [
        { q: "Crypto: $200 in a volatile altcoin. 50% chance to triple or lose everything!", optA: ["Invest", 200], optB: ["Skip", 0] },
        { q: "Options trading: $150 contract. Complex and high-risk!", optA: ["Trade", 150], optB: ["Skip", 0] },
        { q: "Penny stocks: $300 in shares. Undervalued gem or scam?", optA: ["Buy In", 300], optB: ["Skip", 0] },
        { q: "Real estate crowdfund: $400 minimum. 30% historical fail rate.", optA: ["Invest", 400], optB: ["Skip", 0] },
        { q: "Startup equity: $250 in pre-seed round. Very risky!", optA: ["Invest", 250], optB: ["Skip", 0] },
        { q: "Forex trading: $180 trade. Highly volatile currency pair.", optA: ["Trade", 180], optB: ["Skip", 0] },
        { q: "MLM opportunity: $120 startup fee. Sketchy business model?", optA: ["Join", 120], optB: ["Pass", 0] },
        { q: "Business loan: Borrow $500 at high interest to invest?", optA: ["Borrow", 500], optB: ["Skip", 0] },
        { q: "Friend's business: $300 informal loan. May never return.", optA: ["Loan It", 300], optB: ["Decline", 0] },
        { q: "Hot IPO: $350 allocation. All hype, no profits yet.", optA: ["Buy In", 350], optB: ["Skip", 0] },
        { q: "Emerging market fund: $280 bet on high-growth economies.", optA: ["Invest", 280], optB: ["Skip", 0] },
        { q: "Meme stock surge: $400 FOMO trade. Classic retail trap?", optA: ["Buy In", 400], optB: ["Skip", 0] },
        { q: "Crypto NFT: $200 digital collectible. Bubble territory?", optA: ["Buy NFT", 200], optB: ["Skip", 0] },
        { q: "Private equity deal: $450 minimum. Very illiquid investment.", optA: ["Invest", 450], optB: ["Pass", 0] },
        { q: "FINAL GAMBLE: All-in on one last risky position or lock in your gains?", optA: ["All In", 350], optB: ["Stay Safe", 0] }
      ],
      savingScenarios: [
        { q: "You got a $120 tax refund. Save it or splurge?", optA: ["Splurge", 120], optB: ["Save it", 0] },
        { q: "Your pay raise came through. Lifestyle inflate or save more?", optA: ["Spend more", 110], optB: ["Save more", 0] },
        { q: "Found $60 in an old coat. Treat yourself or add to savings?", optA: ["Treat yourself", 60], optB: ["Save it", 0] },
        { q: "You could set aside $100 for your future self. Do it?", optA: ["Spend it", 100], optB: ["Save it", 0] }
      ]
    }
  };

  // Map tier to config (middle school uses adult settings)
  const config = tierSettings[userTier] || tierSettings.adult;

  const scenarios =
    activeGame === 'Market' ? config.marketScenarios
    : activeGame === 'Save' ? config.savingScenarios
    : config.scenarios;

  // ─── RESET ────────────────────────────────────────────────────────────────
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

  // ─── END GAME ─────────────────────────────────────────────────────────────
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

  // ─── BUDGET / SAVE CHOICE ─────────────────────────────────────────────────
  const handleChoice = (cost) => {
    let updated = money;

    if (activeGame === 'Save') {
      updated = cost === 0
        ? money + Math.max(10, Math.round(config.startingCash * 0.05))
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

  // ─── MARKET TRADE CHOICE ─────────────────────────────────────────────────
  const handleMarketChoice = (opt) => {
    if (waitingNext) return;
    const amount = opt[1];

    if (amount === 0) {
      // Skipped — no trade, advance day
      const newMoney = moneyRef.current;
      const newDay = day + 1;

      if (day >= scenarios.length) {
        endGame(newMoney);
        return;
      }
      setDay(newDay);
      setTradeMessage(`⏭ Skipped trade. Balance unchanged: ${config.currencySymbol}${newMoney}`);
      return;
    }

    const success = Math.random() < 0.5; // 50/50
    const currentMoney = moneyRef.current;
    let newMoney;
    let msg;

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
      setTimeout(() => {
        setGameResult('lost');
        if (onGameEnd) onGameEnd('lost');
        setWaitingNext(false);
      }, 1800);
      return;
    }

    // If this was the last trade, end the game after showing result
    if (day >= scenarios.length) {
      setTimeout(() => {
        endGame(newMoney);
        setWaitingNext(false);
      }, 1800);
      return;
    }

    // Advance to next trade after showing result
    setTimeout(() => {
      setDay(d => d + 1);
      setTradeMessage(null);
      setWaitingNext(false);
    }, 1800);
  };

  // ─── WIN / LOSE SCREEN ───────────────────────────────────────────────────
  if (gameResult) {
    const isWin = gameResult === 'won';
    const winThreshold =
      activeGame === 'Market' ? config.startingCash * config.marketWinMultiplier
      : activeGame === 'Save'  ? config.startingCash * config.saveWinMultiplier
      : config.startingCash * config.winMultiplier;
    const gameLabel = activeGame === 'Market' ? 'Investing' : activeGame === 'Save' ? 'Savings' : 'Budgeting';

    return (
      <div style={gStyles.resultContainer}>
        <div style={{
          ...gStyles.resultCard,
          background: isWin
            ? 'linear-gradient(135deg,#065f46,#059669)'
            : 'linear-gradient(135deg,#7f1d1d,#dc2626)'
        }}>
          <div style={gStyles.resultEmoji}>{isWin ? '🏆🎉' : '💔😤'}</div>
          <h1 style={gStyles.resultTitle}>{isWin ? 'YOU WON!' : 'GAME OVER'}</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', margin: '0 0 24px' }}>
            {gameLabel} Adventure
          </p>

          <div style={gStyles.resultDetails}>
            <div style={gStyles.statRow}>
              <span>Started with</span>
              <strong>{config.currencySymbol}{config.startingCash}</strong>
            </div>
            <div style={gStyles.statRow}>
              <span>Ended with</span>
              <strong style={{ fontSize: '22px' }}>{config.currencySymbol}{money}</strong>
            </div>
            <div style={gStyles.statRow}>
              <span>Win goal</span>
              <strong>{config.currencySymbol}{Math.round(winThreshold)}</strong>
            </div>
          </div>

          <div style={gStyles.resultMessage}>
            {isWin ? (
              <p>🎯 You hit the {gameLabel} goal! Great decision-making under pressure.</p>
            ) : (
              <p>💸 You didn't quite hit the goal. Every attempt teaches you something new — try again!</p>
            )}
          </div>

          <div style={gStyles.resultActions}>
            <button
              style={{ ...gStyles.actionBtn, background: '#fff', color: isWin ? '#059669' : '#dc2626' }}
              onClick={() => {
                setGameResult(null);
                setDay(1);
                setMoney(config.startingCash);
                moneyRef.current = config.startingCash;
                setTradeMessage(null);
                setWaitingNext(false);
                setPlaying(true);
              }}
            >
              🔄 Play Again
            </button>
            <button
              style={{ ...gStyles.actionBtn, background: 'rgba(255,255,255,0.15)', color: '#fff' }}
              onClick={resetGame}
            >
              ← Back to Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── ACTIVE GAME ─────────────────────────────────────────────────────────
  if (playing) {
    const currentScenario = scenarios[Math.min(day - 1, scenarios.length - 1)];
    const dayLabel = activeGame === 'Market' ? 'Trade' : 'Day';
    const progressPct = ((day - 1) / scenarios.length) * 100;

    return (
      <div style={gStyles.gameContainer}>
        {/* Header */}
        <div style={{ ...gStyles.gameHeader, borderTop: `5px solid ${config.themeColor}` }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {activeGame === 'Market' ? '📈 Investing Adventure' : activeGame === 'Save' ? '💰 Savings Sprint' : '📊 Budgeting Basics'}
            </div>
            <div style={{ fontWeight: '900', fontSize: '17px', color: '#1e293b', marginTop: '2px' }}>
              {dayLabel} {day} / {scenarios.length}
            </div>
          </div>
          <div style={{
            ...gStyles.balanceChip,
            background: money < config.startingCash * 0.3
              ? '#fee2e2' : money < config.startingCash * 0.6
              ? '#fef3c7' : '#d1fae5',
            color: money < config.startingCash * 0.3
              ? '#991b1b' : money < config.startingCash * 0.6
              ? '#92400e' : '#065f46'
          }}>
            <span style={{ fontSize: '11px', fontWeight: '600', display: 'block', opacity: 0.7 }}>Balance</span>
            <span style={{ fontWeight: '900', fontSize: '18px' }}>{config.currencySymbol}{money}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '999px', marginBottom: '16px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progressPct}%`, background: config.themeColor, borderRadius: '999px', transition: 'width 0.3s' }} />
        </div>

        {/* Scenario card */}
        <div style={gStyles.scenarioCard}>
          <p style={gStyles.scenarioText}>{currentScenario.q}</p>

          {tradeMessage && (
            <div style={{
              ...gStyles.tradeMsg,
              background: tradeMessage.startsWith('✅') ? '#d1fae5' : tradeMessage.startsWith('⏭') ? '#f1f5f9' : '#fee2e2',
              borderColor: tradeMessage.startsWith('✅') ? '#6ee7b7' : tradeMessage.startsWith('⏭') ? '#e2e8f0' : '#fca5a5'
            }}>
              {tradeMessage}
            </div>
          )}

          {!waitingNext && (
            <div style={gStyles.choiceRow}>
              <button
                style={{ ...gStyles.choiceBtn, background: config.themeColor }}
                onClick={() => activeGame === 'Market'
                  ? handleMarketChoice(currentScenario.optA)
                  : handleChoice(currentScenario.optA[1])
                }
              >
                <span style={gStyles.choiceBtnLabel}>{currentScenario.optA[0]}</span>
                <span style={gStyles.choiceBtnCost}>
                  {currentScenario.optA[1] > 0 ? `${config.currencySymbol}${currentScenario.optA[1]}` : 'Free'}
                </span>
              </button>
              <button
                style={gStyles.choiceBtnSecondary}
                onClick={() => activeGame === 'Market'
                  ? handleMarketChoice(currentScenario.optB)
                  : handleChoice(currentScenario.optB[1])
                }
              >
                <span style={gStyles.choiceBtnLabel}>{currentScenario.optB[0]}</span>
                <span style={{ ...gStyles.choiceBtnCost, color: '#64748b' }}>
                  {currentScenario.optB[1] > 0 ? `${config.currencySymbol}${currentScenario.optB[1]}` : 'Free'}
                </span>
              </button>
            </div>
          )}

          {waitingNext && (
            <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '16px', fontSize: '13px' }}>
              Next trade loading...
            </div>
          )}
        </div>

        <button onClick={() => resetGame(true)} style={gStyles.quitBtn}>Quit game</button>
      </div>
    );
  }

  // ─── GAME MENU ────────────────────────────────────────────────────────────
  const games = [
    {
      id: 'Budget',
      icon: config.icon,
      title: 'Budgeting Basics',
      desc: 'Make smart day-to-day spending choices and finish with money in your pocket.',
      color: config.themeColor,
      gradient: `linear-gradient(135deg,${config.themeColor},${config.themeColor}bb)`
    },
    {
      id: 'Market',
      icon: '📈',
      title: 'Investing Adventure',
      desc: 'Trade stocks, manage risk vs reward, and try to grow your portfolio.',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg,#8b5cf6,#6366f1)'
    },
    {
      id: 'Save',
      icon: '💰',
      title: 'Savings Sprint',
      desc: 'Build your savings balance by consistently making the smart choice.',
      color: '#10b981',
      gradient: 'linear-gradient(135deg,#10b981,#059669)'
    }
  ];

  return (
    <div style={gStyles.menuContainer}>
      <div style={gStyles.menuHeader}>
        <h2 style={gStyles.menuTitle}>🎮 Financial Games</h2>
        <p style={gStyles.menuSub}>Pick a game and put your money knowledge to the test.</p>
      </div>

      <div style={gStyles.gamesGrid}>
        {games.map((g) => (
          <div key={g.id} style={gStyles.gameCard}>
            <div style={{ ...gStyles.gameCardTop, background: g.gradient }}>
              <div style={{ fontSize: '44px', marginBottom: '10px' }}>{g.icon}</div>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '20px', fontWeight: '800' }}>{g.title}</h3>
            </div>
            <div style={gStyles.gameCardBottom}>
              <p style={gStyles.gameCardDesc}>{g.desc}</p>
              <button
                style={{ ...gStyles.playBtn, background: g.gradient }}
                onClick={() => {
                  setMoney(config.startingCash);
                  moneyRef.current = config.startingCash;
                  setDay(1);
                  setActiveGame(g.id);
                  setGameResult(null);
                  setTradeMessage(null);
                  setWaitingNext(false);
                  setPlaying(true);
                }}
              >
                ▶ Play {g.title}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const gStyles = {
  menuContainer: {
    maxWidth: '900px', margin: '0 auto',
    padding: '24px 16px', fontFamily: "'Inter', system-ui, sans-serif"
  },
  menuHeader: { marginBottom: '24px' },
  menuTitle: { margin: '0 0 6px', fontSize: '30px', fontWeight: '900', color: '#111827' },
  menuSub: { margin: 0, color: '#64748b', fontSize: '15px' },
  gamesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '20px'
  },
  gameCard: {
    borderRadius: '20px', overflow: 'hidden',
    boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
    border: '1px solid rgba(0,0,0,0.06)'
  },
  gameCardTop: { padding: '28px 24px', textAlign: 'center' },
  gameCardBottom: { background: '#fff', padding: '20px' },
  gameCardDesc: { color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px' },
  playBtn: {
    width: '100%', padding: '13px',
    color: '#fff', border: 'none', borderRadius: '12px',
    fontWeight: '800', cursor: 'pointer', fontSize: '15px',
    fontFamily: 'inherit'
  },
  gameContainer: {
    maxWidth: '560px', margin: '0 auto',
    padding: '0 16px 40px',
    fontFamily: "'Inter', system-ui, sans-serif"
  },
  gameHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 20px', background: '#fff', borderRadius: '16px',
    marginBottom: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
  },
  balanceChip: {
    borderRadius: '12px', padding: '8px 16px', textAlign: 'right'
  },
  scenarioCard: {
    background: '#fff', padding: '28px',
    borderRadius: '20px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
  },
  scenarioText: {
    color: '#1e293b', fontSize: '18px',
    fontWeight: '700', lineHeight: '1.5',
    marginBottom: '20px'
  },
  tradeMsg: {
    padding: '12px 16px', borderRadius: '12px',
    border: '2px solid', marginBottom: '16px',
    fontSize: '14px', fontWeight: '600', lineHeight: '1.5'
  },
  choiceRow: { display: 'flex', flexDirection: 'column', gap: '10px' },
  choiceBtn: {
    padding: '15px 18px', color: '#fff', border: 'none',
    borderRadius: '14px', cursor: 'pointer',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    fontFamily: 'inherit'
  },
  choiceBtnSecondary: {
    padding: '15px 18px', background: '#f1f5f9',
    border: '2px solid #e2e8f0', borderRadius: '14px',
    cursor: 'pointer', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center',
    fontFamily: 'inherit'
  },
  choiceBtnLabel: { fontWeight: '700', fontSize: '15px' },
  choiceBtnCost: { fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.8)' },
  quitBtn: {
    display: 'block', margin: '20px auto 0',
    background: 'none', border: 'none',
    color: '#94a3b8', cursor: 'pointer',
    fontSize: '13px', fontFamily: 'inherit'
  },
  resultContainer: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', minHeight: '80vh',
    padding: '20px', fontFamily: "'Inter', system-ui, sans-serif"
  },
  resultCard: {
    padding: '48px 36px', borderRadius: '32px',
    textAlign: 'center', maxWidth: '520px', width: '100%',
    boxShadow: '0 32px 80px rgba(0,0,0,0.2)', color: '#fff'
  },
  resultEmoji: { fontSize: '72px', marginBottom: '16px' },
  resultTitle: { fontSize: '44px', fontWeight: '900', margin: '0 0 8px' },
  resultDetails: {
    background: 'rgba(255,255,255,0.15)',
    padding: '20px 24px', borderRadius: '18px',
    marginBottom: '20px', textAlign: 'left'
  },
  statRow: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: '16px', padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.2)'
  },
  resultMessage: { fontSize: '15px', lineHeight: '1.6', marginBottom: '24px', opacity: 0.9 },
  resultActions: { display: 'flex', flexDirection: 'column', gap: '12px' },
  actionBtn: {
    padding: '14px', border: 'none', borderRadius: '14px',
    fontWeight: '800', cursor: 'pointer', fontSize: '15px',
    fontFamily: 'inherit'
  }
};