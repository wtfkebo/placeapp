import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHistory } from '../utils/storage'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { ChevronRight, Calendar, Building2, Briefcase } from 'lucide-react'

const History = () => {
    const [history, setHistory] = useState([])
    const [expandedId, setExpandedId] = useState(null)
    const navigate = useNavigate()

    const loadHistory = () => {
        setHistory(getHistory())
    }

    useEffect(() => {
        loadHistory()
    }, [])

    const toggleExpand = (e, id) => {
        e.stopPropagation();
        setExpandedId(expandedId === id ? null : id);
    }

    const handleItemClick = (item) => {
        navigate('/dashboard/results', { state: { result: item } })
    }

    const handleClearHistory = () => {
        if (window.confirm("Are you sure you want to clear your entire analysis history? This cannot be undone.")) {
            localStorage.removeItem('placement_prep_history')
            loadHistory()
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Analysis History</h1>
                    <p className="text-sm text-slate-500">{history.length} entries found</p>
                </div>
                {history.length > 0 && (
                    <button
                        onClick={handleClearHistory}
                        className="text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {history.length === 0 ? (
                <Card className="p-12 text-center text-slate-500">
                    <CardContent className="space-y-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                            <Calendar size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">No analyses yet</h3>
                        <p className="max-w-sm mx-auto">Analyze a job description on the dashboard to start tracking your readiness.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {history.map((item) => {
                        const isExpanded = expandedId === item.id;
                        const topSkills = Object.values(item.extractedSkills || {}).flat().slice(0, 3);
                        const firstDay = item.plan7Days?.[0];

                        return (
                            <Card
                                key={item.id}
                                className={`transition-all duration-300 ${isExpanded ? 'border-primary shadow-lg ring-1 ring-primary/20' : 'hover:border-primary/50 cursor-pointer hover:bg-slate-50/50'}`}
                                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                            >
                                <CardContent className="p-0">
                                    <div
                                        className="p-6 flex items-center justify-between"
                                    >
                                        <div className="flex gap-6 items-center pointer-events-none">
                                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-lg">
                                                {item.finalScore || item.readinessScore || 0}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-slate-900">{item.role || 'General Role'}</h3>
                                                    <span className="text-slate-300">|</span>
                                                    <span className="text-slate-500 text-sm flex items-center gap-1">
                                                        <Building2 size={14} /> {item.company || 'Direct Apply'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-slate-400">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1 lowercase">
                                                        {Object.values(item.extractedSkills || {}).flat().length} skills detected
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`p-2 rounded-lg transition-colors ${isExpanded ? 'bg-primary/10 text-primary' : 'text-slate-300'}`}
                                            >
                                                <ChevronRight className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dropdown Summary Section */}
                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[400px] border-t border-slate-100 bg-slate-50/30' : 'max-h-0'}`}>
                                        <div className="p-6 pt-2 space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company Intel</label>
                                                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                                        <p className="text-xs font-bold text-slate-700">{item.companyIntel?.sizeCategory || 'Startup'}</p>
                                                        <p className="text-[10px] text-primary font-medium mt-1">{item.companyIntel?.hiringFocus || 'Practical Stack'}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Top Skills</label>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {topSkills.map(s => (
                                                            <span key={s} className="px-2 py-1 bg-white border border-slate-100 rounded-md text-[10px] font-bold text-slate-600 shadow-sm uppercase">
                                                                {s}
                                                            </span>
                                                        ))}
                                                        {Object.values(item.extractedSkills || {}).flat().length > 3 && (
                                                            <span className="text-[10px] text-slate-400 font-bold px-1">+ {Object.values(item.extractedSkills || {}).flat().length - 3} more</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Immediate Priority</label>
                                                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                                        <p className="text-xs font-bold text-slate-700">{firstDay?.focus || 'Basics Revision'}</p>
                                                        <p className="text-[10px] text-slate-500 mt-1 truncate">{firstDay?.tasks?.[0]}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleItemClick(item); }}
                                                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]"
                                            >
                                                View Full Analysis Report <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default History
