import React from 'react';

const ProgressBar = ({ progress }) => {
  // This will show up in your browser's Inspect > Console to prove it's updated
  console.log("Current Progress:", progress);

  const containerStyle = {
    height: '10px',
    width: '100%',
    backgroundColor: '#eee',
    borderRadius: '10px',
    overflow: 'hidden',
    marginTop: '10px'
  };

  const fillerStyle = {
    height: '100%',
    width: `${(progress || 0) * 100}%`,
    // If progress is 1 (100%), it MUST turn green (#10b981)
    backgroundColor: progress >= 1 ? '#10b981' : '#4A90E2',
    transition: 'width 0.5s ease-in-out, background-color 0.3s ease'
  };

  return (
    <div style={containerStyle}>
      <div style={fillerStyle} />
    </div>
  );
};

export default ProgressBar;