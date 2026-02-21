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
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
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
