import React, { useEffect, useRef, useMemo, useState } from "react";
import ProgressBar from "../components/ProgressBar";
import BudgetTracker from "../components/BudgetTracker";
import LatteFactorCalculator from "../components/LatteFactorCalculator";
import SubscriptionAudit from "../components/SubscriptionAudit";
import PricePerUseTracker from "../components/PricePerUseTracker";

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

// --- Inline Tool Card Wrapper ---
const ToolCard = ({ icon, title, color, children }) => (
  <div style={{
    background: "#fff",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
  }}>
    <div style={{
      display: "flex", alignItems: "center", gap: "10px",
      padding: "16px 20px",
      borderBottom: "1px solid #f1f5f9",
      background: color || "#f8fafc"
    }}>
      <span style={{ fontSize: "20px" }}>{icon}</span>
      <span style={{ fontWeight: "800", fontSize: "15px", color: "#1e293b" }}>{title}</span>
    </div>
    <div style={{ padding: "20px" }}>
      {children}
    </div>
  </div>
);

// ─────────────────────────────────────────────
// FINANCIAL MOOD JOURNAL — redesigned
// ─────────────────────────────────────────────
const MOODS = [
  { emoji: "😰", label: "Stressed",  value: 1, color: "#fee2e2", text: "#b91c1c" },
  { emoji: "😟", label: "Worried",   value: 2, color: "#fef3c7", text: "#92400e" },
  { emoji: "😐", label: "Neutral",   value: 3, color: "#e0f2fe", text: "#0369a1" },
  { emoji: "🙂", label: "Good",      value: 4, color: "#dcfce7", text: "#166534" },
  { emoji: "😄", label: "Great",     value: 5, color: "#d1fae5", text: "#065f46" },
];

