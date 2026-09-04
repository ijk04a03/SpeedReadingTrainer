const Dashboard = ({ onNavigate }) => (
    <section className="page dashboard-page">
        <div className="page-heading"><p className="page-kicker">Your reading desk</p><h1>Dashboard</h1><p>Build a steady rhythm. Small sessions compound into faster, calmer reading.</p></div>
        <div className="stats-grid">
            <article className="stat-card"><span className="stat-label">Current streak</span><strong>1 day</strong><span>Keep the chain moving</span></article>
            <article className="stat-card"><span className="stat-label">Practice time</span><strong>0 min</strong><span>Your first session starts here</span></article>
            <article className="stat-card"><span className="stat-label">Best pace</span><strong>250 WPM</strong><span>Set a personal baseline</span></article>
        </div>
        <div className="dashboard-section"><div><p className="page-kicker">Next session</p><h2>Warm up your focus</h2><p>Start with RSVP to train recognition without subvocalizing.</p></div><button className="primary-action" type="button" onClick={() => onNavigate('practice')}>Start practice</button></div>
    </section>
);

export default Dashboard;