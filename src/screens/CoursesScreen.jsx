import React, { useState } from 'react';
import ProgressBar from '../components/ProgressBar';

const courseData = {
  title: 'Financial Literacy 101',
  summary: 'Master the basics of money management.',
  article: "Compound interest is the interest you earn on your initial money, plus the interest you earn on the interest you've already received. Over time, this creates a snowball effect.",
  quiz: [
    { question: "What makes compound interest special?", options: ["It stays the same", "It grows on itself"], correct: 1 },
    { question: "When is the best time to start saving?", options: ["Later", "Now"], correct: 1 }
  ]
};

export default function CoursesScreen() {
  const [mode, setMode] = useState('list'); 
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);

  // Helper to determine progress percentage
  const getProgress = () => {
    if (mode === 'article') return 0.33;
    if (mode === 'quiz') return 0.66;
    if (mode === 'result') return 1.0;
    return 0;
  };

  if (mode === 'article') {
    return (
      <div style={container}>
        <ProgressBar progress={getProgress()} />
        <h2 style={{ marginTop: '20px' }}>Reading: {courseData.title}</h2>
        <div style={articleBox}>{courseData.article}</div>
        <button style={btn} onClick={() => setMode('quiz')}>I've read this - Start Quiz →</button>
      </div>
    );
  }

  if (mode === 'quiz') {
    const q = courseData.quiz[currentStep];
    return (
      <div style={container}>
        <ProgressBar progress={getProgress()} />
        <h3 style={{ marginTop: '20px' }}>Question {currentStep + 1}</h3>
        <p>{q.question}</p>
        {q.options.map((o, i) => (
          <button key={i} onClick={() => {
            if (i === q.correct) setScore(score + 1);
            if (currentStep + 1 < courseData.quiz.length) setCurrentStep(currentStep + 1);
            else setMode('result');
          }} style={optBtn}>{o}</button>
        ))}
      </div>
    );
  }

  if (mode === 'result') {
    return (
      <div style={container}>
        <ProgressBar progress={getProgress()} />
        <h2 style={{ marginTop: '20px', color: '#10b981' }}>Course Complete! 🎉</h2>
        <p>Your Final Score: {score}/{courseData.quiz.length}</p>
        <button style={btn} onClick={() => { setMode('list'); setCurrentStep(0); setScore(0); }}>Finish & Save</button>
      </div>
    );
  }

  return (
    <div style={card}>
      <h3>{courseData.title}</h3>
      <p style={{ fontSize: '12px', color: '#888' }}>PROGRESS</p>
      <ProgressBar progress={0} />
      <p style={{ fontSize: '14px', color: '#666', margin: '15px 0' }}>{courseData.summary}</p>
      <button style={btn} onClick={() => setMode('article')}>Start Module</button>
    </div>
  );
}

// Styling (same as before)
const container = { padding: '20px' };
const articleBox = { background: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #eee', marginBottom: '20px', lineHeight: '1.6' };
const card = { background: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #eee', width: '320px' };
const btn = { width: '100%', padding: '12px', background: '#4A90E2', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const optBtn = { display: 'block', width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer', textAlign: 'left' };