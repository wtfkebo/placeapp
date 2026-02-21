import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { CheckCircle2, Circle, Link as LinkIcon, ExternalLink, Copy, AlertCircle, Save } from 'lucide-react';

const STEPS = [
    "Project Initialization & Setup",
    "Core Design System & Tokens",
    "JD Extraction & Skill Engine",
    "Round Mapping & Intelligence",
    "7-Day Strategy Generation",
    "History Persistence Layer",
    "Verification & Data Hardening",
    "Proof of Work & Final Submission"
];

const STORAGE_KEY = 'prp_final_submission';

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

    const [errors, setErrors] = useState({});
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(submission));
    }, [submission]);

    const toggleStep = (index) => {
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

    return (
        <div className="min-h-screen bg-slate-50 p-8 pt-12">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Proof of Work</h1>
                        <p className="text-slate-500 font-medium italic">Validate your artifacts and prepare for final shipping.</p>
                    </div>
                    <button
                        onClick={copySubmission}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg
                            ${copied ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20'}
                        `}
                    >
                        {copied ? (
                            <><CheckCircle2 size={18} /> Copied!</>
                        ) : (
                            <><Copy size={18} /> Copy Final Submission</>
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Step Completion Overview */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Step Completion ({submission.steps.filter(Boolean).length}/8)</h2>
                        </div>
                        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                            {STEPS.map((step, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => toggleStep(idx)}
                                    className={`flex items-center gap-4 p-4 border-b last:border-0 border-slate-50 cursor-pointer transition-colors group
                                        ${submission.steps[idx] ? 'bg-emerald-50/30' : 'hover:bg-slate-50'}`}
                                >
                                    <div className={`transition-colors ${submission.steps[idx] ? 'text-emerald-500' : 'text-slate-200 group-hover:text-slate-300'}`}>
                                        {submission.steps[idx] ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                                    </div>
                                    <span className={`text-sm font-bold tracking-tight ${submission.steps[idx] ? 'text-emerald-900' : 'text-slate-600'}`}>
                                        {step}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Artifact Inputs */}
                    <div className="space-y-4">
                        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Artifact Verification</h2>
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                            {[
                                { id: 'lovable', label: 'Lovable Project Link', placeholder: 'https://lovable.dev/projects/...' },
                                { id: 'github', label: 'GitHub Repository', placeholder: 'https://github.com/username/repo' },
                                { id: 'live', label: 'Live Deployment', placeholder: 'https://project.vercel.app' }
                            ].map(link => (
                                <div key={link.id} className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                        <LinkIcon size={12} /> {link.label}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={submission.links[link.id]}
                                            onChange={(e) => handleLinkChange(link.id, e.target.value)}
                                            placeholder={link.placeholder}
                                            className={`w-full bg-slate-50 border px-4 py-3 rounded-xl text-sm font-medium transition-all outline-none
                                                ${errors[link.id] ? 'border-red-200 ring-2 ring-red-500/10' : 'border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/10'}
                                            `}
                                        />
                                        {submission.links[link.id] && !errors[link.id] && (
                                            <a
                                                href={submission.links[link.id]}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors"
                                            >
                                                <ExternalLink size={14} />
                                            </a>
                                        )}
                                    </div>
                                    {errors[link.id] && (
                                        <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                                            <AlertCircle size={10} /> {errors[link.id]}
                                        </p>
                                    )}
                                </div>
                            ))}

                            <div className="pt-4">
                                <div className={`flex items-center gap-3 p-4 rounded-2xl border transition-all
                                    ${allLinksValid ? 'bg-emerald-50 border-emerald-100 text-emerald-900' : 'bg-slate-50 border-slate-100 text-slate-400'}
                                `}>
                                    <div className={allLinksValid ? 'text-emerald-500' : 'text-slate-300'}>
                                        <ShieldCheck size={20} />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest">
                                        {allLinksValid ? 'All Artifacts Validated' : 'Links Required for Shipping'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {!allStepsDone || !allLinksValid && (
                    <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl flex gap-4 items-start">
                        <AlertCircle className="text-amber-500 mt-0.5" size={20} />
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold text-amber-900">Submission Blocked</h3>
                            <p className="text-xs text-amber-800 font-medium leading-relaxed opacity-80">
                                You must complete all 8 build steps and provide valid artifacts before authorization.
                                Current Status: {submission.steps.filter(Boolean).length}/8 Steps | {allLinksValid ? 'Links OK' : 'Links Pending'}
                            </p>
                        </div>
                    </div>
                )}

                {allStepsDone && allLinksValid && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 bg-slate-900 p-8 rounded-[2rem] text-center space-y-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                        <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                            <CheckCircle2 size={40} />
                        </div>
                        <div className="space-y-2 relative z-10">
                            <h2 className="text-2xl font-black text-white">Proof of Work Verified</h2>
                            <p className="text-slate-400 text-sm max-w-lg mx-auto">
                                All technical requirements and artifacts have been successfully documented.
                                Final authorization is now pending at the Shipping Portal.
                            </p>
                        </div>
                        <a
                            href="/prp/08-ship"
                            className="inline-flex items-center gap-2 px-12 py-4 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl shadow-primary/30"
                        >
                            Proceed to Shipping Portal <ExternalLink size={16} />
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProofPage;
