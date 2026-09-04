import { useEffect, useState } from "react";
import { WPMcontroller, WPM } from "./WPMcontroller";

let textString = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim reprehenderit totam, ratione nobis laboriosam, cum corporis dolorum pariatur numquam iure vitae molestias. Rem, quis voluptas ipsam enim pariatur quasi quibusdam deserunt fugit? Voluptates, tempora itaque modi, at repellendus aspernatur similique et non tenetur placeat a in nesciunt dolores consectetur ipsa dicta natus, eveniet delectus sunt veritatis molestiae nihil sapiente mollitia."
let arrOfWords = textString.trim().split(/\s+/);
const getDelay = (word, wpm) => {
    const wordDelay = 60000 / wpm;

    if (/\.{3,}$/.test(word)) {
        return wordDelay * 3; // ellipsis
    }
    if (/[.!?]$/.test(word)) {
        return wordDelay * 2; // sentence ending
    }
    if (/[,;:]$/.test(word)) {
        return wordDelay * 1.5; // short pause
    }
    return wordDelay;
};



const RSVPmode = () => {
    const [wordToDisplay, setWordToDisplay] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [wordIndex, setWordIndex] = useState(0);
    useEffect(() => {
        let timerId;

        const displayNextWord = () => {
            if (!isPlaying || wordIndex >= arrOfWords.length) return;

            const word = arrOfWords[wordIndex];
            setWordToDisplay(word);

            timerId = setTimeout(() => {
                setWordIndex((currentIndex) => currentIndex + 1);
            }, getDelay(word, WPM));
        };

        displayNextWord();

        return () => clearTimeout(timerId);
    }, [isPlaying, wordIndex]);

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
    const loadCustomContent = () => {
        const customContent = document.querySelector("#custom-content");
        textString = customContent.value;
        arrOfWords = textString.trim().split(/\s+/);
        replay();
    }

    return (
        <main className="rsvp-workspace">
            <section className="rsvp-panel" aria-labelledby="rsvp-heading">
                <p className="rsvp-kicker">Rapid serial visual presentation</p>
                <h1 id="rsvp-heading">Read one word at a time</h1>
                <p className="rsvp-instruction">Focus on the red letter and let the words move at their own pace.</p>
                <div className="rsvp-display-cont">

                    <div className="rsvp-word">
                        <span className="wordPrefix">{wordToDisplay.slice(0, Math.floor(wordToDisplay.length / 2))}</span>
                        <span className="middleLetter">{wordToDisplay[Math.floor(wordToDisplay.length / 2)]}</span>
                        <span className="wordSuffix">{wordToDisplay.slice(Math.floor(wordToDisplay.length / 2) + 1)}</span>
                    </div>
                </div>
                <WPMcontroller
                    onPlay={play}
                    onPause={pause}
                    onReplay={replay}
                />
            </section>
            <aside className="content-selector" aria-labelledby="content-heading">
                <div className="content-selector-header">
                    <p className="rsvp-kicker">Your reading material</p>
                    <h2 id="content-heading">Choose your content</h2>
                </div>
                <form action="" method="get">
                    <label htmlFor="book-select">Reference book</label>
                    <select name="Select Book" id="book-select" defaultValue="">
                        <option value="" disabled>-- Choose a book --</option>
                        <option value="Atomic Habits">Atomic Habits</option>
                        <option value="The invisible man">The invisible man</option>
                        <option value="The Almanack of Naval Ravikant">The Almanack of Naval Ravikant</option>
                    </select>

                    <label htmlFor="custom-content">Custom content</label>
                    <textarea name="custom-content" id="custom-content" placeholder="Paste an article, chapter, or notes here..." />

                    <button className="load-content-btn" type="button" onClick={loadCustomContent}>Load reading material</button>
                </form>
            </aside>
        </main>
    );
};

export default RSVPmode