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
  { id: 'GIGA', name: 'GigaSoft Tech', price: 250, history: [240, 245, 238, 252, 248, 255, 250], sector: 'Technology', pe: '45.2', sentiment: 'Bullish', yield: '0.5%', prevClose: 248.12, open: 249.50, bid: "250.10 x 1200", ask: "250.45 x 800", range52: "180.50 - 310.20", volume: "45.2M", marketCap: "2.4T", beta: "1.45", eps: "5.12", earnings: "Oct 24, 2024", targetEst: "320.00" },
  { id: 'VOY', name: 'Voyager Energy', price: 85, history: [82, 84, 86, 85, 87, 86, 85], sector: 'Energy', pe: '9.4', sentiment: 'Neutral', yield: '6.2%', prevClose: 84.50, open: 85.10, bid: "84.90 x 400", ask: "85.20 x 1100", range52: "62.00 - 95.40", volume: "12.8M", marketCap: "450B", beta: "0.85", eps: "8.90", earnings: "Nov 02, 2024", targetEst: "105.00" },
  { id: 'MART', name: 'MegaMart Corp', price: 120, history: [125, 122, 121, 119, 118, 122, 120], sector: 'Retail', pe: '18.2', sentiment: 'Bearish', yield: '2.1%', prevClose: 121.20, open: 120.50, bid: "119.80 x 2000", ask: "120.10 x 1500", range52: "105.00 - 158.00", volume: "22.1M", marketCap: "890B", beta: "1.10", eps: "4.25", earnings: "Sep 15, 2024", targetEst: "110.00" },
  { id: 'SPY', name: 'S&P Lite Index', price: 400, history: [395, 398, 402, 399, 401, 399, 400], sector: 'Index Fund', pe: '21.0', sentiment: 'Bullish', yield: '1.8%', prevClose: 399.10, open: 400.00, bid: "400.05 x 5000", ask: "400.15 x 5000", range52: "350.00 - 460.00", volume: "85M", marketCap: "N/A", beta: "1.00", eps: "N/A", earnings: "N/A", targetEst: "480.00" },
  { id: 'GLD', name: 'Digital Gold', price: 1800, history: [1780, 1795, 1810, 1805, 1790, 1800, 1800], sector: 'Commodity', pe: 'N/A', sentiment: 'Neutral', yield: '0%', prevClose: 1798.50, open: 1800.00, bid: "1799.50 x 100", ask: "1801.00 x 150", range52: "1600 - 2100", volume: "2.1M", marketCap: "N/A", beta: "0.15", eps: "N/A", earnings: "N/A", targetEst: "2200.00" }
];

const VOCAB_HELPER = {
  pe: "Price-to-Earnings Ratio: Measures a company's current share price relative to its per-share earnings. High P/E often means investors expect high growth.",
  yield: "Dividend Yield: A financial ratio that tells you the percentage of a company's share price that it pays out in dividends each year.",
  ticker: "Ticker Symbol: A unique string of letters used to identify a particular stock on an exchange.",
  sentiment: "Market Sentiment: The overall attitude of investors toward a particular security.",
  volatility: "Volatility: How much a stock's price fluctuates over time.",
  prevClose: "Previous Close: The last trading price from the previous trading day.",
  open: "Open: The price at which the stock first traded when the market opened today.",
  bid: "Bid: The highest price a buyer is willing to pay right now (often shown with size).",
  ask: "Ask: The lowest price a seller is willing to accept right now (often shown with size).",
  marketCap: "Market Capitalization: The total market value of a company's outstanding shares.",
  range52: "52-Week Range: The lowest and highest prices the stock has traded at in the last 52 weeks.",
  targetEst: "1Y Target Estimate: Analyst consensus price target for one year out.",
  earnings: "Earnings Date: The scheduled date when the company reports earnings.",
  eps: "EPS (TTM): Earnings Per Share over the trailing twelve months.",
  volume: "Volume: The number of shares traded during the period.",
  beta: "Beta: A measure of a stock's volatility relative to the market."
};

