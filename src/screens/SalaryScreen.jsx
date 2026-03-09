import React, { useState } from 'react';

const jobs = [
  { title: 'Retail Associate', salary: 32000 },
  { title: 'Software Engineer', salary: 95000 },
  { title: 'Teacher', salary: 52000 },
  { title: 'Nurse', salary: 62000 },
  { title: 'Graphic Designer', salary: 48000 }
];

const formatMoney = (n) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export default function SalaryScreen() {
  const [selected, setSelected] = useState(jobs[0].salary);
  const [custom, setCustom] = useState('');

  const annual = custom ? parseFloat(custom) || 0 : selected;
  const monthlyGross = annual / 12;

  // Example with simplified tax assumptions
  const federal = annual * 0.12;
  const state = annual * 0.05;
  const social = annual * 0.062;
  const medicare = annual * 0.0145;
  const retirement = annual * 0.1;
  const totalDeductions = federal + state + social + medicare + retirement;
  const netAnnual = Math.max(0, annual - totalDeductions);
  const netMonthly = netAnnual / 12;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>💼 Salary Simulator</h2>
      <p style={styles.sub}>Pick a job or enter your salary to see what you keep after taxes and typical deductions.</p>

      <div style={styles.controls}>
        <select
          value={selected}
          onChange={(e) => {
            setSelected(Number(e.target.value));
            setCustom('');
          }}
          style={styles.select}
        >
          {jobs.map((job) => (
            <option key={job.title} value={job.salary}>
              {job.title} — {formatMoney(job.salary)} / year
            </option>
          ))}
        </select>

        <div style={styles.customRow}>
          <input
            type="number"
            placeholder="Or enter your salary"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            style={styles.input}
          />
          <span style={styles.note}>Monthly gross: {formatMoney(monthlyGross)}</span>
        </div>
      </div>

      <div style={styles.breakdown}>
        <h3 style={styles.breakdownTitle}>Annual Breakdown</h3>
        <div style={styles.row}>
          <span>Federal tax (12%)</span>
          <span>{formatMoney(federal)}</span>
        </div>
        <div style={styles.row}>
          <span>State tax (5%)</span>
          <span>{formatMoney(state)}</span>
        </div>
        <div style={styles.row}>
          <span>Social Security (6.2%)</span>
          <span>{formatMoney(social)}</span>
        </div>
        <div style={styles.row}>
          <span>Medicare (1.45%)</span>
          <span>{formatMoney(medicare)}</span>
        </div>
        <div style={styles.row}>
          <span>Retirement (10%)</span>
          <span>{formatMoney(retirement)}</span>
        </div>
        <div style={styles.divider} />
        <div style={{ ...styles.row, fontWeight: 'bold' }}>
          <span>Net take-home</span>
          <span>{formatMoney(netAnnual)}</span>
        </div>
        <div style={{ ...styles.row, color: '#475569', fontSize: '13px' }}>
          <span>Net per month</span>
          <span>{formatMoney(netMonthly)}</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '680px', margin: '0 auto', padding: '20px' },
  title: { fontSize: '26px', marginBottom: '10px' },
  sub: { color: '#64748b', marginBottom: '20px' },
  controls: { display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' },
  select: { padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' },
  input: { padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', width: '200px' },
  customRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  note: { color: '#64748b' },
  breakdown: { background: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' },
  breakdownTitle: { margin: '0 0 15px 0' },
  row: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  divider: { height: '1px', background: '#e2e8f0', margin: '12px 0' }
};
