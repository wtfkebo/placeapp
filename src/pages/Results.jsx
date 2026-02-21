import React from 'react'
import { useLocation, Navigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { ArrowLeft, CheckCircle2, ListChecks, CalendarDays, HelpCircle } from 'lucide-react'

const Results = () => {
    const location = useLocation()
    const result = location.state?.result

    if (!result) return <Navigate to="/dashboard" replace />

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <Link to="/dashboard/history" className="flex items-center gap-2 text-primary font-medium hover:underline">
                    <ArrowLeft size={18} /> Back to History
                </Link>
                <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold">
                    Score: {result.readinessScore}/100
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Extracted Skills */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 size={18} className="text-emerald-500" /> Detected Skills
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {Object.entries(result.extractedSkills).map(([category, skills]) => (
                            <div key={category}>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{category}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map(skill => (
                                        <span key={skill} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium border border-slate-200">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* 7-Day Plan */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarDays size={18} className="text-primary" /> 7-Day Strategy
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {result.plan.map((step, i) => (
                                <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 border-l-4 border-l-primary">
                                    <div className="font-bold text-primary min-w-[70px]">{step.day}</div>
                                    <div>
                                        <h5 className="font-bold text-slate-900">{step.topic}</h5>
                                        <p className="text-sm text-slate-500 mt-1">{step.details}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Round-wise Checklist */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ListChecks size={18} className="text-primary" /> Preparation Checklist
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            {result.checklist.map((round, i) => (
                                <div key={i} className="space-y-3">
                                    <h4 className="font-bold text-slate-900 text-sm border-b pb-2">{round.round}</h4>
                                    <ul className="space-y-2">
                                        {round.items.map((item, j) => (
                                            <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Likely Interview Questions */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HelpCircle size={18} className="text-amber-500" /> Likely Questions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {result.questions.map((q, i) => (
                            <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-700 leading-relaxed">
                                <span className="font-bold text-primary mr-2">Q{i + 1}:</span> {q}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Results
