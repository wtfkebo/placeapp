import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { useNavigate } from 'react-router-dom'
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts'
import { Play, Calendar, CheckCircle2, Sparkles, Send, History as HistoryIcon } from 'lucide-react'
import {
    extractSkills,
    calculateReadinessScore,
    generateChecklist,
    generate7DayPlan,
    generateQuestions,
    generateCompanyIntel,
    generateDynamicRounds
} from '../utils/analyzer'
import { saveAnalysis, getHistory } from '../utils/storage'

const Dashboard = () => {
    const [jdText, setJdText] = useState('')
    const [company, setCompany] = useState('')
    const [role, setRole] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [latestAnalysis, setLatestAnalysis] = useState(null)
    const [historyError, setHistoryError] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const history = getHistory()
        const rawHistory = localStorage.getItem('placement_prep_history')
        if (rawHistory && history.length < JSON.parse(rawHistory).length) {
            setHistoryError(true)
        }
        if (history.length > 0) {
            setLatestAnalysis(history[0])
        }
    }, [])

    const handleAnalyze = () => {
        if (!jdText.trim()) return

        const jdLength = jdText.trim().length
        if (jdLength < 200) {
            window.confirm("This JD is too short to analyze deeply. Paste full JD for better output. Continue anyway?") || null
            if (jdLength < 50) return // Hard stop for extremely short inputs
        }

        setIsAnalyzing(true)

        // Simulate thinking process
        setTimeout(() => {
            const extractedSkills = extractSkills(jdText)
            const companyIntel = generateCompanyIntel(company)
            const dynamicRounds = generateDynamicRounds(companyIntel, extractedSkills)

            // Strict Analysis Entry Schema
            const standardizedResult = {
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                company: company || "",
                role: role || "",
                jdText: jdText,
                extractedSkills: extractedSkills,
                companyIntel: companyIntel, // sizeCategory, industry, hiringFocus
                roundMapping: dynamicRounds, // [{ roundTitle, focusAreas[], whyItMatters }]
                checklist: generateChecklist(extractedSkills), // [{ roundTitle, items[] }]
                plan7Days: generate7DayPlan(extractedSkills), // [{ day, focus, tasks[] }]
                questions: generateQuestions(extractedSkills),
                baseScore: 0, // Calculated below
                finalScore: 0, // Calculated below
                skillConfidenceMap: {}
            }

            const score = calculateReadinessScore(standardizedResult)
            standardizedResult.baseScore = score
            standardizedResult.finalScore = score

            const saved = saveAnalysis(standardizedResult)
            setLatestAnalysis(saved)
            setIsAnalyzing(false)

            // Navigate to results
            navigate('/dashboard/results', { state: { result: saved } })
        }, 1500)
    }

    const radarData = latestAnalysis ?
        Object.entries(latestAnalysis.extractedSkills).map(([cat, skills]) => ({
            subject: cat.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), // Convert camelCase to title
            A: Math.min(skills.length * 20, 100),
            fullMark: 100
        })) : [
            { subject: 'DSA', A: 75, fullMark: 100 },
            { subject: 'System Design', A: 60, fullMark: 100 },
            { subject: 'Communication', A: 80, fullMark: 100 },
            { subject: 'Resume', A: 85, fullMark: 100 },
            { subject: 'Aptitude', A: 70, fullMark: 100 },
        ]

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {historyError && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl text-xs font-bold animate-in slide-in-from-top-2">
                    ⚠️ One saved entry couldn't be loaded. Create a new analysis to rebuild your history.
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* JD Analyzer Form */}
                <Card className="lg:col-span-2 border-primary/20 shadow-md bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <Sparkles size={20} /> Analyze Job Description
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">Company Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Google, Amazon"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">Role / Position</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Frontend Engineer"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">Paste Job Description</label>
                            <textarea
                                placeholder="Paste the requirements, responsibilities, and qualifications here..."
                                className="w-full h-40 px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm resize-none"
                                value={jdText}
                                onChange={(e) => setJdText(e.target.value)}
                            />
                        </div>
                        <button
                            disabled={isAnalyzing || !jdText.trim()}
                            onClick={handleAnalyze}
                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${isAnalyzing ? 'bg-slate-400 cursor-wait' : 'bg-primary hover:bg-primary/90 active:scale-[0.98]'
                                }`}
                        >
                            {isAnalyzing ? (
                                <>Analyzing Skills...</>
                            ) : (
                                <>Ready for Analysis <Send size={18} /></>
                            )}
                        </button>
                    </CardContent>
                </Card>

                {/* Overall Readiness & Quick Actions */}
                <div className="space-y-8">
                    <Card className="flex flex-col justify-center items-center py-6">
                        <CardHeader className="text-center p-0">
                            <CardTitle className="text-sm text-slate-500 font-bold uppercase tracking-wider">Current Readiness</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center pt-4">
                            <div className="relative w-32 h-32">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray={2 * Math.PI * 56}
                                        strokeDashoffset={2 * Math.PI * 56 * (1 - (latestAnalysis?.readinessScore || 35) / 100)}
                                        strokeLinecap="round"
                                        className="text-primary transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold text-slate-900">{latestAnalysis?.readinessScore || 35}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="p-4 bg-primary text-white border-none shadow-indigo-200 shadow-xl">
                        <CardHeader className="p-0 mb-4">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <HistoryIcon size={16} /> Quick History
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-2">
                            <p className="text-xs opacity-80 leading-relaxed">
                                You have {getHistory().length} saved analyses. Review your past strategies to improve.
                            </p>
                            <button
                                onClick={() => navigate('/dashboard/history')}
                                className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-all"
                            >
                                View Full History
                            </button>
                        </CardContent>
                    </Card>
                </div>

                {/* Skill Breakdown Radar Chart */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Skill Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px] p-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Skills"
                                    dataKey="A"
                                    stroke="hsl(245, 58%, 51%)"
                                    fill="hsl(245, 58%, 51%)"
                                    fillOpacity={0.4}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Weekly Goals */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Weekly Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap md:flex-nowrap gap-8 justify-between items-center">
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-slate-600">Tasks Completed</span>
                                    <span className="text-primary">12/20</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                    <div key={i} className="flex flex-col items-center gap-1.5">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${i < 4 ? 'bg-emerald-500 text-white shadow-emerald-100 shadow-md' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                            {i < 4 ? <CheckCircle2 size={14} /> : day}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}

export default Dashboard
