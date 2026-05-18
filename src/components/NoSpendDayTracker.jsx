import React, { useState, useEffect } from "react";

const NoSpendDayTracker = () => {
  const [noSpendDays, setNoSpendDays] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [streak, setStreak] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("paidforward-no-spend-days");
      if (saved) {
        setNoSpendDays(JSON.parse(saved));
      }
    } catch {
      // ignore storage failures
    }
  }, []);

  // Save to localStorage whenever noSpendDays change
  useEffect(() => {
    try {
      window.localStorage.setItem("paidforward-no-spend-days", JSON.stringify(noSpendDays));
    } catch {
      // ignore storage failures
    }
  }, [noSpendDays]);

  // Calculate streak
  useEffect(() => {
    const today = new Date();
    let currentStreak = 0;
    let checkDate = new Date(today);

    const dateKey = (date) => date.toISOString().split("T")[0];

    while (noSpendDays[dateKey(checkDate)]) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    setStreak(currentStreak);
  }, [noSpendDays]);

  const toggleDay = (date) => {
    const dateKey = date.toISOString().split("T")[0];
    const updated = { ...noSpendDays };

    if (updated[dateKey]) {
      delete updated[dateKey];
    } else {
      updated[dateKey] = true;
    }

    setNoSpendDays(updated);
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const totalNoSpendDaysMonth = Array.from(
    { length: daysInMonth },
    (_, i) => {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
      return noSpendDays[date.toISOString().split("T")[0]];
    }
  ).filter(Boolean).length;

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
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px"
    },
    monthLabel: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#1e293b"
    },
    statsContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
      gap: "12px",
      marginBottom: "16px"
    },
    statCard: {
      background: "#f0fdf4",
      borderRadius: "10px",
      padding: "12px",
      textAlign: "center",
      border: "1px solid #bbf7d0"
    },
    statLabel: {
      fontSize: "12px",
      color: "#166534",
      fontWeight: "600",
      marginBottom: "4px"
    },
    statValue: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#166534"
    },
    calendarGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gap: "8px"
    },
    weekdayHeader: {
      textAlign: "center",
      fontWeight: "600",
      fontSize: "12px",
      color: "#64748b",
      padding: "8px 0",
      textTransform: "uppercase"
    },
    emptyCell: {
      padding: "20px 0"
    },
    dayCell: {
      aspectRatio: "1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      border: "2px solid #e2e8f0",
      background: "#f8fafc",
      transition: "all 0.2s",
      color: "#64748b"
    },
    dayCellActive: {
      background: "#10b981",
      color: "#fff",
      border: "2px solid #059669"
    },
    navigation: {
      display: "flex",
      gap: "8px",
      justifyContent: "center",
      marginTop: "16px"
    },
    navButton: {
      padding: "8px 12px",
      borderRadius: "6px",
      border: "1px solid #cbd5e1",
      background: "#fff",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: "600",
      color: "#475569"
    }
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const days = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add day cells
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📅 No-Spend Day Tracker</h3>

      <div style={styles.header}>
        <span style={styles.monthLabel}>{monthName}</span>
      </div>

      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>No-Spend Days</div>
          <div style={styles.statValue}>{totalNoSpendDaysMonth}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Current Streak</div>
          <div style={styles.statValue}>{streak}</div>
        </div>
      </div>

      <div style={styles.calendarGrid}>
        {weekDays.map((day) => (
          <div key={day} style={styles.weekdayHeader}>
            {day}
          </div>
        ))}

        {days.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} style={styles.emptyCell} />;
          }

          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const dateKey = date.toISOString().split("T")[0];
          const isNoSpendDay = noSpendDays[dateKey];

          return (
            <button
              key={day}
              onClick={() => toggleDay(date)}
              style={{
                ...styles.dayCell,
                ...(isNoSpendDay ? styles.dayCellActive : {})
              }}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div style={styles.navigation}>
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
            )
          }
          style={styles.navButton}
        >
          ← Previous
        </button>
        <button
          onClick={() => setCurrentMonth(new Date())}
          style={styles.navButton}
        >
          Today
        </button>
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
            )
          }
          style={styles.navButton}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default NoSpendDayTracker;
