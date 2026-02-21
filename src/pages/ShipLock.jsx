import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Lock, Unlock, ShieldAlert, ArrowLeft, Ship, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'prp_checklist_state';
const TOTAL_REQUIRED = 10;

const ShipLock = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [passedCount, setPassedCount] = useState(0);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const state = JSON.parse(saved);
            const count = Object.values(state).filter(Boolean).length;
            setPassedCount(count);
            setIsAuthorized(count === TOTAL_REQUIRED);
        }
    }, []);

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
                        {/* Locked Content */}
                        <div className="flex flex-col items-center space-y-6">
                            <div className="w-24 h-24 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center text-red-500 shadow-2xl shadow-red-500/10">
                                <Lock size={48} className="animate-pulse" />
                            </div>
                            <div className="text-center space-y-2">
                                <h1 className="text-3xl font-black uppercase tracking-tighter">Shipping Portal Locked</h1>
                                <p className="text-slate-400 text-sm max-w-sm mx-auto">
                                    Quality Control bypass detected. Please complete the internal test checklist before deploying.
                                </p>
                            </div>
                        </div>

                        <Card className="bg-slate-800/50 border-white/10 backdrop-blur-md">
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                                        <span>Readiness Status</span>
                                        <span>{passedCount} / {TOTAL_REQUIRED} PASSED</span>
                                    </div>
                                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-red-500 transition-all duration-1000 ease-out"
                                            style={{ width: `${(passedCount / TOTAL_REQUIRED) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 items-start">
                                    <ShieldAlert className="text-red-500 flex-shrink-0" size={18} />
                                    <p className="text-xs text-red-200/80 leading-relaxed font-medium">
                                        System Integrity Check Failed: {TOTAL_REQUIRED - passedCount} critical test cases are still pending verification in the QC module.
                                    </p>
                                </div>

                                <Link
                                    to="/prp/07-test"
                                    className="flex items-center justify-center gap-2 w-full py-4 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-black uppercase tracking-widest text-xs transition-all active:scale-[0.98]"
                                >
                                    <ArrowLeft size={16} /> Return to QC Checklist
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in zoom-in-95 fade-in duration-700">
                        {/* Unlocked Content */}
                        <div className="flex flex-col items-center space-y-6">
                            <div className="w-24 h-24 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-500 shadow-2xl shadow-emerald-500/10">
                                <Unlock size={48} />
                            </div>
                            <div className="text-center space-y-2">
                                <h1 className="text-3xl font-black uppercase tracking-tighter">Authorized for Deployment</h1>
                                <p className="text-slate-400 text-sm max-w-sm mx-auto">
                                    All verification steps complete. System is stable and ready for final distribution.
                                </p>
                            </div>
                        </div>

                        <Card className="bg-slate-800/80 border-emerald-500/30 backdrop-blur-md shadow-2xl shadow-emerald-500/10">
                            <CardContent className="p-8 space-y-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex flex-col items-center gap-2">
                                        <CheckCircle2 className="text-emerald-500" size={24} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">QC Status</span>
                                        <span className="font-bold">VERIFIED</span>
                                    </div>
                                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex flex-col items-center gap-2">
                                        <Ship className="text-emerald-500" size={24} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Manifest</span>
                                        <span className="font-bold text-xs uppercase">READY</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => alert('Initiating Final Deployment Sequence...')}
                                    className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/30 transition-all active:scale-95 group"
                                >
                                    <span className="flex items-center justify-center gap-3">
                                        Launch Placement Prep <Ship className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
                                    </span>
                                </button>

                                <Link
                                    to="/prp/07-test"
                                    className="block text-center text-xs font-bold text-slate-500 hover:text-white transition-colors"
                                >
                                    ← Review Test Logs
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShipLock;
