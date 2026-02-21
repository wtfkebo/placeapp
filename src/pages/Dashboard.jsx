import React from 'react'

const Dashboard = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
            <p className="text-slate-600">Welcome back! Here's an overview of your placement preparation progress.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg mb-4 animate-pulse"></div>
                        <div className="h-4 bg-slate-100 rounded w-3/4 mb-2 animate-pulse"></div>
                        <div className="h-3 bg-slate-50 rounded w-1/2 animate-pulse"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Dashboard
