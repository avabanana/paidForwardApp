import React, { useState, useRef, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// CONSTANTS & DATA
// ─────────────────────────────────────────────────────────────

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
  "A prominent hedge fund disclosed a large stake. Retail investors followed the signal.",
];

const VOCAB_HELPER = {
  ticker: "Ticker: A short 'nickname' for a company so traders can find it quickly without typing the whole name.",
  price: "Price: What it costs to buy exactly one share (one 'slice') of the company right now.",
  chart: "Chart: A line showing the path the stock price took. It helps you see if it's trending up or down.",
  sentiment: "Sentiment: The market's 'mood.' Bullish means people think it will go up; Bearish means they think it will fall.",
  sector: "Sector: The category the company belongs to, like 'Technology' or 'Energy'.",
  prevClose: "Prev Close: The very last price the stock sold for when the market closed yesterday.",
  open: "Open: The price the stock started at when the market first opened for business this morning.",
  bid: "Bid: The highest price a buyer is currently waiting in line to pay to buy this stock from you.",
  ask: "Ask: The lowest price a seller is currently willing to accept to sell this stock to you.",
  range52: "52-Week Range: The highest and lowest price the stock has reached over the last full year.",
  volume: "Volume: How many shares have been bought and sold by everyone today. High volume means a lot of activity!",
  marketCap: "Market Cap: The 'Total Price Tag' for the whole company. It's what it would cost to buy the entire business.",
  pe: "P/E Ratio: Tells you if a stock is 'expensive.' It compares the stock price to how much profit the company actually makes.",
  eps: "EPS: How much profit the company made for every single share of stock. Like a company's 'allowance' per share.",
  beta: "Beta: Measures 'jumpiness.' A high beta means the stock swings up and down much faster than the rest of the market.",
  earnings: "Earnings Date: The day the company officially tells the public how much money they made recently.",
  targetEst: "1y Target Est: A guess by professional experts on what the stock price will be worth one year from now."
};

const NPC_PERSONALITIES = {
  aggressive:  { buyChance: 0.55, sellChance: 0.25, maxShares: 3, label: "🔥 Aggressive" },
  conservative:{ buyChance: 0.25, sellChance: 0.40, maxShares: 1, label: "🛡️ Conservative" },
  balanced:    { buyChance: 0.38, sellChance: 0.32, maxShares: 2, label: "⚖️ Balanced" },
  yolo:        { buyChance: 0.65, sellChance: 0.15, maxShares: 4, label: "🎲 YOLO" },
};
const NPC_PERSONALITY_LIST = ["aggressive", "conservative", "balanced", "yolo"];

const INITIAL_STOCKS = [
  { id:"GIGA", name:"GigaSoft Tech",    price:250,  history:[240,245,238,252,248,255,250], sector:"Technology", pe:"45.2", sentiment:"Bullish", yield:"0.5%", prevClose:248.12, open:249.50, bid:"250.10 x 1200", ask:"250.45 x 800",  range52:"180.50 – 310.20", volume:"45.2M", marketCap:"2.4T",  beta:"1.45", eps:"5.12", earnings:"Oct 24, 2025", targetEst:"320.00", desc:"High-growth software giant specializing in Enterprise AI and Cloud Infrastructure.", basePrice:250, volatility:0.15, trend:0.02 },
  { id:"VOY",  name:"Voyager Energy",   price:85,   history:[82,84,86,85,87,86,85],       sector:"Energy",     pe:"9.4",  sentiment:"Neutral", yield:"6.2%", prevClose:84.50,  open:85.10,  bid:"84.90 x 400",   ask:"85.20 x 1100", range52:"62.00 – 95.40",   volume:"12.8M",marketCap:"450B",  beta:"0.85", eps:"8.90", earnings:"Nov 02, 2025", targetEst:"105.00", desc:"Traditional oil producer pivoting to offshore wind and hydrogen storage.", basePrice:85, volatility:0.10, trend:-0.01 },
  { id:"MART", name:"MegaMart Corp",    price:120,  history:[125,122,121,119,118,122,120], sector:"Retail",     pe:"18.2", sentiment:"Bearish", yield:"2.1%", prevClose:121.20, open:120.50, bid:"119.80 x 2000", ask:"120.10 x 1500",range52:"105.00 – 158.00", volume:"22.1M",marketCap:"890B",  beta:"1.10", eps:"4.25", earnings:"Sep 15, 2025", targetEst:"110.00", desc:"Global retail chain facing high labor costs and fierce e-commerce competition.", basePrice:120, volatility:0.12, trend:-0.03 },
  { id:"SPY",  name:"S&P Lite Index",   price:400,  history:[395,398,402,399,401,399,400], sector:"Index Fund", pe:"21.0", sentiment:"Bullish", yield:"1.8%", prevClose:399.10, open:400.00, bid:"400.05 x 5000", ask:"400.15 x 5000",range52:"350.00 – 460.00", volume:"85M",  marketCap:"N/A",  beta:"1.00", eps:"N/A", earnings:"N/A",          targetEst:"480.00", desc:"A basket of the 500 largest US companies. Lower risk, diversified exposure.", basePrice:400, volatility:0.08, trend:0.01 },
  { id:"GLD",  name:"Digital Gold",     price:1800, history:[1780,1795,1810,1805,1790,1800,1800], sector:"Commodity",  pe:"N/A", sentiment:"Neutral", yield:"0%", prevClose:1798.50,open:1800.00,bid:"1799.50 x 100",ask:"1801.00 x 150",range52:"1600 – 2100",   volume:"2.1M", marketCap:"N/A",  beta:"0.15", eps:"N/A", earnings:"N/A",          targetEst:"2200.00", desc:"A digital asset backed by physical gold bullion stored in secure vaults.", basePrice:1800, volatility:0.09, trend:0.005 },
];

const updateStockPrice = (stock, marketSentiment = 0) => {
  const { price, basePrice, volatility, trend } = stock;
  const trendComponent = trend * price * (Math.random() - 0.3);
  const volComponent = (Math.random() - 0.5) * volatility * price * (1 + marketSentiment * 0.5);
  const meanReversionComponent = -(price - basePrice) * 0.02;
  let newPrice = price + trendComponent + volComponent + meanReversionComponent;
  return Math.max(5, Math.min(basePrice * 1.4, Math.max(basePrice * 0.7, newPrice)));
};

// ─────────────────────────────────────────────────────────────
// INSIGHT GENERATOR
// ─────────────────────────────────────────────────────────────

const generateGameInsight = (activeGame, gameStats, finalMoney, startMoney, config) => {
  const netProfit = finalMoney - startMoney;
  const pct = ((netProfit / startMoney) * 100).toFixed(1);
  const sym = config.currencySymbol;

  if (activeGame === "Market" || activeGame === "Crypto" || activeGame === "Blitz") {
    const totalTrades = (gameStats.buys || 0) + (gameStats.sells || 0);
    const bsRatio = gameStats.buys / Math.max(1, gameStats.sells);
    if (netProfit > 0) {
      if (bsRatio > 3) return `You made ${pct}% profit! 📈 But: you bought far more than you sold (${gameStats.buys} buys vs ${gameStats.sells} sells). Lock in gains faster next time to reduce exposure.`;
      if (bsRatio < 0.5) return `You made ${pct}% profit! 📈 Sharp exits — ${gameStats.sells} sells vs ${gameStats.buys} buys. Keep that profit-taking discipline.`;
      return `You made ${pct}% profit! 📈 Balanced approach across ${totalTrades} trades. Look for bigger position sizing on high-conviction bets.`;
    } else {
      if (gameStats.buys === 0) return `You lost ${Math.abs(pct)}% sitting in cash. 😬 Even bad timing beats zero participation. Start smaller next time.`;
      if (bsRatio > 2) return `You held losers too long. 📉 ${gameStats.buys} buys vs only ${gameStats.sells} sells. Cut losses faster — preserve capital.`;
      return `Lost ${Math.abs(pct)}%. 📉 Market volatility got you. Avoid emotional trades — set a stop-loss before entering any position.`;
    }
  }
  if (activeGame === "Budget") {
    if (finalMoney > startMoney * 1.2) return `Excellent budgeting — ~${pct}% growth! 💰 Discipline like this is the foundation of financial success.`;
    if (finalMoney > startMoney * 0.9) return `Solid budget management — ${pct}% net change. 💭 Next challenge: cut discretionary spending by 20%.`;
    return `Struggled with budget — lost ${Math.abs(pct)}%. 📉 Identify one major expense category to cut next round.`;
  }
  if (activeGame === "Credit") {
    if (finalMoney >= startMoney * 0.8) return `Survived credit challenges well — only ${Math.abs(pct)}% loss. 🎯 You prioritized minimum payments and avoided maxing out.`;
    if (finalMoney > 0) return `Credit decisions cost you ${Math.abs(pct)}%. 😰 High-interest purchases compound fast. One missed real-world payment can tank your score for years.`;
    return `Bankruptcy. 🚫 You took on debt without a repayment plan. Never borrow without a clear 6-month payback path.`;
  }
  if (activeGame === "Save") {
    if (finalMoney >= startMoney * 1.5) return `Exceptional savings — ${pct}% growth! 🏆 You let compound interest work. This mentality builds generational wealth.`;
    if (finalMoney > startMoney) return `Good saving — ${pct}% growth. 📈 Even 5–10% annual growth becomes life-changing wealth over decades.`;
    return `Couldn't save — spent ${Math.abs(pct)}%. 😞 Track every expense. You can't save what you can't see.`;
  }
  if (activeGame === "Hustle") {
    if (finalMoney >= startMoney * 2) return `Side hustle thrived — ${pct}% ROI! 🚀 Smart investment in tools and marketing. Reinvest those profits.`;
    if (finalMoney > startMoney) return `Profitable — ${pct}% gain. 📊 Now scale: hire, expand, or enter new markets.`;
    return `Startup failed — lost ${Math.abs(pct)}%. 💔 Most businesses take $500–$2k upfront. Budget more conservatively.`;
  }
  return `You ${finalMoney >= startMoney ? "won" : "lost"}. Final: ${sym}${Math.round(finalMoney)}. ${netProfit > 0 ? STOCK_WIN_REASONS[Math.floor(Math.random() * STOCK_WIN_REASONS.length)] : STOCK_FAIL_REASONS[Math.floor(Math.random() * STOCK_FAIL_REASONS.length)]}`;
};

// ─────────────────────────────────────────────────────────────
// TIER SETTINGS & SCENARIOS
// ─────────────────────────────────────────────────────────────

