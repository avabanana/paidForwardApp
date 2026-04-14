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
    <div style={sStyles.container}>
      <h2 style={sStyles.title}>Salary & Savings Planner</h2>
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
  );
}

const sStyles = {
  container: { maxWidth: '720px', margin: '0 auto', padding: '16px' },
  title: { marginBottom: '22px', fontSize: '28px', color: '#111827' },
  card: { background: '#fff', padding: '28px', borderRadius: '24px', boxShadow: '0 14px 35px rgba(15,23,42,0.08)' },
  sectionRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '24px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
  label: { color: '#475569', fontWeight: '700', fontSize: '14px' },
  select: {
    width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid #cbd5e1', fontSize: '14px', fontFamily: 'inherit'
  },
  input: {
    width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid #cbd5e1', fontSize: '14px', fontFamily: 'inherit'
  },
  resultBox: { background: '#f8fafc', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0' },
  resultTitle: { marginBottom: '12px', fontSize: '20px', color: '#111827' },
  text: { margin: '10px 0', color: '#334155', fontSize: '15px', lineHeight: 1.7 },
  divider: { height: '1px', background: '#e2e8f0', margin: '22px 0' },
  goalRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' },
  goalCard: { background: '#fff', padding: '18px', borderRadius: '18px', border: '1px solid #dbeafe' },
  goalTitle: { fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' },
  goalValue: { fontSize: '24px', fontWeight: '800', color: '#0f172a' },
  goalNote: { fontSize: '12px', color: '#64748b', marginTop: '6px' },
  suggestions: { marginTop: '12px' },
  suggestionsTitle: { fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '12px' },
  suggestionList: { listStyle: 'disc', margin: 0, paddingLeft: '20px', color: '#475569', fontSize: '14px', lineHeight: 1.8 },
  suggestionItem: { marginBottom: '10px' }
};
