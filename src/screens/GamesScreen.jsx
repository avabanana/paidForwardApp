import React, { useState, useRef, useEffect, useCallback } from "react";

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

// Generate insights based on game performance
const generateGameInsight = (activeGame, gameStats, finalMoney, startMoney, config) => {
  const netProfit = finalMoney - startMoney;
  const isWin = finalMoney >= (config.startingCash * config.marketWinMultiplier);
  const profitPercentage = ((netProfit / startMoney) * 100).toFixed(1);

  if (activeGame === 'Market' || activeGame === 'Crypto' || activeGame === 'Blitz') {
    const totalTrades = (gameStats.buys || 0) + (gameStats.sells || 0);
    const buyToSellRatio = gameStats.buys / Math.max(1, gameStats.sells);
    
    if (netProfit > 0) {
      if (buyToSellRatio > 3) {
        return `You made ${profitPercentage}% profit! 📈 Notice: You bought much more than you sold (${gameStats.buys} buys vs ${gameStats.sells} sells). Consider locking in gains faster to reduce risk exposure.`;
      } else if (buyToSellRatio < 0.5) {
        return `You made ${profitPercentage}% profit! 📈 Smart timing on your exits. You sold at favorable prices (${gameStats.sells} sells vs ${gameStats.buys} buys). Keep your profit-taking discipline sharp.`;
      } else {
        return `You made ${profitPercentage}% profit! 📈 Balanced trading approach. You executed ${totalTrades} trades with discipline. Look for ways to increase position size on high-conviction bets.`;
      }
    } else {
      if (gameStats.buys === 0) {
        return `You lost ${Math.abs(profitPercentage)}% by sitting in cash. 😬 Fear of missing out? In volatile markets, even bad timing beats zero participation. Start smaller next time.`;
      } else if (buyToSellRatio > 2) {
        return `You lost ${Math.abs(profitPercentage)}% by holding losers too long. 📉 You bought ${gameStats.buys} times but only sold ${gameStats.sells} times. Cut losses faster and preserve capital.`;
      } else {
        return `You lost ${Math.abs(profitPercentage)}%. 📉 Market volatility got the better of you. Review: avoid trading based on emotion. Set stop-losses before entering positions.`;
      }
    }
  } else if (activeGame === 'Budget') {
    if (finalMoney > startMoney * 1.2) {
      return `You budgeted excellently—nearly ${profitPercentage}% growth! 💰 You made smart spending cuts and avoided temptation. This discipline is the foundation of financial success.`;
    } else if (finalMoney > startMoney * 0.9) {
      return `Solid budget management—${profitPercentage}% net change. 💭 You stayed mostly on track. Next challenge: find even bigger wins by cutting discretionary spending further.`;
    } else {
      return `You struggled with the budget—lost ${Math.abs(profitPercentage)}%. 📉 Identify one major expense category to cut by 20% next time. Small changes compound.`;
    }
  } else if (activeGame === 'Credit') {
    if (finalMoney >= startMoney * 0.8) {
      return `You survived credit challenges well—only ${Math.abs(profitPercentage)}% loss. 🎯 You prioritized minimum payments and avoided maxing cards. Keep that discipline!`;
    } else if (finalMoney > 0) {
      return `Your credit decisions cost you. Lost ${Math.abs(profitPercentage)}%. 😰 Too many high-interest purchases. In the real world, one missed payment can tank your credit score for years`;
    } else {
      return `Bankruptcy. 🚫 You took on debt without a repayment plan. Real lesson: never borrow without a clear way to pay it back within 6 months.`;
    }
  } else if (activeGame === 'Save') {
    if (finalMoney >= startMoney * 1.5) {
      return `Exceptional savings discipline—${profitPercentage}% growth! 🏆 You resisted spending and let compound interest work. This mentality builds generational wealth.`;
    } else if (finalMoney > startMoney) {
      return `Good saving—${profitPercentage}% growth. 📈 Solid start! Remember: even 5-10% annual growth compounds to life-changing wealth over decades.`;
    } else {
      return `You couldn't save. Spent ${Math.abs(profitPercentage)}% of your money. 😞 Identify where your money goes each month. Can't save what you don't track.`;
    }
  } else if (activeGame === 'Hustle') {
    if (finalMoney >= startMoney * 2) {
      return `Your side hustle thrived—${profitPercentage}% ROI! 🚀 Smart investment in tools and marketing. In reality, the first $1k is hardest; keep reinvesting profits.`;
    } else if (finalMoney > startMoney) {
      return `Your business is profitable—${profitPercentage}% gain. 📊 You invested wisely in growth. Next: scale by hiring or expanding into new products/markets.`;
    } else {
      return `Your startup failed—lost ${Math.abs(profitPercentage)}%. 💔 Lesson: most businesses take $500-$2k upfront to even start making money. Budget conservatively.`;
    }
  }
  
  return `You ${finalMoney >= startMoney ? 'won' : 'lost'}. Final wealth: $${Math.round(finalMoney)}. ${netProfit > 0 ? STOCK_WIN_REASONS[Math.floor(Math.random() * STOCK_WIN_REASONS.length)] : STOCK_FAIL_REASONS[Math.floor(Math.random() * STOCK_FAIL_REASONS.length)]}`;
};

const INITIAL_STOCKS = [
  { 
    id: 'GIGA', name: 'GigaSoft Tech', price: 250, history: [240, 245, 238, 252, 248, 255, 250], sector: 'Technology', pe: '45.2', sentiment: 'Bullish', yield: '0.5%', 
    prevClose: 248.12, open: 249.50, bid: "250.10 x 1200", ask: "250.45 x 800", range52: "180.50 - 310.20", volume: "45.2M", marketCap: "2.4T", beta: "1.45", eps: "5.12", earnings: "Oct 24, 2024", targetEst: "320.00",
    desc: "A high-growth software giant specializing in Enterprise AI and Cloud Infrastructure.",
    basePrice: 250,
    volatility: 0.15,
    trend: 0.02
  },
  { 
    id: 'VOY', name: 'Voyager Energy', price: 85, history: [82, 84, 86, 85, 87, 86, 85], sector: 'Energy', pe: '9.4', sentiment: 'Neutral', yield: '6.2%', 
    prevClose: 84.50, open: 85.10, bid: "84.90 x 400", ask: "85.20 x 1100", range52: "62.00 - 95.40", volume: "12.8M", marketCap: "450B", beta: "0.85", eps: "8.90", earnings: "Nov 02, 2024", targetEst: "105.00",
    desc: "A traditional oil producer pivoting to offshore wind and hydrogen storage.",
    basePrice: 85,
    volatility: 0.10,
    trend: -0.01
  },
  { 
    id: 'MART', name: 'MegaMart Corp', price: 120, history: [125, 122, 121, 119, 118, 122, 120], sector: 'Retail', pe: '18.2', sentiment: 'Bearish', yield: '2.1%', 
    prevClose: 121.20, open: 120.50, bid: "119.80 x 2000", ask: "120.10 x 1500", range52: "105.00 - 158.00", volume: "22.1M", marketCap: "890B", beta: "1.10", eps: "4.25", earnings: "Sep 15, 2024", targetEst: "110.00",
    desc: "Global retail chain facing high labor costs and fierce e-commerce competition.",
    basePrice: 120,
    volatility: 0.12,
    trend: -0.03
  },
  { 
    id: 'SPY', name: 'S&P Lite Index', price: 400, history: [395, 398, 402, 399, 401, 399, 400], sector: 'Index Fund', pe: '21.0', sentiment: 'Bullish', yield: '1.8%', 
    prevClose: 399.10, open: 400.00, bid: "400.05 x 5000", ask: "400.15 x 5000", range52: "350.00 - 460.00", volume: "85M", marketCap: "N/A", beta: "1.00", eps: "N/A", earnings: "N/A", targetEst: "480.00",
    desc: "A basket of the 500 largest US companies. Lower risk, diversified exposure.",
    basePrice: 400,
    volatility: 0.08,
    trend: 0.01
  },
  { 
    id: 'GLD', name: 'Digital Gold', price: 1800, history: [1780, 1795, 1810, 1805, 1790, 1800, 1800], sector: 'Commodity', pe: 'N/A', sentiment: 'Neutral', yield: '0%', 
    prevClose: 1798.50, open: 1800.00, bid: "1799.50 x 100", ask: "1801.00 x 150", range52: "1600 - 2100", volume: "2.1M", marketCap: "N/A", beta: "0.15", eps: "N/A", earnings: "N/A", targetEst: "2200.00",
    desc: "A digital asset backed by physical gold bullion stored in secure vaults.",
    basePrice: 1800,
    volatility: 0.09,
    trend: 0.005
  }
];

