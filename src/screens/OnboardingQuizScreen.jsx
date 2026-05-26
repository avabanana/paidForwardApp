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
    padding: '24px',
    background: 'linear-gradient(180deg, #eef2ff 0%, #ffffff 100%)',
    fontFamily: "'Inter', system-ui, sans-serif"
  },
  card: {
    width: '100%',
    maxWidth: '680px',
    background: '#ffffff',
    borderRadius: '28px',
    boxShadow: '0 30px 60px rgba(15,23,42,0.08)',
    padding: '32px',
    border: '1px solid #e2e8f0'
  },
  header: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  },
  kicker: {
    color: '#4338ca',
    fontWeight: '700',
    marginBottom: '10px'
  },
  title: {
    fontSize: '32px',
    lineHeight: '1.1',
    margin: 0,
    color: '#0f172a'
  },
  subtitle: {
    color: '#475569',
    marginTop: '12px',
    maxWidth: '560px'
  },
  loginButton: {
    border: '1px solid #c7d2fe',
    background: 'transparent',
    color: '#4338ca',
    borderRadius: '14px',
    padding: '12px 18px',
    cursor: 'pointer',
    fontWeight: '700'
  },
  stepIndicator: {
    marginTop: '28px',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '700'
  },
  question: {
    marginTop: '12px',
    fontSize: '22px',
    fontWeight: '700',
    color: '#0f172a'
  },
  inputGroup: {
    marginTop: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  label: {
    fontWeight: '700',
    color: '#0f172a'
  },
  input: {
    borderRadius: '16px',
    border: '1px solid #cbd5e1',
    padding: '16px',
    fontSize: '16px',
    outline: 'none',
    width: '220px'
  },
  helperText: {
    color: '#64748b',
    fontSize: '14px'
  },
  optionsGrid: {
    marginTop: '24px',
    display: 'grid',
    gap: '14px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))'
  },
  optionCard: {
    borderRadius: '18px',
    border: '1px solid #cbd5e1',
    padding: '20px',
    textAlign: 'left',
    fontSize: '15px',
    color: '#0f172a',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, border-color 0.2s ease',
    background: '#ffffff'
  },
  footer: {
    marginTop: '32px',
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '18px',
    alignItems: 'center'
  },
  summaryBox: {
    padding: '22px',
    borderRadius: '22px',
    border: '1px solid #e2e8f0',
    background: '#f8fafc'
  },
  summaryLabel: {
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#64748b',
    fontWeight: '700'
  },
  summaryValue: {
    marginTop: '10px',
    fontSize: '20px',
    fontWeight: '800',
    color: '#0f172a'
  },
  summarySubtext: {
    marginTop: '8px',
    color: '#475569',
    fontSize: '14px',
    lineHeight: '1.6'
  },
  nextButton: {
    border: 'none',
    borderRadius: '18px',
    padding: '18px 28px',
    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    minWidth: '190px'
  }
};
