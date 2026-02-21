const CATEGORIES = {
    'Core CS': ['DSA', 'OOP', 'DBMS', 'OS', 'Networks'],
    'Languages': ['Java', 'Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Go'],
    'Web': ['React', 'Next.js', 'Node.js', 'Express', 'REST', 'GraphQL'],
    'Data': ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis'],
    'Cloud/DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
    'Testing': ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest']
};

export const extractSkills = (text) => {
    const detected = {};
    let foundAny = false;

    Object.entries(CATEGORIES).forEach(([category, skills]) => {
        const matched = skills.filter(skill => {
            const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(?:^|\\s|[,.;])${escapedSkill}(?:$|\\s|[,.;])`, 'i');
            return regex.test(text);
        });
        if (matched.length > 0) {
            detected[category] = matched;
            foundAny = true;
        }
    });

    return foundAny ? detected : { 'General': ['General fresher stack'] };
};

export const calculateReadinessScore = (data) => {
    let score = 35;
    const categoriesPresent = Object.keys(data.extractedSkills).length;

    // +5 per category (max 30)
    score += Math.min(categoriesPresent * 5, 30);

    if (data.company) score += 10;
    if (data.role) score += 10;
    if (data.jdText.length > 800) score += 10;

    return Math.min(score, 100);
};

export const generateChecklist = (extractedSkills) => {
    const skills = Object.values(extractedSkills).flat();
    const hasReact = skills.some(s => s.toLowerCase() === 'react');
    const hasSQL = skills.some(s => s.toLowerCase() === 'sql');

    return [
        {
            round: "Round 1: Aptitude / Basics",
            items: ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "Basic Programming MCQs", "Company Background Research"]
        },
        {
            round: "Round 2: DSA + Core CS",
            items: ["Array & String Manipulation", "Linked Lists & Trees", "Time Complexity Analysis", "OS Process Scheduling", "DBMS Normalization"]
        },
        {
            round: "Round 3: Tech Interview (Projects + Stack)",
            items: [
                "Project Architecture Walkthrough",
                ...(hasReact ? ["React Hooks & Life Cycle", "Virtual DOM vs Real DOM"] : []),
                ...(hasSQL ? ["SQL Joins & Indexing", "ACID Properties"] : []),
                "Problem Solving Scenarios",
                "Code Refactoring Exercise"
            ]
        },
        {
            round: "Round 4: Managerial / HR",
            items: ["Tell me about yourself", "Situation-based (STAR) questions", "Why this company?", "Strengths & Weaknesses", "Future Goals"]
        }
    ];
};

export const generate7DayPlan = (extractedSkills) => {
    const skills = Object.values(extractedSkills).flat();
    const hasFrontend = skills.some(s => ['react', 'next.js', 'javascript'].includes(s.toLowerCase()));

    return [
        { day: "Day 1-2", topic: "Basics + Core CS", details: "Revise OS, DBMS, and OOPs concepts. Practice basic networking." },
        { day: "Day 3-4", topic: "DSA + Coding Practice", details: "Focus on Strings, Arrays, and Recursion. Solving 5+ problems daily." },
        { day: "Day 5", topic: "Project + Resume Alignment", details: `Review your projects. ${hasFrontend ? 'Deep dive into frontend architecture.' : 'Revise your core stack details.'}` },
        { day: "Day 6", topic: "Mock Interview Questions", details: "Practice behavioral questions and technical storytelling." },
        { day: "Day 7", topic: "Revision + Weak Areas", details: "Final walkthrough of the checklist and solving missed patterns." }
    ];
};

export const generateQuestions = (extractedSkills) => {
    const skills = Object.values(extractedSkills).flat();
    const questions = [];

    const pool = {
        'SQL': "Explain indexing and when it helps.",
        'React': "Explain state management options and when to use context vs Redux.",
        'DSA': "How would you optimize search in sorted data?",
        'Java': "Explain the difference between HashMap and ConcurrentHashMap.",
        'Node.js': "Explain the Event Loop and how it handles concurrency.",
        'Docker': "Explain the difference between a Container and a Virtual Machine.",
        'AWS': "What is the difference between S3 and EBS?",
        'JavaScript': "Explain closures and how they are used in practical scenarios.",
        'System Design': "How would you design a rate limiter for an API?"
    };

    skills.forEach(skill => {
        if (pool[skill]) questions.push(pool[skill]);
    });

    // Fallback/General questions
    if (questions.length < 10) {
        const general = [
            "Explain the SDLC process in your previous projects.",
            "How do you handle merge conflicts in a team setting?",
            "What is your approach to debugging a production issue?",
            "Describe a time you optimized a piece of code.",
            "What are the benefits of using microservices architecture?"
        ];
        while (questions.length < 10 && general.length > 0) {
            questions.push(general.shift());
        }
    }

    return questions.slice(0, 10);
};