function FinancialMoodJournal() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [amount, setAmount]             = useState("");
  const [note, setNote]                 = useState("");
  const [entries, setEntries]           = useState([]);
  const [view, setView]                 = useState("log"); // "log" | "history"

  const handleLog = () => {
    if (!selectedMood) return;
    const entry = {
      id: Date.now(),
      mood: selectedMood,
      amount: parseFloat(amount) || 0,
      note: note.trim(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
    setEntries(prev => [entry, ...prev]);
    setSelectedMood(null);
    setAmount("");
    setNote("");
    setView("history");
  };

  const avgMood = entries.length
    ? (entries.reduce((s, e) => s + e.mood.value, 0) / entries.length).toFixed(1)
    : null;
  const totalSpent = entries.reduce((s, e) => s + e.amount, 0);
  const topMood = entries.length
    ? MOODS.reduce((best, m) => {
        const count = entries.filter(e => e.mood.value === m.value).length;
        return count > best.count ? { ...m, count } : best;
      }, { count: 0 })
    : null;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Tab toggle */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {["log", "history"].map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              padding: "8px 20px", borderRadius: "999px", border: "none",
              fontWeight: "700", fontSize: "13px", cursor: "pointer",
              background: view === v ? "#2563eb" : "#f1f5f9",
              color: view === v ? "#fff" : "#64748b",
              transition: "all 0.15s"
            }}
          >
            {v === "log" ? "📝 Log Mood" : `📋 History (${entries.length})`}
          </button>
        ))}
      </div>

      {view === "log" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Mood picker */}
          <div style={{
            background: "#f8fafc", borderRadius: "16px", padding: "16px 20px",
            border: "1px solid #e2e8f0"
          }}>
            <p style={{ margin: "0 0 12px", fontWeight: "700", fontSize: "14px", color: "#374151" }}>
              How do you feel about money today?
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
              {MOODS.map(m => (
                <button
                  key={m.value}
                  onClick={() => setSelectedMood(m)}
                  style={{
                    flex: 1,
                    padding: "12px 6px",
                    borderRadius: "14px",
                    border: selectedMood?.value === m.value
                      ? `2px solid ${m.text}`
                      : "2px solid transparent",
                    background: selectedMood?.value === m.value ? m.color : "#fff",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.15s",
                    boxShadow: selectedMood?.value === m.value
                      ? `0 2px 8px rgba(0,0,0,0.1)`
                      : "0 1px 3px rgba(0,0,0,0.06)"
                  }}
                >
                  <div style={{ fontSize: "26px", marginBottom: "4px" }}>{m.emoji}</div>
                  <div style={{
                    fontSize: "10px", fontWeight: "700",
                    color: selectedMood?.value === m.value ? m.text : "#94a3b8",
                    textTransform: "uppercase", letterSpacing: "0.4px"
                  }}>{m.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount + note side by side on wider screens, stacked on narrow */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Amount Spent ($)
              </label>
              <input
                type="number"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "11px 14px", borderRadius: "12px",
                  border: "1.5px solid #e2e8f0", fontSize: "15px",
                  fontWeight: "600", color: "#1e293b", outline: "none",
                  background: "#fff",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Category <span style={{ fontWeight: "400", color: "#94a3b8" }}>(optional)</span>
              </label>
              <select
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "11px 14px", borderRadius: "12px",
                  border: "1.5px solid #e2e8f0", fontSize: "14px",
                  color: "#1e293b", outline: "none", background: "#fff", cursor: "pointer"
                }}
                defaultValue=""
              >
                <option value="">Select category…</option>
                {["Food & Drink","Transport","Shopping","Bills","Entertainment","Healthcare","Other"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Note */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Notes <span style={{ fontWeight: "400", color: "#94a3b8" }}>(optional)</span>
            </label>
            <textarea
              placeholder="What's on your mind about your finances today?"
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              style={{
                width: "100%", boxSizing: "border-box",
                padding: "12px 14px", borderRadius: "12px",
                border: "1.5px solid #e2e8f0", fontSize: "14px",
                color: "#374151", resize: "vertical", outline: "none",
                fontFamily: "inherit", lineHeight: "1.5"
              }}
            />
          </div>

          <button
            onClick={handleLog}
            disabled={!selectedMood}
            style={{
              padding: "13px 24px", borderRadius: "14px", border: "none",
              background: selectedMood ? "#2563eb" : "#cbd5e1",
              color: "#fff", fontWeight: "800", fontSize: "15px", cursor: selectedMood ? "pointer" : "not-allowed",
              transition: "all 0.2s", alignSelf: "flex-start",
              boxShadow: selectedMood ? "0 4px 12px rgba(37,99,235,0.25)" : "none"
            }}
          >
            Log Entry ✓
          </button>
        </div>
      )}

      {view === "history" && (
        <div>
          {/* Summary stats */}
          {entries.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "20px" }}>
              {[
                { label: "Avg Mood", value: avgMood ? `${avgMood}/5` : "—", sub: topMood?.count ? `${topMood.emoji} most common` : "", bg: "#eff6ff" },
                { label: "Total Logged", value: `$${totalSpent.toFixed(2)}`, sub: `across ${entries.length} entries`, bg: "#f0fdf4" },
                { label: "Entries", value: entries.length, sub: "mood logs", bg: "#faf5ff" },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, borderRadius: "14px", padding: "14px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>{s.label}</div>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: "#1e293b" }}>{s.value}</div>
                  {s.sub && <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>{s.sub}</div>}
                </div>
              ))}
            </div>
          )}

          {entries.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8" }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>📓</div>
              <p style={{ fontWeight: "600", margin: 0 }}>No entries yet.</p>
              <p style={{ fontSize: "13px", margin: "6px 0 0" }}>Switch to Log Mood to add your first entry.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {entries.map(entry => (
                <div key={entry.id} style={{
                  display: "flex", alignItems: "flex-start", gap: "14px",
                  background: entry.mood.color,
                  borderRadius: "14px", padding: "14px 16px",
                  border: `1.5px solid ${entry.mood.text}22`
                }}>
                  <div style={{ fontSize: "28px", flexShrink: 0 }}>{entry.mood.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                      <span style={{ fontWeight: "800", fontSize: "14px", color: entry.mood.text }}>{entry.mood.label}</span>
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>{entry.date} · {entry.time}</span>
                    </div>
                    {entry.amount > 0 && (
                      <div style={{ fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "2px" }}>
                        💸 ${entry.amount.toFixed(2)} spent
                      </div>
                    )}
                    {entry.note && (
                      <div style={{ fontSize: "13px", color: "#475569", lineHeight: "1.5" }}>{entry.note}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// NO-SPEND DAY TRACKER — enhanced
// ─────────────────────────────────────────────
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function NoSpendDayTracker() {
  const today = new Date();
  const year  = today.getFullYear();
  const month = today.getMonth();

  const [currentMonth, setCurrentMonth] = useState(month);
  const [currentYear, setCurrentYear]   = useState(year);
  const [noSpendDays, setNoSpendDays]   = useState({}); // key: "YYYY-MM-DD", value: true/false
  const [goal, setGoal]                 = useState(8);
  const [editingGoal, setEditingGoal]   = useState(false);
  const [tempGoal, setTempGoal]         = useState(8);
  const [streak, setStreak]             = useState(0);

  // Recalculate streak whenever noSpendDays changes
  useEffect(() => {
    let s = 0;
    const d = new Date();
    while (true) {
      const key = d.toISOString().slice(0, 10);
      if (noSpendDays[key]) { s++; d.setDate(d.getDate() - 1); }
      else break;
    }
    setStreak(s);
  }, [noSpendDays]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const monthName = new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" });

  const noSpendCount = Object.entries(noSpendDays).filter(([k, v]) => {
    const d = new Date(k);
    return v && d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  }).length;

  const progress = Math.min(noSpendCount / goal, 1);

  const toggleDay = (dayNum) => {
    const key = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    setNoSpendDays(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isNoSpend = (dayNum) => {
    const key = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    return !!noSpendDays[key];
  };

  const isToday = (dayNum) => (
    dayNum === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
  );

  const isFuture = (dayNum) => {
    const d = new Date(currentYear, currentMonth, dayNum);
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d > todayMidnight;
  };

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  // Monthly summary for all tracked months
  const allMonthKeys = [...new Set(
    Object.keys(noSpendDays).filter(k => noSpendDays[k]).map(k => k.slice(0, 7))
  )].sort();

  const motivationalMsg = () => {
    if (noSpendCount === 0) return "Start marking your no-spend days!";
    if (noSpendCount < goal * 0.4) return "Good start — keep going!";
    if (noSpendCount < goal * 0.7) return "You're building momentum 💪";
    if (noSpendCount < goal) return "Almost there — so close!";
    return `🎉 Goal smashed! ${noSpendCount} no-spend days!`;
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>

      {/* Top stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "18px" }}>
        <div style={{ background: "#f0fdf4", borderRadius: "14px", padding: "14px", border: "1px solid #bbf7d0", textAlign: "center" }}>
          <div style={{ fontSize: "26px", fontWeight: "900", color: "#16a34a" }}>{noSpendCount}</div>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#4ade80", textTransform: "uppercase", letterSpacing: "0.5px" }}>This Month</div>
        </div>
        <div style={{ background: "#fff7ed", borderRadius: "14px", padding: "14px", border: "1px solid #fed7aa", textAlign: "center" }}>
          <div style={{ fontSize: "26px", fontWeight: "900", color: "#ea580c" }}>{streak} 🔥</div>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#fb923c", textTransform: "uppercase", letterSpacing: "0.5px" }}>Day Streak</div>
        </div>
        <div
          style={{ background: "#eff6ff", borderRadius: "14px", padding: "14px", border: "1px solid #bfdbfe", textAlign: "center", cursor: "pointer" }}
          onClick={() => { setEditingGoal(true); setTempGoal(goal); }}
          title="Click to change goal"
        >
          <div style={{ fontSize: "26px", fontWeight: "900", color: "#2563eb" }}>{goal}</div>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.5px" }}>Monthly Goal ✏️</div>
        </div>
      </div>

      {/* Goal edit modal (inline) */}
      {editingGoal && (
        <div style={{
          background: "#f0f9ff", borderRadius: "14px", padding: "16px",
          border: "1.5px solid #bae6fd", marginBottom: "16px",
          display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap"
        }}>
          <span style={{ fontWeight: "700", fontSize: "14px", color: "#0369a1" }}>Set monthly goal:</span>
          <input
            type="number" min="1" max={daysInMonth} value={tempGoal}
            onChange={e => setTempGoal(Number(e.target.value))}
            style={{
              width: "70px", padding: "8px 10px", borderRadius: "10px",
              border: "1.5px solid #7dd3fc", fontSize: "16px", fontWeight: "700",
              textAlign: "center", outline: "none"
            }}
          />
          <span style={{ fontSize: "13px", color: "#64748b" }}>days per month</span>
          <button onClick={() => { setGoal(tempGoal); setEditingGoal(false); }}
            style={{ padding: "8px 16px", borderRadius: "10px", border: "none", background: "#2563eb", color: "#fff", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}>
            Save
          </button>
          <button onClick={() => setEditingGoal(false)}
            style={{ padding: "8px 14px", borderRadius: "10px", border: "none", background: "#f1f5f9", color: "#64748b", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}>
            Cancel
          </button>
        </div>
      )}

      {/* Progress bar */}
      <div style={{ marginBottom: "18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#374151" }}>{motivationalMsg()}</span>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "#94a3b8" }}>{noSpendCount}/{goal} days</span>
        </div>
        <div style={{ height: "10px", background: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${progress * 100}%`,
            background: progress >= 1 ? "#10b981" : "#2563eb",
            borderRadius: "999px",
            transition: "width 0.4s ease"
          }} />
        </div>
      </div>

      {/* Calendar nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <button onClick={prevMonth} style={navBtnStyle}>‹</button>
        <span style={{ fontWeight: "800", fontSize: "16px", color: "#1e293b" }}>{monthName} {currentYear}</span>
        <button onClick={nextMonth} style={navBtnStyle}>›</button>
      </div>

      {/* Day-of-week header */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "4px" }}>
        {DAY_LABELS.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "10px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", padding: "4px 0" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
            {week.map((day, di) => {
              if (!day) return <div key={`empty-${di}`} />;
              const ns = isNoSpend(day);
              const tod = isToday(day);
              const fut = isFuture(day);
              return (
                <button
                  key={day}
                  onClick={() => !fut && toggleDay(day)}
                  disabled={fut}
                  title={fut ? "Future day" : ns ? "Click to unmark" : "Click to mark as no-spend"}
                  style={{
                    aspectRatio: "1",
                    borderRadius: "10px",
                    border: tod ? "2px solid #2563eb" : "1.5px solid transparent",
                    background: ns ? "#16a34a" : fut ? "#f8fafc" : "#f1f5f9",
                    color: ns ? "#fff" : fut ? "#cbd5e1" : "#374151",
                    fontWeight: tod ? "900" : "600",
                    fontSize: "13px",
                    cursor: fut ? "not-allowed" : "pointer",
                    transition: "all 0.15s",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative"
                  }}
                >
                  {day}
                  {ns && (
                    <span style={{
                      position: "absolute", bottom: "2px", left: "50%", transform: "translateX(-50%)",
                      fontSize: "7px"
                    }}>✓</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <p style={{ fontSize: "11px", color: "#94a3b8", textAlign: "center", marginTop: "10px", marginBottom: "0" }}>
        Tap any past or current day to toggle no-spend ✓ · Green = no-spend day
      </p>

      {/* Savings estimate */}
      <div style={{
        marginTop: "20px", background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
        borderRadius: "16px", padding: "16px", border: "1px solid #bbf7d0"
      }}>
        <h4 style={{ margin: "0 0 10px", fontSize: "14px", fontWeight: "800", color: "#166534" }}>
          💰 Estimated Savings
        </h4>
        <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#4b5563", lineHeight: "1.5" }}>
          If you typically spend <strong>$30</strong> on small purchases daily, your {noSpendCount} no-spend days this month saved you approximately:
        </p>
        <div style={{ fontSize: "28px", fontWeight: "900", color: "#16a34a" }}>
          ${(noSpendCount * 30).toFixed(2)}
        </div>
        <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#86efac" }}>
          Based on $30/day average discretionary spend · Adjust in settings
        </p>
      </div>

      {/* History summary across months */}
      {allMonthKeys.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h4 style={{ margin: "0 0 10px", fontSize: "14px", fontWeight: "800", color: "#374151" }}>📅 Monthly History</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {allMonthKeys.slice(-4).reverse().map(mk => {
              const [y, m] = mk.split("-").map(Number);
              const count  = Object.entries(noSpendDays).filter(([k, v]) => v && k.startsWith(mk)).length;
              const label  = new Date(y, m - 1).toLocaleString("default", { month: "long", year: "numeric" });
              const pct    = Math.min(count / goal, 1);
              return (
                <div key={mk} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#475569", width: "120px", flexShrink: 0 }}>{label}</span>
                  <div style={{ flex: 1, height: "8px", background: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct * 100}%`, background: pct >= 1 ? "#10b981" : "#60a5fa", borderRadius: "999px" }} />
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#374151", width: "30px", textAlign: "right" }}>{count}d</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tips */}
      <div style={{ marginTop: "20px", background: "#fefce8", borderRadius: "16px", padding: "16px", border: "1px solid #fef08a" }}>
        <h4 style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: "800", color: "#854d0e" }}>💡 Tips for No-Spend Days</h4>
        <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "#713f12", lineHeight: "1.8" }}>
          <li>Meal prep on weekends to avoid food spending during the week</li>
          <li>Delete shopping apps on no-spend days to reduce temptation</li>
          <li>Plan free activities: walks, library, free events</li>
          <li>Use cashback or rewards points if you must buy something</li>
        </ul>
      </div>
    </div>
  );
}

const navBtnStyle = {
  width: "34px", height: "34px", borderRadius: "10px",
  border: "1.5px solid #e2e8f0", background: "#fff",
  fontSize: "18px", cursor: "pointer", display: "flex",
  alignItems: "center", justifyContent: "center",
  color: "#374151", fontWeight: "700"
};

// Tool Tab definitions
const TOOL_TABS = [
  { id: "budget",    label: "Budget",       icon: "📊" },
  { id: "latte",     label: "Latte Factor", icon: "☕" },
  { id: "subs",      label: "Subscriptions",icon: "📦" },
  { id: "ppu",       label: "Price/Use",    icon: "🏷️" },
  { id: "nospend",   label: "No-Spend Days",icon: "🚫" },
  { id: "mood",      label: "Mood Journal", icon: "📓" },
];

function FinancialToolsPanel() {
  const [activeTab, setActiveTab] = useState("budget");

  return (
    <div style={{ marginTop: "26px" }}>
      {/* Tab bar */}
      <div style={{
        display: "flex", gap: "8px", overflowX: "auto",
        paddingBottom: "4px", marginBottom: "16px",
        scrollbarWidth: "none"
      }}>
        {TOOL_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flexShrink: 0,
              padding: "9px 16px",
              borderRadius: "999px",
              border: "none",
              fontWeight: "700",
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.18s",
              background: activeTab === tab.id ? "#2563eb" : "#f1f5f9",
              color: activeTab === tab.id ? "#fff" : "#475569",
              boxShadow: activeTab === tab.id ? "0 2px 8px rgba(37,99,235,0.18)" : "none"
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Active panel */}
      <div>
        {activeTab === "budget" && (
          <ToolCard icon="📊" title="Budget Tracker" color="#eff6ff">
            <BudgetTracker />
          </ToolCard>
        )}
        {activeTab === "latte" && (
          <ToolCard icon="☕" title="Latte Factor Calculator" color="#fefce8">
            <LatteFactorCalculator />
          </ToolCard>
        )}
        {activeTab === "subs" && (
          <ToolCard icon="📦" title="Subscription Audit" color="#f0fdf4">
            <SubscriptionAudit />
          </ToolCard>
        )}
        {activeTab === "ppu" && (
          <ToolCard icon="🏷️" title="Price Per Use Tracker" color="#faf5ff">
            <PricePerUseTracker />
          </ToolCard>
        )}
        {activeTab === "nospend" && (
          <ToolCard icon="🚫" title="No-Spend Day Tracker" color="#fff7ed">
            <NoSpendDayTracker />
          </ToolCard>
        )}
        {activeTab === "mood" && (
          <ToolCard icon="📓" title="Financial Mood Journal" color="#fdf2f8">
            <FinancialMoodJournal />
          </ToolCard>
        )}
      </div>
    </div>
  );
}

export default function ProgressScreen({
  coursesCompleted = 0,
  gameWins = 0,
  gamesPlayed = 0,
  xp = 0,
  streak = 0,
  userTier = "adult",
  userId,
  achievements = [],
  updateData,
  onAchievementUnlocked,
  onNavigate
}) {
  const currentLevel = Math.floor(xp / 1000) + 1;
  const xpIntoLevel = xp % 1000;
  const levelProgress = xpIntoLevel / 1000;

  const storageKey = `paidforward-progress-achievements-${userId || 'guest'}`;
  const poppedRef = useRef(new Set());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        JSON.parse(saved).forEach((id) => poppedRef.current.add(id));
      }
    } catch {
      // ignore storage failures
    }
  }, [storageKey]);

  useEffect(() => {
    achievements.forEach((id) => poppedRef.current.add(id));
  }, [achievements]);

  const stats = useMemo(() => ({ coursesCompleted, gameWins, gamesPlayed, xp, streak }), [coursesCompleted, gameWins, gamesPlayed, xp, streak]);

  useEffect(() => {
    if (!updateData || !onAchievementUnlocked) return;

    const newlyUnlocked = ACHIEVEMENT_DEFS.filter(
      (def) => def.check(stats) && !achievements.includes(def.id) && !poppedRef.current.has(def.id)
    );

    if (newlyUnlocked.length === 0) return;

    const newIds = newlyUnlocked.map((a) => a.id);
    const updated = [...achievements, ...newIds];

    updateData({ achievements: updated });

    newlyUnlocked.forEach((a, i) => {
      poppedRef.current.add(a.id);
      setTimeout(() => {
        onAchievementUnlocked(`${a.icon} ${a.title} unlocked!`);
      }, i * 1200);
    });

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(Array.from(poppedRef.current)));
      } catch {
        // ignore storage failures
      }
    }
  }, [xp, gamesPlayed, gameWins, coursesCompleted, streak, achievements, updateData, onAchievementUnlocked, storageKey, stats]);

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
    <div style={styles.outerWrapper}>
      <div style={styles.bgLayer} />
      <div style={{ padding: "10px", fontFamily: "'Inter', system-ui, sans-serif", position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto" }}>

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
            <h4 style={styles.statLabel}>Streak</h4>
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

        {/* Savings & Goal Planning */}
        <div style={styles.goalsSection}>
          <div style={styles.goalsHeader}>
            <div>
              <h3 style={styles.goalsTitle}>🎯 Savings & Goal Planning</h3>
              <p style={styles.goalsSubtitle}>
                Your progress now includes goal ideas and planning notes to help you save smarter.
              </p>
            </div>
            {onNavigate && (
              <button style={styles.goalsButton} onClick={() => onNavigate('Goals')}>
                Open Goal Planner
              </button>
            )}
          </div>
          <div style={styles.goalsGrid}>
            <div style={styles.goalCardSmall}>
              <strong>Emergency Fund</strong>
              <p>Save a small amount each week until you have 3-6 months of living costs covered.</p>
            </div>
            <div style={styles.goalCardSmall}>
              <strong>Retirement Habit</strong>
              <p>Commit to automatic saving so your future self gets a steady boost over time.</p>
            </div>
            <div style={styles.goalCardSmall}>
              <strong>Investment Idea</strong>
              <p>Consider a diversified low-cost ETF or index fund to start growing your excess cash.</p>
            </div>
          </div>
        </div>

        {/* Financial Tools — tabbed panel */}
        <div style={{ marginTop: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <h3 style={{ margin: 0, fontSize: "18px", color: "#1e293b" }}>🛠️ Financial Tools</h3>
            <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>Select a tool below</span>
          </div>
          <FinancialToolsPanel />
        </div>

      </div>
    </div>
  );
}

const styles = {
  outerWrapper: { position: 'relative', minHeight: '100vh', margin: '-24px', padding: '24px', background: 'linear-gradient(160deg, #f0f0ff 0%, #e8f5f0 30%, #fff8e8 60%, #fff0f0 100%)', fontFamily: "'Inter', system-ui, sans-serif" },
  bgLayer: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 10% 10%, rgba(99,102,241,0.12) 0%, transparent 50%), radial-gradient(ellipse at 90% 80%, rgba(16,185,129,0.1) 0%, transparent 50%)', pointerEvents: 'none', zIndex: 0 },
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
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)", border: "1px solid #f1f5f9",
    marginBottom: "24px"
  },
  achieveCount: {
    background: "#e0e7ff", color: "#3730a3",
    borderRadius: "999px", padding: "4px 12px",
    fontSize: "12px", fontWeight: "700"
  },
  categoryLabel: {
    fontSize: "13px", fontWeight: "700", color: "#475569",
    marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px"
  },
  goalsSection: {
    marginBottom: "6px", background: "#f8fafc", borderRadius: "20px", padding: "22px", border: "1px solid #e2e8f0"
  },
  goalsHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "18px"
  },
  goalsTitle: { margin: 0, fontSize: "18px", color: "#111827" },
  goalsSubtitle: { margin: "6px 0 0", color: "#475569", fontSize: "14px", lineHeight: "1.6", maxWidth: "560px" },
  goalsButton: {
    padding: "12px 16px", borderRadius: "14px", border: "none", background: "#2563eb", color: "#fff", cursor: "pointer", fontWeight: "700", fontSize: "14px"
  },
  goalsGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px"
  },
  goalCardSmall: {
    background: "#fff", borderRadius: "18px", padding: "18px", border: "1px solid #e2e8f0", color: "#1f2937", lineHeight: "1.6"
  }
};
