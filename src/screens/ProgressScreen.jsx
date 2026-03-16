import React, { useEffect, useRef } from "react";
import ProgressBar from "../components/ProgressBar";

const ACHIEVEMENT_DEFS = [
  {
    id: "early_bird",
    icon: "🌱",
    title: "Early Bird",
    requirement: "Complete your first course",
    color: "#dcfce7",
    check: ({ coursesCompleted }) => coursesCompleted >= 1,
    category: "courses"
  },
  {
    id: "scholar",
    icon: "🎓",
    title: "Scholar",
    requirement: "Complete all 3 courses",
    color: "#e0f2fe",
    check: ({ coursesCompleted }) => coursesCompleted >= 3,
    category: "courses"
  },
  {
    id: "game_on",
    icon: "🎮",
    title: "Game On",
    requirement: "Play your first game",
    color: "#fef3c7",
    check: ({ gamesPlayed }) => gamesPlayed >= 1,
    category: "games"
  },
  {
    id: "winner",
    icon: "🏆",
    title: "Champion",
    requirement: "Win your first game",
    color: "#e0e7ff",
    check: ({ gameWins }) => gameWins >= 1,
    category: "games"
  },
  {
    id: "high_roller",
    icon: "🎲",
    title: "High Roller",
    requirement: "Win 5 games",
    color: "#fce7f3",
    check: ({ gameWins }) => gameWins >= 5,
    category: "games"
  },
  {
    id: "xp_master",
    icon: "💎",
    title: "XP Master",
    requirement: "Earn 1500 XP",
    color: "#fae8ff",
    check: ({ xp }) => xp >= 1500,
    category: "xp"
  },
  {
    id: "streak_3",
    icon: "🔥",
    title: "On Fire",
    requirement: "Log in 3 days in a row",
    color: "#ffedd5",
    check: ({ streak }) => streak >= 3,
    category: "streak"
  },
  {
    id: "streak_7",
    icon: "⚡",
    title: "Unstoppable",
    requirement: "Log in 7 days in a row",
    color: "#fef9c3",
    check: ({ streak }) => streak >= 7,
    category: "streak"
  }
];

const AchievementBadge = ({ icon, title, requirement, achieved, color }) => (
  <div
    style={{
      minWidth: "120px",
      padding: "16px 12px",
      borderRadius: "16px",
      background: color,
      textAlign: "center",
      border: "1px solid rgba(0,0,0,0.05)",
      opacity: achieved ? 1 : 0.45,
      filter: achieved ? "none" : "grayscale(80%)",
      position: "relative",
      flexShrink: 0,
      transition: "opacity 0.3s"
    }}
    title={achieved ? `Unlocked: ${requirement}` : `Locked: ${requirement}`}
  >
    <div style={{ fontSize: "32px", marginBottom: "6px" }}>{icon}</div>
    <div style={{ fontSize: "12px", fontWeight: "800", color: "#1e293b" }}>{title}</div>
    <div style={{ fontSize: "10px", color: "#475569", marginTop: "4px", lineHeight: 1.4 }}>{requirement}</div>
    {achieved && (
      <div style={{
        position: "absolute", top: "8px", right: "8px",
        width: "18px", height: "18px", borderRadius: "50%",
        background: "#10b981", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "11px", fontWeight: "800"
      }}>✓</div>
    )}
    {!achieved && (
      <div style={{
        position: "absolute", top: "8px", right: "8px",
        width: "18px", height: "18px", borderRadius: "50%",
        background: "#94a3b8", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "11px"
      }}>🔒</div>
    )}
  </div>
);

