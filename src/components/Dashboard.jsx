import { useState } from "react";
import { getPracticeStats } from "../utils/readingUtils";

function getCurrentStreak(practiceDays) {
    const practiced = new Set(practiceDays);
    const today = new Date();
    let streak = 0;

    for (let offset = 0; ; offset += 1) {
        const date = new Date(today);
        date.setDate(today.getDate() - offset);
        const dateKey = date.toISOString().slice(0, 10);
        if (!practiced.has(dateKey)) break;
        streak += 1;
    }

    return streak;
}

function formatPracticeTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    return `${minutes} min`;
}

const Dashboard = ({ onNavigate }) => {
    const [stats] = useState(getPracticeStats);
    const streak = getCurrentStreak(stats.practiceDays);

    return (
        <section className="page dashboard-page">
            <div className="page-heading"><p className="page-kicker">Your reading desk</p><h1>Dashboard</h1><p>Build a steady rhythm. Small sessions compound into faster, calmer reading.</p></div>
            <div className="stats-grid">
                <article className="stat-card"><span className="stat-label">Current streak</span><strong>{streak} {streak === 1 ? "day" : "days"}</strong><span>{streak ? "Keep the chain moving" : "Start a session today"}</span></article>
                <article className="stat-card"><span className="stat-label">Practice time</span><strong>{formatPracticeTime(stats.totalSeconds)}</strong><span>{stats.totalSeconds ? "Time spent reading" : "Your first session starts here"}</span></article>
                <article className="stat-card"><span className="stat-label">Best pace</span><strong>{stats.bestWpm || 0} WPM</strong><span>{stats.bestWpm ? "Your fastest saved pace" : "Set a personal baseline"}</span></article>
            </div>
            <div className="dashboard-section"><div><p className="page-kicker">Next session</p><h2>Warm up your focus</h2><p>Start with RSVP to train recognition without subvocalizing.</p></div><button className="primary-action" type="button" onClick={() => onNavigate('practice')}>Start practice</button></div>
        </section>
    );
};

export default Dashboard;