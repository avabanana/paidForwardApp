import React, { useMemo, useState, useEffect } from "react";

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

const countryData = [
  { 
    name: "Norway", rate: "71%", left: "51.5%", top: "20%", 
    info: "Global leader. Norway integrates financial education into the national curriculum from a very young age, focusing heavily on the social security system and long-term equity savings." 
  },
  { 
    name: "Canada", rate: "68%", left: "18%", top: "26%", 
    info: "Strong performance across all demographics. Canadians excel in understanding interest and inflation, supported by high transparency in the banking sector and accessible public resources." 
  },
  { 
    name: "United Kingdom", rate: "67%", left: "46.5%", top: "33%", 
    info: "The UK has a robust 'Money and Pensions Service' providing free advice. Literacy is driven by high engagement with digital banking and a mature mortgage market." 
  },
  { 
    name: "Australia", rate: "64%", left: "84.5%", top: "76%", 
    info: "Australia's mandatory retirement saving (Superannuation) forces early engagement with investment concepts, leading to high literacy in compound interest and market risk." 
  },
  { 
    name: "United States", rate: "57%", left: "18%", top: "41%", 
    info: "The US has strong credit knowledge but a significant gap in understanding investment risk. 401(k) plans are the primary driver for middle-class financial engagement." 
  },
  { 
    name: "South Africa", rate: "42%", left: "54.5%", top: "76%", 
    info: "The highest in Africa. South Africa uses 'Stokvels' (communal saving clubs) as a primary vehicle for financial literacy, teaching budgeting through community trust." 
  },
  { 
    name: "Brazil", rate: "35%", left: "28%", top: "68%", 
    info: "Brazil is rapidly improving literacy through Fintech. The 'Pix' instant payment system and high-yield digital accounts have introduced millions to basic banking concepts recently." 
  },
  { 
    name: "India", rate: "24%", left: "71%", top: "54%", 
    info: "India is closing the gap via a 'Mobile First' strategy. Unified Payments Interface (UPI) has revolutionized how rural populations manage money and understand digital transactions." 
  },
  { 
    name: "China", rate: "28%", left: "79%", top: "43%", 
    info: "High mathematical proficiency, but lower familiarity with diverse financial products. The transition from cash to Alipay/WeChat Pay has fundamentally shifted how citizens track spending." 
  },
];

