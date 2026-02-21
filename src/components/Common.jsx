import React from 'react';

export const Button = ({ children, variant = 'primary', ...props }) => {
    return (
        <button className={`btn btn-${variant}`} {...props}>
            {children}
        </button>
    );
};

export const Card = ({ title, children, footer }) => {
    return (
        <div className="card">
            {title && <div className="card-header">{title}</div>}
            <div className="card-body">{children}</div>
            {footer && <div className="card-footer">{footer}</div>}
        </div>
    );
};

export const Input = ({ label, error, ...props }) => {
    return (
        <div className="input-group">
            {label && <label>{label}</label>}
            <input className={`input ${error ? 'error' : ''}`} {...props} />
            {error && <span className="error-text">{error}</span>}
        </div>
    );
};

export const PromptBox = ({ value }) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(value);
    };

    return (
        <div className="prompt-box">
            <div className="prompt-header">
                <span>Prompt</span>
                <button onClick={copyToClipboard} className="copy-btn">Copy</button>
            </div>
            <div className="prompt-content">{value}</div>
        </div>
    );
};