export default function ProgressScreen({
  coursesCompleted = 0,
  gameWins = 0,
  gamesPlayed = 0,
  xp = 0,
  streak = 0,
  userTier = "adult",
  userId,
  db,
  achievements = [],
  updateData,
  onAchievementUnlocked
}) {
  const currentLevel = Math.floor(xp / 1000) + 1;
  const xpIntoLevel = xp % 1000;
  const levelProgress = xpIntoLevel / 1000;

  // Track which achievements have already been popped so we don't re-pop on re-render
  const poppedRef = useRef(new Set(achievements));

  const stats = { coursesCompleted, gameWins, gamesPlayed, xp, streak };

  useEffect(() => {
    if (!updateData || !onAchievementUnlocked) return;

    const newlyUnlocked = ACHIEVEMENT_DEFS.filter(
      (def) => def.check(stats) && !achievements.includes(def.id)
    );

    if (newlyUnlocked.length === 0) return;

    const newIds = newlyUnlocked.map((a) => a.id);
    const updated = [...achievements, ...newIds];

    // Save to Firestore (account-scoped)
    updateData({ achievements: updated });

    // Show popup for each new achievement with slight delay between them
    newlyUnlocked.forEach((a, i) => {
      if (!poppedRef.current.has(a.id)) {
        poppedRef.current.add(a.id);
        setTimeout(() => {
          onAchievementUnlocked(`${a.icon} ${a.title} unlocked!`);
        }, i * 1200);
      }
    });
  }, [xp, gamesPlayed, gameWins, coursesCompleted, streak]);

  const achievementList = ACHIEVEMENT_DEFS.map((def) => ({
    ...def,
    achieved: achievements.includes(def.id) || def.check(stats)
  }));

  const unlockedCount = achievementList.filter((a) => a.achieved).length;

  const categoryLabels = {
    courses: "📚 Courses",
    games: "🎮 Games",
    xp: "💎 XP",
    streak: "🔥 Streaks"
  };

  const grouped = {};
  achievementList.forEach((a) => {
    if (!grouped[a.category]) grouped[a.category] = [];
    grouped[a.category].push(a);
  });

  return (
    <div style={{ padding: "10px", fontFamily: "'Inter', system-ui, sans-serif", position: "relative" }}>
      {/* Level header */}
      <div style={styles.levelCard}>
        <div style={styles.levelBadge}>LVL {currentLevel}</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, color: "#fff", fontSize: "22px" }}>
            {userTier === "elementary" ? "⭐ Junior Builder" : "💼 Wealth Builder"}
          </h2>
          <p style={{ color: "#e0f2fe", margin: "6px 0 8px", fontSize: "14px" }}>
            {xpIntoLevel} / 1000 XP to Level {currentLevel + 1}
          </p>
          <ProgressBar progress={levelProgress} />
        </div>
      </div>

      {/* Stats grid */}
      <div style={styles.grid}>
        <div style={{ ...styles.statCard, background: "#ebf8ff" }}>
          <span style={styles.icon}>🎓</span>
          <h4 style={styles.statLabel}>Courses Completed</h4>
          <h2 style={styles.statValue}>{coursesCompleted} / 3</h2>
        </div>
        <div style={{ ...styles.statCard, background: "#f0f4ff" }}>
          <span style={styles.icon}>🎮</span>
          <h4 style={styles.statLabel}>Games Played</h4>
          <h2 style={styles.statValue}>{gamesPlayed}</h2>
        </div>
        <div style={{ ...styles.statCard, background: "#fff0f6" }}>
          <span style={styles.icon}>🏆</span>
          <h4 style={styles.statLabel}>Game Wins</h4>
          <h2 style={styles.statValue}>{gameWins}</h2>
        </div>
        <div style={{ ...styles.statCard, background: "#f0fdf4" }}>
          <span style={styles.icon}>💎</span>
          <h4 style={styles.statLabel}>Total XP</h4>
          <h2 style={styles.statValue}>{xp}</h2>
        </div>
        <div style={{ ...styles.statCard, background: "#fffaf0" }}>
          <span style={styles.icon}>🔥</span>
          <h4 style={styles.statLabel}>Day Streak</h4>
          <h2 style={styles.statValue}>{streak}</h2>
        </div>
      </div>

      {/* Achievements */}
      <div style={styles.badgeSection}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <h3 style={{ margin: 0, fontSize: "18px" }}>🏅 Achievements</h3>
          <span style={styles.achieveCount}>{unlockedCount}/{achievementList.length} unlocked</span>
        </div>

        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} style={{ marginBottom: "20px" }}>
            <div style={styles.categoryLabel}>{categoryLabels[cat] || cat}</div>
            <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
              {items.map((a) => (
                <AchievementBadge
                  key={a.id}
                  icon={a.icon}
                  title={a.title}
                  requirement={a.requirement}
                  achieved={a.achieved}
                  color={a.color}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  levelCard: {
    background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
    padding: "28px", borderRadius: "20px",
    display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px"
  },
  levelBadge: {
    width: "70px", height: "70px", borderRadius: "50%",
    background: "#fff", color: "#1e3a8a",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "18px", fontWeight: "900", boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    flexShrink: 0
  },
  grid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
    gap: "16px", marginBottom: "24px"
  },
  statCard: { padding: "18px", borderRadius: "16px", textAlign: "center" },
  icon: { fontSize: "24px", display: "block", marginBottom: "6px" },
  statLabel: { margin: 0, fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: "700" },
  statValue: { margin: "6px 0 0 0", fontSize: "26px", color: "#1e293b", fontWeight: "800" },
  badgeSection: {
    background: "#fff", padding: "24px", borderRadius: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)", border: "1px solid #f1f5f9"
  },
  achieveCount: {
    background: "#e0e7ff", color: "#3730a3",
    borderRadius: "999px", padding: "4px 12px",
    fontSize: "12px", fontWeight: "700"
  },
  categoryLabel: {
    fontSize: "13px", fontWeight: "700", color: "#475569",
    marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px"
  }
};