import React, { useState, useEffect } from 'react'
import { useLocation, Navigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import {
    ArrowLeft, CheckCircle2, ListChecks, CalendarDays, HelpCircle,
    Copy, Download, BrainCircuit, Rocket, Activity
} from 'lucide-react'
import { getHistory, updateAnalysis } from '../utils/storage'

const Results = () => {
    const location = useLocation()
    const [result, setResult] = useState(null)
    const [confidenceMap, setConfidenceMap] = useState({})
    const [currentScore, setCurrentScore] = useState(0)

    useEffect(() => {
        const loadInitialData = () => {
            const stateResult = location.state?.result
            const history = getHistory()

            let active = null
            if (stateResult?.id) {
                // If we have an ID from history click, get the LATEST version of that entry
                active = history.find(h => h.id === stateResult.id) || stateResult
            } else if (history.length > 0) {
                // Fallback to latest analysis if direct access
                active = history[0]
            }

            if (active) {
                setResult(active)
                setConfidenceMap(active.skillConfidenceMap || {})
                setCurrentScore(active.readinessScore || 0)
            }
        }

        loadInitialData()
    }, [location.state?.result])

    if (!result) {
        const history = getHistory()
        if (history.length === 0) return <Navigate to="/dashboard" replace />
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
        const base = activeResult.baseReadinessScore || activeResult.readinessScore || 0

        let bonus = 0
        Object.keys(newMap).forEach(s => {
            if (newMap[s] === 'know') bonus += 2
            else bonus -= 2
        })

        const newScore = Math.max(0, Math.min(100, base + bonus))
        setCurrentScore(newScore)

        // Persist to history
        updateAnalysis(activeResult.id, {
            skillConfidenceMap: newMap,
            readinessScore: newScore
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
${activeResult.plan.map(d => `${d.day} - ${d.topic}: ${d.details}`).join('\n')}

PREPARATION CHECKLIST:
${activeResult.checklist.map(c => `${c.round}:\n - ${c.items.join('\n - ')}`).join('\n\n')}

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
                        {Object.entries(activeResult.extractedSkills).map(([category, catSkills]) => (
                            <div key={category}>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{category}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {catSkills.map(skill => {
                                        const isKnown = confidenceMap[skill] === 'know'
                                        return (
                                            <button
                                                key={skill}
                                                onClick={() => toggleSkill(skill)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${isKnown
                                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm'
                                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-primary/30'
                                                    }`}
                                            >
                                                {isKnown ? <CheckCircle2 size={12} /> : <div className="w-2 h-2 rounded-full bg-slate-200" />}
                                                {skill}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* 7-Day Plan with Export */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-base flex items-center gap-2">
                            <CalendarDays size={18} className="text-primary" /> 7-Day Strategy
                        </CardTitle>
                        <button
                            onClick={() => copyToClipboard(activeResult.plan.map(d => `${d.day}: ${d.topic}`).join('\n'))}
                            className="text-slate-400 hover:text-primary transition-colors"
                            title="Copy Plan"
                        >
                            <Copy size={16} />
                        </button>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="space-y-4">
                            {activeResult.plan.map((step, i) => (
                                <div key={i} className="flex gap-4 p-4 bg-slate-50/50 rounded-xl border border-slate-100 border-l-4 border-l-primary transition-colors hover:bg-slate-50">
                                    <div className="font-bold text-primary min-w-[70px] text-sm uppercase tracking-tighter">{step.day}</div>
                                    <div>
                                        <h5 className="font-bold text-slate-900 text-sm">{step.topic}</h5>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{step.details}</p>
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
                            onClick={() => copyToClipboard(activeResult.checklist.map(c => `${c.round}:\n- ${c.items.join('\n- ')}`).join('\n\n'))}
                            className="text-slate-400 hover:text-primary transition-colors"
                            title="Copy Checklist"
                        >
                            <Copy size={16} />
                        </button>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="grid md:grid-cols-2 gap-6">
                            {activeResult.checklist.map((round, i) => (
                                <div key={i} className="space-y-3">
                                    <h4 className="font-bold text-slate-900 text-xs border-b border-slate-100 pb-2 flex items-center justify-between">
                                        {round.round}
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
                <Card className="lg:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-base flex items-center gap-2">
                            <HelpCircle size={18} className="text-amber-500" /> Likely Questions
                        </CardTitle>
                        <button
                            onClick={() => copyToClipboard(activeResult.questions.map((q, i) => `${i + 1}. ${q}`).join('\n'))}
                            className="text-slate-400 hover:text-primary transition-colors"
                            title="Copy Questions"
                        >
                            <Copy size={16} />
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
        </div>
    )
}

export default Results
