import { Bug, Settings, Network, TrendingUp, BookOpen, Users, Compass, Code, Layers, PlayCircle, Rocket, Mail, Phone, MapPin, Clock, MessageSquare, Target, Search, Shield, GraduationCap } from 'lucide-react';




export const problemList = [
    { title: "Career Stagnation", desc: "Stuck in the same manual role for years with minimal increments." },
    { title: "Manual Limitations", desc: "Restricted growth scope and increasing fear of automation redundancy." },
    { title: "No Clear Roadmap", desc: "Learning random tools without understanding industry workflows." },
    { title: "Constant Rejections", desc: "Failing technical interviews due to lack of practical implementation knowledge." }
];

export const solutionList = [
    { title: "Skill Diagnosis", desc: "Deep dive into your current skills to create a personalized learning track." },
    { title: "Tool Mastery", desc: "Mastering high-demand automation tools like Selenium, Cucumber, and Jenkins." },
    { title: "Real-world Simulation", desc: "Hand-on experience with live enterprise project architectures." },
    { title: "Strategic Placement", desc: "Optimized resumes and salary negotiation tactics for high-pay roles." }
];

export const frameworkSteps = [
    { step: "01", icon: Compass, title: "Strong Foundation", desc: "Current skill gap analysis and goal setting with personalized assessment to build a robust starting point.", reverse: false },
    { step: "02", icon: Code, title: "Core Automation Skills", desc: "Core Java & Advanced Testing methodologies for building high-performance, robust automation scripts.", reverse: true },
    { step: "03", icon: Layers, title: "Framework Engineering", desc: "Intensive Automation Framework development using enterprise tools like Selenium, TestNG, and Maven.", reverse: false },
    { step: "04", icon: PlayCircle, title: "Real-Time Project Simulation", desc: "Live Enterprise-grade project execution reflecting real work scenarios and CI/CD integration.", reverse: true },
    { step: "05", icon: Rocket, title: "Placement Acceleration", desc: "Interview coaching, resume optimization, and salary negotiation tactics for maximum career growth.", reverse: false }
];




export const whyTrustUsFeatures = [
    { icon: TrendingUp, title: "Structured High-Growth Model", desc: "No generic tutorials. Every lesson is part of a strategic career climb mapped to actual industry salary brackets." },
    { icon: BookOpen, title: "Industry-Vetted Curriculum", desc: "Updated monthly to include the latest shifts in testing technologies and agile project requirements." },
    { icon: Users, title: "Small Batches, Deep Attention", desc: "We cap our batches to ensure every student receives personalized debugging support and code reviews." }
];




export const mainMenus = (isContact = false) => [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Courses", href: "/courses" },
    { name: "Services", href: "/services" },
    { name: "For College Students", href: "/students" },
    ...(isContact ? [{ name: "Contact", href: "/contact" }] : []),
];

export const footerCourseLinks = [
    { name: "Advanced Manual Testing", href: "/courses/manual-testing" },
    { name: "Selenium Automation", href: "/courses/selenium-automation" },
    { name: "Cucumber BDD", href: "/courses/cucumber-bdd" },
];

export const footerLegalLinks = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-of-service" },
    { name: "Cookie Policy", href: "/cookie-policy" },
];

export const placementStats = [
    { label: "Average Hike", value: "110%", icon: TrendingUp },
    { label: "Highest Package", value: "24 LPA", icon: Rocket },
    { label: "Students Placed", value: "500+", icon: Users },
    { label: "Hiring Partners", value: "150+", icon: Network }
];

export const placementSteps = [
    {
        title: "Profile Optimization",
        desc: "We transform your Resume and LinkedIn profile to stand out to top-tier technical recruiters.",
        icon: Users
    },
    {
        title: "Mock Interview Rounds",
        desc: "Simulated technical and HR rounds with industry experts to build your confidence and clarity.",
        icon: Layers
    },
    {
        title: "Direct Referrals",
        desc: "Access to our exclusive network of hiring partners and alumni working in top product companies.",
        icon: Rocket
    },
    {
        title: "Salary Negotiation",
        desc: "Expert guidance on how to evaluate offers and negotiate the best possible compensation package.",
        icon: TrendingUp
    }
];

export const placementServices = [
    {
        title: "Resume & LinkedIn Review",
        desc: "We transform your profile into a hiring magnet with ATS optimization and industry-specific storytelling.",
        icon: Users,
        features: ["ATS Optimization", "Tailored Narratives", "LinkedIn Branding"]
    },
    {
        title: "Expert Mock Interviews",
        desc: "Role-specific technical and behavioral simulations with candidates from top-tier product companies.",
        icon: MessageSquare,
        features: ["Targeted Questions", "Detailed Feedback", "Confidence Building"]
    },
    {
        title: "Profile Refinement",
        desc: "Polishing your professional presence across all platforms to ensure you stand out to premium recruiters.",
        icon: Target,
        features: ["GitHub Portfolio", "Portfolio Website", "Open Source Impact"]
    },
    {
        title: "Salary Negotiation",
        desc: "Expert guidance on offer evaluation and negotiation tactics to ensure you get your true market value.",
        icon: TrendingUp,
        features: ["Offer Analysis", "Closing Tactics", "Increment Strategies"]
    }
];

export const placementProcessSteps = [
    {
        step: "01",
        title: "Assessment",
        desc: "We evaluate your current interview readiness and identify improvement areas.",
        icon: Search
    },
    {
        step: "02",
        title: "Preparation",
        desc: "Customized training plan based on your target role and company.",
        icon: BookOpen
    },
    {
        step: "03",
        title: "Practice",
        desc: "Multiple mock interview sessions with detailed feedback.",
        icon: MessageSquare
    },
    {
        step: "04",
        title: "Refinement",
        desc: "Final polishing and confidence building before real interviews.",
        icon: Target
    }
];




export const collegeStudentPrograms = [
    {
        title: "Placement Cracker",
        desc: "The ultimate bootcamp to hack through tier-1 company rounds as a fresher.",
        icon: Rocket,
        benefit: "90% Success Rate"
    },
    {
        title: "Campus to Corporate",
        desc: "Bridge the gap between academic theory and real-world engineering standards.",
        icon: GraduationCap,
        benefit: "Certified by Industry"
    },
    {
        title: "Early Career Blueprint",
        desc: "Start your tech journey early and build a portfolio that beats 5-year veterans.",
        icon: Compass,
        benefit: "Start in 1st/2nd Year"
    }
];

