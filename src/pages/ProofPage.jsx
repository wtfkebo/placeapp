import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { CheckCircle2, Circle, Link as LinkIcon, ExternalLink, Copy, AlertCircle, ShieldCheck } from 'lucide-react';

const STEPS = [
    "Project Initialization",
    "Design System Foundation",
    "JD Data & Rendering",
    "Dashboard Logic",
    "Match Scoring Integration",
    "7-Day Strategy Engine",
    "History & Persistence",
    "Test Verification (10/10)"
];

const STORAGE_KEY = 'prp_final_submission';
const CHECKLIST_KEY = 'prp_checklist_state';

const ProofPage = () => {
    const [submission, setSubmission] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        try {
            return saved ? JSON.parse(saved) : {
                steps: Array(8).fill(false),
                links: { lovable: '', github: '', live: '' }
            };
        } catch (e) {
            return { steps: Array(8).fill(false), links: { lovable: '', github: '', live: '' } };
        }
    });

    const [checklistCount, setChecklistCount] = useState(0);
    const [errors, setErrors] = useState({});
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Sync checklist count
        const savedChecklist = localStorage.getItem(CHECKLIST_KEY);
        if (savedChecklist) {
            const state = JSON.parse(savedChecklist);
            const count = Object.values(state).filter(Boolean).length;
            setChecklistCount(count);

            // Automatically mark the last step if 10/10
            if (count === 10) {
                const newSteps = [...submission.steps];
                newSteps[7] = true;
                setSubmission(prev => ({ ...prev, steps: newSteps }));
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(submission));
    }, [submission]);

    const toggleStep = (index) => {
        if (index === 7) return; // Checklist step is automated
        const newSteps = [...submission.steps];
        newSteps[index] = !newSteps[index];
        setSubmission({ ...submission, steps: newSteps });
    };

    const validateUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    };

    const handleLinkChange = (key, value) => {
        setSubmission({
            ...submission,
            links: { ...submission.links, [key]: value }
        });

        if (value && !validateUrl(value)) {
            setErrors(prev => ({ ...prev, [key]: 'Invalid URL format' }));
        } else {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    const copySubmission = () => {
        const { links } = submission;
        const text = `------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${links.lovable || 'N/A'}
GitHub Repository: ${links.github || 'N/A'}
Live Deployment: ${links.live || 'N/A'}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------`;

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const allStepsDone = submission.steps.every(Boolean);
    const allLinksValid = submission.links.lovable && submission.links.github && submission.links.live && Object.keys(errors).length === 0;
    const isReady = allStepsDone && allLinksValid;

    return (
        <div className="min-h-screen bg-white py-12 px-6 font-serif">
            <div className="max-w-2xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-8">
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Project 1 — Placement Readiness Platform</h1>
                    <div className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase
                        ${isReady ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}
                    `}>
                        {isReady ? 'COMPLETED' : 'IN PROGRESS'}
                    </div>
                </div>

                {/* Section A */}
                <div className="space-y-6">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">A) STEP COMPLETION SUMMARY</h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 font-sans">
                        {STEPS.map((step, idx) => (
                            <div
                                key={idx}
                                onClick={() => toggleStep(idx)}
                                className={`flex items-center gap-3 group transition-opacity ${idx === 7 ? 'cursor-default' : 'cursor-pointer hover:opacity-80'}`}
                            >
                                <div className={submission.steps[idx] ? 'text-emerald-500' : 'text-slate-200'}>
                                    {submission.steps[idx] ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                                </div>
                                <span className={`text-sm font-medium ${submission.steps[idx] ? 'text-slate-900' : 'text-slate-400'}`}>
                                    {idx === 7 ? `Test Verification (${checklistCount}/10)` : step}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section B */}
                <div className="space-y-8 border-t border-slate-100 pt-10">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">B) ARTIFACT COLLECTION INPUTS</h2>

                    <div className="space-y-8 font-sans">
                        {[
                            { id: 'lovable', label: 'Lovable Project Link', placeholder: 'https://lovable.dev/...' },
                            { id: 'github', label: 'GitHub Repository Link', placeholder: 'https://github.com/...' },
                            { id: 'live', label: 'Deployed URL (Vercel)', placeholder: 'https://...' }
                        ].map(field => (
                            <div key={field.id} className="space-y-3">
                                <label className="text-sm font-bold text-slate-700">
                                    {field.label} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={submission.links[field.id]}
                                    onChange={(e) => handleLinkChange(field.id, e.target.value)}
                                    placeholder={field.placeholder}
                                    className={`w-full border p-3 rounded-lg text-sm transition-all outline-none
                                        ${errors[field.id] ? 'border-red-300 bg-red-50/20' : 'border-slate-200 focus:border-slate-400 bg-white'}
                                    `}
                                />
                                {errors[field.id] && (
                                    <p className="text-[10px] text-red-500 font-bold">{errors[field.id]}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="pt-8 space-y-4 font-sans text-center">
                    <button
                        onClick={copySubmission}
                        disabled={!isReady}
                        className={`w-full py-4 rounded-lg font-bold text-sm border-2 transition-all flex items-center justify-center gap-2
                            ${isReady
                                ? 'border-slate-800 bg-white text-slate-800 hover:bg-slate-800 hover:text-white'
                                : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'}
                        `}
                    >
                        {copied ? 'Copied to Clipboard!' : 'Copy Final Submission'} {!copied && <Copy size={14} />}
                    </button>
                    {!isReady && (
                        <p className="text-[10px] text-slate-400 font-bold">
                            Complete all tests and fields to unlock submission.
                        </p>
                    )}
                    {isReady && (
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <p className="text-xs text-emerald-800 font-bold">
                                Authentication Ready. Head to the Shipping Portal for final deployment.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProofPage;
