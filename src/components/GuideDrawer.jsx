import React, { useState, useMemo } from 'react';

/* ── Sub-components (inline styles, work inside the drawer) ── */

function Callout({ type, label, children }) {
  const map = {
    tip:  { bg: '#fdf3e0', border: '#e8a020', labelColor: '#92400e' },
    info: { bg: '#eff6ff', border: '#1d4ed8', labelColor: '#1d4ed8' },
    good: { bg: '#f0fdf4', border: '#15803d', labelColor: '#15803d' },
    warn: { bg: '#fff1f2', border: '#b91c1c', labelColor: '#b91c1c' },
  };
  const { bg, border, labelColor } = map[type] || map.info;
  return (
    <div style={{ borderLeft: `3px solid ${border}`, background: bg, padding: '10px 14px', borderRadius: '0 8px 8px 0', margin: '12px 0' }}>
      <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: labelColor, marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>{children}</div>
    </div>
  );
}

function Card({ accent, icon, title, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e0d5', borderRadius: 10, padding: 14, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent }} />
      <span style={{ fontSize: 22, display: 'block', marginBottom: 6 }}>{icon}</span>
      <h3 style={{ fontFamily: 'Fraunces,serif', fontSize: 14, fontWeight: 600, marginBottom: 4, marginTop: 0 }}>{title}</h3>
      <p style={{ fontSize: 12, color: '#6b6b6b', lineHeight: 1.6, margin: 0 }}>{children}</p>
    </div>
  );
}

function Vocab({ term, def }) {
  return (
    <div style={{ background: '#f2efe8', border: '1px solid #e5e0d5', borderRadius: 8, padding: '8px 12px', marginBottom: 7 }}>
      <dt style={{ fontWeight: 700, fontSize: 13, display: 'block' }}>{term}</dt>
      <dd style={{ margin: '2px 0 0', color: '#6b6b6b', fontSize: 12, lineHeight: 1.5 }}>{def}</dd>
    </div>
  );
}

function Highlight({ children }) {
  return <span style={{ background: '#fdf3e0', borderRadius: 3, padding: '1px 5px', fontWeight: 700 }}>{children}</span>;
}

