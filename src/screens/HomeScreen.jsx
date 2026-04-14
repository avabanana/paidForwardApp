import React, { useMemo } from "react";

const dailyTips = [
  "Track one small purchase today and think about how it fits into your budget.",
  "Saving just a little bit every day adds up quickly over a year.",
  "When you earn money, try saving 10% first before spending the rest.",
  "Compare prices before you buy to make sure you get the best deal.",
  "Setting a savings goal makes it easier to say no to impulse buys.",
  "An emergency fund of 3–6 months of expenses is one of the best financial moves you can make.",
  "Compound interest works best when you start saving early — even small amounts count.",
  "Review your subscriptions monthly and cancel what you don't use."
];

export default function HomeScreen({ onNavigate, userTier }) {
  const isElementary = userTier === 'elementary';
  const heroBadgeText = isElementary
    ? '🌟 Learning money is fun and easy'
    : '🚀 Your financial journey starts here';
  const heroTitleText = isElementary
    ? 'Build smart money habits with games and goals'
    : 'Build a Future You’re Proud Of';
  const heroSubtitleText = isElementary
    ? 'Play simple money games, level up your savings, and feel great about good choices.'
    : 'Learn real money skills, play games that test your knowledge, and track your growth — all in one place.';

  // Deterministic daily tip: pick by day-of-year so it changes daily but is consistent across tabs/refreshes
  const tip = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
    );
    return dailyTips[dayOfYear % dailyTips.length];
  }, []);

  return (
    <div style={styles.container}>
      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>{heroBadgeText}</div>
          <h1 style={styles.heroTitle}>{heroTitleText}</h1>
          <p style={styles.heroSubtitle}>{heroSubtitleText}</p>
          <div style={styles.dailyTip}>
            <span style={styles.tipLabel}>💡 Daily Tip</span>
            <span style={styles.tipText}>{tip}</span>
          </div>
        </div>
        <div style={styles.heroDecor}>💸</div>
      </div>

      {/* Feature cards */}
      <div style={styles.cardsRow}>
        <div style={{ ...styles.featureCard, borderTop: "4px solid #6366f1" }}>
          <div style={styles.featureIcon}>📚</div>
          <h3 style={styles.featureTitle}>Learn</h3>
          <p style={styles.featureDesc}>
            Master money management with bite-sized lessons and quizzes across 3 courses.
          </p>
          <button onClick={() => onNavigate("Courses")} style={{ ...styles.featureBtn, color: "#6366f1" }}>
            Open Courses →
          </button>
        </div>

        <div style={{ ...styles.featureCard, borderTop: "4px solid #10b981" }}>
          <div style={styles.featureIcon}>🎮</div>
          <h3 style={styles.featureTitle}>Play</h3>
          <p style={styles.featureDesc}>
            Test your financial instincts in budgeting, investing, and savings games.
          </p>
          <button onClick={() => onNavigate("Games")} style={{ ...styles.featureBtn, color: "#10b981" }}>
            Play Games →
          </button>
        </div>

        <div style={{ ...styles.featureCard, borderTop: "4px solid #f59e0b" }}>
          <div style={styles.featureIcon}>🌍</div>
          <h3 style={styles.featureTitle}>Impact</h3>
          <p style={styles.featureDesc}>
            See how your learning is making a difference in communities around the world.
          </p>
          <button onClick={() => onNavigate("Map")} style={{ ...styles.featureBtn, color: "#f59e0b" }}>
            View Map →
          </button>
        </div>

        <div style={{ ...styles.featureCard, borderTop: "4px solid #ef4444" }}>
          <div style={styles.featureIcon}>🏆</div>
          <h3 style={styles.featureTitle}>Compete</h3>
          <p style={styles.featureDesc}>
            Join a Classroom League and compete with friends on financial literacy challenges.
          </p>
          <button onClick={() => onNavigate("Leagues")} style={{ ...styles.featureBtn, color: "#ef4444" }}>
            Join a League →
          </button>
        </div>
      </div>

      {/* CTA */}
      <div style={styles.ctaSection}>
        <button onClick={() => onNavigate("Progress")} style={styles.mainBtn}>
          🔥 View Your Progress & Achievements
        </button>
        <button onClick={() => onNavigate("Goals")} style={styles.secondaryBtn}>
          🎯 Set Financial Goals
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "4px 0 32px",
    fontFamily: "'Inter', system-ui, sans-serif",
    maxWidth: "1100px",
    margin: "0 auto",
    background: "radial-gradient(circle at top left, rgba(99,102,241,0.08), transparent 35%), radial-gradient(circle at bottom right, rgba(16,185,129,0.08), transparent 30%), #f8fafc",
    borderRadius: "24px",
    overflow: "hidden"
  },
  hero: {
    background: "linear-gradient(135deg, #312e81 0%, #4f46e5 50%, #7c3aed 100%)",
    padding: "40px 36px",
    borderRadius: "24px",
    color: "#fff",
    marginBottom: "28px",
    boxShadow: "0 16px 40px rgba(79,70,229,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    overflow: "hidden",
    position: "relative"
  },
  heroContent: { flex: 1, maxWidth: "680px" },
  heroBadge: {
    display: "inline-block",
    background: "rgba(255,255,255,0.15)",
    borderRadius: "999px",
    padding: "5px 14px",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "14px",
    border: "1px solid rgba(255,255,255,0.2)"
  },
  heroTitle: {
    fontSize: "clamp(22px, 4vw, 36px)",
    fontWeight: "900",
    margin: "0 0 12px",
    lineHeight: 1.2,
    letterSpacing: "-0.5px"
  },
  heroSubtitle: {
    fontSize: "15px",
    opacity: 0.88,
    margin: "0 0 20px",
    lineHeight: 1.6,
    maxWidth: "540px"
  },
  dailyTip: {
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "14px",
    padding: "13px 16px",
    display: "flex",
    gap: "10px",
    alignItems: "flex-start"
  },
  tipLabel: {
    fontWeight: "800",
    fontSize: "13px",
    whiteSpace: "nowrap",
    opacity: 0.9
  },
  tipText: { fontSize: "14px", opacity: 0.9, lineHeight: 1.5 },
  heroDecor: {
    fontSize: "clamp(60px, 8vw, 100px)",
    opacity: 0.15,
    flexShrink: 0,
    userSelect: "none"
  },
  cardsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginBottom: "28px"
  },
  featureCard: {
    background: "#fff",
    padding: "22px 20px",
    borderRadius: "18px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    border: "1px solid #f1f5f9"
  },
  featureIcon: { fontSize: "32px", marginBottom: "10px" },
  featureTitle: { margin: "0 0 8px", fontSize: "18px", fontWeight: "800", color: "#111827" },
  featureDesc: { color: "#64748b", fontSize: "14px", lineHeight: "1.6", margin: "0 0 14px" },
  featureBtn: {
    background: "none", border: "none",
    fontWeight: "700", cursor: "pointer",
    padding: 0, fontSize: "14px"
  },
  ctaSection: {
    display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center"
  },
  mainBtn: {
    padding: "16px 32px",
    fontSize: "15px",
    background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 8px 24px rgba(37,99,235,0.3)"
  },
  secondaryBtn: {
    padding: "16px 32px",
    fontSize: "15px",
    background: "#fff",
    color: "#2563eb",
    border: "2px solid #2563eb",
    borderRadius: "14px",
    fontWeight: "800",
    cursor: "pointer"
  }
};