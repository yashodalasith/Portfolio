// Seed data transcribed from Yashodha's CV plus the extra context given directly.
// Anything marked REPLACE_ME is a real gap (not on the CV, no date/company given) —
// fill it in here or edit it later from the admin dashboard once ENABLE_ADMIN=true.

export const profile = {
  name: "Yashodha Jayasinghe",
  title: "Software Engineer",
  tagline: "AI-augmented full-stack & backend development",
  bio:
    "I am a driven and self-motivated individual currently employed as a software engineering intern at " +
    "hSenid Business Solutions while pursuing a bachelor's in Information Technology specializing in Software " +
    "Engineering, with a keen interest in AI-augmented full-stack and backend development. I'm versatile — " +
    "equally comfortable working independently or collaboratively — and eager to tackle challenges head-on, " +
    "innovate, and make a positive impact wherever I go.",
  email: "yashodhalasithjayasinghe@gmail.com",
  phone: "0701303518",
  location: "Nugegoda, Sri Lanka",
  avatarUrl: "",
  resumeUrl: "",
  socials: {
    linkedin: "https://www.linkedin.com/in/yashodha-jayasinghe-1104122a3",
    github: "https://github.com/yashodalasith",
  },
  skills: {
    programming: [
      "Python",
      "C#",
      "Java",
      "JavaScript",
      "Kotlin",
      "Dart",
      "HTML",
      "PHP",
      "CSS",
      "SQL",
    ],
    frameworks: [
      "FastAPI",
      "Express.js",
      "Node.js",
      "React.js",
      "Spring Boot",
      "Bootstrap",
      "MERN",
      "Tailwind CSS",
      "Flutter",
      "TensorFlow",
      "PyTorch",
      "Scikit-learn",
    ],
    databases: ["MongoDB", "MSSQL", "MySQL", "Oracle", "PostgreSQL"],
    tools: [
      "Git/GitHub",
      "Postman",
      "Figma",
      "Visual Studio",
      "VS Code",
      "IntelliJ IDEA",
      "draw.io",
      "Android Studio",
      "MySQL Workbench",
      "Swagger",
      "OWASP ZAP",
      "GitHub Copilot",
      "Cursor",
      "Claude Code",
      "Katalon",
    ],
  },
};

export const experiences = [
  {
    title: "Intern Software Engineer",
    company: "hSenid Business Solutions",
    startDate: "Feb 2025",
    endDate: "June 2026",
    bullets: [
      "Engineered and stabilized enterprise HR systems by resolving 30+ high-impact production bugs and delivering 10+ new features across Recruitment, Widget, Probation, and Timesheet modules.",
      "Led critical time-zone architecture fixes, standardizing UTC handling across backend, database, APIs, and frontend for globally consistent scheduling.",
      "Developed backend solutions using C#, ASP.NET MVC, and SQL Server, including data migrations, view refactoring, and background job debugging.",
      "Diagnosed and fixed full-stack issues spanning Web APIs, Knockout.js, SPA navigation, and mobile integrations (Zoom, Teams).",
      "Collaborated with senior engineers, DBAs, and QA during urgent patch releases, maintaining a 100% PR approval rate.",
      "Practiced AI-assisted development with GitHub Copilot, Antigravity, and Cursor to accelerate CR implementation.",
    ],
    tags: ["C#", "ASP.NET MVC", "SQL Server", "Knockout.js", "GitHub Copilot"],
    order: 0,
  },
  {
    // REPLACE_ME: not on the CV — described directly. Fill in the real company + dates,
    // then adjust `order` so it sits in the correct chronological position.
    title: "Associate Software Engineer — Full Cycle (Dev & QA)",
    company: "hSenid Business Solutions",
    startDate: "July 2026",
    endDate: "Present",
    bullets: [
      "Delivered development work including bug fixes and change-request (CR) implementation, using Claude Code for AI-assisted development.",
      "Owned QA across the release cycle: automated test cases with Katalon, executed manual test cases for CRs, and ran regression testing.",
      "Managed cycle closure and shipped releases end-to-end, reporting and tracking bugs across the full dev-to-release pipeline.",
    ],
    tags: [
      "Claude Code",
      "Katalon",
      "QA Automation",
      "Regression Testing",
      "Release Management",
    ],
    order: 1,
  },
];

