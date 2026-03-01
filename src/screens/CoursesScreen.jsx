import React, { useState } from 'react';
import ProgressBar from '../components/ProgressBar';

export default function CoursesScreen({ globalProgress, setGlobalProgress, userTier, username }) {
  const [mode, setMode] = useState('list');
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [view, setView] = useState('article'); 
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRetry, setIsRetry] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const tieredContent = {
    elementary: [
      {
        title: "🌿 The Magic Money Tree",
        info: [
          "Imagine if you planted a single penny and it grew into a tree full of coins!",
          "When you put money in a savings bucket and leave it alone, the bank adds a little 'magic dust' called interest.",
          "The longer you wait, the bigger your tree grows. If you pick the fruit too early, the tree stops growing!"
        ],
        quizPool: [
          { q: "What is the 'magic dust' that makes your money grow in a bank?", a: ["Interest", "Lucky Clover", "Sparkles"], c: 0, topic: "grow" }
        ],
        backups: { "grow": { q: "To get the biggest money tree, what should you do?", a: ["Spend it all today", "Leave it to grow for a long time"], c: 1 } }
      },
      {
        title: "🍎 Wants vs. Needs",
        info: [
          "A 'Need' is something you must have to live, like healthy food or a warm bed.",
          "A 'Want' is something that is fun to have but you don't actually need, like a new toy.",
          "Smart savers always buy their Needs first, then see if they have enough left for a Want!"
        ],
        quizPool: [
          { q: "Which of these is a NEED?", a: ["A new video game", "Healthy vegetables", "A toy dinosaur"], c: 1, topic: "needs" }
        ],
        backups: { "needs": { q: "If you only have enough money for one, which do you pick?", a: ["The Need", "The Want"], c: 0 } }
      }
    ],
    middle: [
      {
        title: "❄️ The Snowball Effect",
        info: [
          "Compounding is like rolling a snowball down a big hill. It starts small, but as it rolls, it picks up more snow and gets huge!",
          "In finance, your interest starts earning its own interest. This is how small savings become massive over time.",
          "The secret weapon is Time. Starting at your age gives you a much bigger 'hill' to roll your snowball down."
        ],
        quizPool: [
          { q: "What does 'Compounding' actually mean?", a: ["Losing money to taxes", "Earning interest on your interest", "Spending exactly what you earn"], c: 1, topic: "time" }
        ],
        backups: { "time": { q: "Why is starting to save in middle school a 'secret weapon'?", a: ["You have more time for the snowball to grow", "Middle schoolers get higher rates"], c: 0 } }
      },
      {
        title: "💳 Credit Score Secrets",
        info: [
          "A credit score is like a 'Trust Grade' that banks give you.",
          "If you borrow money and pay it back on time, your grade goes up. If you're late, it goes down.",
          "A high grade makes it much easier and cheaper to buy a car or a house when you're older."
        ],
        quizPool: [
          { q: "What is a credit score most like?", a: ["A bank balance", "A report card for borrowing", "A social media follower count"], c: 1, topic: "credit" }
        ],
        backups: { "credit": { q: "What is the best way to keep a high credit score?", a: ["Pay your bills on time", "Spend all your money today"], c: 0 } }
      }
    ],
    adult: [
      {
        title: "🏛️ The Architecture of Compounding",
        info: [
          "Compound interest is the mathematical process where the principal amount earns interest, and that interest is then added to the principal to earn even more interest.",
          "The standard formula is $$A = P(1 + r/n)^{nt}$$.",
          "By understanding the 'Real Rate of Return' (nominal return minus inflation), you can strategically plan for long-term financial independence."
        ],
        quizPool: [
          { q: "In the compounding formula, which variable has the most significant exponential impact?", a: ["Principal (P)", "Interest Rate (r)", "Time (t)"], c: 2, topic: "math" }
        ],
        backups: { "math": { q: "What happens to the rate of growth over long periods in a compounding account?", a: ["It grows linearly", "It grows exponentially"], c: 1 } }
      },
      {
        title: "📊 Asset Allocation & Risk",
        info: [
          "Diversification is the strategy of spreading your investments across various assets to reduce risk.",
          "Asset allocation involves balancing high-growth equities with stable fixed-income bonds based on your goals.",
          "The 'Rule of 100' suggests subtracting your age from 100 to find the percentage of stocks you should hold."
        ],
        quizPool: [
          { q: "Why is 'Diversification' important in a portfolio?", a: ["To avoid all taxes", "To reduce risk by not putting all eggs in one basket", "To guarantee a 50% return"], c: 1, topic: "risk" }
        ],
        backups: { "risk": { q: "Which asset is generally considered lower risk?", a: ["Government Bonds", "Individual Tech Stocks"], c: 0 } }
      }
    ]
  };

  const currentCourse = tieredContent[userTier] || tieredContent['adult'];
  const lesson = currentCourse[currentLessonIndex];

  const handleQuizAnswer = (idx) => {
    const q = isRetry ? lesson.backups[lesson.quizPool[questionIndex].topic] : lesson.quizPool[questionIndex];
    setIsCorrect(idx === q.c);
    setShowFeedback(true);
  };

  const nextAction = () => {
    setShowFeedback(false);
    if (isCorrect) {
      if (questionIndex < lesson.quizPool.length - 1) {
        setQuestionIndex(prev => prev + 1);
        setIsRetry(false);
      } else {
        const prog = (currentLessonIndex + 1) / currentCourse.length;
        setGlobalProgress(prog);
        setMode('score');
      }
    } else {
      setIsRetry(true);
    }
  };

  const CertificateModal = () => (
    <div style={styles.modalOverlay} className="no-print">
      <div style={{...styles.certBody, borderColor: userTier === 'elementary' ? '#fbbf24' : '#1e3a8a'}} className="cert-only">
        <div style={styles.certDecoration}>{userTier === 'elementary' ? '🏆' : '⚖️'}</div>
        <h1 style={{...styles.certTitle, color: userTier === 'elementary' ? '#d97706' : '#1e3a8a'}}>
          {userTier === 'elementary' ? "SUPER SAVER AWARD" : "CERTIFICATE OF MASTERY"}
        </h1>
        <p style={styles.certText}>This certifies that</p>
        <h2 style={styles.certName}>{username || "Future Millionaire"}</h2>
        <p style={styles.certText}>has successfully mastered the foundations of</p>
        <h3 style={styles.certCourse}>Financial Literacy</h3>
        <div style={styles.certSeal}>PAIDFORWARD VERIFIED</div>
        <div style={styles.certActions} className="no-print">
          <button style={styles.primaryBtn} onClick={() => window.print()}>Download PDF</button>
          <button style={{...styles.secondaryBtn}} onClick={() => setShowCertificate(false)}>Close</button>
        </div>
      </div>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .no-print { display: none !important; }
          .cert-only, .cert-only * { visibility: visible; }
          .cert-only { position: absolute; left: 0; top: 0; width: 100%; border: 10px solid #1e3a8a !important; }
        }
      `}</style>
    </div>
  );

  if (mode === 'score') return (
    <div style={styles.centerStage}>
      <div style={styles.scoreCard}>
        <div style={{fontSize: '64px'}}>🎯</div>
        <h2 style={styles.lessonTitle}>{userTier === 'elementary' ? "You're Amazing!" : "Module Mastered"}</h2>
        <p style={styles.articleText}>You've completed {lesson.title}. Ready for the next step?</p>
        <button style={styles.primaryBtn} onClick={() => {
          if (currentLessonIndex < currentCourse.length - 1) {
            setCurrentLessonIndex(i => i + 1); 
            setView('article'); 
            setQuestionIndex(0);
            setIsRetry(false);
            setMode('learning');
          } else {
            setGlobalProgress(1.0); setShowCertificate(true); setMode('list');
          }
        }}>{currentLessonIndex === currentCourse.length - 1 ? "Claim Certificate" : "Next Module"}</button>
      </div>
    </div>
  );

  if (mode === 'learning') return (
    <div style={styles.learningLayout}>
      <div style={styles.learningHeader}>
        <button onClick={() => setMode('list')} style={styles.iconBtn}>✕</button>
        <div style={{flex: 1}}><ProgressBar progress={globalProgress} /></div>
        <span style={styles.tierTag}>{userTier.toUpperCase()}</span>
      </div>
      
      <div style={styles.contentCard}>
        {view === 'article' ? (
          <>
            <h1 style={styles.lessonTitle}>{lesson.title}</h1>
            {lesson.info.map((p, i) => <p key={i} style={styles.articleText}>{p}</p>)}
            <button style={styles.primaryBtn} onClick={() => setView('quiz')}>Start Knowledge Check</button>
          </>
        ) : (
          <div style={styles.quizSection}>
            {!showFeedback ? (
              <>
                <h3 style={styles.quizHeader}>{isRetry ? "Let's try that again..." : "Quick Quiz"}</h3>
                <p style={styles.quizQuestion}>{isRetry ? lesson.backups[lesson.quizPool[questionIndex].topic].q : lesson.quizPool[questionIndex].q}</p>
                <div style={styles.optionsGrid}>
                  {(isRetry ? lesson.backups[lesson.quizPool[questionIndex].topic] : lesson.quizPool[questionIndex]).a.map((opt, i) => (
                    <button key={i} style={styles.optionBtn} onClick={() => handleQuizAnswer(i)}>{opt}</button>
                  ))}
                </div>
              </>
            ) : (
              <div style={styles.feedbackArea}>
                <div style={{fontSize: '50px', marginBottom: '10px'}}>{isCorrect ? '🌟' : '💡'}</div>
                <h2 style={{color: isCorrect ? '#10b981' : '#3b82f6', marginBottom: '10px'}}>
                  {isCorrect ? "Perfect!" : "Almost there!"}
                </h2>
                <p style={styles.articleText}>
                  {isCorrect ? "You've got a solid handle on this." : "Financial concepts can be tricky. Let's try a similar question to be sure."}
                </p>
                <button style={{...styles.primaryBtn, background: isCorrect ? '#10b981' : '#2563eb'}} onClick={nextAction}>
                  {isCorrect ? "Continue" : "Try Again"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={styles.dashboard}>
      {showCertificate && <CertificateModal />}
      <div style={styles.coursePreviewCard}>
        <div style={{...styles.cardBanner, background: userTier === 'elementary' ? '#fbbf24' : '#2563eb'}}>
          {userTier === 'elementary' ? '🌱' : '💰'}
        </div>
        <div style={styles.cardContent}>
          <span style={styles.categoryLabel}>CURRICULUM</span>
          <h3 style={styles.cardTitle}>{userTier.charAt(0).toUpperCase() + userTier.slice(1)} Financial Path</h3>
          <p style={styles.cardDesc}>Master the basics of money management through your own life stage.</p>
          <div style={styles.progressSection}>
            <div style={styles.progressText}>
              <span>Progress</span>
              <span>{Math.round(globalProgress * 100)}%</span>
            </div>
            <ProgressBar progress={globalProgress} />
          </div>
          <button style={styles.primaryBtn} onClick={() => {setMode('learning'); setView('article');}}>
            {globalProgress >= 1 ? "Review Material" : globalProgress > 0 ? "Continue Learning" : "Start Course"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  dashboard: { display: 'flex', justifyContent: 'center', padding: '40px 20px' },
  coursePreviewCard: { background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '400px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' },
  cardBanner: { height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' },
  cardContent: { padding: '24px' },
  categoryLabel: { fontSize: '10px', fontWeight: '800', color: '#64748b', letterSpacing: '1px' },
  cardTitle: { fontSize: '22px', margin: '8px 0', color: '#1e293b' },
  cardDesc: { fontSize: '14px', color: '#64748b', marginBottom: '20px', lineHeight: '1.5' },
  progressSection: { marginBottom: '20px' },
  progressText: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '8px' },
  learningLayout: { maxWidth: '800px', margin: '0 auto', padding: '20px' },
  learningHeader: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' },
  iconBtn: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8' },
  tierTag: { background: '#f1f5f9', padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '800', color: '#475569' },
  contentCard: { background: '#fff', padding: '40px', borderRadius: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' },
  lessonTitle: { fontSize: '32px', color: '#1e293b', marginBottom: '24px', fontWeight: '800' },
  articleText: { fontSize: '18px', color: '#475569', lineHeight: '1.8', marginBottom: '20px' },
  quizSection: { animation: 'fadeIn 0.5s ease' },
  quizHeader: { fontSize: '12px', color: '#2563eb', fontWeight: '900', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '1px' },
  quizQuestion: { fontSize: '22px', fontWeight: '700', color: '#1e293b', marginBottom: '30px' },
  optionsGrid: { display: 'flex', flexDirection: 'column', gap: '12px' },
  optionBtn: { padding: '16px 20px', borderRadius: '16px', border: '2px solid #f1f5f9', background: '#fff', textAlign: 'left', cursor: 'pointer', fontSize: '16px', fontWeight: '600', color: '#475569', transition: 'all 0.2s' },
  primaryBtn: { width: '100%', padding: '16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: '700', cursor: 'pointer', fontSize: '16px' },
  secondaryBtn: { width: '100%', padding: '16px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '16px', fontWeight: '700', cursor: 'pointer', fontSize: '16px', marginTop: '10px' },
  centerStage: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' },
  scoreCard: { textAlign: 'center', background: '#fff', padding: '60px', borderRadius: '40px', boxShadow: '0 30px 60px rgba(0,0,0,0.05)', maxWidth: '500px' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' },
  certBody: { background: '#fff', padding: '60px', borderRadius: '10px', border: '15px double', textAlign: 'center', maxWidth: '600px', position: 'relative' },
  certDecoration: { fontSize: '60px', marginBottom: '20px' },
  certTitle: { fontSize: '36px', fontWeight: '900', marginBottom: '10px' },
  certText: { fontSize: '16px', color: '#64748b', margin: '5px 0' },
  certName: { fontSize: '42px', fontFamily: 'serif', margin: '20px 0', color: '#1e293b', borderBottom: '2px solid #e2e8f0', display: 'inline-block', padding: '0 20px' },
  certCourse: { fontSize: '20px', fontWeight: '700', color: '#334155', marginBottom: '40px' },
  certSeal: { position: 'absolute', bottom: '120px', right: '40px', width: '100px', height: '100px', border: '4px double #fbbf24', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '900', color: '#fbbf24', transform: 'rotate(-15deg)', padding: '5px' },
  certActions: { display: 'flex', gap: '15px', marginTop: '20px' }
};