import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Lock, Unlock, ShieldAlert, ArrowLeft, Ship, CheckCircle2, ShieldCheck, Link as LinkIcon } from 'lucide-react';
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
            linksDone = !!(links.lovable && links.github && links.live);
        }

        setPassedCount(checklistDone);
        setStepCount(stepsDone);
        setLinksValid(linksDone);
        setIsAuthorized(checklistDone === TOTAL_CHECKLIST && stepsDone === TOTAL_STEPS && linksDone);
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0f1e] text-white flex flex-col items-center justify-center p-6 font-sans">
            <div className="max-w-2xl w-full flex flex-col items-center">

                {!isAuthorized ? (
                    <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* Status Badge */}
                        <div className="flex justify-center">
                            <div className="px-5 py-1.5 bg-[#151b2d] border border-white/5 rounded-full flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">STATUS: IN PROGRESS</span>
                            </div>
                        </div>

                        {/* Locked Icon */}
                        <div className="flex justify-center">
                            <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-500">
                                <Lock size={40} className="stroke-[2.5]" />
                            </div>
                        </div>

                        {/* Text Block */}
                        <div className="text-center space-y-3">
                            <h1 className="text-3xl font-black uppercase tracking-tight text-white">SHIPPING PORTAL LOCKED</h1>
                            <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                                Quality Control bypass detected. Please complete all verification steps before deployment.
                            </p>
                        </div>

                        {/* Progress Card */}
                        <div className="bg-white rounded-[2rem] p-10 space-y-10 shadow-2xl">
                            <div className="space-y-8">
                                {/* Checklist */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-500">1. TEST CHECKLIST</span>
                                        <span className={passedCount === TOTAL_CHECKLIST ? 'text-emerald-500' : 'text-slate-400'}>
                                            {passedCount} / {TOTAL_CHECKLIST}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 ease-out ${passedCount === TOTAL_CHECKLIST ? 'bg-emerald-500' : 'bg-slate-800'}`}
                                            style={{ width: `${(passedCount / TOTAL_CHECKLIST) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Build Steps */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-500">2. BUILD STEP PROOF</span>
                                        <span className={stepCount === TOTAL_STEPS ? 'text-emerald-500' : 'text-slate-400'}>
                                            {stepCount} / {TOTAL_STEPS}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 ease-out ${stepCount === TOTAL_STEPS ? 'bg-emerald-500' : 'bg-slate-800'}`}
                                            style={{ width: `${(stepCount / TOTAL_STEPS) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Artifact Links */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-500">3. ARTIFACT LINKS</span>
                                        <span className={linksValid ? 'text-emerald-500' : 'text-slate-400'}>
                                            {linksValid ? 'VALID' : 'MISSING'}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 ease-out ${linksValid ? 'bg-emerald-500' : 'bg-slate-800'}`}
                                            style={{ width: linksValid ? '100%' : '0%' }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Link
                                    to="/prp/proof"
                                    className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-800 hover:text-primary transition-colors flex items-center gap-2"
                                >
                                    PROOF PAGE
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full space-y-10 animate-in zoom-in-95 fade-in duration-700">
                        {/* Shipped Status Badge */}
                        <div className="flex justify-center">
                            <div className="px-5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">STATUS: SHIPPED</span>
                            </div>
                        </div>

                        {/* Shipped Icon */}
                        <div className="flex justify-center">
                            <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
                                <Ship size={40} className="stroke-[2.5] animate-bounce" />
                            </div>
                        </div>

                        {/* Success Block */}
                        <div className="text-center space-y-6">
                            <h1 className="text-3xl font-black uppercase tracking-tight text-white">PROJECT AUTHENTICATED</h1>
                            <div className="space-y-4 max-w-sm mx-auto">
                                <p className="text-xl font-medium leading-relaxed italic text-white/90">
                                    "You built a real product.<br />
                                    Not a tutorial. Not a clone.<br />
                                    A structured tool that solves a real problem."
                                </p>
                                <p className="text-emerald-500 font-black uppercase tracking-[0.3em] text-[10px]">
                                    This is your proof of work.
                                </p>
                            </div>
                        </div>

                        <Card className="bg-[#151b2d] border border-emerald-500/20 rounded-[2rem] p-8 shadow-2xl shadow-emerald-900/10">
                            <CardContent className="p-0 space-y-8">
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: 'QC Checked', icon: CheckCircle2 },
                                        { label: 'Steps Verified', icon: ShieldCheck },
                                        { label: 'Artifacts OK', icon: LinkIcon }
                                    ].map((item, id) => (
                                        <div key={id} className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex flex-col items-center gap-3">
                                            <item.icon className="text-emerald-500" size={20} />
                                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 text-center">{item.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
                                >
                                    Confirm Final Shipment
                                </button>

                                <div className="flex justify-center gap-10">
                                    <Link to="/prp/proof" className="text-[9px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest">Proof Summary</Link>
                                    <Link to="/prp/07-test" className="text-[9px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest">Test Logs</Link>
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
