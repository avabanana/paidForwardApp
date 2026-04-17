import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp
} from "firebase/firestore";

const CHALLENGE_POOL = [
  {
    question: "📦 You want to buy new sneakers for $120 but your rent is due next week. What do you do?",
    options: [
      { label: "Buy the sneakers now", points: -10, feedback: "Risky move — rent is a necessity!" },
      { label: "Wait until after rent is paid", points: 20, feedback: "Smart! Needs before wants." },
      { label: "Put it on a credit card", points: -5, feedback: "Interest adds up fast." },
      { label: "Look for cheaper alternatives", points: 15, feedback: "Great budgeting instinct!" }
    ]
  },
  {
    question: "💳 You get a $500 bonus at work. How do you handle it?",
    options: [
      { label: "Spend it all on a celebration", points: -5, feedback: "Fun, but not financially wise." },
      { label: "Save 50%, spend 50%", points: 20, feedback: "Balanced approach — well done!" },
      { label: "Put it all in savings", points: 25, feedback: "Maximum points for max saving!" },
      { label: "Use it to pay off debt", points: 22, feedback: "Reducing debt is always smart." }
    ]
  },
  {
    question: "🛒 Your friend says a luxury item is 'on sale' and you should grab it. What do you do?",
    options: [
      { label: "Buy it immediately", points: -10, feedback: "A sale doesn't mean you need it." },
      { label: "Check if it's in your budget first", points: 25, feedback: "Always check your budget!" },
      { label: "Ask if you actually need it", points: 20, feedback: "Great critical thinking." },
      { label: "Ignore the sale and move on", points: 10, feedback: "Discipline is powerful." }
    ]
  },
  {
    question: "📈 You have $200 to invest. Which option fits a beginner?",
    options: [
      { label: "All in on a meme stock", points: -15, feedback: "Very high risk for beginners." },
      { label: "Low-cost index fund", points: 25, feedback: "Smart, diversified choice!" },
      { label: "Buy crypto with all of it", points: -10, feedback: "Crypto is very volatile." },
      { label: "Keep it in a savings account for now", points: 15, feedback: "Safe, but you could do more." }
    ]
  },
  {
    question: "🏦 Your emergency fund covers 1 month of expenses. What's the ideal goal?",
    options: [
      { label: "1 month is enough", points: 5, feedback: "Better than nothing, but not ideal." },
      { label: "3–6 months of expenses", points: 25, feedback: "That's the financial expert recommendation!" },
      { label: "Save 12 months", points: 15, feedback: "Great but might be over-saving." },
      { label: "Don't bother with an emergency fund", points: -20, feedback: "This could be financially devastating." }
    ]
  },
  {
    question: "💸 A friend asks you to lend $300 with no repayment plan. What do you say?",
    options: [
      { label: "Sure, anytime!", points: -10, feedback: "Lending without a plan often leads to loss." },
      { label: "Only if they sign a simple agreement", points: 20, feedback: "Smart — protect yourself!" },
      { label: "Offer a smaller amount you can afford to lose", points: 15, feedback: "Reasonable compromise." },
      { label: "Politely decline", points: 10, feedback: "It's okay to protect your finances." }
    ]
  },
  {
    question: "🎓 You're deciding whether to take out a student loan. What's key?",
    options: [
      { label: "Borrow as much as offered", points: -15, feedback: "Never borrow more than you need." },
      { label: "Research interest rates and repayment", points: 25, feedback: "Knowledge is power!" },
      { label: "Only borrow what's absolutely necessary", points: 20, feedback: "Excellent discipline." },
      { label: "Avoid loans completely", points: 5, feedback: "Sometimes loans are a good investment." }
    ]
  }
];

const makeCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

