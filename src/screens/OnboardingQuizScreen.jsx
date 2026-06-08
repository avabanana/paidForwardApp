import React, { useMemo, useState } from 'react';

const moneyOptions = [
  { id: 'starting', emoji: '🌱', label: 'Just getting started' },
  { id: 'saving',   emoji: '🐷', label: 'Saving & budgeting' },
  { id: 'investing',emoji: '📈', label: 'Curious about investing' },
  { id: 'credit',   emoji: '💳', label: 'Building credit' }
];

const goalOptions = [
  { id: 'save',   emoji: '🏦', label: 'Build my savings' },
  { id: 'invest', emoji: '🚀', label: 'Start investing' },
  { id: 'budget', emoji: '📊', label: 'Manage money better' },
  { id: 'learn',  emoji: '📚', label: 'Learn the basics' }
];

const recommendationMap = {
  starting: { save: 'Budget Tracker', invest: 'Courses',      budget: 'Budget Tracker', learn: 'Courses' },
  saving:   { save: 'Budget Tracker', invest: 'Courses',      budget: 'Budget Tracker', learn: 'Courses' },
  investing:{ save: 'Courses',        invest: 'Money Games',  budget: 'Courses',        learn: 'Courses' },
  credit:   { save: 'Courses',        invest: 'Courses',      budget: 'Courses',        learn: 'Courses' }
};

const recDescriptions = {
  'Budget Tracker': 'Track spending, set goals, and build lasting money habits.',
  'Courses':        'Short, fun lessons that teach real financial skills step by step.',
  'Money Games':    'Simulate investing with virtual money before using the real thing.'
};

const steps = [
  { label: 'Your age' },
  { label: 'Money situation' },
  { label: 'Your goal' }
];

