import React, { useState, useRef, useEffect } from "react";

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

const INITIAL_STOCKS = [
  { id: 'GIGA', name: 'GigaSoft Tech', price: 250, history: [250, 245, 248], sector: 'Technology', pe: '24.5', sentiment: 'Bullish', yield: '1.2%' },
  { id: 'VOY', name: 'Voyager Energy', price: 85, history: [85, 87, 86], sector: 'Energy', pe: '12.1', sentiment: 'Neutral', yield: '4.5%' },
  { id: 'MART', name: 'MegaMart Corp', price: 120, history: [120, 118, 122], sector: 'Retail', pe: '18.2', sentiment: 'Bearish', yield: '2.1%' },
  { id: 'SPY', name: 'S&P Lite Index', price: 400, history: [400, 401, 399], sector: 'Index Fund', pe: '21.0', sentiment: 'Bullish', yield: '1.8%' },
  { id: 'GLD', name: 'Digital Gold', price: 1800, history: [1800, 1810, 1795], sector: 'Commodity', pe: 'N/A', sentiment: 'Neutral', yield: '0%' }
];

export default function GamesScreen({ userTier, onGameEnd, onNavigate }) {
  const [activeGame, setActiveGame] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [money, setMoney] = useState(0);
  const [day, setDay] = useState(1);
  const [gameResult, setGameResult] = useState(null);
  const [tradeMessage, setTradeMessage] = useState(null);
  const [waitingNext, setWaitingNext] = useState(false);
  
  // League/Multiplayer States
  const [view, setView] = useState('menu'); 
  const [leagues, setLeagues] = useState([
    { id: '101', name: 'AP Economics Titans', players: ['You', 'Sarah_99', 'InvestorJoe'], code: 'ECON1', activeMatch: true },
    { id: '102', name: 'Wall Street Wolves', players: ['You', 'CryptoKing'], code: 'WOLF8', activeMatch: false }
  ]);
  const [joinCode, setJoinCode] = useState("");
  const [selectedLeague, setSelectedLeague] = useState(null);

  // Blitz Advanced Sim States
  const [blitzStocks, setBlitzStocks] = useState(INITIAL_STOCKS);
  const [portfolio, setPortfolio] = useState({ GIGA: 0, VOY: 0, MART: 0, SPY: 0, GLD: 0 });
  const [selectedStock, setSelectedStock] = useState(INITIAL_STOCKS[0]);
  const [timeLeft, setTimeLeft] = useState(600); 
  const [opponents, setOpponents] = useState([]);
  const [leagueFeed, setLeagueFeed] = useState([]);

  const moneyRef = useRef(0);

  // --- BLITZ TERMINAL ENGINE ---
  useEffect(() => {
    let interval;
    if (playing && activeGame === 'Blitz' && timeLeft > 0) {
      interval = setInterval(() => {
        setBlitzStocks(current => current.map(s => {
          const volatility = s.id === 'GIGA' ? 12 : (s.id === 'SPY' ? 3 : 8);
          const change = (Math.random() - 0.49) * volatility;
          const next = Math.max(5, s.price + change);
          return { ...s, price: next, history: [...s.history.slice(-14), next] };
        }));

        if (Math.random() > 0.85) {
          const randomOpp = opponents[Math.floor(Math.random() * opponents.length)];
          const randomStock = blitzStocks[Math.floor(Math.random() * blitzStocks.length)];
          const action = Math.random() > 0.5 ? 'bought' : 'sold';
          const qty = Math.floor(Math.random() * 5) + 1;
          
          setLeagueFeed(prev => [`${randomOpp?.name || 'Bot'} ${action} ${qty} shares of ${randomStock.id}`, ...prev.slice(0, 5)]);
          setOpponents(prev => prev.map(o => o.name === randomOpp?.name ? { ...o, wealth: o.wealth * (1 + (Math.random() - 0.48) * 0.012) } : o));
        }

        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && playing && activeGame === 'Blitz') {
      endBlitzCompetition();
    }
    return () => clearInterval(interval);
  }, [playing, activeGame, timeLeft, opponents, blitzStocks]);

  const handleBlitzTrade = (stockId, type) => {
    const stock = blitzStocks.find(s => s.id === stockId);
    if (type === 'buy' && money >= stock.price) {
      setMoney(m => m - stock.price);
      setPortfolio(p => ({ ...p, [stockId]: p[stockId] + 1 }));
    } else if (type === 'sell' && portfolio[stockId] > 0) {
      setMoney(m => m + stock.price);
      setPortfolio(p => ({ ...p, [stockId]: p[stockId] - 1 }));
    }
  };

  const calculateTotalWealth = () => {
    let stockValue = 0;
    blitzStocks.forEach(s => stockValue += portfolio[s.id] * s.price);
    return money + stockValue;
  };

  const endBlitzCompetition = () => {
    const finalWealth = calculateTotalWealth();
    setMoney(finalWealth);
    const leadOpponent = opponents.reduce((prev, current) => (prev.wealth > current.wealth) ? prev : current, {wealth: 0, name: 'Opponent'});
    const won = finalWealth > leadOpponent.wealth;
    setGameResult(won ? 'won' : 'lost');
    setTradeMessage(`League Result: ${won ? 'You Won' : leadOpponent.name + ' Won'} ($${Math.round(won ? finalWealth : leadOpponent.wealth)})`);
    if (onGameEnd) onGameEnd(won ? 'won' : 'lost');
  };

  const tierSettings = {
    elementary: {
      currencySymbol: "⭐", startingCash: 50, icon: "🦁", themeColor: "#f59e0b", gradient: "linear-gradient(135deg,#f59e0b,#f97316)",
      winMultiplier: 0.75, saveWinMultiplier: 1.2, marketWinMultiplier: 1.1,
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
      savingScenarios: [
        { q: "You found 5⭐ under your pillow. Save it or spend?", optA: ["Spend it", 5], optB: ["Save it", 0] },
        { q: "Your piggy bank is full. Add 10⭐ or buy a small toy?", optA: ["Buy Toy", 10], optB: ["Add to Savings", 0] },
      ]
    },
    adult: {
      currencySymbol: "$", startingCash: 1000, icon: "💼", themeColor: "#6366f1", gradient: "linear-gradient(135deg,#6366f1,#4f46e5)",
      winMultiplier: 0.7, saveWinMultiplier: 1.4, marketWinMultiplier: 1.25,
      scenarios: [
        { q: "Housing: $400 studio or $200 shared house?", optA: ["Luxury Studio", 400], optB: ["Shared House", 200] },
        { q: "Commute: $140 Uber budget or $60 monthly bus pass?", optA: ["Uber Habits", 140], optB: ["Bus Pass", 60] },
        { q: "Food: $120 Organic Whole Foods or $50 Bulk Mart?", optA: ["Whole Foods", 120], optB: ["Bulk Mart", 50] },
        { q: "Insurance: Pay $70/mo now or risk a $5000 bill later?", optA: ["Skip Insurance", 0], optB: ["Pay Premium", 70] },
        { q: "Streaming: $15 Basic or $95 Premium Cable Bundle?", optA: ["Cable TV", 95], optB: ["One Service", 15] },
        { q: "Social: $80 Bar Night or $15 Board Game night?", optA: ["Clubbing", 80], optB: ["Game Night", 15] },
        { q: "Upgrade: $200 Phone Installment or keep old phone?", optA: ["New iPhone", 200], optB: ["Keep Old", 0] },
        { q: "Lunch: $20 Daily takeout or $5 Meal prep?", optA: ["Takeout", 20], optB: ["Meal Prep", 5] },
        { q: "Gym: $100 Boutique CrossFit or $10 Basic Gym?", optA: ["CrossFit", 100], optB: ["Basic Gym", 10] },
        { q: "Impulse: $50 'Limited Edition' Sneakers. Buy?", optA: ["Buy Them", 50], optB: ["Ignore", 0] },
      ],
      marketScenarios: [
        { q: "Penny Stock: $200 in 'BioTech X'. Very volatile!", optA: ["Buy In", 200], optB: ["Skip", 0] },
        { q: "Blue Chip: $400 in Apple shares. Solid but slower growth.", optA: ["Invest", 400], optB: ["Skip", 0] },
        { q: "Index Fund: $300 in S&P 500. Balanced risk.", optA: ["Buy Fund", 300], optB: ["Skip", 0] },
        { q: "IPO: $350 in a trendy new social media app.", optA: ["Buy IPO", 350], optB: ["Skip", 0] },
        { q: "Commodities: $250 in Crude Oil futures.", optA: ["Trade Oil", 250], optB: ["Skip", 0] },
        { q: "Real Estate: $450 in a REIT. Reliable dividends?", optA: ["Invest", 450], optB: ["Skip", 0] },
        { q: "Tech: $300 in AI Semiconductors. Huge hype.", optA: ["Buy AI", 300], optB: ["Skip", 0] },
        { q: "Bonds: $150 in Treasury Notes. Very safe.", optA: ["Buy Bonds", 150], optB: ["Skip", 0] },
        { q: "Energy: $200 in Solar Power startup.", optA: ["Go Green", 200], optB: ["Skip", 0] },
        { q: "Arbitrage: $400 in a complex currency swap.", optA: ["Execute", 400], optB: ["Skip", 0] },
      ],
      cryptoScenarios: [
        { q: "Memecoin: $300 in 'DogePluto'. 1000x or zero.", optA: ["Ape In", 300], optB: ["Skip", 0] },
        { q: "DeFi: $400 in a Yield Farm. 40% APY but risky code.", optA: ["Farm", 400], optB: ["Skip", 0] },
        { q: "Bitcoin: $500 in the King. Stable (for crypto).", optA: ["Buy BTC", 500], optB: ["Skip", 0] },
        { q: "NFT: $250 for a digital Bored Cat. Trend is dying.", optA: ["Buy NFT", 250], optB: ["Skip", 0] },
      ],
      savingScenarios: [
        { q: "Bonus: $200 Christmas bonus. Save or Spend?", optA: ["Splurge", 200], optB: ["Save It", 0] },
        { q: "Found Cash: $50 in a jacket. Treat or Piggy Bank?", optA: ["Fancy Meal", 50], optB: ["Save It", 0] },
      ],
      creditScenarios: [
        { q: "Credit Score: Pay $100 off your card to boost your score?", optA: ["Keep Cash", 0], optB: ["Pay Card", 100] },
        { q: "Bad Debt: A friend wants a $200 loan for a 'sure thing'.", optA: ["Lend It", 200], optB: ["Decline", 0] },
      ],
      hustleScenarios: [
        { q: "Equipment: $300 for a pro camera to start photography.", optA: ["Buy Pro", 300], optB: ["Use Phone", 0] },
        { q: "Ads: $100 for Instagram ads for your shop.", optA: ["Run Ads", 100], optB: ["Organic", 0] },
      ]
    }
  };

  const config = tierSettings[userTier] || tierSettings.adult;
  const scenarios = activeGame === 'Market' ? config.marketScenarios : activeGame === 'Crypto' ? config.cryptoScenarios : activeGame === 'Save' ? config.savingScenarios : activeGame === 'Credit' ? config.creditScenarios : activeGame === 'Hustle' ? config.hustleScenarios : config.scenarios;

  const resetGame = (countAsPlayed = false) => {
    if (countAsPlayed && onGameEnd) onGameEnd('lost');
    setPlaying(false); setGameResult(null); setActiveGame(null); setMoney(0); moneyRef.current = 0; setDay(1); setTradeMessage(null); setWaitingNext(false); setView('menu');
  };

  const endGame = (finalMoney) => {
    const winThreshold = (activeGame === 'Market' || activeGame === 'Crypto') ? config.startingCash * config.marketWinMultiplier : activeGame === 'Save' ? config.startingCash * config.saveWinMultiplier : config.startingCash * config.winMultiplier;
    const won = finalMoney >= winThreshold;
    setMoney(finalMoney); setGameResult(won ? 'won' : 'lost');
    if (onGameEnd) onGameEnd(won ? 'won' : 'lost');
  };

  const handleChoice = (cost) => {
    let updated = (activeGame === 'Save') ? (cost === 0 ? money + Math.max(10, Math.round(config.startingCash * 0.1)) : money - cost) : money - cost;
    if (updated <= 0) { setMoney(0); setGameResult('lost'); if (onGameEnd) onGameEnd('lost'); return; }
    if (day >= scenarios.length) { endGame(updated); return; }
    setMoney(updated); setDay(d => d + 1);
  };

  const handleMarketChoice = (opt) => {
    if (waitingNext) return;
    const amount = opt[1];
    if (amount === 0) { setDay(d => d + 1); setTradeMessage(`⏭ Skipped trade. Balance: ${config.currencySymbol}${moneyRef.current}`); if (day >= scenarios.length) { endGame(moneyRef.current); } return; }
    const success = Math.random() < (activeGame === 'Crypto' ? 0.35 : 0.48);
    const currentMoney = moneyRef.current;
    let newMoney, msg;
    if (success) {
      const profit = Math.max(10, Math.round(amount * (0.5 + Math.random() * (activeGame === 'Crypto' ? 2.5 : 1.8))));
      newMoney = currentMoney + profit; msg = `✅ +${config.currencySymbol}${profit} PROFIT! ${STOCK_WIN_REASONS[Math.floor(Math.random() * STOCK_WIN_REASONS.length)]}`;
    } else {
      const loss = Math.round(amount * (0.6 + Math.random() * (activeGame === 'Crypto' ? 1.0 : 0.8)));
      newMoney = Math.max(0, currentMoney - loss); msg = `❌ -${config.currencySymbol}${loss} LOSS. ${STOCK_FAIL_REASONS[Math.floor(Math.random() * STOCK_FAIL_REASONS.length)]}`;
    }
    moneyRef.current = newMoney; setMoney(newMoney); setTradeMessage(msg); setWaitingNext(true);
    if (newMoney <= 0) { setTimeout(() => { setGameResult('lost'); setWaitingNext(false); }, 1800); } 
    else if (day >= scenarios.length) { setTimeout(() => { endGame(newMoney); setWaitingNext(false); }, 1800); } 
    else { setTimeout(() => { setDay(d => d + 1); setTradeMessage(null); setWaitingNext(false); }, 1800); }
  };

  const handleJoinLeague = () => {
    const found = leagues.find(l => l.code.toUpperCase() === joinCode.toUpperCase());
    if (found) { setSelectedLeague(found); setView('leagueDetail'); } else { alert("Invalid Code!"); }
  };

  // --- RENDER LOGIC ---

  if (gameResult) {
    const isWin = gameResult === 'won';
    return (
      <div style={gS.resultContainer}>
        <div style={{ ...gS.resultCard, background: isWin ? 'linear-gradient(135deg,#064e3b,#059669)' : 'linear-gradient(135deg,#4c0519,#be123c)' }}>
          <div style={gS.resultEmoji}>{isWin ? '🏆🎉' : '💔😤'}</div>
          <h1 style={gS.resultTitle}>{isWin ? 'YOU WON!' : 'GAME OVER'}</h1>
          <div style={gS.resultDetails}><div style={gS.statRow}><span>Final Wealth</span><strong style={{ fontSize:'22px' }}>${Math.round(money)}</strong></div><div style={gS.statRow}><span>Result</span><strong>{tradeMessage || "Session Complete"}</strong></div></div>
          <button style={{ ...gS.actionBtn, background:'#fff', color: isWin ? '#059669' : '#be123c' }} onClick={() => resetGame()}>Continue</button>
        </div>
      </div>
    );
  }

  if (playing) {
    if (activeGame === 'Blitz') {
      return (
        <div style={{ ...gS.pageWrapper, padding: '20px', background: '#0f172a' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '250px 1fr 300px', gap: '20px' }}>
            <div style={{ background: '#1e293b', borderRadius: '16px', padding: '20px', color: '#fff' }}>
              <h3 style={{ margin: '0 0 15px', color: '#6366f1' }}>🏆 Standings</h3>
              <div style={gS.leaderRow}><span style={{color:'#facc15'}}>1. You</span> <span>${Math.round(calculateTotalWealth())}</span></div>
              {opponents.sort((a,b)=>b.wealth-a.wealth).map((o, i)=>(<div key={o.name} style={{...gS.leaderRow, borderBottom:'1px solid #334155'}}><span>{i+2}. {o.name}</span> <span>${Math.round(o.wealth)}</span></div>))}
              <h3 style={{ margin: '30px 0 15px', color: '#10b981' }}>📡 Activity Feed</h3>
              {leagueFeed.map((f, i) => <div key={i} style={{fontSize:'11px', marginBottom:'10px', color: '#94a3b8'}}>{f}</div>)}
            </div>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h2 style={{margin:0}}>Market Dashboard</h2><div style={{fontSize:'20px', fontWeight:'900', color: '#ef4444'}}>⏳ {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}</div></div>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                <thead><tr style={{ textAlign: 'left', color: '#64748b', fontSize: '13px' }}><th>Ticker</th><th>Price</th><th>Sentiment</th><th>Sector</th></tr></thead>
                <tbody>{blitzStocks.map(s => (<tr key={s.id} onClick={()=>setSelectedStock(s)} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: selectedStock.id === s.id ? '#f8fafc' : 'none' }}><td style={{ padding: '15px 0', fontWeight: 'bold' }}>{s.id}</td><td>${s.price.toFixed(2)}</td><td style={{ color: s.sentiment === 'Bullish' ? '#10b981' : (s.sentiment === 'Bearish' ? '#ef4444' : '#64748b') }}>{s.sentiment}</td><td>{s.sector}</td></tr>))}</tbody>
              </table>
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}><h3 style={{margin:'0 0 15px'}}>{selectedStock.name} Analysis</h3><div style={{ display: 'flex', gap: '30px', marginBottom: '20px', fontSize: '14px' }}><span>P/E Ratio: <b>{selectedStock.pe}</b></span><span>Div Yield: <b>{selectedStock.yield}</b></span><span>Owned: <b>{portfolio[selectedStock.id]}</b></span></div>
                <div style={{ display: 'flex', gap: '10px' }}><button onClick={() => handleBlitzTrade(selectedStock.id, 'buy')} style={{ ...gS.playBtn, background: '#10b981', flex: 1 }}>BUY</button><button onClick={() => handleBlitzTrade(selectedStock.id, 'sell')} style={{ ...gS.playBtn, background: '#ef4444', flex: 1 }}>SELL</button></div>
              </div>
            </div>
            <div style={{ background: '#1e293b', borderRadius: '16px', padding: '20px', color: '#fff' }}>
              <h3 style={{ margin: '0 0 15px', color: '#6366f1' }}>💼 Portfolio</h3><div style={{fontSize: '24px', fontWeight: '900', marginBottom: '20px'}}>${Math.round(calculateTotalWealth())}</div>
              <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '5px' }}>AVAILABLE CASH</div><div style={{ color: '#10b981', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>${Math.round(money)}</div>
              <div style={{ borderTop: '1px solid #334155', paddingTop: '15px' }}>{Object.entries(portfolio).map(([id, qty]) => qty > 0 && (<div key={id} style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', fontSize:'13px'}}><span>{id} ({qty})</span><span>${Math.round(qty * blitzStocks.find(s=>s.id===id).price)}</span></div>))}</div>
              <button onClick={endBlitzCompetition} style={{ width:'100%', marginTop:'40px', background:'#ef4444', color:'#fff', border:'none', padding:'12px', borderRadius:'8px', cursor:'pointer', fontWeight:'bold' }}>End Competition</button>
            </div>
          </div>
        </div>
      );
    }
    const currentScenario = scenarios[Math.min(day - 1, scenarios.length - 1)];
    const themeGradient = (activeGame === 'Market' || activeGame === 'Crypto') ? 'linear-gradient(135deg,#7c3aed,#6366f1)' : config.gradient;
    return (
      <div style={gS.gameContainer}>
        <div style={{ ...gS.gameHeader, borderTop: `5px solid ${config.themeColor}` }}><div><div style={{ fontSize:'11px', fontWeight:'800', color:'#94a3b8', textTransform:'uppercase' }}>{activeGame} MODE</div><div style={{ fontWeight:'900', fontSize:'17px', color:'#1e293b' }}>Day {day} / {scenarios.length}</div></div>
          <div style={{ ...gS.balanceChip, background: money < 200 ? '#fee2e2' : '#d1fae5' }}><span style={{ fontSize:'11px', fontWeight:'600', opacity:0.7 }}>BALANCE</span><span style={{ fontWeight:'900', fontSize:'18px', display:'block' }}>{config.currencySymbol}{money}</span></div>
        </div>
        <div style={gS.progressTrack}><div style={{ ...gS.progressBar, width:`${((day - 1) / scenarios.length) * 100}%`, background: themeGradient }} /></div>
        <div style={gS.scenarioCard} className="scenario-entry"><p style={gS.scenarioText}>{currentScenario.q}</p>
          {tradeMessage && (<div style={{ ...gS.tradeMsg, background: tradeMessage.includes('✅') ? '#d1fae5' : tradeMessage.includes('⏭') ? '#f1f5f9' : '#fee2e2', borderColor: tradeMessage.includes('✅') ? '#6ee7b7' : '#fca5a5' }}>{tradeMessage}</div>)}
          {!waitingNext && (<div style={gS.choiceRow}><button style={{ ...gS.choiceBtn, background: themeGradient }} onClick={() => (activeGame === 'Market' || activeGame === 'Crypto') ? handleMarketChoice(currentScenario.optA) : handleChoice(currentScenario.optA[1])}><span>{currentScenario.optA[0]}</span><b>{config.currencySymbol}{currentScenario.optA[1]}</b></button><button style={gS.choiceBtnSecondary} onClick={() => (activeGame === 'Market' || activeGame === 'Crypto') ? handleMarketChoice(currentScenario.optB) : handleChoice(currentScenario.optB[1])}><span>{currentScenario.optB[0]}</span><span style={{color:'#64748b'}}>{currentScenario.optB[1] > 0 ? `${config.currencySymbol}${currentScenario.optB[1]}` : 'FREE'}</span></button></div>)}
        </div>
        <button onClick={() => resetGame(true)} style={gS.quitBtn}>Quit game</button>
      </div>
    );
  }

  if (view === 'leagues') {
    return (
      <div style={gS.menuContainer}><div style={gS.menuHeader}><button onClick={() => setView('menu')} style={gS.backBtn}>← Back</button><h2 style={gS.menuTitle}>🏆 Classroom Leagues</h2></div>
        <div style={gS.joinBox}><input style={gS.joinInput} placeholder="Code (e.g. ECON1)" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} /><button style={gS.joinBtn} onClick={handleJoinLeague}>Join</button></div>
        <div style={gS.gamesGrid}>{leagues.map(l => (<div key={l.id} style={gS.leagueCard} onClick={() => { setSelectedLeague(l); setView('leagueDetail'); }}><div style={gS.leagueIcon}>🏫</div><div style={{flex:1}}><div style={{fontWeight:'900', fontSize:'18px'}}>{l.name}</div><div style={{color:'#64748b', fontSize:'13px'}}>{l.players.length} members • Code: {l.code}</div></div>{l.activeMatch && <div style={gS.liveBadge}>LIVE</div>}</div>))}</div>
      </div>
    );
  }

  if (view === 'leagueDetail') {
    return (
      <div style={gS.menuContainer}><button onClick={() => setView('leagues')} style={gS.backBtn}>← All Leagues</button><div style={gS.leagueBanner}><h1 style={{margin:0}}>{selectedLeague.name}</h1><p>Competition Hub</p></div>
        <div style={gS.leagueLayout}><div style={gS.leaderboard}><h3 style={{marginTop:0}}>Leaderboard</h3>{selectedLeague.players.map((p, i) => (<div key={p} style={gS.leaderRow}><span>{i+1}. {p}</span><span style={{fontWeight:'bold'}}>{config.currencySymbol}{Math.floor(Math.random()*5000 + 1000)}</span></div>))}</div>
          <div style={gS.leagueActions}><div style={gS.activeMatchCard}><h3>Blitz Stock Simulation</h3><p>Live trading. Beat the league bots to win.</p>
              <button style={{...gS.playBtn, background: '#6366f1'}} onClick={() => {
                setMoney(config.startingCash); moneyRef.current = config.startingCash;
                setPortfolio({ GIGA: 0, VOY: 0, MART: 0, SPY: 0, GLD: 0 });
                setOpponents(selectedLeague.players.filter(p => p !== 'You').map(name => ({ name, wealth: config.startingCash })));
                setTimeLeft(600); setActiveGame('Blitz'); setPlaying(true); setView('menu');
              }}>🚀 Start Competitions</button>
            </div></div>
        </div>
      </div>
    );
  }

  const games = [
    { id:'Budget', icon:'📊', title:'Survival Budget', desc:'Keep 70% of your starting cash.', grad:'linear-gradient(135deg,#6366f1,#4f46e5)' },
    { id:'Market', icon:'📈', title:'Stock Master', desc:'Trade volatile stocks.', grad:'linear-gradient(135deg,#7c3aed,#6366f1)' },
    { id:'Crypto', icon:'🪙', title:'Crypto King', desc:'High risk, 10x reward.', grad:'linear-gradient(135deg,#0f172a,#334155)' },
    { id:'Save',   icon:'💰', title:'Savings Sprint', desc:'Smart frugality choices.', grad:'linear-gradient(135deg,#10b981,#059669)' },
    { id:'Credit', icon:'💳', title:'Credit Crush', desc:'Balance debt to survive.', grad:'linear-gradient(135deg,#f43f5e,#e11d48)' },
    { id:'Hustle', icon:'🚀', title:'Side Hustle', desc:'Launch a business.', grad:'linear-gradient(135deg,#f59e0b,#d97706)' },
  ];

  return (
    <div style={gS.pageWrapper}><style>{`@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-8px); } 100% { transform: translateY(0px); } } .game-card:hover { transform: translateY(-10px); transition: 0.3s; } .scenario-entry { animation: slideUp 0.4s ease-out; } @keyframes slideUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } } `}</style>
      <div style={gS.menuContainer}><div style={gS.menuHeader}><h2 style={gS.menuTitle}>🎮 Financial Games</h2><p style={gS.menuSub}>Choose your path to financial freedom.</p></div>
        <div style={gS.gamesGrid}>{games.map(g => (<div key={g.id} className="game-card" style={gS.gameCard}><div style={{ ...gS.gameCardTop, background: g.grad }}><div style={{ fontSize:'42px', animation:'float 3s ease-in-out infinite' }}>{g.icon}</div><h3 style={{ margin:'12px 0 0', color:'#fff', fontSize:'20px', fontWeight:'900' }}>{g.title}</h3></div><div style={gS.gameCardBottom}><p style={gS.gameCardDesc}>{g.desc}</p><button style={{ ...gS.playBtn, background: g.grad }} onClick={() => { setMoney(config.startingCash); moneyRef.current = config.startingCash; setDay(1); setActiveGame(g.id); setPlaying(true); }}>Play Mode</button></div></div>))}</div>
        <div style={gS.extraRow}><div style={gS.cardPromo} onClick={() => setView('leagues')}><div style={gS.promoTitle}>🏆 Classroom Leagues</div><p style={gS.promoText}>Live tournaments.</p><button style={gS.promoBtn}>Enter Leagues</button></div>
          <div style={gS.cardPromo}><div style={gS.promoTitle}>💼 Salary Simulator</div><p style={gS.promoText}>Future career map.</p><button style={{ ...gS.promoBtn, background:'#10b981' }} onClick={() => onNavigate?.('Salary')}>Open</button></div>
        </div>
      </div>
    </div>
  );
}

const gS = {
  pageWrapper: { minHeight:'100vh', background:'#f8fafc', paddingBottom:'60px' },
  menuContainer: { maxWidth:'1000px', margin:'0 auto', padding:'40px 20px', fontFamily:"'Inter', system-ui, sans-serif" },
  menuHeader: { marginBottom:'32px', textAlign:'center' },
  menuTitle: { fontSize:'38px', fontWeight:'900', color:'#0f172a', margin:'0 0 8px', letterSpacing:'-1px' },
  menuSub: { color:'#64748b', fontSize:'16px' },
  gamesGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'24px' },
  gameCard: { borderRadius:'24px', overflow:'hidden', background:'#fff', boxShadow:'0 15px 30px -10px rgba(0,0,0,0.1)', cursor:'pointer' },
  gameCardTop: { padding:'40px 20px', textAlign:'center' },
  gameCardBottom: { padding:'24px' },
  gameCardDesc: { fontSize:'14px', color:'#475569', lineHeight:'1.5', height:'45px', marginBottom:'20px' },
  playBtn: { width:'100%', padding:'14px', borderRadius:'14px', border:'none', color:'#fff', fontWeight:'800', cursor:'pointer' },
  gameContainer: { maxWidth:'500px', margin:'60px auto', padding:'0 20px' },
  gameHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', background:'#fff', padding:'16px 20px', borderRadius:'20px', boxShadow:'0 4px 15px rgba(0,0,0,0.05)', marginBottom:'12px' },
  balanceChip: { padding:'8px 16px', borderRadius:'12px', textAlign:'right' },
  progressTrack: { height:'8px', background:'#e2e8f0', borderRadius:'10px', overflow:'hidden', marginBottom:'20px' },
  progressBar: { height:'100%', transition:'width 0.3s' },
  scenarioCard: { background:'#fff', padding:'32px', borderRadius:'28px', boxShadow:'0 20px 40px rgba(0,0,0,0.1)' },
  scenarioText: { fontSize:'20px', fontWeight:'800', color:'#1e293b', marginBottom:'24px', lineHeight:'1.4' },
  tradeMsg: { padding:'16px', borderRadius:'16px', border:'2px solid', marginBottom:'20px', fontSize:'14px', fontWeight:'600' },
  choiceRow: { display:'flex', flexDirection:'column', gap:'12px' },
  choiceBtn: { display:'flex', justifyContent:'space-between', padding:'18px', borderRadius:'16px', border:'none', color:'#fff', cursor:'pointer', fontWeight:'700' },
  choiceBtnSecondary: { display:'flex', justifyContent:'space-between', padding:'18px', borderRadius:'16px', border:'2px solid #e2e8f0', background:'#fff', cursor:'pointer', fontWeight:'700' },
  quitBtn: { display:'block', margin:'20px auto', background:'none', border:'none', color:'#94a3b8', fontWeight:'700', cursor:'pointer' },
  resultContainer: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' },
  resultCard: { maxWidth:'450px', width:'100%', padding:'40px', borderRadius:'32px', textAlign:'center', color:'#fff', boxShadow:'0 30px 60px rgba(0,0,0,0.2)' },
  resultEmoji: { fontSize:'70px', marginBottom:'16px' },
  resultTitle: { fontSize:'40px', fontWeight:'900', margin:'0 0 10px' },
  resultDetails: { background:'rgba(255,255,255,0.15)', padding:'24px', borderRadius:'20px', textAlign:'left', marginBottom:'24px' },
  statRow: { display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.1)' },
  extraRow: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px', marginTop:'40px' },
  cardPromo: { background:'#fff', padding:'24px', borderRadius:'24px', boxShadow:'0 10px 20px rgba(0,0,0,0.05)', cursor:'pointer' },
  promoTitle: { fontSize:'19px', fontWeight:'900', marginBottom:'10px' },
  promoText: { fontSize:'14px', color:'#64748b', marginBottom:'16px' },
  promoBtn: { background:'#6366f1', color:'#fff', border:'none', padding:'10px 20px', borderRadius:'10px', fontWeight:'700', cursor:'pointer' },
  joinBox: { background:'#fff', padding:'30px', borderRadius:'24px', display:'flex', gap:'12px', marginBottom:'32px', boxShadow:'0 4px 15px rgba(0,0,0,0.05)' },
  joinInput: { flex:1, padding:'14px', borderRadius:'12px', border:'2px solid #e2e8f0', fontSize:'16px', fontWeight:'600' },
  joinBtn: { background:'#0f172a', color:'#fff', padding:'0 24px', borderRadius:'12px', border:'none', fontWeight:'800', cursor:'pointer' },
  leagueCard: { background:'#fff', padding:'20px', borderRadius:'18px', display:'flex', alignItems:'center', gap:'15px', cursor:'pointer', border:'2px solid transparent' },
  leagueIcon: { fontSize:'30px', background:'#f1f5f9', width:'60px', height:'60px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'14px' },
  liveBadge: { background:'#ef4444', color:'#fff', fontSize:'10px', fontWeight:'900', padding:'4px 8px', borderRadius:'6px' },
  backBtn: { background:'none', border:'none', color:'#6366f1', fontWeight:'800', cursor:'pointer', marginBottom:'12px' },
  leagueBanner: { background:'#6366f1', color:'#fff', padding:'40px', borderRadius:'24px', marginBottom:'30px' },
  leagueLayout: { display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:'24px' },
  leaderboard: { background:'#fff', padding:'24px', borderRadius:'20px' },
  leaderRow: { display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid #f1f5f9' },
  activeMatchCard: { background:'#fff', padding:'30px', borderRadius:'20px', border:'3px solid #6366f1' }
};