export const projects = [
  {
    title: "Nexar Platform (Quantum–Classical Workload Orchestration System)",
    category: "Research / Group Project",
    date: "March 2026",
    description:
      "A full-stack platform to orchestrate and evaluate quantum vs. classical workloads, pairing a Python backend/services layer with a TypeScript web UI for experiment execution, metrics visualization, and pipeline management.",
    bullets: [
      "Designed and implemented the Code Analysis Engine feature set end-to-end: code submission → backend analysis → UI presentation.",
      "Built a multi-language /analyze workflow with static analysis and quality metrics, including cyclomatic complexity reporting.",
      "Extended the engine with ML-assisted capabilities (CodeBERT-based training/ensemble experimentation) for language/classification workflows.",
      "Added automated testing for the analysis endpoint across all supported languages.",
    ],
    technologies: [
      "Python",
      "TypeScript",
      "REST APIs",
      "CodeBERT",
      "ML/NLP",
      "Git/GitHub",
    ],
    githubUrl: "https://github.com/Silverviles/nexar",
    liveUrl: "https://silverviles.github.io/nexar",
    imageUrl: "",
    featured: true,
    order: 0,
  },
  {
    // REPLACE_ME: no bullets/tech stack given yet — add via admin dashboard once ready.
    title: "Boseth Traders — Business Website (Live, Production)",
    category: "Client Project",
    date: "December 2025",
    description: "Live, production-level business website for Boseth Traders.",
    bullets: [],
    technologies: [],
    githubUrl: "https://github.com/yashodalasith/boseth-traders",
    liveUrl: "https://www.bosethtraders.com/",
    imageUrl: "",
    featured: true,
    order: 1,
  },
  {
    title: "EV Charging Station Booking System",
    category: "Group Project",
    date: "October 2025",
    description:
      "Client–server EV charging station booking system using a thin-client/fat-server architecture, with one centralized .NET backend serving both web and native Android apps.",
    bullets: [
      "Architected and developed the entire backend using ASP.NET Web API: business logic, domain models, access control, and validation.",
      "Implemented role-based access control (BackOffice / Station Operator) with multi-station operator assignments.",
      "Built user lifecycle management for EV owners using NIC as the primary identifier.",
      "Implemented JWT-based authentication and integrated MongoDB with optimized, array-based relational modeling.",
    ],
    technologies: [
      "C#",
      ".NET Core",
      "MongoDB",
      "JWT",
      "BCrypt.Net",
      "Swagger/OpenAPI",
      "QRCoder",
    ],
    githubUrl: "https://github.com/devkyoshi/zap-ev",
    liveUrl: "",
    imageUrl: "",
    featured: true,
    order: 2,
  },
  {
    title: "Security Vulnerability Analysis & Hardening — Web Application",
    category: "Group Project",
    date: "October 2025",
    description:
      "Comprehensive security assessment of a web application against OWASP Top 10, identifying and fixing real-world vulnerabilities.",
    bullets: [
      "Implemented brute-force prevention via API rate limiting and temporary account lockout.",
      "Hardened the API Gateway's CORS configuration, restricting origins, methods, and headers.",
      "Used CodeQL and Copilot Autofix for AI-assisted vulnerability analysis and fixes.",
      "Validated improvements with OWASP ZAP, dependency checks, and manual code review.",
    ],
    technologies: [
      "Java (Spring Boot)",
      "API Gateway",
      "OWASP ZAP",
      "Postman",
      "Git/GitHub",
    ],
    githubUrl: "https://github.com/devkyoshi/easy-bites",
    liveUrl: "",
    imageUrl: "",
    featured: false,
    order: 3,
  },
  {
    title: "Personal Finance Tracker — Backend",
    category: "Individual Project",
    date: "May 2025",
    description:
      "Secure RESTful API for managing income, expenses, budgets, and financial goals with multi-currency support.",
    bullets: [
      "Implemented JWT authentication, role-based access control, recurring transactions, and notifications.",
      "Built financial reporting endpoints with automated test coverage.",
    ],
    technologies: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "JWT",
      "Swagger",
      "Jest",
    ],
    githubUrl: "https://github.com/yashodalasith/SpendSense_Finanace_Tracker",
    liveUrl: "",
    imageUrl: "",
    featured: false,
    order: 4,
  },
  {
    title: "REST Countries App",
    category: "Individual Project",
    date: "May 2025",
    description:
      "Responsive React application that consumes the REST Countries API to search, filter, and display country information.",
    bullets: [
      "Implemented dynamic UI updates, REST API integration, and responsive design with test coverage.",
    ],
    technologies: [
      "React.js",
      "JavaScript",
      "Tailwind CSS",
      "REST Countries API",
      "Vercel",
      "Jest",
    ],
    githubUrl: "https://github.com/yashodalasith",
    liveUrl: "https://geo-explorer-deoplyment-frontwork.vercel.app/",
    imageUrl: "",
    featured: false,
    order: 5,
  },
  {
    title: "Cloud-Native Food Ordering & Delivery Platform",
    category: "Group Project",
    date: "May 2025",
    description:
      "Cloud-native, microservices-based food ordering & delivery platform with real-time delivery management.",
    bullets: [
      "Designed and implemented the full delivery management feature, including real-time location tracking over WebSockets.",
      "Developed backend services for delivery/driver management across DAO, DTO, repository, service, and controller layers.",
      "Contributed to Docker-based microservices integration and deployment.",
    ],
    technologies: [
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "WebSockets",
      "Docker",
      "Microservices",
    ],
    githubUrl: "https://github.com/devkyoshi/easy-bites",
    liveUrl: "",
    imageUrl: "",
    featured: false,
    order: 6,
  },
  {
    title: "HCA Healthcare Mobile App",
    category: "Group Project",
    date: "October 2024",
    description:
      "A healthcare app supporting the UN Sustainable Development Goal of 'Good Health' — BMI-based workout plans, daily challenges, and medication reminders.",
    bullets: [
      "Built the BMI-based workout plan suggestion feature, recommending activities based on user BMI.",
    ],
    technologies: ["Mobile", "Healthcare"],
    githubUrl: "https://github.com/h-muhammed/HealthApp2.0",
    liveUrl: "",
    imageUrl: "",
    featured: false,
    order: 7,
  },
];