export default function HomeScreen({ onNavigate, userTier }) {
  const isElementary = userTier === 'elementary';
  const [view, setView] = useState('home'); // 'home' or 'map'
  const [mapLoading, setMapLoading] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const heroBadgeText = isElementary
    ? '🌟 Learning money is fun and easy'
    : '🚀 Your financial journey starts here';
  const heroTitleText = isElementary
    ? 'Build smart money habits with games and goals'
    : 'Build a Future You\'re Proud Of';
  const heroSubtitleText = isElementary
    ? 'Play simple money games, level up your savings, and feel great about good choices.'
    : 'Learn real money skills, play games that test your knowledge, and track your growth — all in one place.';

  const tip = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
    );
    return dailyTips[dayOfYear % dailyTips.length];
  }, []);

  const openMap = () => {
    setView('map');
    setMapLoading(true);
    setTimeout(() => setMapLoading(false), 2000);
  };

  if (view === 'map') {
    return (
      <div style={styles.outerWrapper}>
        <div style={styles.bgLayer} />
        <div style={styles.container}>
          <div style={styles.mapHeader}>
            <button onClick={() => setView('home')} style={styles.backBtn}>← Back to Home</button>
            <h1 style={styles.mapPageTitle}>Global Financial Literacy Map</h1>
          </div>

          <div style={styles.mapContainerFull}>
            {mapLoading ? (
              <div style={styles.loadingOverlay}>
                <div className="spinner" style={styles.spinner} />
                <p style={styles.loadingText}>Loading Global Literacy Data...</p>
              </div>
            ) : (
              <div style={styles.mapWrapper}>
                <img 
                  src="https://sweatyourassets.biz/wp-content/uploads/2022/02/Finanial-Literacy_Map-World.png" 
                  alt="Global Map" 
                  style={styles.mapImage}
                />
                
                {countryData.map((c, i) => (
                  <div 
                    key={i} 
                    style={{ ...styles.hotspot, top: c.top, left: c.left }}
                    onMouseEnter={() => setHoveredCountry(c)}
                    onMouseLeave={() => setHoveredCountry(null)}
                  >
                    <div style={styles.ping} />
                  </div>
                ))}

                {hoveredCountry && (
                  <div style={styles.mapTooltip}>
                    <div style={styles.tooltipHeader}>
                      <strong>{hoveredCountry.name}</strong>
                      <span style={styles.rateBadge}>{hoveredCountry.rate} Literate</span>
                    </div>
                    <p style={styles.tooltipText}>{hoveredCountry.info}</p>
                  </div>
                )}

                <div style={styles.legend}>
                  <div style={styles.legendRow}><div style={{...styles.dot, background: '#004a7c'}}/> 55-75%</div>
                  <div style={styles.legendRow}><div style={{...styles.dot, background: '#5bb1e4'}}/> 25-54%</div>
                  <div style={styles.legendRow}><div style={{...styles.dot, background: '#d1e9f7'}}/> 0-24%</div>
                </div>
              </div>
            )}
          </div>
        </div>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } @keyframes pulse { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(2.5); opacity: 0; } }`}</style>
      </div>
    );
  }

  return (
    <div style={styles.outerWrapper}>
      <div style={styles.bgLayer} />

      <div style={styles.container}>
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

        <div style={styles.sectionLabel}>What you can do</div>
        <div style={styles.cardsRow}>
          <div style={{ ...styles.featureCard, borderTop: "4px solid #6366f1", background: "linear-gradient(160deg, #fff 60%, #eef2ff)" }}>
            <div style={{ ...styles.featureIconWrap, background: "#eef2ff" }}>📚</div>
            <h3 style={styles.featureTitle}>Learn</h3>
            <p style={styles.featureDesc}>Master money management with bite-sized lessons across 3 courses.</p>
            <button onClick={() => onNavigate("Courses")} style={{ ...styles.featureBtn, color: "#6366f1", background: "#eef2ff" }}>Open Courses →</button>
          </div>

          <div style={{ ...styles.featureCard, borderTop: "4px solid #10b981", background: "linear-gradient(160deg, #fff 60%, #ecfdf5)" }}>
            <div style={{ ...styles.featureIconWrap, background: "#ecfdf5" }}>🎮</div>
            <h3 style={styles.featureTitle}>Play</h3>
            <p style={styles.featureDesc}>Test your financial instincts in budgeting and investing games.</p>
            <button onClick={() => onNavigate("Games")} style={{ ...styles.featureBtn, color: "#059669", background: "#ecfdf5" }}>Play Games →</button>
          </div>

          <div style={{ ...styles.featureCard, borderTop: "4px solid #f59e0b", background: "linear-gradient(160deg, #fff 60%, #fffbeb)" }}>
            <div style={{ ...styles.featureIconWrap, background: "#fffbeb" }}>🌍</div>
            <h3 style={styles.featureTitle}>Impact</h3>
            <p style={styles.featureDesc}>Explore financial literacy variations in communities globally.</p>
            <button onClick={openMap} style={{ ...styles.featureBtn, color: "#d97706", background: "#fffbeb" }}>View Map →</button>
          </div>

          <div style={{ ...styles.featureCard, borderTop: "4px solid #ef4444", background: "linear-gradient(160deg, #fff 60%, #fef2f2)" }}>
            <div style={{ ...styles.featureIconWrap, background: "#fef2f2" }}>🏆</div>
            <h3 style={styles.featureTitle}>Compete</h3>
            <p style={styles.featureDesc}>Join a League and compete with friends on literacy challenges.</p>
            <button onClick={() => onNavigate("Leagues")} style={{ ...styles.featureBtn, color: "#ef4444", background: "#fef2f2" }}>Join a League →</button>
          </div>
        </div>

        <div style={styles.ctaSection}>
          <button onClick={() => onNavigate("Progress")} style={styles.mainBtn}>🔥 View Your Progress & Achievements</button>
          <button onClick={() => onNavigate("Goals")} style={styles.secondaryBtn}>🎯 Set Financial Goals</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  outerWrapper: { position: 'relative', minHeight: '100vh', margin: '-24px', padding: '24px', background: 'linear-gradient(160deg, #f0f0ff 0%, #e8f5f0 30%, #fff8e8 60%, #fff0f0 100%)', fontFamily: "'Inter', system-ui, sans-serif" },
  bgLayer: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 10% 10%, rgba(99,102,241,0.12) 0%, transparent 50%), radial-gradient(ellipse at 90% 80%, rgba(16,185,129,0.1) 0%, transparent 50%)', pointerEvents: 'none', zIndex: 0 },
  container: { maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 },
  hero: { background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 45%, #7c3aed 100%)', padding: '44px 40px', borderRadius: '24px', color: '#fff', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  heroContent: { flex: 1, maxWidth: '680px' },
  heroBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.18)', borderRadius: '999px', padding: '5px 14px', fontSize: '13px', fontWeight: '600', marginBottom: '14px' },
  heroTitle: { fontSize: '32px', fontWeight: '900', margin: '0 0 12px' },
  heroSubtitle: { fontSize: '15px', opacity: 0.88, margin: '0 0 20px', lineHeight: 1.6 },
  dailyTip: { background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: '14px', padding: '13px 16px', display: 'flex', gap: '10px' },
  tipLabel: { fontWeight: '800', fontSize: '13px' },
  tipText: { fontSize: '14px' },
  heroDecor: { fontSize: '80px', opacity: 0.18 },
  sectionLabel: { fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '14px' },
  cardsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '40px' },
  featureCard: { padding: '24px 20px', borderRadius: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.06)' },
  featureIconWrap: { width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '14px' },
  featureTitle: { margin: '0 0 8px', fontSize: '18px', fontWeight: '800' },
  featureDesc: { color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px' },
  featureBtn: { border: 'none', fontWeight: '700', cursor: 'pointer', padding: '8px 14px', fontSize: '13px', borderRadius: '10px' },
  ctaSection: { display: 'flex', gap: '14px', justifyContent: 'center' },
  mainBtn: { padding: '16px 32px', background: 'linear-gradient(135deg, #4338ca, #6366f1)', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '800', cursor: 'pointer' },
  secondaryBtn: { padding: '16px 32px', background: '#fff', color: '#6366f1', border: '2px solid #6366f1', borderRadius: '14px', fontWeight: '800', cursor: 'pointer' },

  // MAP PAGE SPECIFIC
  mapHeader: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' },
  backBtn: { background: '#fff', border: '1px solid #e2e8f0', padding: '10px 20px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', color: '#6366f1' },
  mapPageTitle: { margin: 0, fontSize: '24px', fontWeight: '900', color: '#1e1b4b' },
  mapContainerFull: { background: '#fff', padding: '20px', borderRadius: '24px', border: '1px solid #e2e8f0', minHeight: '500px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', position: 'relative' },
  loadingOverlay: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '24px', zIndex: 10 },
  spinner: { width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  loadingText: { marginTop: '20px', color: '#64748b', fontWeight: 'bold' },
  mapWrapper: { position: 'relative', width: '100%' },
  mapImage: { width: '100%', display: 'block', borderRadius: '12px' },
  hotspot: { position: 'absolute', width: '12px', height: '12px', background: '#6366f1', border: '3px solid #fff', borderRadius: '50%', cursor: 'pointer', transform: 'translate(-50%, -50%)', zIndex: 5 },
  ping: { position: 'absolute', inset: -6, background: '#6366f1', borderRadius: '50%', animation: 'pulse 2s infinite' },
  mapTooltip: { position: 'absolute', bottom: '20px', left: '20px', width: '300px', background: '#1e1b4b', color: '#fff', padding: '20px', borderRadius: '20px', zIndex: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  tooltipHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  rateBadge: { background: '#10b981', padding: '2px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' },
  tooltipText: { fontSize: '13px', lineHeight: '1.5', margin: 0, opacity: 0.9 },
  legend: { position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.9)', padding: '10px', borderRadius: '10px', border: '1px solid #ddd' },
  legendRow: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' },
  dot: { width: '8px', height: '8px', borderRadius: '50%' }
};