// Realistic price update algorithm
const updateStockPrice = (stock, marketSentiment = 0) => {
  const { price, basePrice, volatility, trend } = stock;
  const trendComponent = trend * price * (Math.random() - 0.3);
  const volatilityComponent = (Math.random() - 0.5) * volatility * price * (1 + marketSentiment * 0.5);
  const deviationFromBase = price - basePrice;
  const meanReversionComponent = -deviationFromBase * 0.02;
  let newPrice = price + trendComponent + volatilityComponent + meanReversionComponent;
  const range52Low = basePrice * 0.7;
  const range52High = basePrice * 1.4;
  newPrice = Math.max(range52Low, Math.min(range52High, newPrice));
  newPrice = Math.max(5, newPrice);
  return newPrice;
};

const VOCAB_HELPER = {
  pe: "Price-to-Earnings Ratio: Measures a company's current share price relative to its per-share earnings. High P/E often means investors expect high growth.",
  yield: "Dividend Yield: A financial ratio that tells you the percentage of a company's share price that it pays out in dividends each year.",
  ticker: "Ticker Symbol: A unique string of letters used to identify a particular stock on an exchange.",
  sentiment: "Market Sentiment: The overall attitude of investors toward a particular security or the financial market.",
  volatility: "Volatility: How much a stock's price fluctuates over time. High volatility means higher risk and higher potential reward."
};

