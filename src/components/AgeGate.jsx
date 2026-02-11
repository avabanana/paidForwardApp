import React, { useState, useContext } from "react";
// Remove react-native imports entirely
import { UserContext } from "../context/UserContext";

export default function AgeGate() {
  const [inputAge, setInputAge] = useState("");
  const { setAge } = useContext(UserContext);

  const handleContinue = () => {
    // Basic validation to ensure it's a number
    if (inputAge) {
      setAge(Number(inputAge));
    } else {
      alert("Please enter a valid age.");
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.label}>How old are you?</h3>

      <input
        type="number"
        style={styles.input}
        value={inputAge}
        onChange={(e) => setInputAge(e.target.value)}
        placeholder="Enter your age"
      />

      <button 
        style={styles.button}
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px'
  },
  label: {
    margin: 0,
    color: '#333'
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box'
  },
  button: {
    padding: '12px',
    backgroundColor: '#4A90E2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px'
  }
};