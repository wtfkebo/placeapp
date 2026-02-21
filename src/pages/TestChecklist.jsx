import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { CheckCircle2, Circle, AlertCircle, RotateCcw } from 'lucide-react';

const TEST_ITEMS = [
    { id: 'validation', label: 'JD required validation works', hint: 'Try to submit the analysis form without pasting any text.' },
    { id: 'warning', label: 'Short JD warning shows for <200 chars', hint: 'Paste a very short sentence like "I want a job" and see if the alert appears.' },
    { id: 'extraction', label: 'Skills extraction groups correctly', hint: 'Paste a JD with specific keywords like "React", "Python", "SQL" and verify categories.' },
    { id: 'mapping', label: 'Round mapping changes based on company + skills', hint: 'Compare results for "Google" (Enterprise) vs a generic name (Startup).' },
    { id: 'deterministic', label: 'Score calculation is deterministic', hint: 'Analyze the same JD twice and ensure the readiness score remains identical.' },
    { id: 'live_score', label: 'Skill toggles update score live', hint: 'Go to Results and toggle "Need practice" to "I know this" - verify score +2.' },
    { id: 'persistence', label: 'Changes persist after refresh', hint: 'Toggle some skills, refresh the page, and ensure the score/stats stay updated.' },
    { id: 'history', label: 'History saves and loads correctly', hint: 'Check if the analysis appears in History page with correct metadata.' },
    { id: 'export', label: 'Export buttons copy the correct content', hint: 'Click "Copy Plan" or "Download TXT" and verify the output includes all sections.' },
    { id: 'console', label: 'No console errors on core pages', hint: 'Open DevTools (F12) and browse Dashboard, Results, and History.' },
];

const STORAGE_KEY = 'prp_checklist_state';

const TestChecklist = () => {
    const [checkedItems, setCheckedItems] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedItems));
    }, [checkedItems]);

    const toggleItem = (id) => {
        setCheckedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const resetChecklist = () => {
        if (window.confirm('Reset all test progress?')) {
            setCheckedItems({});
        }
    };

    const passedCount = TEST_ITEMS.filter(item => checkedItems[item.id]).length;
    const isComplete = passedCount === 10;

    return (
        <div className="min-h-screen bg-slate-50 p-8 pt-12">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">PRP Ready-to-Ship Checklist</h1>
                    <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Overall Progress</p>
                            <h2 className="text-2xl font-black text-primary">Tests Passed: {passedCount} / 10</h2>
                        </div>
                        <button
                            onClick={resetChecklist}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                        >
                            <RotateCcw size={14} /> Reset checklist
                        </button>
                    </div>

                    {!isComplete && (
                        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-900 px-6 py-4 rounded-xl shadow-sm">
                            <AlertCircle className="text-amber-500" size={20} />
                            <p className="text-sm font-bold uppercase tracking-wide">Fix issues before shipping.</p>
                        </div>
                    )}
                </div>

                {/* Checklist Section */}
                <div className="space-y-4">
                    {TEST_ITEMS.map((item) => {
                        const isChecked = !!checkedItems[item.id];
                        return (
                            <div
                                key={item.id}
                                onClick={() => toggleItem(item.id)}
                                className={`group flex items-start gap-5 p-5 bg-white rounded-2xl border transition-all cursor-pointer select-none
                                    ${isChecked ? 'border-primary/20 bg-primary/5 opacity-80' : 'border-slate-200 hover:border-primary/40 hover:shadow-md'}
                                `}
                            >
                                <div className={`mt-1 transition-colors ${isChecked ? 'text-primary' : 'text-slate-300 group-hover:text-primary/50'}`}>
                                    {isChecked ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                </div>
                                <div className="space-y-1">
                                    <h3 className={`font-bold transition-colors ${isChecked ? 'text-primary' : 'text-slate-900'}`}>{item.label}</h3>
                                    {item.hint && (
                                        <p className="text-xs text-slate-500 leading-relaxed max-w-lg italic">
                                            {item.hint}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Action */}
                {isComplete && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Card className="bg-slate-900 border-none shadow-2xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <CardContent className="p-8 flex flex-col items-center text-center space-y-4 relative z-10">
                                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mb-2 shadow-lg shadow-primary/20 animate-bounce">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-white">System Verified!</h3>
                                <p className="text-slate-400 text-sm max-w-md">
                                    All core features have been manually verified. You are now authorized to proceed to the Shipping Portal.
                                </p>
                                <a
                                    href="/prp/08-ship"
                                    className="mt-4 px-10 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-xl shadow-primary/30"
                                >
                                    Proceed to Ship
                                </a>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestChecklist;
