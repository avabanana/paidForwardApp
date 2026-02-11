import React from 'react';

const HomeScreen = () => {
  return (
    <div style={styles.container}>
      {/* Hero Welcome Section */}
      <section style={styles.hero}>
        <h2 style={styles.title}>Welcome to PaidForward</h2>
        <p style={styles.subtitle}>
          Your journey to financial literacy and community impact starts here. 
          Small actions today create a big ripple effect tomorrow.
        </p>
      </section>

      {/* Featured Dashboard Grid */}
      <div style={styles.dashboardGrid}>
        {/* Daily Challenge Card */}
        <div style={styles.challengeCard}>
          <div style={styles.iconBadge}>🏆</div>
          <h3 style={styles.cardTitle}>Daily Challenge</h3>
          <p style={styles.cardText}>
            Help 3 people today to earn a <strong>"Community Helper"</strong> badge!
          </p>
          <button style={styles.actionBtn}>View Progress</button>
        </div>

        {/* Impact Stats Card */}
        <div style={styles.statsCard}>
          <div style={styles.iconBadge}>🤝</div>
          <h3 style={styles.cardTitle}>Community Impact</h3>
          <p style={styles.cardText}>
            The PaidForward community has shared over <strong>1,200</strong> acts of kindness this week.
          </p>
          <button style={{...styles.actionBtn, backgroundColor: '#4caf50'}}>See Global Map</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    animation: 'fadeIn 0.5s ease-in',
  },
  hero: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '16px',
    marginBottom: '30px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    borderLeft: '8px solid #4A90E2',
  },
  title: {
    fontSize: '2.5rem',
    color: '#1a1a1a',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#666',
    lineHeight: '1.6',
    maxWidth: '700px',
  },
  dashboardGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
  },
  challengeCard: {
    flex: '1 1 350px',
    backgroundColor: '#e3f2fd', // Light Blue
    padding: '30px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  statsCard: {
    flex: '1 1 350px',
    backgroundColor: '#e8f5e9', // Light Green
    padding: '30px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  iconBadge: {
    fontSize: '2rem',
    marginBottom: '10px',
  },
  cardTitle: {
    margin: 0,
    fontSize: '1.5rem',
    color: '#333',
  },
  cardText: {
    fontSize: '1.1rem',
    color: '#444',
    margin: '10px 0 20px 0',
    lineHeight: '1.5',
    flex: 1,
  },
  actionBtn: {
    padding: '12px 20px',
    backgroundColor: '#4A90E2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  }
};

export default HomeScreen;