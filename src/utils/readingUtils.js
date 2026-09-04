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

function getPracticeStats() {
    try {
        return JSON.parse(localStorage.getItem("speed-reading-stats")) || {
            totalSeconds: 0,
            bestWpm: 0,
            practiceDays: [],
        };
    } catch {
        return { totalSeconds: 0, bestWpm: 0, practiceDays: [] };
    }
}

function savePracticeStats(stats) {
    localStorage.setItem("speed-reading-stats", JSON.stringify(stats));
}

function recordPracticeSecond() {
    const stats = getPracticeStats();
    const today = new Date().toISOString().slice(0, 10);
    const practiceDays = stats.practiceDays.includes(today)
        ? stats.practiceDays
        : [...stats.practiceDays, today];

    savePracticeStats({
        ...stats,
        totalSeconds: stats.totalSeconds + 1,
        practiceDays,
    });
}

function recordBestWpm(wpm) {
    const stats = getPracticeStats();
    if (wpm <= stats.bestWpm) return;
    savePracticeStats({ ...stats, bestWpm: wpm });
}

export {
    getDelay,
    getSavedProgress,
    getSavedWpm,
    getPracticeStats,
    recordBestWpm,
    recordPracticeSecond,
    saveProgress,
};
