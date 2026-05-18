import React, { useState, useEffect } from "react";

const PricePerUseTracker = () => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemCost, setItemCost] = useState("");
  const [errors, setErrors] = useState({});

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("paidforward-price-per-use");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // ignore storage failures
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    try {
      window.localStorage.setItem("paidforward-price-per-use", JSON.stringify(items));
    } catch {
      // ignore storage failures
    }
  }, [items]);

  const validateForm = () => {
    const newErrors = {};
    if (!itemName.trim()) {
      newErrors.itemName = "Item name is required";
    }
    if (itemCost === "") {
      newErrors.itemCost = "Cost is required";
    } else if (parseFloat(itemCost) < 0) {
      newErrors.itemCost = "Cost cannot be negative";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newItem = {
      id: Date.now(),
      name: itemName.trim(),
      cost: parseFloat(itemCost),
      timesUsed: 0,
      createdAt: new Date().toLocaleDateString()
    };

    setItems([...items, newItem]);
    setItemName("");
    setItemCost("");
    setErrors({});
  };

  const handleIncrementUse = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, timesUsed: item.timesUsed + 1 } : item
      )
    );
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

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
      marginBottom: "16px"
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
    itemList: {
      display: "flex",
      flexDirection: "column",
      gap: "12px"
    },
    itemCard: {
      background: "#f8fafc",
      borderRadius: "12px",
      padding: "14px",
      border: "1px solid #e2e8f0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "12px"
    },
    itemInfo: {
      flex: 1
    },
    itemName: {
      fontWeight: "600",
      color: "#1e293b",
      marginBottom: "6px"
    },
    itemStats: {
      display: "flex",
      gap: "24px",
      fontSize: "13px",
      color: "#64748b"
    },
    itemActions: {
      display: "flex",
      gap: "8px",
      alignItems: "center"
    },
    incrementButton: {
      padding: "8px 12px",
      borderRadius: "6px",
      border: "none",
      background: "#dcfce7",
      color: "#166534",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "12px"
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
      <h3 style={styles.title}>💲 Price Per Use Tracker</h3>
      <p style={styles.description}>
        Track the cost per use of items over time. As you use items more, the cost per use decreases!
      </p>

      <form style={styles.form} onSubmit={handleAddItem}>
        <div style={styles.formRow}>
          <input
            type="text"
            placeholder="Item (e.g., Running Shoes)"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            style={{
              ...styles.input,
              ...(errors.itemName ? styles.inputError : {})
            }}
          />
          <input
            type="number"
            placeholder="Cost ($)"
            value={itemCost}
            onChange={(e) => setItemCost(e.target.value)}
            min="0"
            step="0.01"
            style={{
              ...styles.input,
              flex: "0.6",
              ...(errors.itemCost ? styles.inputError : {})
            }}
          />
          <button type="submit" style={styles.button}>
            Add
          </button>
        </div>
        {(errors.itemName || errors.itemCost) && (
          <div>
            {errors.itemName && <div style={styles.errorMessage}>{errors.itemName}</div>}
            {errors.itemCost && <div style={styles.errorMessage}>{errors.itemCost}</div>}
          </div>
        )}
      </form>

      <div style={items.length === 0 ? styles.emptyState : styles.itemList}>
        {items.length === 0 ? (
          <p>No items tracked yet. Add an item to see its cost per use evolve!</p>
        ) : (
          items.map((item) => {
            const pricePerUse = item.timesUsed > 0 ? item.cost / item.timesUsed : item.cost;
            return (
              <div key={item.id} style={styles.itemCard}>
                <div style={styles.itemInfo}>
                  <div style={styles.itemName}>{item.name}</div>
                  <div style={styles.itemStats}>
                    <span>Cost: ${item.cost.toFixed(2)}</span>
                    <span>Times Used: {item.timesUsed}</span>
                    <span>Per Use: ${pricePerUse.toFixed(2)}</span>
                  </div>
                </div>
                <div style={styles.itemActions}>
                  <button
                    onClick={() => handleIncrementUse(item.id)}
                    style={styles.incrementButton}
                  >
                    +1 Use
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PricePerUseTracker;