export default function GamesScreen({ userTier, onGameEnd, onNavigate, userName }) {
  const [activeGame, setActiveGame] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [money, setMoney] = useState(0);
  const [day, setDay] = useState(1);
  const [gameResult, setGameResult] = useState(null);
  const [tradeMessage, setTradeMessage] = useState(null);
  const [waitingNext, setWaitingNext] = useState(false);
  const [gameStats, setGameStats] = useState({ buys: 0, sells: 0, startMoney: 0 });
  
  const [currentUser] = useState(() => {
    if (userName) return userName;
    const saved = localStorage.getItem("FIN_USERNAME");
    if (saved) return saved;
    return "Investor_" + Math.floor(Math.random() * 9000);
  });

  const [leagues, setLeagues] = useState(() => {
    const saved = localStorage.getItem("FIN_LEAGUES_GLOBAL");
    const base = [
      { id: '101', name: 'AP Economics Titans', players: ['Sarah_99', 'InvestorJoe'], code: 'ECON1', activeMatch: true, visibility: 'public', createdBy: 'System' },
      { id: '102', name: 'Wall Street Wolves', players: ['CryptoKing'], code: 'WOLF8', activeMatch: false, visibility: 'public', createdBy: 'System' }
    ];
    return saved ? JSON.parse(saved) : base;
  });

  useEffect(() => {
    localStorage.setItem("FIN_LEAGUES_GLOBAL", JSON.stringify(leagues));
  }, [leagues]);

  useEffect(() => {
    const handleSync = () => {
      const updated = localStorage.getItem("FIN_LEAGUES_GLOBAL");
      if (updated) setLeagues(JSON.parse(updated));
    };
    window.addEventListener('storage', handleSync);
    const poller = setInterval(handleSync, 2000);
    return () => { window.removeEventListener('storage', handleSync); clearInterval(poller); };
  }, []);

  const [view, setView] = useState('menu'); 
  const [joinCode, setJoinCode] = useState("");
  const [newLeagueName, setNewLeagueName] = useState("");
  const [leaguePrivacy, setLeaguePrivacy] = useState('public');
  const [selectedLeague, setSelectedLeague] = useState(null);

  const [blitzStocks, setBlitzStocks] = useState(INITIAL_STOCKS);
  const [portfolio, setPortfolio] = useState({ GIGA: 0, VOY: 0, MART: 0, SPY: 0, GLD: 0 });
  const [selectedStock, setSelectedStock] = useState(INITIAL_STOCKS[0]);
  const [activePopupStock, setActivePopupStock] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); 
  const [opponents, setOpponents] = useState([]);
  const [leagueFeed, setLeagueFeed] = useState([]);

  const [vocabPopup, setVocabPopup] = useState({ visible: false, key: null, x: 0, y: 0 });
  const vocabRef = useRef(null);
  const moneyRef = useRef(0);

  useEffect(() => {
    const clickOutside = (e) => {
      if (vocabRef.current && !vocabRef.current.contains(e.target)) {
        setVocabPopup({ visible: false, key: null, x: 0, y: 0 });
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const handleVocabClick = (key, e) => {
    e.stopPropagation();
    setVocabPopup({ visible: true, key, x: e.clientX, y: e.clientY });
  };

  const tierSettings = {
    elementary: {
      currencySymbol: "⭐", startingCash: 50, icon: "🦁", themeColor: "#f59e0b", gradient: "linear-gradient(135deg,#f59e0b,#f97316)",
      winMultiplier: 0.75, saveWinMultiplier: 1.2, marketWinMultiplier: 1.1,
      scenarios: [
        { q: "You found a cool toy for 5⭐! Buy it or keep your stars?", optA: ["Buy Toy", 5], optB: ["Save Stars", 0], msgA: "❌ Toy time! You bought it, but your star balance is lower now.", msgB: "✅ Patience pays off! You saved your stars for a bigger goal later." },
        { q: "You're thirsty! Buy fancy juice for 4⭐ or drink water for free?", optA: ["Fancy Juice", 4], optB: ["Free Water", 0], msgA: "❌ Yum! That juice was tasty, but it cost you stars.", msgB: "✅ Healthy and smart! You stayed hydrated for free and kept your stars." },
        { q: "Pay 3⭐ for a rare sticker or keep your stars?", optA: ["Rare Sticker", 3], optB: ["Keep Stars", 0], msgA: "❌ Shiny! You have a new sticker for your collection.", msgB: "✅ Stickers are cool, but having extra stars is cooler!" },
        { q: "You earned 8⭐ helping clean up! Save it or spend on snacks (3⭐)?", optA: ["Spend on Snacks", 3], optB: ["Save All", 0], msgA: "❌ Snack attack! You enjoyed the treat, but saved 5 stars.", msgB: "✅ Great job! You saved all 8 stars for your future fund." },
        { q: "Ice cream truck! Spend 5⭐ or skip it?", optA: ["Buy Ice Cream", 5], optB: ["Skip It", 0], msgA: "❌ Sweet! Ice cream is a great reward for hard work.", msgB: "✅ Determination! You resisted the truck to keep your stars growing." },
        { q: "New card game for 8⭐. Buy it or pass?", optA: ["Buy Game", 8], optB: ["Pass", 0], msgA: "❌ Let's play! A new game is fun, but it was a big purchase.", msgB: "✅ You passed on the game to keep your star count high. Smart!" },
        { q: "Friend's birthday gift — spend 4⭐ or make something free?", optA: ["Nice Gift", 4], optB: ["Homemade", 0], msgA: "❌ Thoughtful! You bought a nice gift to celebrate your friend.", msgB: "✅ Creative! Your friend loved the handmade gift and you saved stars." },
        { q: "New pencils for 3⭐?", optA: ["Buy", 3], optB: ["Save", 0], msgA: "❌ Ready for school! You have fresh tools for your desk.", msgB: "✅ You decided to use your old pencils and keep your stars." },
        { q: "Candy bar for 2⭐?", optA: ["Buy", 2], optB: ["Save", 0], msgA: "❌ A quick treat! It didn't cost much, but stars add up.", msgB: "✅ One less candy bar means you're closer to a bigger prize!" },
        { q: "Final challenge: Big Star Box for 12⭐?", optA: ["Buy", 12], optB: ["Save", 0], msgA: "❌ Grand Prize! You bought the big box with your hard-earned stars.", msgB: "✅ You're a master of saving! You finished with a huge star balance." },
      ],
      marketScenarios: [
        { q: "Lemonade Stand: Spend 10⭐ on lemons. Risk it for profit!", optA: ["Invest", 10], optB: ["Skip", 0], msgB: "⏭ You decided not to start the stand this time. Your stars stay safe." },
        { q: "Cookie Sale: Spend 15⭐ to bake. Will it pay off?", optA: ["Bake Cookies", 15], optB: ["Skip", 0], msgB: "⏭ You skipped the bake sale. No risk, but no chance for profit today." },
        { q: "Snow cone stand: Risk 12⭐ or save?", optA: ["Set Up", 12], optB: ["Save", 0], msgB: "⏭ You chose to save your stars instead of risking them on the stand." },
        { q: "Craft market: Spend 8⭐ on supplies.", optA: ["Try It", 8], optB: ["Skip", 0], msgB: "⏭ You decided to hold onto your craft supplies stars." },
        { q: "Tutoring: Invest 10⭐ in materials.", optA: ["Invest", 10], optB: ["Skip", 0], msgB: "⏭ You didn't invest in tutoring materials this time." },
        { q: "Pool cleaning: Spend 8⭐ on tools.", optA: ["Invest", 8], optB: ["Skip", 0], msgB: "⏭ You skipped the pool cleaning venture." },
        { q: "Yard Sale: 5⭐ for signs.", optA: ["Buy", 5], optB: ["Skip", 0], msgB: "⏭ No yard sale today. Stars remain in your piggy bank." },
        { q: "Dog walking: 4⭐ for leashes.", optA: ["Buy", 4], optB: ["Skip", 0], msgB: "⏭ You decided dog walking wasn't the right move today." },
        { q: "Plant sale: 6⭐ for seeds.", optA: ["Buy", 6], optB: ["Skip", 0], msgB: "⏭ You're keeping your seeds stars for now." },
        { q: "Final Venture: 20⭐ big project!", optA: ["Go Big", 20], optB: ["Play Safe", 0], msgB: "⏭ You finished the game with a cautious and steady approach." }
      ],
      savingScenarios: [
        { q: "Found 5⭐ under pillow. Save?", optA: ["Spend", 5], optB: ["Save", 0], msgA: "❌ You spent your pillow money! It's gone, but it was fun.", msgB: "✅ Great! That 5 stars is now earning interest in your bank." },
        { q: "Piggy bank full. 10⭐ toy?", optA: ["Buy", 10], optB: ["Save", 0], msgA: "❌ The toy is yours! But the piggy bank is empty.", msgB: "✅ Discipline! You're letting your money grow even bigger." },
        { q: "Found 5⭐. Save?", optA: ["Spend", 5], optB: ["Save", 0], msgA: "❌ Money spent is money gone! Hope the treat was worth it.", msgB: "✅ Building wealth! Every star counts." },
        { q: "Piggy bank full. 10⭐ toy?", optA: ["Buy", 10], optB: ["Save", 0], msgA: "❌ New toy alert! Your balance took a hit.", msgB: "✅ Patience pays! You are becoming a master saver." },
        { q: "Found 5⭐. Save?", optA: ["Spend", 5], optB: ["Save", 0], msgA: "❌ Spent! Your star balance decreased.", msgB: "✅ Saved! Your future self will thank you." },
        { q: "Piggy bank full. 10⭐ toy?", optA: ["Buy", 10], optB: ["Save", 0], msgA: "❌ You bought it! Time to start saving from zero.", msgB: "✅ Smart choice. Let that interest compound." },
        { q: "Found 5⭐. Save?", optA: ["Spend", 5], optB: ["Save", 0], msgA: "❌ Short term fun, long term cost.", msgB: "✅ A little bit saved today becomes a lot tomorrow." },
        { q: "Piggy bank full. 10⭐ toy?", optA: ["Buy", 10], optB: ["Save", 0], msgA: "❌ You treated yourself! Balance is now lower.", msgB: "✅ You are consistent! Your savings are booming." },
        { q: "Found 5⭐. Save?", optA: ["Spend", 5], optB: ["Save", 0], msgA: "❌ Gone! Keep an eye on your balance.", msgB: "✅ Savings growth! You earned extra interest." },
        { q: "Piggy bank full. 10⭐ toy?", optA: ["Buy", 10], optB: ["Save", 0], msgA: "❌ The grand prize toy! You spent your stash.", msgB: "✅ Legendary saver! You finished with a huge balance." },
      ]
    },
    adult: {
      currencySymbol: "$", startingCash: 1000, icon: "💼", themeColor: "#6366f1", gradient: "linear-gradient(135deg,#6366f1,#4f46e5)",
      winMultiplier: 0.7, saveWinMultiplier: 1.4, marketWinMultiplier: 1.25,
      scenarios: [
        { q: "Housing: $400 studio or $200 shared house?", optA: ["Luxury Studio", 400], optB: ["Shared House", 200], msgA: "❌ Privacy is great, but that extra $200 per month will be missed in your savings.", msgB: "✅ Smart move! Shared housing is the fastest way to build an emergency fund." },
        { q: "Commute: $140 Uber budget or $60 monthly bus pass?", optA: ["Uber Habits", 140], optB: ["Bus Pass", 60], msgA: "❌ Convenience costs! You're spending nearly 3x more than necessary on transport.", msgB: "✅ Excellent discipline. Public transit is a wealth-builder's secret weapon." },
        { q: "Food: $120 Organic Whole Foods or $50 Bulk Mart?", optA: ["Whole Foods", 120], optB: ["Bulk Mart", 50], msgA: "❌ Healthy, but expensive. Make sure your income can support these grocery bills.", msgB: "✅ Buying in bulk is a pro-move. You just saved $70 without skipping a meal." },
        { q: "Insurance: Pay $70/mo now or risk a $5000 bill later?", optA: ["Skip Insurance", 0], optB: ["Pay Premium", 70], msgA: "❌ You're 'self-insuring.' It works until it doesn't. Hope you have a big emergency fund!", msgB: "✅ Insurance is about risk management. You've protected yourself from financial ruin." },
        { q: "Streaming: $15 Basic or $95 Premium Cable Bundle?", optA: ["Cable TV", 95], optB: ["One Service", 15], msgA: "❌ The 'Cable Trap.' You're paying for 200 channels you'll never actually watch.", msgB: "✅ Cutting the cord! You saved $80 and still have plenty to watch." },
        { q: "Social: $80 Bar Night or $15 Board Game night?", optA: ["Clubbing", 80], optB: ["Game Night", 15], msgA: "❌ Expensive drinks add up fast. Your social life is currently your biggest expense.", msgB: "✅ Great memories for 1/5th the price. Low-cost social hobbies are key to staying rich." },
        { q: "Upgrade: $200 Phone Installment or keep old phone?", optA: ["New iPhone", 200], optB: ["Keep Old", 0], msgA: "❌ The shiny new object cost you $200. Does it really do anything your old one didn't?", msgB: "✅ Status is a trap. By keeping your old phone, you kept your cash working for you." },
        { q: "Lunch: $20 Daily takeout or $5 Meal prep?", optA: ["Takeout", 20], optB: ["Meal Prep", 5], msgA: "❌ The 'Latte Factor' in action. $20 a day is $600 a month on lunch alone.", msgB: "✅ Meal prepping is like giving yourself a $4,000 annual raise. Well done." },
        { q: "Gym: $100 Boutique CrossFit or $10 Basic Gym?", optA: ["CrossFit", 100], optB: ["Basic Gym", 10], msgA: "❌ Community is good, but $100/mo is a luxury membership. Use it every day to make it worth it!", msgB: "✅ A barbell weighs the same at a $10 gym. You're paying for results, not aesthetics." },
        { q: "Impulse: $50 'Limited Edition' Sneakers. Buy?", optA: ["Buy Them", 50], optB: ["Ignore", 0], msgA: "❌ Impulse buys are the enemy of a solid budget. They look good, but the bank account looks worse.", msgB: "✅ Discipline! You walked away and your net worth stayed intact." },
      ],
      marketScenarios: [
        { q: "Penny Stock: $200 in 'BioTech X'. Very volatile!", optA: ["Buy In", 200], optB: ["Skip", 0], msgB: "⏭ You avoided the high-risk gamble. Stability is its own reward." },
        { q: "Blue Chip: $400 in Apple shares. Solid but slower growth.", optA: ["Invest", 400], optB: ["Skip", 0], msgB: "⏭ You passed on a reliable company. Sometimes cash is king." },
        { q: "Index Fund: $300 in S&P 500. Balanced risk.", optA: ["Buy Fund", 300], optB: ["Skip", 0], msgB: "⏭ You skipped the broad market. You're betting on your own timing." },
        { q: "IPO: $350 in a trendy new social media app.", optA: ["Buy IPO", 350], optB: ["Skip", 0], msgB: "⏭ IPOs are often overhyped. You played it safe." },
        { q: "Commodities: $250 in Crude Oil futures.", optA: ["Trade Oil", 250], optB: ["Skip", 0], msgB: "⏭ Commodity trading is complex. You decided to sit this one out." },
        { q: "Real Estate: $450 in a REIT. Reliable dividends?", optA: ["Invest", 450], optB: ["Skip", 0], msgB: "⏭ Dividends are nice, but you chose to keep your liquidity." },
        { q: "Tech: $300 in AI Semiconductors. Huge hype.", optA: ["Buy AI", 300], optB: ["Skip", 0], msgB: "⏭ Hype cycles can be dangerous. You avoided the potential bubble." },
        { q: "Bonds: $150 in Treasury Notes. Very safe.", optA: ["Buy Bonds", 150], optB: ["Skip", 0], msgB: "⏭ Safety is good, but you're skipping the (small) guaranteed return." },
        { q: "Energy: $200 in Solar Power startup.", optA: ["Go Green", 200], optB: ["Skip", 0], msgB: "⏭ Green energy is the future, but startups are risky. You passed." },
        { q: "Arbitrage: $400 in a complex currency swap.", optA: ["Execute", 400], optB: ["Skip", 0], msgB: "⏭ You avoided a complicated trade. Keeping it simple is a valid strategy." }
      ],
      cryptoScenarios: [
        { q: "Memecoin: $300 in 'DogePluto'. 1000x or zero.", optA: ["Ape In", 300], optB: ["Skip", 0], msgB: "⏭ You avoided the 'rug pull' risk. Solid discipline." },
        { q: "DeFi: $400 in a Yield Farm. 40% APY but risky code.", optA: ["Farm", 400], optB: ["Skip", 0], msgB: "⏭ 40% returns usually mean 40% risk. You played it safe." },
        { q: "Bitcoin: $500 in the King. Stable (for crypto).", optA: ["Buy BTC", 500], optB: ["Skip", 0], msgB: "⏭ Even the 'safe' crypto is volatile. You kept your cash." },
        { q: "NFT: $250 for a digital Bored Cat. Trend is dying.", optA: ["Buy NFT", 250], optB: ["Skip", 0], msgB: "⏭ Buying at the top of a trend is dangerous. Good skip." },
        { q: "Altcoin: $200 in Solana ecosys.", optA: ["Buy SOL", 200], optB: ["Skip", 0], msgB: "⏭ You avoided the altcoin casino this time." },
        { q: "Mining: $400 in ASIC hardware.", optA: ["Invest", 400], optB: ["Skip", 0], msgB: "⏭ Electricity costs and hardware rot are real. You passed." },
        { q: "Web3: $300 in ENS domain names.", optA: ["Ape", 300], optB: ["Skip", 0], msgB: "⏭ Speculating on digital names is a gamble. You stayed out." },
        { q: "DEX: $350 in liquidity providing.", optA: ["Provide", 350], optB: ["Skip", 0], msgB: "⏭ Impermanent loss is a real threat. You kept your tokens." },
        { q: "Gaming: $200 in Play-to-earn tokens.", optA: ["Play", 200], optB: ["Skip", 0], msgB: "⏭ Crypto games often crash hard. You avoided the trap." },
        { q: "Layer 2: $300 in Arbitrum ecosystem.", optA: ["Invest", 300], optB: ["Skip", 0], msgB: "⏭ The tech is great, but the market is wild. You stayed in cash." },
      ],
      savingScenarios: [
        { q: "Bonus: $200 bonus. Save or Spend?", optA: ["Splurge", 200], optB: ["Save It", 0], msgA: "❌ You treated yourself! The bonus is gone, but you're happy.", msgB: "✅ Pro move! That $200 is now the seed of your future wealth." },
        { q: "Found Cash: $50 in jacket. Treat or Piggy Bank?", optA: ["Fancy Meal", 50], optB: ["Save It", 0], msgA: "❌ Delicious! But that $50 won't be earning interest anymore.", msgB: "✅ Found money is the best money to save. Net worth +$50!" },
        { q: "Refund: $80 check from IRS. Save or Spend?", optA: ["New Tech", 80], optB: ["Save It", 0], msgA: "❌ New gadgets are cool, but they lose value instantly.", msgB: "✅ You're returning that money to your own future. Smart." },
        { q: "Cash Back: $40 earned. Save or Spend?", optA: ["Takeout", 40], optB: ["Save It", 0], msgA: "❌ You spent your rewards! It's like you never got them.", msgB: "✅ Compounding your rewards is how you really win the game." },
        { q: "Gift: $100 from Grandma. Save or Spend?", optA: ["Shopping", 100], optB: ["Save It", 0], msgA: "❌ Shopping spree! Grandma's gift is now a new outfit.", msgB: "✅ Grandma would be proud of your financial discipline." },
        { q: "Dividend: $30 paid out. Save or Spend?", optA: ["Movie Night", 30], optB: ["Save It", 0], msgA: "❌ You spent your passive income. It's a fun cycle!", msgB: "✅ Reinvesting dividends is the secret to getting truly rich." },
        { q: "Side Gig: $150 earned. Save or Spend?", optA: ["Night Out", 150], optB: ["Save It", 0], msgA: "❌ Work hard, play hard! You spent your extra earnings.", msgB: "✅ You turned your labor into long-term capital. Exceptional." },
        { q: "Garage Sale: $60 earned. Save or Spend?", optA: ["Gadgets", 60], optB: ["Save It", 0], msgA: "❌ Turned old stuff into new stuff. Balance: Neutral.", msgB: "✅ You turned clutter into cash and cash into savings. Perfect." },
        { q: "Rebate: $25 back. Save or Spend?", optA: ["Lunch", 25], optB: ["Save It", 0], msgA: "❌ Spent! The rebate didn't last long.", msgB: "✅ Every $25 counts when it's earning compound interest." },
        { q: "Interest: $10 earned. Save or Spend?", optA: ["Small Treat", 10], optB: ["Save It", 0], msgA: "❌ You spent the interest your money made. Growth: Slow.", msgB: "✅ You're letting your interest make its own interest. You're winning." },
      ],
      creditScenarios: [
        { q: "Credit Score: Pay $100 off card to boost score?", optA: ["Keep Cash", 0], optB: ["Pay Card", 100], msgA: "❌ You have more cash now, but your credit score might drop.", msgB: "✅ Investing in your score saves you thousands in future interest." },
        { q: "Bad Debt: Friend wants $200 loan for 'sure thing'.", optA: ["Lend It", 200], optB: ["Decline", 0], msgA: "❌ Lending to friends often means losing money and the friend.", msgB: "✅ Wise. Never lend more than you can afford to lose forever." },
        { q: "Balance: Pay $150 minimum or keep cash?", optA: ["Keep Cash", 0], optB: ["Pay Balance", 150], msgA: "❌ The interest on that remaining balance is going to be high.", msgB: "✅ Great job. Staying ahead of the minimum keeps you out of the debt trap." },
        { q: "Interest: Card has 24% APR. Pay $300 now?", optA: ["Wait", 0], optB: ["Pay Debt", 300], msgA: "❌ 24% interest is a financial emergency. Paying it later is costly.", msgB: "✅ Excellent! You just avoided the highest interest rate 'tax' there is." },
        { q: "Late Fee: $35 due. Pay now or later?", optA: ["Later", 0], optB: ["Pay Fee", 35], msgA: "❌ Late fees compound and wreck your credit history. Dangerous.", msgB: "✅ Stopping the bleeding. Always pay fees the moment they appear." },
        { q: "Financing: $500 for a couch @ 0%. Pay now?", optA: ["Finance", 0], optB: ["Pay Cash", 500], msgA: "❌ 0% is great, but don't forget the payments. It's still debt!", msgB: "✅ Zero debt is the ultimate peace of mind. Couch is yours, free and clear." },
        { q: "Limit: Increase limit or stay safe?", optA: ["Increase", 0], optB: ["Stay safe", 0], msgA: "❌ A higher limit can help your score, but only if you don't spend it!", msgB: "✅ Knowing your limits is a key part of financial self-awareness." },
        { q: "Rewards: Spend $100 to get $20 back?", optA: ["Spend", 100], optB: ["Save", 0], msgA: "❌ Spending $100 to 'save' $20 is a net loss of $80. Retail trap!", msgB: "✅ You didn't fall for the 'spending for rewards' trick. Nice." },
        { q: "Annual Fee: $95 card fee. Pay or cancel?", optA: ["Pay Fee", 95], optB: ["Cancel", 0], msgA: "❌ Make sure the benefits of the card outweigh that $95 price tag.", msgB: "✅ If the perks don't pay for the fee, canceling is the right move." },
        { q: "Identity: Pay $10 for monitoring?", optA: ["Skip", 0], optB: ["Pay", 10], msgA: "❌ Risk vs Reward. You're betting that your identity stays safe.", msgB: "✅ A small price for massive peace of mind in a digital world." },
      ],
      hustleScenarios: [
        { q: "Equipment: $300 for pro camera.", optA: ["Buy Pro", 300], optB: ["Use Phone", 0], msgA: "❌ High quality brings high-paying clients, but you're $300 in the hole.", msgB: "✅ Starting lean is smart. Most pros start with what they already have." },
        { q: "Ads: $100 for Instagram ads.", optA: ["Run Ads", 100], optB: ["Organic", 0], msgA: "❌ Ads buy you time and visibility. Let's see if the leads follow.", msgB: "✅ Organic growth is slower, but your profit margins remain 100%." },
        { q: "Software: $50/mo subscription.", optA: ["Subscribe", 50], optB: ["Free version", 0], msgA: "❌ Pro tools speed up your work. Time is money in a hustle.", msgB: "✅ Good choice for now. Don't add fixed costs until you have fixed income." },
        { q: "Networking: $40 event ticket.", optA: ["Attend", 40], optB: ["Skip", 0], msgA: "❌ One connection could be worth $4,000. Hustling is about people.", msgB: "✅ You saved $40, but you might have missed a key partnership." },
        { q: "Outsourcing: $80 for logo design.", optA: ["Hire", 80], optB: ["DIY", 0], msgA: "❌ A pro logo builds trust instantly. You look like a real brand now.", msgB: "✅ DIY is fine for day one. Just don't let bad design hurt your sales." },
        { q: "Stock: $200 in raw materials.", optA: ["Bulk Buy", 200], optB: ["Buy small", 50], msgA: "❌ Bulk buying lowers your cost per unit. This is how you scale.", msgB: "✅ Lower risk, but your profit per item will be much smaller." },
        { q: "Shipping: $30 for faster courier.", optA: ["Expedited", 30], optB: ["Standard", 10], msgA: "❌ Happy customers are repeat customers. Speed matters.", msgB: "✅ Standard is fine, as long as you're honest about the timeline." },
        { q: "Legal: $150 to register LLC.", optA: ["Register", 150], optB: ["Stay Sole", 0], msgA: "❌ Liability protection is huge. You're a legitimate business owner now.", msgB: "✅ Fine for a side gig, but be careful with your personal assets." },
        { q: "Space: $100 for shared desk.", optA: ["Rent", 100], optB: ["Work Home", 0], msgA: "❌ No distractions! Productivity is usually higher in a pro space.", msgB: "✅ Zero rent is the best way to keep your hustle profitable early on." },
        { q: "Final push: $250 for a trade show.", optA: ["Ape In", 250], optB: ["Skip", 0], msgA: "❌ Big risk, big reward! You're putting your brand in front of thousands.", msgB: "✅ You finished with a healthy profit and a low-risk mindset." },
      ]
    }
  };

  const config = tierSettings[userTier] || tierSettings.adult;
  const scenarios = activeGame === 'Market' ? config.marketScenarios : activeGame === 'Crypto' ? config.cryptoScenarios : activeGame === 'Save' ? config.savingScenarios : activeGame === 'Credit' ? config.creditScenarios : activeGame === 'Hustle' ? config.hustleScenarios : config.scenarios;

  const calculateTotalWealth = useCallback(() => {
    let stockValue = 0;
    blitzStocks.forEach(s => stockValue += (portfolio[s.id] || 0) * s.price);
    return money + stockValue;
  }, [money, blitzStocks, portfolio]);

  const endBlitzCompetition = useCallback(() => {
    const finalWealth = calculateTotalWealth();
    setMoney(finalWealth);
    const insight = generateGameInsight('Blitz', gameStats, finalWealth, gameStats.startMoney, config);
    setTradeMessage(insight);
    setGameResult('report');
    if (onGameEnd) onGameEnd(finalWealth >= gameStats.startMoney ? 'won' : 'lost');
  }, [calculateTotalWealth, gameStats, config, onGameEnd]);

  // High-performance timer/logic engine
  useEffect(() => {
    let interval;
    if (playing && activeGame === 'Blitz' && timeLeft > 0) {
      interval = setInterval(() => {
        // Update prices once per second irl
        setBlitzStocks(current => current.map(s => {
          const marketSentiment = Math.random() - 0.5;
          const newPrice = updateStockPrice(s, marketSentiment);
          return { ...s, price: newPrice, history: [...s.history.slice(-14), newPrice] };
        }));
        
        // Timer countdown once per second irl
        setTimeLeft(t => Math.max(0, t - 1));
      }, 1000);
    } else if (timeLeft === 0 && playing && activeGame === 'Blitz') {
      endBlitzCompetition();
    }
    return () => clearInterval(interval);
  }, [playing, activeGame, timeLeft, endBlitzCompetition]);

  // Logic to broadcast/receive wealth data
  useEffect(() => {
    if (playing && activeGame === 'Blitz' && selectedLeague) {
      const myWealth = calculateTotalWealth();
      localStorage.setItem(`FIN_SYNC_LEAGUE_${selectedLeague.id}_USER_${currentUser}`, myWealth.toString());

      const currentLeagueData = JSON.parse(localStorage.getItem("FIN_LEAGUES_GLOBAL") || "[]").find(l => l.id === selectedLeague.id);
      if (currentLeagueData) {
        const liveOpponents = currentLeagueData.players
          .filter(p => p !== currentUser)
          .map(p => ({
            name: p,
            wealth: parseFloat(localStorage.getItem(`FIN_SYNC_LEAGUE_${selectedLeague.id}_USER_${p}`) || "1000")
          }));
        setOpponents(liveOpponents);
      }
      const feedKey = `FIN_SYNC_FEED_${selectedLeague.id}`;
      setLeagueFeed(JSON.parse(localStorage.getItem(feedKey) || "[]"));
    }
  }, [blitzStocks, money, portfolio, playing, activeGame, selectedLeague, currentUser, calculateTotalWealth]);

  const resetGame = (countAsPlayed = false) => {
    if (countAsPlayed && onGameEnd) onGameEnd('lost');
    setPlaying(false); setGameResult(null); setActiveGame(null); setMoney(0); moneyRef.current = 0; setDay(1); setTradeMessage(null); setWaitingNext(false); setView('menu'); setGameStats({ buys: 0, sells: 0, startMoney: 0 });
  };

  const endGame = (finalMoney) => {
    const winThreshold = (activeGame === 'Market' || activeGame === 'Crypto') ? config.startingCash * config.marketWinMultiplier : activeGame === 'Save' ? config.startingCash * config.saveWinMultiplier : config.startingCash * config.winMultiplier;
    const won = finalMoney >= winThreshold;
    const insight = generateGameInsight(activeGame, gameStats, finalMoney, gameStats.startMoney || config.startingCash, config);
    setTradeMessage(insight);
    setMoney(finalMoney); 
    setGameResult(won ? 'won' : 'lost');
    if (onGameEnd) onGameEnd(won ? 'won' : 'lost');
  };

  const handleNextStep = () => {
    const currentMoney = moneyRef.current;
    if (currentMoney <= 0) {
      setGameResult('lost');
    } else if (day >= scenarios.length) {
      endGame(currentMoney);
    } else {
      setDay(d => d + 1);
      setTradeMessage(null);
    }
    setWaitingNext(false);
  };

  const handleChoice = (cost, feedbackMsg) => {
    let updated;
    if (activeGame === 'Save') {
      updated = (cost === 0) ? money + Math.max(10, Math.round(config.startingCash * 0.1)) : money - cost;
    } else {
      updated = money - cost;
    }
    setMoney(updated);
    moneyRef.current = updated;
    setTradeMessage(feedbackMsg);
    setWaitingNext(true);
  };

  const handleMarketChoice = (opt, scenarioIdx) => {
    if (waitingNext) return;
    const amount = opt[1];
    if (amount === 0) { 
      const currentScenario = scenarios[scenarioIdx];
      setTradeMessage(currentScenario.msgB || `⏭ Skipped trade.`); 
      setWaitingNext(true); 
      return; 
    }
    const success = Math.random() < (activeGame === 'Crypto' ? 0.38 : 0.48);
    const currentMoney = moneyRef.current;
    let newMoney, msg;
    if (success) {
      const profit = Math.max(10, Math.round(amount * (0.5 + Math.random() * (activeGame === 'Crypto' ? 2.5 : 1.8))));
      newMoney = currentMoney + profit; msg = `✅ +${config.currencySymbol}${profit} PROFIT! ${STOCK_WIN_REASONS[Math.floor(Math.random() * STOCK_WIN_REASONS.length)]}`;
      setGameStats(s => ({ ...s, buys: s.buys + 1 }));
    } else {
      const loss = Math.round(amount * (0.6 + Math.random() * (activeGame === 'Crypto' ? 1.0 : 0.8)));
      newMoney = Math.max(0, currentMoney - loss); msg = `❌ -${config.currencySymbol}${loss} LOSS. ${STOCK_FAIL_REASONS[Math.floor(Math.random() * STOCK_FAIL_REASONS.length)]}`;
      setGameStats(s => ({ ...s, sells: s.sells + 1 }));
    }
    moneyRef.current = newMoney; 
    setMoney(newMoney); 
    setTradeMessage(msg); 
    setWaitingNext(true);
  };

  const handleCreateLeague = () => {
    if (!newLeagueName) return;
    const code = Math.random().toString(36).substring(7).toUpperCase();
    const newL = { id: Date.now().toString(), name: newLeagueName, players: [currentUser], code, activeMatch: false, visibility: leaguePrivacy, createdBy: currentUser };
    const updated = [newL, ...leagues];
    localStorage.setItem("FIN_LEAGUES_GLOBAL", JSON.stringify(updated));
    setLeagues(updated);
    setNewLeagueName("");
    alert(`League Created! Code: ${code}`);
  };

  const handleJoinLeague = () => {
    const target = joinCode.toUpperCase();
    const globalLeagues = JSON.parse(localStorage.getItem("FIN_LEAGUES_GLOBAL") || "[]");
    const foundIdx = globalLeagues.findIndex(l => l.code.toUpperCase() === target);
    if (foundIdx !== -1) {
      const updatedPlayers = Array.from(new Set([...globalLeagues[foundIdx].players, currentUser]));
      globalLeagues[foundIdx].players = updatedPlayers;
      localStorage.setItem("FIN_LEAGUES_GLOBAL", JSON.stringify(globalLeagues));
      const fresh = JSON.parse(localStorage.getItem("FIN_LEAGUES_GLOBAL") || "[]");
      setLeagues(fresh);
      const leagueObj = fresh.find(l => l.code.toUpperCase() === target);
      setSelectedLeague(leagueObj);
      setView('leagueDetail');
    } else {
      alert("Invalid League Code!");
    }
  };

  const handleDeleteLeague = (id) => {
    if (!window.confirm("Delete this league forever?")) return;
    const updated = leagues.filter(l => l.id !== id);
    localStorage.setItem("FIN_LEAGUES_GLOBAL", JSON.stringify(updated));
    setLeagues(updated);
    if (selectedLeague && selectedLeague.id === id) setView('leagues');
  };

  const handleBlitzTrade = (stockId, action) => {
    const stock = blitzStocks.find(s => s.id === stockId);
    if (!stock) return;
    if (action === 'buy') {
      const cost = Math.round(stock.price);
      if (money >= cost) {
        setMoney(money - cost);
        setPortfolio(prev => ({ ...prev, [stockId]: (prev[stockId] || 0) + 1 }));
        setGameStats(s => ({ ...s, buys: s.buys + 1 }));
        setTradeMessage(`✅ Bought 1 share of ${stock.id} at $${cost}`);
      } else {
        setTradeMessage(`❌ Insufficient funds. Need $${cost}, have $${Math.round(money)}`);
      }
    } else if (action === 'sell') {
      if (portfolio[stockId] > 0) {
        const proceeds = Math.round(stock.price);
        setMoney(money + proceeds);
        setPortfolio(prev => ({ ...prev, [stockId]: prev[stockId] - 1 }));
        setGameStats(s => ({ ...s, sells: s.sells + 1 }));
        setTradeMessage(`✅ Sold 1 share of ${stock.id} for $${proceeds}`);
      } else {
        setTradeMessage(`❌ You don't own any shares of ${stock.id}`);
      }
    }
  };

  const YahooFinancePopup = ({ stock, onClose }) => {
    if (!stock) return null;
    return (
      <div style={gS.modalOverlay}>
        <div style={gS.modalContent}>
          <div style={gS.modalHeader}>
            <div><h1 style={{margin:0, fontSize:'28px'}}>{stock.name} ({stock.id})</h1><span style={{fontSize:'14px', color:'#64748b'}}>{stock.sector} • NasdaqGS</span></div>
            <button style={gS.closeBtn} onClick={onClose}>✕</button>
          </div>
          <div style={gS.modalPriceRow}>
            <div style={{fontSize:'48px', fontWeight:'900'}}>${stock.price.toFixed(2)}</div>
            <div style={{color: stock.prevClose < stock.price ? '#10b981' : '#ef4444', fontWeight:'bold', fontSize:'20px'}}>
              {stock.prevClose < stock.price ? '+' : ''}{(stock.price - stock.prevClose).toFixed(2)} ({((stock.price - stock.prevClose)/stock.prevClose*100).toFixed(2)}%)
            </div>
          </div>
          <div style={gS.modalGrid}>
            <div style={gS.modalColumn}>
              <div style={gS.modalStat}><span>Previous Close</span><strong>{stock.prevClose}</strong></div>
              <div style={gS.modalStat}><span>Open</span><strong>{stock.open}</strong></div>
              <div style={gS.modalStat}><span>Bid</span><strong>{stock.bid}</strong></div>
              <div style={gS.modalStat}><span>Ask</span><strong>{stock.ask}</strong></div>
              <div style={gS.modalStat}><span>52 Week Range</span><strong>{stock.range52}</strong></div>
            </div>
            <div style={gS.modalColumn}>
              <div style={gS.modalStat}><span>Market Cap</span><strong>{stock.marketCap}</strong></div>
              <div style={gS.modalStat}><span>PE Ratio (TTM)</span><strong>{stock.pe}</strong></div>
              <div style={gS.modalStat}><span>EPS (TTM)</span><strong>{stock.eps}</strong></div>
              <div style={gS.modalStat}><span>Earnings Date</span><strong>{stock.earnings}</strong></div>
              <div style={gS.modalStat}><span>1y Target Est</span><strong>{stock.targetEst}</strong></div>
            </div>
          </div>
          <div style={gS.modalChartArea}>
            <svg width="100%" height="150" viewBox="0 0 400 100" preserveAspectRatio="none">
              <polyline fill="none" stroke="#6366f1" strokeWidth="3" points={stock.history.map((d, i) => `${(i / (stock.history.length - 1)) * 400},${100 - ((d - Math.min(...stock.history)) / (Math.max(...stock.history) - Math.min(...stock.history))) * 100}`).join(" ")} />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  if (gameResult) {
    const isWin = gameResult === 'won' || gameResult === 'report';
    return (
      <div style={gS.resultContainer}>
        <div style={{ ...gS.resultCard, background: isWin ? 'linear-gradient(135deg,#064e3b,#059669)' : 'linear-gradient(135deg,#4c0519,#be123c)' }}>
          <div style={gS.resultEmoji}>{isWin ? '🏆' : '💔'}</div>
          <h1 style={gS.resultTitle}>{gameResult === 'report' ? 'FINAL RECAP' : (isWin ? 'YOU WON!' : 'GAME OVER')}</h1>
          <div style={gS.resultDetails}><div style={gS.statRow}><span>Final Wealth</span><strong style={{ fontSize:'22px' }}>${Math.round(money)}</strong></div><div style={gS.statRow}><span>Insight</span><strong>{tradeMessage || "Finished"}</strong></div></div>
          <button style={{ ...gS.actionBtn, color: isWin ? '#059669' : '#be123c' }} onClick={() => resetGame()}>Continue</button>
        </div>
      </div>
    );
  }

  if (playing) {
    if (activeGame === 'Blitz') {
      return (
        <div style={{ ...gS.pageWrapper, padding: '20px', background: '#0f172a' }}>
          {activePopupStock && <YahooFinancePopup stock={activePopupStock} onClose={() => setActivePopupStock(null)} />}
          {vocabPopup.visible && (
            <div ref={vocabRef} style={{ ...gS.vocabPopup, top: vocabPopup.y + 15, left: vocabPopup.x + 15 }}>
              <div><strong>{VOCAB_HELPER[vocabPopup.key].split(':')[0]}</strong></div>
               <p style={{margin:'5px 0 0', fontSize:'12px'}}>{VOCAB_HELPER[vocabPopup.key].split(':')[1]}</p>
             </div>
           )}
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '250px 1fr 300px', gap: '20px' }}>
            <div style={{ background: '#1e293b', borderRadius: '16px', padding: '20px', color: '#fff' }}>
              <h3 style={{ margin: '0 0 15px', color: '#6366f1' }}>🏆 Standings</h3>
              <div style={gS.leaderRow}><span style={{color:'#facc15'}}>1. {currentUser} (You)</span> <span>${Math.round(calculateTotalWealth())}</span></div>
              {[...opponents].sort((a,b)=>b.wealth-a.wealth).map((o, i)=>(<div key={o.name} style={{...gS.leaderRow, borderBottom:'1px solid #334155'}}><span>{i+2}. {o.name}</span> <span>${Math.round(o.wealth)}</span></div>))}
              <h3 style={{ margin: '30px 0 15px', color: '#10b981' }}>📡 Activity Feed</h3>
              {leagueFeed.map((f, i) => <div key={i} style={{fontSize:'11px', marginBottom:'10px', color: '#94a3b8'}}>{f}</div>)}
            </div>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h2 style={{margin:0}}>Market Terminal</h2><div style={{fontSize:'20px', fontWeight:'900', color: '#ef4444'}}>⏳ {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}</div></div>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                <thead><tr style={{ textAlign: 'left', color: '#64748b', fontSize: '13px' }}>
                  <th onClick={(e) => handleVocabClick('ticker', e)} style={{cursor:'help', textDecoration:'underline'}}>Ticker (?)</th>
                  <th>Price</th>
                  <th onClick={(e) => handleVocabClick('sentiment', e)} style={{cursor:'help', textDecoration:'underline'}}>Sentiment (?)</th>
                  <th>Sector</th>
                </tr></thead>
                <tbody>{blitzStocks.map(s => (<tr key={s.id} onClick={()=>setSelectedStock(s)} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: selectedStock.id === s.id ? '#f8fafc' : 'none' }}>
                  <td onClick={(e) => { e.stopPropagation(); setActivePopupStock(s); }} style={{ padding: '15px 0', fontWeight: 'bold', color: '#6366f1', textDecoration:'underline' }}>{s.id}</td>
                  <td>${s.price.toFixed(2)}</td><td style={{ color: s.sentiment === 'Bullish' ? '#10b981' : (s.sentiment === 'Bearish' ? '#ef4444' : '#64748b') }}>{s.sentiment}</td><td>{s.sector}</td>
                </tr>))}</tbody>
              </table>
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}><h3 style={{margin:'0 0 15px'}}>{selectedStock.name} Analysis</h3><div style={{ display: 'flex', gap: '30px', marginBottom: '20px', fontSize: '14px' }}>
                  <span onClick={(e) => handleVocabClick('pe', e)} style={{cursor:'help', textDecoration:'underline'}}>P/E Ratio (?): <b>{selectedStock.pe}</b></span>
                  <span onClick={(e) => handleVocabClick('yield', e)} style={{cursor:'help', textDecoration:'underline'}}>Div Yield (?): <b>{selectedStock.yield}</b></span>
                  <span>Owned: <b>{portfolio[selectedStock.id]}</b></span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}><button onClick={() => handleBlitzTrade(selectedStock.id, 'buy')} style={{ ...gS.playBtn, background: '#10b981', flex: 1 }}>BUY</button><button onClick={() => handleBlitzTrade(selectedStock.id, 'sell')} style={{ ...gS.playBtn, background: '#ef4444', flex: 1 }}>SELL</button></div>
              </div>
            </div>
            <div style={{ background: '#1e293b', borderRadius: '16px', padding: '20px', color: '#fff' }}>
              <h3 style={{ margin: '0 0 15px', color: '#6366f1' }}>💼 Portfolio</h3><div style={{fontSize: '24px', fontWeight: '900', marginBottom: '20px'}}>${Math.round(calculateTotalWealth())}</div>
              <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '5px' }}>AVAILABLE CASH</div><div style={{ color: '#10b981', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>${Math.round(money)}</div>
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
          {tradeMessage && (<div style={{ ...gS.tradeMsg, background: tradeMessage.includes('✅') || tradeMessage.includes('🌟') ? '#d1fae5' : tradeMessage.includes('⏭') ? '#f1f5f9' : '#fee2e2', borderColor: tradeMessage.includes('✅') || tradeMessage.includes('🌟') ? '#6ee7b7' : '#fca5a5' }}>{tradeMessage}</div>)}
          {!waitingNext ? (
            <div style={gS.choiceRow}>
              <button style={{ ...gS.choiceBtn, background: themeGradient }} onClick={() => (activeGame === 'Market' || activeGame === 'Crypto') ? handleMarketChoice(currentScenario.optA, day - 1) : handleChoice(currentScenario.optA[1], currentScenario.msgA)}><span>{currentScenario.optA[0]}</span><b>{config.currencySymbol}{currentScenario.optA[1]}</b></button>
              <button style={gS.choiceBtnSecondary} onClick={() => (activeGame === 'Market' || activeGame === 'Crypto') ? handleMarketChoice(currentScenario.optB, day - 1) : handleChoice(currentScenario.optB[1], currentScenario.msgB)}><span>{currentScenario.optB[0]}</span><span style={{color:'#64748b'}}>{currentScenario.optB[1] > 0 ? `${config.currencySymbol}${currentScenario.optB[1]}` : 'FREE'}</span></button>
            </div>
          ) : (
            <button style={{ ...gS.playBtn, background: themeGradient, marginTop: '10px' }} onClick={handleNextStep}>Next Decision →</button>
          )}
        </div>
        <button onClick={() => resetGame(true)} style={gS.quitBtn}>Quit game</button>
      </div>
    );
  }

  if (view === 'leagues') {
    return (
      <div style={gS.menuContainer}>
        <button onClick={() => setView('menu')} style={gS.backBtn}>← Back</button>
        <div style={{...gS.joinBox, background:'#eef2ff', border:'2px solid #6366f1', flexDirection:'column', alignItems:'flex-start'}}>
          <h3 style={{margin:0}}>Tournament Hub & Private Hubs</h3>
          <p style={{fontSize:'12px', color:'#6366f1', marginBottom:'15px'}}>Create or join private classroom tournaments with unique codes.</p>
          <div style={{display:'flex', gap:'10px', width:'100%', marginBottom:'20px'}}>
            <input style={gS.joinInput} placeholder="New League Name..." value={newLeagueName} onChange={e => setNewLeagueName(e.target.value)} />
            <select style={gS.joinInput} value={leaguePrivacy} onChange={e => setLeaguePrivacy(e.target.value)}><option value="public">Open/Public</option><option value="private">Private Only</option></select>
            <button style={gS.joinBtn} onClick={handleCreateLeague}>Create</button>
          </div>
          <div style={{width:'100%', borderTop:'1px solid #d1d5db', paddingTop:'15px'}}>
            <label style={{fontSize:'11px', fontWeight:'900', color:'#475569', display:'block', marginBottom:'8px'}}>INPUT LEAGUE JOIN CODE</label>
            <p style={{fontSize:'12px', color:'#64748b', marginBottom:'10px'}}>Join a private hub via code.</p>
            <div style={{display:'flex', gap:'10px'}}><input style={gS.joinInput} placeholder="e.g. ECON1" value={joinCode} onChange={e => setJoinCode(e.target.value)} /><button style={gS.joinBtn} onClick={handleJoinLeague}>Join</button></div>
          </div>
        </div>
        <h2 style={{margin:'40px 0 20px'}}>Open Arena (Public)</h2>
        <div style={gS.gamesGrid}>{leagues.filter(l => l.visibility === 'public').map(l => (<div key={l.id} style={gS.leagueCard} onClick={() => { setSelectedLeague(l); setView('leagueDetail'); }}><div style={gS.leagueIcon}>🏫</div><div><strong>{l.name}</strong><br/><span style={{fontSize:'12px'}}>Code: {l.code} • {l.players.length} Players</span></div><div style={{marginLeft:'auto', display:'flex', gap:'8px'}}><button onClick={(e)=>{e.stopPropagation(); navigator.clipboard.writeText(l.code); alert('Copied!');}} style={gS.copyBtn}>Copy Code</button>{l.createdBy === currentUser && <button onClick={(e)=>{e.stopPropagation(); handleDeleteLeague(l.id);}} style={{...gS.copyBtn, background:'#fee2e2', color:'#ef4444'}}>Delete</button>}</div></div>))}</div>
        <h2 style={{margin:'40px 0 20px'}}>My Hubs</h2>
        <div style={gS.gamesGrid}>{leagues.filter(l => (l.createdBy === currentUser || l.players.includes(currentUser)) && l.visibility !== 'public').map(l => (<div key={l.id} style={{...gS.leagueCard, border:'2px solid #6366f1'}} onClick={() => { setSelectedLeague(l); setView('leagueDetail'); }}><div style={gS.leagueIcon}>{l.createdBy === currentUser ? '🔒' : '🤝'}</div><div><strong>{l.name} {l.createdBy === currentUser ? '(Owner)' : '(Member)'}</strong><br/><span style={{fontSize:'12px'}}>Code: {l.code}</span></div><div style={{marginLeft:'auto', display:'flex', gap:'8px'}}><button onClick={(e)=>{e.stopPropagation(); navigator.clipboard.writeText(l.code); alert('Copied!');}} style={gS.copyBtn}>Copy Code</button>{l.createdBy === currentUser && <button onClick={(e)=>{e.stopPropagation(); handleDeleteLeague(l.id);}} style={{...gS.copyBtn, background:'#fee2e2', color:'#ef4444'}}>Delete</button>}</div></div>))}</div>
      </div>
    );
  }

  if (view === 'leagueDetail') {
    return (
      <div style={gS.menuContainer}><button onClick={() => setView('leagues')} style={gS.backBtn}>← All Leagues</button><div style={gS.leagueBanner}><h1 style={{margin:0}}>{selectedLeague.name}</h1><p>Competition Logged as: {currentUser}</p></div>
        <div style={gS.leagueLayout}><div style={gS.leaderboard}><h3 style={{marginTop:0}}>Live Leaderboard</h3>{selectedLeague.players.map((p, i) => (<div key={p} style={gS.leaderRow}><span>{i+1}. {p} {p === currentUser ? '(You)' : ''}</span><span style={{fontWeight:'bold'}}>${Math.round(parseFloat(localStorage.getItem(`FIN_SYNC_LEAGUE_${selectedLeague.id}_USER_${p}`) || 1000))}</span></div>))}</div>
          <div style={gS.leagueActions}><div style={gS.activeMatchCard}><h3>Blitz Stock Simulation</h3><button style={{...gS.playBtn, background: '#6366f1', width:'100%', cursor:'pointer'}} onClick={() => { setMoney(config.startingCash); moneyRef.current = config.startingCash; setGameStats({buys:0, sells:0, startMoney: config.startingCash}); setPortfolio({ GIGA: 0, VOY: 0, MART: 0, SPY: 0, GLD: 0 }); setOpponents(selectedLeague.players.filter(p => p !== currentUser).map(name => ({ name, wealth: config.startingCash }))); setTimeLeft(600); setActiveGame('Blitz'); setPlaying(true); setView('menu'); }}>🚀 Start Match</button></div></div>
        </div>
      </div>
    );
  }

  const games = [
    { id:'Budget', icon:'📊', title:'Survival Budget', desc:'The cost of living is rising. Can you survive on a budget without going broke?', grad:'linear-gradient(135deg,#6366f1,#4f46e5)' },
    { id:'Market', icon:'📈', title:'Stock Master', desc:'Day trade high-volatility stocks. Can you beat the S&P 500 benchmark?', grad:'linear-gradient(135deg,#7c3aed,#6366f1)' },
    { id:'Crypto', icon:'🪙', title:'Crypto King', desc:'Wild swings and moon-shots. 10x your money or lose it all in one session.', grad:'linear-gradient(135deg,#0f172a,#334155)' },
    { id:'Save',   icon:'💰', title:'Savings Sprint', desc:'Compound interest is the 8th wonder of the world. Test your frugality.', grad:'linear-gradient(135deg,#10b981,#059669)' },
    { id:'Credit', icon:'💳', title:'Credit Crush', desc:'Navigate high-interest debt and credit scores while trying to stay afloat.', grad:'linear-gradient(135deg,#f43f5e,#e11d48)' },
    { id:'Hustle', icon:'🚀', title:'Side Hustle', desc:'Invest in equipment and marketing to launch a successful small business.', grad:'linear-gradient(135deg,#f59e0b,#d97706)' },
  ];

  return (
    <div style={gS.pageWrapper}><style>{`@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-8px); } 100% { transform: translateY(0px); } } .game-card:hover { transform: translateY(-10px); transition: 0.3s; } .scenario-entry { animation: slideUp 0.4s ease-out; } @keyframes slideUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } } `}</style>
      <div style={gS.menuContainer}><div style={gS.menuHeader}><h2 style={gS.menuTitle}>🎮 Financial Games</h2><p style={gS.menuSub}>Paths to freedom. (User: {currentUser})</p></div>
        <div style={gS.gamesGrid}>{games.map(g => (<div key={g.id} className="game-card" style={gS.gameCard} onClick={() => { setMoney(config.startingCash); moneyRef.current = config.startingCash; setDay(1); setActiveGame(g.id); setPlaying(true); setGameStats(s=>({...s, startMoney: config.startingCash})); }}><div style={{ ...gS.gameCardTop, background: g.grad }}><div style={{ fontSize:'42px', animation:'float 3s ease-in-out infinite' }}>{g.icon}</div><h3 style={{ margin:'12px 0 0', color:'#fff', fontSize:'20px', fontWeight:'900' }}>{g.title}</h3></div><div style={gS.gameCardBottom}><p style={gS.gameCardDesc}>{g.desc}</p><button style={{ ...gS.playBtn, background: g.grad }}>Play Mode</button></div></div>))}</div>
        <div style={gS.extraRow}><div style={gS.cardPromo} onClick={() => setView('leagues')}><div style={gS.promoTitle}>🏆 Classroom Leagues</div><p style={gS.promoText}>Live tournaments.</p><button style={gS.promoBtn}>Enter Leagues</button></div>
          <div style={gS.cardPromo}><div style={gS.promoTitle}>💼 Salary Simulator</div><p style={gS.promoText}>Career map.</p><button style={{ ...gS.promoBtn, background:'#10b981' }} onClick={() => onNavigate?.('Salary')}>Open</button></div>
        </div>
      </div>
    </div>
  );
}