export default function LeagueScreen({ currentUser: propCurrentUser, userId, db, userTier, onGameEnd }) {
  const [currentUser] = useState(propCurrentUser || localStorage.getItem("FIN_USERNAME") || "Guest_" + Math.floor(Math.random() * 9000));
  const [leagues, setLeagues] = useState(() => JSON.parse(localStorage.getItem("FIN_LEAGUES_GLOBAL")) || []);
  const [view, setView] = useState('menu');
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [joinCode, setJoinCode] = useState("");
  const [newLeagueName, setNewLeagueName] = useState("");
  const [leaguePrivacy, setLeaguePrivacy] = useState('public');
  
  // Game States
  const [playing, setPlaying] = useState(false);
  const [money, setMoney] = useState(1000);
  const [timeLeft, setTimeLeft] = useState(600);
  const [blitzStocks, setBlitzStocks] = useState(INITIAL_STOCKS);
  const [portfolio, setPortfolio] = useState({ GIGA: 0, VOY: 0, MART: 0, SPY: 0, GLD: 0 });
  const [selectedStock, setSelectedStock] = useState(INITIAL_STOCKS[0]);
  const [activePopupStock, setActivePopupStock] = useState(null);
  const [opponents, setOpponents] = useState([]);
  const [leagueFeed, setLeagueFeed] = useState([]);
  const [gameResult, setGameResult] = useState(null);
  const [gameStats, setGameStats] = useState({ buys: 0, sells: 0, startMoney: 1000 });
  const [vocabPopup, setVocabPopup] = useState({ visible: false, key: null, x: 0, y: 0 });
  const vocabRef = useRef(null);
  const bcRef = useRef(null);

  // helper to broadcast immediate sync to other tabs
  const broadcastSync = (payload = { type: 'sync' }) => {
    try {
      if (bcRef.current) bcRef.current.postMessage(payload);
      // also write a quick timestamp to localStorage to nudge storage listeners
      localStorage.setItem('FIN_LEAGUES_LAST_SYNC', Date.now().toString());
    } catch (err) { console.warn('broadcast failed', err); }
  };

  // Close vocab on click outside or Escape
  useEffect(() => {
    const onDocClick = (e) => {
      if (!vocabRef.current) return;
      if (!vocabRef.current.contains(e.target)) {
        setVocabPopup((v) => v.visible ? { visible: false, key: null, x: 0, y: 0 } : v);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setVocabPopup({ visible: false, key: null, x: 0, y: 0 });
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDocClick); document.removeEventListener('keydown', onKey); };
  }, []);

  // Sync Leagues across accounts/tabs
  useEffect(() => {
    const sync = () => {
      const global = JSON.parse(localStorage.getItem("FIN_LEAGUES_GLOBAL") || "[]");
      setLeagues(global);
    };
    window.addEventListener('storage', sync);
    const poller = setInterval(sync, 1500);
    return () => { window.removeEventListener('storage', sync); clearInterval(poller); };
  }, []);

  useEffect(() => {
    localStorage.setItem("FIN_LEAGUES_GLOBAL", JSON.stringify(leagues));
  }, [leagues]);

  // BroadcastChannel: ensure cross-tab/account sync (more reliable than relying only on storage events)
  useEffect(() => {
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        bcRef.current = new BroadcastChannel('FIN_LEAGUES_CHANNEL');
        bcRef.current.onmessage = (ev) => {
          if (!ev.data) return;
          if (ev.data.type === 'sync') {
            const global = JSON.parse(localStorage.getItem("FIN_LEAGUES_GLOBAL") || "[]");
            setLeagues(global);
          }
        };
      }
    } catch (err) {
      console.warn('BroadcastChannel not available', err);
    }
    return () => { bcRef.current?.close && bcRef.current.close(); };
  }, []);

  // Vocab click helper (places small helper popup near cursor)
  const handleVocabClick = (key, e) => {
    if (e && e.preventDefault) e.preventDefault();
    const x = (e?.clientX || window.innerWidth / 2) + 8;
    const y = (e?.clientY || window.innerHeight / 2) + 8;
    setVocabPopup({ visible: true, key, x, y });
  };

  // Blitz Engine
  useEffect(() => {
    let interval;
    if (playing && timeLeft > 0) {
      interval = setInterval(() => {
        const myWealth = money + blitzStocks.reduce((acc, s) => acc + (portfolio[s.id] * s.price), 0);
        localStorage.setItem(`FIN_SYNC_${selectedLeague.id}_${currentUser}`, myWealth.toString());

        setBlitzStocks(cur => cur.map(s => {
          const change = (Math.random() - 0.49) * (s.id === 'GIGA' ? 12 : 8);
          const next = Math.max(5, s.price + change);
          return { ...s, price: next, history: [...s.history.slice(-14), next] };
        }));

        const liveLeague = JSON.parse(localStorage.getItem("FIN_LEAGUES_GLOBAL") || "[]").find(l => l.id === selectedLeague.id);
        if (liveLeague) {
          setOpponents(liveLeague.players.filter(p => p !== currentUser).map(p => ({
            name: p, wealth: parseFloat(localStorage.getItem(`FIN_SYNC_${selectedLeague.id}_${p}`) || "1000")
          })));
        }
        setLeagueFeed(JSON.parse(localStorage.getItem(`FIN_FEED_${selectedLeague.id}`) || "[]"));
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && playing) endMatch();
    return () => clearInterval(interval);
  }, [playing, timeLeft, money, portfolio, blitzStocks]);

  const handleCreate = () => {
    if (!newLeagueName) return;
    // more reliable random code (6 chars)
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newL = { id: Date.now().toString(), name: newLeagueName, players: [currentUser], code, visibility: leaguePrivacy, createdBy: currentUser };
    const newArr = [...leagues, newL];
    setLeagues(newArr);
    // persist immediately so other tabs/profiles can pick it up
    localStorage.setItem("FIN_LEAGUES_GLOBAL", JSON.stringify(newArr));
    broadcastSync({ type: 'sync', action: 'create', league: newL });
    setNewLeagueName("");
    alert("League Created! Code: " + code);
  };

  const handleJoin = () => {
    const code = joinCode.trim().toUpperCase();
    const global = JSON.parse(localStorage.getItem("FIN_LEAGUES_GLOBAL") || "[]");
    const idx = global.findIndex(l => l.code.toUpperCase() === code);
    if (idx !== -1) {
      global[idx].players = Array.from(new Set([...(global[idx].players || []), currentUser]));
      setLeagues(global);
      localStorage.setItem("FIN_LEAGUES_GLOBAL", JSON.stringify(global));
      broadcastSync({ type: 'sync', action: 'join', leagueId: global[idx].id, user: currentUser });
      setSelectedLeague(global[idx]);
      setView('detail');
    } else alert("Invalid Code!");
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this league?")) return;
    const updated = leagues.filter(l => l.id !== id);
    setLeagues(updated);
    broadcastSync({ type: 'sync', action: 'delete', leagueId: id });
    if (selectedLeague?.id === id) setView('menu');
  };

  const trade = (id, type) => {
    const stock = blitzStocks.find(s => s.id === id);
    if (type === 'buy' && money >= stock.price) {
      setMoney(m => m - stock.price);
      setPortfolio(p => ({ ...p, [id]: p[id] + 1 }));
      setGameStats(s => ({ ...s, buys: s.buys + 1 }));
      updateFeed(`${currentUser} bought ${id}`);
    } else if (type === 'sell' && portfolio[id] > 0) {
      setMoney(m => m + stock.price);
      setPortfolio(p => ({ ...p, [id]: p[id] - 1 }));
      setGameStats(s => ({ ...s, sells: s.sells + 1 }));
      updateFeed(`${currentUser} sold ${id}`);
    }
  };

  const updateFeed = (msg) => {
    const key = `FIN_FEED_${selectedLeague.id}`;
    const cur = JSON.parse(localStorage.getItem(key) || "[]");
    localStorage.setItem(key, JSON.stringify([msg, ...cur].slice(0, 10)));
  };

  const endMatch = () => {
    const final = money + blitzStocks.reduce((acc, s) => acc + (portfolio[s.id] * s.price), 0);
    const net = final - gameStats.startMoney;
    setGameResult({ final, net, buys: gameStats.buys, sells: gameStats.sells, msg: net > 0 ? STOCK_WIN_REASONS[0] : STOCK_FAIL_REASONS[0] });
    setPlaying(false);
  };

  const YahooFinancePopup = ({ stock, onClose }) => {
    const [zoom, setZoom] = useState(1);
    const [hoverIdx, setHoverIdx] = useState(null);
    const data = stock.history || [];
    const visibleCount = Math.max(3, Math.round(data.length / zoom));
    const slice = data.slice(-visibleCount);
    const w = 600, h = 200, padding = 30;
    const max = Math.max(...slice), min = Math.min(...slice);
    const scaleX = (i) => padding + (i / Math.max(1, slice.length - 1)) * (w - padding * 2);
    const scaleY = (v) => padding + (1 - (v - min) / Math.max(1e-6, (max - min))) * (h - padding * 2);
    const points = slice.map((v, i) => `${scaleX(i)},${scaleY(v)}`).join(' ');

    const handleSvgMove = (e) => {
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const rel = Math.round(((x - padding) / (w - padding * 2)) * (slice.length - 1));
      const idx = Math.min(slice.length - 1, Math.max(0, rel || 0));
      setHoverIdx(idx);
    };

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = Math.sign(e.deltaY);
      setZoom(z => Math.min(4, Math.max(1, z - delta)));
    };

    return (
      <div style={lS.modalOverlay} onClick={onClose}>
        <div style={lS.modalContent} onClick={(e) => e.stopPropagation()}>
          <div style={lS.modalHeader}><h2>{stock.name} ({stock.id})</h2><button onClick={onClose} style={lS.closeBtn}>✕</button></div>
          <div style={lS.modalPriceRow}><div style={{fontSize:'48px', fontWeight:'900'}}>${stock.price.toFixed(2)}</div>
            <div style={{display:'flex', gap:8, alignItems:'center'}}>
              <button onClick={() => setZoom(z => Math.max(1, z - 1))} style={lS.minBtn}>−</button>
              <span style={{fontSize:12, color:'#64748b'}}>Zoom x{zoom}</span>
              <button onClick={() => setZoom(z => Math.min(4, z + 1))} style={lS.minBtn}>+</button>
            </div>
          </div>

          <div style={lS.modalGrid}>
            <div>
              Previous Close: <strong>{stock.prevClose}</strong><br/>
              Open: <strong>{stock.open}</strong><br/>
              Bid: <strong>{stock.bid}</strong><br/>
              Ask: <strong>{stock.ask}</strong>
            </div>
            <div>
              Market Cap: <strong>{stock.marketCap}</strong><br/>
              52W Range: <strong>{stock.range52}</strong><br/>
              1Y Target Est: <strong>{stock.targetEst}</strong><br/>
              Earnings Date: <strong>{stock.earnings}</strong><br/>
              EPS (TTM): <strong>{stock.eps}</strong>
            </div>
          </div>

          <div style={lS.modalChartArea}>
            <svg width={w} height={h} onMouseMove={handleSvgMove} onMouseLeave={() => setHoverIdx(null)} onWheel={handleWheel} style={{width:'100%', height: '220px'}}>
              {/* grid lines and labels */}
              {Array.from({length:4}).map((_,i)=>{
                const y = padding + i * ((h - padding*2)/3);
                const val = (max - ((i/3) * (max - min))).toFixed(2);
                return <g key={i}><line x1={padding} x2={w-padding} y1={y} y2={y} stroke="#eef2ff" strokeWidth={1}/><text x={6} y={y+4} fontSize={11} fill="#94a3b8">{val}</text></g>;
              })}

              <polyline fill="none" stroke="#6366f1" strokeWidth={2} points={points} strokeLinecap="round" strokeLinejoin="round" />
              {slice.map((v,i)=>{
                const cx = scaleX(i); const cy = scaleY(v);
                return <circle key={i} cx={cx} cy={cy} r={hoverIdx===i?5:3} fill={hoverIdx===i?"#ef4444":"#6366f1"} />;
              })}
            </svg>
            {hoverIdx !== null && (
              <div style={{marginTop:8, fontSize:13, color:'#334155'}}>Point: ${slice[hoverIdx].toFixed(2)} ({hoverIdx+1 - slice.length} days)</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (gameResult) return (
    <div style={lS.resultContainer}><div style={lS.resultCard}>
      <h1>SESSION REPORT</h1>
      <div style={lS.statBox}>
        <p>Total Buys: {gameResult.buys}</p><p>Total Sells: {gameResult.sells}</p>
        <p>Net Profit/Loss: <strong>${Math.round(gameResult.net)}</strong></p>
        <p style={{fontSize:'14px', marginTop:'15px', color:'#cbd5e1'}}>{gameResult.msg}</p>
      </div>
      <button style={lS.actionBtn} onClick={() => { setGameResult(null); setView('menu'); }}>Continue</button>
    </div></div>
  );

  if (playing) return (
    <div style={{...lS.pageWrapper, background:'#0f172a', padding:'20px'}}>
      {activePopupStock && <YahooFinancePopup stock={activePopupStock} onClose={() => setActivePopupStock(null)} />}
      {playing && vocabPopup.visible && <div ref={vocabRef} style={{...lS.vocabPopup, top:vocabPopup.y, left:vocabPopup.x}}>
        <div><strong>{VOCAB_HELPER[vocabPopup.key].split(':')[0]}</strong></div>
        <p style={{fontSize:'12px', margin:'5px 0 0'}}>{VOCAB_HELPER[vocabPopup.key].split(':')[1]}</p>
      </div>}
      <div style={lS.blitzGrid}>
        <div style={lS.sidePanel}>
          <h3>🏆 Standings</h3>
          <div style={lS.standRow}><span>1. {currentUser} (You)</span><span>${Math.round(money + blitzStocks.reduce((acc, s) => acc + (portfolio[s.id] * s.price), 0))}</span></div>
          {opponents.sort((a,b)=>b.wealth-a.wealth).map((o,i)=><div key={o.name} style={lS.standRow}><span>{i+2}. {o.name}</span><span>${Math.round(o.wealth)}</span></div>)}
          <h3 style={{marginTop:'30px'}}>📡 Feed</h3>
          {leagueFeed.map((f,i)=><div key={i} style={{fontSize:'11px', color:'#94a3b8'}}>{f}</div>)}
        </div>
        <div style={lS.mainPanel}>
          <div style={{display:'flex', justifyContent:'space-between'}}><h2>Terminal</h2><h2 style={{color:'#ef4444'}}>⏳ {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}</h2></div>
          <table style={lS.table}>
            <thead><tr><th onClick={(e)=>handleVocabClick('ticker', e)}>Ticker (?)</th><th>Price</th><th onClick={(e)=>handleVocabClick('sentiment', e)}>Sentiment (?)</th></tr></thead>
            <tbody>{blitzStocks.map(s=>(<tr key={s.id} onClick={()=>setSelectedStock(s)} style={{background: selectedStock.id===s.id?'#f8fafc':'none'}}>
              <td onClick={(e)=>{e.stopPropagation(); setActivePopupStock(s);}} style={{color:'#6366f1', textDecoration:'underline'}}>{s.id}</td>
              <td>${s.price.toFixed(2)}</td><td>{s.sentiment}</td>
            </tr>))}</tbody>
          </table>
          <div style={lS.tradeBar}>
            <h3>{selectedStock.name}</h3>
            <div style={{display:'flex', gap:'10px'}}><button style={{...lS.playBtn, background:'#10b981'}} onClick={()=>trade(selectedStock.id, 'buy')}>BUY</button>
            <button style={{...lS.playBtn, background:'#ef4444'}} onClick={()=>trade(selectedStock.id, 'sell')}>SELL</button></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (view === 'detail') return (
    <div style={lS.menuContainer}><button onClick={()=>setView('menu')} style={lS.backBtn}>← Back</button>
      <div style={lS.leagueBanner}><h1>{selectedLeague.name}</h1><p>Competition Hub • User: {currentUser}</p>{selectedLeague.createdBy && <p style={{fontSize:'12px', color:'rgba(255,255,255,0.7)'}}>Created by: {selectedLeague.createdBy}</p>}</div>
      <div style={lS.detailLayout}>
        <div style={lS.card}><h3>Players ({selectedLeague.players.length})</h3>{selectedLeague.players.map((p,i)=><div key={p} style={lS.standRow}>{i+1}. {p}{p===selectedLeague.createdBy?' (Creator)':''} {p===currentUser?'(You)':''}</div>)}</div>
        <div style={lS.card}><h3>Blitz Sim</h3><button style={{...lS.playBtn, background:'#6366f1'}} onClick={()=>{setMoney(1000); setTimeLeft(600); setPlaying(true);}}>🚀 Start Match</button></div>
      </div>
    </div>
  );

  return (
    return (

    {/* This tiny text ensures the UI stays connected to the storage */}
    <span style={{fontSize:'1px', color:'transparent'}}>Sync: {leagues.length}</span>
    
    <div style={lS.menuContainer}></div>
    <div style={lS.pageWrapper}><div style={lS.menuContainer}>
      <div style={{...lS.joinBox, background:'#eef2ff', border:'2px solid #6366f1', flexDirection:'column'}}>
        <h3 style={{margin:0}}>Tournament Hub</h3>
        <p style={{fontSize:'12px', color:'#6366f1'}}>Create or join hubs with unique codes.</p>
        <div style={{display:'flex', gap:'10px', width:'100%', margin:'15px 0'}}>
          <input style={lS.joinInput} placeholder="New League Name..." value={newLeagueName} onChange={e=>setNewLeagueName(e.target.value)} />
          <select style={lS.joinInput} value={leaguePrivacy} onChange={e=>setLeaguePrivacy(e.target.value)}><option value="public">Public</option><option value="private">Private</option></select>
          <button style={lS.joinBtn} onClick={handleCreate}>Create</button>
        </div>
        <div style={{width:'100%', borderTop:'1px solid #d1d5db', paddingTop:'15px'}}>
          <label style={{fontSize:'11px', fontWeight:'900'}}>INPUT JOIN CODE</label>
          <div style={{display:'flex', gap:'10px', marginTop:'5px'}}><input style={lS.joinInput} placeholder="Code..." value={joinCode} onChange={e=>setJoinCode(e.target.value)}/><button style={lS.joinBtn} onClick={handleJoin}>Join</button></div>
        </div>
      </div>
      
      <h2>Available Hubs</h2>
      <div style={lS.grid}>{leagues.filter(l => {
        if (l.visibility === 'public') return true;
        if (l.createdBy === currentUser) return true;
        if (l.players.includes(currentUser)) return true;
        return false;
      }).map(l => (
        <div key={l.id} style={lS.leagueCard} onClick={()=>{setSelectedLeague(l); setView('detail');}}>
          <span>{l.visibility==='public'?'🏫':'🔒'}</span>
          <div><strong>{l.name}</strong><br/><small>{l.players.length} Players{l.createdBy ? ` • Creator: ${l.createdBy}` : ''} • Code: {l.code}</small></div>
          <div style={{marginLeft:'auto', display:'flex', gap:'5px'}}>
            <button onClick={(e)=>{e.stopPropagation(); navigator.clipboard.writeText(l.code); alert("Copied!");}} style={lS.copyBtn}>Copy</button>
            {l.createdBy === currentUser && <button onClick={(e)=>{e.stopPropagation(); handleDelete(l.id);}} style={{...lS.copyBtn, color:'#ef4444'}}>Delete</button>}
          </div>
        </div>
      ))}</div>
    </div></div>
  );
}

const lS = {
  pageWrapper: { minHeight:'100vh', background:'#f8fafc', paddingBottom:'40px', fontFamily:'sans-serif' },
  menuContainer: { maxWidth:'900px', margin:'0 auto', padding:'40px 20px' },
  joinBox: { background:'#fff', padding:'25px', borderRadius:'20px', display:'flex', gap:'10px', marginBottom:'30px', boxShadow:'0 4px 12px rgba(0,0,0,0.05)' },
  joinInput: { padding:'12px', borderRadius:'10px', border:'1px solid #e2e8f0', flex:1 },
  joinBtn: { padding:'0 20px', borderRadius:'10px', border:'none', background:'#0f172a', color:'#fff', fontWeight:'bold', cursor:'pointer' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'15px' },
  leagueCard: { background:'#fff', padding:'20px', borderRadius:'15px', display:'flex', alignItems:'center', gap:'15px', cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,0.05)' },
  copyBtn: { padding:'5px 10px', borderRadius:'8px', border:'1px solid #e2e8f0', background:'#f8fafc', fontSize:'10px', cursor:'pointer' },
  leagueBanner: { background:'#6366f1', color:'#fff', padding:'30px', borderRadius:'20px', marginBottom:'20px' },
  detailLayout: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' },
  card: { background:'#fff', padding:'20px', borderRadius:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.05)' },
  standRow: { display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #f1f5f9' },
  blitzGrid: { display:'grid', gridTemplateColumns:'250px 1fr', gap:'20px', maxWidth:'1200px', margin:'0 auto' },
  sidePanel: { background:'#1e293b', padding:'20px', borderRadius:'15px', color:'#fff' },
  mainPanel: { background:'#fff', padding:'20px', borderRadius:'15px' },
  table: { width:'100%', borderCollapse:'collapse', marginTop:'20px' },
  tradeBar: { marginTop:'20px', padding:'20px', background:'#f8fafc', borderRadius:'15px' },
  playBtn: { flex:1, padding:'15px', border:'none', borderRadius:'10px', color:'#fff', fontWeight:'bold', cursor:'pointer' },
  vocabPopup: { position:'fixed', zIndex:9999, background:'#fff', padding:'15px', borderRadius:'12px', width:'200px', boxShadow:'0 10px 25px rgba(0,0,0,0.2)', border:'1px solid #6366f1' },
  minBtn: { border:'none', background:'none', cursor:'pointer', fontWeight:'bold' },
  modalOverlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10000 },
  modalContent: { background:'#fff', padding:'30px', borderRadius:'25px', maxWidth:'500px', width:'90%' },
  resultContainer: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a' },
  resultCard: { background:'linear-gradient(135deg, #1e293b, #0f172a)', padding:'40px', borderRadius:'30px', color:'#fff', textAlign:'center', maxWidth:'400px' },
  statBox: { background:'rgba(255,255,255,0.1)', padding:'20px', borderRadius:'15px', margin:'20px 0', textAlign:'left' },
  actionBtn: { width:'100%', padding:'15px', borderRadius:'10px', border:'none', fontWeight:'bold', cursor:'pointer', background:'#fff', color:'#0f172a' },
  backBtn: { background:'none', border:'none', color:'#6366f1', fontWeight:'bold', cursor:'pointer', marginBottom:'10px' }
};