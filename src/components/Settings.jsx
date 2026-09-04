import { useState } from 'react';

const Settings = () => {
    const [defaultWpm, setDefaultWpm] = useState(() => localStorage.getItem('speed-reading-wpm') || '250');
    const [reducedMotion, setReducedMotion] = useState(() => localStorage.getItem('speed-reading-reduced-motion') === 'true');
    const saveWpm = (event) => { setDefaultWpm(event.target.value); localStorage.setItem('speed-reading-wpm', event.target.value); };
    const toggleMotion = (event) => { setReducedMotion(event.target.checked); localStorage.setItem('speed-reading-reduced-motion', String(event.target.checked)); };

    return (
        <section className="page settings-page">
            <div className="page-heading"><p className="page-kicker">Your preferences</p><h1>Settings</h1><p>Keep the practice environment tuned to how you learn best.</p></div>
            <div className="settings-list">
                <label className="setting-row" htmlFor="default-wpm"><span><strong>Default reading pace</strong><small>Used when a new practice session begins</small></span><span className="setting-input"><input id="default-wpm" type="number" min="50" max="1000" step="10" value={defaultWpm} onChange={saveWpm} /><span>WPM</span></span></label>
                <label className="setting-row" htmlFor="reduced-motion"><span><strong>Reduce motion</strong><small>Turn off animated transitions and movement</small></span><input id="reduced-motion" className="toggle" type="checkbox" checked={reducedMotion} onChange={toggleMotion} /></label>
            </div>
        </section>
    );
};

export default Settings;