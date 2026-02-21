import React, { useState } from 'react';
import TopBar from './components/TopBar';
import ContextHeader from './components/ContextHeader';
import Workspace from './components/Workspace';
import ProofFooter from './components/ProofFooter';
import { Button, Card, Input, PromptBox } from './components/Common';
import './App.css';

function App() {
    const [status, setStatus] = useState('In Progress');

    const secondaryContent = (
        <div className="secondary-container">
            <h3>Step Explanation</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>
                In this step, we are establishing the core design language. The goal is to create a UI that feels "Calm and Intentional".
            </p>

            <PromptBox value="Create a premium SaaS design system with off-white background and deep red accents." />

            <div className="action-buttons gap-2" style={{ marginTop: '24px' }}>
                <Button variant="primary" style={{ width: '100%' }}>Build in Lovable</Button>
                <div className="flex gap-2">
                    <Button variant="secondary" style={{ flex: 1 }}>It Worked</Button>
                    <Button variant="secondary" style={{ flex: 1 }}>Error</Button>
                </div>
                <Button variant="ghost" style={{ width: '100%' }}>+ Add Screenshot</Button>
            </div>
        </div>
    );

    return (
        <div className="app-layout">
            <TopBar status={status} />
            <ContextHeader
                title="KodNest Premium Build System"
                description="The intentional foundation for B2C product excellence. Focused on clarity, coherence, and calm interaction."
            />

            <Workspace secondaryContent={secondaryContent}>
                <div className="workspace-inner" style={{ maxWidth: '800px' }}>
                    <section className="demo-section">
                        <h2 style={{ fontSize: '24px' }}>Interaction Workspace</h2>
                        <p>
                            This is where the main product interaction happens. Components are designed to be predictable and clean.
                        </p>

                        <Card title="Project Configuration">
                            <div className="flex gap-3">
                                <div style={{ flex: 1 }}>
                                    <Input label="Project Name" placeholder="e.g. My Premium App" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Input label="Domain Prefix" placeholder="e.g. core-build" />
                                </div>
                            </div>
                            <Input label="Description" placeholder="Briefly describe the purpose of this project..." />

                            <div className="flex gap-2" style={{ marginTop: '16px' }}>
                                <Button variant="primary">Save Changes</Button>
                                <Button variant="secondary">Discard</Button>
                            </div>
                        </Card>

                        <Card title="System Components">
                            <div className="flex gap-3 align-center" style={{ marginBottom: '24px' }}>
                                <Button variant="primary">Primary Action</Button>
                                <Button variant="secondary">Secondary Action</Button>
                                <Button variant="ghost">Ghost Action</Button>
                            </div>

                            <div className="flex gap-3">
                                <div style={{ flex: 1 }}>
                                    <Input label="Active State" defaultValue="Focused value" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Input label="Error State" defaultValue="Invalid input" error="This field is required" />
                                </div>
                            </div>
                        </Card>
                    </section>
                </div>
            </Workspace>

            <ProofFooter />
        </div>
    );
}

export default App;
