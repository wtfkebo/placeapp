import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, BookOpen, ClipboardCheck, Library, UserCircle, History as HistoryIcon } from 'lucide-react'

const DashboardLayout = () => {
    const location = useLocation()

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'History', path: '/dashboard/history', icon: HistoryIcon },
        { name: 'Practice', path: '/dashboard/practice', icon: BookOpen },
        { name: 'Assessments', path: '/dashboard/assessments', icon: ClipboardCheck },
        { name: 'Resources', path: '/dashboard/resources', icon: Library },
        { name: 'Profile', path: '/dashboard/profile', icon: UserCircle },
    ]

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-6">
                    <Link to="/" className="text-primary font-bold text-xl tracking-tight">Placement Prep</Link>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                            >
                                <item.icon size={20} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0"></div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">John Doe</p>
                            <p className="text-xs text-slate-500 truncate">john@example.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                        {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                            <span className="sr-only">Toggle user menu</span>
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">JD</div>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-5xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout
