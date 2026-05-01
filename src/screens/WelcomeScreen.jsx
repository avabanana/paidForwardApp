import React, { useState } from 'react';

export default function WelcomeScreen({ username = 'User', onWelcomeComplete, userTier = 'adult' }) {
  const [showWelcome, setShowWelcome] = useState(true);
  // const [showTourPrompt, setShowTourPrompt] = useState(false); // Commented out tour state

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    // Instead of showing the tour prompt, we finish the welcome process immediately
    if (onWelcomeComplete) {
      onWelcomeComplete({ completedWelcome: true, startTour: false });
    }
  };

  /* Commented out tour decision logic
  const handleTourDecision = (takeTour) => {
    setShowTourPrompt(false);
    if (onWelcomeComplete) {
      onWelcomeComplete({ completedWelcome: true, startTour: takeTour });
    }
  };
  */

  const isChild = userTier === 'elementary';

  // Changed condition since showTourPrompt is no longer used
  if (!showWelcome) {
    return null;
  }

  return (
    <>
      {/* Welcome Screen Modal */}
      {showWelcome && (
        <div style={styles.overlay}>
          <div style={styles.welcomeCard}>
            {/* Animation wrapper */}
            <div style={styles.animatedContent}>
              {/* Welcome Header */}
              <div style={styles.welcomeHeader}>
                <div style={styles.welcomeIcon}>💸</div>
                <h1 style={styles.welcomeTitle}>Welcome to PaidForward!</h1>
                <p style={styles.welcomeSubtitle}>You're joining thousands of learners building financial confidence.</p>
              </div>

              {/* Personal Greeting */}
              <div style={styles.greetingBox}>
                <div style={styles.greetingEmoji}>👋</div>
                <p style={styles.greetingText}>
                  Hey <strong style={{ color: '#6366f1' }}>{username}</strong>! We're excited to have you.
                </p>
                <p style={styles.greetingSubtext}>
                  {isChild 
                    ? 'Get ready to explore money through fun lessons and games!'
                    : 'Your journey to financial mastery starts here. Learn investing, budgeting, credit, and more.'}
                </p>
              </div>

              {/* Quick Facts */}
              <div style={styles.factsGrid}>
                <div style={styles.factCard}>
                  <div style={styles.factIcon}>📚</div>
                  <div style={styles.factContent}>
                    <div style={styles.factTitle}>Courses</div>
                    <div style={styles.factDesc}>Interactive lessons with quizzes</div>
                  </div>
                </div>

                <div style={styles.factCard}>
                  <div style={styles.factIcon}>🎮</div>
                  <div style={styles.factContent}>
                    <div style={styles.factTitle}>Games</div>
                    <div style={styles.factDesc}>Learn investing through play</div>
                  </div>
                </div>

                <div style={styles.factCard}>
                  <div style={styles.factIcon}>🏆</div>
                  <div style={styles.factContent}>
                    <div style={styles.factTitle}>Progress</div>
                    <div style={styles.factDesc}>Track your financial growth</div>
                  </div>
                </div>

                <div style={styles.factCard}>
                  <div style={styles.factIcon}>💬</div>
                  <div style={styles.factContent}>
                    <div style={styles.factTitle}>Community</div>
                    <div style={styles.factDesc}>Learn with others everywhere</div>
                  </div>
                </div>
              </div>

              {/* Features Highlight */}
              <div style={styles.featuresBox}>
                <h3 style={styles.featureTitle}>What you can do:</h3>
                <ul style={styles.featureList}>
                  <li style={styles.featureItem}>✓ Complete courses and earn certificates</li>
                  <li style={styles.featureItem}>✓ Play stock trading games in leagues</li>
                  <li style={styles.featureItem}>✓ Set savings goals and track progress</li>
                  <li style={styles.featureItem}>✓ Discuss ideas with the community</li>
                  <li style={styles.featureItem}>✓ Build your financial knowledge daily</li>
                </ul>
              </div>

              {/* CTA Button */}
              <button onClick={handleWelcomeClose} style={styles.ctaButton}>
                🚀 Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tour Prompt Modal - COMMENTED OUT
      {showTourPrompt && (
        <div style={styles.overlay}>
          <div style={styles.tourPromptCard}>
            <div style={styles.tourIcon}>🎯</div>
            <h2 style={styles.tourTitle}>Quick Tour?</h2>
            <p style={styles.tourDescription}>
              Would you like a guided tour of PaidForward? We'll highlight key features so you know where everything is.
            </p>

            <div style={styles.tourButtonGroup}>
              <button 
                onClick={() => handleTourDecision(true)} 
                style={{ ...styles.tourButton, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff' }}
              >
                ✨ Yes, Show Me Around
              </button>
              <button 
                onClick={() => handleTourDecision(false)} 
                style={{ ...styles.tourButton, background: '#f1f5f9', color: '#1e293b', border: '2px solid #e2e8f0' }}
              >
                Skip for Now
              </button>
            </div>
          </div>
        </div>
      )}
      */}
    </>
  );
}

// ... styles remain the same