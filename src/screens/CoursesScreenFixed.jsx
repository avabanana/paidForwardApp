import React, { useMemo, useState } from 'react';
import ProgressBar from '../components/ProgressBar';

const coursesData = [
  {
    id: 0,
    title: 'Earning & Growing Your Money',
    emoji: '🚀',
    color: '#8b5cf6',
    lessons: [
      {
        title: 'Make Your First Budget',
        info: ['Track your income and expenses.', 'Set aside savings first.'],
        quiz: [
          { q: 'What should you track first?', choices: ['Income and expenses', 'Movies', 'Weather'], a: 0 },
          { q: 'If you spend more than you earn, you should', choices: ['Reduce spending', 'Spend more', 'Do nothing'], a: 0 },
          { q: 'Saving first means', choices: ['Put money into savings before spending', 'Spend first', 'Borrow more'], a: 0 }
        ]
      },
      {
        title: 'Grow With Goals',
        info: ['Set short and long-term money goals.', 'Check progress weekly.'],
        quiz: [
          { q: 'A short-term goal is', choices: ['A small target soon', 'A forever plan', 'A bad idea'], a: 0 },
          { q: 'Long-term goals help with', choices: ['Big future plans', 'Playing games', 'Not saving'], a: 0 },
          { q: 'Reviewing goals helps you', choices: ['Stay on track', 'Forget them', 'Lose money'], a: 0 }
        ]
      },
      {
        title: 'Smart Spending',
        info: ['Needs before wants.', 'Compare prices before buying.'],
        quiz: [
          { q: 'Which is a need?', choices: ['Food', 'Video game', 'Extra toy'], a: 0 },
          { q: 'Before buying, you should', choices: ['Compare prices', 'Buy immediately', 'Ignore price'], a: 0 },
          { q: 'Smart spending leads to', choices: ['More savings', 'Less money', 'No change'], a: 0 }
        ]
      }
    ]
  },
  {
    id: 1,
    title: 'Saving & Planning',
    emoji: '💰',
    color: '#059669',
    lessons: [
      {
        title: 'Emergency Fund',
        info: ['Save for surprises.', 'Aim for 3 months of costs.'],
        quiz: [
          { q: 'Emergency funds are for', choices: ['Unexpected expenses', 'Video games', 'Vacations'], a: 0 },
          { q: 'Start with', choices: ['Small regular savings', 'Nothing', 'Large loan'], a: 0 },
          { q: 'A rainy day fund is', choices: ['A savings buffer', 'A holiday plan', 'A joke'], a: 0 }
        ]
      },
      {
        title: 'Budgeting Tools',
        info: ['Use simple charts, lists, or apps.'],
        quiz: [
          { q: 'A budget helps you', choices: ['Plan spending', 'Spend randomly', 'Lose money'], a: 0 },
          { q: 'Tracking helps to', choices: ['See patterns', 'Forget', 'Ignore'], a: 0 },
          { q: 'Good savings habit is', choices: ['Consistent saving', 'Spending daily', 'Borrowing'], a: 0 }
        ]
      },
      {
        title: 'Future You',
        info: ['Save for education and goals.'],
        quiz: [
          { q: 'Future planning means', choices: ['Thinking ahead', 'Forgetting', 'Wasting money'], a: 0 },
          { q: 'Early saving is', choices: ['Helpful', 'Harmful', 'Useless'], a: 0 },
          { q: 'You can improve by', choices: ['Learning and saving', 'Spending all', 'Ignoring'], a: 0 }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Credit & Smart Borrowing',
    emoji: '💳',
    color: '#ef4444',
    lessons: [
      {
        title: 'What Is Credit?',
        info: ['Credit is borrowing now and paying later.'],
        quiz: [
          { q: 'Credit means', choices: ['Borrowing now', 'Free money', 'A gift'], a: 0 },
          { q: 'Late payment causes', choices: ['Higher costs', 'Lower costs', 'Nothing'], a: 0 },
          { q: 'Good credit helps', choices: ['Get better loan terms', 'Lose money', 'Sleep better'], a: 0 }
        ]
      },
      {
        title: 'Interest Basics',
        info: ['Interest is cost of borrowing money.'],
        quiz: [
          { q: 'Interest on debt', choices: ['Increases what you owe', 'Decreases debt', 'No effect'], a: 0 },
          { q: 'Lower interest is', choices: ['Better', 'Worse', 'Same'], a: 0 },
          { q: 'Paying on time is', choices: ['Important', 'Useless', 'Bad'], a: 0 }
        ]
      },
      {
        title: 'Credit Score',
        info: ['On-time payments build your score.'],
        quiz: [
          { q: 'A high score gets', choices: ['Lower rates', 'Higher rates', 'No loans'], a: 0 },
          { q: 'Keeping balances low is', choices: ['Good', 'Bad', 'Neutral'], a: 0 },
          { q: 'A good score is built by', choices: ['Responsible payments', 'Ignoring bills', 'Borrowing more'], a: 0 }
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

export default function CoursesScreen({ courseProgressMap = {}, setCourseProgressMap, onCourseComplete, username = '' }) {
  const [page, setPage] = useState('list');
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [quiz, setQuiz] = useState(null);
  const [result, setResult] = useState(null);

  const course = useMemo(() => coursesData.find((c) => c.id === currentCourseId), [currentCourseId]);
  const lesson = course?.lessons?.[currentLesson];

  const courseLessonDone = (courseId, lessonIdx) => Boolean(courseProgressMap?.[`course_${courseId}_lesson_${lessonIdx}`]);
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

  const startCourse = (id) => {
    setCurrentCourseId(id);
    setCurrentLesson(0);
    setQuiz(null);
    setResult(null);
    setPage('lesson');
  };

  const beginQuiz = () => {
    const set = ensureSixQuestions(lesson.quiz);
    setQuiz({ questions: set, index: 0, correct: 0, wrong: [] });
    setResult(null);
    setPage('quiz');
  };

  const pickAnswer = (choice) => {
    if (!quiz) return;
    const question = quiz.questions[quiz.index];
    const isCorrect = choice === question.a;
    const wrongSet = isCorrect ? quiz.wrong : [...quiz.wrong, { q: question.q, selected: question.choices[choice], correct: question.choices[question.a] }];
    const nextIndex = quiz.index + 1;

    if (nextIndex >= quiz.questions.length) {
      const correctTotal = quiz.correct + (isCorrect ? 1 : 0);
      const score = Math.round((correctTotal / quiz.questions.length) * 100);
      const passed = score >= 70;
      setQuiz(null);
      setResult({ score, passed, correct: correctTotal, total: quiz.questions.length, wrong: wrongSet });
      if (passed) {
        setCourseProgressMap?.(`course_${course.id}_lesson_${currentLesson}`, 1);
      }
      return;
    }

    setQuiz({ ...quiz, index: nextIndex, correct: quiz.correct + (isCorrect ? 1 : 0), wrong: wrongSet });
  };

  const continueAfterResult = () => {
    if (!result) return;
    if (!result.passed) {
      beginQuiz();
      return;
    }
    const next = currentLesson + 1;
    if (next < (course?.lessons?.length || 0)) {
      setCurrentLesson(next);
      setPage('lesson');
      setResult(null);
      return;
    }
    onCourseComplete?.(course.id);
    setPage('finished');
  };

  if (page === 'list') {
    return (
      <div style={{ padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Courses {username ? `for ${username}` : ''}</h2>
            <p style={{ color: '#475569' }}>Finish 3 courses. Pass each lesson with 70%+.</p>
          </div>
          <div style={{ fontWeight: 700 }}>Courses done: {totalCoursesFinished}/3</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 12, marginTop: 10 }}>
          {coursesData.map((c) => (
            <div key={c.id} style={{ borderRadius: 12, background: '#fff', padding: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{c.emoji} {c.title}</div>
              <p style={{ margin: '6px 0', color: '#334155' }}>{c.lessons.length} lessons</p>
              <ProgressBar progress={courseProgress(c.id)} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12 }}>
                <span>{Math.round(courseProgress(c.id) * 100)}%</span>
                <span>{lessonsCompleted(c.id)}/{c.lessons.length}</span>
              </div>
              <button onClick={() => startCourse(c.id)} style={{ marginTop: 10, width: '100%', background: c.color, border: 'none', borderRadius: 8, color: '#fff', padding: '8px 10px', cursor: 'pointer' }}>
                {courseProgress(c.id) >= 1 ? 'Review' : 'Start'}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (page === 'lesson' && course && lesson) {
    return (
      <div style={{ padding: 18, maxWidth: 860, margin: '0 auto' }}>
        <button onClick={() => setPage('list')} style={{ border: 'none', background: 'none', color: '#2563eb', cursor: 'pointer', marginBottom: 10 }}>← Back to courses</button>
        <h2>{course.emoji} {course.title}</h2>
        <p style={{ color: '#64748b' }}>Lesson {currentLesson + 1}/{course.lessons.length}</p>
        <div style={{ background: '#fff', borderRadius: 12, padding: 14, boxShadow: '0 5px 14px rgba(0,0,0,0.06)' }}>
          <h3>{lesson.title}</h3>
          {lesson.info.map((line, idx) => <p key={idx} style={{ margin: '4px 0', color: '#334155' }}>{line}</p>)}
          <button onClick={beginQuiz} style={{ marginTop: 10, border: 'none', borderRadius: 8, background: '#2563eb', color: '#fff', padding: '8px 12px', cursor: 'pointer' }}>Start Quiz</button>
        </div>
      </div>
    );
  }

  if (page === 'quiz' && quiz) {
    const q = quiz.questions[quiz.index];
    return (
      <div style={{ padding: 18, maxWidth: 860, margin: '0 auto' }}>
        <button onClick={() => setPage('lesson')} style={{ border: 'none', background: 'none', color: '#2563eb', cursor: 'pointer', marginBottom: 10 }}>← Back to lesson</button>
        <div style={{ background: '#fff', borderRadius: 12, padding: 14, boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
          <h3>Question {quiz.index + 1}/{quiz.questions.length}</h3>
          <p style={{ fontSize: 20 }}>{q.q}</p>
          <div style={{ display: 'grid', gap: 8 }}>
            {q.choices.map((c, i) => (
              <button key={i} onClick={() => pickAnswer(i)} style={{ borderRadius: 8, border: '1px solid #cbd5e1', background: '#f8fafc', padding: 10, textAlign: 'left', cursor: 'pointer' }}>{c}</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div style={{ padding: 18, maxWidth: 860, margin: '0 auto' }}>
        <button onClick={() => setPage('lesson')} style={{ border: 'none', background: 'none', color: '#2563eb', cursor: 'pointer', marginBottom: 10 }}>← Back</button>
        <div style={{ background: '#fff', borderRadius: 12, padding: 14, boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
          <h2>{result.passed ? '✅ Quiz passed!' : '❌ Score too low'}</h2>
          <p>Score: {result.score}% ({result.correct}/{result.total})</p>
          {!result.passed && <p style={{ color: '#b91c1c' }}>You need 70% to pass. Try again.</p>}
          {result.wrong.length > 0 && (
            <div style={{ marginTop: 10, background: '#f8fafc', padding: 10, borderRadius: 8 }}>
              <strong>Review wrong answers</strong>
              {result.wrong.map((w, i) => (
                <div key={i} style={{ marginTop: 6 }}>
                  <div>{w.q}</div>
                  <div style={{ color: '#dc2626' }}>Your: {w.selected}</div>
                  <div style={{ color: '#059669' }}>Correct: {w.correct}</div>
                </div>
              ))}
            </div>
          )}
          <button onClick={continueAfterResult} style={{ marginTop: 12, border: 'none', borderRadius: 8, background: result.passed ? '#10b981' : '#f59e0b', color: '#fff', padding: '8px 12px', cursor: 'pointer' }}>{result.passed ? (currentLesson + 1 < (course?.lessons?.length || 0) ? 'Next Lesson' : 'Finish Course') : 'Retry Quiz'}</button>
        </div>
      </div>
    );
  }

  if (page === 'finished') {
    return (
      <div style={{ padding: 18, maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
        <h2>🎉 Course complete!</h2>
        <p>{course?.title} complete. Great work{username ? `, ${username}` : ''}.</p>
        <button onClick={() => setPage('list')} style={{ border: 'none', borderRadius: 8, background: '#2563eb', color: '#fff', padding: '8px 12px', cursor: 'pointer' }}>Back to course list</button>
      </div>
    );
  }

  return null;
}
