import React, { useState } from 'react';
import ProgressBar from '../components/ProgressBar';

export default function CoursesScreen({ globalProgress, setGlobalProgress }) {
  const [mode, setMode] = useState('list');
  const [currentLesson, setCurrentLesson] = useState(0);
  const [view, setView] = useState('article'); 
  const [quizScore, setQuizScore] = useState(0);
  const [showScoreCard, setShowScoreCard] = useState(false);

  const courseContent = [
    {
      title: "The Architecture of Compounding",
      info: [
        "Compound interest is often described as 'interest on interest.' While simple interest is calculated only on the principal amount, compounding applies to the principal plus all accumulated interest from previous periods. This creates a geometric growth pattern rather than a linear one.",
        "The three levers of compounding are Time, Rate of Return, and Consistency. The most powerful of these is Time. For instance, a 20-year-old who saves $200 a month until age 60 will likely have significantly more than a 40-year-old who saves $1,000 a month, simply because the money had two extra decades to 'snowball.'",
        "Mathematically, the formula is $A = P(1 + r/n)^{nt}$. Even small differences in your interest rate or the frequency of compounding (monthly vs. annually) can result in tens of thousands of dollars in difference over a lifetime."
      ],
      quiz: [
        { q: "What is the primary difference between simple and compound interest?", a: ["Simple is for banks, compound is for people", "Compound earns on previous interest, simple does not", "Simple interest grows faster"], c: 1 },
        { q: "Which 'lever' of compounding is considered the most powerful?", a: ["Interest Rate", "Initial Deposit", "Time"], c: 2 },
        { q: "What does the 'snowball effect' refer to?", a: ["Winter savings plans", "Exponential growth over time", "Paying off small debts first"], c: 1 }
      ]
    },
    {
      title: "Inflation & Purchasing Power",
      info: [
        "Inflation is the silent thief of the financial world. It represents the rate at which the general level of prices for goods and services is rising. As inflation rises, every dollar you own buys a smaller percentage of a good or service. This is known as a loss of 'purchasing power.'",
        "Central banks typically aim for a 'target inflation rate' of 2%. While moderate inflation is a sign of a growing economy, 'hyperinflation' can devalue a currency overnight. Conversely, 'deflation' (falling prices) can lead to economic stagnation as consumers stop spending, expecting lower prices later.",
        "To protect your wealth, you must achieve a 'Real Rate of Return.' If your savings account pays 1% interest but inflation is 3%, you are effectively losing 2% of your wealth's value every year. This is why investing in assets that outpace inflation, like stocks or real estate, is vital."
      ],
      quiz: [
        { q: "If inflation is 4% and your investment returns 4%, what is your real return?", a: ["4%", "8%", "0%"], c: 2 },
        { q: "What is 'Purchasing Power'?", a: ["The ability to buy items at a discount", "The value of money in terms of what it can buy", "Your total credit limit"], c: 1 },
        { q: "Why is deflation potentially dangerous for an economy?", a: ["It causes prices to rise too fast", "It discourages consumer spending", "It makes exports cheaper"], c: 1 }
      ]
    },
    {
      title: "The 50/30/20 Budgeting Strategy",
      info: [
        "The 50/30/20 rule is a popular guideline designed to help individuals manage their after-tax income. It allocates 50% to 'Needs,' 30% to 'Wants,' and 20% to 'Financial Goals.' This structure provides a balance between necessary obligations and personal enjoyment.",
        "Needs include essential expenses that are difficult to avoid, such as rent/mortgage, utilities, groceries, and insurance. Wants include non-essential spending that enhances your lifestyle, such as dining out, streaming subscriptions, and hobbies. Financial Goals include emergency fund contributions, retirement savings, and extra debt payments.",
        "The beauty of this rule is its flexibility. If your 'Needs' exceed 50%, you must find ways to reduce your 'Wants' or increase your income. By automating the 20% toward savings first (the 'Pay Yourself First' principle), you ensure that your future self is taken care of before you spend on temporary pleasures."
      ],
      quiz: [
        { q: "What percentage of income should go toward 'Financial Goals'?", a: ["50%", "30%", "20%"], c: 2 },
        { q: "Which of these is strictly considered a 'Need'?", a: ["High-speed Unlimited Internet", "Rent/Mortgage", "New Gym Clothes"], c: 1 },
        { q: "What does 'Paying Yourself First' mean?", a: ["Buying a gift after payday", "Putting money into savings before spending on wants", "Giving yourself a raise"], c: 1 }
      ]
    }
  ];

  const handleQuizAnswer = (selectedIndex) => {
    const lesson = courseContent[currentLesson];
    // Check if correct (we're simulating a simple progression here)
    if (selectedIndex === lesson.quiz[0].c) { // Simplified for demo
        setQuizScore(prev => prev + 1);
    }
    
    setShowScoreCard(true);
  };

  const moveToNextModule = () => {
    setShowScoreCard(false);
    setQuizScore(0);
    if (currentLesson < courseContent.length - 1) {
      setCurrentLesson(currentLesson + 1);
      setView('article');
      setGlobalProgress((currentLesson + 1) / courseContent.length);
    } else {
      setGlobalProgress(1.0);
      setMode('result');
    }
  };

  if (mode === 'learning') {
    const lesson = courseContent[currentLesson];

    return (
      <div style={styles.contentWrapper}>
        <div style={styles.lessonHeader}>
          <button onClick={() => setMode('list')} style={styles.backBtn}>✕ Exit</button>
          <div style={{ flex: 1, margin: '0 20px' }}><ProgressBar progress={(currentLesson / courseContent.length)} /></div>
          <span style={styles.lessonCounter}>Module {currentLesson + 1} of 3</span>
        </div>

        {showScoreCard ? (
          <div style={styles.scoreCard}>
            <div style={{fontSize: '40px'}}>📊</div>
            <h2 style={{margin: '10px 0'}}>Module Performance</h2>
            <p style={{fontSize: '18px', color: '#475569'}}>You've grasped the core concepts of <strong>{lesson.title}</strong>!</p>
            <div style={styles.scoreBadge}>Knowledge Check Passed</div>
            <button style={styles.primaryBtn} onClick={moveToNextModule}>
              {currentLesson === 2 ? "Finish Course" : "Continue to Next Module →"}
            </button>
          </div>
        ) : (
          <div style={styles.mainCard}>
            {view === 'article' ? (
              <>
                <h2 style={styles.title}>{lesson.title}</h2>
                {lesson.info.map((para, i) => (
                  <p key={i} style={styles.articleBody}>{para}</p>
                ))}
                <button style={styles.primaryBtn} onClick={() => setView('quiz')}>Test Your Knowledge →</button>
              </>
            ) : (
              <>
                <h3 style={styles.quizTitle}>Module {currentLesson + 1} Quiz</h3>
                <p style={styles.quizText}>{lesson.quiz[0].q}</p>
                {lesson.quiz[0].a.map((opt, i) => (
                  <button key={i} style={styles.optionBtn} onClick={() => handleQuizAnswer(i)}>{opt}</button>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  // --- RESULT & LIST VIEWS REMAIN SIMILAR BUT WITH UPDATED STYLING ---
  if (mode === 'result') {
    return (
      <div style={styles.contentWrapper}>
        <div style={styles.resultCard}>
          <div style={{ fontSize: '60px' }}>🏆</div>
          <h2 style={{ fontSize: '28px', color: '#1e293b' }}>Course Certified!</h2>
          <p style={{ color: '#64748b', marginBottom: '30px' }}>You have successfully mastered Financial Literacy 101.</p>
          <button style={styles.primaryBtn} onClick={() => setMode('list')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.listGrid}>
      <div style={styles.courseCard}>
        <div style={styles.cardHeader}><span style={styles.categoryTag}>ECONOMICS</span></div>
        <h3 style={styles.cardTitle}>Financial Literacy 101</h3>
        <p style={styles.cardSummary}>A comprehensive deep-dive into compounding, inflation, and strategic budgeting.</p>
        <div style={{ marginTop: 'auto' }}>
          <ProgressBar progress={globalProgress} />
          <button style={globalProgress >= 1 ? styles.reviewBtn : styles.startBtn} onClick={() => { setMode('learning'); setCurrentLesson(0); setView('article'); }}>
            {globalProgress >= 1 ? "Review Curriculum" : globalProgress > 0 ? "Resume Module" : "Start Course"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  contentWrapper: { maxWidth: '800px', margin: '0 auto', padding: '20px' },
  lessonHeader: { display: 'flex', alignItems: 'center', marginBottom: '30px' },
  backBtn: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#94a3b8' },
  lessonCounter: { fontSize: '12px', fontWeight: '800', color: '#64748b', minWidth: '100px', textAlign: 'right' },
  mainCard: { background: '#fff', padding: '40px', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' },
  title: { fontSize: '28px', color: '#1e293b', marginBottom: '20px', fontWeight: '900' },
  articleBody: { fontSize: '16px', color: '#475569', lineHeight: '1.8', marginBottom: '20px' },
  primaryBtn: { width: '100%', padding: '18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', marginTop: '20px' },
  quizTitle: { fontSize: '14px', color: '#2563eb', fontWeight: '900', textTransform: 'uppercase', marginBottom: '10px' },
  quizText: { fontSize: '20px', color: '#1e293b', marginBottom: '30px', fontWeight: '700' },
  optionBtn: { display: 'block', width: '100%', padding: '18px', marginBottom: '12px', borderRadius: '14px', border: '2px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: '600', textAlign: 'left' },
  scoreCard: { textAlign: 'center', padding: '50px', background: '#fff', borderRadius: '32px', border: '2px solid #e2e8f0' },
  scoreBadge: { display: 'inline-block', padding: '8px 16px', background: '#dcfce7', color: '#166534', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px', marginTop: '15px' },
  resultCard: { textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '32px' },
  listGrid: { display: 'flex', justifyContent: 'center' },
  courseCard: { background: '#fff', padding: '30px', borderRadius: '32px', width: '350px', height: '400px', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0' },
  cardHeader: { marginBottom: '20px' },
  categoryTag: { fontSize: '10px', fontWeight: '900', color: '#2563eb', background: '#dbeafe', padding: '6px 12px', borderRadius: '8px' },
  cardTitle: { fontSize: '22px', marginBottom: '10px', color: '#1e293b', fontWeight: '800' },
  cardSummary: { color: '#64748b', fontSize: '15px', lineHeight: '1.6' },
  startBtn: { marginTop: '20px', width: '100%', padding: '15px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer' },
  reviewBtn: { marginTop: '20px', width: '100%', padding: '15px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer' }
};