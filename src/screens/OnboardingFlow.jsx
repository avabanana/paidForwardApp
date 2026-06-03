import React, { useEffect, useState } from 'react';
import OnboardingQuizScreen from './OnboardingQuizScreen.jsx';
import OnboardingScreen from './OnboardingScreen.jsx';

// Wrapper that shows the 3-question quiz first, then navigates to
// the existing OnboardingScreen. We do not modify OnboardingScreen.jsx.
export default function OnboardingFlow({ onAuth }) {
  const [stage, setStage] = useState('quiz'); // 'quiz' | 'onboarding'
  const [signupData, setSignupData] = useState(null);

  const handleSignupRequested = (data) => {
    setSignupData(data || null);
    setStage('onboarding');
  };

  const handleLoginRequested = () => {
    setSignupData(null);
    setStage('onboarding');
  };

  // When we transition to the onboarding screen after the quiz, programmatically
  // toggle OnboardingScreen into the sign-up view and prefill the birth year
  // input (so the user lands on the sign-up part of that page). We do this
  // without editing OnboardingScreen.jsx by dispatching DOM events.
  useEffect(() => {
    if (stage !== 'onboarding') return;

    const t = setTimeout(() => {
      try {
        // Find the paragraph that toggles sign-up / sign-in. If it contains
        // "New here?" then clicking it will switch to the sign-up form.
        const paras = Array.from(document.querySelectorAll('p'));
        for (const p of paras) {
          if (!p.innerText) continue;
          if (p.innerText.includes('New here?')) {
            p.click();
            break;
          }
        }

        // If we have an age, prefill the birth year field so the sign-up form
        // is more convenient. We compute an approximate birth year from age.
        if (signupData?.age) {
          const ageNum = parseInt(signupData.age, 10);
          const year = Number.isNaN(ageNum) ? null : (new Date().getFullYear() - ageNum);
          if (year) {
            const birthInput = document.querySelector('input[placeholder="Birth year"]');
            if (birthInput) {
              birthInput.focus();
              birthInput.value = String(year);
              birthInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
          }
        }
      } catch (e) {
        // best-effort only
        // eslint-disable-next-line no-console
        console.warn('OnboardingFlow: could not programmatically toggle onboarding screen', e);
      }
    }, 120);

    return () => clearTimeout(t);
  }, [stage, signupData]);

  if (stage === 'quiz') {
    return (
      <OnboardingQuizScreen
        onSignupRequested={handleSignupRequested}
        onLoginRequested={handleLoginRequested}
      />
    );
  }

  return <OnboardingScreen onAuth={onAuth} />;
}
