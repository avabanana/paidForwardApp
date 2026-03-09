// Example updated scenario structure
// { q: "Cookie Sale: 60% success rate!", optA: ["Bake", 15], optB: ["Skip", 0], risk: 0.6 }

const handleChoice = (cost) => {
  let outcomeMoney = money;
  const currentRisk = currentScenario.risk || 0.5; // Default to 50/50

  if (activeGame === 'Market') {
    const success = Math.random() < currentRisk;
    // Reward is 2x cost on success, but you lose the cost on failure
    outcomeMoney = success ? money + cost : money - cost; 
  } else if (activeGame === 'Save') {
    if (cost === 0) {
      const bonus = Math.max(10, Math.round(config.startingCash * 0.05));
      outcomeMoney = money + bonus;
    } else {
      outcomeMoney = money - cost;
    }
  } else {
    outcomeMoney = cost === 0 ? money + 10 : money - cost;
  }

  // Final Balance Check
  if (outcomeMoney <= 0) {
    setMoney(0);
    setGameResult('lost');
    return;
  }

  setMoney(outcomeMoney);

  if (day < scenarios.length) {
    setDay(prev => prev + 1);
  } else {
    // Win Logic
    const winThreshold = activeGame === 'Market' 
      ? config.startingCash * 1.1 
      : activeGame === 'Save' 
      ? config.startingCash * 1.2 
      : config.startingCash * 0.8;

    setGameResult(outcomeMoney >= winThreshold ? 'won' : 'lost');
  }
};