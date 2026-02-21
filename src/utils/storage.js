const HISTORY_KEY = 'placement_prep_history';

export const saveAnalysis = (analysis) => {
    const history = getHistory();
    const newEntry = {
        ...analysis,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
    };
    localStorage.setItem(HISTORY_KEY, JSON.stringify([newEntry, ...history]));
    return newEntry;
};

export const getHistory = () => {
    try {
        const raw = localStorage.getItem(HISTORY_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        // Filter out corrupted or incomplete entries
        return parsed.filter(entry => entry && entry.id && entry.jdText);
    } catch (e) {
        console.error("Failed to parse history:", e);
        return [];
    }
};

export const getAnalysisById = (id) => {
    return getHistory().find(h => h.id === id);
};

export const updateAnalysis = (id, updates) => {
    const history = getHistory();
    const updatedHistory = history.map(entry =>
        entry.id === id ? { ...entry, ...updates } : entry
    );
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
};

export const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
};
