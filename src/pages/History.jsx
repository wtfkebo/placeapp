import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHistory } from '../utils/storage'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { ChevronRight, Calendar, Building2, Briefcase } from 'lucide-react'

const History = () => {
    const [history, setHistory] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        setHistory(getHistory())
    }, [])

    const handleItemClick = (item) => {
        navigate('/dashboard/results', { state: { result: item } })
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Analysis History</h1>
                <p className="text-sm text-slate-500">{history.length} entries found</p>
            </div>

            {history.length === 0 ? (
                <Card className="p-12 text-center">
                    <CardContent className="space-y-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                            <Calendar size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">No analyses yet</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">Analyze a job description on the dashboard to start tracking your readiness.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {history.map((item) => (
                        <Card
                            key={item.id}
                            className="hover:border-primary/50 cursor-pointer transition-all hover:bg-slate-50/50"
                            onClick={() => handleItemClick(item)}
                        >
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex gap-6 items-center">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-lg">
                                        {item.readinessScore}
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
                                                {Object.values(item.extractedSkills).flat().length} skills detected
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="text-slate-300" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default History