export default function OnboardingQuizScreen({
  onLoginRequested = () => {},
  onSignupRequested = () => {}
}) {
  const [step, setStep] = useState(0);
  const [age, setAge] = useState('');
  const [moneySituation, setMoneySituation] = useState('starting');
  const [goal, setGoal] = useState('learn');

  const recommendation = useMemo(
    () => recommendationMap[moneySituation]?.[goal] || 'Courses',
    [moneySituation, goal]
  );

  const handleNext = () => {
    if (step === 0 && !age.trim()) return;
    if (step < 3) {
      setStep(step + 1);
    } else {
      onSignupRequested({ age: age.trim(), moneySituation, goal, recommendation });
    }
  };

  return (
    <div style={s.page}>
      <div style={s.shell}>

        {/* ── Left panel ── */}
        <div style={s.left}>
          <div style={s.brand}>
            <div style={s.brandIcon}>💸</div>
            <span style={s.brandName}>PaidForward</span>
          </div>

          <div style={s.leftBody}>
            <div style={s.tagline}>
              Money skills<br />for <span style={s.taglineAccent}>real life.</span>
            </div>
            <p style={s.leftDesc}>
              Learn, practice, and level up your financial literacy — at any age.
            </p>
          </div>

          <div style={s.stepsTrack}>
            {steps.map((st, i) => {
              const isDone   = i < step;
              const isActive = i === step;
              return (
                <div
                  key={i}
                  style={{
                    ...s.stepRow,
                    opacity: isDone ? 0.7 : isActive ? 1 : 0.35
                  }}
                >
                  <div style={{
                    ...s.stepDot,
                    background: isDone ? '#f5b942' : isActive ? '#7c5cfc' : 'transparent',
                    borderColor: isDone ? '#f5b942' : isActive ? '#7c5cfc' : 'rgba(255,255,255,0.25)',
                    color: isDone ? '#1a1147' : '#fff'
                  }}>
                    {isDone ? '✓' : i + 1}
                  </div>
                  <span style={{
                    ...s.stepLabel,
                    color: isActive ? '#fff' : isDone ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)'
                  }}>
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right panel ── */}
        <div style={s.right}>
          <div style={s.rightTop}>
            <button style={s.loginLink} type="button" onClick={onLoginRequested}>
              Already have an account?{' '}
              <span style={{ color: '#7c5cfc' }}>Log in</span>
            </button>
          </div>

          {/* Step 0 — age */}
          {step === 0 && (
            <>
              <div style={s.stepKicker}>Step 1 of 3</div>
              <div style={s.question}>How old are you?</div>
              <div style={s.ageGroup}>
                <label style={s.ageLabel} htmlFor="ageInput">Your age</label>
                <input
                  id="ageInput"
                  type="number"
                  min="5"
                  max="120"
                  placeholder="13"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  style={s.ageInput}
                />
                <p style={s.ageHint}>We'll tailor the experience to you.</p>
              </div>
            </>
          )}

          {/* Step 1 — money situation */}
          {step === 1 && (
            <>
              <div style={s.stepKicker}>Step 2 of 3</div>
              <div style={s.question}>Where are you with money right now?</div>
              <div style={s.optionsGrid}>
                {moneyOptions.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setMoneySituation(opt.id)}
                    style={{
                      ...s.optionCard,
                      borderColor: moneySituation === opt.id ? '#7c5cfc' : 'rgba(0,0,0,0.1)',
                      background:  moneySituation === opt.id ? '#f0ebff' : '#fff',
                      color:       moneySituation === opt.id ? '#4a2fc3' : '#0f172a'
                    }}
                  >
                    <span style={s.optionEmoji}>{opt.emoji}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 2 — goal */}
          {step === 2 && (
            <>
              <div style={s.stepKicker}>Step 3 of 3</div>
              <div style={s.question}>What's your biggest money goal?</div>
              <div style={s.optionsGrid}>
                {goalOptions.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setGoal(opt.id)}
                    style={{
                      ...s.optionCard,
                      borderColor: goal === opt.id ? '#7c5cfc' : 'rgba(0,0,0,0.1)',
                      background:  goal === opt.id ? '#f0ebff' : '#fff',
                      color:       goal === opt.id ? '#4a2fc3' : '#0f172a'
                    }}
                  >
                    <span style={s.optionEmoji}>{opt.emoji}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 3 — result */}
          {step === 3 && (
            <div style={s.result}>
              <div style={s.resultChip}>Your personalized path</div>
              <div style={s.resultDest}>
                Start with<br />
                <span style={{ color: '#7c5cfc' }}>{recommendation}</span>
              </div>
              <p style={s.resultSub}>{recDescriptions[recommendation]}</p>
            </div>
          )}

          <div style={s.footer}>
            <button
              type="button"
              style={{
                ...s.nextBtn,
                opacity: step === 0 && !age.trim() ? 0.5 : 1
              }}
              onClick={handleNext}
              disabled={step === 0 && !age.trim()}
            >
              {step === 3 ? 'Create my account' : 'Next'} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    background: '#f4f1ff',
    fontFamily: "'Nunito', system-ui, sans-serif"
  },
  shell: {
    width: '100%',
    maxWidth: '800px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    minHeight: '520px',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 24px 60px rgba(15,17,42,0.18)'
  },

  /* Left */
  left: {
    background: '#1a1147',
    padding: '40px 36px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '32px'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  brandIcon: {
    width: '36px',
    height: '36px',
    background: '#7c5cfc',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px'
  },
  brandName: {
    fontFamily: 'Georgia, serif',
    fontSize: '20px',
    color: '#fff',
    fontWeight: '400'
  },
  leftBody: { flex: 1 },
  tagline: {
    fontSize: '28px',
    fontWeight: '900',
    color: '#fff',
    lineHeight: '1.2',
    marginBottom: '14px'
  },
  taglineAccent: { color: '#f5b942' },
  leftDesc: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.55)',
    lineHeight: '1.6',
    fontWeight: '600',
    margin: 0
  },
  stepsTrack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  stepRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'opacity 0.3s'
  },
  stepDot: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '800',
    flexShrink: 0,
    transition: 'all 0.3s'
  },
  stepLabel: {
    fontSize: '13px',
    fontWeight: '700',
    transition: 'color 0.3s'
  },

  /* Right */
  right: {
    background: '#fff',
    padding: '36px 36px 32px',
    display: 'flex',
    flexDirection: 'column'
  },
  rightTop: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '28px'
  },
  loginLink: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#64748b',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    fontFamily: 'inherit'
  },
  stepKicker: {
    fontSize: '11px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#7c5cfc',
    marginBottom: '8px'
  },
  question: {
    fontSize: '22px',
    fontWeight: '900',
    color: '#0f172a',
    lineHeight: '1.25',
    marginBottom: '24px'
  },

  /* Age step */
  ageGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flex: 1
  },
  ageLabel: {
    fontSize: '12px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#64748b'
  },
  ageInput: {
    border: '2px solid #e2e8f0',
    borderRadius: '14px',
    padding: '14px 18px',
    fontSize: '24px',
    fontFamily: 'inherit',
    fontWeight: '800',
    color: '#0f172a',
    background: '#fff',
    width: '140px',
    outline: 'none'
  },
  ageHint: {
    fontSize: '13px',
    color: '#94a3b8',
    fontWeight: '600',
    margin: 0
  },

  /* Options */
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    flex: 1
  },
  optionCard: {
    border: '2px solid',
    borderRadius: '14px',
    padding: '16px 14px',
    textAlign: 'left',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: '700',
    lineHeight: '1.4',
    transition: 'border-color 0.2s, background 0.2s, color 0.2s'
  },
  optionEmoji: {
    fontSize: '22px',
    display: 'block',
    marginBottom: '8px'
  },

  /* Result */
  result: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '14px'
  },
  resultChip: {
    display: 'inline-block',
    background: '#f0ebff',
    color: '#4a2fc3',
    borderRadius: '999px',
    padding: '6px 16px',
    fontSize: '12px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    alignSelf: 'flex-start'
  },
  resultDest: {
    fontSize: '30px',
    fontWeight: '900',
    color: '#0f172a',
    lineHeight: '1.2'
  },
  resultSub: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '600',
    lineHeight: '1.6',
    maxWidth: '280px',
    margin: 0
  },

  /* Footer */
  footer: {
    marginTop: '28px',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  nextBtn: {
    background: '#7c5cfc',
    color: '#fff',
    border: 'none',
    borderRadius: '14px',
    padding: '14px 28px',
    fontFamily: 'inherit',
    fontSize: '15px',
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'background 0.2s, opacity 0.2s'
  }
};