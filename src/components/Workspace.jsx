import React from 'react';

const Workspace = ({ children, secondaryContent }) => {
    return (
        <div className="workspace">
            <main className="primary-workspace">
                {children}
            </main>
            <aside className="secondary-panel">
                {secondaryContent}
            </aside>
        </div>
    );
};

export default Workspace;
