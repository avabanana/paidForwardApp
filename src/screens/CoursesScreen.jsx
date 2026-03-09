import React, { useState, useEffect } from 'react';
import ProgressBar from '../components/ProgressBar';

export default function CoursesScreen({ courseProgressMap = {}, updateCourseProgress, onCourseComplete, userTier, username }) {
  const normalizeCourseKey = (id) => `course_${id}`;
  const getProgress = (id) => {
    return courseProgressMap[id] ?? courseProgressMap[normalizeCourseKey(id)] ?? 0;
  };

  const [mode, setMode] = useState('list');
  const [selectedCourse, setSelectedCourse] = useState(null); 
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [view, setView] = useState('article');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRetry, setIsRetry] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  // --- Course Data ---
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
    // ... Additional courses follow the same tier structure ...
  ];

  const courseContent = selectedCourse !== null ? courses.find((c) => c.id === selectedCourse) : null;
  const currentCourse = courseContent ? courseContent.content[userTier] || courseContent.content.adult : [];
  const lesson = currentCourse[currentLessonIndex] || {};
  const courseProgress = selectedCourse !== null ? getProgress(selectedCourse) : 0;

  const resetToList = () => {
    setMode('list');
    setSelectedCourse(null);
    setShowCertificate(false);
  };

  const startCourse = (courseId) => {
    const rawProgress = getProgress(courseId);
    const selected = courses.find((c) => c.id === courseId);
    const tierContent = selected.content[userTier] || selected.content.adult;
    const lessonCount = tierContent.length;

    // REDUNDANCY FIX: If already completed, jump to lesson 0 and skip mastery screen
    if (rawProgress >= 1) {
      setCurrentLessonIndex(0);
      setMode('learning');
    } else {
      const resumeLesson = Math.min(Math.floor(rawProgress * lessonCount), lessonCount - 1);
      setCurrentLessonIndex(resumeLesson);
      setMode('learning');
    }

    setSelectedCourse(courseId);
    setQuestionIndex(0);
    setView('article');
    setIsRetry(false);
    setShowFeedback(false);
  };

  const getQuestion = () => {
    const base = lesson.quizPool?.[questionIndex] || {};
    const backup = lesson.backups?.[base.topic];
    return isRetry && backup ? backup : base;
  };

  const handleQuizAnswer = (idx) => {
    const q = getQuestion();
    setIsCorrect(idx === q.c);
    setShowFeedback(true);
  };

  const handleStartQuiz = () => {
    // PROGRESS TRACKING: Update progress to reflect that they are starting the quiz of current lesson
    // e.g., if on lesson 1 of 3, they are now roughly 33% through
    const currentStepProgress = (currentLessonIndex + 0.5) / currentCourse.length;
    updateCourseProgress(selectedCourse, currentStepProgress);
    setView('quiz');
  };

  const onLessonComplete = () => {
    const nextLessonIndex = currentLessonIndex + 1;
    const isActuallyComplete = nextLessonIndex >= currentCourse.length;
    const progress = isActuallyComplete ? 1 : nextLessonIndex / currentCourse.length;
    
    updateCourseProgress(selectedCourse, progress);

    if (isActuallyComplete) {
      onCourseComplete?.(selectedCourse, courseContent.title);
      setShowCertificate(true);
      setMode('completed');
    } else {
      setCurrentLessonIndex(nextLessonIndex);
      setQuestionIndex(0);
      setView('article');
      setIsRetry(false);
    }
  };

  const nextAction = () => {
    setShowFeedback(false);
    if (!isCorrect && !isRetry) {
      setIsRetry(true);
      return;
    }
    if (questionIndex < (lesson.quizPool?.length || 0) - 1) {
      setQuestionIndex((prev) => prev + 1);
      setIsRetry(false);
      return;
    }
    onLessonComplete();
  };

  // --- Sub-Components ---
  const CertificateModal = () => (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.certBody, borderColor: courseContent.color }}>
        <div style={styles.certDecoration}>🎓</div>
        <h1 style={{ ...styles.certTitle, color: courseContent.color }}>COURSE COMPLETE</h1>
        <p style={styles.certText}>Congratulations, {username || 'Student'}!</p>
        <h2 style={styles.certName}>{courseContent.title}</h2>
        <div style={{...styles.certSeal, background: courseContent.color}}>MASTERED</div>
        <button style={{ ...styles.primaryBtn, marginTop: '20px' }} onClick={resetToList}>
          Continue Journey
        </button>
      </div>
    </div>
  );

  if (mode === 'list') {
    return (
      <div style={styles.dashboard}>
        {courses.map((course) => {
          const progress = getProgress(course.id);
          return (
            <div key={course.id} style={styles.coursePreviewCard}>
              <div style={{ ...styles.cardBanner, background: course.color }}>{course.emoji}</div>
              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{course.title}</h3>
                <ProgressBar progress={progress} />
                <button style={{ ...styles.primaryBtn, marginTop: '15px' }} onClick={() => startCourse(course.id)}>
                  {progress >= 1 ? 'Review' : progress > 0 ? 'Continue' : 'Start'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (mode === 'learning' || mode === 'completed') {
    const question = getQuestion();
    return (
      <div style={styles.learningLayout}>
        {showCertificate && <CertificateModal />}
        <div style={styles.learningHeader}>
          <button style={styles.iconBtn} onClick={resetToList}>← Exit</button>
          <div style={styles.tierTag}>{userTier?.toUpperCase()} MODE</div>
        </div>

        <div style={styles.contentCard}>
          <div style={{ marginBottom: '20px' }}>
            <ProgressBar progress={courseProgress} />
          </div>

          {view === 'article' ? (
            <>
              <h1 style={styles.lessonTitle}>{lesson.title}</h1>
              {lesson.info?.map((p, idx) => <p key={idx} style={styles.articleText}>{p}</p>)}
              <button style={styles.primaryBtn} onClick={handleStartQuiz}>Check My Knowledge</button>
            </>
          ) : (
            <div style={styles.quizSection}>
              {!showFeedback ? (
                <>
                  <p style={styles.quizQuestion}>{question.q}</p>
                  <div style={styles.optionsGrid}>
                    {question.a?.map((opt, i) => (
                      <button key={i} style={styles.optionBtn} onClick={() => handleQuizAnswer(i)}>{opt}</button>
                    ))}
                  </div>
                </>
              ) : (
                <div style={styles.feedbackArea}>
                  <h2 style={{color: isCorrect ? '#059669' : '#ef4444'}}>{isCorrect ? '✅ Excellent!' : '❌ Not Quite'}</h2>
                  <button style={styles.primaryBtn} onClick={nextAction}>{isCorrect ? 'Continue' : 'Try Again'}</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

const styles = {
  dashboard: { display: 'flex', flexWrap: 'wrap', gap: '20px', padding: '20px', justifyContent: 'center' },
  coursePreviewCard: { background: '#fff', borderRadius: '24px', width: '300px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
  cardBanner: { height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' },
  cardContent: { padding: '20px' },
  cardTitle: { fontSize: '18px', marginBottom: '15px', fontWeight: 'bold' },
  learningLayout: { maxWidth: '700px', margin: '0 auto', padding: '20px' },
  learningHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: '#64748b' },
  tierTag: { background: '#e2e8f0', padding: '4px 12px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' },
  contentCard: { background: '#fff', padding: '35px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
  lessonTitle: { fontSize: '28px', marginBottom: '20px' },
  articleText: { fontSize: '17px', lineHeight: '1.6', color: '#334155', marginBottom: '15px' },
  quizSection: { textAlign: 'center' },
  quizQuestion: { fontSize: '20px', fontWeight: 'bold', marginBottom: '25px' },
  optionsGrid: { display: 'flex', flexDirection: 'column', gap: '10px' },
  optionBtn: { padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', textAlign: 'left' },
  primaryBtn: { padding: '15px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', width: '100%' },
  feedbackArea: { padding: '20px' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  certBody: { background: '#fff', padding: '40px', borderRadius: '28px', textAlign: 'center', border: '8px solid' },
  certDecoration: { fontSize: '60px', marginBottom: '10px' },
  certTitle: { fontSize: '22px', fontWeight: '900' },
  certText: { fontSize: '16px', color: '#64748b' },
  certName: { fontSize: '32px', margin: '15px 0' },
  certSeal: { display: 'inline-block', padding: '8px 20px', borderRadius: '20px', color: '#fff', fontWeight: 'bold', marginTop: '10px' }
};