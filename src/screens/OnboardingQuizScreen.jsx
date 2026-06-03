import React, { useMemo, useState } from 'react';

const moneyOptions = [
  { id: 'starting', label: 'Just getting started' },
  { id: 'saving', label: 'Saving and budgeting' },
  { id: 'investing', label: 'Curious about investing' },
  { id: 'credit', label: 'Want to build credit' }
];

const goalOptions = [
  { id: 'save', label: 'Build my savings' },
  { id: 'invest', label: 'Start investing' },
  { id: 'budget', label: 'Manage money better' },
  { id: 'learn', label: 'Learn money basics' }
];

const recommendationMap = {
  starting: {
    save: 'Budget Tracker',
    invest: 'Courses',
    budget: 'Budget Tracker',
    learn: 'Courses'
  },
  saving: {
    save: 'Budget Tracker',
    invest: 'Courses',
    budget: 'Budget Tracker',
    learn: 'Courses'
  },
  investing: {
    save: 'Courses',
    invest: 'Games',
    budget: 'Courses',
    learn: 'Courses'
  },
  credit: {
    save: 'Courses',
    invest: 'Courses',
    budget: 'Courses',
    learn: 'Courses'
  }
};

export default function OnboardingQuizScreen({ onLoginRequested = () => {}, onSignupRequested = () => {} }) {
  const [step, setStep] = useState(0);
  const [age, setAge] = useState('');
  const [moneySituation, setMoneySituation] = useState('starting');
  const [goal, setGoal] = useState('learn');

  const ageLabel = useMemo(() => {
    if (!age) return 'Age not set';
    const ageNumber = parseInt(age, 10);
    if (Number.isNaN(ageNumber)) return 'Age not set';
    if (ageNumber < 13) return 'Under 13';
    if (ageNumber < 18) return 'Teen';
    return 'Adult';
  }, [age]);

  const recommendation = useMemo(() => {
    const pick = recommendationMap[moneySituation]?.[goal] || 'Courses';
    return pick;
  }, [moneySituation, goal]);

  const handleNext = () => {
    if (step === 0 && !age.trim()) return;
    if (step === 1 && !moneySituation) return;
    if (step === 2) {
      if (onSignupRequested) {
        onSignupRequested({ age: age.trim(), moneySituation, goal, recommendation });
      }
      return;
    }
    setStep(step + 1);
  };

  const stepText = [
    'How old are you?',
    'What best describes your money situation?',
    'What is your biggest goal right now?'
  ];

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <div style={styles.kicker}>New user onboarding</div>
            <h1 style={styles.title}>Tell us a little about you</h1>
            <p style={styles.subtitle}>Answer three quick questions and we’ll recommend the best starting point.</p>
          </div>
          <button type="button" style={styles.loginButton} onClick={onLoginRequested}>
            Already have an account
          </button>
        </div>

        <div style={styles.stepIndicator}>Step {step + 1} of 3</div>
        <div style={styles.question}>{stepText[step]}</div>

        {step === 0 && (
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="ageInput">Your age</label>
            <input
              id="ageInput"
              type="number"
              min="5"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              style={styles.input}
            />
            <div style={styles.helperText}>This helps us tailor the experience to your age.</div>
          </div>
        )}

        {step === 1 && (
          <div style={styles.optionsGrid}>
            {moneyOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setMoneySituation(option.id)}
                style={{
                  ...styles.optionCard,
                  borderColor: moneySituation === option.id ? '#6366f1' : '#cbd5e1',
                  background: moneySituation === option.id ? 'rgba(99,102,241,0.1)' : '#ffffff'
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div style={styles.optionsGrid}>
            {goalOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setGoal(option.id)}
                style={{
                  ...styles.optionCard,
                  borderColor: goal === option.id ? '#6366f1' : '#cbd5e1',
                  background: goal === option.id ? 'rgba(99,102,241,0.1)' : '#ffffff'
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        <div style={styles.footer}>
          <div style={styles.summaryBox}>
            <div style={styles.summaryLabel}>Recommended starting point</div>
            <div style={styles.summaryValue}>{recommendation}</div>
            <div style={styles.summarySubtext}>We’ll take you to the sign-up screen next, then help you get started there.</div>
          </div>
          <button
            type="button"
            style={styles.nextButton}
            onClick={handleNext}
          >
            {step === 2 ? 'Continue to Sign Up' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 30%, #3b82f6 60%, #8b5cf6 100%)',
    fontFamily: "'Inter', system-ui, sans-serif",
    position: 'relative',
    overflow: 'hidden'
  },
  card: {
    width: '100%',
    maxWidth: '720px',
    background: 'rgba(255, 255, 255, 0.98)',
    borderRadius: '32px',
    boxShadow: '0 40px 80px rgba(15, 23, 42, 0.25)',
    padding: '48px 44px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    position: 'relative',
    zIndex: 10
  },
  header: {
    display: 'flex',
    gap: '24px',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: '8px'
  },
  kicker: {
    color: '#6366f1',
    fontWeight: '800',
    marginBottom: '12px',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em'
  },
  title: {
    fontSize: '36px',
    lineHeight: '1.15',
    margin: 0,
    color: '#0f172a',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #0f172a, #4338ca)',
    webkitBackgroundClip: 'text',
    webkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  subtitle: {
    color: '#64748b',
    marginTop: '14px',
    maxWidth: '500px',
    fontSize: '15px',
    lineHeight: '1.6',
    fontWeight: '500'
  },
  loginButton: {
    border: '2px solid #e0e7ff',
    background: 'transparent',
    color: '#6366f1',
    borderRadius: '16px',
    padding: '14px 22px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  stepIndicator: {
    marginTop: '32px',
    marginBottom: '4px',
    color: '#a78bfa',
    fontSize: '12px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
  },
  question: {
    marginTop: '8px',
    marginBottom: '28px',
    fontSize: '24px',
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: '1.3'
  },
  inputGroup: {
    marginTop: '32px',
    marginBottom: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  label: {
    fontWeight: '700',
    color: '#1e293b',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  input: {
    borderRadius: '18px',
    border: '2px solid #e2e8f0',
    padding: '16px 20px',
    fontSize: '16px',
    outline: 'none',
    width: '100%',
    maxWidth: '260px',
    transition: 'all 0.3s ease',
    background: '#f8fafc'
  },
  helperText: {
    color: '#94a3b8',
    fontSize: '13px',
    marginTop: '4px',
    fontWeight: '500'
  },
  optionsGrid: {
    marginTop: '28px',
    marginBottom: '28px',
    display: 'grid',
    gap: '12px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))'
  },
  optionCard: {
    borderRadius: '20px',
    border: '2px solid #e2e8f0',
    padding: '22px 18px',
    textAlign: 'left',
    fontSize: '15px',
    color: '#0f172a',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: '#ffffff',
    fontWeight: '600',
    lineHeight: '1.5'
  },
  footer: {
    marginTop: '40px',
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '24px',
    alignItems: 'center'
  },
  summaryBox: {
    padding: '24px 28px',
    borderRadius: '24px',
    border: '2px solid #e0e7ff',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f0f4ff 100%)',
    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.08)'
  },
  summaryLabel: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: '#6b7280',
    fontWeight: '800'
  },
  summaryValue: {
    marginTop: '10px',
    fontSize: '22px',
    fontWeight: '900',
    color: '#6366f1',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  summarySubtext: {
    marginTop: '10px',
    color: '#64748b',
    fontSize: '13px',
    lineHeight: '1.6',
    fontWeight: '500'
  },
  nextButton: {
    border: 'none',
    borderRadius: '20px',
    padding: '16px 32px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '800',
    cursor: 'pointer',
    minWidth: '180px',
    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  }
};
