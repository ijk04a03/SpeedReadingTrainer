function getDelay(word, wpm) {
    const wordDelay = 60000 / wpm;

    if (/\.{3,}$/.test(word)) {
        return wordDelay * 3;
    }
    if (/[.!?]$/.test(word)) {
        return wordDelay * 2;
    }
    if (/[,;:]$/.test(word)) {
        return wordDelay * 1.5;
    }
    return wordDelay;
}

function getSavedProgress(contentKey) {
    const savedProgress = JSON.parse(localStorage.getItem("speed-reading-progress") || "{}");
    return Number(savedProgress[contentKey]) || 0;
}

function saveProgress(contentKey, wordIndex) {
    const savedProgress = JSON.parse(localStorage.getItem("speed-reading-progress") || "{}");
    savedProgress[contentKey] = wordIndex;
    localStorage.setItem("speed-reading-progress", JSON.stringify(savedProgress));
}

function getSavedWpm() {
    const savedWpm = Number(localStorage.getItem("speed-reading-wpm"));
    return savedWpm >= 200 && savedWpm <= 900 ? savedWpm : 200;
}

export { getDelay, getSavedProgress, getSavedWpm, saveProgress };
