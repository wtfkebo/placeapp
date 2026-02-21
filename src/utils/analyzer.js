const CATEGORIES = {
    'coreCS': ['DSA', 'OOP', 'DBMS', 'OS', 'Networks'],
    'languages': ['Java', 'Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Go'],
    'web': ['React', 'Next.js', 'Node.js', 'Express', 'REST', 'GraphQL'],
    'data': ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis'],
    'cloud': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
    'testing': ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest']
};

export const extractSkills = (text) => {
    const detected = {
        coreCS: [],
        languages: [],
        web: [],
        data: [],
        cloud: [],
        testing: [],
        other: []
    };
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

    // Default behavior if no skills detected
    if (!foundAny) {
        detected['other'] = ["Communication", "Problem solving", "Basic coding", "Projects"];
    }

    return detected;
};

export const calculateReadinessScore = (data) => {
    let score = 35;
    const skills = data.extractedSkills || {};
    const categoriesPresent = Object.values(skills).filter(arr => arr.length > 0).length;

    // +5 per category (max 30)
    score += Math.min(categoriesPresent * 5, 30);

    if (data.company) score += 10;
    if (data.role) score += 10;
    if (data.jdText && data.jdText.length > 800) score += 10;

    return Math.min(score, 100);
};

export const generateChecklist = (extractedSkills) => {
    const skills = Object.values(extractedSkills).flat();
    const hasReact = skills.some(s => s.toLowerCase() === 'react');
    const hasSQL = skills.some(s => s.toLowerCase() === 'sql');

    return [
        {
            roundTitle: "Round 1: Aptitude / Basics",
            items: ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "Basic Programming MCQs", "Company Background Research"]
        },
        {
            roundTitle: "Round 2: DSA + Core CS",
            items: ["Array & String Manipulation", "Linked Lists & Trees", "Time Complexity Analysis", "OS Process Scheduling", "DBMS Normalization"]
        },
        {
            roundTitle: "Round 3: Tech Interview (Projects + Stack)",
            items: [
                "Project Architecture Walkthrough",
                ...(hasReact ? ["React Hooks & Life Cycle", "Virtual DOM vs Real DOM"] : []),
                ...(hasSQL ? ["SQL Joins & Indexing", "ACID Properties"] : []),
                "Problem Solving Scenarios",
                "Code Refactoring Exercise"
            ]
        },
        {
            roundTitle: "Round 4: Managerial / HR",
            items: ["Tell me about yourself", "Situation-based (STAR) questions", "Why this company?", "Strengths & Weaknesses", "Future Goals"]
        }
    ];
};

export const generate7DayPlan = (extractedSkills) => {
    const skills = Object.values(extractedSkills).flat();
    const hasFrontend = skills.some(s => ['react', 'next.js', 'javascript'].includes(s.toLowerCase()));

    return [
        { day: "Day 1-2", focus: "Basics + Core CS", tasks: ["Revise OS, DBMS, and OOPs concepts", "Practice basic networking"] },
        { day: "Day 3-4", focus: "DSA + Coding Practice", tasks: ["Focus on Strings, Arrays, and Recursion", "Solving 5+ problems daily"] },
        { day: "Day 5", focus: "Project + Resume Alignment", tasks: ["Review your projects", hasFrontend ? "Deep dive into frontend architecture" : "Revise your core stack details"] },
        { day: "Day 6", focus: "Mock Interview Questions", tasks: ["Practice behavioral questions", "Technical storytelling"] },
        { day: "Day 7", focus: "Revision + Weak Areas", tasks: ["Final walkthrough of the checklist", "Solving missed patterns"] }
    ];
};

export const generateCompanyIntel = (companyName) => {
    const name = (companyName || '').toLowerCase()
    const enterpriseKeywords = ['amazon', 'google', 'microsoft', 'netflix', 'apple', 'meta', 'infosys', 'tcs', 'wipro', 'hcl', 'accenture', 'capgemini', 'oracle', 'sap', 'ibm']
    const midSizeKeywords = ['swiggy', 'zomato', 'ola', 'paytm', 'phonepe', 'uber', 'lyft', 'airbnb', 'stripe']

    let intel = {
        name: companyName || 'Direct Apply',
        industry: 'Technology Services',
        sizeCategory: 'Startup (<200)',
        hiringFocus: 'Practical problem solving + stack depth'
    }

    if (enterpriseKeywords.some(k => name.includes(k))) {
        intel.sizeCategory = 'Enterprise (2000+)'
        intel.hiringFocus = 'Structured DSA + core CS fundamentals'
    } else if (midSizeKeywords.some(k => name.includes(k))) {
        intel.sizeCategory = 'Mid-size (200–2000)'
        intel.hiringFocus = 'Scalability + system architecture + domain expertise'
    }

    if (name.includes('bank') || name.includes('finance') || name.includes('pay')) intel.industry = 'Fintech'
    if (name.includes('health')) intel.industry = 'Healthtech'
    if (name.includes('crypto') || name.includes('chain')) intel.industry = 'Blockchain / Web3'

    return intel
}

export const generateDynamicRounds = (intel, extractedSkills) => {
    const skills = Object.values(extractedSkills).flat().map(s => s.toLowerCase())
    const isEnterprise = intel.sizeCategory === 'Enterprise (2000+)'
    const hasWeb = skills.some(s => ['react', 'node.js', 'javascript', 'next.js'].includes(s))

    if (isEnterprise) {
        return [
            {
                roundTitle: "Round 1: Online Assessment",
                focusAreas: ["DSA", "Aptitude"],
                whyItMatters: "To filter large candidate pools based on algorithmic logic and basic core CS concepts."
            },
            {
                roundTitle: "Round 2: Technical Interview I",
                focusAreas: ["Deep DSA", "Data Structures"],
                whyItMatters: "Focuses specifically on how you manage data and optimize time/space complexity."
            },
            {
                roundTitle: "Round 3: Technical Interview II",
                focusAreas: hasWeb ? ["System Design", "Tech Stack"] : ["Advanced DSA", "Core CS"],
                whyItMatters: "Evaluates your ability to build large-scale systems or solve complex abstract problems."
            },
            {
                roundTitle: "Round 4: Bar Raiser / HM Round",
                focusAreas: ["Cultural Fit", "High-level Thinking"],
                whyItMatters: "Ensures you meet the company's long-term excellence standards and fit their culture."
            }
        ]
    } else {
        // Startup/Mid-size flow
        return [
            {
                roundTitle: "Round 1: Exploratory Call / Task",
                focusAreas: ["Project Review", "Take-home Task"],
                whyItMatters: "Startups need to see quickly if you can actually build something functional and clean."
            },
            {
                roundTitle: "Round 2: Practical Coding",
                focusAreas: hasWeb ? ["React/Node Live Build"] : ["Core Feature Implementation"],
                whyItMatters: "Testing your real-world development speed and familiarity with your primary tech stack."
            },
            {
                roundTitle: "Round 3: System Discussion",
                focusAreas: ["Product Logic", "Scalability"],
                whyItMatters: "Evaluating how you think about business problems and translate them into code."
            },
            {
                roundTitle: "Round 4: Culture Fit / Founder Round",
                focusAreas: ["Ownership", "Alignment"],
                whyItMatters: "In smaller teams, your personal drive and alignment with the mission are as critical as your code."
            }
        ]
    }
}

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