const TIER_SETTINGS = {
  elementary: {
    currencySymbol: "⭐", startingCash: 50, icon: "🦁", themeColor: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b, #f97316)",
    winMultiplier: 0.75, saveWinMultiplier: 1.2, marketWinMultiplier: 1.1,
    scenarios: [
      { q: "You found a cool toy for 5⭐! Buy it or keep your stars?", optA:["Buy Toy",5], optB:["Save Stars",0], msgA:"❌ Toy time! You bought it, but your star balance is lower now.", msgB:"✅ Patience pays off! You saved your stars for a bigger goal later." },
      { q: "You're thirsty! Buy fancy juice for 4⭐ or drink water for free?", optA:["Fancy Juice",4], optB:["Free Water",0], msgA:"❌ That juice was tasty, but it cost you stars.", msgB:"✅ Healthy and smart! You stayed hydrated for free." },
      { q: "Pay 3⭐ for a rare sticker or keep your stars?", optA:["Rare Sticker",3], optB:["Keep Stars",0], msgA:"❌ Shiny! But stickers don't grow your balance.", msgB:"✅ Stickers are cool, but having extra stars is cooler!" },
      { q: "You earned 8⭐ helping clean up! Spend on snacks (3⭐) or save all?", optA:["Spend on Snacks",3], optB:["Save All",0], msgA:"❌ Snack attack! You saved 5 stars at least.", msgB:"✅ Great job! You saved all 8 stars for your future." },
      { q: "Ice cream truck! Spend 5⭐ or skip it?", optA:["Buy Ice Cream",5], optB:["Skip It",0], msgA:"❌ Sweet! But a short-term treat means fewer stars.", msgB:"✅ Determination! You resisted to keep your stars growing." },
      { q: "New card game for 8⭐. Buy it or pass?", optA:["Buy Game",8], optB:["Pass",0], msgA:"❌ Fun game — but a big purchase!", msgB:"✅ You passed to keep your star count high. Smart!" },
      { q: "Friend's birthday — spend 4⭐ or make something free?", optA:["Nice Gift",4], optB:["Homemade",0], msgA:"❌ Thoughtful! You bought a nice gift.", msgB:"✅ Creative! Your friend loved the handmade gift and you saved stars." },
      { q: "New pencils for 3⭐?", optA:["Buy",3], optB:["Save",0], msgA:"❌ Ready for school! Fresh tools for your desk.", msgB:"✅ You decided to use your old pencils and keep your stars." },
      { q: "Candy bar for 2⭐?", optA:["Buy",2], optB:["Save",0], msgA:"❌ Quick treat! Stars add up over time.", msgB:"✅ One less candy bar means you're closer to a bigger prize!" },
      { q: "Final challenge: Big Star Box for 12⭐?", optA:["Buy",12], optB:["Save",0], msgA:"❌ Grand Prize! You bought the big box.", msgB:"✅ Master saver! You finished with a huge star balance." },
    ],
    marketScenarios: [
      { q:"Lemonade Stand: Spend 10⭐ on lemons. Risk it for profit!", optA:["Invest",10], optB:["Skip",0], msgB:"⏭ You decided not to start the stand. Your stars stay safe." },
      { q:"Cookie Sale: Spend 15⭐ to bake. Will it pay off?", optA:["Bake Cookies",15], optB:["Skip",0], msgB:"⏭ You skipped the bake sale. No risk, but no profit." },
      { q:"Snow cone stand: Risk 12⭐ or save?", optA:["Set Up",12], optB:["Save",0], msgB:"⏭ You chose to save your stars instead." },
      { q:"Craft market: Spend 8⭐ on supplies.", optA:["Try It",8], optB:["Skip",0], msgB:"⏭ You held onto your craft supplies stars." },
      { q:"Tutoring: Invest 10⭐ in materials.", optA:["Invest",10], optB:["Skip",0], msgB:"⏭ You didn't invest in tutoring materials this time." },
      { q:"Pool cleaning: Spend 8⭐ on tools.", optA:["Invest",8], optB:["Skip",0], msgB:"⏭ You skipped the pool cleaning venture." },
      { q:"Yard Sale: 5⭐ for signs.", optA:["Buy",5], optB:["Skip",0], msgB:"⏭ No yard sale today. Stars remain in your piggy bank." },
      { q:"Dog walking: 4⭐ for leashes.", optA:["Buy",4], optB:["Skip",0], msgB:"⏭ You decided dog walking wasn't the right move today." },
      { q:"Plant sale: 6⭐ for seeds.", optA:["Buy",6], optB:["Skip",0], msgB:"⏭ You're keeping your seeds stars for now." },
      { q:"Final Venture: 20⭐ big project!", optA:["Go Big",20], optB:["Play Safe",0], msgB:"⏭ You finished with a cautious, steady approach." },
    ],
    savingScenarios: [
      { q:"Found 5⭐ under pillow. Save?", optA:["Spend",5], optB:["Save",0], msgA:"❌ You spent your pillow money!", msgB:"✅ Great! That 5 stars is now earning interest in your bank." },
      { q:"Piggy bank full. 10⭐ toy?", optA:["Buy",10], optB:["Save",0], msgA:"❌ The toy is yours! But the piggy bank is empty.", msgB:"✅ Discipline! You're letting your money grow even bigger." },
      { q:"Found 5⭐ on the ground. Save?", optA:["Spend",5], optB:["Save",0], msgA:"❌ Money spent is money gone!", msgB:"✅ Building wealth! Every star counts." },
      { q:"Piggy bank full. Another 10⭐ toy?", optA:["Buy",10], optB:["Save",0], msgA:"❌ New toy alert! Your balance took a hit.", msgB:"✅ Patience pays! You are becoming a master saver." },
      { q:"Found 5⭐ in an old jacket. Save?", optA:["Spend",5], optB:["Save",0], msgA:"❌ Spent! Your star balance decreased.", msgB:"✅ Saved! Your future self will thank you." },
      { q:"Piggy bank overflowing. 10⭐ toy?", optA:["Buy",10], optB:["Save",0], msgA:"❌ You bought it! Time to start saving from zero.", msgB:"✅ Smart choice. Let that interest compound." },
      { q:"Found 5⭐ from a birthday. Save?", optA:["Spend",5], optB:["Save",0], msgA:"❌ Short-term fun, long-term cost.", msgB:"✅ A little saved today becomes a lot tomorrow." },
      { q:"Piggy bank ready. 10⭐ toy?", optA:["Buy",10], optB:["Save",0], msgA:"❌ You treated yourself! Balance is now lower.", msgB:"✅ Consistent! Your savings are booming." },
      { q:"Found 5⭐ at the park. Save?", optA:["Spend",5], optB:["Save",0], msgA:"❌ Gone! Keep an eye on your balance.", msgB:"✅ Savings growth! You earned extra interest." },
      { q:"FINAL: Piggy bank maxed. 10⭐ toy?", optA:["Buy",10], optB:["Save",0], msgA:"❌ The grand prize toy! You spent your stash.", msgB:"✅ Legendary saver! You finished with a huge balance." },
    ],
  },
  adult: {
    currencySymbol: "$", startingCash: 1000, icon: "💼", themeColor: "#6366f1",
    gradient: "linear-gradient(135deg, #6366f1, #4f46e5)",
    winMultiplier: 0.7, saveWinMultiplier: 1.4, marketWinMultiplier: 1.25,
    scenarios: [
      { q:"Housing: $400 luxury studio or $200 shared house?", optA:["Luxury Studio",400], optB:["Shared House",200], msgA:"❌ Privacy is great, but that extra $200/mo will be missed in savings.", msgB:"✅ Smart! Shared housing is the fastest way to build an emergency fund." },
      { q:"Commute: $140 Uber budget or $60 monthly bus pass?", optA:["Uber Habits",140], optB:["Bus Pass",60], msgA:"❌ Convenience costs! You're spending 3× more than necessary.", msgB:"✅ Excellent. Public transit is a wealth-builder's secret weapon." },
      { q:"Food: $120 at Whole Foods or $50 bulk-buying?", optA:["Whole Foods",120], optB:["Bulk Mart",50], msgA:"❌ Healthy but expensive. Can your income support these bills?", msgB:"✅ Buying in bulk is a pro move. You saved $70 without skipping a meal." },
      { q:"Insurance: Pay $70/mo now or risk a $5,000 bill later?", optA:["Skip Insurance",0], optB:["Pay Premium",70], msgA:"❌ You're 'self-insuring.' It works until it doesn't.", msgB:"✅ Insurance is risk management. You protected yourself from financial ruin." },
      { q:"Streaming: $15 basic service or $95 premium cable bundle?", optA:["Cable TV",95], optB:["One Service",15], msgA:"❌ The 'Cable Trap.' 200 channels, most unwatched.", msgB:"✅ Cutting the cord! You saved $80 and still have plenty to watch." },
      { q:"Social: $80 bar night or $15 board game night?", optA:["Clubbing",80], optB:["Game Night",15], msgA:"❌ Drinks add up fast. Your social life is your biggest expense.", msgB:"✅ Great memories for 1/5th the price. Low-cost hobbies keep you rich." },
      { q:"Upgrade: $200 new iPhone installment or keep old phone?", optA:["New iPhone",200], optB:["Keep Old",0], msgA:"❌ The shiny object cost $200. Does it really do anything new?", msgB:"✅ Status is a trap. Your old phone kept your cash working for you." },
      { q:"Lunch: $20 daily takeout or $5 meal prep?", optA:["Takeout",20], optB:["Meal Prep",5], msgA:"❌ The 'Latte Factor' in action. $20/day = $600/month on lunch.", msgB:"✅ Meal prepping is like giving yourself a $4,000 annual raise." },
      { q:"Gym: $100 boutique CrossFit or $10 basic gym?", optA:["CrossFit",100], optB:["Basic Gym",10], msgA:"❌ Community has value, but $100/mo is a luxury. Use it every day!", msgB:"✅ A barbell weighs the same at a $10 gym. Pay for results, not aesthetics." },
      { q:"Impulse: $50 limited-edition sneakers. Buy?", optA:["Buy Them",50], optB:["Ignore",0], msgA:"❌ Impulse buys are the enemy of a solid budget. They look good, books look worse.", msgB:"✅ Discipline! You walked away and net worth stayed intact." },
    ],
    marketScenarios: [
      { q:"Penny Stock: $200 in 'BioTech X'. Very volatile!", optA:["Buy In",200], optB:["Skip",0], msgB:"⏭ You avoided the high-risk gamble. Stability is its own reward." },
      { q:"Blue Chip: $400 in Apple shares. Solid but slow growth.", optA:["Invest",400], optB:["Skip",0], msgB:"⏭ You passed on a reliable company. Sometimes cash is king." },
      { q:"Index Fund: $300 in S&P 500. Balanced risk.", optA:["Buy Fund",300], optB:["Skip",0], msgB:"⏭ You skipped the broad market. Betting on your own timing." },
      { q:"IPO: $350 in a trendy new social media app.", optA:["Buy IPO",350], optB:["Skip",0], msgB:"⏭ IPOs are often overhyped. You played it safe." },
      { q:"Commodities: $250 in Crude Oil futures.", optA:["Trade Oil",250], optB:["Skip",0], msgB:"⏭ Commodity trading is complex. You sat this one out." },
      { q:"Real Estate: $450 in a REIT. Reliable dividends?", optA:["Invest",450], optB:["Skip",0], msgB:"⏭ Dividends are nice, but you chose to keep your liquidity." },
      { q:"Tech: $300 in AI Semiconductor stocks. Massive hype.", optA:["Buy AI",300], optB:["Skip",0], msgB:"⏭ Hype cycles are dangerous. You avoided the potential bubble." },
      { q:"Bonds: $150 in Treasury Notes. Very safe.", optA:["Buy Bonds",150], optB:["Skip",0], msgB:"⏭ Safety is good, but you're skipping the guaranteed (small) return." },
      { q:"Energy: $200 in a Solar Power startup.", optA:["Go Green",200], optB:["Skip",0], msgB:"⏭ Green energy is the future, but startups are risky. You passed." },
      { q:"Arbitrage: $400 in a complex currency swap.", optA:["Execute",400], optB:["Skip",0], msgB:"⏭ You avoided the complicated trade. Keeping it simple is valid." },
    ],
    cryptoScenarios: [
      { q:"Memecoin: $300 in 'DogePluto'. 1000x or zero.", optA:["Ape In",300], optB:["Skip",0], msgB:"⏭ You avoided the rug-pull risk. Solid discipline." },
      { q:"DeFi: $400 in a Yield Farm at 40% APY. Risky code.", optA:["Farm",400], optB:["Skip",0], msgB:"⏭ 40% returns usually mean 40% risk. You played it safe." },
      { q:"Bitcoin: $500 in the King. Stable (for crypto).", optA:["Buy BTC",500], optB:["Skip",0], msgB:"⏭ Even 'safe' crypto is volatile. You kept your cash." },
      { q:"NFT: $250 for a digital Bored Cat. Trend fading.", optA:["Buy NFT",250], optB:["Skip",0], msgB:"⏭ Buying at the top of a trend is dangerous. Good skip." },
      { q:"Altcoin: $200 in Solana ecosystem.", optA:["Buy SOL",200], optB:["Skip",0], msgB:"⏭ You avoided the altcoin casino this time." },
      { q:"Mining: $400 in ASIC hardware.", optA:["Invest",400], optB:["Skip",0], msgB:"⏭ Electricity costs and hardware depreciation are real. You passed." },
      { q:"Web3: $300 in ENS domain names.", optA:["Ape",300], optB:["Skip",0], msgB:"⏭ Speculating on digital names is a gamble. You stayed out." },
      { q:"DEX: $350 in liquidity providing.", optA:["Provide",350], optB:["Skip",0], msgB:"⏭ Impermanent loss is a real threat. You kept your tokens." },
      { q:"Gaming: $200 in play-to-earn tokens.", optA:["Play",200], optB:["Skip",0], msgB:"⏭ Crypto games often crash hard. You avoided the trap." },
      { q:"Layer 2: $300 in Arbitrum ecosystem.", optA:["Invest",300], optB:["Skip",0], msgB:"⏭ Great tech, wild market. You stayed in cash." },
    ],
    savingScenarios: [
      { q:"Bonus: $200 bonus at work. Save or Spend?", optA:["Splurge",200], optB:["Save It",0], msgA:"❌ Treated yourself! The bonus is gone.", msgB:"✅ Pro move! That $200 is now the seed of future wealth." },
      { q:"Found Cash: $50 in old jacket. Fancy meal or bank?", optA:["Fancy Meal",50], optB:["Save It",0], msgA:"❌ Delicious! But that $50 won't earn interest anymore.", msgB:"✅ Found money is the best money to save. Net worth +$50!" },
      { q:"Tax Refund: $80 check from the IRS. Save or spend?", optA:["New Tech",80], optB:["Save It",0], msgA:"❌ New gadgets lose value instantly.", msgB:"✅ You returned that money to your own future. Smart." },
      { q:"Cash Back: $40 earned on credit card. Save or spend?", optA:["Takeout",40], optB:["Save It",0], msgA:"❌ You spent your rewards — like you never got them.", msgB:"✅ Compounding your rewards is how you really win." },
      { q:"Gift: $100 from Grandma. Save or spend?", optA:["Shopping",100], optB:["Save It",0], msgA:"❌ Shopping spree! Grandma's gift is now a new outfit.", msgB:"✅ Grandma would be proud of your financial discipline." },
      { q:"Dividend: $30 paid out. Save or spend?", optA:["Movie Night",30], optB:["Save It",0], msgA:"❌ You spent your passive income.", msgB:"✅ Reinvesting dividends is the secret to getting truly rich." },
      { q:"Side Gig: $150 earned this week. Save or spend?", optA:["Night Out",150], optB:["Save It",0], msgA:"❌ Work hard, play hard! You spent your extra earnings.", msgB:"✅ You turned labor into long-term capital. Exceptional." },
      { q:"Garage Sale: $60 earned. Save or buy gadgets?", optA:["Gadgets",60], optB:["Save It",0], msgA:"❌ Turned old stuff into new stuff. Balance: neutral.", msgB:"✅ You turned clutter into cash and cash into savings." },
      { q:"Rebate: $25 back on purchase. Save or lunch?", optA:["Lunch",25], optB:["Save It",0], msgA:"❌ Spent! The rebate didn't last long.", msgB:"✅ Every $25 counts when it's earning compound interest." },
      { q:"Interest Earned: $10 from savings account. Save or spend?", optA:["Small Treat",10], optB:["Save It",0], msgA:"❌ You spent the interest your money made. Growth: slow.", msgB:"✅ You're letting interest make its own interest. You're winning." },
    ],
    creditScenarios: [
      { q:"Credit Score: Pay $100 off card to boost score?", optA:["Keep Cash",0], optB:["Pay Card",100], msgA:"❌ More cash, but your credit score might drop.", msgB:"✅ Investing in your score saves thousands in future interest." },
      { q:"Bad Debt: Friend wants $200 loan for a 'sure thing'.", optA:["Lend It",200], optB:["Decline",0], msgA:"❌ Lending to friends often means losing money AND the friend.", msgB:"✅ Wise. Never lend more than you can afford to lose forever." },
      { q:"Balance: Pay $150 minimum on card or keep cash?", optA:["Keep Cash",0], optB:["Pay Balance",150], msgA:"❌ The interest on that remaining balance will compound fast.", msgB:"✅ Staying ahead of the minimum keeps you out of the debt trap." },
      { q:"Interest: Card has 24% APR. Pay $300 now?", optA:["Wait",0], optB:["Pay Debt",300], msgA:"❌ 24% interest is a financial emergency. Waiting is very costly.", msgB:"✅ You just avoided the highest 'tax' there is." },
      { q:"Late Fee: $35 due today. Pay now or later?", optA:["Later",0], optB:["Pay Fee",35], msgA:"❌ Late fees compound and wreck your credit history.", msgB:"✅ Always pay fees the moment they appear. Bleeding stopped." },
      { q:"Furniture: $500 couch at 0% financing. Pay cash?", optA:["Finance",0], optB:["Pay Cash",500], msgA:"❌ 0% is great, but don't forget the payments. Still debt!", msgB:"✅ Zero debt means zero stress. Couch is yours, free and clear." },
      { q:"Credit Limit: Increase limit or stay safe?", optA:["Increase",0], optB:["Stay Safe",0], msgA:"❌ Higher limit can help your score, but only if you don't spend it!", msgB:"✅ Knowing your limits is key financial self-awareness." },
      { q:"Rewards Trap: Spend $100 to get $20 cashback?", optA:["Spend",100], optB:["Save",0], msgA:"❌ Spending $100 to 'save' $20 is a net loss of $80. Retail trap!", msgB:"✅ You didn't fall for the 'spending for rewards' trick. Nice." },
      { q:"Annual Fee: $95 card fee. Pay or cancel?", optA:["Pay Fee",95], optB:["Cancel",0], msgA:"❌ Make sure the benefits outweigh that $95 price tag.", msgB:"✅ If the perks don't pay for the fee, canceling is the right call." },
      { q:"Identity Protection: $10/mo monitoring service?", optA:["Skip",0], optB:["Pay",10], msgA:"❌ You're betting your identity stays safe.", msgB:"✅ Small price for massive peace of mind in a digital world." },
    ],
    hustleScenarios: [
      { q:"Equipment: $300 for a pro camera.", optA:["Buy Pro",300], optB:["Use Phone",0], msgA:"❌ High quality brings premium clients, but you're $300 in the hole.", msgB:"✅ Starting lean is smart. Most pros start with what they already own." },
      { q:"Ads: $100 for Instagram ad campaign.", optA:["Run Ads",100], optB:["Organic",0], msgA:"❌ Ads buy visibility. Let's see if the leads follow.", msgB:"✅ Organic growth is slower, but profit margins stay at 100%." },
      { q:"Software: $50/mo productivity subscription.", optA:["Subscribe",50], optB:["Free Version",0], msgA:"❌ Pro tools speed up your work. Time is money in a hustle.", msgB:"✅ Good call. Don't add fixed costs until you have fixed income." },
      { q:"Networking: $40 industry event ticket.", optA:["Attend",40], optB:["Skip",0], msgA:"❌ One connection could be worth $4,000. Hustling is about people.", msgB:"✅ You saved $40, but might have missed a key partnership." },
      { q:"Branding: $80 for professional logo design.", optA:["Hire",80], optB:["DIY",0], msgA:"❌ A pro logo builds trust instantly. You look like a real brand.", msgB:"✅ DIY is fine early. Just don't let bad design hurt your sales." },
      { q:"Inventory: $200 in raw materials (bulk).", optA:["Bulk Buy",200], optB:["Buy Small",50], msgA:"❌ Bulk buying lowers cost per unit. This is how you scale.", msgB:"✅ Lower risk, but profit per item will be much smaller." },
      { q:"Shipping: $30 for faster courier service.", optA:["Expedited",30], optB:["Standard",10], msgA:"❌ Happy customers are repeat customers. Speed matters.", msgB:"✅ Standard is fine — as long as you're honest about the timeline." },
      { q:"Legal: $150 to register your LLC.", optA:["Register",150], optB:["Stay Sole",0], msgA:"❌ Liability protection is huge. You're a legitimate business now!", msgB:"✅ Fine for a side gig, but be careful with personal assets." },
      { q:"Workspace: $100 for a shared coworking desk.", optA:["Rent Desk",100], optB:["Work Home",0], msgA:"❌ No distractions! Productivity is usually higher in a pro space.", msgB:"✅ Zero rent keeps your hustle profitable early on." },
      { q:"Final Push: $250 for a trade show booth.", optA:["Go Big",250], optB:["Skip",0], msgA:"❌ Big risk, big reward! Your brand in front of thousands.", msgB:"✅ You finished with a healthy profit and a low-risk mindset." },
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

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
    return saved || "Investor_" + Math.floor(Math.random() * 9000);
  });

  const [leagues, setLeagues] = useState(() => {
    const saved = localStorage.getItem("FIN_LEAGUES_GLOBAL");
    const base = [
      { id:"101", name:"AP Economics Titans", players:["Sarah_99","InvestorJoe"], code:"ECON1", activeMatch:true,  visibility:"public", createdBy:"System" },
      { id:"102", name:"Wall Street Wolves",   players:["CryptoKing"],            code:"WOLF8", activeMatch:false, visibility:"public", createdBy:"System" },
    ];
    return saved ? JSON.parse(saved) : base;
  });

  useEffect(() => { localStorage.setItem("FIN_LEAGUES_GLOBAL", JSON.stringify(leagues)); }, [leagues]);

  useEffect(() => {
    const handleSync = () => {
      const updated = localStorage.getItem("FIN_LEAGUES_GLOBAL");
      if (updated) setLeagues(JSON.parse(updated));
    };
    window.addEventListener("storage", handleSync);
    const poller = setInterval(handleSync, 2000);
    return () => { window.removeEventListener("storage", handleSync); clearInterval(poller); };
  }, []);

  const [view, setView] = useState("menu");
  const [joinCode, setJoinCode] = useState("");
  const [newLeagueName, setNewLeagueName] = useState("");
  const [leaguePrivacy, setLeaguePrivacy] = useState("public");
  const [selectedLeague, setSelectedLeague] = useState(null);

  const [blitzStocks, setBlitzStocks] = useState(INITIAL_STOCKS);
  const [portfolio, setPortfolio] = useState({ GIGA:0, VOY:0, MART:0, SPY:0, GLD:0 });
  const [selectedStock, setSelectedStock] = useState(INITIAL_STOCKS[0]);
  const [activePopupStock, setActivePopupStock] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [opponents, setOpponents] = useState([]);
  const [leagueFeed, setLeagueFeed] = useState([]);

  const npcStateRef = useRef({});

  const initNpcState = useCallback((opponentList, startingCash) => {
    const state = {};
    opponentList.forEach((opp, i) => {
      state[opp.name] = {
        cash: startingCash,
        portfolio: { GIGA:0, VOY:0, MART:0, SPY:0, GLD:0 },
        personality: NPC_PERSONALITY_LIST[i % NPC_PERSONALITY_LIST.length],
      };
    });
    npcStateRef.current = state;
  }, []);

  const [vocabPopup, setVocabPopup] = useState({ visible:false, key:null, x:0, y:0 });
  const vocabRef = useRef(null);
  const moneyRef = useRef(0);

  useEffect(() => {
    const clickOutside = (e) => {
      if (vocabRef.current && !vocabRef.current.contains(e.target)) {
        setVocabPopup({ visible:false, key:null, x:0, y:0 });
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const handleVocabClick = (key, e) => {
    e.stopPropagation();
    setVocabPopup({ visible:true, key, x:e.clientX, y:e.clientY });
  };

  const config = TIER_SETTINGS[userTier] || TIER_SETTINGS.adult;

  const getScenarios = (game) => {
    const c = config;
    switch(game) {
      case "Market": return c.marketScenarios;
      case "Crypto": return c.cryptoScenarios;
      case "Save":   return c.savingScenarios;
      case "Credit": return c.creditScenarios;
      case "Hustle": return c.hustleScenarios;
      default:       return c.scenarios;
    }
  };
  const scenarios = getScenarios(activeGame);

  const calculateTotalWealth = useCallback(() => {
    let stockValue = 0;
    blitzStocks.forEach(s => { stockValue += (portfolio[s.id] || 0) * s.price; });
    return money + stockValue;
  }, [money, blitzStocks, portfolio]);

  const calculateNpcWealth = useCallback((npcName, currentStocks) => {
    const npc = npcStateRef.current[npcName];
    if (!npc) return config.startingCash;
    let stockValue = 0;
    currentStocks.forEach(s => { stockValue += (npc.portfolio[s.id] || 0) * s.price; });
    return npc.cash + stockValue;
  }, [config.startingCash]);

  const endBlitzCompetition = useCallback(() => {
    const finalWealth = calculateTotalWealth();
    setMoney(finalWealth);
    const insight = generateGameInsight("Blitz", gameStats, finalWealth, gameStats.startMoney, config);
    setTradeMessage(insight);
    setGameResult("report");
    if (onGameEnd) onGameEnd(finalWealth >= gameStats.startMoney ? "won" : "lost");
  }, [calculateTotalWealth, gameStats, config, onGameEnd]);

  const tickNpcs = useCallback((currentStocks) => {
    const npcState = npcStateRef.current;
    const newFeedEntries = [];

    Object.entries(npcState).forEach(([npcName, npc]) => {
      const personality = NPC_PERSONALITIES[npc.personality] || NPC_PERSONALITIES.balanced;
      if (Math.random() > 0.25) return;
      const stock = currentStocks[Math.floor(Math.random() * currentStocks.length)];
      const price = Math.round(stock.price);
      const sharesOwned = npc.portfolio[stock.id] || 0;
      const action = Math.random();

      if (action < personality.buyChance && npc.cash >= price) {
        const sharesToBuy = Math.min(personality.maxShares, Math.floor(npc.cash / price));
        if (sharesToBuy > 0) {
          const cost = sharesToBuy * price;
          npc.cash -= cost;
          npc.portfolio[stock.id] = (npc.portfolio[stock.id] || 0) + sharesToBuy;
          newFeedEntries.push({ text: `📈 ${npcName} bought $${cost.toLocaleString()} of ${stock.id} (${sharesToBuy}sh @ $${price})`, ts: Date.now() });
        }
      } else if (action < personality.buyChance + personality.sellChance && sharesOwned > 0) {
        const sharesToSell = Math.min(Math.ceil(sharesOwned * (0.4 + Math.random() * 0.6)), sharesOwned);
        const proceeds = sharesToSell * price;
        npc.cash += proceeds;
        npc.portfolio[stock.id] = sharesOwned - sharesToSell;
        newFeedEntries.push({ text: `📉 ${npcName} sold $${proceeds.toLocaleString()} of ${stock.id} (${sharesToSell}sh @ $${price})`, ts: Date.now() });
      }
    });

    if (newFeedEntries.length > 0) {
      setLeagueFeed(prev => [...newFeedEntries.map(e => e.text), ...prev].slice(0, 30));
    }
    setOpponents(prev => prev.map(opp => ({ ...opp, wealth: calculateNpcWealth(opp.name, currentStocks) })));
  }, [calculateNpcWealth]);

  useEffect(() => {
    let interval;
    if (playing && activeGame === "Blitz" && timeLeft > 0) {
      interval = setInterval(() => {
        setBlitzStocks(current => {
          const updated = current.map(s => {
            const newPrice = updateStockPrice(s, Math.random() - 0.5);
            return { ...s, price: newPrice, history: [...s.history.slice(-14), newPrice] };
          });
          tickNpcs(updated);
          return updated;
        });
        setTimeLeft(t => Math.max(0, t - 1));
      }, 1000);
    } else if (timeLeft === 0 && playing && activeGame === "Blitz") {
      endBlitzCompetition();
    }
    return () => clearInterval(interval);
  }, [playing, activeGame, timeLeft, endBlitzCompetition, tickNpcs]);

  useEffect(() => {
    if (playing && activeGame === "Blitz" && selectedLeague) {
      const myWealth = calculateTotalWealth();
      localStorage.setItem(`FIN_SYNC_LEAGUE_${selectedLeague.id}_USER_${currentUser}`, myWealth.toString());
    }
  }, [blitzStocks, money, portfolio, playing, activeGame, selectedLeague, currentUser, calculateTotalWealth]);

  const resetGame = (countAsPlayed = false) => {
    if (countAsPlayed && onGameEnd) onGameEnd("lost");
    setPlaying(false); setGameResult(null); setActiveGame(null);
    setMoney(0); moneyRef.current = 0; setDay(1);
    setTradeMessage(null); setWaitingNext(false);
    setView("menu");
    setGameStats({ buys:0, sells:0, startMoney:0 });
    npcStateRef.current = {};
  };

  const endGame = (finalMoney) => {
    const thresholds = { Market: config.marketWinMultiplier, Crypto: config.marketWinMultiplier, Save: config.saveWinMultiplier };
    const mult = thresholds[activeGame] || config.winMultiplier;
    const won = finalMoney >= config.startingCash * mult;
    const insight = generateGameInsight(activeGame, gameStats, finalMoney, gameStats.startMoney || config.startingCash, config);
    setTradeMessage(insight);
    setMoney(finalMoney);
    setGameResult(won ? "won" : "lost");
    if (onGameEnd) onGameEnd(won ? "won" : "lost");
  };

  const handleNextStep = () => {
    const currentMoney = moneyRef.current;
    if (currentMoney <= 0) {
      setGameResult("lost");
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
    if (activeGame === "Save") {
      updated = cost === 0 ? money + Math.max(10, Math.round(config.startingCash * 0.1)) : money - cost;
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
      setTradeMessage(currentScenario.msgB || "⏭ Skipped trade.");
      setWaitingNext(true);
      return;
    }
    const isCrypto = activeGame === "Crypto";
    const success = Math.random() < (isCrypto ? 0.38 : 0.48);
    const currentMoney = moneyRef.current;
    let newMoney, msg;
    if (success) {
      const profit = Math.max(10, Math.round(amount * (0.5 + Math.random() * (isCrypto ? 2.5 : 1.8))));
      newMoney = currentMoney + profit;
      msg = `✅ +${config.currencySymbol}${profit} PROFIT! ${STOCK_WIN_REASONS[Math.floor(Math.random() * STOCK_WIN_REASONS.length)]}`;
      setGameStats(s => ({ ...s, buys: s.buys + 1 }));
    } else {
      const loss = Math.round(amount * (0.6 + Math.random() * (isCrypto ? 1.0 : 0.8)));
      newMoney = Math.max(0, currentMoney - loss);
      msg = `❌ -${config.currencySymbol}${loss} LOSS. ${STOCK_FAIL_REASONS[Math.floor(Math.random() * STOCK_FAIL_REASONS.length)]}`;
      setGameStats(s => ({ ...s, sells: s.sells + 1 }));
    }
    moneyRef.current = newMoney;
    setMoney(newMoney);
    setTradeMessage(msg);
    setWaitingNext(true);
  };

  const handleCreateLeague = () => {
    if (!newLeagueName.trim()) return;
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    const newL = { id: Date.now().toString(), name: newLeagueName.trim(), players:[currentUser], code, activeMatch:false, visibility:leaguePrivacy, createdBy:currentUser };
    const updated = [newL, ...leagues];
    localStorage.setItem("FIN_LEAGUES_GLOBAL", JSON.stringify(updated));
    setLeagues(updated);
    setNewLeagueName("");
    alert(`League created! Your join code is: ${code}`);
  };

  const handleJoinLeague = () => {
    const target = joinCode.toUpperCase().trim();
    const globalLeagues = JSON.parse(localStorage.getItem("FIN_LEAGUES_GLOBAL") || "[]");
    const foundIdx = globalLeagues.findIndex(l => l.code.toUpperCase() === target);
    if (foundIdx !== -1) {
      globalLeagues[foundIdx].players = Array.from(new Set([...globalLeagues[foundIdx].players, currentUser]));
      localStorage.setItem("FIN_LEAGUES_GLOBAL", JSON.stringify(globalLeagues));
      const fresh = JSON.parse(localStorage.getItem("FIN_LEAGUES_GLOBAL") || "[]");
      setLeagues(fresh);
      const leagueObj = fresh.find(l => l.code.toUpperCase() === target);
      setSelectedLeague(leagueObj);
      setView("leagueDetail");
      setJoinCode("");
    } else {
      alert("Invalid league code. Please check with the league owner.");
    }
  };

  const handleDeleteLeague = (id) => {
    if (!window.confirm("Permanently delete this league? This cannot be undone.")) return;
    const updated = leagues.filter(l => l.id !== id);
    localStorage.setItem("FIN_LEAGUES_GLOBAL", JSON.stringify(updated));
    setLeagues(updated);
    if (selectedLeague?.id === id) setView("leagues");
  };

  const handleBlitzTrade = (stockId, action) => {
    const stock = blitzStocks.find(s => s.id === stockId);
    if (!stock) return;
    if (action === "buy") {
      const cost = Math.round(stock.price);
      if (money >= cost) {
        setMoney(m => m - cost);
        setPortfolio(prev => ({ ...prev, [stockId]: (prev[stockId] || 0) + 1 }));
        setGameStats(s => ({ ...s, buys: s.buys + 1 }));
        setTradeMessage(`✅ Bought 1 share of ${stock.id} at $${cost.toLocaleString()}`);
      } else {
        setTradeMessage(`❌ Insufficient funds. Need $${Math.round(stock.price).toLocaleString()}, have $${Math.round(money).toLocaleString()}`);
      }
    } else if (action === "sell") {
      if ((portfolio[stockId] || 0) > 0) {
        const proceeds = Math.round(stock.price);
        setMoney(m => m + proceeds);
        setPortfolio(prev => ({ ...prev, [stockId]: prev[stockId] - 1 }));
        setGameStats(s => ({ ...s, sells: s.sells + 1 }));
        setTradeMessage(`✅ Sold 1 share of ${stock.id} for $${proceeds.toLocaleString()}`);
      } else {
        setTradeMessage(`❌ You don't own any shares of ${stock.id}`);
      }
    }
  };

  // ─── SUBCOMPONENTS ───────────────────────────────────────────

  const MiniChart = ({ history, width = 80, height = 32 }) => {
    if (!history || history.length < 2) return null;
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;
    const pts = history.map((v, i) => {
      const x = (i / (history.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    }).join(" ");
    const isUp = history[history.length - 1] >= history[0];
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <polyline fill="none" stroke={isUp ? "#10b981" : "#ef4444"} strokeWidth="2" points={pts} />
      </svg>
    );
  };

  const YahooFinanceModal = ({ stock, onClose }) => {
    if (!stock) return null;
    const change = stock.price - stock.prevClose;
    const changePct = ((change / stock.prevClose) * 100).toFixed(2);
    const isUp = change >= 0;
    return (
      <div style={gS.modalOverlay} onClick={onClose}>
        <div style={gS.modalContent} onClick={e => e.stopPropagation()}>
          <div style={gS.modalHeader}>
            <div>
              <h1 style={{ margin:0, fontSize:24, fontWeight:900 }}>{stock.name}</h1>
              <span style={{ fontSize:13, color:"#64748b" }}>{stock.id} • {stock.sector} • NasdaqGS</span>
            </div>
            <button style={gS.closeBtn} onClick={onClose} aria-label="Close">✕</button>
          </div>

          <div style={{ display:"flex", alignItems:"baseline", gap:16, marginBottom:24 }}>
            <span style={{ fontSize:42, fontWeight:900, color:"#0f172a" }}>${stock.price.toFixed(2)}</span>
            <span style={{ fontSize:18, fontWeight:700, color: isUp ? "#10b981" : "#ef4444" }}>
              {isUp ? "+" : ""}{change.toFixed(2)} ({isUp ? "+" : ""}{changePct}%)
            </span>
            <span style={{ fontSize:12, color:"#94a3b8" }}>As of session</span>
          </div>

          <div style={{ marginBottom:24, padding:16, background:"#f8fafc", borderRadius:12 }}>
            <MiniChart history={stock.history} width={400} height={80} />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, marginBottom:20 }}>
            {[
              ["prevClose", "Previous Close", `$${stock.prevClose}`],
              ["open", "Open", `$${stock.open}`],
              ["bid", "Bid", stock.bid],
              ["ask", "Ask", stock.ask],
              ["range52", "52-Week Range", stock.range52],
              ["volume", "Volume", stock.volume],
              ["marketCap", "Market Cap", stock.marketCap],
              ["pe", "P/E Ratio (TTM)", stock.pe],
              ["eps", "EPS (TTM)", stock.eps],
              ["beta", "Beta", stock.beta],
              ["earnings", "Earnings Date", stock.earnings],
              ["targetEst", "1y Target Est", `$${stock.targetEst}`],
            ].reduce((cols, item, i) => {
              const col = Math.floor(i / 6);
              cols[col] = [...(cols[col] || []), item];
              return cols;
            }, [[], []]).map((col, ci) => (
              <div key={ci}>
                {col.map(([key, label, val]) => (
                  <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #f1f5f9", fontSize:13 }}>
                    <span onClick={e => handleVocabClick(key, e)} style={{ color:"#64748b", cursor:"help", textDecoration:"underline dotted" }}>{label} ?</span>
                    <strong style={{ color:"#0f172a" }}>{val}</strong>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ padding:"14px 16px", background:"#eef2ff", borderRadius:12, fontSize:13, color:"#4338ca", lineHeight:1.5 }}>
            <strong>About:</strong> {stock.desc}
          </div>
        </div>
      </div>
    );
  };

  // ─── GAME RESULT SCREEN ──────────────────────────────────────

  if (gameResult) {
    const isWin = gameResult === "won" || gameResult === "report";
    const startMoney = gameStats.startMoney || config.startingCash;
    const netPnl = money - startMoney;
    const pct = ((netPnl / startMoney) * 100).toFixed(1);

    return (
      <div style={gS.resultContainer}>
        <style>{`@keyframes resultIn { from { opacity:0; transform:scale(0.85) translateY(30px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
        <div style={{
          ...gS.resultCard,
          background: isWin
            ? "linear-gradient(135deg, #064e3b, #059669)"
            : "linear-gradient(135deg, #4c0519, #be123c)",
          animation: "resultIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
          <div style={gS.resultEmoji}>{isWin ? "🏆" : "💔"}</div>
          <h1 style={gS.resultTitle}>
            {gameResult === "report" ? "FINAL RECAP" : isWin ? "YOU WON!" : "GAME OVER"}
          </h1>

          <div style={gS.resultDetails}>
            <div style={gS.statRow}>
              <span>Starting Balance</span>
              <strong>{config.currencySymbol}{startMoney.toLocaleString()}</strong>
            </div>
            <div style={gS.statRow}>
              <span>Final Balance</span>
              <strong style={{ fontSize:22 }}>{config.currencySymbol}{Math.round(money).toLocaleString()}</strong>
            </div>
            <div style={gS.statRow}>
              <span>Net P&L</span>
              <strong style={{ color: netPnl >= 0 ? "#86efac" : "#fca5a5" }}>
                {netPnl >= 0 ? "+" : ""}{config.currencySymbol}{Math.round(netPnl).toLocaleString()} ({netPnl >= 0 ? "+" : ""}{pct}%)
              </strong>
            </div>
            {gameStats.buys > 0 && (
              <div style={gS.statRow}>
                <span>Trades Made</span>
                <strong>{gameStats.buys + gameStats.sells} ({gameStats.buys}B / {gameStats.sells}S)</strong>
              </div>
            )}
          </div>

          {tradeMessage && (
            <div style={{
              background:"rgba(255,255,255,0.15)",
              borderRadius:16,
              padding:"18px",
              textAlign:"left",
              fontSize:14,
              lineHeight:1.6,
              marginBottom:24,
            }}>
              <div style={{ fontSize:11, fontWeight:700, opacity:0.7, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>💡 Insight</div>
              {tradeMessage}
            </div>
          )}

          <button style={gS.actionBtn} onClick={() => resetGame()}>
            {isWin ? "Play Again" : "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  // ─── ACTIVE BLITZ GAME ───────────────────────────────────────

  if (playing && activeGame === "Blitz") {
    const totalWealth = calculateTotalWealth();
    const allPlayers = [
      { name:currentUser, wealth:totalWealth, isYou:true },
      ...opponents.map(o => ({ name:o.name, wealth:o.wealth, isYou:false })),
    ].sort((a, b) => b.wealth - a.wealth);

    const myRank = allPlayers.findIndex(p => p.isYou) + 1;

    return (
      <div style={{ minHeight:"100vh", background:"#0f172a", padding:"16px", fontFamily:"'DM Sans', system-ui, sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
          .stock-row:hover { background: rgba(99,102,241,0.08) !important; }
          .trade-btn:hover { opacity:0.85; transform:scale(1.02); }
          .trade-btn { transition:opacity 0.15s, transform 0.15s; }
        `}</style>

        {activePopupStock && <YahooFinanceModal stock={activePopupStock} onClose={() => setActivePopupStock(null)} />}

        {vocabPopup.visible && (
          <div ref={vocabRef} style={{ ...gS.vocabPopup, top:vocabPopup.y + 12, left:Math.min(vocabPopup.x + 12, window.innerWidth - 240) }}>
            <strong style={{ fontSize:13, color:"#1e293b" }}>{VOCAB_HELPER[vocabPopup.key]?.split(":")[0]}</strong>
            <p style={{ margin:"6px 0 0", fontSize:12, color:"#475569", lineHeight:1.5 }}>
              {VOCAB_HELPER[vocabPopup.key]?.split(":").slice(1).join(":").trim()}
            </p>
          </div>
        )}

        <div style={{ maxWidth:1240, margin:"0 auto", display:"grid", gridTemplateColumns:"240px 1fr 280px", gap:16, height:"calc(100vh - 32px)" }}>

          {/* LEFT: Standings + Feed */}
          <div style={{ display:"flex", flexDirection:"column", gap:12, overflow:"hidden", minHeight:0 }}>
            <div style={{ background:"#1e293b", borderRadius:16, padding:16, color:"#fff", flex:"0 0 auto" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                <h3 style={{ margin:0, fontSize:14, color:"#6366f1", fontWeight:700 }}>🏆 Standings</h3>
                <span style={{ fontSize:11, color:"#475569" }}>Rank #{myRank}</span>
              </div>
              {allPlayers.map((p, i) => (
                <div key={p.name} style={{
                  display:"flex",
                  justifyContent:"space-between",
                  alignItems:"center",
                  padding:"8px 10px",
                  borderRadius:10,
                  marginBottom:4,
                  background: p.isYou ? "rgba(99,102,241,0.15)" : "transparent",
                  border: p.isYou ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
                }}>
                  <span style={{ fontSize:12, color: p.isYou ? "#facc15" : "#94a3b8", fontWeight: p.isYou ? 700 : 400 }}>
                    {i + 1}. {p.name}{p.isYou ? " 🫵" : ""}
                  </span>
                  <span style={{ fontSize:12, fontWeight:700, color: p.wealth >= config.startingCash ? "#86efac" : "#fca5a5" }}>
                    ${Math.round(p.wealth).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ background:"#1e293b", borderRadius:16, padding:16, color:"#fff", flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
              <h3 style={{ margin:"0 0 10px", fontSize:14, color:"#10b981", fontWeight:700 }}>📡 Activity Feed</h3>
              <div style={{ overflowY:"hidden", flex:1 }}>
                {leagueFeed.length === 0 ? (
                  <div style={{ fontSize:11, color:"#475569", fontStyle:"italic" }}>Waiting for trades...</div>
                ) : leagueFeed.map((f, i) => (
                  <div key={i} style={{
                    fontSize:11, marginBottom:8, lineHeight:1.4, paddingBottom:6,
                    borderBottom:"1px solid rgba(255,255,255,0.05)",
                    color: f.startsWith("📈") ? "#86efac" : "#fca5a5",
                  }}>{f}</div>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER: Market Terminal */}
          <div style={{ background:"#fff", borderRadius:16, padding:20, overflow:"auto", display:"flex", flexDirection:"column" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div>
                <h2 style={{ margin:"0 0 2px", fontSize:20, fontWeight:900, color:"#0f172a" }}>Market Terminal</h2>
                <div style={{ fontSize:12, color:"#94a3b8" }}>Simulated NASDAQ · Live prices</div>
              </div>
              <div style={{
                background: timeLeft < 60 ? "#fef2f2" : "#f8fafc",
                border: `2px solid ${timeLeft < 60 ? "#ef4444" : "#e2e8f0"}`,
                borderRadius:12, padding:"8px 16px", textAlign:"center",
              }}>
                <div style={{ fontSize:11, color:"#94a3b8", fontWeight:600 }}>TIME</div>
                <div style={{ fontSize:22, fontWeight:900, color: timeLeft < 60 ? "#ef4444" : "#0f172a", fontVariantNumeric:"tabular-nums" }}>
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
                </div>
              </div>
            </div>

            {/* Stock table */}
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, marginBottom:20 }}>
              <thead>
                <tr style={{ borderBottom:"2px solid #f1f5f9" }}>
                  {[
                    ["ticker", "Ticker"],
                    ["price", "Price"],
                    ["chart", "Chart"],
                    ["sentiment", "Sentiment"],
                    ["sector", "Sector"],
                  ].map(([key, label]) => (
                    <th key={label} style={{ padding:"8px 6px", textAlign:"left", color:"#94a3b8", fontWeight:600, fontSize:11, textTransform:"uppercase", letterSpacing:"0.05em" }}>
                      <span onClick={e => handleVocabClick(key, e)} style={{ cursor:"help", textDecoration:"underline dotted", color:"#6366f1" }}>
                        {label} ?
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {blitzStocks.map(s => {
                  const change = s.price - s.prevClose;
                  const isUp = change >= 0;
                  return (
                    <tr key={s.id} className="stock-row" onClick={() => setSelectedStock(s)} style={{
                      borderBottom:"1px solid #f8fafc", cursor:"pointer",
                      background: selectedStock.id === s.id ? "#f8fafc" : "transparent",
                    }}>
                      <td style={{ padding:"12px 6px" }}>
                        <div
                          onClick={e => { e.stopPropagation(); setActivePopupStock(s); }}
                          style={{ fontWeight:900, color:"#6366f1", textDecoration:"underline", cursor:"pointer", fontSize:14 }}
                        >{s.id}</div>
                        <div style={{ fontSize:10, color:"#94a3b8" }}>{s.name.split(" ")[0]}</div>
                      </td>
                      <td style={{ padding:"12px 6px" }}>
                        <div style={{ fontWeight:700, fontSize:14 }}>${s.price.toFixed(2)}</div>
                        <div style={{ fontSize:10, color: isUp ? "#10b981" : "#ef4444" }}>
                          {isUp ? "+" : ""}{change.toFixed(2)}
                        </div>
                      </td>
                      <td style={{ padding:"12px 6px" }}>
                        <MiniChart history={s.history} />
                      </td>
                      <td style={{ padding:"12px 6px" }}>
                        <span style={{
                          padding:"3px 8px", borderRadius:6, fontSize:11, fontWeight:700,
                          background: s.sentiment === "Bullish" ? "#d1fae5" : s.sentiment === "Bearish" ? "#fee2e2" : "#f1f5f9",
                          color: s.sentiment === "Bullish" ? "#065f46" : s.sentiment === "Bearish" ? "#991b1b" : "#475569",
                        }}>{s.sentiment}</span>
                      </td>
                      <td style={{ padding:"12px 6px", color:"#64748b", fontSize:12 }}>{s.sector}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Selected stock analysis panel */}
            <div style={{ background:"#f8fafc", padding:20, borderRadius:14, flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                <div>
                  <h3 style={{ margin:"0 0 4px", fontSize:18, fontWeight:900, color:"#0f172a" }}>{selectedStock.name}</h3>
                  <p style={{ margin:0, fontSize:12, color:"#64748b", maxWidth:360 }}>{selectedStock.desc}</p>
                </div>
                <MiniChart history={selectedStock.history} width={100} height={40} />
              </div>

              <div style={{ display:"flex", flexWrap:"wrap", gap:16, marginBottom:16, fontSize:13 }}>
                {[
                  ["pe", "P/E Ratio", selectedStock.pe],
                  ["yield", "Div Yield", selectedStock.yield],
                  ["beta", "Beta", selectedStock.beta],
                  ["eps", "EPS", selectedStock.eps],
                ].map(([key, label, val]) => (
                  <div key={key}>
                    <span onClick={e => handleVocabClick(key, e)} style={{ cursor:"help", textDecoration:"underline dotted", color:"#6366f1", fontSize:11, fontWeight:600 }}>
                      {label} ?
                    </span>
                    <div style={{ fontWeight:900, fontSize:16, color:"#0f172a" }}>{val}</div>
                  </div>
                ))}
                <div>
                  <div style={{ fontSize:11, fontWeight:600, color:"#94a3b8" }}>OWNED</div>
                  <div style={{ fontWeight:900, fontSize:16, color:"#6366f1" }}>{portfolio[selectedStock.id] || 0} sh</div>
                </div>
              </div>

              <div style={{ display:"flex", gap:10 }}>
                <button className="trade-btn" onClick={() => handleBlitzTrade(selectedStock.id, "buy")} style={{ ...gS.tradeBtn, background:"#10b981" }}>
                  ▲ BUY {selectedStock.id}
                </button>
                <button className="trade-btn" onClick={() => handleBlitzTrade(selectedStock.id, "sell")} style={{ ...gS.tradeBtn, background:"#ef4444" }}>
                  ▼ SELL {selectedStock.id}
                </button>
              </div>

              {tradeMessage && (
                <div style={{
                  marginTop:12, padding:"10px 14px", borderRadius:10, fontSize:12, lineHeight:1.5,
                  background: tradeMessage.startsWith("✅") ? "#d1fae5" : tradeMessage.startsWith("❌") ? "#fee2e2" : "#f1f5f9",
                  color: tradeMessage.startsWith("✅") ? "#065f46" : tradeMessage.startsWith("❌") ? "#991b1b" : "#475569",
                  borderLeft: `3px solid ${tradeMessage.startsWith("✅") ? "#10b981" : tradeMessage.startsWith("❌") ? "#ef4444" : "#94a3b8"}`,
                }}>
                  {tradeMessage}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Portfolio */}
          <div style={{ background:"#1e293b", borderRadius:16, padding:16, color:"#fff", display:"flex", flexDirection:"column" }}>
            <h3 style={{ margin:"0 0 4px", fontSize:14, color:"#6366f1", fontWeight:700 }}>💼 My Portfolio</h3>

            <div style={{ padding:"16px", background:"rgba(99,102,241,0.1)", borderRadius:12, marginBottom:16 }}>
              <div style={{ fontSize:11, color:"#94a3b8", fontWeight:600, marginBottom:4 }}>TOTAL WEALTH</div>
              <div style={{ fontSize:28, fontWeight:900, color:"#f1f5f9" }}>${Math.round(totalWealth).toLocaleString()}</div>
              <div style={{ fontSize:12, color: totalWealth >= config.startingCash ? "#86efac" : "#fca5a5", marginTop:4, fontWeight:600 }}>
                {totalWealth >= config.startingCash ? "▲" : "▼"} ${Math.abs(Math.round(totalWealth - config.startingCash)).toLocaleString()} vs start
                {" "}({((totalWealth / config.startingCash - 1) * 100).toFixed(1)}%)
              </div>
            </div>

            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, color:"#94a3b8", fontWeight:600, marginBottom:6 }}>AVAILABLE CASH</div>
              <div style={{ fontSize:20, fontWeight:700, color:"#10b981" }}>${Math.round(money).toLocaleString()}</div>
            </div>

            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, color:"#94a3b8", fontWeight:600, marginBottom:8 }}>HOLDINGS</div>
              {blitzStocks.filter(s => (portfolio[s.id] || 0) > 0).length === 0 ? (
                <div style={{ fontSize:12, color:"#475569", fontStyle:"italic", padding:"12px 0" }}>No open positions.</div>
              ) : blitzStocks.filter(s => (portfolio[s.id] || 0) > 0).map(s => {
                const value = portfolio[s.id] * s.price;
                const change = s.price - s.prevClose;
                return (
                  <div key={s.id} style={{
                    display:"flex", justifyContent:"space-between", alignItems:"center",
                    padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.06)", fontSize:13,
                  }}>
                    <div>
                      <div style={{ fontWeight:700, color:"#e2e8f0" }}>{s.id} × {portfolio[s.id]}</div>
                      <div style={{ fontSize:10, color:"#64748b" }}>@${s.price.toFixed(2)}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ color:"#86efac", fontWeight:700 }}>${Math.round(value).toLocaleString()}</div>
                      <div style={{ fontSize:10, color: change >= 0 ? "#86efac" : "#fca5a5" }}>
                        {change >= 0 ? "▲" : "▼"} {Math.abs(((change / s.prevClose) * 100)).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={endBlitzCompetition}
              style={{ width:"100%", marginTop:16, background:"#ef4444", color:"#fff", border:"none", padding:"14px", borderRadius:12, cursor:"pointer", fontWeight:700, fontSize:14 }}
            >
              End Competition
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── ACTIVE SCENARIO GAMES ────────────────────────────────────

  if (playing) {
    const currentScenario = scenarios[Math.min(day - 1, scenarios.length - 1)];
    const isMarket = activeGame === "Market" || activeGame === "Crypto";
    const themeGradient = isMarket ? "linear-gradient(135deg, #7c3aed, #6366f1)" : config.gradient;
    const progressPct = ((day - 1) / scenarios.length) * 100;
    const isLow = money < config.startingCash * 0.3;

    return (
      <div style={gS.gameContainer}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
          .choice-btn { transition: transform 0.15s, box-shadow 0.15s; }
          .choice-btn:hover { transform: translateY(-2px); }
          @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
          .scenario-entry { animation: slideUp 0.35s ease-out; }
        `}</style>

        {/* Header */}
        <div style={{ ...gS.gameHeader, borderTop: `4px solid ${config.themeColor}` }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em" }}>
              {activeGame} MODE
            </div>
            <div style={{ fontWeight:900, fontSize:16, color:"#1e293b" }}>
              Day {day} / {scenarios.length}
            </div>
          </div>
          <div style={{
            padding:"8px 18px",
            borderRadius:14,
            background: isLow ? "#fee2e2" : "#d1fae5",
            textAlign:"right",
          }}>
            <div style={{ fontSize:10, fontWeight:700, color: isLow ? "#991b1b" : "#065f46", textTransform:"uppercase" }}>BALANCE</div>
            <div style={{ fontWeight:900, fontSize:20, color: isLow ? "#dc2626" : "#059669" }}>
              {config.currencySymbol}{typeof money === "number" ? Math.round(money).toLocaleString() : money}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div style={gS.progressTrack}>
          <div style={{ ...gS.progressBar, width:`${progressPct}%`, background: themeGradient }} />
        </div>

        {/* Scenario card */}
        <div style={gS.scenarioCard} className="scenario-entry">
          <p style={gS.scenarioText}>{currentScenario.q}</p>

          {tradeMessage && (
            <div style={{
              ...gS.tradeMsg,
              background: tradeMessage.includes("✅") ? "#d1fae5" : tradeMessage.includes("⏭") ? "#f1f5f9" : "#fee2e2",
              borderColor: tradeMessage.includes("✅") ? "#6ee7b7" : tradeMessage.includes("⏭") ? "#e2e8f0" : "#fca5a5",
              color: tradeMessage.includes("✅") ? "#065f46" : tradeMessage.includes("⏭") ? "#475569" : "#991b1b",
            }}>
              {tradeMessage}
            </div>
          )}

          {!waitingNext ? (
            <div style={gS.choiceRow}>
              <button
                className="choice-btn"
                style={{ ...gS.choiceBtn, background: themeGradient }}
                onClick={() => isMarket ? handleMarketChoice(currentScenario.optA, day - 1) : handleChoice(currentScenario.optA[1], currentScenario.msgA)}
              >
                <span style={{ fontWeight:700 }}>{currentScenario.optA[0]}</span>
                <span style={{ opacity:0.85, fontWeight:600 }}>
                  {currentScenario.optA[1] > 0 ? `${config.currencySymbol}${currentScenario.optA[1]}` : "FREE"}
                </span>
              </button>
              <button
                className="choice-btn"
                style={gS.choiceBtnSecondary}
                onClick={() => isMarket ? handleMarketChoice(currentScenario.optB, day - 1) : handleChoice(currentScenario.optB[1], currentScenario.msgB)}
              >
                <span style={{ fontWeight:700, color:"#1e293b" }}>{currentScenario.optB[0]}</span>
                <span style={{ color:"#64748b", fontWeight:600 }}>
                  {currentScenario.optB[1] > 0 ? `${config.currencySymbol}${currentScenario.optB[1]}` : "FREE"}
                </span>
              </button>
            </div>
          ) : (
            <button
              className="choice-btn"
              style={{ ...gS.playBtn, background: themeGradient, marginTop:12, fontSize:15 }}
              onClick={handleNextStep}
            >
              {day >= scenarios.length ? "See Results →" : "Next Decision →"}
            </button>
          )}
        </div>

        <button onClick={() => resetGame(true)} style={gS.quitBtn}>Quit game</button>
      </div>
    );
  }

  // ─── LEAGUE VIEWS ─────────────────────────────────────────────

  if (view === "leagues") {
    const publicLeagues = leagues.filter(l => l.visibility === "public");
    const myLeagues = leagues.filter(l => (l.createdBy === currentUser || l.players.includes(currentUser)) && l.visibility !== "public");

    return (
      <div style={gS.menuContainer}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');`}</style>
        <button onClick={() => setView("menu")} style={gS.backBtn}>← Back to Games</button>

        <div style={{ ...gS.joinBox, flexDirection:"column", gap:0 }}>
          <div style={{ marginBottom:20 }}>
            <h3 style={{ margin:"0 0 6px", fontSize:18, fontWeight:900, color:"#1e293b" }}>🏆 Tournament Hub</h3>
            <p style={{ margin:0, fontSize:13, color:"#6366f1" }}>Create or join private classroom leagues with unique join codes.</p>
          </div>

          <div style={{ display:"flex", gap:10, marginBottom:16 }}>
            <input
              style={{ ...gS.joinInput, flex:2 }}
              placeholder="New League Name..."
              value={newLeagueName}
              onChange={e => setNewLeagueName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCreateLeague()}
            />
            <select style={gS.joinInput} value={leaguePrivacy} onChange={e => setLeaguePrivacy(e.target.value)}>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <button style={gS.joinBtn} onClick={handleCreateLeague}>Create</button>
          </div>

          <div style={{ borderTop:"1px solid #e2e8f0", paddingTop:16 }}>
            <label style={{ fontSize:11, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:8 }}>
              Join via Code
            </label>
            <div style={{ display:"flex", gap:10 }}>
              <input
                style={{ ...gS.joinInput, flex:1, textTransform:"uppercase" }}
                placeholder="e.g. ECON1"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === "Enter" && handleJoinLeague()}
                maxLength={8}
              />
              <button style={gS.joinBtn} onClick={handleJoinLeague}>Join</button>
            </div>
          </div>
        </div>

        <h2 style={{ margin:"32px 0 16px", fontSize:20, fontWeight:900, color:"#0f172a" }}>Open Arena (Public)</h2>
        {publicLeagues.length === 0 && <p style={{ color:"#94a3b8", fontSize:14 }}>No public leagues yet.</p>}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {publicLeagues.map(l => (
            <div key={l.id} style={gS.leagueCard} onClick={() => { setSelectedLeague(l); setView("leagueDetail"); }}>
              <div style={gS.leagueIcon}>🏫</div>
              <div style={{ flex:1 }}>
                <strong style={{ fontSize:15, color:"#1e293b" }}>{l.name}</strong>
                <div style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>Code: <strong>{l.code}</strong> · {l.players.length} player{l.players.length !== 1 ? "s" : ""}</div>
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <button onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(l.code); }} style={gS.copyBtn}>Copy Code</button>
                {l.createdBy === currentUser && (
                  <button onClick={e => { e.stopPropagation(); handleDeleteLeague(l.id); }} style={{ ...gS.copyBtn, background:"#fee2e2", color:"#dc2626", borderColor:"#fca5a5" }}>Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ margin:"32px 0 16px", fontSize:20, fontWeight:900, color:"#0f172a" }}>My Private Leagues</h2>
        {myLeagues.length === 0 && <p style={{ color:"#94a3b8", fontSize:14 }}>Create or join a private league to see it here.</p>}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {myLeagues.map(l => (
            <div key={l.id} style={{ ...gS.leagueCard, border:"2px solid #6366f1" }} onClick={() => { setSelectedLeague(l); setView("leagueDetail"); }}>
              <div style={gS.leagueIcon}>{l.createdBy === currentUser ? "🔒" : "🤝"}</div>
              <div style={{ flex:1 }}>
                <strong style={{ fontSize:15, color:"#1e293b" }}>{l.name} <span style={{ fontSize:11, color:"#6366f1" }}>({l.createdBy === currentUser ? "Owner" : "Member"})</span></strong>
                <div style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>Code: <strong>{l.code}</strong> · {l.players.length} player{l.players.length !== 1 ? "s" : ""}</div>
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <button onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(l.code); }} style={gS.copyBtn}>Copy Code</button>
                {l.createdBy === currentUser && (
                  <button onClick={e => { e.stopPropagation(); handleDeleteLeague(l.id); }} style={{ ...gS.copyBtn, background:"#fee2e2", color:"#dc2626", borderColor:"#fca5a5" }}>Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === "leagueDetail") {
    if (!selectedLeague) { setView("leagues"); return null; }
    return (
      <div style={gS.menuContainer}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');`}</style>
        <button onClick={() => setView("leagues")} style={gS.backBtn}>← All Leagues</button>
        <div style={gS.leagueBanner}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <h1 style={{ margin:"0 0 6px", fontSize:28, fontWeight:900 }}>{selectedLeague.name}</h1>
              <p style={{ margin:0, opacity:0.8, fontSize:14 }}>Signed in as: <strong>{currentUser}</strong> · Code: <strong>{selectedLeague.code}</strong></p>
            </div>
            <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:12, padding:"8px 16px", textAlign:"center" }}>
              <div style={{ fontSize:11, opacity:0.7 }}>PLAYERS</div>
              <div style={{ fontSize:24, fontWeight:900 }}>{selectedLeague.players.length}</div>
            </div>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:20 }}>
          <div style={{ background:"#fff", padding:24, borderRadius:20, boxShadow:"0 4px 20px rgba(0,0,0,0.05)" }}>
            <h3 style={{ margin:"0 0 16px", color:"#0f172a" }}>Live Leaderboard</h3>
            {selectedLeague.players.map((p, i) => {
              const wealth = Math.round(parseFloat(localStorage.getItem(`FIN_SYNC_LEAGUE_${selectedLeague.id}_USER_${p}`) || config.startingCash));
              return (
                <div key={p} style={{ ...gS.leaderRow, background: p === currentUser ? "#eef2ff" : "transparent", padding:"10px 8px", borderRadius:8 }}>
                  <span style={{ fontWeight: p === currentUser ? 700 : 400, color: p === currentUser ? "#4338ca" : "#0f172a" }}>
                    {i + 1}. {p}{p === currentUser ? " (You)" : ""}
                  </span>
                  <span style={{ fontWeight:700, color:"#6366f1" }}>${wealth.toLocaleString()}</span>
                </div>
              );
            })}
          </div>

          <div style={{ background:"#fff", padding:24, borderRadius:20, boxShadow:"0 4px 20px rgba(0,0,0,0.05)" }}>
            <h3 style={{ margin:"0 0 8px", color:"#0f172a" }}>⚡ Blitz Stock Competition</h3>
            <p style={{ fontSize:13, color:"#64748b", marginBottom:20, lineHeight:1.6 }}>
              Compete live against all players in this league. Trade real simulated stocks for 10 minutes. Highest portfolio value wins!
            </p>
            <div style={{ padding:"16px", background:"#eef2ff", borderRadius:12, marginBottom:20 }}>
              {[
                ["⏱", "10-minute live trading session"],
                ["📈", "5 real stocks with live-updating prices"],
                ["🤖", "AI opponents compete alongside you"],
                ["🏆", "Ranked leaderboard updates in real-time"],
              ].map(([icon, text]) => (
                <div key={text} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 0", fontSize:13, color:"#4338ca" }}>
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
            <button
              style={{ ...gS.playBtn, background:"linear-gradient(135deg, #6366f1, #4f46e5)", fontSize:16 }}
              onClick={() => {
                const startCash = config.startingCash;
                const opponentList = selectedLeague.players
                  .filter(p => p !== currentUser)
                  .map(name => ({ name, wealth: startCash }));
                setMoney(startCash);
                moneyRef.current = startCash;
                setGameStats({ buys:0, sells:0, startMoney:startCash });
                setPortfolio({ GIGA:0, VOY:0, MART:0, SPY:0, GLD:0 });
                setOpponents(opponentList);
                initNpcState(opponentList, startCash);
                setLeagueFeed([]);
                setBlitzStocks(INITIAL_STOCKS);
                setSelectedStock(INITIAL_STOCKS[0]);
                setTimeLeft(600);
                setActiveGame("Blitz");
                setPlaying(true);
                setView("menu");
              }}
            >
              🚀 Start Match
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN MENU ────────────────────────────────────────────────

  const games = [
    { id:"Budget", icon:"📊", title:"Survival Budget",   desc:"The cost of living is rising fast. Can you survive a month without going broke?",       grad:"linear-gradient(135deg, #6366f1, #4f46e5)", badge:null },
    { id:"Market", icon:"📈", title:"Stock Master",      desc:"Day trade high-volatility stocks. Beat the S&P 500 benchmark to win.",                  grad:"linear-gradient(135deg, #7c3aed, #6366f1)", badge:null },
    { id:"Crypto", icon:"🪙", title:"Crypto King",       desc:"Wild swings and moon-shots. 10x your money or lose it all in one session.",               grad:"linear-gradient(135deg, #0f172a, #334155)", badge:"High Risk" },
    { id:"Save",   icon:"💰", title:"Savings Sprint",    desc:"Compound interest is the 8th wonder of the world. Test your frugality.",                 grad:"linear-gradient(135deg, #10b981, #059669)", badge:null },
    { id:"Credit", icon:"💳", title:"Credit Crush",      desc:"Navigate high-interest debt and credit scores while trying to stay financially afloat.", grad:"linear-gradient(135deg, #f43f5e, #e11d48)", badge:null },
    { id:"Hustle", icon:"🚀", title:"Side Hustle",       desc:"Invest in equipment and marketing to launch a profitable small business.",               grad:"linear-gradient(135deg, #f59e0b, #d97706)", badge:"New" },
  ];

  const startGame = (gameId) => {
    setMoney(config.startingCash);
    moneyRef.current = config.startingCash;
    setDay(1);
    setActiveGame(gameId);
    setPlaying(true);
    setTradeMessage(null);
    setWaitingNext(false);
    setGameStats({ buys:0, sells:0, startMoney:config.startingCash });
  };

  return (
    <div style={gS.pageWrapper}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .game-card { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease; animation: fadeIn 0.4s ease-out both; }
        .game-card:hover { transform: translateY(-8px) scale(1.01); box-shadow: 0 24px 48px rgba(0,0,0,0.15) !important; }
        .promo-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .promo-card:hover { transform: translateY(-4px); box-shadow: 0 16px 32px rgba(0,0,0,0.1) !important; }
        .hero-card { animation: fadeIn 0.5s ease-out both; }
      `}</style>

      {vocabPopup.visible && (
        <div ref={vocabRef} style={{ ...gS.vocabPopup, top:vocabPopup.y + 12, left:Math.min(vocabPopup.x + 12, window.innerWidth - 240) }}>
          <strong style={{ fontSize:13, color:"#1e293b" }}>{VOCAB_HELPER[vocabPopup.key]?.split(":")[0]}</strong>
          <p style={{ margin:"6px 0 0", fontSize:12, color:"#475569", lineHeight:1.5 }}>
            {VOCAB_HELPER[vocabPopup.key]?.split(":").slice(1).join(":").trim()}
          </p>
        </div>
      )}

      <div style={gS.menuContainer}>
        {/* Header */}
        <div style={gS.menuHeader}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:12 }}>
            <div style={{
              width:48, height:48, borderRadius:14,
              background:"linear-gradient(135deg, #6366f1, #8b5cf6)",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:24,
              boxShadow:"0 8px 20px rgba(99,102,241,0.35)",
            }}>🎮</div>
            <h2 style={gS.menuTitle}>Financial Games</h2>
          </div>
          <p style={gS.menuSub}>
            Learn real money skills through simulation · Playing as <strong>{currentUser}</strong>
          </p>
        </div>

        {/* ─── HIGHLIGHTED / FEATURED SECTION ─── */}
        <div style={{ marginBottom:40 }}>
          {/* PRIMARY: Classroom Leagues */}
          <div className="promo-card hero-card" style={{ 
            ...gS.cardPromo, 
            background: "linear-gradient(135deg, #1e1b4b, #312e81)", 
            color: "#fff",
            padding: "40px",
            border: "4px solid #6366f1",
            boxShadow: "0 20px 40px rgba(99,102,241,0.25)",
            display: "flex",
            alignItems: "center",
            gap: "32px",
            marginBottom: "20px"
          }} onClick={() => setView("leagues")}>
            <div style={{ fontSize:80, animation:"float 4s ease-in-out infinite" }}>🏆</div>
            <div style={{ flex: 1 }}>
              <div style={{ display:"inline-block", background:"#6366f1", padding:"4px 12px", borderRadius:100, fontSize:12, fontWeight:900, marginBottom:12 }}>MULTIPLAYER ARENA</div>
              <div style={{ ...gS.promoTitle, color:"#fff", fontSize:32, letterSpacing:"-0.5px" }}>Classroom Leagues</div>
              <p style={{ ...gS.promoText, color:"#e0e7ff", fontSize:16, maxWidth:600 }}>
                The ultimate test. Create or join a private room and compete live in 10-minute high-speed trading tournaments against your classmates.
              </p>
              <button style={{ ...gS.promoBtn, background:"#fff", color:"#312e81", padding:"14px 32px", fontSize:16, marginTop:8 }}>Join Tournament Hub →</button>
            </div>
          </div>

          {/* SECONDARY: Salary Simulator */}
          <div className="promo-card" style={{ 
            ...gS.cardPromo, 
            display:"flex", 
            alignItems:"center", 
            gap:20, 
            background:"#fff", 
            border:"1px solid #e2e8f0" 
          }} onClick={() => onNavigate?.("Salary")}>
            <div style={{ fontSize:40 }}>💼</div>
            <div style={{ flex:1 }}>
              <div style={{ ...gS.promoTitle, margin:0 }}>Salary Simulator</div>
              <p style={{ ...gS.promoText, margin:0 }}>Map out a full career path. See how your savings and investments grow across 40 years of decisions.</p>
            </div>
            <button style={{ ...gS.promoBtn, background:"linear-gradient(135deg, #10b981, #059669)", whiteSpace:"nowrap" }}>Open Simulator →</button>
          </div>
        </div>

        {/* ─── REMAINING GAMES SECTION ─── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ height: 1, flex: 1, background: "#e2e8f0" }}></div>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Single Player Modes</h3>
          <div style={{ height: 1, flex: 1, background: "#e2e8f0" }}></div>
        </div>

        <div style={gS.gamesGrid}>
          {games.map((g, idx) => (
            <div key={g.id} className="game-card" style={{ ...gS.gameCard, animationDelay:`${idx * 0.07}s` }}>
              {g.badge && (
                <div style={{
                  position:"absolute", top:12, right:12, zIndex:2,
                  background:"rgba(255,255,255,0.2)", backdropFilter:"blur(4px)",
                  borderRadius:100, padding:"3px 10px", fontSize:10, fontWeight:700, color:"#fff",
                  border:"1px solid rgba(255,255,255,0.3)",
                }}>{g.badge}</div>
              )}
              <div style={{ ...gS.gameCardTop, background:g.grad, position:"relative" }}>
                <div style={{ fontSize:44, animation:"float 3s ease-in-out infinite" }}>{g.icon}</div>
                <h3 style={{ margin:"10px 0 0", color:"#fff", fontSize:19, fontWeight:900, letterSpacing:"-0.3px" }}>{g.title}</h3>
              </div>
              <div style={gS.gameCardBottom}>
                <p style={gS.gameCardDesc}>{g.desc}</p>
                <button
                  style={{ ...gS.playBtn, background:g.grad, fontSize:14 }}
                  onClick={() => startGame(g.id)}
                >
                  Play Now →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────

const gS = {
  vocabPopup: {
    position:"fixed", zIndex:20000, background:"#fff", padding:"14px 18px", borderRadius:14,
    width:230, boxShadow:"0 12px 40px rgba(0,0,0,0.15)", border:"1px solid #6366f1",
  },
  modalOverlay: {
    position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.75)",
    display:"flex", alignItems:"center", justifyContent:"center", zIndex:10000, padding:20,
  },
  modalContent: {
    background:"#fff", width:"100%", maxWidth:720, borderRadius:24, padding:"32px",
    maxHeight:"90vh", overflowY:"auto", fontFamily:"'DM Sans', system-ui, sans-serif",
  },
  modalHeader: { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 },
  closeBtn: {
    background:"#f1f5f9", border:"none", borderRadius:10, width:36, height:36,
    fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700,
  },
  pageWrapper: { minHeight:"100vh", background:"#f8fafc", paddingBottom:60 },
  menuContainer: { maxWidth:1000, margin:"0 auto", padding:"40px 20px", fontFamily:"'DM Sans', system-ui, sans-serif" },
  menuHeader: { marginBottom:36, textAlign:"center" },
  menuTitle: { fontSize:34, fontWeight:900, color:"#0f172a", margin:0, letterSpacing:"-1px" },
  menuSub: { color:"#64748b", fontSize:15, margin:"8px 0 0" },
  gamesGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(285px, 1fr))", gap:24 },
  gameCard: {
    borderRadius:22, overflow:"hidden", background:"#fff",
    boxShadow:"0 8px 24px rgba(0,0,0,0.08)", cursor:"pointer", position:"relative",
  },
  gameCardTop: { padding:"36px 20px", textAlign:"center" },
  gameCardBottom: { padding:"22px 22px 24px" },
  gameCardDesc: { fontSize:13, color:"#475569", lineHeight:"1.55", height:52, marginBottom:18, overflow:"hidden" },
  playBtn: {
    width:"100%", padding:"13px", borderRadius:14, border:"none", color:"#fff",
    fontWeight:800, cursor:"pointer", fontFamily:"'DM Sans', system-ui, sans-serif",
  },
  tradeBtn: {
    flex:1, padding:"13px", borderRadius:12, border:"none", color:"#fff",
    fontWeight:800, cursor:"pointer", fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:14,
  },
  gameContainer: { maxWidth:520, margin:"50px auto", padding:"0 20px" },
  gameHeader: {
    display:"flex", justifyContent:"space-between", alignItems:"center",
    background:"#fff", padding:"14px 20px", borderRadius:20,
    boxShadow:"0 4px 20px rgba(0,0,0,0.06)", marginBottom:12,
  },
  progressTrack: { height:6, background:"#e2e8f0", borderRadius:10, overflow:"hidden", marginBottom:20 },
  progressBar: { height:"100%", transition:"width 0.4s cubic-bezier(0.4,0,0.2,1)", borderRadius:10 },
  scenarioCard: { background:"#fff", padding:"30px", borderRadius:26, boxShadow:"0 16px 40px rgba(0,0,0,0.09)" },
  scenarioText: { fontSize:19, fontWeight:800, color:"#1e293b", marginBottom:22, lineHeight:1.45 },
  tradeMsg: { padding:"14px 16px", borderRadius:14, border:"2px solid", marginBottom:18, fontSize:13, fontWeight:600, lineHeight:1.5 },
  choiceRow: { display:"flex", flexDirection:"column", gap:12 },
  choiceBtn: {
    display:"flex", justifyContent:"space-between", alignItems:"center",
    padding:"17px 20px", borderRadius:15, border:"none", color:"#fff", cursor:"pointer", fontWeight:700, fontSize:14,
  },
  choiceBtnSecondary: {
    display:"flex", justifyContent:"space-between", alignItems:"center",
    padding:"17px 20px", borderRadius:15, border:"2px solid #e2e8f0", background:"#fff",
    cursor:"pointer", fontWeight:700, fontSize:14,
  },
  quitBtn: { display:"block", margin:"20px auto 0", background:"none", border:"none", color:"#94a3b8", fontWeight:700, cursor:"pointer", fontSize:13 },
  resultContainer: { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:20, background:"#0f172a" },
  resultCard: { maxWidth:440, width:"100%", padding:"40px 36px", borderRadius:28, textAlign:"center", color:"#fff", boxShadow:"0 30px 60px rgba(0,0,0,0.4)" },
  resultEmoji: { fontSize:64, marginBottom:14 },
  resultTitle: { fontSize:36, fontWeight:900, margin:"0 0 10px", letterSpacing:"-1px" },
  resultDetails: { background:"rgba(255,255,255,0.12)", padding:"20px", borderRadius:18, textAlign:"left", marginBottom:20 },
  statRow: { display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.1)", fontSize:14 },
  actionBtn: {
    width:"100%", padding:"16px", borderRadius:16, border:"none", fontSize:15, fontWeight:900,
    cursor:"pointer", background:"#fff", color:"#0f172a", boxShadow:"0 4px 16px rgba(0,0,0,0.2)",
    fontFamily:"'DM Sans', system-ui, sans-serif",
    transition:"transform 0.15s, box-shadow 0.15s",
  },
  cardPromo: {
    background:"#fff", padding:24, borderRadius:22,
    boxShadow:"0 8px 24px rgba(0,0,0,0.06)", cursor:"pointer",
  },
  promoTitle: { fontSize:18, fontWeight:900, marginBottom:8, color:"#0f172a" },
  promoText: { fontSize:13, color:"#64748b", marginBottom:18, lineHeight:1.6 },
  promoBtn: {
    color:"#fff", border:"none", padding:"11px 22px", borderRadius:12,
    fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:"'DM Sans', system-ui, sans-serif",
  },
  joinBox: {
    background:"#eef2ff", border:"2px solid #6366f1", padding:"24px 28px",
    borderRadius:22, marginBottom:28, boxShadow:"0 4px 16px rgba(99,102,241,0.1)",
  },
  joinInput: {
    flex:1, padding:"12px 16px", borderRadius:12,
    border:"2px solid #e2e8f0", fontSize:15, fontWeight:600,
    fontFamily:"'DM Sans', system-ui, sans-serif", outline:"none", background:"#fff",
  },
  joinBtn: {
    background:"#0f172a", color:"#fff", padding:"12px 24px",
    borderRadius:12, border:"none", fontWeight:800, cursor:"pointer",
    fontSize:14, fontFamily:"'DM Sans', system-ui, sans-serif",
  },
  copyBtn: {
    padding:"6px 14px", borderRadius:8, border:"1px solid #e2e8f0",
    background:"#f8fafc", fontSize:11, fontWeight:700, cursor:"pointer", color:"#475569",
  },
  leagueCard: {
    background:"#fff", padding:"16px 20px", borderRadius:16,
    display:"flex", alignItems:"center", gap:14, cursor:"pointer",
    border:"2px solid #f1f5f9", boxShadow:"0 2px 8px rgba(0,0,0,0.04)",
    transition:"border-color 0.15s, box-shadow 0.15s",
  },
  leagueIcon: {
    fontSize:26, background:"#f1f5f9", width:52, height:52,
    display:"flex", alignItems:"center", justifyContent:"center", borderRadius:14, flexShrink:0,
  },
  backBtn: {
    background:"none", border:"none", color:"#6366f1", fontWeight:700,
    cursor:"pointer", marginBottom:16, fontSize:14, padding:0,
    fontFamily:"'DM Sans', system-ui, sans-serif",
  },
  leagueBanner: {
    background:"linear-gradient(135deg, #6366f1, #4f46e5)", color:"#fff",
    padding:"32px 36px", borderRadius:22, marginBottom:24,
    boxShadow:"0 12px 32px rgba(99,102,241,0.35)",
  },
  leaderRow: {
    display:"flex", justifyContent:"space-between", alignItems:"center",
    padding:"10px 0", borderBottom:"1px solid #f1f5f9", fontSize:14,
  },
};