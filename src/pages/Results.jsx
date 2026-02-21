import React, { useState, useEffect } from 'react'
import { useLocation, Navigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import {
    ArrowLeft, CheckCircle2, ListChecks, CalendarDays, HelpCircle,
    Copy, Download, BrainCircuit, Rocket, Activity, Building2
} from 'lucide-react'
import { getHistory, updateAnalysis } from '../utils/storage'

const Results = () => {
    const location = useLocation()
    const history = getHistory()

    // Helper to get result from location or history
    const getTargetResult = () => {
        const stateResult = location.state?.result
        let target = null

        if (stateResult?.id) {
            target = history.find(h => h.id === stateResult.id) || stateResult
        } else {
            target = history.length > 0 ? history[0] : null
        }

        if (target) {
            // Schema Compatibility Layer: Map legacy keys to new ones
            return {
                ...target,
                roundMapping: target.roundMapping || target.dynamicRounds || [],
                plan7Days: target.plan7Days || target.plan || [],
                finalScore: target.finalScore || target.readinessScore || 0,
                baseScore: target.baseScore || target.baseReadinessScore || target.readinessScore || 0
            }
        }
        return null
    }

    const initialResult = getTargetResult()
    const [result, setResult] = useState(initialResult)
    const [confidenceMap, setConfidenceMap] = useState(initialResult?.skillConfidenceMap || {})
    const [currentScore, setCurrentScore] = useState(initialResult?.finalScore || 0)

    useEffect(() => {
        const active = getTargetResult()
        if (active) {
            setResult(active)
            setConfidenceMap(active.skillConfidenceMap || {})
            setCurrentScore(active.finalScore || 0)
        }
    }, [location.state?.result, location.pathname]) // Also trigger on path change

    if (!result) {
        if (getHistory().length === 0) return <Navigate to="/dashboard" replace />
        return <div className="p-12 text-center text-slate-500">Loading analysis...</div>
    }

    const activeResult = result
    const skills = Object.values(activeResult.extractedSkills).flat()

    // Handle skill toggle
    const toggleSkill = (skill) => {
        const currentStatus = confidenceMap[skill] || 'practice'
        const newStatus = currentStatus === 'know' ? 'practice' : 'know'

        const newMap = { ...confidenceMap, [skill]: newStatus }
        setConfidenceMap(newMap)

        // Calculate live score logic: +2 for 'know', -2 for 'practice' (relative to baseline)
        const base = activeResult.baseScore || activeResult.finalScore || 0

        let bonus = 0
        Object.keys(newMap).forEach(s => {
            if (newMap[s] === 'know') bonus += 2
            else bonus -= 2
        })

        const newScore = Math.max(0, Math.min(100, base + bonus))
        setCurrentScore(newScore)

        // Persist to history with strict field updates
        updateAnalysis(activeResult.id, {
            skillConfidenceMap: newMap,
            finalScore: newScore,
            updatedAt: new Date().toISOString()
        })
    }

    // Export functions
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        alert('Copied to clipboard!')
    }

    const downloadAsTxt = () => {
        const content = `
PLACEMENT READINESS PLAN: ${activeResult.company || 'Direct Apply'} - ${activeResult.role || 'General Role'}
Readiness Score: ${currentScore}/100
Date: ${new Date(activeResult.createdAt).toLocaleDateString()}

SKILLS DETECTED:
${Object.entries(activeResult.extractedSkills).map(([cat, ss]) => `${cat}: ${ss.join(', ')}`).join('\n')}

7-DAY PLAN:
${activeResult.plan7Days.map(d => `${d.day} - ${d.focus}: ${d.tasks.join(', ')}`).join('\n')}

PREPARATION CHECKLIST:
${activeResult.checklist.map(c => `${c.roundTitle}:\n - ${c.items.join('\n - ')}`).join('\n\n')}

TOP 10 INTERVIEW QUESTIONS:
${activeResult.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
        `.trim()

        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Prep_Plan_${activeResult.company || 'Analysis'}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const weakSkills = skills.filter(s => (confidenceMap[s] || 'practice') === 'practice').slice(0, 3)

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex items-center justify-between">
                <Link to="/dashboard/history" className="flex items-center gap-2 text-primary font-medium hover:underline">
                    <ArrowLeft size={18} /> Back to History
                </Link>
                <div className="flex items-center gap-4">
                    <button
                        onClick={downloadAsTxt}
                        className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
                    >
                        <Download size={16} /> Download TXT
                    </button>
                    <div className="bg-primary text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2">
                        <Activity size={16} /> Score: {currentScore}/100
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Extracted Skills with Toggle */}
                <Card className="lg:col-span-1 border-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <CheckCircle2 size={18} className="text-emerald-500" /> Self Assessment
                        </CardTitle>
                        <BrainCircuit size={18} className="text-primary/40" />
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        <p className="text-xs text-slate-500 mb-4 font-medium italic">
                            Toggle skills to update your readiness score in real-time.
                        </p>
                        {Object.entries(activeResult.extractedSkills).map(([category, catSkills]) => {
                            if (catSkills.length === 0) return null;
                            return (
                                <div key={category}>
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                                        {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {catSkills.map(skill => {
                                            const isKnown = confidenceMap[skill] === 'know'
                                            return (
                                                <button
                                                    key={skill}
                                                    onClick={() => toggleSkill(skill)}
                                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border flex flex-col items-start gap-1 min-w-[120px] ${isKnown
                                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm'
                                                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-primary/30'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        {isKnown ? <CheckCircle2 size={12} /> : <div className="w-2 h-2 rounded-full bg-slate-200" />}
                                                        <span className="text-xs uppercase">{skill}</span>
                                                    </div>
                                                    <span className={`text-[9px] font-medium opacity-70 ${isKnown ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                        {isKnown ? 'I know this' : 'Need practice'}
                                                    </span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>

                {/* Company Intel Block */}
                <Card className="lg:col-span-2 bg-gradient-to-br from-slate-50 to-white border-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Building2 size={18} className="text-primary" /> Company Intelligence
                        </CardTitle>
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">Heuristic Analysis</span>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Industry</label>
                                <p className="text-sm font-bold text-slate-900">{activeResult.companyIntel?.industry || 'Technology Services'}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Size Category</label>
                                <p className="text-sm font-bold text-slate-900">{activeResult.companyIntel?.sizeCategory || 'Startup (<200)'}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hiring Focus</label>
                                <p className="text-sm font-bold text-primary">{activeResult.companyIntel?.hiringFocus || 'General Competency'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Round Mapping Timeline */}
                <Card className="lg:col-span-1 row-span-2 border-primary/10">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Rocket size={18} className="text-primary" /> Interview Round Flow
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/20 before:via-primary/20 before:to-transparent">
                            {(activeResult.roundMapping || []).map((round, idx) => (
                                <div key={idx} className="relative flex items-start gap-6 group">
                                    <div className={`absolute left-0 mt-1.5 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center text-xs font-bold shadow-sm transition-all z-10 ${idx === 0 ? 'bg-primary text-white scale-110 ring-4 ring-primary/10' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {idx + 1}
                                    </div>
                                    <div className="ml-12 space-y-1.5">
                                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{round.roundTitle}</h4>
                                        <div className="text-[10px] font-bold text-primary/60 uppercase tracking-wider">{(round.focusAreas || []).join(', ')}</div>
                                        <p className="text-xs text-slate-500 leading-relaxed bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                                            {round.whyItMatters}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 7-Day Plan with Export */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-base flex items-center gap-2">
                            <CalendarDays size={18} className="text-primary" /> 7-Day Strategy
                        </CardTitle>
                        <button
                            onClick={() => copyToClipboard(activeResult.plan7Days.map(d => `${d.day}: ${d.focus}`).join('\n'))}
                            className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-[10px] font-bold text-slate-600 transition-all uppercase tracking-tighter"
                        >
                            <Copy size={12} /> Copy Plan
                        </button>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="space-y-4">
                            {activeResult.plan7Days.map((step, i) => (
                                <div key={i} className="flex gap-4 p-4 bg-slate-50/50 rounded-xl border border-slate-100 border-l-4 border-l-primary transition-colors hover:bg-slate-50">
                                    <div className="font-bold text-primary min-w-[70px] text-sm uppercase tracking-tighter">{step.day}</div>
                                    <div>
                                        <h5 className="font-bold text-slate-900 text-sm">{step.focus}</h5>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{(step.tasks || []).join(', ')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Round-wise Checklist with Export */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-base flex items-center gap-2">
                            <ListChecks size={18} className="text-primary" /> Preparation Checklist
                        </CardTitle>
                        <button
                            onClick={() => copyToClipboard(activeResult.checklist.map(c => `${c.roundTitle}:\n- ${c.items.join('\n- ')}`).join('\n\n'))}
                            className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-[10px] font-bold text-slate-600 transition-all uppercase tracking-tighter"
                        >
                            <Copy size={12} /> Copy Round Checklist
                        </button>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="grid md:grid-cols-2 gap-6">
                            {activeResult.checklist.map((round, i) => (
                                <div key={i} className="space-y-3">
                                    <h4 className="font-bold text-slate-900 text-xs border-b border-slate-100 pb-2 flex items-center justify-between">
                                        {round.roundTitle}
                                        <span className="text-[10px] text-primary bg-primary/5 px-2 py-0.5 rounded-full">Phase {i + 1}</span>
                                    </h4>
                                    <ul className="space-y-2">
                                        {round.items.map((item, j) => (
                                            <li key={j} className="flex items-start gap-2 text-xs text-slate-600">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mt-1.5 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Likely Interview Questions with Export */}
                <Card className="lg:col-span-1 border-amber-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-base flex items-center gap-2">
                            <HelpCircle size={18} className="text-amber-500" /> Likely Questions
                        </CardTitle>
                        <button
                            onClick={() => copyToClipboard(activeResult.questions.map((q, i) => `${i + 1}. ${q}`).join('\n'))}
                            className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 hover:bg-amber-100 rounded-md text-[10px] font-bold text-amber-700 transition-all uppercase tracking-tighter"
                        >
                            <Copy size={12} /> Copy Questions
                        </button>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        {activeResult.questions.map((q, i) => (
                            <div key={i} className="p-3 bg-slate-50/50 rounded-lg border border-slate-100 text-[13px] text-slate-700 leading-relaxed hover:bg-slate-50 transition-colors">
                                <span className="font-bold text-primary mr-2">Q{i + 1}:</span> {q}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Action Next Box */}
            <div className="mt-12 bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute right-0 top-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary-foreground/60 text-xs font-bold uppercase tracking-widest">
                            <Rocket size={14} className="text-primary" /> Your Next Move
                        </div>
                        <h3 className="text-2xl font-bold">Ready to dominate?</h3>
                        <p className="text-slate-400 text-sm max-w-sm">
                            Focus on your {weakSkills.length} remaining priorities: <span className="text-white font-medium">{weakSkills.join(', ') || 'your final revision'}</span>.
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                            <span className="text-emerald-400 font-bold">Start Day 1 plan now.</span>
                        </div>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/40"
                        >
                            Let's Begin
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-[10px] text-slate-400 font-medium italic">
                    Demo Mode: Company intel generated heuristically.
                </p>
            </div>
        </div>
    )
}

export default Results
