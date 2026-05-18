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
    if (percentage >= 80) return "#ef4444";
    if (percentage >= 50) return "#eab308";
    return "#10b981";
  };

  const size = 200;
  const radius = 80;
  const center = size / 2;

  let currentAngle = -90;
  const slices = [];

  categories.forEach((cat) => {
    if (cat.spent <= 0) return;
    const slicePercentage = cat.spent / totalSpent;
    const sliceAngle = slicePercentage * 360;

    // Avoid degenerate full-circle slice (single category edge case)
    const safeAngle = sliceAngle >= 360 ? 359.99 : sliceAngle;

    const startAngle = currentAngle;
    const endAngle = currentAngle + safeAngle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArc = safeAngle > 180 ? 1 : 0;

    const pathData = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      "Z",
    ].join(" ");

    slices.push({
      path: pathData,
      color: getSliceColor(cat.spent, cat.limit),
      name: cat.name,
      spent: cat.spent,
      percentage: slicePercentage,
    });
  });

  return (
    <div style={{ width: "100%", marginBottom: "24px" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          style={{ width: "200px", height: "200px", display: "block" }}
        >
          {slices.map((slice, idx) => (
            <path
              key={idx}
              d={slice.path}
              fill={slice.color}
              stroke="#fff"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "16px",
          justifyContent: "center",
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
              gap: "6px",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "2px",
                background: slice.color,
                flexShrink: 0,
              }}
            />
            <span>
              <strong>{slice.name}</strong>: ${slice.spent.toFixed(2)} (
              {(slice.percentage * 100).toFixed(1)}%)
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

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("paidforward-budget-categories");
      if (saved) setCategories(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "paidforward-budget-categories",
        JSON.stringify(categories)
      );
    } catch {}
  }, [categories]);

  const validateForm = () => {
    const newErrors = {};
    if (!categoryName.trim()) newErrors.categoryName = "Category name is required";
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
    setCategories([
      ...categories,
      { id: Date.now(), name: categoryName.trim(), limit: parseFloat(categoryLimit), spent: 0 },
    ]);
    setCategoryName("");
    setCategoryLimit("");
    setErrors({});
  };

  const handleUpdateSpent = (id, value) => {
    const spent = parseFloat(value) || 0;
    if (spent < 0) return;
    setCategories(categories.map((cat) => (cat.id === id ? { ...cat, spent } : cat)));
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const getProgressColor = (spent, limit) => {
    const pct = limit > 0 ? (spent / limit) * 100 : 0;
    if (pct >= 80) return "#ef4444";
    if (pct >= 50) return "#eab308";
    return "#10b981";
  };

  const getProgressPercentage = (spent, limit) =>
    limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%",
        minHeight: "100vh",
        padding: "24px 16px",
        boxSizing: "border-box",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: "600px" }}>

        {/* Add Category Form */}
        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>
          💰 Budget Tracker
        </h3>
        <form
          onSubmit={handleAddCategory}
          style={{
            background: "#f8fafc",
            borderRadius: "16px",
            padding: "16px",
            border: "1px solid #e2e8f0",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Category (e.g., Food)"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              style={{
                flex: "1 1 160px",
                padding: "10px 12px",
                borderRadius: "8px",
                border: `1px solid ${errors.categoryName ? "#ef4444" : "#cbd5e1"}`,
                fontSize: "14px",
              }}
            />
            <input
              type="number"
              placeholder="Monthly Limit ($)"
              value={categoryLimit}
              onChange={(e) => setCategoryLimit(e.target.value)}
              style={{
                flex: "1 1 130px",
                padding: "10px 12px",
                borderRadius: "8px",
                border: `1px solid ${errors.categoryLimit ? "#ef4444" : "#cbd5e1"}`,
                fontSize: "14px",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                background: "#2563eb",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                flexShrink: 0,
              }}
            >
              Add
            </button>
          </div>
          {errors.categoryName && (
            <div style={{ fontSize: "12px", color: "#ef4444" }}>{errors.categoryName}</div>
          )}
          {errors.categoryLimit && (
            <div style={{ fontSize: "12px", color: "#ef4444" }}>{errors.categoryLimit}</div>
          )}
        </form>

        {/* Category List */}
        {categories.length === 0 ? (
          <div style={{ textAlign: "center", color: "#64748b", padding: "24px", fontSize: "14px" }}>
            No categories yet. Add one to get started!
          </div>
        ) : (
          <>
            <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>
              📊 Spending Distribution
            </h4>
            <PieChart categories={categories} />

            <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>
              Category Breakdown
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {categories.map((category) => {
                const percentage = getProgressPercentage(category.spent, category.limit);
                const color = getProgressColor(category.spent, category.limit);
                const remaining = Math.max(0, category.limit - category.spent);

                return (
                  <div
                    key={category.id}
                    style={{
                      background: "#fff",
                      borderRadius: "12px",
                      padding: "16px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <span style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>
                        {category.name}
                      </span>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        style={{
                          background: "#fee2e2",
                          color: "#991b1b",
                          border: "none",
                          borderRadius: "6px",
                          padding: "6px 12px",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        Delete
                      </button>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "12px",
                        color: "#64748b",
                        marginBottom: "8px",
                      }}
                    >
                      <span>${category.spent.toFixed(2)} / ${category.limit.toFixed(2)}</span>
                      <span>${remaining.toFixed(2)} remaining</span>
                    </div>

                    <div
                      style={{
                        width: "100%",
                        height: "20px",
                        background: "#e2e8f0",
                        borderRadius: "10px",
                        overflow: "hidden",
                        marginBottom: "12px",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          borderRadius: "10px",
                          width: `${percentage}%`,
                          backgroundColor: color,
                          transition: "width 0.3s, background-color 0.3s",
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569", minWidth: "50px" }}>
                        Spent:
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={category.spent}
                        onChange={(e) => handleUpdateSpent(category.id, e.target.value)}
                        style={{
                          flex: 1,
                          padding: "8px 10px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "13px",
                        }}
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
