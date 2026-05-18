import React, { useState, useEffect } from "react";

const FinancialMoodJournal = () => {
  const [entries, setEntries] = useState([]);
  const [mood, setMood] = useState("😐");
  const [spending, setSpending] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});

  const moods = [
    { emoji: "😤", label: "Stressed", color: "#fee2e2" },
    { emoji: "😟", label: "Worried", color: "#fed7aa" },
    { emoji: "😐", label: "Neutral", color: "#fef3c7" },
    { emoji: "🙂", label: "Okay", color: "#dbeafe" },
    { emoji: "😄", label: "Happy", color: "#dcfce7" }
  ];

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("paidforward-mood-journal");
      if (saved) {
        setEntries(JSON.parse(saved));
      }
    } catch {
      // ignore storage failures
    }
  }, []);

  // Save to localStorage whenever entries change
  useEffect(() => {
    try {
      window.localStorage.setItem("paidforward-mood-journal", JSON.stringify(entries));
    } catch {
      // ignore storage failures
    }
  }, [entries]);

  const validateForm = () => {
    const newErrors = {};
    if (spending === "") {
      newErrors.spending = "Spending amount is required";
    } else if (parseFloat(spending) < 0) {
      newErrors.spending = "Spending cannot be negative";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      }),
      mood,
      spending: parseFloat(spending),
      notes: notes.trim(),
      timestamp: new Date().toISOString()
    };

    setEntries([newEntry, ...entries]);
    setMood("😐");
    setSpending("");
    setNotes("");
    setErrors({});
  };

  const handleDeleteEntry = (id) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const moodEmoji = moods.find((m) => m.emoji === mood);
  const totalSpent = entries.reduce((sum, entry) => sum + entry.spending, 0);
  const averageSpend = entries.length > 0 ? totalSpent / entries.length : 0;

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
      padding: "16px",
      border: "1px solid #e2e8f0",
      marginBottom: "16px"
    },
    moodSelector: {
      display: "flex",
      gap: "8px",
      marginBottom: "12px",
      flexWrap: "wrap"
    },
    moodButton: {
      padding: "12px 16px",
      borderRadius: "8px",
      border: "2px solid #e2e8f0",
      background: "#fff",
      cursor: "pointer",
      fontSize: "20px",
      transition: "all 0.2s"
    },
    moodButtonActive: {
      borderColor: "#2563eb",
      background: "#dbeafe"
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
    textarea: {
      flex: 1,
      padding: "10px 12px",
      borderRadius: "8px",
      border: "1px solid #cbd5e1",
      fontSize: "14px",
      fontFamily: "inherit",
      minHeight: "80px",
      resize: "vertical"
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
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
      gap: "12px",
      marginBottom: "16px"
    },
    statCard: {
      background: "#f8fafc",
      borderRadius: "10px",
      padding: "12px",
      border: "1px solid #e2e8f0",
      textAlign: "center"
    },
    statLabel: {
      fontSize: "12px",
      color: "#64748b",
      fontWeight: "600",
      marginBottom: "4px"
    },
    statValue: {
      fontSize: "18px",
      fontWeight: "700",
      color: "#1e293b"
    },
    entryList: {
      display: "flex",
      flexDirection: "column",
      gap: "12px"
    },
    entryCard: {
      background: "#f8fafc",
      borderRadius: "12px",
      padding: "14px",
      border: "1px solid #e2e8f0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    },
    entryContent: {
      flex: 1
    },
    entryHeader: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "8px"
    },
    entryMood: {
      fontSize: "24px"
    },
    entryDate: {
      fontWeight: "600",
      color: "#1e293b"
    },
    entrySpending: {
      fontSize: "13px",
      color: "#64748b",
      marginBottom: "6px"
    },
    entryNotes: {
      fontSize: "13px",
      color: "#475569",
      fontStyle: "italic"
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
      <h3 style={styles.title}>💭 Financial Mood Journal</h3>

      <form style={styles.form} onSubmit={handleAddEntry}>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>
            How do you feel about money today?
          </label>
          <div style={styles.moodSelector}>
            {moods.map((m) => (
              <button
                key={m.emoji}
                type="button"
                onClick={() => setMood(m.emoji)}
                style={{
                  ...styles.moodButton,
                  ...(mood === m.emoji ? styles.moodButtonActive : {})
                }}
                title={m.label}
              >
                {m.emoji}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.formRow}>
          <input
            type="number"
            placeholder="Amount spent today ($)"
            value={spending}
            onChange={(e) => setSpending(e.target.value)}
            min="0"
            step="0.01"
            style={{
              ...styles.input,
              ...(errors.spending ? styles.inputError : {})
            }}
          />
        </div>
        {errors.spending && <div style={styles.errorMessage}>{errors.spending}</div>}

        <textarea
          placeholder="Optional: Add notes about your spending or financial feelings..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Log Entry
        </button>
      </form>

      {entries.length > 0 && (
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Entries</div>
            <div style={styles.statValue}>{entries.length}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Spent</div>
            <div style={styles.statValue}>${totalSpent.toFixed(2)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Average Spend</div>
            <div style={styles.statValue}>${averageSpend.toFixed(2)}</div>
          </div>
        </div>
      )}

      <div style={entries.length === 0 ? styles.emptyState : styles.entryList}>
        {entries.length === 0 ? (
          <p>No entries yet. Start logging your financial mood and spending today!</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} style={styles.entryCard}>
              <div style={styles.entryContent}>
                <div style={styles.entryHeader}>
                  <span style={styles.entryMood}>{entry.mood}</span>
                  <span style={styles.entryDate}>{entry.date}</span>
                </div>
                <div style={styles.entrySpending}>
                  <strong>Spent: ${entry.spending.toFixed(2)}</strong>
                </div>
                {entry.notes && <div style={styles.entryNotes}>"{entry.notes}"</div>}
              </div>
              <button
                onClick={() => handleDeleteEntry(entry.id)}
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

export default FinancialMoodJournal;
