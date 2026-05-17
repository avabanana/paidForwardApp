import React, { useState, useEffect } from "react";

const PieChart = ({ categories }) => {
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);

  if (totalSpent === 0) {
    return (
      <div style={{ textAlign: "center", color: "#94a3b8", padding: "32px 0" }}>
        <p>No spending data yet</p>
      </div>
    );
  }

  const getSliceColor = (spent, limit) => {
    const percentage = limit > 0 ? (spent / limit) * 100 : 0;
    if (percentage >= 80) return "#ef4444"; // red
    if (percentage >= 50) return "#eab308"; // yellow
    return "#10b981"; // green
  };

  const size = 200;
  const radius = 70;
  const center = size / 2;

  let currentAngle = -90; // Start from top
  const slices = categories.map((cat) => {
    const slicePercentage = cat.spent / totalSpent;
    const sliceAngle = slicePercentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    const pathData = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      "Z"
    ].join(" ");

    return {
      path: pathData,
      color: getSliceColor(cat.spent, cat.limit),
      name: cat.name,
      spent: cat.spent,
      percentage: slicePercentage
    };
  });

  return (
    <div style={{ width: "100%", marginBottom: "24px" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
        <svg
          width="100%"
          height="auto"
          viewBox={`0 0 ${size} ${size}`}
          style={{
            maxWidth: "400px",
            aspectRatio: "1",
            marginBottom: "16px"
          }}
        >
          {slices.map((slice, idx) => (
            <path
              key={idx}
              d={slice.path}
              fill={slice.color}
              stroke="#fff"
              strokeWidth="2"
              style={{ transition: "fill 0.3s" }}
            />
          ))}
        </svg>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "12px",
          marginTop: "16px",
          width: "100%"
        }}
      >
        {slices.map((slice, idx) => (
          <div
            key={idx}
            style={{
              fontSize: "12px",
              color: "#475569",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "2px",
                background: slice.color,
                flexShrink: 0
              }}
            />
            <span>
              <strong>{slice.name}</strong>: ${slice.spent.toFixed(2)} ({(slice.percentage * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BudgetTracker = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryLimit, setCategoryLimit] = useState("");
  const [errors, setErrors] = useState({});

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("paidforward-budget-categories");
      if (saved) {
        setCategories(JSON.parse(saved));
      }
    } catch {
      // ignore storage failures
    }
  }, []);

  // Save to localStorage whenever categories change
  useEffect(() => {
    try {
      window.localStorage.setItem("paidforward-budget-categories", JSON.stringify(categories));
    } catch {
      // ignore storage failures
    }
  }, [categories]);

  const validateForm = () => {
    const newErrors = {};
    if (!categoryName.trim()) {
      newErrors.categoryName = "Category name is required";
    }
    if (categoryLimit === "") {
      newErrors.categoryLimit = "Budget limit is required";
    } else if (parseFloat(categoryLimit) < 0) {
      newErrors.categoryLimit = "Budget limit cannot be negative";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newCategory = {
      id: Date.now(),
      name: categoryName.trim(),
      limit: parseFloat(categoryLimit),
      spent: 0
    };

    setCategories([...categories, newCategory]);
    setCategoryName("");
    setCategoryLimit("");
    setErrors({});
  };

  const handleUpdateSpent = (id, value) => {
    const spent = parseFloat(value) || 0;
    if (spent < 0) return;

    setCategories(
      categories.map((cat) =>
        cat.id === id ? { ...cat, spent } : cat
      )
    );
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const getProgressColor = (spent, limit) => {
    const percentage = limit > 0 ? (spent / limit) * 100 : 0;
    if (percentage >= 80) return "#ef4444"; // red
    if (percentage >= 50) return "#eab308"; // yellow
    return "#10b981"; // green
  };

  const getProgressPercentage = (spent, limit) => {
    return limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  };

  const styles = {
    container: {
      padding: "20px",
      fontFamily: "'Inter', system-ui, sans-serif",
      maxWidth: "600px"
    },
    section: {
      marginBottom: "24px"
    },
    title: {
      fontSize: "18px",
      fontWeight: "700",
      color: "#1e293b",
      marginBottom: "12px",
      margin: "0 0 12px 0"
    },
    form: {
      background: "#f8fafc",
      borderRadius: "16px",
      padding: "16px",
      border: "1px solid #e2e8f0"
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
    categoryList: {
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    },
    categoryCard: {
      background: "#fff",
      borderRadius: "12px",
      padding: "16px",
      border: "1px solid #e2e8f0"
    },
    categoryHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px"
    },
    categoryName: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#1e293b"
    },
    categoryDelete: {
      background: "#fee2e2",
      color: "#991b1b",
      border: "none",
      borderRadius: "6px",
      padding: "6px 12px",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "600"
    },
    budgetInfo: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "12px",
      color: "#64748b",
      marginBottom: "8px"
    },
    progressBarContainer: {
      width: "100%",
      height: "20px",
      background: "#e2e8f0",
      borderRadius: "10px",
      overflow: "hidden",
      marginBottom: "12px"
    },
    progressBar: {
      height: "100%",
      borderRadius: "10px",
      transition: "width 0.3s, background-color 0.3s"
    },
    inputRow: {
      display: "flex",
      alignItems: "center",
      gap: "12px"
    },
    spentLabel: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#475569",
      minWidth: "50px"
    },
    spentInput: {
      flex: 1,
      padding: "8px 10px",
      borderRadius: "6px",
      border: "1px solid #cbd5e1",
      fontSize: "13px"
    },
    emptyState: {
      textAlign: "center",
      color: "#64748b",
      padding: "24px",
      fontSize: "14px"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <h3 style={styles.title}>💰 Budget Tracker</h3>
        <form style={styles.form} onSubmit={handleAddCategory}>
          <div style={styles.formRow}>
            <input
              type="text"
              placeholder="Category (e.g., Food)"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              style={{
                ...styles.input,
                ...(errors.categoryName ? styles.inputError : {})
              }}
            />
            <input
              type="number"
              placeholder="Monthly Limit ($)"
              value={categoryLimit}
              onChange={(e) => setCategoryLimit(e.target.value)}
              style={{
                ...styles.input,
                flex: "0.8",
                ...(errors.categoryLimit ? styles.inputError : {})
              }}
            />
            <button type="submit" style={styles.button}>
              Add
            </button>
          </div>
          {(errors.categoryName || errors.categoryLimit) && (
            <div>
              {errors.categoryName && (
                <div style={styles.errorMessage}>{errors.categoryName}</div>
              )}
              {errors.categoryLimit && (
                <div style={styles.errorMessage}>{errors.categoryLimit}</div>
              )}
            </div>
          )}
        </form>
      </div>

      <div style={styles.section}>
        {categories.length === 0 ? (
          <div style={styles.emptyState}>
            No categories yet. Add one to get started!
          </div>
        ) : (
          <>
            <h4 style={{ ...styles.title, fontSize: "14px", marginTop: "24px", marginBottom: "16px" }}>
              📊 Spending Distribution
            </h4>
            <PieChart categories={categories} />

            <h4 style={{ ...styles.title, fontSize: "14px", marginBottom: "12px" }}>
              Category Breakdown
            </h4>
            <div style={styles.categoryList}>
              {categories.map((category) => {
                const percentage = getProgressPercentage(category.spent, category.limit);
                const color = getProgressColor(category.spent, category.limit);
                const remaining = Math.max(0, category.limit - category.spent);

                return (
                  <div key={category.id} style={styles.categoryCard}>
                  <div style={styles.categoryHeader}>
                    <span style={styles.categoryName}>{category.name}</span>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      style={styles.categoryDelete}
                    >
                      Delete
                    </button>
                  </div>

                  <div style={styles.budgetInfo}>
                    <span>${category.spent.toFixed(2)} / ${category.limit.toFixed(2)}</span>
                    <span>${remaining.toFixed(2)} remaining</span>
                  </div>

                  <div style={styles.progressBarContainer}>
                    <div
                      style={{
                        ...styles.progressBar,
                        width: `${percentage}%`,
                        backgroundColor: color
                      }}
                    />
                  </div>

                  <div style={styles.inputRow}>
                    <label style={styles.spentLabel}>Spent:</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={category.spent}
                      onChange={(e) => handleUpdateSpent(category.id, e.target.value)}
                      style={styles.spentInput}
                    />
                  </div>
                </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BudgetTracker;
