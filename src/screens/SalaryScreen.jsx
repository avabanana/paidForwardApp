import React, { useState } from 'react';

const salaryOptions = [
  { title: "Software Engineer", salary: 125000 },
  { title: "Registered Nurse", salary: 82000 },
  { title: "Data Analyst", salary: 88000 },
  { title: "Electrician", salary: 72000 },
  { title: "Marketing Manager", salary: 95000 },
  { title: "Teacher", salary: 62000 },
  { title: "Graphic Designer", salary: 58000 },
  { title: "Barista", salary: 32000 }
];

const getTaxRate = (salary) => {
  if (salary <= 40000) return 0.12;
  if (salary <= 90000) return 0.18;
  if (salary <= 150000) return 0.22;
  if (salary <= 250000) return 0.26;
  return 0.30;
};

const savingsIdeas = [
  {
    title: 'Emergency Fund',
    detail: 'Aim for 3-6 months of expenses in a separate savings account.'
  },
  {
    title: 'Retirement Savings',
    detail: 'Use a 401(k) or IRA to build long-term wealth with tax advantages.'
  },
  {
    title: 'Investment Plan',
    detail: 'Consider low-cost index funds or ETFs for steady growth.'
  }
];

export default function SalaryScreen() {
  const [selectedJob, setSelectedJob] = useState(salaryOptions[0]);
  const [customSalary, setCustomSalary] = useState('');

  const salaryValue = Number(customSalary) > 0 ? Number(customSalary) : selectedJob.salary;
  const taxRate = getTaxRate(salaryValue);
  const taxAmount = Math.round(salaryValue * taxRate);
  const netSalary = Math.max(0, salaryValue - taxAmount);
  const monthlyTakeHome = Math.round(netSalary / 12);
  const suggestedSavings = Math.round(netSalary * 0.2);
  const suggestedInvesting = Math.round(netSalary * 0.1);

  return (
    <div style={sStyles.outerWrapper}>
      <div style={sStyles.bgLayer} />
      <div style={sStyles.container}>
        <div style={sStyles.header}>
          <div style={sStyles.headerBadge}>💼 Salary Insights</div>
          <h2 style={sStyles.title}>Salary & Savings Planner</h2>
          <p style={sStyles.subtitle}>Explore career paths, understand taxes, and plan your savings strategy.</p>
        </div>

        <div style={sStyles.card}>
        <div style={sStyles.sectionRow}>
          <div style={sStyles.fieldGroup}>
            <label style={sStyles.label}>Select a Career Path</label>
            <select
              style={sStyles.select}
              value={selectedJob.title}
              onChange={(e) => {
                const found = salaryOptions.find((j) => j.title === e.target.value);
                if (found) setSelectedJob(found);
              }}
            >
              {salaryOptions.map((job) => (
                <option key={job.title} value={job.title}>{job.title}</option>
              ))}
            </select>
          </div>

          <div style={sStyles.fieldGroup}>
            <label style={sStyles.label}>Enter Your Own Annual Salary</label>
            <input
              type="number"
              min="0"
              placeholder={`${selectedJob.salary.toLocaleString()}`}
              value={customSalary}
              onChange={(e) => setCustomSalary(e.target.value)}
              style={sStyles.input}
            />
          </div>
        </div>

        <div style={sStyles.resultBox}>
          <h3 style={sStyles.resultTitle}>Salary Summary</h3>
          <p style={sStyles.text}>
            Annual salary: <strong>${salaryValue.toLocaleString()}</strong>
          </p>
          <p style={sStyles.text}>
            Estimated tax: <strong>${taxAmount.toLocaleString()}</strong> ({Math.round(taxRate * 100)}%)
          </p>
          <p style={sStyles.text}>
            Estimated take-home pay: <strong>${netSalary.toLocaleString()}</strong>
          </p>
          <p style={sStyles.text}>
            Monthly take-home: <strong>${monthlyTakeHome.toLocaleString()}</strong>
          </p>

          <div style={sStyles.divider} />

          <div style={sStyles.goalRow}>
            <div style={sStyles.goalCard}>
              <div style={sStyles.goalTitle}>Savings Target</div>
              <div style={sStyles.goalValue}>${suggestedSavings.toLocaleString()}</div>
              <div style={sStyles.goalNote}>20% of take-home pay</div>
            </div>
            <div style={sStyles.goalCard}>
              <div style={sStyles.goalTitle}>Investment Target</div>
              <div style={sStyles.goalValue}>${suggestedInvesting.toLocaleString()}</div>
              <div style={sStyles.goalNote}>10% of take-home pay</div>
            </div>
          </div>

          <div style={sStyles.suggestions}>
            <h4 style={sStyles.suggestionsTitle}>Ideas to grow your money</h4>
            <ul style={sStyles.suggestionList}>
              {savingsIdeas.map((idea) => (
                <li key={idea.title} style={sStyles.suggestionItem}>
                  <strong>{idea.title}:</strong> {idea.detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

const sStyles = {
  outerWrapper: { position: 'relative', minHeight: '100vh', margin: '-24px', padding: '24px', background: 'linear-gradient(160deg, #f0f0ff 0%, #e8f5f0 30%, #fff8e8 60%, #fff0f0 100%)', fontFamily: "'Inter', system-ui, sans-serif" },
  bgLayer: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 10% 10%, rgba(99,102,241,0.12) 0%, transparent 50%), radial-gradient(ellipse at 90% 80%, rgba(16,185,129,0.1) 0%, transparent 50%)', pointerEvents: 'none', zIndex: 0 },
  container: { maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 },
  header: { marginBottom: '32px' },
  headerBadge: { display: 'inline-block', background: 'rgba(99,102,241,0.12)', borderRadius: '999px', padding: '8px 16px', fontSize: '13px', fontWeight: '700', color: '#4338ca', marginBottom: '12px' },
  title: { margin: '0 0 8px', fontSize: '32px', fontWeight: '900', color: '#1e1b4b' },
  subtitle: { margin: '0', fontSize: '15px', color: '#64748b', lineHeight: 1.6 },
  card: { background: '#fff', padding: '32px', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' },
  sectionRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '28px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
  label: { color: '#475569', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  select: { width: '100%', padding: '14px', borderRadius: '14px', border: '2px solid #e2e8f0', fontSize: '14px', fontFamily: 'inherit', background: '#fff', color: '#1e293b', fontWeight: '500', transition: 'border-color 0.2s', cursor: 'pointer' },
  input: { width: '100%', padding: '14px', borderRadius: '14px', border: '2px solid #e2e8f0', fontSize: '14px', fontFamily: 'inherit', background: '#fff', color: '#1e293b', transition: 'border-color 0.2s' },
  resultBox: { background: 'linear-gradient(135deg, #f0fdf4 0%, #f0f9ff 100%)', padding: '28px', borderRadius: '20px', border: '1px solid #bbf7d0' },
  resultTitle: { marginBottom: '18px', fontSize: '20px', fontWeight: '800', color: '#1e293b' },
  text: { margin: '12px 0', color: '#334155', fontSize: '15px', lineHeight: 1.7, fontWeight: '500' },
  divider: { height: '2px', background: 'linear-gradient(90deg, #bbf7d0 0%, transparent 100%)', margin: '24px 0' },
  goalRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '24px' },
  goalCard: { background: 'linear-gradient(135deg, #dbeafe 0%, #ecfdf5 100%)', padding: '20px', borderRadius: '16px', border: '1px solid #bfdbfe', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)' },
  goalTitle: { fontSize: '13px', fontWeight: '700', color: '#0c4a6e', marginBottom: '8px', textTransform: 'uppercase' },
  goalValue: { fontSize: '28px', fontWeight: '900', background: 'linear-gradient(135deg, #0369a1, #0d9488)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '6px' },
  goalNote: { fontSize: '12px', color: '#475569', fontWeight: '600' },
  suggestions: { marginTop: '20px', background: 'rgba(251, 146, 60, 0.08)', padding: '20px', borderRadius: '16px', border: '1px solid #fed7aa' },
  suggestionsTitle: { fontSize: '15px', fontWeight: '800', color: '#92400e', marginBottom: '14px', textTransform: 'uppercase' },
  suggestionList: { listStyle: 'none', margin: 0, padding: 0, color: '#475569', fontSize: '14px', lineHeight: 1.8 },
  suggestionItem: { marginBottom: '12px', paddingLeft: '24px', position: 'relative', fontWeight: '500' },
  suggestionItemBullet: { position: 'absolute', left: '8px', top: 0 }
};