/* ── Shared inline style tokens (drawer-sized) ── */
const d = {
  p:       { fontSize: 13, lineHeight: 1.7, marginBottom: 12 },
  h4:      { fontSize: 13, fontWeight: 700, margin: '18px 0 8px', color: '#0f0e17' },
  steps:   { margin: '12px 0' },
  step:    { display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid #e5e0d5' },
  stepNum: { width: 24, height: 24, background: '#0f0e17', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 2 },
  stepH:   { fontWeight: 700, fontSize: 13, marginBottom: 2, marginTop: 0 },
  stepP:   { fontSize: 12, color: '#6b6b6b', margin: 0, lineHeight: 1.55 },
  cardGrid:{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10, margin: '14px 0' },
  twoCol:  { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '14px 0' },
  table:   { width: '100%', borderCollapse: 'collapse', fontSize: 11, margin: '12px 0' },
  th:      { background: '#0f0e17', color: '#fff', padding: '7px 10px', textAlign: 'left', fontWeight: 700, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' },
  td:      { padding: '9px 10px', borderBottom: '1px solid #e5e0d5', verticalAlign: 'top', lineHeight: 1.45 },
  gameList:{ margin: '12px 0' },
  gameItem:{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid #e5e0d5', alignItems: 'flex-start' },
  gameEmoji:{ fontSize: 24, lineHeight: 1, flexShrink: 0, marginTop: 2 },
  achGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, margin: '12px 0' },
  achCard: { background: '#fff', border: '1px solid #e5e0d5', borderRadius: 8, padding: '10px 8px', textAlign: 'center' },
  toolRow: { display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid #e5e0d5', alignItems: 'flex-start' },
  pill:    { display: 'inline-block', padding: '2px 7px', borderRadius: 999, fontSize: 9, fontWeight: 700 },
  pillViolet: { background: '#eef2ff', color: '#4338ca' },
  pillRed:    { background: '#fff1f2', color: '#b91c1c' },
  pillGold:   { background: '#fdf3e0', color: '#92400e' },
};

/* ══════════════════════════════════════════════
   MAIN DRAWER COMPONENT
══════════════════════════════════════════════ */
const GuideDrawer = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const scrollTo = (id) => {
    const el = document.getElementById(`drawer-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* ── All 10 sections ── */
  const sections = [

    /* 01 · GETTING STARTED */
    {
      id: 'start', number: '01', emoji: '🚀',
      title: 'Getting Started',
      subtitle: 'Creating your account, the onboarding quiz, your user tier, and the Welcome screen.',
      keywords: 'signup account quiz age tier elementary adult curriculum onboarding password username welcome first login',
      content: () => (
        <>
          <p style={d.p}>When you first open PaidForward you see a short <strong>three-question quiz</strong> before the sign-up form — answer honestly, because your answers shape every screen you'll see afterward.</p>
          <div style={d.steps}>
            {[
              ['Enter your age', "Under 14? You're placed on the Money Adventures track — kid-friendly lessons and ⭐ star currency throughout the whole app. 14 and up? You get the full adult curriculum: investing, credit, budgeting, career planning, and real $ values."],
              ['Describe your money situation', 'Pick the option that fits best: "Just getting started," "Saving & budgeting," "Curious about investing," or "Building credit." This determines which course the app recommends you open first.'],
              ['Pick your biggest goal', '"Build savings," "Start investing," "Manage money better," or "Learn basics." The app surfaces your best starting point on the Home screen based on this answer.'],
              ['Create your account', 'Pick a username (shown on leaderboards and the community board), enter your birth year, and set a password (6+ characters). Everything saves locally — no email address is required.'],
            ].map(([h, p], i) => (
              <div key={i} style={d.step}>
                <div style={d.stepNum}>{i + 1}</div>
                <div><h4 style={d.stepH}>{h}</h4><p style={d.stepP}>{p}</p></div>
              </div>
            ))}
          </div>
          <Callout type="tip" label="💡 Welcome Screen">After your first login, a <strong>Welcome screen</strong> gives a 30-second tour of every major feature. Read it — it gives you an instant mental map before you click anything.</Callout>
          <div style={d.twoCol}>
            <Card accent="#f59e0b" icon="🦁" title="Elementary (Under 14)">Kid-friendly language, ⭐ star currency, three Money Adventures courses, and simpler game scenarios.</Card>
            <Card accent="#6366f1" icon="💼" title="Adult (14 and up)">Full curriculum: budgeting, investing, and credit. Real $ values, all six games, Discussion board, and Salary Simulator.</Card>
          </div>
          <h4 style={d.h4}>Returning to the app</h4>
          <p style={d.p}>On your next login, type your username and password. Your streak increments each calendar day you log in — missing a day resets it to zero. If you ever forget your password, you can reset your data from <strong>Settings → Close Account</strong> and create a fresh account (progress resets).</p>
          <Callout type="info" label="ℹ️ Local Storage">PaidForward stores progress locally on your device. If you clear your browser data, your progress may be lost. The Courses screen offers an option to synchronize with an account for safer persistence.</Callout>
        </>
      )
    },

    /* 02 · HOME SCREEN */
    {
      id: 'home', number: '02', emoji: '🏠',
      title: 'The Home Screen',
      subtitle: 'Your daily dashboard — daily tip, feature cards, the global map, and quick-jump buttons.',
      keywords: 'dashboard daily tip banner literacy map feature cards learn play impact compete progress goals hero',
      content: () => (
        <>
          <p style={d.p}>The Home screen is the first thing you see after every login. It has four distinct zones:</p>
          <div style={d.cardGrid}>
            <Card accent="#6366f1" icon="🌅" title="Hero Banner">A large coloured panel with a <strong>Daily Tip</strong> from a pool of eight, rotating daily. Shows your tier badge and app description.</Card>
            <Card accent="#10b981" icon="🔲" title="Feature Cards">Four cards — <strong>Learn, Play, Impact, Compete</strong> — each linking directly to a core section. Tap any card's button to jump there instantly.</Card>
            <Card accent="#f59e0b" icon="🌍" title="Global Literacy Map">The Impact card has a <strong>View Map</strong> button. Opens a full-screen map with hoverable pins showing literacy rates and context for nine countries.</Card>
            <Card accent="#ef4444" icon="🏆" title="Compete Card">Links to the Leagues section inside Games. Tap "Join a League →" to land on the Tournament Hub directly.</Card>
          </div>
          <Callout type="info" label="ℹ️ Bottom Buttons">At the bottom of Home, two large buttons jump to <strong>View Your Progress & Achievements</strong> and <strong>Set Financial Goals</strong>. Use them every time you open the app.</Callout>
          <h4 style={d.h4}>The Daily Tip — all 8</h4>
          <ol style={{ fontSize: 12, lineHeight: 1.8, color: '#475569', paddingLeft: 18, margin: '0 0 12px' }}>
            <li>Track one small purchase today and think about how it fits into your budget.</li>
            <li>Saving just a little bit every day adds up quickly over a year.</li>
            <li>When you earn money, try saving 10% first before spending the rest.</li>
            <li>Compare prices before you buy to make sure you get the best deal.</li>
            <li>Setting a savings goal makes it easier to say no to impulse buys.</li>
            <li>An emergency fund of 3–6 months of expenses is one of the best financial moves you can make.</li>
            <li>Compound interest works best when you start saving early — even small amounts count.</li>
            <li>Review your subscriptions monthly and cancel what you don't use.</li>
          </ol>
          <h4 style={d.h4}>Global Literacy Map — what you'll find</h4>
          <p style={d.p}>Nine countries with interactive pins: Norway (71%), Canada (68%), UK (67%), Australia (64%), US (57%), South Africa (42%), Brazil (35%), China (28%), India (24%). Hover any pin to see the literacy rate and a 2–3 sentence explanation of what drives financial education there.</p>
        </>
      )
    },

    /* 03 · COURSES */
    {
      id: 'courses', number: '03', emoji: '📚',
      title: 'Courses',
      subtitle: 'Structured lessons, module quizzes, certificates, and the storage preference prompt.',
      keywords: 'lessons modules quiz certificate budget saving credit compound interest SMART goals emergency fund 50/30/20 rule sync local storage',
      content: () => (
        <>
          <p style={d.p}>Courses are the app's main learning engine. The path: <strong>Course → Modules → Quiz → Certificate</strong>. You need <Highlight>70% or higher</Highlight> to pass each quiz. Retakes are unlimited and questions are reshuffled every attempt.</p>
          <Callout type="info" label="ℹ️ Storage Prompt">The first time you open Courses, you're asked: <strong>"Synchronize with Account"</strong> (database-backed, safer) or <strong>"Store Locally Only"</strong> (browser only). Choose carefully — you can't change this without resetting.</Callout>
          <h4 style={d.h4}>How to navigate a course</h4>
          <div style={d.steps}>
            {[
              ['Course List', 'Three course cards with progress bars. Button reads "Start Course," "Resume Learning," or "Review Materials" depending on progress.'],
              ['Course Home (Syllabus)', 'Lists all modules. Green left border = done. Each has a "Go to Lesson" or "Review" button.'],
              ['Lesson', 'Adults see a sidebar nav + reading content. Kids see a full-width layout. Scroll to the bottom for "Start Module Quiz."'],
              ['Module Quiz', 'One question at a time, four choices. Feedback shows correct answer after every pick. A progress bar tracks your position.'],
              ['Result Screen', 'Shows your score %. Pass (≥70%) → advance. Fail → "Retake Quiz" with reshuffled questions.'],
              ['Certificate', 'Gold-bordered document with your username, course title, date, and a unique certificate ID. Screenshot it.'],
            ].map(([h, p], i) => (
              <div key={i} style={d.step}>
                <div style={d.stepNum}>{i + 1}</div>
                <div><h4 style={d.stepH}>{h}</h4><p style={d.stepP}>{p}</p></div>
              </div>
            ))}
          </div>
          <h4 style={d.h4}>Adult curriculum (14+)</h4>
          <table style={d.table}><thead><tr>{['Course', 'Modules', "You'll learn"].map(h => <th key={h} style={d.th}>{h}</th>)}</tr></thead>
            <tbody>
              {[
                ['🚀 Earning & Growing', 'Make Your First Budget · Grow With Goals · Smart Spending', 'Zero-based budgeting, sinking funds, SMART goals, impulse psychology, 24-hour rule, cost-per-use, price anchoring, opportunity cost, lifestyle inflation'],
                ['💰 Saving & Planning', 'Emergency Fund · Budgeting Tools · Compound Interest', '50/30/20 rule, envelope method, anti-budget, net worth tracking, Rule of 72, DCA, Roth IRA, S&P 500, HYSA, tax-advantaged accounts'],
                ['💳 Credit & Smart Borrowing', 'Understanding Credit', 'Credit reports vs. scores, hard/soft inquiries, utilisation, Equifax/Experian/TransUnion, secured cards, credit-builder loans, APR'],
              ].map(([c, m, l], i) => <tr key={i}>{[c, m, l].map((v, j) => <td key={j} style={{ ...d.td, background: i % 2 === 0 ? '#faf9f6' : '#fff' }}>{v}</td>)}</tr>)}
            </tbody>
          </table>
          <h4 style={d.h4}>Elementary curriculum (under 14)</h4>
          <table style={d.table}><thead><tr>{['Course', 'Modules', "You'll learn"].map(h => <th key={h} style={d.th}>{h}</th>)}</tr></thead>
            <tbody>
              {[
                ['🌟 The Secret of Money', 'Needs vs. Wants · How to Earn', 'Needs vs. wants, entrepreneurs, earning via chores, why working hard builds trust'],
                ['🏺 The Three Jars', 'Spend, Save & Give · Wait for the Great', 'Three-jar system, impulse buying, buyer\'s remorse, interest, patience as a superpower'],
                ['🤝 Trust & Borrowing', 'What is a Loan?', 'What borrowing means, good vs. bad credit, why paying back matters'],
              ].map(([c, m, l], i) => <tr key={i}>{[c, m, l].map((v, j) => <td key={j} style={{ ...d.td, background: i % 2 === 0 ? '#faf9f6' : '#fff' }}>{v}</td>)}</tr>)}
            </tbody>
          </table>
          <Callout type="good" label="✅ XP Rewards">Completing a full course earns <strong>150 XP</strong>. All three adult courses = 450 XP + "Scholar" badge. First course = "Early Bird."</Callout>
          <Callout type="tip" label="💡 Start here">New to budgeting? Open <strong>Earning & Growing → Make Your First Budget</strong> first — practical zero-based budgeting framework you can use in real life immediately.</Callout>
        </>
      )
    },

    /* 04 · GAMES */
    {
      id: 'games', number: '04', emoji: '🎮',
      title: 'Games',
      subtitle: 'Six single-player scenario games, the Blitz live trading game, and the Salary Simulator.',
      keywords: 'survival budget stock master crypto king savings sprint credit crush side hustle blitz scenario XP win lose insight salary simulator career NPC',
      content: () => (
        <>
          <p style={d.p}>Games are where you apply what you learned. Every single-player game starts with a fixed balance (adults: <strong>$1,000</strong> · kids: <strong>50 ⭐</strong>) and presents <strong>10 decision scenarios</strong>. At the end: balance, P&L, trade count, and a personalised <strong>Insight paragraph</strong>.</p>
          <h4 style={d.h4}>How scenario games work</h4>
          <p style={d.p}>Each scenario shows a situation and two options. Tap your choice, read the feedback (green = smart, red = costly), then "Next Decision." After all 10, the Result screen appears.</p>
          <div style={d.gameList}>
            {[
              ['📊', 'Survival Budget', 'Beginner Friendly', 'pillViolet', 'Rent, transport, groceries, subscriptions — survive a month without going broke. Start here.'],
              ['📈', 'Stock Master', null, null, '10 investment scenarios, ~48% win rate per scenario. Win by reaching 125% of starting balance ($1,250).'],
              ['🪙', 'Crypto King', 'High Risk', 'pillRed', 'Same mechanic as Stock Master but ~38% win rate — intentionally harder to show why experts limit crypto exposure.'],
              ['💰', 'Savings Sprint', null, null, 'Save or spend each round. Saving earns a 10% bonus. Win by reaching 140% of starting balance ($1,400).'],
              ['💳', 'Credit Crush', null, null, 'Navigate late fees and credit traps. Some "smart" choices cost cash short-term — teaching credit is a long game.'],
              ['🚀', 'Side Hustle', 'New', 'pillGold', 'Launch a small business. Buy equipment, run ads, manage costs. Win by ending with a net profit above $1,000.'],
            ].map(([emoji, title, badge, badgeKey, desc], i) => (
              <div key={i} style={d.gameItem}>
                <div style={d.gameEmoji}>{emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>{title}</h4>
                    {badge && <span style={{ ...d.pill, ...d[badgeKey] }}>{badge}</span>}
                  </div>
                  <p style={d.stepP}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <h4 style={d.h4}>Win conditions at a glance</h4>
          <table style={d.table}><thead><tr>{['Game', 'Win condition', 'Difficulty'].map(h => <th key={h} style={d.th}>{h}</th>)}</tr></thead>
            <tbody>
              {[
                ['Survival Budget', 'End with any positive balance', '⭐ Beginner'],
                ['Stock Master', 'Reach $1,250 (125% of start)', '⭐⭐ Moderate'],
                ['Crypto King', 'Reach $1,250 (125% of start)', '⭐⭐⭐ Hard'],
                ['Savings Sprint', 'Reach $1,400 (140% of start)', '⭐⭐ Moderate'],
                ['Credit Crush', 'End with $800+ (80% of start)', '⭐⭐ Moderate'],
                ['Side Hustle', 'Net profit above $1,000', '⭐⭐ Moderate'],
              ].map(([g1, g2, g3], i) => <tr key={i}>{[g1, g2, g3].map((v, j) => <td key={j} style={{ ...d.td, background: i % 2 === 0 ? '#faf9f6' : '#fff' }}>{v}</td>)}</tr>)}
            </tbody>
          </table>
          <Callout type="good" label="✅ XP Rewards">Playing earns <strong>50 XP</strong>. Winning earns <strong>250 XP</strong>. Play all six for "Game On." Win your first for "Champion." Win five total for "High Roller."</Callout>
          <h4 style={d.h4}>The Insight paragraph</h4>
          <p style={d.p}>After every game, the app analyses your behaviour. For trading games it checks your buy/sell ratio. For Budget it measures balance growth. For Credit it checks debt-trap avoidance. Read it — it's the most educational part.</p>
          <h4 style={d.h4}>Salary Simulator</h4>
          <p style={d.p}>Access from the Games menu featured card. Select from 8 careers or enter any custom salary. Shows estimated tax, net salary, monthly take-home, and a <strong>20% savings target</strong> and <strong>10% investing target</strong>.</p>
          <table style={d.table}><thead><tr>{['Career', 'Salary', 'Monthly (est.)'].map(h => <th key={h} style={d.th}>{h}</th>)}</tr></thead>
            <tbody>{[
              ['Software Engineer', '$125,000', '~$8,542'],
              ['Registered Nurse', '$82,000', '~$5,614'],
              ['Data Analyst', '$88,000', '~$6,027'],
              ['Electrician', '$72,000', '~$4,933'],
              ['Marketing Manager', '$95,000', '~$6,508'],
              ['Teacher', '$62,000', '~$4,247'],
              ['Graphic Designer', '$58,000', '~$3,973'],
              ['Barista', '$32,000', '~$2,373'],
            ].map(([c, s, m], i) => <tr key={i}><td style={{ ...d.td, background: i % 2 === 0 ? '#faf9f6' : '#fff' }}>{c}</td><td style={{ ...d.td, background: i % 2 === 0 ? '#faf9f6' : '#fff', fontWeight: 700 }}>{s}</td><td style={{ ...d.td, background: i % 2 === 0 ? '#faf9f6' : '#fff' }}>{m}</td></tr>)}
            </tbody>
          </table>
        </>
      )
    },

    /* 05 · LEAGUES & BLITZ */
    {
      id: 'leagues', number: '05', emoji: '🏆',
      title: 'Leagues & Blitz Trading',
      subtitle: 'Create or join leagues, run live 10-minute trading sessions, and read the Activity Feed.',
      keywords: 'league tournament blitz stock trading live compete classmates join code create public private leaderboard feed GIGA VOY MART SPY GLD NPC standings',
      content: () => (
        <>
          <p style={d.p}>Leagues let groups compete in <strong>10-minute live Blitz sessions</strong> — everyone trades the same five stocks simultaneously. Highest total portfolio value wins.</p>
          <h4 style={d.h4}>Creating and joining leagues</h4>
          <div style={d.steps}>
            {[
              ['Create a league', 'Games → "Classroom Leagues" → Tournament Hub. Enter a name, choose Public or Private, click Create. A 5-character join code is generated — share it.'],
              ['Join a league', 'Enter a code in "Join via Code" and tap Join. Public leagues also appear in the Open Arena list.'],
              ['View the detail page', 'Tap any league card. See the full player list and leaderboard. Only the creator sees the Delete button.'],
              ['Start a Blitz match', 'Tap "🚀 Start Match" from the detail page. The 10-minute countdown starts immediately.'],
            ].map(([h, p], i) => (
              <div key={i} style={d.step}>
                <div style={d.stepNum}>{i + 1}</div>
                <div><h4 style={d.stepH}>{h}</h4><p style={d.stepP}>{p}</p></div>
              </div>
            ))}
          </div>
          <h4 style={d.h4}>The 5 Blitz stocks</h4>
          <table style={d.table}><thead><tr>{['Ticker', 'Character', 'Strategy'].map(h => <th key={h} style={d.th}>{h}</th>)}</tr></thead>
            <tbody>{[
              ['GIGA', 'High growth, high volatility (beta 1.45, Bullish)', 'High risk/reward. Good for aggressive players.'],
              ['VOY', 'Stable dividend payer (6.2% yield, Neutral)', 'Low drama. Good conservative anchor.'],
              ['MART', 'Declining trend (Bearish)', 'Generally avoid unless you spot a reversal.'],
              ['SPY', 'Lowest risk, steady uptrend (beta 1.0)', 'Safest stock. Great for beginners.'],
              ['GLD', 'Near-zero market correlation (beta 0.15)', 'Uncorrelated hedge. Moves independently.'],
            ].map(([t, c, s], i) => <tr key={i}><td style={{ ...d.td, fontWeight: 700, background: i % 2 === 0 ? '#faf9f6' : '#fff' }}>{t}</td><td style={{ ...d.td, background: i % 2 === 0 ? '#faf9f6' : '#fff' }}>{c}</td><td style={{ ...d.td, background: i % 2 === 0 ? '#faf9f6' : '#fff' }}>{s}</td></tr>)}
            </tbody>
          </table>
          <h4 style={d.h4}>The Blitz interface — three columns</h4>
          <div style={d.cardGrid}>
            <Card accent="#6366f1" icon="📡" title="Left — Standings & Feed">Live leaderboard + Activity Feed streaming every opponent trade (green = buy, red = sell).</Card>
            <Card accent="#10b981" icon="🖥️" title="Centre — Market Terminal">Live price table with sparkline charts. Click any ticker name (underlined) for a full Yahoo Finance-style popup. Click a row to select that stock.</Card>
            <Card accent="#f59e0b" icon="💼" title="Right — Portfolio">Total wealth, available cash, open positions with live P&L. Red "End Competition" button cashes out early.</Card>
          </div>
          <Callout type="info" label="ℹ️ Vocabulary helpers">Column headers with a <strong>?</strong> label (e.g. "Ticker ?", "Sentiment ?") open plain-English definition popups — learn while playing.</Callout>
          <h4 style={d.h4}>AI opponents (NPCs)</h4>
          <p style={d.p}>NPC personalities: <strong>Aggressive</strong> (buys a lot, rarely sells), <strong>Conservative</strong> (sells frequently), <strong>Balanced</strong> (moderate), <strong>YOLO</strong> (extreme buy rate). Watch the Activity Feed to infer their strategies.</p>
          <Callout type="tip" label="💡 First Blitz strategy">Buy 1–2 shares of <strong>SPY</strong> immediately, then watch the Feed for 2–3 minutes. Never go all-in on one stock.</Callout>
        </>
      )
    },

    /* 06 · PROGRESS & TOOLS */
    {
      id: 'progress', number: '06', emoji: '📊',
      title: 'Progress & Financial Tools',
      subtitle: 'XP levels, streak, all 8 achievements, and 6 built-in money tools.',
      keywords: 'xp level streak achievements budget tracker latte factor subscription audit price per use no spend mood journal scholar champion unstoppable on fire',
      content: () => (
        <>
          <p style={d.p}>The Progress screen has two parts: a <strong>stats & achievements panel</strong> at the top, and a <strong>tabbed Financial Tools panel</strong> below. Scroll past achievements to reach the tools.</p>
          <h4 style={d.h4}>XP and levels</h4>
          <p style={d.p}>Every 1,000 XP advances you one level. XP sources:</p>
          <ul style={{ fontSize: 12, lineHeight: 1.9, color: '#475569', paddingLeft: 16, margin: '0 0 12px' }}>
            <li><strong>150 XP</strong> — completing a course</li>
            <li><strong>250 XP</strong> — winning a game</li>
            <li><strong>50 XP</strong> — playing a game (win or lose)</li>
          </ul>
          <h4 style={d.h4}>Streak</h4>
          <p style={d.p}>Increments each calendar day you log in. Missing a day resets to zero. Shown on your Progress card and on community posts.</p>
          <h4 style={d.h4}>All 8 achievements</h4>
          <div style={d.achGrid}>
            {[
              ['🌱', 'Early Bird', 'Complete 1 course'],
              ['🎓', 'Scholar', 'All 3 courses'],
              ['🎮', 'Game On', 'Play 1 game'],
              ['🏆', 'Champion', 'Win 1 game'],
              ['🎲', 'High Roller', 'Win 5 games'],
              ['💎', 'XP Master', 'Earn 1,500 XP'],
              ['🔥', 'On Fire', '3-day streak'],
              ['⚡', 'Unstoppable', '7-day streak'],
            ].map(([e, t, r]) => (
              <div key={t} style={d.achCard}>
                <span style={{ fontSize: 20, display: 'block', marginBottom: 4 }}>{e}</span>
                <strong style={{ fontSize: 10 }}>{t}</strong>
                <p style={{ fontSize: 9, color: '#6b6b6b', margin: '2px 0 0' }}>{r}</p>
              </div>
            ))}
          </div>
          <p style={{ ...d.p, marginTop: 10 }}>Achievements unlock automatically when you meet the condition — a toast notification appears. Greyed-out = locked, green ✓ = unlocked.</p>
          <h4 style={d.h4}>Financial Tools — all 6 tabs</h4>
          {[
            ['📊', 'Budget Tracker', 'Enter income and expenses by category. Calculates remaining balance. Your most actionable daily-use tool — open it every time you get paid.'],
            ['☕', 'Latte Factor Calculator', 'Enter a recurring habit expense. Shows monthly, yearly, decade cost, and what you\'d have if invested at 7% instead. Eye-opening for any habit spend.'],
            ['📦', 'Subscription Audit', 'List all subscriptions with monthly cost. The tool totals them. Auditing twice a year typically uncovers $50–$150 in forgotten charges.'],
            ['🏷️', 'Price Per Use Tracker', 'Enter purchase price and uses. Calculates cost-per-use. A $300 item used 150 times ($2/use) beats a $60 item used 5 times ($12/use).'],
            ['🚫', 'No-Spend Day Tracker', 'Full monthly calendar. Tap any past/current day to mark as no-spend (turns green). Set a monthly goal, track streaks, see savings estimate.'],
            ['📓', 'Financial Mood Journal', 'Log how you feel about money (Stressed → Great), an optional amount spent, and a category. History tab shows patterns over time.'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={d.toolRow}>
              <div style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{icon}</div>
              <div><h4 style={{ ...d.stepH, marginTop: 0 }}>{title}</h4><p style={d.stepP}>{desc}</p></div>
            </div>
          ))}
          <Callout type="tip" label="💡 Power combo">Use the <strong>No-Spend Tracker</strong> and <strong>Mood Journal</strong> together — mood scores are almost always higher on no-spend days. That pattern alone tends to change spending behaviour.</Callout>
        </>
      )
    },

    /* 07 · SAVINGS GOALS */
    {
      id: 'goals', number: '07', emoji: '🎯',
      title: 'Savings Goals',
      subtitle: 'Set targets, log deposits, celebrate completions, and track overall progress.',
      keywords: 'savings goal target deposit emergency fund laptop phone car trip progress celebrate confetti completion quick deposit custom amount',
      content: () => (
        <>
          <p style={d.p}>The Goals screen lets you set savings targets, track deposits, and celebrate every milestone. Goals sync to the database via your user ID, so they persist across sessions.</p>
          <h4 style={d.h4}>Quick-Start goals (pre-loaded)</h4>
          <table style={d.table}><thead><tr>{['Goal', 'Target', 'Why it matters'].map(h => <th key={h} style={d.th}>{h}</th>)}</tr></thead>
            <tbody>{[
              ['🛟 Emergency Fund', '$500', 'First financial priority. Protects every other goal.'],
              ['💻 New Laptop', '$1,200', 'Great first "big purchase" to save toward.'],
              ['✈️ Summer Trip', '$800', 'Builds the delayed-gratification habit.'],
              ['📱 New Phone', '$900', 'Better to save than finance.'],
              ['🚗 Car Fund', '$3,000', 'Teaches long-term saving discipline.'],
            ].map(([g1, g2, g3], i) => <tr key={i}><td style={{ ...d.td, background: i % 2 === 0 ? '#faf9f6' : '#fff' }}>{g1}</td><td style={{ ...d.td, background: i % 2 === 0 ? '#faf9f6' : '#fff', fontWeight: 700 }}>{g2}</td><td style={{ ...d.td, background: i % 2 === 0 ? '#faf9f6' : '#fff' }}>{g3}</td></tr>)}
            </tbody>
          </table>
          <h4 style={d.h4}>Adding deposits</h4>
          <p style={d.p}>Each goal card has <strong>+$20, +$50, +$100</strong> quick-deposit buttons plus a custom amount field. Tap a button or enter an amount and tap Deposit — the progress bar fills instantly.</p>
          <Callout type="good" label="🎉 Celebration">Hitting 100% fires a full-screen confetti overlay. The goal card permanently turns green with a "🏆 Goal Met!" badge.</Callout>
          <h4 style={d.h4}>Overall Progress card</h4>
          <p style={d.p}>Once you have at least one goal, a blue card at the top shows total saved across all goals, total target, and an overall percentage — a birds-eye view of your savings journey.</p>
          <Callout type="tip" label="💡 Start here">The <strong>Emergency Fund ($500)</strong> is universally the best first goal. Without it, one unexpected expense drains everything you've saved elsewhere.</Callout>
        </>
      )
    },

    /* 08 · COMMUNITY */
    {
      id: 'community', number: '08', emoji: '💬',
      title: 'Community Discussion',
      subtitle: 'A live public feed for questions and wins — adults only. Post, react, reply, delete.',
      keywords: 'discussion post reply react like delete feed community share question adults thumbs laugh heart timestamp my posts filter',
      content: () => (
        <>
          <p style={d.p}>Discussion is a live public feed linked to a shared database. Posts from other users appear within seconds. <strong>Adults only</strong> (14+) — kids do not see it in the navigation.</p>
          <h4 style={d.h4}>Everything you can do</h4>
          {[
            ['Posting', 'Type in the text area (labelled "Posting as [username]") and click Post. Your post appears immediately, timestamped with full date and time.'],
            ['Reactions', '❤️ like, 👍 thumbs up, 😂 laugh — each with a count. Tap to add, tap again to remove. You can add all three to a single post.'],
            ['Replies', 'Type in the reply input below any post and press Enter or click Reply. Replies appear nested under the post with a left border.'],
            ['Deleting posts', 'A 🗑 Delete button appears only on your own posts. Clicking it asks for confirmation before permanently removing the post and all its replies.'],
            ['Deleting replies', 'A small "delete" link appears next to replies you wrote. Removes just that reply.'],
            ['Filtering', 'The "Showing: All Posts" toggle in the top-right switches between the full feed and "My Posts only."'],
          ].map(([h, p]) => (
            <div key={h} style={{ marginBottom: 10 }}>
              <strong style={{ fontSize: 12 }}>{h}</strong>
              <p style={{ ...d.p, marginTop: 3, marginBottom: 0 }}>{p}</p>
            </div>
          ))}
          <Callout type="tip" label="💡 What to post">Specific posts get better engagement. "Just hit my emergency fund goal!" or "Which game teaches credit best?" beats vague posts. Your streak badge (🔥) appears next to your name if it's 2+ days.</Callout>
          <Callout type="info" label="ℹ️ Feed refresh">The feed auto-refreshes every 5 seconds — no need to reload.</Callout>
        </>
      )
    },

    /* 09 · SETTINGS */
    {
      id: 'settings', number: '09', emoji: '⚙️',
      title: 'Settings',
      subtitle: 'Change your display name, update your password, and delete your account.',
      keywords: 'settings username display name password change update delete account wipe data logout close security profile',
      content: () => (
        <>
          <p style={d.p}>Settings has three sections: <strong>Profile</strong>, <strong>Security</strong>, and <strong>Danger</strong>. Access it from the bottom navigation bar.</p>
          <div style={d.steps}>
            {[
              ['Change your display name', 'Type a new username and tap Update. The system checks it isn\'t already taken. On success your name updates everywhere — navigation, posts, leaderboards — immediately.'],
              ['Change your password', 'Enter your current password and your new password (min 6 characters). The system verifies the current password before making any change.'],
              ['Delete your account', 'Enter your password to confirm, then tap the red "Wipe Data & Logout" button. A second confirmation ("Delete Forever" vs. "Go Back") prevents accidents. All local progress, completions, high scores, and league data are cleared.'],
            ].map(([h, p], i) => (
              <div key={i} style={d.step}>
                <div style={d.stepNum}>{i + 1}</div>
                <div><h4 style={d.stepH}>{h}</h4><p style={d.stepP}>{p}</p></div>
              </div>
            ))}
          </div>
          <Callout type="warn" label="⚠️ Wipe Data warning">Deleting clears course progress, game history, achievements, and streak. Community posts you made still exist on the shared database — you just can't delete them without logging in again.</Callout>
        </>
      )
    },

    /* 10 · GLOSSARY */
    {
      id: 'glossary', number: '10', emoji: '📖',
      title: 'Financial Glossary',
      subtitle: 'Every key term used in courses, games, and the Blitz — defined in plain language.',
      keywords: 'definition budget compound interest APR HYSA index fund ETF 401k Roth IRA credit score utilisation beta dividend yield P/E ratio zero-based sinking fund DCA rule of 72 market cap EPS bid ask volume sentiment',
      content: () => (
        <>
          <h4 style={d.h4}>Budgeting & Spending</h4>
          {[
            ['Budget', 'A plan that assigns every dollar of income to a specific purpose before you spend it.'],
            ['Zero-Based Budget', 'Income minus every assigned category = exactly $0. Every dollar has a job.'],
            ['50/30/20 Rule', '50% to needs, 30% to wants, 20% to savings and extra debt paydown.'],
            ['Sinking Fund', 'Money set aside monthly for a known future irregular expense (e.g. annual car registration ÷ 12).'],
            ['Lifestyle Inflation', 'When spending rises proportionally with income, leaving savings unchanged.'],
            ['Opportunity Cost', 'What you give up by spending money one way. $6/day coffee = ~$30,000 in missed investment growth over 10 years at 7%.'],
            ['Cost-Per-Use', 'Purchase price ÷ uses. A $300 item used 150 times ($2/use) beats a $60 item used 5 times ($12/use).'],
            ['Pay Yourself First', 'Automatically transfer savings the moment your paycheck arrives, before any other spending.'],
            ['24-Hour Rule', 'Wait 24–72 hours before any discretionary purchase over $50. Desire for non-essentials drops significantly after waiting.'],
            ['Anti-Budget', 'Automate all savings and bills first, spend the remainder freely. Works for people who hate tracking.'],
          ].map(([t, def]) => <Vocab key={t} term={t} def={def} />)}

          <h4 style={d.h4}>Saving & Interest</h4>
          {[
            ['Emergency Fund', '3–6 months of essential living expenses in a liquid savings account. For genuine emergencies only.'],
            ['HYSA', 'High-Yield Savings Account — earns 4–5% APY, FDIC-insured, fully accessible. Ideal for emergency funds.'],
            ['FDIC Insurance', 'Protects up to $250,000 per depositor per bank if the bank fails. All major US banks are FDIC-insured.'],
            ['Compound Interest', 'Earning returns on your principal AND on all previously accumulated interest — grows exponentially over time.'],
            ['Rule of 72', 'Divide 72 by your annual return to find years to double your money. At 7%: 72 ÷ 7 ≈ 10 years.'],
            ['Dollar-Cost Averaging (DCA)', 'Investing a fixed amount on a regular schedule regardless of market conditions. Removes the urge to time the market.'],
            ['APY vs APR', 'APY = Annual Percentage Yield (includes compounding). APR = Annual Percentage Rate (doesn\'t). A 4% APY account earns more than a 4% APR account.'],
          ].map(([t, def]) => <Vocab key={t} term={t} def={def} />)}

          <h4 style={d.h4}>Investing</h4>
          {[
            ['S&P 500', 'Index of 500 large US companies. Historical average: ~10%/year (~7% after inflation). The standard long-term benchmark.'],
            ['Index Fund / ETF', 'A fund tracking a market index. Instant diversification at very low cost.'],
            ['401(k)', 'Employer-sponsored retirement account. Contributions are pre-tax. Many employers match — always contribute enough to get the full match.'],
            ['Roth IRA', 'Retirement account where contributions are after-tax but growth is completely tax-free forever.'],
            ['P/E Ratio', 'Share price ÷ earnings per share. High P/E = high growth expectations. GIGA in Blitz has a P/E of 45.2.'],
            ['Beta', 'How much a stock moves vs. the market. GIGA beta 1.45 = 45% more volatile. GLD beta 0.15 = nearly uncorrelated.'],
            ['Dividend Yield', 'Annual dividend as % of stock price. VOY\'s 6.2% yield = $6.20/year per $100 invested.'],
            ['Market Sentiment', 'Investor attitude. Bullish = optimistic (prices rising). Bearish = pessimistic (prices falling).'],
            ['Market Cap', 'Share price × total shares. GigaSoft at $2.4T is a mega-cap like Apple or Microsoft.'],
            ['EPS', 'Earnings Per Share. Net profit ÷ total shares. Higher = more profitable per share.'],
          ].map(([t, def]) => <Vocab key={t} term={t} def={def} />)}

          <h4 style={d.h4}>Credit & Debt</h4>
          {[
            ['Credit Score', 'A 3-digit number (300–850) summarising your creditworthiness. Above 740 = "very good."'],
            ['Credit Report', 'Full history of every account, payment, and inquiry. Held by Equifax, Experian, and TransUnion.'],
            ['Credit Utilisation', '% of available revolving credit you\'re using. Keep below 30%; below 10% is ideal.'],
            ['Hard Inquiry', 'Triggered when you apply for new credit. Lowers your score 2–5 points, stays on your report 2 years.'],
            ['Soft Inquiry', "Doesn't affect your score. Includes checking your own score, pre-approvals, and employer background checks."],
            ['APR', 'Annual Percentage Rate — yearly cost of borrowing. A 24% APR card charges ~2%/month on any carried balance.'],
            ['Secured Credit Card', 'Backed by a cash deposit equal to your limit. Used to build credit from zero. Reports to all three bureaus.'],
            ['Minimum Payment', 'The smallest amount your issuer accepts without a late fee. Paying only minimums maximises interest paid — always pay more.'],
          ].map(([t, def]) => <Vocab key={t} term={t} def={def} />)}

          <h4 style={d.h4}>Blitz trading terms</h4>
          {[
            ['Bid', 'The highest price a buyer is willing to pay right now.'],
            ['Ask', 'The lowest price a seller will accept. The bid/ask spread is the dealer\'s profit.'],
            ['Volume', 'Shares traded in a given period. High volume = high liquidity and reliable price signals.'],
            ['52-Week Range', 'Lowest and highest price over the past year — shows whether current price is near the top or bottom.'],
            ['1Y Target Estimate', 'Analyst consensus price target 12 months out. Shows whether analysts expect the stock to rise or fall.'],
          ].map(([t, def]) => <Vocab key={t} term={t} def={def} />)}
        </>
      )
    },
  ];

  /* ── Search filter ── */
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.keywords.toLowerCase().includes(q) ||
      s.subtitle.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="guide-backdrop" onClick={onClose} />

      {/* Drawer panel */}
      <div className="guide-drawer">
        <button className="guide-close-btn" onClick={onClose} aria-label="Close guide">✕</button>

        <div className="guide-wrapper">

          {/* ── COVER ── */}
          <div className="guide-cover">
            <div className="guide-cover-eyebrow">Complete Beginner's Guide</div>
            <h1 className="guide-cover-h1">The <em>full</em> guide to PaidForward</h1>
            <p className="guide-cover-p">Every screen, every tool, every term — explained.</p>
            <div className="guide-cover-meta">
              {[['10','Screens'],['6','Course tracks'],['8+','Games & tools'],['8','Achievements'],['40+','Glossary terms']].map(([n, l]) => (
                <div key={l} className="guide-cover-meta-item">
                  <strong>{n}</strong><span>{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── SEARCH + TOC ── */}
          <div className="guide-toc-area">
            <input
              type="text"
              className="guide-search"
              placeholder="🔍  Search topics, terms, features..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {!searchQuery && (
              <div className="guide-toc-grid">
                {sections.map(s => (
                  <button key={s.id} className="guide-toc-btn" onClick={() => scrollTo(s.id)}>
                    <span>{s.emoji}</span> {s.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── MAIN CONTENT ── */}
          <div className="guide-content">
            {filteredSections.length === 0 ? (
              <div className="guide-no-results">
                <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
                <h3>No results for "{searchQuery}"</h3>
                <p>Try "budget", "credit", "blitz", "compound", or "games".</p>
              </div>
            ) : filteredSections.map(s => (
              <div key={s.id} id={`drawer-${s.id}`} className="guide-section">
                <div className="guide-section-number">Section {s.number}</div>
                <h2 className="guide-section-title">{s.title}</h2>
                <p className="guide-section-subtitle">{s.subtitle}</p>
                {s.content()}
              </div>
            ))}
          </div>

          {/* ── FOOTER ── */}
          <div className="guide-footer">
            <p><strong>PaidForward</strong> — Complete Beginner's Guide</p>
            <p>Refer back any time you're unsure where to find something.</p>
          </div>
        </div>
      </div>

      {/* ── ALL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,600;0,800;1,300&family=DM+Sans:wght@400;500;700&display=swap');

        /* ── Backdrop & drawer shell ── */
        .guide-backdrop {
          position: fixed; inset: 0;
          background: rgba(15,14,23,0.45);
          backdrop-filter: blur(4px);
          z-index: 2000;
        }
        .guide-drawer {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: 520px; max-width: 95vw;
          background: #faf9f6;
          z-index: 2001;
          box-shadow: -12px 0 40px rgba(0,0,0,0.18);
          overflow-y: auto;
          display: flex; flex-direction: column;
          animation: guideSlideIn 0.28s cubic-bezier(0.22,1,0.36,1);
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        @keyframes guideSlideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        .guide-close-btn {
          position: sticky; top: 0; left: 0;
          float: right; margin: 14px 14px 0 0;
          z-index: 10;
          background: rgba(255,255,255,0.18);
          border: none; color: #fff;
          width: 30px; height: 30px;
          border-radius: 50%;
          cursor: pointer; font-size: 16px; line-height: 1;
          display: flex; align-items: center; justify-content: center;
        }

        /* ── Wrapper resets ── */
        .guide-wrapper {
          color: #0f0e17;
          line-height: 1.65;
        }
        .guide-wrapper h1, .guide-wrapper h2, .guide-wrapper h3,
        .guide-wrapper h4, .guide-wrapper p, .guide-wrapper ul,
        .guide-wrapper ol, .guide-wrapper dl { margin-top: 0; }

        /* ── Cover ── */
        .guide-cover {
          background: #0f0e17;
          background-image:
            radial-gradient(ellipse 80% 60% at 50% 0%, #312e81 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 80% 100%, #065f46 0%, transparent 60%);
          color: #fff;
          padding: 36px 24px 28px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .guide-cover-eyebrow {
          display: inline-block;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 4px;
          padding: 4px 12px;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(255,255,255,0.65);
          margin-bottom: 14px;
        }
        .guide-cover-h1 {
          font-family: 'Fraunces', serif;
          font-size: clamp(22px, 5vw, 30px);
          font-weight: 800; line-height: 1.1;
          margin-bottom: 10px;
        }
        .guide-cover-h1 em { font-style: italic; font-weight: 300; color: #fde68a; }
        .guide-cover-p {
          font-size: 13px;
          color: rgba(255,255,255,0.65);
          margin-bottom: 20px;
        }
        .guide-cover-meta {
          display: flex; justify-content: center;
          gap: 18px; flex-wrap: wrap;
        }
        .guide-cover-meta-item { text-align: center; }
        .guide-cover-meta-item strong {
          display: block; font-size: 18px; color: #fde68a;
        }
        .guide-cover-meta-item span {
          font-size: 9px; color: rgba(255,255,255,0.45);
          text-transform: uppercase; letter-spacing: 0.08em;
        }

        /* ── TOC / search area ── */
        .guide-toc-area {
          background: #f2efe8;
          border-bottom: 1px solid #e5e0d5;
          padding: 16px 20px;
        }
        .guide-search {
          width: 100%; box-sizing: border-box;
          padding: 10px 14px;
          border-radius: 8px;
          border: 2px solid #e5e0d5;
          font-size: 13px;
          font-family: inherit;
          outline: none;
          background: #fff;
          margin-bottom: 14px;
        }
        .guide-search:focus { border-color: #4338ca; }
        .guide-toc-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 7px;
        }
        .guide-toc-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 10px;
          background: #fff;
          border: 1px solid #e5e0d5;
          border-radius: 7px;
          cursor: pointer;
          font-size: 11px; font-weight: 700;
          color: #0f0e17;
          text-align: left;
          font-family: inherit;
          transition: all 0.12s;
        }
        .guide-toc-btn:hover {
          border-color: #4338ca;
          background: #eef2ff;
          color: #4338ca;
        }

        /* ── Content area ── */
        .guide-content {
          padding: 20px 20px 40px;
        }
        .guide-section {
          margin-top: 36px;
          padding-top: 36px;
          border-top: 1px solid #e5e0d5;
          scroll-margin-top: 16px;
        }
        .guide-section:first-child {
          border-top: none; margin-top: 0; padding-top: 0;
        }
        .guide-section-number {
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: #6b6b6b; margin-bottom: 4px;
        }
        .guide-section-title {
          font-family: 'Fraunces', serif;
          font-size: clamp(18px, 3vw, 22px);
          font-weight: 800; line-height: 1.15;
          margin-bottom: 3px; letter-spacing: -0.2px;
          color: #0f0e17;
        }
        .guide-section-subtitle {
          font-size: 13px; color: #6b6b6b;
          margin-bottom: 20px;
        }

        /* ── No results ── */
        .guide-no-results {
          text-align: center; padding: 50px 0; color: #6b6b6b;
        }
        .guide-no-results h3 {
          font-family: 'Fraunces', serif; font-size: 18px;
          color: #0f0e17; margin-bottom: 8px;
        }
        .guide-no-results p { font-size: 13px; }

        /* ── Footer ── */
        .guide-footer {
          background: #0f0e17;
          color: rgba(255,255,255,0.45);
          text-align: center;
          padding: 20px;
          font-size: 11px;
        }
        .guide-footer p { margin: 0 0 4px; }
        .guide-footer strong { color: #fff; }
      `}</style>
    </>
  );
};

export default GuideDrawer;