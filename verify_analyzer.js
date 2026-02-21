const CATEGORIES = {
    'Core CS': ['DSA', 'OOP', 'DBMS', 'OS', 'Networks'],
    'Languages': ['Java', 'Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Go'],
    'Web': ['React', 'Next.js', 'Node.js', 'Express', 'REST', 'GraphQL'],
    'Data': ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis'],
    'Cloud/DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
    'Testing': ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest']
};

const extractSkills = (text) => {
    const detected = {};
    let foundAny = false;

    Object.entries(CATEGORIES).forEach(([category, skills]) => {
        const matched = skills.filter(skill => {
            const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // If the skill ends with special chars like ++ or #, \\b might not work as expected at the end.
            // We can use a more flexible boundary or just check for space/punctuation.
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

const calculateReadinessScore = (data) => {
    let score = 35;
    const categoriesPresent = Object.keys(data.extractedSkills).length;
    score += Math.min(categoriesPresent * 5, 30);
    if (data.company) score += 10;
    if (data.role) score += 10;
    if (data.jdText.length > 800) score += 10;
    return Math.min(score, 100);
};

const sampleJD = `
We are looking for a Senior Frontend Developer with expertise in React, JavaScript, and Node.js. 
The ideal candidate should have experience with SQL and AWS. 
Experience with C++ and C# is a plus.
The JD text length is long enough to hit the 800+ chars mark if we repeat this... `.repeat(10);

const test = () => {
    console.log("--- Testing Skill Extraction ---");
    const extracted = extractSkills(sampleJD);
    console.log("Extracted Skills:", JSON.stringify(extracted, null, 2));

    const data = {
        company: "TestCorp",
        role: "Engineer",
        jdText: sampleJD,
        extractedSkills: extracted
    };

    console.log("\n--- Testing Readiness Score ---");
    const score = calculateReadinessScore(data);
    console.log("Readiness Score:", score);

    const skillsList = Object.values(extracted).flat();
    const requiredSkills = ['React', 'JavaScript', 'Node.js', 'SQL', 'AWS', 'C++', 'C#'];
    const missing = requiredSkills.filter(s => !skillsList.some(found => found.toLowerCase() === s.toLowerCase()));

    if (missing.length === 0) {
        console.log("\n✅ All specified skills detected!");
    } else {
        console.log("\n❌ Missing skills:", missing);
    }

    if (score >= 90) {
        console.log("✅ Readiness score calculation looks good!");
    } else {
        console.log("❌ Readiness score seems low:", score);
    }
};

test();
