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

export default function SalaryScreen() {
  const [selectedJob, setSelectedJob] = useState(salaryOptions[0]);

  return (
    <div style={sStyles.container}>
      <h2 style={sStyles.title}>Salary Simulator</h2>
      <div style={sStyles.card}>
        <label style={sStyles.label}>Select a Career Path:</label>
        <select 
          style={sStyles.select} 
          onChange={(e) => setSelectedJob(salaryOptions.find(j => j.title === e.target.value))}
        >
          {salaryOptions.map(job => (
            <option key={job.title} value={job.title}>{job.title}</option>
          ))}
        </select>

        <div style={sStyles.resultBox}>
          <h3>{selectedJob.title}</h3>
          <p>Annual Salary: <strong>${selectedJob.salary.toLocaleString()}</strong></p>
          <p>Estimated Monthly Take-Home: <strong>${Math.round(selectedJob.salary / 12 * 0.75).toLocaleString()}</strong></p>
          <small>*Estimated after 25% tax</small>
        </div>
      </div>
    </div>
  );
}

const sStyles = {
  container: { maxWidth: '600px', margin: '0 auto' },
  title: { marginBottom: '20px' },
  card: { background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' },
  label: { display: 'block', marginBottom: '10px', fontWeight: 'bold' },
  select: { 
    width: '100%', 
    padding: '12px', 
    borderRadius: '10px', 
    border: '1px solid #cbd5e1', 
    boxSizing: 'border-box', // CSS FIX
    marginBottom: '20px' 
  },
  resultBox: { background: '#f8fafc', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0' }
};