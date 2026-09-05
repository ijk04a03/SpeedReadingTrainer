import { useEffect, useMemo, useState } from "react";
import { WPMcontroller } from "./WPMcontroller";
import { FetchGutenberg } from "./FetchGutenberg";
import {
    getDelay,
    getSavedProgress,
    getSavedWpm,
    recordBestWpm,
    recordPracticeSecond,
    saveProgress
} from "../utils/readingUtils";

const defaultText =
    "Welcome to your reading space. Select a book from your library to begin using RSVP (Rapid Serial Visual Presentation), a reading technique that displays words one at a time at a controlled pace, allowing your eyes to stay focused on a single point instead of moving back and forth across the page. Adjust the reading speed to match your comfort level, build your pace gradually, and stay focused with fewer distractions. Whether you’re reading for a few minutes or settling in for a longer session, RSVP is designed to help you maintain concentration and explore faster, more focused reading. Choose a book, set your pace, and start reading.";
const RSVPmode = ({ zenMode = false }) => {
    const [readingText, setReadingText] = useState(defaultText);
    const [customContent, setCustomContent] = useState(
        () => localStorage.getItem("speed-reading-custom-content") || ""
    );
    const [contentKey, setContentKey] = useState("default");
    const [contentTitle, setContentTitle] = useState(
        () => localStorage.getItem("speed-reading-selected-book-title") || "Practice text"
    );
    const [wordToDisplay, setWordToDisplay] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [wpm, setWpm] = useState(getSavedWpm);
    const [wordIndex, setWordIndex] = useState(() => getSavedProgress("default"));
    const arrOfWords = useMemo(() => readingText.trim().split(/\s+/).filter(Boolean), [readingText]);
    useEffect(() => {
        let timerId;

        const displayNextWord = () => {
            if (!isPlaying || wordIndex >= arrOfWords.length) return;

            const word = arrOfWords[wordIndex];
            setWordToDisplay(word);

            timerId = setTimeout(
                () => {
                    setWordIndex((currentIndex) => currentIndex + 1);
                },
                getDelay(word, wpm)
            );
        };

        displayNextWord();

        return () => clearTimeout(timerId);
    }, [arrOfWords, isPlaying, wordIndex, wpm]);

    useEffect(() => {
        saveProgress(contentKey, wordIndex);
    }, [contentKey, wordIndex]);

    useEffect(() => {
        recordBestWpm(wpm);
    }, [wpm]);

    useEffect(() => {
        if (!isPlaying || wordIndex >= arrOfWords.length) return undefined;
        const intervalId = setInterval(recordPracticeSecond, 1000);
        return () => clearInterval(intervalId);
    }, [arrOfWords.length, isPlaying, wordIndex]);

    const play = () => {
        setIsPlaying(true);
    };

    const pause = () => {
        setIsPlaying(false);
    };

    const replay = () => {
        setWordIndex(0);
        setWordToDisplay("");
        setIsPlaying(true);
    };
    const loadContent = (content, nextContentKey = "custom", nextContentTitle = "Custom text") => {
        setReadingText(content);
        setContentKey(nextContentKey);
        setContentTitle(nextContentTitle);
        setWordIndex(getSavedProgress(nextContentKey));
        setWordToDisplay("");
        setIsPlaying(true);
    };

    const loadCustomContent = () => {
        if (customContent.trim()) {
            localStorage.setItem("speed-reading-custom-content", customContent);
            loadContent(customContent, "custom", "Custom text");
        }
    };

    return (
        <main className={zenMode ? "rsvp-workspace zen-workspace" : "rsvp-workspace"}>
            <section className="rsvp-panel" aria-labelledby="rsvp-heading">
                <p className="rsvp-kicker">Rapid serial visual presentation</p>
                <h1 id="rsvp-heading">Read one word at a time</h1>
                <p className="now-reading">
                    Now reading: <strong>{contentTitle}</strong>
                </p>
                <p className="rsvp-instruction">Focus on the red letter and let the words move at their own pace.</p>
                <div className="rsvp-display-cont">
                    <div className="rsvp-word">
                        <span className="wordPrefix">
                            {wordToDisplay.slice(0, Math.floor(wordToDisplay.length / 2))}
                        </span>
                        <span className="middleLetter">{wordToDisplay[Math.floor(wordToDisplay.length / 2)]}</span>
                        <span className="wordSuffix">
                            {wordToDisplay.slice(Math.floor(wordToDisplay.length / 2) + 1)}
                        </span>
                    </div>
                </div>
                <WPMcontroller onPlay={play} onPause={pause} onReplay={replay} onWpmChange={setWpm} />
            </section>
            {!zenMode && (
                <aside className="content-selector" aria-labelledby="content-heading">
                    <div className="content-selector-header">
                        <p className="rsvp-kicker">Your reading material</p>
                        <h2 id="content-heading">Choose your content</h2>
                    </div>
                    <form action="" method="get">
                        <label htmlFor="book-select">Reference book</label>
                        <FetchGutenberg onBookSelect={loadContent} />

                        <label htmlFor="custom-content">Custom content</label>
                        <textarea
                            name="custom-content"
                            id="custom-content"
                            value={customContent}
                            onChange={(event) => setCustomContent(event.target.value)}
                            placeholder="Paste an article, chapter, or notes here..."
                        />

                        <button className="load-content-btn" type="button" onClick={loadCustomContent}>
                            Load reading material
                        </button>
                    </form>
                </aside>
            )}
        </main>
    );
};

export default RSVPmode;
