import { useState } from 'react';
import './App.css'
import LearningModes from './components/LearningModes';
import Navbar from './components/Navbar';
import RSVPmode from './components/RSVPmode';
import GuidedPacer from './components/GuidedPacer';
function App() {
  const [activeMode, setActiveMode] = useState(() => localStorage.getItem('speed-reading-mode') || 'RSVP');

  const changeMode = (mode) => {
    localStorage.setItem('speed-reading-mode', mode);
    setActiveMode(mode);
  };

  return (
    <>
      <Navbar />
      <LearningModes activeMode={activeMode} onModeChange={changeMode} />
      {activeMode === 'RSVP' && <RSVPmode />}
      {activeMode === 'Guided Pacer' && <GuidedPacer />}
      {activeMode === 'Peripheral Vision Trainer' && <RSVPmode />}
    </>
  )
}

export default App
