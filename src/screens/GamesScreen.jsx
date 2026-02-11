import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { games } from "../data/games"; 

const GamesScreen = () => {
  const { user } = useContext(UserContext); 

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Games & Challenges</h2>
        <p style={styles.subtitle}>
          Welcome, <strong>{user?.email || 'Player'}</strong>! Level up your skills through play.
        </p>
      </div>
      
      <div style={styles.grid}>
        {games && games.map((game) => (
          <div key={game.id} style={styles.gameCard}>
            <div style={styles.iconPlaceholder}>🎮</div>
            <h3 style={styles.gameName}>{game.name}</h3>
            <p style={styles.gameDescription}>{game.description}</p>
            <button style={styles.playBtn}>Start Playing</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
  },
  header: {
    marginBottom: '30px',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#666',
  },
  grid: { 
    display: 'flex', 
    flexWrap: 'wrap', 
    gap: '25px',
    justifyContent: 'flex-start',
  },
  gameCard: { 
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #eee', 
    padding: '25px', 
    borderRadius: '16px', 
    backgroundColor: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    flex: '1 1 300px',
    maxWidth: '450px', 
  },
  iconPlaceholder: {
    fontSize: '2rem',
    marginBottom: '15px',
  },
  gameName: {
    margin: '0 0 10px 0',
    color: '#1a1a1a',
    fontSize: '1.4rem',
  },
  gameDescription: {
    color: '#555',
    lineHeight: '1.5',
    marginBottom: '20px',
    flex: 1, 
  },
  playBtn: {
    backgroundColor: '#4A90E2',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
  }
};

export default GamesScreen;