import React from 'react';

const ContextHeader = ({ title = "Dashboard", description = "Monitor your project progress and manage build steps from a single workspace." }) => {
    return (
        <header className="context-header">
            <h1 className="header-title">{title}</h1>
            <p className="header-subtext">{description}</p>
        </header>
    );
};

export default ContextHeader;
