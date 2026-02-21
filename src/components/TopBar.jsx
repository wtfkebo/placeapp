import React from 'react';

const TopBar = ({ projectName = "KodNest Premium Build System", currentStep = 1, totalSteps = 4, status = "In Progress" }) => {
    return (
        <nav className="top-bar">
            <div className="project-name">{projectName}</div>
            <div className="progress-indicator">
                Step {currentStep} <span className="dim">/</span> {totalSteps}
            </div>
            <div className="status-badge-container">
                <span className={`status-badge ${status.toLowerCase().replace(' ', '-')}`}>
                    {status}
                </span>
            </div>
        </nav>
    );
};

export default TopBar;
