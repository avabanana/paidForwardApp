import React, { useState } from 'react';
import ProgressBar from '../components/ProgressBar';

export default function EarningGrowthScreen({ globalProgress, setGlobalProgress, userTier, username }) {
  const [mode, setMode] = useState('list');
  const [selectedCourse, setSelectedCourse] = useState(null); // null = list, 0 or 1 = course 1 or 2
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [view, setView] = useState('article'); 
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRetry, setIsRetry] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const courses = [
    {
      id: 0,
      title: 'Earning & Growing Your Money',
      emoji: '🚀',
      color: '#8b5cf6',
      description: 'Learn how to create value, earn income, and build your financial foundation.',
      content: {
        elementary: [
          {
            title: "🍋 The Lemonade Stand",
            info: ["Being an entrepreneur means starting your own mini-business, like a lemonade stand!", "You have to buy lemons and sugar first (expenses) before you can sell a cup for a profit.", "Profit is the 'happy money' left over after you pay for your supplies."],
            quizPool: [{ q: "What is 'Profit'?", a: ["Money spent on lemons", "Money left over after paying for supplies", "The price of one cup"], c: 1, topic: "profit" }],
            backups: { "profit": { q: "If it costs $1 to make lemonade and you sell it for $3, how much is your profit?", a: ["$3", "$2", "$1"], c: 1 } }
          },
          {
            title: "🚜 Jobs vs. Chores",
            info: ["A chore is something you do to help your family, but a job is something people pay you for because you provide a service.", "Whether it's walking a neighbor's dog or washing a car, you are trading your time and hard work for money.", "The better you are at your job, the more people will want to hire you!"],
            quizPool: [{ q: "What are you 'trading' when you do a job for someone?", a: ["Your toys", "Your time and skills", "Your lunch"], c: 1, topic: "work" }],
            backups: { "work": { q: "Why might someone pay you more for a job?", a: ["Because you did a great job quickly", "Because you were bored"], c: 0 } }
          },
          {
            title: "🎨 Investing in Yourself",
            info: ["The best way to earn more money later is to learn new things now!", "When you practice drawing, coding, or reading, you are 'investing' in your brain.", "Smart earners never stop learning because their skills are what help them grow their 'Money Tree'."],
            quizPool: [{ q: "What is the best thing to 'invest' in while you are young?", a: ["Candy", "Your own skills and learning", "Video games"], c: 1, topic: "learning" }],
            backups: { "learning": { q: "If you learn how to fix bikes, can you earn more money?", a: ["Yes, because you have a new skill", "No, skills don't matter"], c: 0 } }
          }
        ],
        middle: [
          {
            title: "📈 The Invisible Thief: Inflation",
            info: ["Inflation is why a candy bar cost 5 cents in 1950 but costs $2 today.", "It means that over time, your money loses 'purchasing power'—it buys fewer things than it used to.", "To beat inflation, you need your money to grow faster than the prices in the stores."],
            quizPool: [{ q: "What does inflation do to your money's value?", a: ["Makes it worth more", "Makes it worth less over time", "Keeps it exactly the same"], c: 1, topic: "inflation" }],
            backups: { "inflation": { q: "If inflation is 3%, how much should your savings grow to keep up?", a: ["At least 3%", "0%", "1%"], c: 0 } }
          },
          {
            title: "🛠️ Active vs. Passive Income",
            info: ["Active income is money you get for 'doing' (like a paycheck). If you stop working, the money stops.", "Passive income is money that works for you while you sleep, like rental income or dividends from stocks.", "Building passive income is the secret to long-term financial freedom."],
            quizPool: [{ q: "Which of these is 'Passive' income?", a: ["Working a shift at a cafe", "Mowing a lawn", "Earning money from a book you wrote years ago"], c: 2, topic: "income" }],
            backups: { "income": { q: "Why is passive income helpful?", a: ["It requires 40 hours a week forever", "It keeps earning even when you aren't working"], c: 1 } }
          },
          {
            title: "🧾 The Tax Man Cometh",
            info: ["When you earn money, the government takes a small piece called 'Income Tax'.", "This money pays for things everyone uses, like roads, parks, schools, and fire trucks.", "Your 'Gross Pay' is what you earned, but your 'Net Pay' is what you actually take home."],
            quizPool: [{ q: "What is 'Net Pay'?", a: ["Total money earned before taxes", "The money you keep after taxes", "A bonus from your boss"], c: 1, topic: "taxes" }],
            backups: { "taxes": { q: "What do taxes pay for?", a: ["Public services like roads and schools", "Private birthday parties"], c: 0 } }
          }
        ],
        adult: [
          {
            title: "🚀 Human Capital & Leverage",
            info: ["Human Capital is the economic value of your experience and skills.", "To maximize earnings, you must use 'leverage'—scaling your output through technology, capital, or by managing other people.", "High-value skills are those that are rare and difficult for others to replicate."],
            quizPool: [{ q: "How do you increase your 'Human Capital'?", a: ["Working more hours of manual labor", "Education and specialized training", "Saving more of your current paycheck"], c: 1, topic: "capital" }],
            backups: { "capital": { q: "What is an example of 'leverage' in business?", a: ["Doing every task yourself", "Using software to automate a process"], c: 1 } }
          },
          {
            title: "📊 The Equity Equation",
            info: ["Wealth is rarely built through a salary alone; it is built through 'Equity' (ownership).", "Owning a piece of a business or real estate allows you to benefit from the growth of the asset's value, not just your hourly rate."],
            quizPool: [{ q: "Why is 'Equity' important for wealth building?", a: ["It provides a guaranteed hourly wage", "It allows you to own assets that appreciate", "It's a form of debt"], c: 1, topic: "equity" }],
            backups: { "equity": { q: "Which person is building more equity?", a: ["A salaried employee", "A business owner"], c: 1 } }
          },
          {
            title: "📉 Real vs. Nominal Returns",
            info: ["Nominal return is the percentage your investment made on paper.", "Real return is the nominal return minus inflation ($$Real = Nominal - Inflation$$).", "If your investment made 5% but inflation was 6%, you actually lost 1% of your purchasing power."],
            quizPool: [{ q: "If your ROI is 8% and inflation is 3%, what is your Real Return?", a: ["11%", "8%", "5%"], c: 2, topic: "real_returns" }],
            backups: { "real_returns": { q: "Why calculate Real Returns?", a: ["To see how much actual buying power you gained", "To pay fewer taxes"], c: 0 } }
          }
        ]
      }
    },
    {
      id: 1,
      title: 'Smart Spending & Saving',
      emoji: '🏪',
      color: '#059669',
      description: 'Master the art of budgeting, making wise purchases, and building your savings.',
      content: {
        elementary: [
          {
            title: "🛍️ Smart vs. Silly Spending",
            info: ["Every dollar you have is a choice: spend it now or save it for later.", "Smart spending means buying things you need and value. Silly spending is buying things just because they look cool.", "Before you buy something, ask: 'Do I need this, or do I just want it?'"],
            quizPool: [{ q: "Which is an example of SMART spending?", a: ["Buying every new toy when it comes out", "Buying a winter coat when it's cold", "Buying candy every single day"], c: 1, topic: "spending" }],
            backups: { "spending": { q: "Why is it good to wait before buying something?", a: ["You might change your mind about wanting it", "You'll definitely change your mind", "Waiting never helps"], c: 0 } }
          },
          {
            title: "🐷 Your Piggy Bank: Saving",
            info: ["Saving means putting money away instead of spending it all right now.", "When you save, your money grows! Even small amounts add up over time.", "A great goal is to save at least 10% of any money you get."],
            quizPool: [{ q: "If you get $10 and save 10%, how much do you save?", a: ["$1", "$10", "$5"], c: 0, topic: "saving" }],
            backups: { "saving": { q: "Why does your savings grow?", a: ["Because you add to it over time", "Because the bank clones your money", "It doesn't actually grow"], c: 0 } }
          },
          {
            title: "⏰ The Magic of Waiting",
            info: ["Delayed gratification means waiting to get something you want.", "When you wait, you often discover you didn't want it as much as you thought.", "The people who wait and save are the ones who build real wealth."],
            quizPool: [{ q: "What is 'Delayed Gratification'?", a: ["Being grateful you're late", "Waiting before spending your money", "Eating dessert first"], c: 1, topic: "delay" }],
            backups: { "delay": { q: "Does waiting to buy something help you save money?", a: ["Yes, often you'll decide you don't need it", "No, the price will go up", "Maybe, depending on the day"], c: 0 } }
          }
        ],
        middle: [
          {
            title: "📋 The Budget: Your Money Battle Plan",
            info: ["A budget is a plan for your money. You write down how much you have, and how you'll spend it.", "The best budgets follow the rule: Income - Expenses = Savings.", "When you budget, you always know where your money goes."],
            quizPool: [{ q: "What is a 'Budget'?", a: ["A type of food", "A plan for how to spend your money", "A fancy wallet"], c: 1, topic: "budget" }],
            backups: { "budget": { q: "If you make $100 and spend $70, how much can you save?", a: ["$30", "$70", "$100"], c: 0 } }
          },
          {
            title: "🎯 Wants vs. Needs",
            info: ["Needs are things you must have: food, shelter, clothes, school supplies.", "Wants are things you'd like to have but can live without: games, trendy clothes, snacks.", "Smart budgeting means paying for needs first, then using leftover money for wants."],
            quizPool: [{ q: "Which of these is a NEED?", a: ["A new gaming console", "Groceries and food", "The latest fashion sneakers"], c: 1, topic: "needs" }],
            backups: { "needs": { q: "Should you buy a want before a need?", a: ["Yes, wants are more fun", "No, needs come first", "It doesn't matter"], c: 1 } }
          },
          {
            title: "🆘 Building an Emergency Fund",
            info: ["An emergency fund is money you keep saved for unexpected problems.", "If your bike breaks or you need a doctor visit, an emergency fund saves the day.", "Try to save 3 months of expenses. Start small—even $20 a month helps!"],
            quizPool: [{ q: "What is an 'Emergency Fund'?", a: ["Money you spend on video games", "Money saved for unexpected problems", "A government program"], c: 1, topic: "emergency" }],
            backups: { "emergency": { q: "How much should you try to save in an emergency fund?", a: ["1 month of expenses", "3 months of expenses", "All your money"], c: 1 } }
          }
        ],
        adult: [
          {
            title: "📊 Advanced Budgeting Strategies",
            info: ["The 50/30/20 rule: 50% to needs, 30% to wants, 20% to savings and debt repayment.", "Zero-based budgeting means every dollar has a job—you plan exactly where it goes.", "Track your spending weekly to catch budget creep before it becomes a problem."],
            quizPool: [{ q: "In the 50/30/20 rule, what percentage goes to needs?", a: ["30%", "50%", "20%"], c: 1, topic: "budgetadvanced" }],
            backups: { "budgetadvanced": { q: "What does zero-based budgeting mean?", a: ["Spending zero money", "Every dollar has a purpose", "Saving your money at zero interest"], c: 1 } }
          },
          {
            title: "💳 Debt: Understanding the Cost",
            info: ["Debt is money you borrow that you must pay back, usually with interest.", "Interest is the price you pay for borrowing. A 20% interest credit card means you pay extra for every delayed payment.", "High-interest debt is a wealth killer. The best strategy is to avoid it or pay it off fast."],
            quizPool: [{ q: "What does 'Interest' mean in the context of debt?", a: ["Being curious about something", "The extra money you pay for borrowing", "A savings account"], c: 1, topic: "debt" }],
            backups: { "debt": { q: "Is high-interest debt good or bad for wealth?", a: ["Good, you build credit", "Bad, it costs you money", "Neutral"], c: 1 } }
          },
          {
            title: "📱 Lifestyle Inflation: The Silent Killer",
            info: ["Lifestyle inflation happens when your spending grows as your income grows.", "You get a raise, so you buy a nicer car, bigger apartment, fancier dinners. Suddenly, you have no savings.", "The antidote: when your income increases, increase your savings first, then your lifestyle."],
            quizPool: [{ q: "What is 'Lifestyle Inflation'?", a: ["Prices going up", "Spending more when you earn more", "Financial inflation"], c: 1, topic: "lifestyle" }],
            backups: { "lifestyle": { q: "How do you prevent lifestyle inflation?", a: ["Earn less", "Increase savings first when income rises", "Spend everything immediately"], c: 1 } }
          }
        ]
      }
    }
  ];

  const courseContent = selectedCourse !== null ? courses[selectedCourse] : null;
  const currentCourse = courseContent ? courseContent.content[userTier] || courseContent.content.adult : [];
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
        const modulesDone = currentLessonIndex + 1;
        const newProg = Math.min(modulesDone / currentCourse.length, 1.0);
        setGlobalProgress(newProg, modulesDone);
        setMode('score');
      }
    } else {
      setIsRetry(true);
    }
  };

  const CertificateModal = () => (
    <div style={styles.modalOverlay} className="no-print">
      <div style={{...styles.certBody, borderColor: userTier === 'elementary' ? '#8b5cf6' : '#065f46'}} className="cert-only">
        <div style={styles.certDecoration}>{userTier === 'elementary' ? '🚀' : '📈'}</div>
        <h1 style={{...styles.certTitle, color: userTier === 'elementary' ? '#7c3aed' : '#065f46'}}>
          {courseContent.title.toUpperCase()} CERTIFICATE
        </h1>
        <p style={styles.certText}>This certifies that</p>
        <h2 style={styles.certName}>{username || "Master Builder"}</h2>
        <p style={styles.certText}>has successfully completed</p>
        <h3 style={styles.certCourse}>{courseContent.title}</h3>
        <div style={styles.certSeal}>MASTERED</div>
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
          .cert-only { position: absolute; left: 0; top: 0; width: 100%; border: 10px solid #065f46 !important; }
        }
      `}</style>
    </div>
  );

  if (mode === 'score') return (
    <div style={styles.centerStage}>
      <div style={styles.scoreCard}>
        <div style={{fontSize: '64px'}}>{courseContent.emoji}</div>
        <h2 style={styles.lessonTitle}>Course Module Mastered!</h2>
        <p style={styles.articleText}>You've completed {lesson.title}. Ready for more?</p>
        <button style={styles.primaryBtn} onClick={() => {
          if (currentLessonIndex < currentCourse.length - 1) {
            setCurrentLessonIndex(i => i + 1); 
            setView('article'); 
            setQuestionIndex(0);
            setIsRetry(false);
            setMode('learning');
          } else {
            setGlobalProgress(1.0, currentCourse.length); setShowCertificate(true); setMode('list');
          }
        }}>{currentLessonIndex === currentCourse.length - 1 ? "Claim Certificate" : "Next Module"}</button>
      </div>
    </div>
  );

  if (mode === 'learning') return (
    <div style={styles.learningLayout}>
      <div style={styles.learningHeader}>
        <button onClick={() => { setMode('list'); setSelectedCourse(null); setCurrentLessonIndex(0); setQuestionIndex(0); }} style={styles.iconBtn}>✕</button>
        <div style={{flex: 1}}><ProgressBar progress={globalProgress} /></div>
        <span style={styles.tierTag}>{userTier.toUpperCase()}</span>
      </div>
      
      <div style={styles.contentCard}>
        {view === 'article' ? (
          <>
            <h1 style={styles.lessonTitle}>{lesson.title}</h1>
            {lesson.info.map((p, i) => <p key={i} style={styles.articleText}>{p}</p>)}
            <button style={styles.primaryBtn} onClick={() => setView('quiz')}>Check My Growth</button>
          </>
        ) : (
          <div style={styles.quizSection}>
            {!showFeedback ? (
              <>
                <h3 style={styles.quizHeader}>{isRetry ? "Recalculating..." : "Quick Check"}</h3>
                <p style={styles.quizQuestion}>{isRetry ? lesson.backups[lesson.quizPool[questionIndex].topic].q : lesson.quizPool[questionIndex].q}</p>
                <div style={styles.optionsGrid}>
                  {(isRetry ? lesson.backups[lesson.quizPool[questionIndex].topic] : lesson.quizPool[questionIndex]).a.map((opt, i) => (
                    <button key={i} style={styles.optionBtn} onClick={() => handleQuizAnswer(i)}>{opt}</button>
                  ))}
                </div>
              </>
            ) : (
              <div style={styles.feedbackArea}>
                <div style={{fontSize: '50px', marginBottom: '10px'}}>{isCorrect ? '💎' : '🛠️'}</div>
                <h2 style={{color: isCorrect ? '#8b5cf6' : '#6366f1', marginBottom: '10px'}}>
                  {isCorrect ? "Spot On!" : "Good Effort!"}
                </h2>
                <p style={styles.articleText}>
                  {isCorrect ? "You're on the path to financial mastery." : "Concepts take time to master. Keep learning!"}
                </p>
                <button style={{...styles.primaryBtn, background: isCorrect ? '#8b5cf6' : '#6366f1'}} onClick={nextAction}>
                  {isCorrect ? "Continue" : "Try Again"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (mode === 'list' && selectedCourse !== null) {
    return (
      <div style={styles.dashboard}>
        {showCertificate && <CertificateModal />}
        <div style={styles.coursePreviewCard}>
          <div style={{...styles.cardBanner, background: courseContent.color}}>
            {courseContent.emoji}
          </div>
          <div style={styles.cardContent}>
            <span style={styles.categoryLabel}>{courseContent.title}</span>
            <h3 style={styles.cardTitle}>Progress: {currentLessonIndex + 1}/{currentCourse.length}</h3>
            <p style={styles.cardDesc}>{courseContent.description}</p>
            <div style={styles.progressSection}>
              <div style={styles.progressText}>
                <span>Overall Progress</span>
                <span>{Math.min(Math.round(globalProgress * 100), 100)}%</span>
              </div>
              <ProgressBar progress={globalProgress} />
            </div>
            <button style={styles.primaryBtn} onClick={() => {setMode('learning'); setView('article');}}>
              {globalProgress >= 1 ? "Review Material" : globalProgress > 0 ? "Continue Learning" : "Start Course"}
            </button>
            <button style={{...styles.secondaryBtn, marginTop: '10px'}} onClick={() => setSelectedCourse(null)}>
              Back to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Course selection view
  return (
    <div style={styles.dashboard}>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {courses.map((course, idx) => (
          <div key={idx} style={styles.coursePreviewCard}>
            <div style={{...styles.cardBanner, background: course.color}}>
              {course.emoji}
            </div>
            <div style={styles.cardContent}>
              <span style={styles.categoryLabel}>CURRICULUM</span>
              <h3 style={styles.cardTitle}>{course.title}</h3>
              <p style={styles.cardDesc}>{course.description}</p>
              <div style={styles.progressSection}>
                <div style={styles.progressText}>
                  <span>Progress</span>
                  <span>{Math.min(Math.round(globalProgress * 100), 100)}%</span>
                </div>
                <ProgressBar progress={globalProgress} />
              </div>
              <button style={{...styles.primaryBtn, background: course.color}} onClick={() => setSelectedCourse(idx)}>
                {globalProgress >= 1 ? "Review Course" : globalProgress > 0 ? "Continue" : "Start Course"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  dashboard: { display: 'flex', justifyContent: 'center', padding: '40px 20px', flexWrap: 'wrap', gap: '20px' },
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
  secondaryBtn: { width: '100%', padding: '16px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '16px', fontWeight: '700', cursor: 'pointer', fontSize: '16px' },
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
  certActions: { display: 'flex', gap: '15px', marginTop: '20px' },
  feedbackArea: { textAlign: 'center' }
};
