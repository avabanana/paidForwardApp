import React, { useState, useMemo } from 'react';

export default function GuideScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState(null);

  const scrollTo = (id) => {
    const el = document.getElementById(`guide-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const sections = [
    // ─────────────────────────────────────────
    // 01 · GETTING STARTED
    // ─────────────────────────────────────────
    {
      id: 'start', number: '01', emoji: '🚀',
      title: 'Getting Started',
      subtitle: 'Creating your account, the onboarding quiz, your user tier, and the Welcome screen.',
      keywords: 'signup account quiz age tier elementary adult curriculum onboarding password username welcome first login',
      content: () => (
        <>
          <p style={g.p}>When you first open PaidForward you see a short <strong>three-question quiz</strong> before the sign-up form — answer honestly, because your answers shape every screen you'll see afterward.</p>
          <div style={g.steps}>
            {[
              ['Enter your age', 'Under 14? You\'re placed on the Money Adventures track — kid-friendly lessons and ⭐ star currency throughout the whole app. 14 and up? You get the full adult curriculum: investing, credit, budgeting, career planning, and real $ values.'],
              ['Describe your money situation', 'Pick the option that fits best: "Just getting started," "Saving & budgeting," "Curious about investing," or "Building credit." This determines which course the app recommends you open first.'],
              ['Pick your biggest goal', '"Build savings," "Start investing," "Manage money better," or "Learn basics." The app surfaces your best starting point on the Home screen based on this answer.'],
              ['Create your account', 'Pick a username (shown on leaderboards and the community board), enter your birth year, and set a password (6+ characters). Everything saves locally — no email address is required.'],
            ].map(([h, p], i) => (
              <div key={i} style={g.step}>
                <div style={g.stepNum}>{i + 1}</div>
                <div><h4 style={g.stepH}>{h}</h4><p style={g.stepP}>{p}</p></div>
              </div>
            ))}
          </div>
          <Callout type="tip" label="💡 Welcome Screen">After your first login, a <strong>Welcome screen</strong> gives a 30-second tour of every major feature. Read it — it gives you an instant mental map of the whole app before you click anything.</Callout>
          <div style={g.twoCol}>
            <Card accent="#f59e0b" icon="🦁" title="Elementary Track (Under 14)">Kid-friendly language, ⭐ star currency, three "Money Adventures" courses, and simpler game scenarios. Every concept is explained through play rather than theory.</Card>
            <Card accent="#6366f1" icon="💼" title="Adult Track (14 and up)">Full curriculum: budgeting, investing, and credit. Real $ values. Access to all six games, the Discussion board, and the Salary Simulator. Adult language and real-world examples throughout.</Card>
          </div>
          <h4 style={g.h4}>Returning to the app</h4>
          <p style={g.p}>On your next login, type your username and password on the login screen. If you ever forget your password, you can reset your data from <strong>Settings → Close Account</strong> and create a fresh account (your progress would start over). Your streak also increments each calendar day you log in — keep logging in daily to build it.</p>
          <Callout type="info" label="ℹ️ Local Storage">PaidForward stores your progress locally on your device (no cloud sync by default). If you clear your browser data, your progress may be lost. The Courses screen offers an option to synchronize with an account for safer persistence.</Callout>
        </>
      )
    },

    // ─────────────────────────────────────────
    // 02 · THE HOME SCREEN
    // ─────────────────────────────────────────
    {
      id: 'home', number: '02', emoji: '🏠',
      title: 'The Home Screen',
      subtitle: 'Your daily dashboard — daily tip, feature cards, the global map, and quick-jump buttons.',
      keywords: 'dashboard daily tip banner literacy map feature cards learn play impact compete progress goals hero subtitle badge',
      content: () => (
        <>
          <p style={g.p}>The Home screen is the first thing you see after every login. It has four distinct zones:</p>
          <div style={g.cardGrid}>
            <Card accent="#6366f1" icon="🌅" title="Hero Banner">A large coloured panel at the top with a <strong>Daily Tip</strong> — one practical money habit chosen from a pool of eight, rotating daily. It also shows your tier badge ("Learning money is fun" for kids vs. "Build a Future You're Proud Of" for adults) and a brief description of the app's purpose.</Card>
            <Card accent="#10b981" icon="🔲" title="Feature Cards">Four cards in a grid — <strong>Learn, Play, Impact, Compete</strong> — each linking directly to a core section. Tap any card's button to jump there instantly. Kids see slightly different colors and wording, but the same four sections.</Card>
            <Card accent="#f59e0b" icon="🌍" title="Global Literacy Map">The Impact card has a <strong>View Map</strong> button. Tap it to open a full-screen global financial literacy map with hoverable pins — each pin shows the country's literacy rate and a short explanation of what drives financial education there.</Card>
            <Card accent="#ef4444" icon="🏆" title="Compete Card">The Compete card links to the Leagues section inside Games. If you want to reach it directly from Home, tap "Join a League →" and you'll land on the Tournament Hub.</Card>
          </div>
          <Callout type="info" label="ℹ️ Bottom Buttons">At the bottom of Home, two large buttons jump directly to <strong>View Your Progress & Achievements</strong> and <strong>Set Financial Goals</strong>. These are your two most important daily check-ins — use them every time you open the app.</Callout>
          <h4 style={g.h4}>The Daily Tip — how it works</h4>
          <p style={g.p}>The tip rotates based on the day of the year (not randomised), so everyone sees the same tip on the same day. There are 8 tips in total:</p>
          <ol style={{ fontSize: 14, lineHeight: 1.8, color: '#475569', paddingLeft: 20, margin: '0 0 16px' }}>
            <li>Track one small purchase today and think about how it fits into your budget.</li>
            <li>Saving just a little bit every day adds up quickly over a year.</li>
            <li>When you earn money, try saving 10% first before spending the rest.</li>
            <li>Compare prices before you buy to make sure you get the best deal.</li>
            <li>Setting a savings goal makes it easier to say no to impulse buys.</li>
            <li>An emergency fund of 3–6 months of expenses is one of the best financial moves you can make.</li>
            <li>Compound interest works best when you start saving early — even small amounts count.</li>
            <li>Review your subscriptions monthly and cancel what you don't use.</li>
          </ol>
          <h4 style={g.h4}>Global Literacy Map — what you'll find</h4>
          <p style={g.p}>The map opens a full-page view with a world map image and interactive pins for nine countries. Hover any pin (or tap on mobile) to see a tooltip with the country's name, literacy rate, and 2–3 sentences about what drives financial education there. Countries covered: Norway (71%), Canada (68%), UK (67%), Australia (64%), US (57%), South Africa (42%), Brazil (35%), China (28%), India (24%). The legend in the top-right corner shows three tiers: 55–75% (dark blue), 25–54% (mid blue), and 0–24% (light blue).</p>
          <Callout type="tip" label="💡 Kid tip">If you're under 14, your Home hero banner has a brighter purple-to-violet gradient. The tip label appears in bright amber so it pops against the dark background — that's intentional to keep the text easy to read.</Callout>
        </>
      )
    },

    // ─────────────────────────────────────────
    // 03 · COURSES
    // ─────────────────────────────────────────
    {
      id: 'courses', number: '03', emoji: '📚',
      title: 'Courses',
      subtitle: 'Structured lessons, module quizzes, certificates, and the storage preference prompt.',
      keywords: 'lessons modules quiz certificate budget saving credit compound interest SMART goals emergency fund 50/30/20 rule sync local storage',
      content: () => (
        <>
          <p style={g.p}>Courses are the app's main learning engine. The path goes: <strong>Course → Modules → Quiz → Certificate</strong>. You need <Highlight>70% or higher</Highlight> to pass each quiz. Retakes are unlimited and questions are reshuffled on every attempt.</p>
          <Callout type="info" label="ℹ️ Storage Prompt">The very first time you open the Courses screen, you'll be asked how to store your progress. Two choices: <strong>"Synchronize with Account"</strong> (syncs to your user profile in the database — safer) or <strong>"Store Locally Only"</strong> (stays in your browser). You can't change this later without resetting, so choose carefully.</Callout>
          <h4 style={g.h4}>How to navigate a course</h4>
          <div style={g.steps}>
            {[
              ['Course List (Dashboard)', 'The main Courses screen shows all three courses as cards. Each card displays a progress bar, the number of modules completed, and a button labelled "Start Course," "Resume Learning," or "Review Materials" depending on your progress.'],
              ['Course Home (Syllabus)', 'After tapping Start/Resume, you land on a syllabus page listing all modules. Each module shows whether it\'s done (green left border) or not, and has a "Go to Lesson" or "Review" button.'],
              ['Lesson (Reading Content)', 'The lesson view for adults shows a sidebar with all modules on the left and the reading content on the right. Read through the info paragraphs, then scroll to the bottom to find the "Start Module Quiz" button. Kids see a simpler full-width layout.'],
              ['Module Quiz', 'The quiz presents one question at a time with four multiple-choice answers. After you pick an answer, it shows correct/incorrect feedback with the right answer highlighted. Tap "Continue" to advance. A progress bar at the top tracks your position in the quiz.'],
              ['Result Screen', 'After the last question, you see your score as a percentage, the raw correct count, and a pass/fail message. If you passed (≥70%), you advance to the next module. If you failed, "Retake Quiz" restarts with reshuffled questions.'],
              ['Certificate', 'Finishing all modules in a course triggers the Certificate screen — a gold-bordered document with your username, the course title, completion date, and a random certificate ID. Keep a screenshot as proof of completion.'],
            ].map(([h, p], i) => (
              <div key={i} style={g.step}>
                <div style={g.stepNum}>{i + 1}</div>
                <div><h4 style={g.stepH}>{h}</h4><p style={g.stepP}>{p}</p></div>
              </div>
            ))}
          </div>

          <h4 style={g.h4}>Adult curriculum (14+) — all 3 courses</h4>
          <table style={g.table}><thead><tr>{['Course', 'Modules', "You'll learn"].map(h => <th key={h} style={g.th}>{h}</th>)}</tr></thead>
            <tbody>
              {[
                ['🚀 Earning & Growing Your Money', 'Make Your First Budget · Grow With Goals · Smart Spending', 'Zero-based budgeting, sinking funds, SMART goals, impulse psychology, 24-hour rule, cost-per-use, price anchoring, opportunity cost, lifestyle inflation'],
                ['💰 Saving & Planning', 'Emergency Fund · Budgeting Tools · The Power of Compound Interest', '50/30/20 rule, envelope method, anti-budget, net worth tracking, Rule of 72, DCA, Roth IRA, S&P 500 historical returns, HYSA, tax-advantaged accounts'],
                ['💳 Credit & Smart Borrowing', 'Understanding Credit', 'Credit reports vs. scores, hard/soft inquiries, utilisation (keep below 30%), Equifax/Experian/TransUnion, secured cards, credit-builder loans, APR'],
              ].map(([c, m, l], i) => <tr key={i}>{[c, m, l].map((v, j) => <td key={j} style={{ ...g.td, background: i % 2 === 0 ? '#faf9f6' : '#fff' }}>{v}</td>)}</tr>)}
            </tbody>
          </table>

          <h4 style={g.h4}>Elementary curriculum (under 14) — Money Adventures</h4>
          <table style={g.table}><thead><tr>{['Course', 'Modules', "You'll learn"].map(h => <th key={h} style={g.th}>{h}</th>)}</tr></thead>
            <tbody>
              {[
                ['🌟 The Secret of Money', 'Needs vs. Wants · How to Earn Money', 'Needs vs. wants, what entrepreneurs do, earning via chores and allowance, why working hard builds trust'],
                ['🏺 The Three Jars', 'Spend, Save & Give · Wait for the Great', 'Three-jar system, impulse buying, buyer\'s remorse, what interest is, patience as a money superpower'],
                ['🤝 Trust & Borrowing', 'What is a Loan?', 'What borrowing means, good vs. bad credit, why paying people back builds trust, what a loan is'],
              ].map(([c, m, l], i) => <tr key={i}>{[c, m, l].map((v, j) => <td key={j} style={{ ...g.td, background: i % 2 === 0 ? '#faf9f6' : '#fff' }}>{v}</td>)}</tr>)}
            </tbody>
          </table>

          <Callout type="good" label="✅ XP Rewards">Completing a full course earns <strong>150 XP</strong>. Complete all three adult courses to earn 450 XP plus the "Scholar" achievement badge. Completing your first course earns "Early Bird."</Callout>
          <Callout type="tip" label="💡 Where to start">New to budgeting? Open <strong>Earning & Growing → Make Your First Budget</strong> first. It gives you a practical framework (zero-based budgeting + sinking funds) you can use in real life immediately — before you finish lesson one.</Callout>
        </>
      )
    },

    // ─────────────────────────────────────────
    // 04 · GAMES
    // ─────────────────────────────────────────
    {
      id: 'games', number: '04', emoji: '🎮',
      title: 'Games',
      subtitle: 'Six single-player scenario games, the Blitz live trading game, and the Salary Simulator.',
      keywords: 'survival budget stock master crypto king savings sprint credit crush side hustle blitz scenario XP win lose insight choice trade NPC opponent salary simulator career',
      content: () => (
        <>
          <p style={g.p}>Games are where you apply what you learned. Every single-player game starts with a fixed opening balance (adults: <strong>$1,000</strong> · kids: <strong>50 ⭐</strong>) and presents <strong>10 decision scenarios</strong>. At the end you see your balance, P&L, trade count, and a personalised <strong>Insight paragraph</strong> about your habits.</p>
          <h4 style={g.h4}>How scenario games work</h4>
          <p style={g.p}>Each scenario shows a situation and two options — usually one cheaper and one more expensive. Tap your choice, read the feedback message (green = financially smart, red = costly decision), then tap "Next Decision." After all 10 scenarios, the Result screen appears. Win conditions vary by game type (see below).</p>
          <div style={g.gameList}>
            {[
              ['📊', 'Survival Budget', 'Beginner Friendly', 'pill-violet', 'Rent, transport, groceries, subscriptions, gym — survive a full simulated month without your balance hitting zero. Each choice teaches a real budgeting principle (fixed vs. variable expenses, opportunity cost, lifestyle inflation). Start here if you\'ve never played before.'],
              ['📈', 'Stock Master', null, null, '10 investment scenarios, each asking you to risk a portion of your balance. Outcomes are probabilistic — a coin-flip with better-than-even odds (~48% win rate). Win by reaching 125% of your starting balance ($1,250). At the end, see your exact buy/sell count and a personalised trading insight.'],
              ['🪙', 'Crypto King', 'High Risk', 'pill-red', 'Wild memecoin swings, DeFi yield farms, NFTs — the same investment mechanic as Stock Master but with a ~38% win rate per scenario (intentionally harder). The game exists to teach you why professional investors limit crypto to a small portfolio slice. Kids\' version uses hypothetical star-coin equivalents.'],
              ['💰', 'Savings Sprint', null, null, 'Each round you find or earn money and decide: save or spend. Saving triggers a 10% interest bonus on the saved amount. Win by reaching 140% of your starting balance ($1,400). This game rewards pure discipline — every spend is a step backward.'],
              ['💳', 'Credit Crush', null, null, 'Navigate late fees, high-interest card balances, and credit traps. Unlike other games, some "smart" choices cost cash short-term (e.g. paying off a balance) but prevent bigger losses later — teaching that credit is a long-term game, not a monthly balance.'],
              ['🚀', 'Side Hustle', 'New', 'pill-gold', 'Launch a small business. Buy equipment (camera, marketing materials, LLC registration), run ads, manage costs. Win by ending with a net profit above your starting balance. The insight shows your revenue-vs-expense discipline and profit margin.'],
            ].map(([emoji, title, badge, badgeClass, desc], i) => (
              <div key={i} style={g.gameItem}>
                <div style={g.gameEmoji}>{emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{title}</h4>
                    {badge && <span style={{ ...g.pill, ...g[badgeClass || 'pillViolet'] }}>{badge}</span>}
                  </div>
                  <p style={g.stepP}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h4 style={g.h4}>Win conditions at a glance</h4>
          <table style={g.table}><thead><tr>{['Game', 'Win condition', 'Approx. difficulty'].map(h => <th key={h} style={g.th}>{h}</th>)}</tr></thead>
            <tbody>
              {[
                ['Survival Budget', 'End with any positive balance', '⭐ Beginner'],
                ['Stock Master', 'Reach 125% of starting balance ($1,250)', '⭐⭐ Moderate'],
                ['Crypto King', 'Reach 125% of starting balance ($1,250)', '⭐⭐⭐ Hard'],
                ['Savings Sprint', 'Reach 140% of starting balance ($1,400)', '⭐⭐ Moderate'],
                ['Credit Crush', 'End with 80%+ of starting balance ($800)', '⭐⭐ Moderate'],
                ['Side Hustle', 'End with a net profit (above $1,000)', '⭐⭐ Moderate'],
              ].map(([g1, g2, g3], i) => <tr key={i}>{[g1, g2, g3].map((v, j) => <td key={j} style={{ ...g.td, background: i % 2 === 0 ? '#faf9f6' : '#fff' }}>{v}</td>)}</tr>)}
            </tbody>
          </table>

          <Callout type="good" label="✅ XP Rewards">Playing any game earns <strong>50 XP</strong>. Winning earns <strong>250 XP</strong>. Play all six for the "Game On" achievement. Win your first game for "Champion." Win five games total for "High Roller."</Callout>

          <h4 style={g.h4}>The Insight paragraph — what it means</h4>
          <p style={g.p}>After every game, the app analyses your behaviour and writes a personalised paragraph. For trading games it looks at your buy/sell ratio: too many buys with few sells means you held losers too long; too many sells means you exited winners too early. For Budget it measures how far your balance grew or fell. For Credit it checks whether you avoided the debt traps. Read it — it's the most educational part of the whole game.</p>

          <h4 style={g.h4}>The Salary Simulator</h4>
          <p style={g.p}>Accessible from the Games menu (the featured card below the Leagues banner) or from the Home navigation. Select from 8 pre-loaded careers or type any annual salary in the custom field. The tool calculates estimated tax (12%–30% depending on bracket), net salary, monthly take-home, and then shows a <strong>20% savings target</strong> and <strong>10% investing target</strong> — the 50/30/20 rule made concrete. Use it to compare two careers side-by-side by switching the dropdown.</p>
          <table style={g.table}><thead><tr>{['Career', 'Salary', 'Monthly take-home (est.)'].map(h => <th key={h} style={g.th}>{h}</th>)}</tr></thead>
            <tbody>{[
              ['Software Engineer', '$125,000', '~$8,542'],
              ['Registered Nurse', '$82,000', '~$5,614'],
              ['Data Analyst', '$88,000', '~$6,027'],
              ['Electrician', '$72,000', '~$4,933'],
              ['Marketing Manager', '$95,000', '~$6,508'],
              ['Teacher', '$62,000', '~$4,247'],
              ['Graphic Designer', '$58,000', '~$3,973'],
              ['Barista', '$32,000', '~$2,373'],
            ].map(([c, s, m], i) => <tr key={i}><td style={{ ...g.td, background: i % 2 === 0 ? '#faf9f6' : '#fff' }}>{c}</td><td style={{ ...g.td, background: i % 2 === 0 ? '#faf9f6' : '#fff', fontWeight: 700 }}>{s}</td><td style={{ ...g.td, background: i % 2 === 0 ? '#faf9f6' : '#fff' }}>{m}</td></tr>)}
            </tbody>
          </table>
          <Callout type="tip" label="💡 Try this">Compare Teacher vs. Data Analyst. The $26,000 salary gap translates to roughly $1,770/month in take-home — over $21,000/year difference in lifestyle capacity. Seeing the numbers makes career decisions feel real.</Callout>
        </>
      )
    },

    // ─────────────────────────────────────────
    // 05 · LEAGUES & BLITZ TRADING
    // ─────────────────────────────────────────
    {
      id: 'leagues', number: '05', emoji: '🏆',
      title: 'Leagues & Blitz Trading',
      subtitle: 'Create or join leagues, run live 10-minute trading sessions, and read the Activity Feed.',
      keywords: 'league tournament blitz stock trading live compete classmates join code create public private leaderboard feed GIGA VOY MART SPY GLD NPC opponent standings',
      content: () => (
        <>
          <p style={g.p}>Leagues are the multiplayer layer of PaidForward. A league is a group that competes in <strong>10-minute live Blitz sessions</strong> — everyone trades the same five simulated stocks simultaneously, and the player with the highest total portfolio value (cash + stock holdings) at the timer's end wins.</p>
          <h4 style={g.h4}>Creating and joining leagues</h4>
          <div style={g.steps}>
            {[
              ['Create a league', 'From Games → "Classroom Leagues" → Tournament Hub. Type a name, choose Public or Private, click Create. A 5-character join code is generated instantly — share it with anyone you want to compete against.'],
              ['Join a league', 'Enter a code in the "Join via Code" field and press Enter or tap Join. Public leagues also appear in the Open Arena list — scroll to browse them. Once you\'re a member, the league appears under "My Private Leagues" or in the Arena.'],
              ['View the league detail page', 'Tap any league card to open its detail page. You\'ll see the full player list and a leaderboard that shows each player\'s current wealth (updated every session). Only the creator sees the Delete button.'],
              ['Start a Blitz match', 'From the league detail page, tap "🚀 Start Match." The 10-minute countdown starts immediately — no waiting room. All league members who click Start at the same time play concurrently.'],
            ].map(([h, p], i) => (
              <div key={i} style={g.step}>
                <div style={g.stepNum}>{i + 1}</div>
                <div><h4 style={g.stepH}>{h}</h4><p style={g.stepP}>{p}</p></div>
              </div>
            ))}
          </div>

          <h4 style={g.h4}>The 5 stocks in every Blitz session</h4>
          <table style={g.table}><thead><tr>{['Ticker', 'Company', 'Character', 'Strategy note'].map(h => <th key={h} style={g.th}>{h}</th>)}</tr></thead>
            <tbody>{[
              ['GIGA', 'GigaSoft Tech', 'High growth, high volatility (beta 1.45, Bullish)', 'High risk/reward. Good for aggressive players.'],
              ['VOY', 'Voyager Energy', 'Stable dividend payer (6.2% yield, Neutral)', 'Low drama. Good anchor for conservative players.'],
              ['MART', 'MegaMart Corp', 'Declining trend (Bearish sentiment)', 'Generally avoid unless you spot a reversal.'],
              ['SPY', 'S&P Lite Index', 'Lowest risk, steady uptrend (beta 1.0)', 'Safest stock. Great starting point for beginners.'],
              ['GLD', 'Digital Gold', 'Near-zero market correlation (beta 0.15)', 'Uncorrelated hedge. Moves independently of tech swings.'],
            ].map(([t, c, d, s], i) => <tr key={i}><td style={{ ...g.td, fontWeight: 700, background: i % 2 === 0 ? '#faf9f6' : '#fff' }}>{t}</td><td style={{ ...g.td, background: i % 2 === 0 ? '#faf9f6' : '#fff' }}>{c}</td><td style={{ ...g.td, background: i % 2 === 0 ? '#faf9f6' : '#fff' }}>{d}</td><td style={{ ...g.td, background: i % 2 === 0 ? '#faf9f6' : '#fff' }}>{s}</td></tr>)}
            </tbody>
          </table>

          <h4 style={g.h4}>The Blitz trading interface</h4>
          <p style={g.p}>The Blitz screen has three columns:</p>
          <div style={g.cardGrid}>
            <Card accent="#6366f1" icon="📡" title="Left column — Standings & Feed">Shows the live leaderboard ranking all players by total wealth (yours highlighted in yellow). Below that, the Activity Feed streams every trade made by AI opponents in real time (green for buys, red for sells). Watch it to see what the "market" is doing.</Card>
            <Card accent="#10b981" icon="🖥️" title="Centre — Market Terminal">The stock table with live-updating prices, mini sparkline charts, and sentiment badges. Click any ticker name (underlined in blue) to open the full Yahoo Finance-style popup with P/E, beta, EPS, dividend yield, 52-week range, and more. Click a row to select that stock for trading.</Card>
            <Card accent="#f59e0b" icon="💼" title="Right column — Portfolio">Shows your total wealth, available cash, and all open stock positions with live P&L. A large red "End Competition" button lets you cash out early if you're ahead. All positions auto-liquidate at the 10-minute mark.</Card>
          </div>
          <Callout type="info" label="ℹ️ Vocabulary helpers">Throughout the Blitz screen you'll see underlined column headers with a <strong>?</strong> next to them (e.g., "Ticker ?", "Sentiment ?"). Click any of these to open a plain-English definition popup. Good way to learn while playing without leaving the game.</Callout>
          <h4 style={g.h4}>AI opponents (NPCs)</h4>
          <p style={g.p}>In Blitz matches, AI opponents trade alongside you. Each NPC has a personality: <strong>Aggressive</strong> (buys a lot, rarely sells), <strong>Conservative</strong> (sells frequently, buys little), <strong>Balanced</strong> (moderate on both), or <strong>YOLO</strong> (extremely high buy rate, almost never sells). Watch the Activity Feed to infer their strategies and trade accordingly.</p>
          <Callout type="tip" label="💡 First Blitz strategy">New to Blitz? Buy 1–2 shares of <strong>SPY</strong> immediately (safest stock), then watch the Feed for 2–3 minutes. If GIGA is trending up in the feed (lots of buys), add a share. Never go all-in on one stock — diversification is the real lesson here.</Callout>
        </>
      )
    },

    // ─────────────────────────────────────────
    // 06 · PROGRESS & TOOLS
    // ─────────────────────────────────────────
    {
      id: 'progress', number: '06', emoji: '📊',
      title: 'Progress & Financial Tools',
      subtitle: 'XP levels, streak, all 8 achievements, and 6 built-in money tools.',
      keywords: 'xp level streak achievements budget tracker latte factor subscription audit price per use no spend mood journal level badge scholar champion unstoppable on fire',
      content: () => (
        <>
          <p style={g.p}>The Progress screen has two parts: a <strong>stats & achievements panel</strong> at the top, and a <strong>tabbed Financial Tools panel</strong> below. Scroll past achievements to reach the tools.</p>
          <h4 style={g.h4}>XP and levels</h4>
          <p style={g.p}>Every 1,000 XP advances you one level. The blue level card at the top shows your current level, your XP within the current level, and a progress bar to the next level. XP sources:</p>
          <ul style={{ fontSize: 14, lineHeight: 1.9, color: '#475569', paddingLeft: 20, margin: '0 0 16px' }}>
            <li><strong>150 XP</strong> — completing a course</li>
            <li><strong>250 XP</strong> — winning a game</li>
            <li><strong>50 XP</strong> — playing a game (win or lose)</li>
          </ul>
          <h4 style={g.h4}>Streak</h4>
          <p style={g.p}>Your streak increments each calendar day you log in. Missing a day resets it to zero. Log in 3 days in a row to earn "On Fire." Log in 7 consecutive days to earn "Unstoppable." The streak counter shows on your Progress card and on your community posts.</p>
          <h4 style={g.h4}>All 8 achievements</h4>
          <div style={g.achGrid}>
            {[
              ['🌱', 'Early Bird', 'Complete 1 course', 'courses'],
              ['🎓', 'Scholar', 'Complete all 3 courses', 'courses'],
              ['🎮', 'Game On', 'Play 1 game', 'games'],
              ['🏆', 'Champion', 'Win 1 game', 'games'],
              ['🎲', 'High Roller', 'Win 5 games', 'games'],
              ['💎', 'XP Master', 'Earn 1,500 XP', 'xp'],
              ['🔥', 'On Fire', '3-day login streak', 'streak'],
              ['⚡', 'Unstoppable', '7-day login streak', 'streak'],
            ].map(([e, t, r, cat]) => (
              <div key={t} style={g.achCard}>
                <span style={{ fontSize: 24, display: 'block', marginBottom: 6 }}>{e}</span>
                <strong style={{ fontSize: 12 }}>{t}</strong>
                <p style={{ fontSize: 11, color: '#6b6b6b', margin: '2px 0 0' }}>{r}</p>
                <p style={{ fontSize: 10, color: '#94a3b8', margin: '2px 0 0', fontStyle: 'italic' }}>{cat}</p>
              </div>
            ))}
          </div>
          <p style={{ ...g.p, marginTop: 12 }}>Achievements unlock automatically the moment you meet the condition — you'll see a toast notification appear in the top corner. They're permanently displayed on your Progress screen, greyed-out if locked and with a green ✓ badge if unlocked.</p>

          <h4 style={g.h4}>Financial Tools — all 6 tabs</h4>
          {[
            ['📊', 'Budget Tracker', 'Enter your income and all expense categories. The tracker calculates your remaining balance and shows which categories are eating the most. Your most actionable daily-use tool — open it every time you get paid.'],
            ['☕', 'Latte Factor Calculator', 'Type in a recurring daily or weekly habit expense (e.g., "$6 daily coffee"). The tool calculates the monthly cost, yearly cost, decade cost, and what that money would be worth if invested at 7% annual return instead. Eye-opening for any habit spend.'],
            ['📦', 'Subscription Audit', 'List all your subscriptions (Netflix, Spotify, gym, etc.) with their monthly cost. The tool totals them. Research consistently shows people underestimate their subscription spend by 2–3×. Auditing twice a year typically uncovers $50–$150 in forgotten charges.'],
            ['🏷️', 'Price Per Use Tracker', 'Enter a purchase price and how many times you\'ve used the item. The tool divides purchase ÷ uses = cost-per-use. A $300 jacket worn 150 times costs $2/use — much better value than a $60 jacket worn 5 times ($12/use). Pairs perfectly with the "Smart Spending" module.'],
            ['🚫', 'No-Spend Day Tracker', 'A full monthly calendar. Tap any past or current day to mark it as a no-spend day (turns green with a ✓). Set a monthly no-spend goal (default: 8 days), track streaks, and see an estimated savings projection based on $30/day average spend. Month-by-month history shows your trend over time.'],
            ['📓', 'Financial Mood Journal', 'Log how you feel about money each day (Stressed/Worried/Neutral/Good/Great), an optional dollar amount spent, and a category tag. The History tab shows your mood over time with summary stats (average mood, total logged, most common feeling). You\'ll notice mood scores are almost always higher on no-spend days.'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={g.toolRow}><div style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{icon}</div><div><h4 style={{ ...g.stepH, marginTop: 0 }}>{title}</h4><p style={g.stepP}>{desc}</p></div></div>
          ))}
          <Callout type="tip" label="💡 Power combo">Use the <strong>No-Spend Tracker</strong> and <strong>Mood Journal</strong> together — log your mood every day for two weeks. You'll almost certainly find mood scores are higher on no-spend days. That pattern alone tends to change spending behaviour.</Callout>
          <h4 style={g.h4}>Savings & Goal Planning section</h4>
          <p style={g.p}>Below the Financial Tools, there's a "Savings & Goal Planning" section with three mini cards: Emergency Fund, Retirement Habit, and Investment Idea. Each has a brief description and an "Open Goal Planner" button that jumps directly to the Goals screen. These are context nudges, not interactive tools.</p>
        </>
      )
    },

    // ─────────────────────────────────────────
    // 07 · SAVINGS GOALS
    // ─────────────────────────────────────────
    {
      id: 'goals', number: '07', emoji: '🎯',
      title: 'Savings Goals',
      subtitle: 'Set targets, log deposits with quick buttons, celebrate completions, and track overall progress.',
      keywords: 'savings goal target deposit emergency fund laptop phone car trip progress celebrate confetti completion quick deposit custom amount suggested goals overall',
      content: () => (
        <>
          <p style={g.p}>The Goals screen lets you set savings targets, track deposits, and celebrate every milestone. Goals sync to the database via your user ID, so they persist across sessions (unlike some other features that use local storage).</p>
          <h4 style={g.h4}>Quick-Start goals (pre-loaded)</h4>
          <p style={g.p}>Five suggested goals appear at the top as coloured buttons. Tap any to instantly add it to your list — no setup needed:</p>
          <table style={g.table}><thead><tr>{['Goal', 'Default Target', 'Why it matters'].map(h => <th key={h} style={g.th}>{h}</th>)}</tr></thead>
            <tbody>{[
              ['🛟 Emergency Fund', '$500', 'First financial priority for anyone. Protects every other goal.'],
              ['💻 New Laptop', '$1,200', 'Common tech goal. Great first "big purchase" to save toward.'],
              ['✈️ Summer Trip', '$800', 'Travel savings build the delayed-gratification habit.'],
              ['📱 New Phone', '$900', 'High-frequency purchase — good to save rather than finance.'],
              ['🚗 Car Fund', '$3,000', 'Larger goal that teaches long-term saving discipline.'],
            ].map(([g1, g2, g3], i) => <tr key={i}><td style={{ ...g.td, background: i % 2 === 0 ? '#faf9f6' : '#fff' }}>{g1}</td><td style={{ ...g.td, background: i % 2 === 0 ? '#faf9f6' : '#fff', fontWeight: 700 }}>{g2}</td><td style={{ ...g.td, background: i % 2 === 0 ? '#faf9f6' : '#fff' }}>{g3}</td></tr>)}
            </tbody>
          </table>
          <h4 style={g.h4}>Adding a custom goal</h4>
          <p style={g.p}>Below the quick-start buttons is a form with two fields: "What are you saving for?" and "Target ($)." Fill both and tap "Add Goal." The new card appears in the grid below with a blue progress bar, a 🎯 emoji, and deposit buttons.</p>
          <h4 style={g.h4}>Depositing money toward a goal</h4>
          <p style={g.p}>Each goal card has three quick-deposit buttons — <strong>+$20, +$50, +$100</strong> — plus a custom amount input field followed by a Deposit button. Tap a quick button or enter an amount and tap Deposit. The progress bar fills instantly. You can also see the raw dollar amounts ("$120 saved of $500").</p>
          <Callout type="good" label="🎉 Celebration">When you hit 100%, a full-screen confetti overlay appears with "Goal Complete!" and the goal name in large purple text. The goal card permanently turns green with a "🏆 Goal Met!" badge — and the achievement notification fires if it triggers one.</Callout>
          <h4 style={g.h4}>Overall Progress card</h4>
          <p style={g.p}>At the top of the Goals screen (once you have at least one goal), a blue gradient card shows: total saved across all goals, total target across all goals, and an overall percentage with a progress bar. This gives you a birds-eye view of your total savings journey.</p>
          <Callout type="tip" label="💡 Start here">The <strong>Emergency Fund ($500)</strong> is universally the best first goal. Without it, a single unexpected expense (car repair, medical bill) drains everything you've saved elsewhere. Build that $500 buffer before anything else.</Callout>
        </>
      )
    },

    // ─────────────────────────────────────────
    // 08 · COMMUNITY DISCUSSION
    // ─────────────────────────────────────────
    {
      id: 'community', number: '08', emoji: '💬',
      title: 'Community Discussion',
      subtitle: 'A live public feed for questions and wins — adults only. Post, react, reply, delete.',
      keywords: 'discussion post reply react like delete feed community share question adults thumbs laugh heart timestamp my posts filter',
      content: () => (
        <>
          <p style={g.p}>Discussion is a live public feed linked to a shared database. Posts from other users appear within seconds of being posted — it's genuinely real-time. This screen is <strong>adults only</strong> (14+). Kids do not see it in the navigation.</p>
          <h4 style={g.h4}>Everything you can do</h4>
          {[
            ['Posting', 'Type in the large text area at the top (labelled with "Posting as [username]"). Click the blue Post button. Your post appears at the top of the feed immediately, timestamped with the full date and time. Every post is visible to all users.'],
            ['Reactions', 'Each post has three reaction buttons: ❤️ like, 👍 thumbs up, 😂 laugh. Each shows a count. Tap to add your reaction — the count increments and the icon turns coloured. Tap again to remove it. You can add all three reactions to a single post.'],
            ['Replies', 'Below every post is a reply input field. Type your reply and press Enter or click the Reply button. Replies appear nested under the original post, indented with a left border. Each reply shows the username and is immediately visible to everyone.'],
            ['Deleting posts', 'A 🗑 Delete button appears on your own posts (logged-in user only — others cannot see or use it). Clicking it asks for confirmation before removing the post and all its replies permanently.'],
            ['Deleting replies', 'A small "delete" link appears next to replies you wrote. It removes just that reply without affecting the parent post or other replies.'],
            ['Filtering to your posts', 'The "Showing: All Posts" toggle button in the top-right switches between the full feed and "My Posts only." Useful for reviewing everything you\'ve said without scrolling through the entire board.'],
          ].map(([h, p]) => (
            <div key={h} style={{ marginBottom: 12 }}><strong style={{ fontSize: 14 }}>{h}</strong><p style={{ ...g.p, marginTop: 4, marginBottom: 0 }}>{p}</p></div>
          ))}
          <Callout type="tip" label="💡 What to post">The best posts are specific. "Just hit my emergency fund goal after 3 months!" or "Which game mode teaches credit best?" get much better engagement than vague posts like "hi." Your streak badge (🔥) appears next to your name if it's 2+ days.</Callout>
          <Callout type="info" label="ℹ️ Feed refresh">The feed refreshes automatically every 5 seconds — you don't need to reload the page to see new posts. If you're watching a conversation in real time, it'll update on its own.</Callout>
        </>
      )
    },

    // ─────────────────────────────────────────
    // 09 · SETTINGS
    // ─────────────────────────────────────────
    {
      id: 'settings', number: '09', emoji: '⚙️',
      title: 'Settings',
      subtitle: 'Change your display name, update your password, and delete your account.',
      keywords: 'settings username display name password change update delete account wipe data logout close security profile',
      content: () => (
        <>
          <p style={g.p}>Settings is a clean three-section page: <strong>Profile</strong>, <strong>Security</strong>, and <strong>Danger</strong>. Access it from the bottom navigation bar.</p>
          <div style={g.steps}>
            {[
              ['Change your display name (Profile)', 'Your current username appears in a grey badge. Type a new username in the input and tap Update. The system checks that the new name isn\'t already taken. On success, your name updates everywhere — navigation, posts, leaderboards — immediately. On failure, an error toast appears.'],
              ['Change your password (Security)', 'Enter your current password, then your new password (minimum 6 characters). Tap "Update Password." The system verifies the current password before making any change. A success toast confirms the update. If the current password is wrong, an error toast appears without changing anything.'],
              ['Delete your account (Danger)', 'The red "Wipe Data & Logout" section is for permanently deleting your local profile. Enter your password to confirm, then tap the red button. A second confirmation dialog ("Delete Forever" vs. "Go Back") prevents accidental deletion. On confirm, all local progress, course completions, high scores, and league data are cleared and you\'re signed out.'],
            ].map(([h, p], i) => (
              <div key={i} style={g.step}>
                <div style={g.stepNum}>{i + 1}</div>
                <div><h4 style={g.stepH}>{h}</h4><p style={g.stepP}>{p}</p></div>
              </div>
            ))}
          </div>
          <Callout type="warn" label="⚠️ Wipe Data warning">Deleting your account clears your course progress, game history, achievement badges, and streak. It only clears <em>local</em> data — community posts you made will still exist on the shared database (you just won't be able to delete them without logging in again).</Callout>
        </>
      )
    },

    // ─────────────────────────────────────────
    // 10 · GLOSSARY
    // ─────────────────────────────────────────
    {
      id: 'glossary', number: '10', emoji: '📖',
      title: 'Financial Glossary',
      subtitle: 'Every key term used in courses, games, and the Blitz — defined in plain language.',
      keywords: 'definition budget compound interest APR HYSA index fund ETF 401k Roth IRA credit score utilisation beta dividend yield P/E ratio zero-based sinking fund DCA rule of 72 FICA market cap EPS bid ask volume sentiment',
      content: () => (
        <>
          <h4 style={g.h4}>Budgeting & Spending</h4>
          {[
            ['Budget', 'A plan that assigns every dollar of income to a specific purpose before you spend it. The goal is intentionality — no dollar goes "missing."'],
            ['Zero-Based Budget', 'Income minus every assigned category = exactly $0. Every dollar has a job. More labour-intensive than percentage methods, but produces the most spending awareness.'],
            ['50/30/20 Rule', '50% of after-tax income to needs (rent, utilities, groceries, minimum debt payments), 30% to wants (dining, entertainment, travel), 20% to savings and extra debt paydown.'],
            ['Sinking Fund', 'Money set aside monthly for a known future irregular expense. Annual car registration of $300 ÷ 12 = $25/month into your "car fund." Prevents surprise expenses.'],
            ['Lifestyle Inflation', 'When spending rises proportionally with income, leaving savings unchanged. The primary reason high earners can still live paycheck-to-paycheck.'],
            ['Opportunity Cost', 'What you give up by spending money one way instead of another. $6/day coffee = ~$2,190/year = ~$30,000 in missed investment growth over 10 years at 7%.'],
            ['Cost-Per-Use', 'Purchase price ÷ number of uses. A $300 item used 150 times ($2/use) beats a $60 item used 5 times ($12/use). The tool on the Progress screen calculates this.'],
            ['Pay Yourself First', 'Automatically transfer savings the moment your paycheck arrives, before any other spending. Removes willpower from the equation.'],
            ['24-Hour Rule', 'Wait 24–72 hours before any discretionary purchase over $50. Research shows desire for non-essentials drops significantly after a waiting period.'],
            ['Anti-Budget', 'Automate all savings and bill payments first, then spend the remainder freely without tracking categories. Works for people who hate detailed monitoring.'],
          ].map(([t, d]) => <Vocab key={t} term={t} def={d} />)}

          <h4 style={g.h4}>Saving & Interest</h4>
          {[
            ['Emergency Fund', '3–6 months of essential living expenses in a liquid savings account. Used only for genuine emergencies (job loss, medical crisis, major car repair). Not a vacation fund.'],
            ['HYSA', 'High-Yield Savings Account — earns 4–5% APY (as of 2024–2025), FDIC-insured, fully accessible. The ideal home for your emergency fund and short-term savings goals.'],
            ['FDIC Insurance', 'Federal Deposit Insurance Corporation coverage. Protects up to $250,000 per depositor per bank if the bank fails. All major US banks are FDIC-insured.'],
            ['Compound Interest', 'Earning returns not just on your principal, but on all previously accumulated interest. $10,000 at 7% doesn\'t just earn $700/year — by year 10 it\'s earning interest on $17,000+, accelerating exponentially.'],
            ['Rule of 72', 'Divide 72 by your annual interest rate to find how many years to double your money. At 7%: 72 ÷ 7 ≈ 10 years. At 10%: 72 ÷ 10 = 7.2 years.'],
            ['Dollar-Cost Averaging (DCA)', 'Investing a fixed amount on a regular schedule (e.g., $200 every month) regardless of market conditions. Removes the temptation to time the market and automatically buys more shares when prices are low.'],
            ['APY', 'Annual Percentage Yield — the real return on savings including compounding. Different from APR (which doesn\'t account for compounding). A 4% APY HYSA earns more than a 4% APR account.'],
          ].map(([t, d]) => <Vocab key={t} term={t} def={d} />)}

          <h4 style={g.h4}>Investing</h4>
          {[
            ['S&P 500', 'Index tracking 500 of the largest publicly-traded US companies. Historical average return: ~10%/year (~7% after inflation). The standard long-term benchmark.'],
            ['Index Fund / ETF', 'A fund that tracks a market index. Instant diversification across hundreds of companies at very low cost. ETF = traded on exchanges like a stock. Index fund = priced once daily.'],
            ['401(k)', 'An employer-sponsored retirement account. Contributions are pre-tax (reduces your taxable income now); you pay taxes on withdrawal in retirement. Many employers match a portion — always contribute enough to get the full match (it\'s free money).'],
            ['Roth IRA', 'A retirement account where contributions are after-tax but growth is completely tax-free forever. Best if you expect to be in a higher tax bracket in retirement.'],
            ['P/E Ratio', 'Price-to-Earnings Ratio. Share price ÷ earnings per share. High P/E = investors expect high future growth. A P/E of 45 (like GIGA in Blitz) means investors are paying $45 for every $1 of current earnings.'],
            ['Beta', 'How much a stock moves relative to the overall market. Beta 1.45 (GIGA) = 45% more volatile than the market. Beta 0.15 (GLD) = nearly uncorrelated with market moves.'],
            ['Dividend Yield', 'Annual dividend payment as a percentage of stock price. VOY\'s 6.2% yield means $6.20/year paid per $100 invested — income without selling shares.'],
            ['Market Sentiment', 'Investor attitude toward a stock or the market overall. Bullish = optimistic (expecting prices to rise). Bearish = pessimistic (expecting prices to fall).'],
            ['Market Cap', 'Total value of a company\'s outstanding shares. Share price × total shares. GigaSoft at $2.4T market cap is a "mega-cap" like Apple or Microsoft.'],
            ['EPS (Earnings Per Share)', 'Net profit ÷ total shares outstanding. Higher EPS = more profitable per share. Combined with P/E, helps judge whether a stock is fairly valued.'],
          ].map(([t, d]) => <Vocab key={t} term={t} def={d} />)}

          <h4 style={g.h4}>Credit & Debt</h4>
          {[
            ['Credit Score', 'A 3-digit number (300–850) summarising your creditworthiness. Higher is better. FICO scores above 740 are considered "very good" and unlock the best interest rates.'],
            ['Credit Report', 'The full detailed record of your credit history — every account, payment, inquiry, and derogatory mark. Held by the three bureaus: Equifax, Experian, TransUnion. Your score is calculated from this report.'],
            ['Credit Utilisation', 'Percentage of available revolving credit you\'re using. Using $3,000 of a $10,000 limit = 30% utilisation. Keep below 30%; below 10% is ideal for maximising your score.'],
            ['Hard Inquiry', 'A credit check triggered when you apply for new credit. Lowers your score 2–5 points and stays on your report for 2 years. Multiple hard inquiries in a short window (e.g., rate shopping for a mortgage) are usually counted as one.'],
            ['Soft Inquiry', 'A credit check that doesn\'t affect your score. Includes checking your own score, pre-approval offers, and background checks by employers.'],
            ['APR', 'Annual Percentage Rate — the yearly cost of borrowing including fees. A 24% APR credit card charges approximately 2% per month on any carried balance. On a $1,000 balance, that\'s $240 in interest per year.'],
            ['Secured Credit Card', 'A credit card backed by a cash deposit equal to your limit. You deposit $500 → you get a $500 limit. Used to build credit from zero or rebuild damaged credit. Reports to all three bureaus.'],
            ['Minimum Payment', 'The smallest amount your card issuer will accept without charging a late fee. Paying only minimums dramatically extends payoff time and maximises interest paid — always pay more than the minimum if you can.'],
          ].map(([t, d]) => <Vocab key={t} term={t} def={d} />)}

          <h4 style={g.h4}>Blitz trading terms</h4>
          {[
            ['Bid', 'The highest price a buyer is currently willing to pay for a share. If the bid is $250.10, that\'s the best available buy price right now.'],
            ['Ask', 'The lowest price a seller is willing to accept. The spread between bid and ask is the dealer\'s profit on each transaction.'],
            ['Volume', 'Number of shares traded in a given period. High volume = high liquidity and more price discovery. Low volume = less reliable price signals.'],
            ['52-Week Range', 'The lowest and highest price a stock traded at over the past year. Tells you whether the current price is near the top or bottom of its recent range.'],
            ['1Y Target Estimate', 'Analyst consensus price target 12 months out. Compared to the current price, shows whether analysts expect the stock to rise or fall.'],
          ].map(([t, d]) => <Vocab key={t} term={t} def={d} />)}
        </>
      )
    },
  ];

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.keywords.toLowerCase().includes(q) ||
      s.subtitle.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div style={g.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,600;0,800;1,300&family=DM+Sans:wght@400;500;700&display=swap');
        .guide-toc-btn:hover { border-color: #4338ca !important; background: #eef2ff !important; color: #4338ca !important; }
        .guide-section { scroll-margin-top: 80px; }
      `}</style>

      {/* Cover */}
      <div style={g.cover}>
        <div style={g.coverEyebrow}>Complete Beginner's Guide</div>
        <h1 style={g.coverH1}>The <em style={{ fontStyle: 'italic', fontWeight: 300, color: '#fde68a' }}>full</em> guide to PaidForward</h1>
        <p style={g.coverP}>Everything you need to go from zero financial knowledge to confident and capable — every screen, every tool, every term explained.</p>
        <div style={g.coverMeta}>
          {[['10', 'Screens covered'], ['6', 'Course tracks'], ['8+', 'Games & tools'], ['8', 'Achievements'], ['40+', 'Glossary terms']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}><strong style={{ display: 'block', fontSize: 22, color: '#fde68a' }}>{n}</strong><span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{l}</span></div>
          ))}
        </div>
      </div>

      {/* Search + TOC */}
      <div style={g.tocArea}>
        <input
          type="text"
          placeholder="🔍  Search topics, terms, features..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={g.searchInput}
        />
        {!searchQuery && (
          <div style={g.tocGrid}>
            {sections.map(s => (
              <button key={s.id} className="guide-toc-btn" onClick={() => scrollTo(s.id)} style={g.tocBtn}>
                <span>{s.emoji}</span> {s.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sections */}
      <div style={g.content}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b6b6b' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <h3 style={{ fontFamily: 'Fraunces,serif', fontSize: 22 }}>No results for "{searchQuery}"</h3>
            <p style={{ marginTop: 8 }}>Try searching for "budget", "credit", "blitz", "compound", or "games".</p>
          </div>
        ) : filtered.map(s => (
          <div key={s.id} id={`guide-${s.id}`} className="guide-section" style={g.section}>
            <div style={g.sectionNum}>Section {s.number}</div>
            <h2 style={g.sectionTitle}>{s.title}</h2>
            <p style={g.sectionSub}>{s.subtitle}</p>
            {s.content()}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={g.footer}>
        <p><strong style={{ color: '#fff' }}>PaidForward</strong> — Complete Beginner's Guide</p>
        <p style={{ marginTop: 6, fontSize: 12 }}>Refer back any time you're unsure where to find something. Search for any term, screen, or concept using the box at the top.</p>
      </div>
    </div>
  );
}

/* ── Small reusable sub-components ── */
function Callout({ type, label, children }) {
  const map = {
    tip:  { bg: '#fdf3e0', border: '#e8a020', labelColor: '#92400e' },
    info: { bg: '#eff6ff', border: '#1d4ed8', labelColor: '#1d4ed8' },
    good: { bg: '#f0fdf4', border: '#15803d', labelColor: '#15803d' },
    warn: { bg: '#fff1f2', border: '#b91c1c', labelColor: '#b91c1c' },
  };
  const { bg, border, labelColor } = map[type] || map.info;
  return (
    <div style={{ borderLeft: `3px solid ${border}`, background: bg, padding: '12px 16px', borderRadius: '0 8px 8px 0', margin: '16px 0' }}>
      <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: labelColor, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{children}</div>
    </div>
  );
}

function Card({ accent, icon, title, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e0d5', borderRadius: 12, padding: 18, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent }} />
      <span style={{ fontSize: 26, display: 'block', marginBottom: 8 }}>{icon}</span>
      <h3 style={{ fontFamily: 'Fraunces,serif', fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{title}</h3>
      <p style={{ fontSize: 13, color: '#6b6b6b', lineHeight: 1.6, margin: 0 }}>{children}</p>
    </div>
  );
}

function Vocab({ term, def }) {
  return (
    <div style={{ background: '#f2efe8', border: '1px solid #e5e0d5', borderRadius: 8, padding: '10px 14px', marginBottom: 8 }}>
      <dt style={{ fontWeight: 700, fontSize: 14, display: 'block' }}>{term}</dt>
      <dd style={{ margin: '3px 0 0', color: '#6b6b6b', fontSize: 13, lineHeight: 1.5 }}>{def}</dd>
    </div>
  );
}

function Highlight({ children }) {
  return <span style={{ background: '#fdf3e0', borderRadius: 3, padding: '1px 5px', fontWeight: 700 }}>{children}</span>;
}

/* ── Styles object ── */
const g = {
  page: { fontFamily: "'DM Sans', system-ui, sans-serif", background: '#faf9f6', color: '#0f0e17', minHeight: '100vh' },
  cover: {
    background: '#0f0e17', color: '#fff', padding: '60px 40px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden',
    backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, #312e81 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 100%, #065f46 0%, transparent 60%)'
  },
  coverEyebrow: { display: 'inline-block', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 4, padding: '5px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 20 },
  coverH1: { fontFamily: 'Fraunces, serif', fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 16, letterSpacing: '-0.5px' },
  coverP: { fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 540, margin: '0 auto 36px' },
  coverMeta: { display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap' },
  tocArea: { background: '#f2efe8', borderBottom: '1px solid #e5e0d5', padding: '24px 40px' },
  searchInput: { width: '100%', maxWidth: 600, display: 'block', margin: '0 auto 20px', padding: '12px 18px', borderRadius: 10, border: '2px solid #e5e0d5', fontSize: 15, fontFamily: 'inherit', outline: 'none', background: '#fff', boxSizing: 'border-box' },
  tocGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, maxWidth: 1000, margin: '0 auto' },
  tocBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#fff', border: '1px solid #e5e0d5', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#0f0e17', transition: 'all 0.15s', textAlign: 'left', fontFamily: 'inherit' },
  content: { maxWidth: 860, margin: '0 auto', padding: '0 40px 80px' },
  section: { marginTop: 56, paddingTop: 56, borderTop: '1px solid #e5e0d5' },
  sectionNum: { fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b6b6b', marginBottom: 6 },
  sectionTitle: { fontFamily: 'Fraunces, serif', fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: 800, lineHeight: 1.15, marginBottom: 4, letterSpacing: '-0.3px' },
  sectionSub: { fontSize: 16, color: '#6b6b6b', marginBottom: 28 },
  p: { fontSize: 15, lineHeight: 1.7, marginBottom: 14 },
  h4: { fontSize: 15, fontWeight: 700, margin: '22px 0 10px', color: '#0f0e17' },
  steps: { margin: '16px 0' },
  step: { display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid #e5e0d5' },
  stepNum: { width: 30, height: 30, background: '#0f0e17', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0, marginTop: 2 },
  stepH: { fontWeight: 700, fontSize: 15, marginBottom: 3, marginTop: 0 },
  stepP: { fontSize: 13, color: '#6b6b6b', margin: 0, lineHeight: 1.6 },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, margin: '18px 0' },
  twoCol: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, margin: '18px 0' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13, margin: '16px 0' },
  th: { background: '#0f0e17', color: '#fff', padding: '9px 12px', textAlign: 'left', fontWeight: 700, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' },
  td: { padding: '11px 12px', borderBottom: '1px solid #e5e0d5', verticalAlign: 'top', lineHeight: 1.5 },
  gameList: { margin: '16px 0' },
  gameItem: { display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid #e5e0d5', alignItems: 'flex-start' },
  gameEmoji: { fontSize: 28, lineHeight: 1, flexShrink: 0, marginTop: 2 },
  achGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, margin: '16px 0' },
  achCard: { background: '#fff', border: '1px solid #e5e0d5', borderRadius: 10, padding: '14px 12px', textAlign: 'center' },
  toolRow: { display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid #e5e0d5', alignItems: 'flex-start' },
  pill: { display: 'inline-block', padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700 },
  'pill-violet': { background: '#eef2ff', color: '#4338ca' },
  'pill-red': { background: '#fff1f2', color: '#b91c1c' },
  'pill-gold': { background: '#fdf3e0', color: '#92400e' },
  footer: { background: '#0f0e17', color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '28px 20px', fontSize: 13 },
};