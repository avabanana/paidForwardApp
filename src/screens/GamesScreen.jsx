import React, { useState } from "react";

export default function GamesScreen({ userTier }) {
  const [activeGame, setActiveGame] = useState(null); // 'Budget' or 'Market'
  const [playing, setPlaying] = useState(false);
  const [money, setMoney] = useState(0);
  const [day, setDay] = useState(1);
  const [gameResult, setGameResult] = useState(null); // 'won' or 'lost'

  const tierSettings = {
    elementary: {
      currencySymbol: "⭐",
      startingCash: 50,
      totalDays: 4,
      icon: "🦁",
      themeColor: "#fbbf24",
      scenarios: [
        { q: "You found a cool toy for 20⭐! Do you buy it or keep your stars for a bigger prize?", optA: ["Buy Toy", 20], optB: ["Save Stars", 0] },
        { q: "You're thirsty! Buy a fancy juice for 10⭐ or drink water for free?", optA: ["Fancy Juice", 10], optB: ["Free Water", 0] },
        { q: "A friend wants to trade stickers. Pay 5⭐ for a rare one or keep your stars?", optA: ["Rare Sticker", 5], optB: ["Keep Stars", 0] },
        { q: "Oh no! You lost a library book. Pay 15⭐ to replace it or use your 'OOPS' coupon?", optA: ["Pay Stars", 15], optB: ["Use Coupon", 0] }
      ],
      marketScenarios: [
        { q: "Lemonade Stand: Spend 10⭐ on lemons. 50/50 chance to double it!", optA: ["Sell Juice", 10], optB: ["Keep Lemons", 0] },
        { q: "Cookie Sale: Spend 20⭐ on chocolate. Can you bake a profit?", optA: ["Bake Cookies", 20], optB: ["Don't Bake", 0] }
      ]
    },
    middle: {
      currencySymbol: "$",
      startingCash: 150,
      totalDays: 4,
      icon: " skateboard",
      themeColor: "#10b981",
      scenarios: [
        { q: "Everyone is wearing 'Cool-Kicks'. They cost $80. Buy them or stick with your current shoes?", optA: ["Buy Kicks", 80], optB: ["Keep Shoes", 0] },
        { q: "Lunch time! Pizza with friends is $15, or a packed lunch from home is free?", optA: ["Pizza Party", 15], optB: ["Packed Lunch", 0] },
        { q: "Your phone screen cracked! Fix it for $40 or live with the cracks for now?", optA: ["Fix Screen", 40], optB: ["Live with it", 0] },
        { q: "A new video game just dropped for $30. Buy it now or wait for a sale?", optA: ["Buy Now", 30], optB: ["Wait for Sale", 0] }
      ],
      marketScenarios: [
        { q: "Resell Sneakers: Buy a pair for $100. They might sell for $200 or $50.", optA: ["Buy/Flip", 100], optB: ["Pass", 0] },
        { q: "Graphic Tees: Spend $50 to print shirts. Big profit or no sales?", optA: ["Print Shirts", 50], optB: ["Don't Risk It", 0] }
      ]
    },
    adult: {
      currencySymbol: "$",
      startingCash: 500,
      totalDays: 10,
      icon: "💼",
      themeColor: "#2563eb",
      scenarios: [
        { q: "Rent is due! Pay $300 for your studio or $150 for a shared room with a messy roommate?", optA: ["Studio", 300], optB: ["Shared Room", 150] },
        { q: "Transportation: Monthly subway pass for $80 or pay-per-ride (estimated $110)?", optA: ["Monthly Pass", 80], optB: ["Pay-Per-Ride", 110] },
        { q: "Groceries: Buy name-brand organic for $90 or store-brand basics for $40?", optA: ["Organic", 90], optB: ["Basics", 40] },
        { q: "Emergency! Your car needs a new tire. Pay $120 for a new one or $50 for a used 'patch'?", optA: ["New Tire", 120], optB: ["Used Patch", 50] },
        { q: "Side Hustle: Spend $40 on supplies to start a craft business or save the cash?", optA: ["Start Business", 40], optB: ["Save Cash", 0] },
        { q: "Insurance: Pay $60 for basic health coverage or risk it (potential penalty later)?", optA: ["Pay Coverage", 60], optB: ["Risk It", 0] },
        { q: "Utilities: Pay $70 for high-speed fiber or $35 for basic 'slow' internet?", optA: ["Fiber", 70], optB: ["Basic", 35] },
        { q: "Social: Your best friend is getting married. Spend $100 on a gift or $20 on a nice card?", optA: ["Buy Gift", 100], optB: ["Send Card", 20] },
        { q: "Investment: Put $100 into a Retirement fund (locks money away) or keep it in your pocket?", optA: ["Invest", 100], optB: ["Keep Cash", 0] },
        { q: "Tax Season: Pay $50 for a pro accountant to find deductions or $0 to do it yourself?", optA: ["Hire Pro", 50], optB: ["DIY", 0] }
      ],
      marketScenarios: [
        { q: "Crypto Swing: Invest $200 in a volatile coin. 50% chance to triple it or lose it all!", optA: ["Invest $200", 200], optB: ["Stay Safe", 0] },
        { q: "Stock Option: Buy a contract for $150. High reward, but it could expire worthless.", optA: ["Buy Call", 150], optB: ["Skip", 0] }
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

    if (outcomeMoney < 0) {
      setMoney(0);
      setGameResult('lost');
      return;
    }
    
    const maxDays = scenarios.length;
    if (day < maxDays) {
      setMoney(outcomeMoney);
      setDay(day + 1);
    } else {
      setMoney(outcomeMoney);
      setGameResult('won');
    }
  };

  const resetGame = () => {
    setPlaying(false);
    setGameResult(null);
    setDay(1);
    setActiveGame(null);
  };

  if (gameResult) {
    return (
      <div style={gStyles.menuContainer}>
        <div style={{...gStyles.promoCard, borderTop: `8px solid ${gameResult === 'won' ? '#10b981' : '#ef4444'}`}}>
          <div style={{fontSize: '60px'}}>{gameResult === 'won' ? '🎉' : '💀'}</div>
          <h2 style={{fontSize: '32px', margin: '10px 0'}}>{gameResult === 'won' ? 'Victory!' : 'Broke!'}</h2>
          <p style={{fontSize: '18px', marginBottom: '20px'}}>Final Balance: {config.currencySymbol}{money}</p>
          <button style={{...gStyles.playBtn, background: config.themeColor}} onClick={resetGame}>Try Again / Exit</button>
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
            <h3>{config.gameName}</h3>
            <button style={{...gStyles.playBtn, background: config.themeColor}} onClick={() => { setMoney(config.startingCash); setActiveGame('Budget'); setPlaying(true); }}>Play Budgeting</button>
          </div>
          
          {/* Game 2: NEW Market Game */}
          <div style={{...gStyles.promoCard, borderTop: `8px solid #8b5cf6`, width: '300px'}}>
            <div style={gStyles.gameIcon}>📈</div>
            <h3>Market Mania</h3>
            <button style={{...gStyles.playBtn, background: '#8b5cf6'}} onClick={() => { setMoney(config.startingCash); setActiveGame('Market'); setPlaying(true); }}>Play Investing</button>
          </div>
       </div>
    </div>
  );
}

const gStyles = {
  menuContainer: { display: 'flex', justifyContent: 'center', padding: '40px 20px' },
  promoCard: { background: '#fff', padding: '30px', borderRadius: '32px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.06)' },
  gameIcon: { fontSize: '50px', marginBottom: '10px' },
  playBtn: { width: '100%', padding: '15px', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' },
  gameContainer: { maxWidth: '500px', margin: '0 auto' },
  statusBar: { display: 'flex', justifyContent: 'space-between', padding: '20px', background: '#fff', borderRadius: '20px', marginBottom: '20px' },
  stat: { fontWeight: '900', fontSize: '18px' },
  actionCard: { background: '#fff', padding: '30px', borderRadius: '30px', textAlign: 'center' },
  scenarioTitle: { fontSize: '12px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' },
  scenarioText: { color: '#1e293b', marginBottom: '30px', fontSize: '18px', fontWeight: '700' },
  choiceRow: { display: 'flex', flexDirection: 'column', gap: '10px' },
  choiceBtn: { padding: '15px', color: '#fff', border: 'none', borderRadius: '15px', cursor: 'pointer' },
  choiceBtnSecondary: { padding: '15px', background: '#f1f5f9', border: 'none', borderRadius: '15px', cursor: 'pointer' },
  quitBtn: { display: 'block', margin: '20px auto', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }
};