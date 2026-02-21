import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Practice from './pages/Practice'
import Assessments from './pages/Assessments'
import Resources from './pages/Resources'
import Profile from './pages/Profile'
import History from './pages/History'
import Results from './pages/Results'
import TestChecklist from './pages/TestChecklist'
import ShipLock from './pages/ShipLock'

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="practice" element={<Practice />} />
                <Route path="assessments" element={<Assessments />} />
                <Route path="resources" element={<Resources />} />
                <Route path="profile" element={<Profile />} />
                <Route path="history" element={<History />} />
                <Route path="results" element={<Results />} />
            </Route>
            <Route path="/prp/07-test" element={<TestChecklist />} />
            <Route path="/prp/08-ship" element={<ShipLock />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default App
