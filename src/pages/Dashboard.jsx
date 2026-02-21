import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts'
import { Play, Calendar, CheckCircle2 } from 'lucide-react'

const radarData = [
    { subject: 'DSA', A: 75, fullMark: 100 },
    { subject: 'System Design', A: 60, fullMark: 100 },
    { subject: 'Communication', A: 80, fullMark: 100 },
    { subject: 'Resume', A: 85, fullMark: 100 },
    { subject: 'Aptitude', A: 70, fullMark: 100 },
]

const Dashboard = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Overall Readiness */}
                <Card className="flex flex-col justify-center items-center py-10">
                    <CardHeader className="text-center">
                        <CardTitle>Overall Readiness</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <div className="relative w-48 h-48">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="80"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className="text-slate-100"
                                />
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="80"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={2 * Math.PI * 80}
                                    strokeDashoffset={2 * Math.PI * 80 * (1 - 72 / 100)}
                                    strokeLinecap="round"
                                    className="text-primary transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-slate-900 transition-all duration-700">72</span>
                                <span className="text-sm text-slate-500 font-medium">Readiness Score</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Skill Breakdown Radar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Skill Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
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
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Goals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm font-medium mb-2">
                                    <span className="text-slate-600">Problems Solved</span>
                                    <span className="text-primary">12/20 this week</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i < 4 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                            {i < 4 ? <CheckCircle2 size={14} /> : day}
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-medium">{day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Continue Practice */}
                <Card className="flex flex-col justify-between">
                    <CardHeader>
                        <CardTitle>Continue Practice</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                            <h4 className="font-bold text-slate-900 mb-1">Dynamic Programming</h4>
                            <p className="text-xs text-slate-500 mb-4">Master complex DP patterns and optimizations</p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    <span>Progress</span>
                                    <span>3/10 Completed</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-1.5">
                                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '30%' }}></div>
                                </div>
                            </div>
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-sm">
                            <Play size={18} fill="currentColor" />
                            Continue Learning
                        </button>
                    </CardContent>
                </Card>

                {/* Upcoming Assessments */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Upcoming Assessments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { title: 'DSA Mock Test', time: 'Tomorrow, 10:00 AM', color: 'bg-amber-50 text-amber-600' },
                                { title: 'System Design Review', time: 'Wed, 2:00 PM', color: 'bg-primary/5 text-primary' },
                                { title: 'HR Interview Prep', time: 'Friday, 11:00 AM', color: 'bg-emerald-50 text-emerald-600' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-primary/20 transition-colors group cursor-pointer">
                                    <div className={`p-3 rounded-lg ${item.color}`}>
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{item.title}</h5>
                                        <p className="text-sm text-slate-500">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Dashboard