export const certifications = [
  {
    title:
      "ISO/IEC 27001:2022 Information Security Management & ISO/IEC 27017:2015 Cloud Service Security Management",
    issuer: "hSenid Business Solutions PLC",
    date: "Feb 2026",
    url: "https://mycourse.app/yZomBUir9f8F3AOD4",
    order: 0,
  },
  // REPLACE_ME: add any other certificates that weren't on the CV, either here
  // or later through the admin dashboard.
];

export const education = [
  {
    institution:
      "Sri Lanka Institute of Information Technology (SLIIT), Malabe",
    degree:
      "BSc (Hons) in Information Technology, specializing in Software Engineering",
    startDate: "September 2022",
    endDate: "Present",
    details: [
      "Weighted GPA: 3.5 (2nd upper class, as of 4th year 1st semester)",
      "Completed all degree requirements; expected graduation October 2026",
    ],
    order: 0,
  },
  {
    // NOTE: dates transcribed as-is from the CV (March 2007 – August 2021) — double check
    // this range looks off for secondary school and may need correcting.
    institution: "Royal College, Colombo 07",
    degree: "High School — Physical Science Stream",
    startDate: "March 2007",
    endDate: "August 2021",
    details: [
      "Passed Ordinary Level with 9A",
      "Passed Advanced Level: B (Physics), C (Combined Mathematics), C (Chemistry)",
    ],
    order: 1,
  },
];
