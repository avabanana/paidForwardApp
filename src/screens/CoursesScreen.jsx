import React, { useState } from 'react';

import ProgressBar from '../components/ProgressBar';



export default function CoursesScreen({ courseProgressMap = {}, setCourseProgressMap, onCourseComplete, userTier, username }) {
  const normalizeCourseKey = (id) => `course_${id}`;
  const getProgress = (id) => {
    return courseProgressMap[id] ?? courseProgressMap[normalizeCourseKey(id)] ?? 0;
  };

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

    },
    {
      id: 2,
      title: 'Credit & Borrowing Basics',
      emoji: '💳',
      color: '#ef4444',
      description: 'Understand credit, interest, and how borrowing wisely can help you reach your goals.',
      content: {
        elementary: [
          {
            title: "📘 What is Credit?",
            info: [
              "Credit is when someone lets you borrow money now and pay it back later.",
              "If you use credit wisely, you can buy bigger things, like a bike or a computer, and pay over time.",
              "Using credit responsibly helps you build trust with lenders (like banks)."
            ],
            quizPool: [{ q: "If you borrow $5 and pay it back later, you are using...", a: ["Savings", "Credit", "A gift"], c: 1, topic: "credit" }],
            backups: { "credit": { q: "Borrowing money and paying it back later is called...", a: ["Saving", "Credit", "Stealing"], c: 1 } }
          },
          {
            title: "💡 Good Credit Habits",
            info: [
              "Paying back what you borrow on time is the best way to build good credit.",
              "If you miss payments, it can be harder to borrow money later.",
              "Good credit can help you get better deals on loans and even help you rent an apartment."
            ],
            quizPool: [{ q: "What helps build good credit?", a: ["Paying bills on time", "Ignoring bills", "Borrowing more money"], c: 0, topic: "credit_habits" }],
            backups: { "credit_habits": { q: "Missing payments can...", a: ["Help your credit", "Hurt your credit", "Do nothing"], c: 1 } }
          },
          {
            title: "🔍 Interest: The Cost of Borrowing",
            info: [
              "Interest is extra money you pay when you borrow money.",
              "If the interest is high, you pay back much more than you borrowed.",
              "It's smart to compare interest rates before you borrow."
            ],
            quizPool: [{ q: "If a loan has high interest, you will...", a: ["Pay back more than you borrowed", "Pay back less", "Pay back the same"], c: 0, topic: "interest" }],
            backups: { "interest": { q: "Interest is...", a: ["Free money", "Extra cost when you borrow", "A type of credit score"], c: 1 } }
          }
        ],
        middle: [
          {
            title: "🏦 Building a Credit Score",
            info: [
              "A credit score shows how likely you are to pay back money you borrow.",
              "Paying on time, keeping balances low, and not applying for too much credit can help your score.",
              "A higher score can mean better loan rates when you're older."
            ],
            quizPool: [{ q: "Which action can help your credit score?", a: ["Paying bills late", "Using half of your available credit", "Applying for many cards"], c: 1, topic: "credit_score" }],
            backups: { "credit_score": { q: "Using too much of your available credit can...", a: ["Help your score", "Hurt your score", "Make no difference"], c: 1 } }
          },
          {
            title: "💱 Interest Rates Explained",
            info: [
              "Interest rates can be fixed (stay the same) or variable (go up and down).",
              "A lower interest rate usually means you pay less over time.",
              "Always compare interest rates before choosing a loan."
            ],
            quizPool: [{ q: "A loan with a lower interest rate will...", a: ["Cost you less overall", "Cost you more overall", "Be confusing"], c: 0, topic: "interest_rates" }],
            backups: { "interest_rates": { q: "Searching for a lower rate can help you...", a: ["Save money", "Spend more money", "Get a bigger loan"], c: 0 } }
          },
          {
            title: "🧾 Paying Back Loans",
            info: [
              "Loans often have a schedule that shows how much you owe each month.",
              "Paying more than the minimum can save you money on interest.",
              "Try to avoid loans with really high interest."
            ],
            quizPool: [{ q: "Paying more than the minimum payment usually...", a: ["Saves you money on interest", "Makes you pay more", "Has no effect"], c: 0, topic: "loan_payments" }],
            backups: { "loan_payments": { q: "What happens if you only pay the minimum?", a: ["You pay more interest over time", "You pay less interest", "You pay the same"], c: 0 } }
          }
        ],
        adult: [
          {
            title: "📉 Credit Utilization & Scores",
            info: [
              "Credit utilization is the percent of your available credit you are using.",
              "Keeping utilization under 30% helps your score.",
              "Even if you pay off your balance, high utilization can temporarily lower your score."
            ],
            quizPool: [{ q: "What is a healthy credit utilization rate?", a: ["90%", "50%", "Under 30%"], c: 2, topic: "utilization" }],
            backups: { "utilization": { q: "High utilization can...", a: ["Raise your score", "Lower your score", "Not matter"], c: 1 } }
          },
          {
            title: "💳 Choosing the Right Card",
            info: [
              "Some cards offer rewards like cash back or travel points.",
              "Others have lower interest rates or no annual fees.",
              "Pick a card that matches how you spend and how you pay it off."
            ],
            quizPool: [{ q: "A good credit card for you should...", a: ["Have high fees", "Match your spending habits", "Come with a surprise balance"], c: 1, topic: "card_choice" }],
            backups: { "card_choice": { q: "Why check the interest rate on a card?", a: ["It tells you how quickly debt grows", "It is used for rewards", "It is irrelevant"], c: 0 } }
          },
          {
            title: "🧭 Managing Credit Over Time",
            info: [
              "Good credit takes time; paying bills on time is the most important part.",
              "A small mistake can be fixed by making consistent on-time payments.",
              "Review your credit report once a year to spot mistakes."
            ],
            quizPool: [{ q: "The best way to build credit is to...", a: ["Pay on time consistently", "Open many accounts quickly", "Ignore your bills"], c: 0, topic: "long_term" }],
            backups: { "long_term": { q: "Checking your credit report helps you...", a: ["Find mistakes", "Increase your balance", "Borrow more"], c: 0 } }
          }
        ]
      }
    }
  ];



  const courseContent = selectedCourse !== null ? courses.find((c) => c.id === selectedCourse) : null;
  const currentCourse = courseContent ? courseContent.content[userTier] || courseContent.content.adult : [];
  const lesson = currentCourse[currentLessonIndex] || {};
  const courseProgress = selectedCourse !== null ? getProgress(selectedCourse) : 0;

  const resetToList = () => {
    setMode('list');
    setSelectedCourse(null);
    setCurrentLessonIndex(0);
    setQuestionIndex(0);
    setView('article');
    setIsRetry(false);
    setShowFeedback(false);
    setShowCertificate(false);
  };

  const startCourse = (courseId) => {
    const rawProgress = getProgress(courseId);
    const lessonCount = courses.find((c) => c.id === courseId)?.content[userTier]?.length || 1;
    const resumeLesson = Math.min(Math.floor(rawProgress * lessonCount), lessonCount - 1);

    setSelectedCourse(courseId);
    setCurrentLessonIndex(resumeLesson);
    setQuestionIndex(0);
    setView('article');
    setMode('learning');
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

  const onLessonComplete = () => {
    const nextLessonIndex = currentLessonIndex + 1;
    const progress = Math.min(nextLessonIndex / currentCourse.length, 1);
    setCourseProgressMap?.(normalizeCourseKey(selectedCourse), progress);

    if (nextLessonIndex < currentCourse.length) {
      setCurrentLessonIndex(nextLessonIndex);
      setQuestionIndex(0);
      setView('article');
      setIsRetry(false);
      return;
    }

    setShowCertificate(true);
    setMode('completed');
    onCourseComplete?.(selectedCourse);
  };

  const nextAction = () => {
    setShowFeedback(false);

    // If first attempt is wrong, show backup question.
    // After the backup attempt, we move on regardless.
    if (!isCorrect && !isRetry) {
      setIsRetry(true);
      return;
    }

    // Proceed to the next quiz question (or finish the lesson)
    if (questionIndex < (lesson.quizPool?.length || 0) - 1) {
      setQuestionIndex((prev) => prev + 1);
      setIsRetry(false);
      return;
    }

    onLessonComplete();
  };

  const CertificateModal = () => (
    <div style={styles.modalOverlay} className="no-print">
      <div style={{ ...styles.certBody, borderColor: userTier === 'elementary' ? '#8b5cf6' : '#065f46' }}>
        <div style={styles.certDecoration}>{userTier === 'elementary' ? '🚀' : '📈'}</div>
        <h1 style={{ ...styles.certTitle, color: userTier === 'elementary' ? '#7c3aed' : '#065f46' }}>
          {courseContent?.title?.toUpperCase() || 'CERTIFICATE'}
        </h1>
        <p style={styles.certText}>This certifies that</p>
        <h2 style={styles.certName}>{username || 'Master Builder'}</h2>
        <p style={styles.certText}>has successfully completed</p>
        <h3 style={styles.certCourse}>{courseContent?.title}</h3>
        <div style={styles.certSeal}>MASTERED</div>
        <button style={{ ...styles.primaryBtn, marginTop: '20px' }} onClick={resetToList}>
          Back to Courses
        </button>
      </div>
    </div>
  );

  const progressLabel = (p) => {
    if (p >= 1) return 'Completed';
    if (p >= 0.75) return 'Almost there';
    if (p >= 0.5) return 'Halfway';
    if (p > 0) return 'In progress';
    return 'Not started';
  };

  if (mode === 'list') {
    return (
      <div style={styles.dashboard}>
        {courses.map((course) => {
          const progress = getProgress(course.id);
          return (
            <div key={course.id} style={styles.coursePreviewCard}>
              <div style={{ ...styles.cardBanner, background: course.color }}>{course.emoji}</div>
              <div style={styles.cardContent}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={styles.cardTitle}>{course.title}</h3>
                    <p style={styles.cardDesc}>{course.description}</p>
                  </div>
                  <span style={{ ...styles.progressTag, background: course.color }}>{progressLabel(progress)}</span>
                </div>
                <ProgressBar progress={progress} />
                <button style={{ ...styles.primaryBtn, marginTop: '15px' }} onClick={() => startCourse(course.id)}>
                  {progress > 0 ? 'Continue' : 'Start'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (mode === 'learning' && courseContent) {
    const question = getQuestion();
    return (
      <div style={styles.learningLayout}>
        {showCertificate && <CertificateModal />}
        <div style={styles.learningHeader}>
          <button style={styles.iconBtn} onClick={resetToList}>
            ← Back
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px', fontWeight: 700 }}>{courseContent.emoji}</span>
              <span style={{ fontSize: '18px', fontWeight: 700 }}>{courseContent.title}</span>
            </div>
            <small style={{ color: '#64748b' }}>
              Lesson {currentLessonIndex + 1} of {currentCourse.length}
            </small>
          </div>
          <div style={styles.tierTag}>{userTier?.toUpperCase()}</div>
        </div>

        <div style={styles.contentCard}>
          <div style={{ marginBottom: '20px' }}>
            <ProgressBar progress={courseProgress} />
          </div>

          {view === 'article' ? (
            <>
              <h1 style={styles.lessonTitle}>{lesson.title}</h1>
              {lesson.info?.map((p, idx) => (
                <p key={idx} style={styles.articleText}>
                  {p}
                </p>
              ))}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button style={styles.primaryBtn} onClick={() => setView('quiz')}>
                  Take the Quiz
                </button>
                <button style={styles.secondaryBtn} onClick={resetToList}>
                  Exit
                </button>
              </div>
            </>
          ) : (
            <div style={styles.quizSection}>
              {!showFeedback ? (
                <>
                  <p style={styles.quizQuestion}>{question.q}</p>
                  <div style={styles.optionsGrid}>
                    {question.a?.map((opt, i) => (
                      <button key={i} style={styles.optionBtn} onClick={() => handleQuizAnswer(i)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div style={styles.feedbackArea}>
                  <h2>{isCorrect ? '✅ Correct!' : '❌ Not quite'}</h2>
                  <button style={styles.primaryBtn} onClick={nextAction}>
                    {isCorrect ? 'Continue' : 'Try again'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'completed' && courseContent) {
    return (
      <div style={styles.learningLayout}>
        <CertificateModal />
      </div>
    );
  }

  return null;
}

const styles = {
  dashboard: { display: 'flex', flexWrap: 'wrap', gap: '20px', padding: '40px', justifyContent: 'center' },
  coursePreviewCard: { background: '#fff', borderRadius: '24px', width: '300px', cursor: 'pointer', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
  cardBanner: { height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' },
  cardContent: { padding: '24px' },
  cardTitle: { fontSize: '20px', margin: '0 0 10px 0', fontWeight: 'bold' },
  cardDesc: { fontSize: '14px', color: '#64748b', lineHeight: '1.5' },
  progressTag: { padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '700', color: '#fff' },
  learningLayout: { maxWidth: '800px', margin: '0 auto', padding: '20px' },
  learningHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' },
  iconBtn: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' },
  tierTag: { background: '#f1f5f9', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800' },
  contentCard: { background: '#fff', padding: '40px', borderRadius: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.04)' },
  lessonTitle: { fontSize: '32px', marginBottom: '20px', fontWeight: '800' },
  articleText: { fontSize: '18px', lineHeight: '1.8', color: '#475569', marginBottom: '20px' },
  quizSection: { marginTop: '20px' },
  quizQuestion: { fontSize: '22px', fontWeight: 'bold', marginBottom: '30px' },
  optionsGrid: { display: 'flex', flexDirection: 'column', gap: '12px' },
  optionBtn: { padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#fff', textAlign: 'left', cursor: 'pointer', fontSize: '16px' },
  primaryBtn: { padding: '16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', width: '100%' },
  secondaryBtn: { padding: '16px', background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0', borderRadius: '16px', cursor: 'pointer' },
  feedbackArea: { textAlign: 'center' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  certBody: { background: '#fff', padding: '40px', borderRadius: '20px', textAlign: 'center', width: '320px' },
  certDecoration: { fontSize: '50px' },
  certTitle: { margin: '10px 0', fontSize: '24px' },
  certText: { fontSize: '14px', color: '#475569', margin: '6px 0' },
  certName: { fontSize: '28px', margin: '4px 0' },
  certCourse: { fontSize: '18px', margin: '6px 0' },
  certSeal: { marginTop: '20px', padding: '10px 20px', borderRadius: '40px', background: '#2563eb', color: '#fff', fontWeight: 'bold' }
};
