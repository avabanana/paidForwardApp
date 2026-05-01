import React, { useState } from 'react';

export default function TourOverlay({ onTourComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  const tours = [
    {
      target: '.logo',
      title: '🏠 Home',
      description: 'Click the PaidForward logo to return home anytime.',
      position: 'bottom'
    },
    {
      target: '[data-tour="courses"]',
      title: '📚 Courses',
      description: 'Learn money skills through interactive lessons and quizzes. Earn certificates as you complete courses.',
      position: 'bottom'
    },
    {
      target: '[data-tour="games"]',
      title: '🎮 Games',
      description: 'Test your investing knowledge by playing stock trading games against other players in leagues.',
      position: 'bottom'
    },
    {
      target: '[data-tour="progress"]',
      title: '📊 Progress',
      description: 'Track your XP, achievements, and overall financial journey.',
      position: 'bottom'
    },
    {
      target: '[data-tour="discussion"]',
      title: '💬 Discussion',
      description: 'Talk with other learners, ask questions, and share your wins.',
      position: 'bottom'
    },
    {
      target: '[data-tour="goals"]',
      title: '🎯 Goals',
      description: 'Set savings goals and track your progress toward them.',
      position: 'bottom'
    },
    {
      target: '[data-tour="leagues"]',
      title: '🏆 Leagues',
      description: 'Create or join leagues to compete with friends in trading competitions.',
      position: 'bottom'
    },
    {
      target: '.user-chip',
      title: '👤 Profile',
      description: 'View your profile, check your streak, and access settings.',
      position: 'bottom'
    }
  ];

  const currentTour = tours[currentStep];

  const handleNext = () => {
    if (currentStep < tours.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onTourComplete?.();
    }
  };

  const handleSkip = () => {
    onTourComplete?.();
  };

  return (
    <div style={styles.overlay}>
      {/* Backdrop with hole */}
      <div style={styles.backdrop}>
        <div style={styles.hole} />
      </div>

      {/* Tooltip */}
      <div style={styles.tooltip}>
        <div style={styles.tooltipHeader}>
          <div style={styles.stepIndicator}>{currentStep + 1} / {tours.length}</div>
          <button onClick={handleSkip} style={styles.closeBtn}>✕</button>
        </div>
        <h3 style={styles.tooltipTitle}>{currentTour.title}</h3>
        <p style={styles.tooltipDescription}>{currentTour.description}</p>
        <div style={styles.tooltipFooter}>
          <button onClick={handleSkip} style={styles.skipBtn}>Skip Tour</button>
          <button onClick={handleNext} style={styles.nextBtn}>
            {currentStep === tours.length - 1 ? 'Finish' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9998,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(3px)',
  },
  hole: {
    position: 'absolute',
    width: '200px',
    height: '50px',
    top: '60px',
    left: '20px',
    borderRadius: '8px',
    background: 'transparent',
    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)',
  },
  tooltip: {
    position: 'absolute',
    bottom: '80px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#fff',
    borderRadius: '14px',
    padding: '20px 24px',
    maxWidth: '400px',
    width: 'calc(100% - 40px)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    zIndex: 9999,
  },
  tooltipHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  stepIndicator: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#6366f1',
    background: '#eef2ff',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#94a3b8',
  },
  tooltipTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#111827',
    margin: '0 0 8px',
  },
  tooltipDescription: {
    fontSize: '14px',
    color: '#64748b',
    margin: '0 0 16px',
    lineHeight: '1.6',
  },
  tooltipFooter: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
  },
  skipBtn: {
    padding: '8px 16px',
    background: '#f1f5f9',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  nextBtn: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
