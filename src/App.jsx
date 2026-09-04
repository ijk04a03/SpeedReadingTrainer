import { useState } from 'react';
import './App.css'
import LearningModes from './components/LearningModes';
import Navbar from './components/Navbar';
import RSVPmode from './components/RSVPmode';
import GuidedPacer from './components/GuidedPacer';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import About from './components/About';
function App() {
  const [activeMode, setActiveMode] = useState(() => localStorage.getItem('speed-reading-mode') || 'RSVP');
  const [zenMode, setZenMode] = useState(() => localStorage.getItem('speed-reading-zen') === 'true');
  const [activePage, setActivePage] = useState('practice');

  const changeMode = (mode) => {
    localStorage.setItem('speed-reading-mode', mode);
    setActiveMode(mode);
  };

  const toggleZenMode = () => {
    setZenMode((currentZenMode) => {
      const nextZenMode = !currentZenMode;
      localStorage.setItem('speed-reading-zen', String(nextZenMode));
      return nextZenMode;
    });
  };

  const showPage = (page) => setActivePage(page);
  const isPracticeZen = zenMode && activePage === 'practice';

  return (
    <div className={isPracticeZen ? 'app-shell zen-mode' : 'app-shell'}>
      {!isPracticeZen && <Navbar activePage={activePage} onNavigate={showPage} />}
      {activePage === 'practice' && <button className="zen-toggle" type="button" onClick={toggleZenMode} aria-pressed={isPracticeZen}>
        {isPracticeZen ? 'Exit Zen' : 'Zen mode'}
      </button>}
      {activePage === 'dashboard' && <Dashboard onNavigate={showPage} />}
      {activePage === 'about' && <About />}
      {activePage === 'settings' && <Settings />}
      {activePage === 'practice' && <>
        {!isPracticeZen && <LearningModes activeMode={activeMode} onModeChange={changeMode} />}
        {activeMode === 'RSVP' && <RSVPmode zenMode={isPracticeZen} />}
        {activeMode === 'Guided Pacer' && <GuidedPacer zenMode={isPracticeZen} />}
        {activeMode === 'Peripheral Vision Trainer' && <RSVPmode zenMode={isPracticeZen} />}
      </>}
    </div>
  )
}

export default App
