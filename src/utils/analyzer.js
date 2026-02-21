const CATEGORIES = {
    'Core CS': ['DSA', 'OOP', 'DBMS', 'OS', 'Networks'],
    'Languages': ['Java', 'Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Go'],
    'Web': ['React', 'Next.js', 'Node.js', 'Express', 'REST', 'GraphQL'],
    'Data': ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis'],
    'Cloud/DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
    'Testing': ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest']
};

export const extractSkills = (text) => {
    const detected = {
        'Core CS': [],
        'Languages': [],
        'Web': [],
        'Data': [],
        'Cloud/DevOps': [],
        'Testing': [],
        'Other': []
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
        detected['Other'] = ["Communication", "Problem solving", "Basic coding", "Projects"];
    }

    return detected;
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
    const hasDSA = skills.some(s => ['dsa', 'core cs', 'algorithm'].includes(s))
    const hasWeb = skills.some(s => ['react', 'node.js', 'javascript', 'next.js'].includes(s))

    if (isEnterprise) {
        return [
            {
                round: "Round 1: Online Assessment",
                focus: "DSA + Aptitude",
                why: "To filter large candidate pools based on algorithmic logic and basic core CS concepts."
            },
            {
                round: "Round 2: Technical Interview I",
                focus: "Deep DSA (Data Structures)",
                why: "Focuses specifically on how you manage data and optimize time/space complexity."
            },
            {
                round: "Round 3: Technical Interview II",
                focus: hasWeb ? "System Design & Tech Stack" : "Advanced DSA + Core CS",
                why: "Evaluates your ability to build large-scale systems or solve complex abstract problems."
            },
            {
                round: "Round 4: Bar Raiser / HM Round",
                focus: "Cultural Fit + High-level Thinking",
                why: "Ensures you meet the company's long-term excellence standards and fit their culture."
            }
        ]
    } else {
        // Startup/Mid-size flow
        return [
            {
                round: "Round 1: Exploratory Call / Task",
                focus: "Project Review or Take-home Task",
                why: "Startups need to see quickly if you can actually build something functional and clean."
            },
            {
                round: "Round 2: Practical Coding",
                focus: hasWeb ? "React/Node Live Build" : "Core Feature Implementation",
                why: "Testing your real-world development speed and familiarity with your primary tech stack."
            },
            {
                round: "Round 3: System Discussion",
                focus: "Product Logic + Scalability",
                why: "Evaluating how you think about business problems and translate them into code."
            },
            {
                round: "Round 4: Culture Fit / Founder Round",
                focus: "Ownership + Alignment",
                why: "In smaller teams, your personal drive and alignment with the mission are as critical as your code."
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
