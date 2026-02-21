import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Lock, Unlock, ShieldAlert, ArrowLeft, Ship, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'prp_checklist_state';
const SUBMISSION_KEY = 'prp_final_submission';
const TOTAL_CHECKLIST = 10;
const TOTAL_STEPS = 8;

const ShipLock = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [passedCount, setPassedCount] = useState(0);
    const [stepCount, setStepCount] = useState(0);
    const [linksValid, setLinksValid] = useState(false);

    useEffect(() => {
        const savedChecklist = localStorage.getItem(STORAGE_KEY);
        const savedSubmission = localStorage.getItem(SUBMISSION_KEY);

        let checklistDone = 0;
        let stepsDone = 0;
        let linksDone = false;

        if (savedChecklist) {
            const state = JSON.parse(savedChecklist);
            checklistDone = Object.values(state).filter(Boolean).length;
        }

        if (savedSubmission) {
            const submission = JSON.parse(savedSubmission);
            stepsDone = (submission.steps || []).filter(Boolean).length;
            const links = submission.links || {};
            linksDone = links.lovable && links.github && links.live;
        }

        setPassedCount(checklistDone);
        setStepCount(stepsDone);
        setLinksValid(linksDone);
        setIsAuthorized(checklistDone === TOTAL_CHECKLIST && stepsDone === TOTAL_STEPS && linksDone);
    }, []);

    const allConditionsMet = isAuthorized;

    return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-xl w-full relative z-10">
                {!isAuthorized ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* Status Badge */}
                        <div className="flex justify-center">
                            <div className="px-4 py-1.5 bg-slate-800/80 border border-white/10 rounded-full flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Status: In Progress</span>
                            </div>
                        </div>

                        {/* Locked Content */}
                        <div className="flex flex-col items-center space-y-6">
                            <div className="w-24 h-24 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center text-red-500 shadow-2xl shadow-red-500/10">
                                <Lock size={48} className="animate-pulse" />
                            </div>
                            <div className="text-center space-y-2">
                                <h1 className="text-3xl font-black uppercase tracking-tighter">Shipping Portal Locked</h1>
                                <p className="text-slate-400 text-sm max-w-sm mx-auto">
                                    Quality Control bypass detected. Please complete all verification steps before deployment.
                                </p>
                            </div>
                        </div>

                        <Card className="bg-slate-800/50 border-white/10 backdrop-blur-md">
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-6">
                                    {/* Checklist Condition */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                            <span>1. Test Checklist</span>
                                            <span className={passedCount === TOTAL_CHECKLIST ? 'text-emerald-500' : 'text-slate-400'}>
                                                {passedCount} / {TOTAL_CHECKLIST}
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-1000 ease-out ${passedCount === TOTAL_CHECKLIST ? 'bg-emerald-500' : 'bg-red-500'}`}
                                                style={{ width: `${(passedCount / TOTAL_CHECKLIST) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Steps Condition */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                            <span>2. Build Step Proof</span>
                                            <span className={stepCount === TOTAL_STEPS ? 'text-emerald-500' : 'text-slate-400'}>
                                                {stepCount} / {TOTAL_STEPS}
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-1000 ease-out ${stepCount === TOTAL_STEPS ? 'bg-emerald-500' : 'bg-red-500'}`}
                                                style={{ width: `${(stepCount / TOTAL_STEPS) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Links Condition */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                            <span>3. Artifact Links</span>
                                            <span className={linksValid ? 'text-emerald-500' : 'text-slate-400'}>
                                                {linksValid ? 'VALID' : 'MISSING'}
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-1000 ease-out ${linksValid ? 'bg-emerald-500' : 'bg-red-500'}`}
                                                style={{ width: linksValid ? '100%' : '0%' }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Link
                                        to="/prp/07-test"
                                        className="flex items-center justify-center gap-2 py-4 border border-white/10 hover:bg-white/5 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all"
                                    >
                                        Checklist
                                    </Link>
                                    <Link
                                        to="/prp/proof"
                                        className="flex items-center justify-center gap-2 py-4 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all"
                                    >
                                        Proof Page
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in zoom-in-95 fade-in duration-700">
                        {/* Status Badge */}
                        <div className="flex justify-center">
                            <div className="px-4 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Status: Shipped</span>
                            </div>
                        </div>

                        {/* Unlocked Content */}
                        <div className="flex flex-col items-center space-y-6">
                            <div className="w-24 h-24 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-500 shadow-2xl shadow-emerald-500/10">
                                <Ship size={48} className="animate-bounce" />
                            </div>
                            <div className="text-center space-y-4">
                                <h1 className="text-3xl font-black uppercase tracking-tighter">Project Authenticated</h1>
                                <div className="space-y-2 max-w-sm mx-auto">
                                    <p className="text-white font-bold leading-relaxed">
                                        "You built a real product.<br />
                                        Not a tutorial. Not a clone.<br />
                                        A structured tool that solves a real problem."
                                    </p>
                                    <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                                        This is your proof of work.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Card className="bg-slate-800/80 border-emerald-500/30 backdrop-blur-md shadow-2xl shadow-emerald-500/10">
                            <CardContent className="p-8 space-y-8">
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex flex-col items-center gap-2">
                                        <CheckCircle2 className="text-emerald-500" size={20} />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 text-center">QC Checked</span>
                                    </div>
                                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex flex-col items-center gap-2">
                                        <ShieldCheck className="text-emerald-500" size={20} />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 text-center">Steps Verified</span>
                                    </div>
                                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex flex-col items-center gap-2">
                                        <LinkIcon className="text-emerald-500" size={20} />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 text-center">Artifacts OK</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => alert('Final Distribution Initialized. 🏆')}
                                    className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/30 transition-all active:scale-95 group"
                                >
                                    Confirm Final Shipment
                                </button>

                                <div className="flex justify-center gap-6">
                                    <Link to="/prp/proof" className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest">Proof Summary</Link>
                                    <Link to="/prp/07-test" className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest">Test Logs</Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShipLock;
