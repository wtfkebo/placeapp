import React from 'react'

export const Card = ({ className = '', children }) => (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
        {children}
    </div>
)

export const CardHeader = ({ className = '', children }) => (
    <div className={`p-6 pb-4 ${className}`}>
        {children}
    </div>
)

export const CardTitle = ({ className = '', children }) => (
    <h3 className={`text-lg font-semibold text-slate-900 ${className}`}>
        {children}
    </h3>
)

export const CardContent = ({ className = '', children }) => (
    <div className={`p-6 pt-0 ${className}`}>
        {children}
    </div>
)

export const CardFooter = ({ className = '', children }) => (
    <div className={`p-6 pt-0 flex items-center ${className}`}>
        {children}
    </div>
)
