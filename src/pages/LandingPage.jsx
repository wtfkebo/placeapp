import React from 'react'
import { Link } from 'react-router-dom'
import { Code, Video, BarChart2 } from 'lucide-react'

const LandingPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="bg-primary py-20 px-4 text-center text-white">
                <h1 className="text-5xl font-bold mb-6">Ace Your Placement</h1>
                <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
                    Practice, assess, and prepare for your dream job with our comprehensive placement readiness platform.
                </p>
                <Link
                    to="/dashboard"
                    className="bg-white text-primary px-8 py-3 rounded-full font-semibold text-lg hover:bg-slate-100 transition-colors shadow-lg"
                >
                    Get Started
                </Link>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-4 max-w-6xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-primary">
                            <Code size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Practice Problems</h3>
                        <p className="text-slate-600">Master coding challenges and technical concepts with curated problem sets.</p>
                    </div>

                    <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-primary">
                            <Video size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Mock Interviews</h3>
                        <p className="text-slate-600">Simulate real interview scenarios with video-based assessments and feedback.</p>
                    </div>

                    <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-primary">
                            <BarChart2 size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Track Progress</h3>
                        <p className="text-slate-600">Monitor your growth with detailed performance analytics and insights.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto py-10 border-t border-slate-200 text-center text-slate-500">
                <p>© {new Date().getFullYear()} Placement Prep. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default LandingPage
