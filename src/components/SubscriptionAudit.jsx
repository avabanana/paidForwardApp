import React, { useState, useEffect } from "react";

const SubscriptionAudit = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [name, setName] = useState("");
  const [monthlyCost, setMonthlyCost] = useState("");
  const [errors, setErrors] = useState({});

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("paidforward-subscriptions");
      if (saved) {
        setSubscriptions(JSON.parse(saved));
      }
    } catch {
      // ignore storage failures
    }
  }, []);

  // Save to localStorage whenever subscriptions change
  useEffect(() => {
    try {
      window.localStorage.setItem("paidforward-subscriptions", JSON.stringify(subscriptions));
    } catch {
      // ignore storage failures
    }
  }, [subscriptions]);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Subscription name is required";
    }
    if (monthlyCost === "") {
      newErrors.monthlyCost = "Monthly cost is required";
    } else if (parseFloat(monthlyCost) < 0) {
      newErrors.monthlyCost = "Cost cannot be negative";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSubscription = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newSub = {
      id: Date.now(),
      name: name.trim(),
      monthlyCost: parseFloat(monthlyCost)
    };

    setSubscriptions([...subscriptions, newSub]);
    setName("");
    setMonthlyCost("");
    setErrors({});
  };

  const handleDeleteSubscription = (id) => {
    setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
  };

  const totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.monthlyCost, 0);
  const totalAnnual = totalMonthly * 12;

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
    form: {
      background: "#f8fafc",
      borderRadius: "12px",
      padding: "14px",
      border: "1px solid #e2e8f0",
      marginBottom: "16px"
    },
    formRow: {
      display: "flex",
      gap: "12px",
      marginBottom: "12px"
    },
    input: {
      flex: 1,
      padding: "10px 12px",
      borderRadius: "8px",
      border: "1px solid #cbd5e1",
      fontSize: "14px",
      fontFamily: "inherit"
    },
    inputError: {
      borderColor: "#ef4444"
    },
    button: {
      padding: "10px 20px",
      borderRadius: "8px",
      border: "none",
      background: "#2563eb",
      color: "#fff",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px"
    },
    errorMessage: {
      fontSize: "12px",
      color: "#ef4444",
      marginTop: "4px"
    },
    totalSection: {
      background: "#f0f4ff",
      borderRadius: "12px",
      padding: "14px",
      marginBottom: "16px",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
      gap: "12px"
    },
    totalCard: {
      textAlign: "center"
    },
    totalLabel: {
      fontSize: "12px",
      color: "#64748b",
      fontWeight: "600",
      marginBottom: "4px"
    },
    totalValue: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#1e3a8a"
    },
    subList: {
      display: "flex",
      flexDirection: "column",
      gap: "10px"
    },
    subCard: {
      background: "#f8fafc",
      borderRadius: "10px",
      padding: "12px",
      border: "1px solid #e2e8f0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    subInfo: {
      display: "flex",
      justifyContent: "space-between",
      flex: 1,
      gap: "16px"
    },
    subName: {
      fontWeight: "600",
      color: "#1e293b"
    },
    subCost: {
      color: "#64748b",
      fontSize: "14px"
    },
    deleteButton: {
      background: "#fee2e2",
      color: "#991b1b",
      border: "none",
      borderRadius: "6px",
      padding: "6px 12px",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "600"
    },
    emptyState: {
      textAlign: "center",
      color: "#94a3b8",
      padding: "24px",
      fontSize: "14px"
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📱 Subscription Audit</h3>

      <form style={styles.form} onSubmit={handleAddSubscription}>
        <div style={styles.formRow}>
          <input
            type="text"
            placeholder="Subscription (e.g., Netflix)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              ...styles.input,
              ...(errors.name ? styles.inputError : {})
            }}
          />
          <input
            type="number"
            placeholder="Monthly cost ($)"
            value={monthlyCost}
            onChange={(e) => setMonthlyCost(e.target.value)}
            min="0"
            step="0.01"
            style={{
              ...styles.input,
              flex: "0.7",
              ...(errors.monthlyCost ? styles.inputError : {})
            }}
          />
          <button type="submit" style={styles.button}>
            Add
          </button>
        </div>
        {(errors.name || errors.monthlyCost) && (
          <div>
            {errors.name && <div style={styles.errorMessage}>{errors.name}</div>}
            {errors.monthlyCost && <div style={styles.errorMessage}>{errors.monthlyCost}</div>}
          </div>
        )}
      </form>

      {subscriptions.length > 0 && (
        <div style={styles.totalSection}>
          <div style={styles.totalCard}>
            <div style={styles.totalLabel}>Monthly Total</div>
            <div style={styles.totalValue}>${totalMonthly.toFixed(2)}</div>
          </div>
          <div style={styles.totalCard}>
            <div style={styles.totalLabel}>Annual Total</div>
            <div style={styles.totalValue}>${totalAnnual.toFixed(2)}</div>
          </div>
          <div style={styles.totalCard}>
            <div style={styles.totalLabel}>Subscriptions</div>
            <div style={styles.totalValue}>{subscriptions.length}</div>
          </div>
        </div>
      )}

      <div style={subscriptions.length === 0 ? styles.emptyState : styles.subList}>
        {subscriptions.length === 0 ? (
          <p>No subscriptions yet. Add one to track your recurring expenses.</p>
        ) : (
          subscriptions.map((sub) => (
            <div key={sub.id} style={styles.subCard}>
              <div style={styles.subInfo}>
                <span style={styles.subName}>{sub.name}</span>
                <span style={styles.subCost}>${sub.monthlyCost.toFixed(2)}/month</span>
              </div>
              <button
                onClick={() => handleDeleteSubscription(sub.id)}
                style={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SubscriptionAudit;
