import React, { useMemo, useState } from 'react';
import ProgressBar from '../components/ProgressBar';

const coursesData = [
  {
    id: 0,
    title: 'Earning & Growing Your Money',
    emoji: '🚀',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg,#8b5cf6,#6366f1)',
    tag: 'Starter',
    tagColor: '#ede9fe',
    tagText: '#6d28d9',
    lessons: [
      {
        title: 'Make Your First Budget',
        info: [
          'A budget is your most powerful money tool. Start by writing down every source of income, then list every expense — fixed (rent, subscriptions) and variable (food, fun).',
          'The golden rule: pay yourself first. Move money to savings before spending on anything optional.',
          'Even saving $20/month builds the habit that leads to financial freedom.'
        ],
        quiz: [
          { q: 'What should you track first in a budget?', choices: ['Income and expenses', 'Your social media feed', 'Weather forecasts', 'Your friends\' spending'], a: 0 },
          { q: 'If you consistently spend more than you earn, the best fix is to:', choices: ['Find ways to reduce spending', 'Open a new credit card', 'Ignore it and hope for a raise', 'Borrow from friends'], a: 0 },
          { q: '"Pay yourself first" means:', choices: ['Transfer to savings before spending on wants', 'Spend on yourself before paying bills', 'Buy treats as a reward', 'Ignore savings until you\'re rich'], a: 0 },
          { q: 'Which of these is a variable expense?', choices: ['Dining out', 'Monthly rent', 'Car loan payment', 'Internet bill'], a: 0 },
          { q: 'An emergency fund is best described as:', choices: ['Money saved for unexpected costs', 'A fund for vacations', 'Money set aside for fun', 'A retirement account'], a: 0 },
          { q: 'The most effective saving strategy for beginners is:', choices: ['Saving small, consistent amounts regularly', 'Waiting until you have a lot to save', 'Only saving windfalls and bonuses', 'Saving nothing until debt is paid off'], a: 0 }
        ]
      },
      {
        title: 'Grow With Goals',
        info: [
          'Short-term goals (under a year): saving for a phone, trip, or emergency fund. Long-term goals: car, college, house.',
          'The SMART method works: make goals Specific, Measurable, Achievable, Relevant, and Time-bound.',
          'Checking your progress weekly — even for 5 minutes — dramatically increases your success rate.'
        ],
        quiz: [
          { q: 'A short-term financial goal typically refers to:', choices: ['A target achievable within a year', 'A retirement plan', 'A 30-year mortgage', 'An inheritance plan'], a: 0 },
          { q: 'Long-term financial goals are best for:', choices: ['Major future milestones like buying a car', 'This week\'s groceries', 'Daily coffee budgeting', 'Weekend plans'], a: 0 },
          { q: 'Reviewing your goals regularly helps you:', choices: ['Stay on track and adjust as needed', 'Forget what you were saving for', 'Accidentally spend your savings', 'Lower your ambitions'], a: 0 },
          { q: 'A SMART goal is:', choices: ['Specific, Measurable, Achievable, Relevant, Time-bound', 'Simple, Magic, Automatic, Random, Tidy', 'Saving Money At Random Times', 'None of the above'], a: 0 },
          { q: 'Tracking your savings progress means:', choices: ['Checking your balance and progress consistently', 'Looking at it once a year', 'Asking someone else to track it', 'Never thinking about it'], a: 0 },
          { q: 'The strongest motivation to reach a financial goal comes from:', choices: ['Personal reasons that matter to you', 'Peer pressure from others', 'Random external rewards', 'Social media trends'], a: 0 }
        ]
      },
      {
        title: 'Smart Spending',
        info: [
          'Needs are things required to survive: food, housing, health. Wants are extras — nice but optional.',
          'Before any non-urgent purchase over $50, try a 24-hour wait. Impulse decisions often disappear.',
          'Price comparison takes 2 minutes and can save you hundreds per year.'
        ],
        quiz: [
          { q: 'Which of the following is a financial "need"?', choices: ['Groceries and food', 'A new video game console', 'Designer clothing', 'A vacation package'], a: 0 },
          { q: 'Before making a major purchase, the smartest move is to:', choices: ['Compare prices across multiple stores', 'Buy immediately to avoid missing out', 'Use a credit card to worry later', 'Ask a friend if it looks cool'], a: 0 },
          { q: 'Smart, intentional spending leads to:', choices: ['More savings and less financial stress', 'Less money available for necessities', 'No noticeable difference in your life', 'Higher debt levels'], a: 0 },
          { q: 'Impulse buying is defined as:', choices: ['Unplanned purchases driven by emotion', 'Carefully researched spending decisions', 'Buying only necessities', 'Using a strict shopping list'], a: 0 },
          { q: 'Waiting for a sale before buying something you want:', choices: ['Saves money and builds patience', 'Is never worth the wait', 'Usually means you miss out', 'Has no financial impact'], a: 0 },
          { q: '"Wants" in personal finance are best described as:', choices: ['Enjoyable but not essential purchases', 'Things required to function daily', 'Always free or discounted items', 'Emergency expenses'], a: 0 }
        ]
      }
    ]
  },
  {
    id: 1,
    title: 'Saving & Planning',
    emoji: '💰',
    color: '#059669',
    gradient: 'linear-gradient(135deg,#059669,#10b981)',
    tag: 'Planner',
    tagColor: '#d1fae5',
    tagText: '#065f46',
    lessons: [
      {
        title: 'Emergency Fund',
        info: [
          'An emergency fund is your financial seatbelt — you hope you never need it, but you\'ll be glad it\'s there.',
          'The standard recommendation: save 3–6 months of living expenses. Start with a goal of just $500 and build from there.',
          'Keep your emergency fund in a separate high-yield savings account so it\'s accessible but not tempting to touch.'
        ],
        quiz: [
          { q: 'An emergency fund is primarily used for:', choices: ['Unexpected necessary expenses', 'Planned vacations', 'Regular entertainment spending', 'Buying the latest gadgets'], a: 0 },
          { q: 'The best way to start building an emergency fund is:', choices: ['Small, consistent contributions over time', 'Waiting until you have enough to save a large amount', 'Taking out a loan to fund it', 'Using a credit card as a backup instead'], a: 0 },
          { q: 'A "rainy day fund" is:', choices: ['A savings buffer for life\'s surprises', 'A plan for a rainy weather vacation', 'A joke people make about saving', 'A type of investment account'], a: 0 },
          { q: 'Having an emergency fund protects you most against:', choices: ['Sudden job loss or unexpected bills', 'Getting bored on weekends', 'Friend drama and social costs', 'Rising inflation generally'], a: 0 },
          { q: 'The ideal emergency fund size is:', choices: ['3–6 months of living expenses', 'Exactly $100', 'Your entire savings balance', 'Nothing — insurance covers everything'], a: 0 },
          { q: 'The best place to keep an emergency fund is:', choices: ['A high-yield savings account', 'Under your mattress', 'Invested in stocks for better returns', 'Spent on things that hold value'], a: 0 }
        ]
      },
      {
        title: 'Budgeting Tools',
        info: [
          'Modern budgeting tools — from apps like YNAB or Mint to a simple spreadsheet — make tracking nearly effortless.',
          'The 50/30/20 rule: 50% on needs, 30% on wants, 20% on savings and debt. Adjust based on your situation.',
          'The biggest mistake in budgeting is setting it up once and never revisiting. Review monthly and adjust.'
        ],
        quiz: [
          { q: 'The main purpose of a budget is to:', choices: ['Plan and control your spending intentionally', 'Spend as much as possible freely', 'Track how much money you lose', 'Avoid thinking about finances'], a: 0 },
          { q: 'Tracking your expenses helps you:', choices: ['Identify patterns and cut unnecessary spending', 'Forget where your money goes', 'Justify every purchase', 'Ignore your financial situation'], a: 0 },
          { q: 'A good long-term savings habit involves:', choices: ['Consistent contributions on a regular schedule', 'Spending everything daily and saving nothing', 'Borrowing money to fund savings', 'Saving only when you feel like it'], a: 0 },
          { q: 'In the 50/30/20 rule, 20% represents:', choices: ['Savings and debt repayment', 'Entertainment and dining out', 'Housing and utilities', 'Health and fitness costs'], a: 0 },
          { q: 'Adjusting your budget monthly means:', choices: ['Updating it to reflect life changes and goals', 'Never changing it once set', 'Ignoring it whenever it\'s inconvenient', 'Only looking at it in emergencies'], a: 0 },
          { q: 'The most useful digital tools for budgeting include:', choices: ['Dedicated apps and spreadsheets', 'Just guessing based on memory', 'No tools at all', 'Asking friends what they spend'], a: 0 }
        ]
      },
      {
        title: 'Future You',
        info: [
          'Compound interest is the eighth wonder of the world — money you save today earns interest, and that interest earns more interest.',
          'Starting at 22 instead of 32 can mean hundreds of thousands more at retirement, even with the same contributions.',
          'Investing in yourself through education and skills is one of the highest-return financial moves you can make.'
        ],
        quiz: [
          { q: 'Financial planning for the future primarily means:', choices: ['Making decisions today that benefit your future self', 'Forgetting about money until retirement', 'Spending freely now and worrying later', 'Investing only in physical possessions'], a: 0 },
          { q: 'Starting to save early in life is:', choices: ['One of the most powerful financial advantages', 'Pointless because inflation erodes savings', 'Only important for rich people', 'Less effective than starting late with more money'], a: 0 },
          { q: 'You can improve your financial future most by:', choices: ['Consistently learning and saving over time', 'Spending your entire paycheck each month', 'Ignoring financial education entirely', 'Only focusing on earning more income'], a: 0 },
          { q: 'Compound interest benefits your savings by:', choices: ['Making your money grow exponentially over time', 'Slowly reducing your savings balance', 'Having no meaningful impact on small amounts', 'Only working in retirement accounts'], a: 0 },
          { q: 'The best time to begin saving for retirement is:', choices: ['As early as possible in your career', 'At exactly age 65', 'Only after paying off all debt', 'Never — Social Security is enough'], a: 0 },
          { q: 'Investing in yourself financially means:', choices: ['Building skills and education that increase earning power', 'Buying premium video games and entertainment', 'Taking on high-interest debt for luxuries', 'Spending on appearance to impress others'], a: 0 }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Credit & Smart Borrowing',
    emoji: '💳',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg,#ef4444,#f97316)',
    tag: 'Credit Pro',
    tagColor: '#fee2e2',
    tagText: '#991b1b',
    lessons: [
      {
        title: 'What Is Credit?',
        info: [
          'Credit is borrowing money now and promising to repay it later — usually with interest. It\'s a tool, not free money.',
          'Used wisely, credit helps you build a credit history that unlocks better loan rates, apartment approvals, and even some jobs.',
          'Used poorly, credit creates a debt spiral that can take years to escape.'
        ],
        quiz: [
          { q: 'Credit is best defined as:', choices: ['Borrowing money now with a promise to repay later', 'Receiving free money from a bank', 'A government gift program', 'Extra income from your employer'], a: 0 },
          { q: 'Making a late payment on a credit card typically causes:', choices: ['Higher fees and potential credit score damage', 'Lower interest rates as a penalty', 'Nothing — banks don\'t track this', 'An automatic credit limit increase'], a: 0 },
          { q: 'Good credit history helps you:', choices: ['Qualify for better loan terms and lower interest rates', 'Lose money on transactions', 'Sleep significantly better at night', 'Avoid ever needing to work'], a: 0 },
          { q: 'Your credit report shows:', choices: ['Your history of borrowing and repayment', 'Your list of personal friends', 'Current weather and financial forecasts', 'Your social media activity'], a: 0 },
          { q: 'Building strong credit requires:', choices: ['Time and consistent responsible financial behavior', 'No effort at all — it builds automatically', 'Spending as much as possible on credit', 'Closing all your accounts and starting fresh'], a: 0 },
          { q: 'Credit cards are best described as:', choices: ['Convenient financial tools that carry real risk if misused', 'Completely free money with no consequences', 'Useless compared to cash for all transactions', 'Only for wealthy people with high incomes'], a: 0 }
        ]
      },
      {
        title: 'Interest Basics',
        info: [
          'Interest is the cost of borrowing money. On debt, it grows what you owe. On savings, it grows what you have.',
          'APR (Annual Percentage Rate) is the yearly cost of carrying debt. Credit card APRs average 20–28%.',
          'Paying your full balance monthly means you pay $0 in interest — that\'s the goal with credit cards.'
        ],
        quiz: [
          { q: 'Interest on a debt balance means:', choices: ['The amount you owe grows over time', 'Your debt automatically decreases monthly', 'There is no real financial effect', 'The bank pays you for borrowing'], a: 0 },
          { q: 'When comparing loan options, a lower interest rate is:', choices: ['Always better — it means you pay less over time', 'Worse because it extends your loan term', 'Exactly the same as a higher rate', 'Only important for very large loans'], a: 0 },
          { q: 'Paying your bills on time is:', choices: ['Critical for your credit score and avoiding fees', 'Completely optional with no real consequences', 'Only necessary for large bills like rent', 'Less important than paying the minimum'], a: 0 },
          { q: 'APR stands for:', choices: ['Annual Percentage Rate', 'Always Pay on Receipt', 'Automated Payment Reminder', 'Account Premium Reward'], a: 0 },
          { q: 'High-interest debt is financially:', choices: ['Very expensive and should be paid off as fast as possible', 'Actually cheap if you only pay the minimum', 'Completely free if you have good credit', 'Beneficial for your credit score to carry'], a: 0 },
          { q: 'Interest on a savings account:', choices: ['Grows your money passively over time', 'Slowly reduces your savings balance', 'Has no meaningful effect on your balance', 'Only applies to investment accounts'], a: 0 }
        ]
      },
      {
        title: 'Credit Score',
        info: [
          'Your credit score (300–850) is calculated from payment history (35%), amounts owed (30%), length of history (15%), new credit (10%), and credit mix (10%).',
          'A score above 740 is considered excellent and unlocks the best rates on mortgages, auto loans, and credit cards.',
          'Check your credit report annually at annualcreditreport.com — it\'s free and won\'t hurt your score.'
        ],
        quiz: [
          { q: 'A higher credit score typically results in:', choices: ['Lower interest rates and better loan approvals', 'Higher interest rates on all loans', 'Being denied for all credit applications', 'No difference from a low score'], a: 0 },
          { q: 'Keeping your credit card balance low relative to your limit is:', choices: ['Beneficial — it improves your credit utilization ratio', 'Harmful — you should max it out monthly', 'Completely neutral — balances don\'t matter', 'Only relevant if you have multiple cards'], a: 0 },
          { q: 'A strong credit score is primarily built by:', choices: ['Making consistent on-time payments over time', 'Ignoring bills and paying whenever convenient', 'Borrowing as much money as possible', 'Closing old accounts to start fresh'], a: 0 },
          { q: 'Your credit score can directly affect:', choices: ['Loan approvals, interest rates, and sometimes employment', 'Only your ability to get a mortgage', 'Just your credit card interest rate', 'Nothing outside of borrowing money'], a: 0 },
          { q: 'Regularly checking your credit report helps you:', choices: ['Monitor for errors and track your progress', 'Waste time on an unimportant task', 'Lower your score by checking too often', 'Nothing — it\'s purely optional information'], a: 0 },
          { q: 'Improving a low credit score requires:', choices: ['Consistent good habits practiced over months and years', 'A single large payment to fix everything', 'Closing all your existing accounts', 'Zero effort — scores improve automatically'], a: 0 }
        ]
      }
    ]
  }
];

const ensureSixQuestions = (questions) => {
  const q = [...questions];
  while (q.length < 6) q.push(questions[q.length % questions.length]);
  return q;
};

const randomizeQuestion = (question) => {
  const correctText = question.choices[question.a];
  const choices = [...question.choices].sort(() => Math.random() - 0.5);
  const a = choices.indexOf(correctText);
  return { ...question, choices, a };
};

export default function CoursesScreen({ courseProgressMap = {}, setCourseProgressMap, onCourseComplete, username = '', userTier = 'adult' }) {
  const [page, setPage] = useState('list');
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [quiz, setQuiz] = useState(null);
  const [result, setResult] = useState(null);
  const [answerFeedback, setAnswerFeedback] = useState(null);
  const [completedCourseTitle, setCompletedCourseTitle] = useState('');

  const isElementary = userTier === 'elementary';
  const courseHeading = isElementary ? 'Money Adventures' : 'Courses';
  const courseSubtitle = isElementary
    ? 'Fun lessons, easy quizzes, and helpful tips for younger learners.'
    : 'Learn practical money skills, pass quizzes, and earn certificates.';

  const course = useMemo(() => coursesData.find((c) => c.id === currentCourseId), [currentCourseId]);
  const lesson = course?.lessons?.[currentLesson];

  const courseLessonDone = (courseId, lessonIdx) =>
    Boolean(courseProgressMap?.[`course_${courseId}_lesson_${lessonIdx}`]);

  const lessonsCompleted = (courseId) => {
    const c = coursesData.find((x) => x.id === courseId);
    if (!c) return 0;
    return c.lessons.reduce((sum, _, idx) => sum + (courseLessonDone(courseId, idx) ? 1 : 0), 0);
  };

  const courseProgress = (courseId) => {
    const c = coursesData.find((x) => x.id === courseId);
    if (!c) return 0;
    return lessonsCompleted(courseId) / c.lessons.length;
  };

  const totalCoursesFinished = coursesData.filter((c) => lessonsCompleted(c.id) === c.lessons.length).length;

  const firstIncompleteLesson = (courseId) => {
    const c = coursesData.find((x) => x.id === courseId);
    if (!c) return 0;
    for (let idx = 0; idx < c.lessons.length; idx += 1) {
      if (!courseLessonDone(courseId, idx)) return idx;
    }
    return c.lessons.length - 1;
  };

  const startCourse = (id) => {
    setCurrentCourseId(id);
    setCurrentLesson(firstIncompleteLesson(id));
    setQuiz(null);
    setResult(null);
    setPage('lesson');
  };

  const beginQuiz = () => {
    const set = ensureSixQuestions(lesson.quiz).map(randomizeQuestion);
    setQuiz({ questions: set, index: 0, correct: 0, wrong: [] });
    setResult(null);
    setPage('quiz');
  };

  const pickAnswer = (choice) => {
    if (!quiz || answerFeedback) return;
    const question = quiz.questions[quiz.index];
    const isCorrect = choice === question.a;
    setAnswerFeedback({
      correct: isCorrect,
      selected: question.choices[choice],
      correctAnswer: question.choices[question.a]
    });
  };

  const nextQuestion = () => {
    if (!answerFeedback) return;
    const question = quiz.questions[quiz.index];
    const isCorrect = answerFeedback.correct;
    const nextIndex = quiz.index + 1;
    const updatedWrong = isCorrect
      ? quiz.wrong
      : [...quiz.wrong, { q: question.q, selected: answerFeedback.selected, correctAnswer: answerFeedback.correctAnswer }];
    const updatedCorrect = quiz.correct + (isCorrect ? 1 : 0);

    if (nextIndex >= quiz.questions.length) {
      const score = Math.round((updatedCorrect / quiz.questions.length) * 100);
      const passed = score >= 70;
      setResult({ score, passed, correct: updatedCorrect, total: quiz.questions.length, wrong: updatedWrong });
      setQuiz(null);
      setAnswerFeedback(null);
      if (passed) {
        setCourseProgressMap?.(`course_${course.id}_lesson_${currentLesson}`, 1);
      }
      setPage('result');
      return;
    }
    setQuiz({ ...quiz, index: nextIndex, correct: updatedCorrect, wrong: updatedWrong });
    setAnswerFeedback(null);
  };

  const continueAfterResult = () => {
    if (!result) return;
    if (!result.passed) { beginQuiz(); return; }
    const next = currentLesson + 1;
    if (next < (course?.lessons?.length || 0)) {
      setCurrentLesson(next);
      setResult(null);
      setPage('lesson');
      return;
    }
    onCourseComplete?.(course.id);
    setCompletedCourseTitle(course.title);
    setPage('certificate');
  };

  // ─── COURSE LIST ──────────────────────────────────────────────────────────
  if (page === 'list') {
    return (
      <div style={cStyles.container}>
        <div style={cStyles.header}>
          <div>
            <div style={cStyles.headerBadge}>{isElementary ? '🧠 Money Adventures' : '📚 Learning Track'}</div>
            <h2 style={cStyles.headerTitle}>
              {courseHeading}{username ? ` for ${username}` : ''}
            </h2>
            <p style={cStyles.headerSub}>{courseSubtitle}</p>
          </div>
          <div style={cStyles.completedPill}>
            <span style={{ fontSize: '20px' }}>🎓</span>
            <div>
              <div style={{ fontWeight: '800', fontSize: '20px' }}>{totalCoursesFinished}/3</div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>Completed</div>
            </div>
          </div>
        </div>

        <div style={cStyles.grid}>
          {coursesData.map((c) => {
            const prog = courseProgress(c.id);
            const done = lessonsCompleted(c.id);
            const isFinished = prog >= 1;
            return (
              <div key={c.id} style={cStyles.courseCard}>
                <div style={{ ...cStyles.courseCardTop, background: c.gradient }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '40px' }}>{c.emoji}</span>
                    <span style={{ ...cStyles.courseTierTag, background: 'rgba(255,255,255,0.25)', color: '#fff' }}>
                      {c.tag}
                    </span>
                  </div>
                  <h3 style={cStyles.courseCardTitle}>{c.title}</h3>
                  <p style={cStyles.courseCardSub}>
                    {c.lessons.length} lessons · quiz after each
                  </p>
                </div>

                <div style={cStyles.courseCardBottom}>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
                      <span>{done}/{c.lessons.length} lessons</span>
                      <span>{Math.round(prog * 100)}%</span>
                    </div>
                    <ProgressBar progress={prog} />
                  </div>
                  <button
                    onClick={() => startCourse(c.id)}
                    style={{
                      ...cStyles.startBtn,
                      background: isFinished ? '#f1f5f9' : c.gradient,
                      color: isFinished ? '#475569' : '#fff',
                      border: isFinished ? '2px solid #e2e8f0' : 'none'
                    }}
                  >
                    {isFinished ? '✓ Review Course' : prog > 0 ? '▶ Continue' : '▶ Start Course'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── LESSON VIEW ─────────────────────────────────────────────────────────
  if (page === 'lesson' && course && lesson) {
    const lessonsDone = lessonsCompleted(course.id);
    const lessonProg = currentLesson / course.lessons.length;

    return (
      <div style={cStyles.innerContainer}>
        <button onClick={() => setPage('list')} style={cStyles.backBtn}>
          ← Back to courses
        </button>

        {/* Course header bar */}
        <div style={{ ...cStyles.courseHeaderBar, background: course.gradient }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <span style={{ fontSize: '28px' }}>{course.emoji}</span>
            <div>
              <h2 style={{ margin: 0, color: '#fff', fontSize: '20px', fontWeight: '800' }}>{course.title}</h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>
                Lesson {currentLesson + 1} of {course.lessons.length}
              </p>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginBottom: '6px', fontWeight: '600' }}>
              <span>Course Progress</span>
              <span>{lessonsDone}/{course.lessons.length} lessons complete</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.3)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(lessonsDone / course.lessons.length) * 100}%`, background: '#fff', borderRadius: '999px', transition: 'width 0.4s ease' }} />
            </div>
          </div>
        </div>

        {/* Lesson steps */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {course.lessons.map((l, idx) => (
            <div
              key={idx}
              style={{
                flex: 1, height: '4px', borderRadius: '999px',
                background: idx < currentLesson ? course.color : idx === currentLesson ? course.color + 'aa' : '#e2e8f0'
              }}
            />
          ))}
        </div>

        {/* Lesson content card */}
        <div style={cStyles.lessonCard}>
          <div style={{ ...cStyles.lessonNumBadge, background: course.gradient }}>
            Lesson {currentLesson + 1}
          </div>
          <h3 style={cStyles.lessonTitle}>{lesson.title}</h3>
          <div style={cStyles.lessonInfoList}>
            {lesson.info.map((line, idx) => (
              <div key={idx} style={cStyles.lessonInfoItem}>
                <div style={{ ...cStyles.lessonInfoDot, background: course.color }} />
                <p style={cStyles.lessonInfoText}>{line}</p>
              </div>
            ))}
          </div>
          <button onClick={beginQuiz} style={{ ...cStyles.quizBtn, background: course.gradient }}>
            📝 Take the Quiz
          </button>
        </div>
      </div>
    );
  }

  // ─── QUIZ VIEW ────────────────────────────────────────────────────────────
  if (page === 'quiz' && quiz) {
    const q = quiz.questions[quiz.index];
    const progressPct = ((quiz.index) / quiz.questions.length) * 100;

    return (
      <div style={cStyles.innerContainer}>
        <button onClick={() => setPage('lesson')} style={cStyles.backBtn}>← Back to lesson</button>

        {/* Quiz progress */}
        <div style={cStyles.quizHeaderCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '15px' }}>
              Question {quiz.index + 1} / {quiz.questions.length}
            </span>
            <span style={{ ...cStyles.scoreChip, background: course?.gradient }}>
              ✅ {quiz.correct} correct
            </span>
          </div>
          <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${progressPct}%`,
              background: course?.gradient || '#2563eb',
              borderRadius: '999px',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        <div style={cStyles.quizCard}>
          <div style={{ ...cStyles.questionNumBadge, background: course?.color + '20', color: course?.color }}>
            Q{quiz.index + 1}
          </div>
          <p style={cStyles.questionText}>{q.q}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {q.choices.map((choice, i) => {
              const isCorrect = i === q.a;
              const isSelectedWrong = answerFeedback && !answerFeedback.correct && answerFeedback.selected === choice;
              const btnStyle = {
                ...cStyles.choiceBtn,
                cursor: answerFeedback ? 'default' : 'pointer',
                background: '#f8fafc',
                borderColor: '#e2e8f0',
                color: '#334155',
                fontWeight: 500,
                ...(answerFeedback && isCorrect ? { background: '#d1fae5', borderColor: '#22c55e', color: '#065f46', fontWeight: 700 } : {}),
                ...(answerFeedback && isSelectedWrong ? { background: '#fee2e2', borderColor: '#ef4444', color: '#991b1b', fontWeight: 700 } : {})
              };
              return (
                <button
                  key={i}
                  onClick={() => pickAnswer(i)}
                  disabled={!!answerFeedback}
                  style={btnStyle}
                >
                  <span style={cStyles.choiceLetter}>{['A', 'B', 'C', 'D'][i]}</span>
                  {choice}
                </button>
              );
            })}
          </div>

          {answerFeedback && (
            <div style={{
              ...cStyles.feedbackBox,
              background: answerFeedback.correct ? '#d1fae5' : '#fee2e2',
              borderColor: answerFeedback.correct ? '#6ee7b7' : '#fca5a5'
            }}>
              <p style={{ fontWeight: '800', margin: '0 0 4px', fontSize: '16px', color: answerFeedback.correct ? '#065f46' : '#991b1b' }}>
                {answerFeedback.correct ? '✅ Correct!' : '❌ Not quite.'}
              </p>
              {!answerFeedback.correct && (
                <p style={{ margin: '0 0 10px', color: '#475569', fontSize: '14px' }}>
                  Correct answer: <strong>{answerFeedback.correctAnswer}</strong>
                </p>
              )}
              <button
                onClick={nextQuestion}
                style={{ ...cStyles.nextBtn, background: course?.gradient || '#2563eb' }}
              >
                {quiz.index + 1 >= quiz.questions.length ? 'See Results →' : 'Next Question →'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── RESULT VIEW ─────────────────────────────────────────────────────────
  if (page === 'result' && result) {
    return (
      <div style={cStyles.innerContainer}>
        <div style={{
          ...cStyles.resultCard,
          background: result.passed
            ? 'linear-gradient(135deg,#065f46,#059669)'
            : 'linear-gradient(135deg,#7f1d1d,#dc2626)'
        }}>
          <div style={{ fontSize: '60px', marginBottom: '8px' }}>
            {result.passed ? '🎉' : '😤'}
          </div>
          <h2 style={{ color: '#fff', margin: '0 0 6px', fontSize: '28px', fontWeight: '900' }}>
            {result.passed ? 'Quiz Passed!' : 'Not Quite!'}
          </h2>
          <div style={cStyles.scoreDisplay}>
            <div style={cStyles.scoreCircle}>
              <span style={{ fontSize: '28px', fontWeight: '900', color: result.passed ? '#059669' : '#dc2626' }}>
                {result.score}%
              </span>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.9)', margin: '0 0 4px' }}>
            {result.correct} / {result.total} correct
          </p>
          {!result.passed && (
            <p style={{ color: '#fca5a5', fontWeight: '700', margin: '4px 0 0' }}>
              You need 70% to pass — you can do it!
            </p>
          )}
        </div>

        {result.wrong.length > 0 && (
          <div style={cStyles.wrongAnswersCard}>
            <h3 style={{ margin: '0 0 14px', fontSize: '16px', color: '#1e293b' }}>📋 Review Your Mistakes</h3>
            {result.wrong.map((w, i) => (
              <div key={i} style={cStyles.wrongItem}>
                <p style={{ margin: '0 0 4px', fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>{w.q}</p>
                <p style={{ margin: '0 0 2px', color: '#dc2626', fontSize: '13px' }}>❌ Your answer: {w.selected}</p>
                <p style={{ margin: 0, color: '#059669', fontSize: '13px' }}>✅ Correct: {w.correctAnswer}</p>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={continueAfterResult}
          style={{
            ...cStyles.continueBtn,
            background: result.passed
              ? course?.gradient || '#059669'
              : 'linear-gradient(135deg,#f59e0b,#d97706)'
          }}
        >
          {result.passed
            ? currentLesson + 1 < (course?.lessons?.length || 0)
              ? '▶ Next Lesson'
              : '🎓 Finish Course'
            : '🔄 Retry Quiz'}
        </button>
      </div>
    );
  }

  // ─── CERTIFICATE ─────────────────────────────────────────────────────────
  if (page === 'certificate') {
    return (
      <div style={cStyles.innerContainer}>
        <div style={cStyles.certCard}>
          <div style={{ ...cStyles.certTop, background: course?.gradient }}>
            <div style={{ fontSize: '56px', marginBottom: '8px' }}>🎓</div>
            <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '2px', opacity: 0.8, textTransform: 'uppercase' }}>Certificate of Completion</div>
          </div>
          <div style={cStyles.certBody}>
            <p style={{ color: '#64748b', margin: '0 0 6px', fontSize: '15px' }}>This certifies that</p>
            <h2 style={{ margin: '0 0 6px', fontSize: '28px', color: '#1e293b', fontWeight: '900' }}>{username || 'Learner'}</h2>
            <p style={{ color: '#64748b', margin: '0 0 16px' }}>has successfully completed</p>
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px 20px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
              <p style={{ margin: 0, fontWeight: '700', fontSize: '18px', color: '#1e293b' }}>{completedCourseTitle}</p>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 24px' }}>
              Demonstrating financial literacy and commitment to building money skills.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => setPage('list')} style={cStyles.certBtn}>
                ← Back to Courses
              </button>
              <button
                onClick={() => setPage('list')}
                style={{ ...cStyles.certBtn, background: course?.gradient, color: '#fff', border: 'none' }}
              >
                🏠 Done
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

const cStyles = {
  container: {
    padding: '24px 16px 48px',
    maxWidth: '1100px',
    margin: '0 auto',
    fontFamily: "'Inter', system-ui, sans-serif",
    background: 'radial-gradient(circle at top left, rgba(59,130,246,0.08), transparent 28%), radial-gradient(circle at bottom right, rgba(16,185,129,0.08), transparent 24%), #f8fafc',
    borderRadius: '28px'
  },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', flexWrap: 'wrap',
    gap: '16px', marginBottom: '28px'
  },
  headerBadge: {
    display: 'inline-flex', alignItems: 'center',
    background: '#e0e7ff', color: '#3730a3',
    borderRadius: '999px', padding: '5px 12px',
    fontSize: '12px', fontWeight: '700', marginBottom: '8px'
  },
  headerTitle: { margin: '0 0 6px', fontSize: '32px', fontWeight: '900', color: '#111827' },
  headerSub: { margin: 0, color: '#64748b', fontSize: '15px' },
  completedPill: {
    display: 'flex', alignItems: 'center', gap: '12px',
    background: 'linear-gradient(135deg,#6366f1,#2563eb)',
    color: '#fff', borderRadius: '16px', padding: '14px 20px',
    boxShadow: '0 8px 24px rgba(99,102,241,0.3)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
    gap: '20px'
  },
  courseCard: {
    borderRadius: '20px', overflow: 'hidden',
    boxShadow: '0 12px 32px rgba(15,23,42,0.1)',
    border: '1px solid rgba(0,0,0,0.06)',
    display: 'flex', flexDirection: 'column'
  },
  courseCardTop: {
    padding: '24px', color: '#fff'
  },
  courseCardTitle: {
    margin: '14px 0 6px', fontSize: '20px',
    fontWeight: '800', color: '#fff', lineHeight: 1.2
  },
  courseCardSub: {
    margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.8)'
  },
  courseTierTag: {
    borderRadius: '999px', padding: '4px 12px',
    fontSize: '11px', fontWeight: '800',
    letterSpacing: '0.5px', textTransform: 'uppercase'
  },
  courseCardBottom: {
    background: '#fff', padding: '18px', flex: 1
  },
  startBtn: {
    width: '100%', padding: '12px', border: 'none',
    borderRadius: '12px', fontWeight: '800',
    fontSize: '14px', cursor: 'pointer',
    transition: 'opacity 0.2s', fontFamily: 'inherit'
  },
  innerContainer: {
    maxWidth: '780px', margin: '0 auto',
    padding: '0 16px 40px',
    fontFamily: "'Inter', system-ui, sans-serif"
  },
  backBtn: {
    border: 'none', background: 'none',
    color: '#2563eb', cursor: 'pointer',
    marginBottom: '16px', fontSize: '14px',
    fontWeight: '600', padding: 0
  },
  courseHeaderBar: {
    padding: '20px 24px', borderRadius: '18px',
    marginBottom: '16px', color: '#fff'
  },
  lessonCard: {
    background: '#fff', borderRadius: '18px',
    padding: '28px', boxShadow: '0 8px 24px rgba(0,0,0,0.07)',
    border: '1px solid #f1f5f9'
  },
  lessonNumBadge: {
    display: 'inline-block', color: '#fff',
    borderRadius: '999px', padding: '4px 14px',
    fontSize: '12px', fontWeight: '700',
    marginBottom: '12px', letterSpacing: '0.5px'
  },
  lessonTitle: {
    margin: '0 0 18px', fontSize: '22px',
    fontWeight: '800', color: '#111827'
  },
  lessonInfoList: { display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' },
  lessonInfoItem: { display: 'flex', gap: '12px', alignItems: 'flex-start' },
  lessonInfoDot: {
    width: '8px', height: '8px', borderRadius: '50%',
    marginTop: '6px', flexShrink: 0
  },
  lessonInfoText: { margin: 0, color: '#334155', fontSize: '15px', lineHeight: '1.7' },
  quizBtn: {
    padding: '13px 28px', border: 'none',
    borderRadius: '12px', color: '#fff',
    fontWeight: '800', fontSize: '15px',
    cursor: 'pointer', fontFamily: 'inherit'
  },
  quizHeaderCard: {
    background: '#fff', borderRadius: '14px',
    padding: '16px 20px', marginBottom: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  },
  scoreChip: {
    borderRadius: '999px', padding: '4px 12px',
    color: '#fff', fontSize: '12px', fontWeight: '700'
  },
  quizCard: {
    background: '#fff', borderRadius: '18px',
    padding: '28px', boxShadow: '0 8px 24px rgba(0,0,0,0.07)'
  },
  questionNumBadge: {
    display: 'inline-block', borderRadius: '8px',
    padding: '4px 10px', fontSize: '12px',
    fontWeight: '800', marginBottom: '12px'
  },
  questionText: {
    fontSize: '19px', fontWeight: '700',
    color: '#1e293b', marginBottom: '20px',
    lineHeight: '1.5'
  },
  choiceBtn: {
    padding: '14px 16px', textAlign: 'left',
    border: '2px solid #e2e8f0', borderRadius: '12px',
    background: '#f8fafc', fontSize: '14px',
    fontWeight: '500', color: '#334155',
    display: 'flex', alignItems: 'center', gap: '12px',
    fontFamily: 'inherit', transition: 'border-color 0.2s'
  },
  choiceLetter: {
    width: '28px', height: '28px', borderRadius: '8px',
    background: '#e2e8f0', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: '800',
    color: '#475569', flexShrink: 0
  },
  feedbackBox: {
    marginTop: '18px', padding: '16px 18px',
    borderRadius: '14px', border: '2px solid'
  },
  nextBtn: {
    padding: '11px 24px', border: 'none',
    borderRadius: '10px', color: '#fff',
    fontWeight: '700', cursor: 'pointer',
    fontSize: '14px', fontFamily: 'inherit'
  },
  resultCard: {
    borderRadius: '20px', padding: '32px 24px',
    textAlign: 'center', marginBottom: '18px',
    boxShadow: '0 12px 32px rgba(0,0,0,0.15)'
  },
  scoreDisplay: { margin: '16px 0' },
  scoreCircle: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '90px', height: '90px', borderRadius: '50%',
    background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
  },
  wrongAnswersCard: {
    background: '#fff', borderRadius: '18px',
    padding: '20px', marginBottom: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  },
  wrongItem: {
    padding: '12px', background: '#fef9f9',
    borderRadius: '10px', marginBottom: '10px',
    border: '1px solid #fecaca'
  },
  continueBtn: {
    width: '100%', padding: '15px',
    border: 'none', borderRadius: '14px',
    color: '#fff', fontWeight: '800',
    fontSize: '16px', cursor: 'pointer',
    fontFamily: 'inherit'
  },
  certCard: {
    borderRadius: '24px', overflow: 'hidden',
    boxShadow: '0 20px 48px rgba(0,0,0,0.12)',
    border: '1px solid #e2e8f0'
  },
  certTop: {
    padding: '40px 24px', textAlign: 'center', color: '#fff'
  },
  certBody: {
    background: '#fff', padding: '32px 24px', textAlign: 'center'
  },
  certBtn: {
    padding: '12px 24px', borderRadius: '12px',
    border: '2px solid #e2e8f0', background: '#f8fafc',
    color: '#475569', fontWeight: '700', cursor: 'pointer',
    fontSize: '14px', fontFamily: 'inherit'
  }
};