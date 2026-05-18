import React, { useState, useEffect } from "react";

const LatteFactorCalculator = () => {
  const [dailyCost, setDailyCost] = useState("");
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (!dailyCost || parseFloat(dailyCost) <= 0) {
      setResults(null);
      return;
    }

    const cost = parseFloat(dailyCost);
    const dailyInvested = cost;
    const yearlyInvested = dailyInvested * 365;
    const annualReturnRate = 0.07; // 7% annual return

    const tenYearFutureValue = yearlyInvested * (((1 + annualReturnRate) ** 10 - 1) / annualReturnRate);

    setResults({
      daily: cost,
      yearly: yearlyInvested,
      tenYear: tenYearFutureValue,
      totalContributed: yearlyInvested * 10
    });
  }, [dailyCost]);

  const styles = {
    container: {
      padding: "20px",
      fontFamily: "'Inter', system-ui, sans-serif",
      background: "#fff",
      borderRadius: "16px",
      border: "1px solid #e2e8f0",
      marginBottom: "20px"
    },
    title: {
      fontSize: "18px",
      fontWeight: "700",
      color: "#1e293b",
      margin: "0 0 16px 0"
    },
    description: {
      fontSize: "13px",
      color: "#64748b",
      marginBottom: "16px",
      lineHeight: "1.6"
    },
    inputGroup: {
      marginBottom: "16px",
      display: "flex",
      gap: "12px",
      alignItems: "flex-end"
    },
    input: {
      flex: 1,
      padding: "10px 12px",
      borderRadius: "8px",
      border: "1px solid #cbd5e1",
      fontSize: "14px",
      fontFamily: "inherit"
    },
    resultsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
      gap: "12px",
      marginTop: "16px"
    },
    resultCard: {
      background: "#f8fafc",
      borderRadius: "12px",
      padding: "14px",
      border: "1px solid #e2e8f0"
    },
    resultLabel: {
      fontSize: "12px",
      color: "#64748b",
      fontWeight: "600",
      textTransform: "uppercase",
      marginBottom: "4px"
    },
    resultValue: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#1e293b"
    },
    warning: {
      background: "#fef3c7",
      borderRadius: "8px",
      padding: "12px",
      fontSize: "13px",
      color: "#92400e",
      marginTop: "16px"
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>☕ Latte Factor Calculator</h3>
      <p style={styles.description}>
        Enter your daily habit cost (coffee, subscription, etc.) to see its 10-year impact with 7% compound interest.
      </p>

      <div style={styles.inputGroup}>
        <input
          type="number"
          placeholder="Daily cost (e.g., 5)"
          value={dailyCost}
          onChange={(e) => setDailyCost(e.target.value)}
          min="0"
          step="0.01"
          style={styles.input}
        />
        <span style={{ fontSize: "14px", color: "#64748b", whiteSpace: "nowrap" }}>per day</span>
      </div>

      {results && (
        <>
          <div style={styles.resultsGrid}>
            <div style={styles.resultCard}>
              <div style={styles.resultLabel}>Daily Habit</div>
              <div style={styles.resultValue}>${results.daily.toFixed(2)}</div>
            </div>
            <div style={styles.resultCard}>
              <div style={styles.resultLabel}>Yearly Cost</div>
              <div style={styles.resultValue}>${results.yearly.toFixed(0)}</div>
            </div>
            <div style={styles.resultCard}>
              <div style={styles.resultLabel}>10-Year Value</div>
              <div style={styles.resultValue}>${results.tenYear.toFixed(0)}</div>
            </div>
            <div style={styles.resultCard}>
              <div style={styles.resultLabel}>Total Invested</div>
              <div style={styles.resultValue}>${results.totalContributed.toFixed(0)}</div>
            </div>
          </div>

          <div style={styles.warning}>
            <strong>💡 Impact:</strong> Over 10 years, this daily habit could grow to <strong>${results.tenYear.toFixed(0)}</strong> if invested instead!
          </div>
        </>
      )}
    </div>
  );
};

export default LatteFactorCalculator;