export default function LeagueScreen({ currentUser, userId, db }) {
  const [myLeagueCodes, setMyLeagueCodes] = useState([]);
  const [leagues, setLeagues] = useState({});
  const [activeCode, setActiveCode] = useState(null);
  const [newLeagueName, setNewLeagueName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [message, setMessage] = useState("");
  const [savingLeague, setSavingLeague] = useState(false);
  const [joiningLeague, setJoiningLeague] = useState(false);
  const [challenge, setChallenge] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [lastAnswer, setLastAnswer] = useState(null);
  const [competitionQ, setCompetitionQ] = useState(null);

  // Load user's league memberships from Firestore
  useEffect(() => {
    if (!db || !userId) return;
    const userRef = doc(db, "users", userId);
    const unsub = onSnapshot(userRef, (snap) => {
      const data = snap.data() || {};
      setMyLeagueCodes(data.leagueCodes || []);
    });
    return () => unsub();
  }, [db, userId]);

  // Subscribe to each league the user belongs to
  useEffect(() => {
    if (!db || myLeagueCodes.length === 0) return;
    const unsubs = myLeagueCodes.map((code) => {
      const ref = doc(db, "leagues", code);
      return onSnapshot(ref, (snap) => {
        if (snap.exists()) {
          setLeagues((prev) => ({ ...prev, [code]: { id: snap.id, ...snap.data() } }));
        }
      });
    });
    return () => unsubs.forEach((u) => u());
  }, [db, myLeagueCodes]);

  // Pick a daily challenge
  useEffect(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const idx = todayKey.split("-").reduce((a, b) => a + parseInt(b), 0) % CHALLENGE_POOL.length;
    setChallenge(CHALLENGE_POOL[idx]);
    const compIdx = (idx + 1) % CHALLENGE_POOL.length;
    setCompetitionQ(CHALLENGE_POOL[compIdx]);
  }, []);

  const activeLeague = activeCode ? leagues[activeCode] : null;

  const createLeague = async () => {
    if (!newLeagueName.trim()) {
      setMessage("Please type a league name before creating one.");
      return;
    }
    if (!db || !userId) {
      setMessage("Unable to create league. Please sign in again.");
      return;
    }

    setSavingLeague(true);
    setMessage("Creating your league…");

    try {
      const code = makeCode();
      const leagueData = {
        code,
        name: newLeagueName.trim(),
        createdBy: currentUser,
        createdAt: serverTimestamp(),
        members: {
          [userId]: { name: currentUser, score: 0, answered: 0 }
        }
      };
      await setDoc(doc(db, "leagues", code), leagueData);
      const userRef = doc(db, "users", userId);
      const snap = await getDoc(userRef);
      const existing = snap.data()?.leagueCodes || [];
      await updateDoc(userRef, { leagueCodes: [...existing, code] });
      setNewLeagueName("");
      setActiveCode(code);
      setMessage(`✅ League created! Share code: ${code}`);
    } catch (err) {
      setMessage(err.message || "Could not create league. Try again.");
    } finally {
      setSavingLeague(false);
    }
  };

  const joinLeague = async () => {
    const code = joinCode.trim().toUpperCase();
    if (!code) {
      setMessage("Please enter a league code.");
      return;
    }
    if (!db || !userId) {
      setMessage("Unable to join league. Please sign in again.");
      return;
    }

    setJoiningLeague(true);
    setMessage("Checking league code…");

    try {
      const ref = doc(db, "leagues", code);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        setMessage("❌ League not found. Check the code.");
        return;
      }
      const data = snap.data();
      if (!data.members?.[userId]) {
        await updateDoc(ref, {
          [`members.${userId}`]: { name: currentUser, score: 0, answered: 0 }
        });
      }
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      const existing = userSnap.data()?.leagueCodes || [];
      if (!existing.includes(code)) {
        await updateDoc(userRef, { leagueCodes: [...existing, code] });
      }
      setJoinCode("");
      setActiveCode(code);
      setMessage(`🎉 Joined league: ${data.name}!`);
    } catch (err) {
      setMessage(err.message || "Could not join league. Please try again.");
    } finally {
      setJoiningLeague(false);
    }
  };

  const answerChallenge = async (option) => {
    if (answered || !activeLeague || !db) return;
    setAnswered(true);
    setLastAnswer(option);
    const ref = doc(db, "leagues", activeCode);
    const current = activeLeague.members?.[userId] || { score: 0, answered: 0 };
    await updateDoc(ref, {
      [`members.${userId}.name`]: currentUser,
      [`members.${userId}.score`]: (current.score || 0) + option.points,
      [`members.${userId}.answered`]: (current.answered || 0) + 1
    });
  };

  const leaderboard = useMemo(() => {
    if (!activeLeague?.members) return [];
    return Object.entries(activeLeague.members)
      .map(([key, data]) => ({
        key,
        name: data?.name || key,
        score: data?.score || 0,
        answered: data?.answered || 0
      }))
      .sort((a, b) => b.score - a.score);
  }, [activeLeague]);

  const memberCount = activeLeague ? Object.keys(activeLeague.members).length : 0;
  const hasCompetition = memberCount > 1;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🏆 Classroom Leagues</h2>
      <p style={styles.sub}>
        Compete with friends on personal finance knowledge. Answer daily challenges, climb the leaderboard!
      </p>

      <div style={styles.row}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>➕ Create a League</h3>
          <p style={styles.cardNote}>Start a new league and invite friends with your code.</p>
          <input
            style={styles.input}
            placeholder="League name (e.g. Finance Club)"
            value={newLeagueName}
            onChange={(e) => setNewLeagueName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createLeague()}
          />
          <button type="button" style={styles.button} onClick={createLeague} disabled={savingLeague}>{savingLeague ? 'Creating…' : 'Create League'}</button>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🔗 Join a League</h3>
          <p style={styles.cardNote}>Enter the 6-character code from your league organizer.</p>
          <input
            style={styles.input}
            placeholder="Enter league code (e.g. AB12CD)"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && joinLeague()}
            maxLength={6}
          />
          <button type="button" style={styles.button} onClick={joinLeague} disabled={joiningLeague}>{joiningLeague ? 'Joining…' : 'Join League'}</button>
        </div>
      </div>

      {message && <div style={styles.message}>{message}</div>}

      {myLeagueCodes.length > 0 && (
        <div style={styles.myLeagues}>
          <strong style={{ fontSize: "13px", color: "#475569" }}>Your Leagues:</strong>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
            {myLeagueCodes.map((code) => (
              <button
                key={code}
                style={{
                  ...styles.leagueTab,
                  background: activeCode === code ? "#2563eb" : "#f1f5f9",
                  color: activeCode === code ? "#fff" : "#334155"
                }}
                onClick={() => setActiveCode(code)}
              >
                {leagues[code]?.name || code}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeLeague ? (
        <>
          <div style={styles.activeInfo}>
            <div>
              <strong style={{ fontSize: "16px" }}>{activeLeague.name}</strong>
              <span style={styles.codeChip}>Code: {activeCode}</span>
            </div>
            <div style={{ color: "#64748b", fontSize: "13px" }}>
              👥 {memberCount} member{memberCount !== 1 ? "s" : ""}
              {memberCount === 1 && " · Invite friends to compete!"}
            </div>
          </div>

          {/* Daily Challenge */}
          {challenge && (
            <div style={styles.challengeCard}>
              <div style={styles.challengeHeader}>
                <span style={styles.challengeTag}>⚡ Daily Challenge</span>
                <span style={styles.challengeDate}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
              </div>
              <p style={styles.challengeQ}>{challenge.question}</p>

              {!answered ? (
                <div style={styles.optionGrid}>
                  {challenge.options.map((opt, i) => (
                    <button
                      key={i}
                      style={styles.optionBtn}
                      onClick={() => answerChallenge(opt)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{
                  ...styles.feedbackBox,
                  background: lastAnswer.points > 0 ? "#d1fae5" : "#fee2e2",
                  borderColor: lastAnswer.points > 0 ? "#6ee7b7" : "#fca5a5"
                }}>
                  <div style={{ fontWeight: "700", fontSize: "15px", marginBottom: "4px" }}>
                    {lastAnswer.points > 0 ? "✅ " : "❌ "}{lastAnswer.label}
                  </div>
                  <div style={{ color: "#334155", fontSize: "14px" }}>{lastAnswer.feedback}</div>
                  <div style={{ marginTop: "6px", fontWeight: "700", color: lastAnswer.points > 0 ? "#065f46" : "#991b1b" }}>
                    {lastAnswer.points > 0 ? `+${lastAnswer.points}` : lastAnswer.points} points
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Competition round (only when 2+ members) */}
          {hasCompetition && competitionQ && (
            <div style={styles.competitionCard}>
              <div style={styles.competitionHeader}>
                <span style={styles.competitionTag}>🔥 Competition Round</span>
                <span style={{ fontSize: "12px", color: "#64748b" }}>vs. {memberCount - 1} opponent{memberCount > 2 ? "s" : ""}</span>
              </div>
              <p style={styles.challengeQ}>{competitionQ.question}</p>
              <div style={styles.optionGrid}>
                {competitionQ.options.map((opt, i) => (
                  <button
                    key={i}
                    style={{ ...styles.optionBtn, borderColor: "#6366f1", color: "#4f46e5" }}
                    onClick={() => {
                      if (!db || !activeLeague) return;
                      const ref = doc(db, "leagues", activeCode);
                      const current = activeLeague.members?.[currentUser] || { score: 0 };
                      updateDoc(ref, {
                        [`members.${currentUser}.score`]: (current.score || 0) + opt.points
                      });
                      setMessage(`Competition: ${opt.feedback} (${opt.points > 0 ? "+" : ""}${opt.points} pts)`);
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Leaderboard */}
          <div style={styles.leaderboard}>
            <h3 style={styles.cardTitle}>🏅 Leaderboard</h3>
            {leaderboard.length === 0 ? (
              <p style={{ color: "#64748b", fontSize: "14px" }}>No activity yet. Be the first to answer!</p>
            ) : (
              leaderboard.map((entry, i) => (
                <div
                  key={entry.name}
                  style={{
                    ...styles.tableRow,
                    background: entry.name === currentUser ? "#eff6ff" : "transparent",
                    borderRadius: "10px",
                    padding: "10px 14px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={styles.rankBadge}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                    </span>
                    <span style={{ fontWeight: entry.name === currentUser ? "700" : "500", color: "#1e293b" }}>
                      {entry.name}
                      {entry.name === currentUser && (
                        <span style={{ fontSize: "11px", color: "#2563eb", marginLeft: "6px" }}>you</span>
                      )}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: "700", color: "#2563eb" }}>{entry.score} pts</div>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>{entry.answered} answered</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div style={styles.emptyState}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🏆</div>
          <p style={{ fontWeight: "700", color: "#1e293b", margin: "0 0 6px" }}>No league selected</p>
          <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>
            Create or join a league to unlock the leaderboard and daily challenges.
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "'Inter', system-ui, sans-serif" },
  title: { fontSize: "28px", marginBottom: "8px", color: "#111827" },
  sub: { color: "#64748b", marginBottom: "24px", fontSize: "15px" },
  row: { display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "18px" },
  card: {
    flex: "1 1 260px", background: "#fff", padding: "20px",
    borderRadius: "18px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0"
  },
  cardTitle: { margin: "0 0 6px 0", fontSize: "16px", fontWeight: "700", color: "#111827" },
  cardNote: { color: "#64748b", fontSize: "13px", margin: "0 0 14px" },
  input: {
    width: "100%", padding: "11px 14px", borderRadius: "12px",
    border: "1px solid #cbd5e1", marginBottom: "12px",
    fontSize: "14px", boxSizing: "border-box", fontFamily: "inherit"
  },
  button: {
    padding: "11px 20px", background: "#2563eb", color: "#fff",
    border: "none", borderRadius: "12px", cursor: "pointer",
    fontWeight: "700", fontSize: "14px", width: "100%"
  },
  message: {
    marginBottom: "16px", padding: "12px 16px",
    background: "#eff6ff", border: "1px solid #bfdbfe",
    borderRadius: "12px", color: "#1d4ed8", fontWeight: "600", fontSize: "14px"
  },
  myLeagues: {
    background: "#f8fafc", borderRadius: "14px",
    padding: "14px 16px", marginBottom: "18px", border: "1px solid #e2e8f0"
  },
  leagueTab: {
    padding: "7px 14px", borderRadius: "999px",
    border: "none", cursor: "pointer", fontWeight: "600", fontSize: "13px"
  },
  activeInfo: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    background: "#f8fafc", padding: "14px 18px",
    borderRadius: "14px", marginBottom: "18px", border: "1px solid #e2e8f0"
  },
  codeChip: {
    marginLeft: "10px", background: "#e0e7ff", color: "#4338ca",
    borderRadius: "999px", padding: "2px 10px", fontSize: "12px", fontWeight: "700"
  },
  challengeCard: {
    background: "linear-gradient(135deg,#fefce8,#fef9c3)",
    borderRadius: "18px", padding: "20px",
    marginBottom: "18px", border: "1px solid #fde68a"
  },
  challengeHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "14px"
  },
  challengeTag: {
    background: "#f59e0b", color: "#fff",
    borderRadius: "999px", padding: "4px 12px", fontSize: "12px", fontWeight: "700"
  },
  challengeDate: { fontSize: "12px", color: "#92400e" },
  challengeQ: { fontSize: "16px", fontWeight: "600", color: "#1e293b", marginBottom: "16px", lineHeight: "1.5" },
  optionGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  optionBtn: {
    padding: "12px 14px", background: "#fff", border: "2px solid #e2e8f0",
    borderRadius: "12px", cursor: "pointer", fontSize: "13px",
    fontWeight: "600", color: "#1e293b", textAlign: "left",
    transition: "border-color 0.2s"
  },
  feedbackBox: {
    padding: "14px 16px", borderRadius: "12px",
    border: "2px solid", marginTop: "4px"
  },
  competitionCard: {
    background: "linear-gradient(135deg,#eef2ff,#ede9fe)",
    borderRadius: "18px", padding: "20px",
    marginBottom: "18px", border: "1px solid #c7d2fe"
  },
  competitionHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "14px"
  },
  competitionTag: {
    background: "#6366f1", color: "#fff",
    borderRadius: "999px", padding: "4px 12px", fontSize: "12px", fontWeight: "700"
  },
  leaderboard: {
    background: "#fff", padding: "20px", borderRadius: "18px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0"
  },
  tableRow: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "4px"
  },
  rankBadge: { fontSize: "18px", width: "28px", textAlign: "center" },
  emptyState: {
    textAlign: "center", padding: "40px 20px",
    background: "#f8fafc", borderRadius: "18px", border: "1px dashed #cbd5e1"
  }
};