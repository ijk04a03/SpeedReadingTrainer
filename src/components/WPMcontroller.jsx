import { useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { getSavedWpm } from "../utils/readingUtils";
const WPMcontroller = ({
    onPlay,
    onPause,
    onReplay,
    onWpmChange,
}) => {
    const [wpm, setWpm] = useState(getSavedWpm);
    return (
        <section className="controls">
            <div className="slider-container">
                <label htmlFor="mySlider">Choose WPM</label>
                <input
                    type="range"
                    id="mySlider"
                    name="mySlider"
                    min="200"
                    max="900"
                    value={wpm}
                    onChange={(event) => {
                        const nextWpm = Number(event.target.value);
                        setWpm(nextWpm);
                        localStorage.setItem("speed-reading-wpm", String(nextWpm));
                        onWpmChange?.(nextWpm);
                    }}
                />

                <p>Value: <span>{wpm}</span></p>
            </div>
            <div>
                <button type="button" className="play" onClick={onPlay} aria-label="Play"><Play /></button>
                <button type="button" className="pause" onClick={onPause} aria-label="Pause"><Pause /></button>
                <button type="button" className="replay" onClick={onReplay} aria-label="Replay"><RotateCcw /></button>
            </div>
        </section>
    );
};
export { WPMcontroller };