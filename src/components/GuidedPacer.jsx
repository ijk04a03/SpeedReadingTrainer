import { useEffect, useMemo, useRef, useState } from "react";
import { FetchGutenberg } from "./FetchGutenberg";
import { WPMcontroller } from "./WPMcontroller";
import { getDelay, getSavedProgress, getSavedWpm, saveProgress } from "../utils/readingUtils";

const defaultText = "Reading becomes easier when your eyes follow a steady rhythm. Let the page move at a comfortable pace while your attention stays with the meaning of each sentence. The goal is not to rush past the words. It is to give your eyes a clear path so that each phrase arrives at the right moment. Keep your shoulders relaxed, breathe normally, and allow the highlighted stream to carry you forward. With practice, your eyes begin to anticipate groups of words instead of stopping at every single one. That small change can make reading feel lighter and more natural. Stay curious about the ideas on the page, notice the shape of the argument, and let the pace support your understanding. If your focus drifts, pause for a moment and begin again from the current page. A steady rhythm is more useful than a frantic speed, and consistency is what turns a short exercise into a lasting reading habit. Choose a book when you are ready, or paste your own material into the content panel to keep practicing with text that matters to you.";

function GuidedPacer() {
    const [readingText, setReadingText] = useState(defaultText);
    const [customContent, setCustomContent] = useState("");
    const [contentKey, setContentKey] = useState("default");
    const [wordIndex, setWordIndex] = useState(() => getSavedProgress("default"));
    const [isPlaying, setIsPlaying] = useState(false);
    const [wpm, setWpm] = useState(getSavedWpm);
    const guidedTextRef = useRef(null);
    const activeLineRef = useRef(null);
    const lastScrollLine = useRef(null);
    const scrollLocked = useRef(false);
    const words = useMemo(
        () => readingText.trim().split(/\s+/).filter(Boolean),
        [readingText],
    );
    const [lineWidth, setLineWidth] = useState(0);
    const lines = useMemo(() => {
        if (!lineWidth) return [words];

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) return [words];
        context.font = '400 21px "Inter", sans-serif';
        const lineList = [];
        let currentLine = [];
        let currentWidth = 0;

        words.forEach((word) => {
            const wordWidth = context.measureText(`${word} `).width;

            if (currentLine.length > 0 && currentWidth + wordWidth > lineWidth) {
                lineList.push(currentLine);
                currentLine = [];
                currentWidth = 0;
            }

            currentLine.push(word);
            currentWidth += wordWidth;
        });

        if (currentLine.length > 0) {
            lineList.push(currentLine);
        }

        return lineList;
    }, [words, lineWidth]);
    const retainedWords = Math.ceil((wpm * 20) / 60);
    const lineStarts = useMemo(() => {
        let wordOffset = 0;
        return lines.map((line) => {
            const start = wordOffset;
            wordOffset += line.length;
            return start;
        });
    }, [lines]);
    const currentLineIndex = Math.max(0, lineStarts.findIndex((start, index) => {
        const lineEnd = start + lines[index].length;
        return wordIndex >= start && wordIndex < lineEnd;
    }));
    const currentLineStart = lineStarts[currentLineIndex] || 0;
    const visibleStartLine = Math.max(0, lineStarts.findIndex((start, index) => {
        return wordIndex - retainedWords < start + lines[index].length;
    }));
    const visibleLines = lines.slice(visibleStartLine, currentLineIndex + 12);
    const currentLineWordIndex = wordIndex - currentLineStart;
    const currentDelay = getDelay(words[wordIndex] || "", wpm);
    useEffect(() => {
        const container = guidedTextRef.current;
        if (!container) return undefined;

        const updateLineWidth = () => {
            const styles = window.getComputedStyle(container);
            const horizontalPadding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
            setLineWidth(Math.max(0, container.clientWidth - horizontalPadding));
        };

        updateLineWidth();
        const observer = new ResizeObserver(updateLineWidth);
        observer.observe(container);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isPlaying || wordIndex >= words.length - 1) return undefined;

        const timerId = setTimeout(() => {
            setWordIndex((currentIndex) => currentIndex + 1);
        }, getDelay(words[wordIndex], wpm));

        return () => clearTimeout(timerId);
    }, [isPlaying, wordIndex, words, wpm]);

    useEffect(() => {
        saveProgress(contentKey, wordIndex);
    }, [contentKey, wordIndex]);

    useEffect(() => {
        const container = guidedTextRef.current;
        const activeLine = activeLineRef.current;

        if (!container || !activeLine) return;

        const activeTop = activeLine.offsetTop - container.scrollTop;
        const topThreshold = container.clientHeight * 0.25;
        const bottomThreshold = container.clientHeight * 0.7;
        const needsScroll = activeTop < topThreshold || activeTop > bottomThreshold;
        const scrollMarker = `${visibleStartLine}:${currentLineIndex}`;

        if (needsScroll && currentLineIndex >= 0 && !scrollLocked.current && scrollMarker !== lastScrollLine.current) {
            lastScrollLine.current = scrollMarker;
            scrollLocked.current = true;
            container.scrollTo({
                top: Math.max(0, activeLine.offsetTop - container.clientHeight / 2),
                behavior: wpm >= 500 ? "auto" : "smooth",
            });
            window.setTimeout(() => {
                scrollLocked.current = false;
            }, Math.max(120, Math.min(500, currentDelay * 3)));
        }
    }, [currentLineIndex, visibleStartLine, wpm, currentDelay]);

    const loadContent = (content, nextContentKey = "custom") => {
        setReadingText(content);
        setContentKey(nextContentKey);
        setWordIndex(getSavedProgress(nextContentKey));
        setIsPlaying(false);
        lastScrollLine.current = null;
        scrollLocked.current = false;
    };

    const loadCustomContent = () => {
        if (customContent.trim()) {
            localStorage.setItem("speed-reading-custom-content", customContent);
            loadContent(customContent);
        }
    };

    const replay = () => {
        setWordIndex(0);
        setIsPlaying(true);
        lastScrollLine.current = null;
        scrollLocked.current = false;
    };

    return (
        <main className="rsvp-workspace">
            <section className="rsvp-panel" aria-labelledby="guided-pacer-heading">
                <p className="rsvp-kicker">Guided pacing</p>
                <h1 id="guided-pacer-heading">Follow the highlighted word</h1>
                <div
                    className="guided-text"
                    ref={guidedTextRef}
                    style={{ "--guided-highlight-duration": `${Math.min(300, currentDelay)}ms` }}
                    aria-live="polite"
                >
                    {visibleLines.length > 0 ? (
                        visibleLines.map((line, lineIndex) => {
                            const actualLineIndex = visibleStartLine + lineIndex;

                            return (
                                <p
                                    className="guided-line"
                                    key={actualLineIndex}
                                    ref={actualLineIndex === currentLineIndex ? activeLineRef : null}
                                >
                                    {line.map((word, wordOffset) => (
                                        <span
                                            className={
                                                actualLineIndex === currentLineIndex &&
                                                    wordOffset === currentLineWordIndex
                                                    ? "guided-word active"
                                                    : "guided-word"
                                            }
                                            key={`${word}-${actualLineIndex}-${wordOffset}`}
                                        >
                                            {word}{" "}
                                        </span>
                                    ))}
                                </p>
                            );
                        })
                    ) : "Choose a book or load custom text to begin."}
                </div>
                <p className="guided-progress" aria-live="polite">
                    Word {Math.min(wordIndex + 1, words.length)} of {words.length || 1}
                </p>
                <WPMcontroller
                    onPlay={() => setIsPlaying(wordIndex < words.length - 1)}
                    onPause={() => setIsPlaying(false)}
                    onReplay={replay}
                    onWpmChange={setWpm}
                />
            </section>
            <aside className="content-selector" aria-labelledby="guided-content-heading">
                <div className="content-selector-header">
                    <p className="rsvp-kicker">Your reading material</p>
                    <h2 id="guided-content-heading">Choose your content</h2>
                </div>
                <form onSubmit={(event) => event.preventDefault()}>
                    <label htmlFor="book-select">Reference book</label>
                    <FetchGutenberg onBookSelect={loadContent} />
                    <label htmlFor="guided-custom-content">Custom content</label>
                    <textarea
                        id="guided-custom-content"
                        value={customContent}
                        onChange={(event) => setCustomContent(event.target.value)}
                        placeholder="Paste an article, chapter, or notes here..."
                    />
                    <button className="load-content-btn" type="button" onClick={loadCustomContent}>Load reading material</button>
                </form>
            </aside>
        </main>
    );
}

export default GuidedPacer;
