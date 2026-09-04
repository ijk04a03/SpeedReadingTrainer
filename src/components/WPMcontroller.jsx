import { useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
let WPM = 200;
const WPMcontroller = ({
    onPlay,
    onPause,
    onReplay,
}) => {
    const [wpm, setWpm] = useState(WPM);
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
                        WPM = nextWpm;
                    }}
                />

                <p>Value: <span>{wpm}</span></p>
            </div>
            <div>
                <button type="button" id="play" style={{ background: "none", border: "none" }} onClick={onPlay} aria-label="Play"><Play fill="Green" stroke="none" /></button>
                <button type="button" id="pause" style={{ background: "none", border: "none" }} onClick={onPause} aria-label="Pause"><Pause fill="white" stroke="none" /></button>
                <button type="button" id="replay" style={{ background: "none", border: "none" }} onClick={onReplay} aria-label="Replay"><RotateCcw color="blue" stroke="blue" /></button>
            </div>
        </section>
    );
};
export { WPM, WPMcontroller };
// export default WPMcontroller;