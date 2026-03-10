import React, { useEffect, useMemo, useState } from 'react';
import { db } from '../firebase'; 
import { collection, query, onSnapshot, doc, setDoc, updateDoc } from "firebase/firestore";

const defaultScenarios = [
  { description: 'You found $50 in your pocket. Do you save it or spend it on snacks?', save: 50, spend: 50 },
  { description: 'You got paid $200 for a part-time job. Do you put it in savings or buy a new game?', save: 120, spend: 80 },
  { description: 'A friend invites you to go out. Do you keep the $30 or spend it on the outing?', save: 30, spend: 30 }
];

export default function LeagueScreen({ currentUser }) {
  const [leagues, setLeagueState] = useState([]);
  const [activeCode, setActiveCode] = useState('');
  const [newLeagueName, setNewLeagueName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [message, setMessage] = useState('');
  const [scenario, setScenario] = useState(defaultScenarios[0]);

  // Firebase Real-time Listener
  useEffect(() => {
    const q = query(collection(db, "leagues"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLeagues = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeagueState(fetchedLeagues);
      
      // Set initial active code if not set
      if (fetchedLeagues.length > 0 && !activeCode) {
        setActiveCode(fetchedLeagues[0].code);
      }
    });
    return () => unsubscribe();
  }, [activeCode]);

  const activeLeague = useMemo(() => leagues.find((l) => l.code === activeCode), [leagues, activeCode]);

  const makeCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

  const createLeague = async () => {
    if (!newLeagueName.trim()) return;
    const code = makeCode();
    const newLeague = {
      code,
      name: newLeagueName.trim(),
      members: {
        [currentUser]: { savings: 0, spent: 0 }
      }
    };
    
    try {
      await setDoc(doc(db, "leagues", code), newLeague);
      setActiveCode(code);
      setNewLeagueName('');
      setMessage(`League created! Share code: ${code}`);
    } catch (e) {
      setMessage("Error creating league.");
    }
  };

  const joinLeague = async () => {
    const league = leagues.find((l) => l.code === joinCode.trim().toUpperCase());
    if (!league) {
      setMessage('League not found. Check the code.');
      return;
    }
    if (!league.members[currentUser]) {
      const updatedMembers = {
        ...league.members,
        [currentUser]: { savings: 0, spent: 0 }
      };
      await updateDoc(doc(db, "leagues", league.code), { members: updatedMembers });
    }
    setActiveCode(league.code);
    setJoinCode('');
    setMessage(`Joined league ${league.name}!`);
  };

  const recordAction = async (amount, type) => {
    if (!activeLeague) return;

    const members = { ...activeLeague.members };
    const userEntry = members[currentUser] || { savings: 0, spent: 0 };
    
    if (type === 'save') userEntry.savings += amount;
    else userEntry.spent += amount;
    
    members[currentUser] = userEntry;

    try {
      await updateDoc(doc(db, "leagues", activeLeague.code), { members });
      setScenario(defaultScenarios[Math.floor(Math.random() * defaultScenarios.length)]);
    } catch (e) {
      setMessage("Error updating action.");
    }
  };

  const leaderboard = useMemo(() => {
    if (!activeLeague) return [];
    return Object.entries(activeLeague.members)
      .map(([name, stats]) => {
        const total = stats.savings + stats.spent;
        const rate = total === 0 ? 0 : stats.savings / total;
        return { name, ...stats, rate };
      })
      .sort((a, b) => b.rate - a.rate);
  }, [activeLeague]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🏆 Classroom Leagues</h2>
      <p style={styles.sub}>Join a league with friends to see who builds the best savings habit.</p>

      <div style={styles.row}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Create a League</h3>
          <input
            style={styles.input}
            placeholder="League name"
            value={newLeagueName}
            onChange={(e) => setNewLeagueName(e.target.value)}
          />
          <button style={styles.button} onClick={createLeague}>Create</button>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Join a League</h3>
          <input
            style={styles.input}
            placeholder="League code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
          />
          <button style={styles.button} onClick={joinLeague}>Join</button>
        </div>
      </div>

      {message && <div style={styles.message}>{message}</div>}

      {activeLeague ? (
        <>
          <div style={styles.activeInfo}>
            <div>
              <strong>League:</strong> {activeLeague.name} ({activeLeague.code})
            </div>
            <div>
              <strong>Members:</strong> {Object.keys(activeLeague.members).length}
            </div>
          </div>

          <div style={styles.scenarioCard}>
            <h3 style={styles.cardTitle}>Daily Challenge</h3>
            <p style={styles.scenarioText}>{scenario.description}</p>
            <div style={styles.scenarioButtons}>
              <button style={styles.button} onClick={() => recordAction(scenario.save, 'save')}>
                Save {scenario.save}
              </button>
              <button style={styles.button} onClick={() => recordAction(scenario.spend, 'spend')}>
                Spend {scenario.spend}
              </button>
            </div>
          </div>

          <div style={styles.leaderboard}>
            <h3 style={styles.cardTitle}>Leaderboard</h3>
            <div style={styles.tableHeader}>
              <span>Name</span>
              <span>Savings Rate</span>
            </div>
            {leaderboard.map((entry) => (
              <div key={entry.name} style={styles.tableRow}>
                <span>{entry.name}</span>
                <span>{Math.round(entry.rate * 100)}%</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p style={styles.note}>Create or join a league to unlock the leaderboard and challenges.</p>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '760px', margin: '0 auto', padding: '20px' },
  title: { fontSize: '26px', marginBottom: '8px' },
  sub: { color: '#64748b', marginBottom: '20px' },
  row: { display: 'flex', gap: '18px', flexWrap: 'wrap', marginBottom: '18px' },
  card: { flex: '1 1 280px', background: '#fff', padding: '18px', borderRadius: '18px', boxShadow: '0 12px 24px rgba(0,0,0,0.05)' },
  cardTitle: { margin: '0 0 12px 0' },
  // BOX-SIZING FIX ADDED HERE
  input: { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '10px', boxSizing: 'border-box' },
  button: { padding: '12px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer' },
  message: { marginTop: '12px', padding: '12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', color: '#0369a1' },
  activeInfo: { display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '12px 18px', borderRadius: '14px', marginBottom: '18px' },
  scenarioCard: { background: '#fff', padding: '18px', borderRadius: '18px', boxShadow: '0 12px 24px rgba(0,0,0,0.05)', marginBottom: '18px' },
  scenarioText: { color: '#334155', marginBottom: '14px' },
  scenarioButtons: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  leaderboard: { background: '#fff', padding: '18px', borderRadius: '18px', boxShadow: '0 12px 24px rgba(0,0,0,0.05)' },
  tableHeader: { display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '10px' },
  tableRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' },
  note: { color: '#64748b' }
};