const gS = {
  vocabPopup: { position:'fixed', zIndex:9999, background:'#fff', padding:'16px', borderRadius:'12px', width:'220px', boxShadow:'0 10px 30px rgba(0,0,0,0.2)', border:'1px solid #6366f1' },
  minBtn: { border:'none', background:'none', cursor:'pointer', fontSize:'16px', fontWeight:'bold' },
  modalOverlay: { position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10000, padding:'20px' },
  modalContent: { background:'#fff', width:'100%', maxWidth:'800px', borderRadius:'24px', padding:'32px', maxHeight:'90vh', overflowY:'auto' },
  modalHeader: { display:'flex', justifyContent:'space-between', marginBottom:'24px' },
  closeBtn: { background:'none', border:'none', fontSize:'24px', cursor:'pointer' },
  modalPriceRow: { display:'flex', alignItems:'baseline', gap:'20px', marginBottom:'30px' },
  modalGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'40px' },
  modalStat: { display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid #f1f5f9' },
  modalChartArea: { background:'#f8fafc', padding:'24px', borderRadius:'16px', marginTop:'30px' },
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
  choiceBtnSecondary: { display:'flex', justifyContent:'space-between', padding:'18px', borderRadius:'16px', border:'1px solid #e2e8f0', background:'#fff', cursor:'pointer', fontWeight:'700' },
  quitBtn: { display:'block', margin:'20px auto', background:'none', border:'none', color:'#94a3b8', fontWeight:'700', cursor:'pointer' },
  resultContainer: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' },
  resultCard: { maxWidth:'450px', width:'100%', padding:'40px', borderRadius:'32px', textAlign:'center', color:'#fff', boxShadow:'0 30px 60px rgba(0,0,0,0.2)' },
  resultEmoji: { fontSize:'70px', marginBottom:'16px' },
  resultTitle: { fontSize:'40px', fontWeight:'900', margin:'0 0 10px' },
  resultDetails: { background:'rgba(255,255,255,0.15)', padding:'24px', borderRadius:'20px', textAlign:'left', marginBottom:'24px' },
  statRow: { display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.1)' },
  actionBtn: { width:'100%', padding:'18px', borderRadius:'18px', border:'none', fontSize: '16px', fontWeight:'900', cursor:'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', transition: 'transform 0.2s', background: '#fff' },
  extraRow: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px', marginTop:'40px' },
  cardPromo: { background:'#fff', padding:'24px', borderRadius:'24px', boxShadow:'0 10px 20px rgba(0,0,0,0.05)', cursor:'pointer' },
  promoTitle: { fontSize:'19px', fontWeight:'900', marginBottom:'10px' },
  promoText: { fontSize:'14px', color:'#64748b', marginBottom:'16px' },
  promoBtn: { background:'#6366f1', color:'#fff', border:'none', padding:'10px 20px', borderRadius:'10px', fontWeight:'700', cursor:'pointer' },
  joinBox: { background:'#fff', padding:'30px', borderRadius:'24px', display:'flex', gap:'12px', marginBottom:'32px', boxShadow:'0 4px 15px rgba(0,0,0,0.05)' },
  joinInput: { flex:1, padding:'14px', borderRadius:'12px', border:'2px solid #e2e8f0', fontSize:'16px', fontWeight:'600' },
  joinBtn: { background:'#0f172a', color:'#fff', padding:'0 24px', borderRadius:'12px', border:'none', fontWeight:'800', cursor:'pointer' },
  copyBtn: { padding:'6px 12px', borderRadius:'8px', border:'1px solid #e2e8f0', background:'#f8fafc', fontSize:'11px', fontWeight:'bold', cursor:'pointer' },
  leagueCard: { background:'#fff', padding:'20px', borderRadius:'18px', display:'flex', alignItems:'center', gap:'15px', cursor:'pointer', border:'2px solid transparent' },
  leagueIcon: { fontSize:'30px', background:'#f1f5f9', width:'60px', height:'60px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'14px' },
  backBtn: { background:'none', border:'none', color:'#6366f1', fontWeight:'800', cursor:'pointer', marginBottom:'12px' },
  leagueBanner: { background:'#6366f1', color:'#fff', padding:'40px', borderRadius:'24px', marginBottom:'30px' },
  leagueLayout: { display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:'24px' },
  leaderboard: { background:'#fff', padding:'24px', borderRadius:'20px' },
  leaderRow: { display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid #f1f5f9' },
  activeMatchCard: { background:'#fff', padding:'30px', borderRadius:'20px', border:'3px solid #6366f1' }
};