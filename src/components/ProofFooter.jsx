import React from 'react';

const ProofFooter = ({ items = [] }) => {
    const defaultItems = [
        { label: 'UI Built', completed: false },
        { label: 'Logic Working', completed: false },
        { label: 'Test Passed', completed: false },
        { label: 'Deployed', completed: false }
    ];

    const checklist = items.length > 0 ? items : defaultItems;

    return (
        <footer className="proof-footer">
            <div className="footer-label">Proof Checklist:</div>
            <div className="checklist-items flex gap-3">
                {checklist.map((item, idx) => (
                    <div key={idx} className="checklist-item flex align-center gap-1">
                        <div className={`checkbox ${item.completed ? 'completed' : ''}`}>
                            {item.completed && '✓'}
                        </div>
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        </footer>
    );
};

export default ProofFooter;
