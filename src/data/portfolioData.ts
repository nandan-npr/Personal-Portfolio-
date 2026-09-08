import { ProjectItem, ExperienceItem, SkillCategory, CertificationItem, EducationItem } from '../types';

export const PERSONAL_INFO = {
  name: "Nandan Pruthvi Raj R",
  preferredName: "Nandan Pruthvi",
  primaryTitle: "Software Engineer & Data Analyst",
  secondaryTitle: "AI Integration & Data Systems",
  location: "Bengaluru, Karnataka, India",
  email: "nandanpruthvi1@gmail.com",
  phone: "+91 6362191396",
  phoneDisplay: "+91 63621 91396",
  linkedin: "https://www.linkedin.com/in/nandan01/",
  github: "https://github.com/nandan-npr",
  availability: "Immediate Joiner",
  valueProposition: "Computer Science Engineer crafting resilient full-stack web applications, AI-assisted tools, and data-driven systems with React, Node.js, Python, and SQL.",
  shortBio: "Computer Science Engineering graduate (Cambridge Institute of Technology, CGPA 8.0/10) with hands-on experience in full-stack web development, backend APIs, database management, and data analytics. Proven track record across backend engineering (1Stop.ai), mobile application workflows (MindMatrix), and building production-ready platforms.",
  dsaSolved: "90+ LeetCode & GFG Problems",
  educationDegree: "B.E. Computer Science Engineering",
  cgpa: "8.0 / 10.0"
};

export const PROJECTS: ProjectItem[] = [
  {
    id: "skinmatics",
    title: "Skinmatics",
    subtitle: "Skincare Appointment & Clinic Management Platform",
    category: "fullstack",
    categoryLabel: "Full-Stack Web",
    period: "May 2026",
    statusBadge: "Live Deployed",
    isFeatured: true,
    problemSolved: "Traditional outpatient clinic and skincare practices struggle with chaotic appointment booking, manual inquiry logs, and fragmented patient schedules that lead to administrative bottlenecks.",
    solution: "Built a centralized, database-backed web application combining an intuitive clinic-style booking interface for visitors with a secured admin dashboard to review, filter, and manage incoming patient consultations.",
    technologies: ["React.js", "Node.js", "Express.js", "MongoDB", "REST APIs", "Render"],
    features: [
      "User authentication and responsive consultation booking workflow",
      "Dynamic inquiry form handling for treatment queries and specialist requests",
      "Secured admin control panel for real-time status tracking of appointments",
      "Normalized MongoDB collections storing appointment slots, contact records, and patient details",
      "Cross-browser mobile-responsive UI tailored to medical and wellness practices"
    ],
    contributions: [
      "Designed and implemented modular REST API endpoints in Express.js for CRUD appointment handling",
      "Built responsive React components with custom client-side validation for phone and date-time inputs",
      "Structured MongoDB schemas with indexing on appointment timestamps for fast administrative queries",
      "Configured live cloud deployment on Render with environment variable isolation"
    ],
    architectureDetails: "Client-side React SPA communicates via JSON REST API payloads with a Node/Express backend, with data persisted in MongoDB Atlas and managed through stateless request handlers.",
    liveUrl: "https://github.com/nandan-npr",
    githubUrl: "https://github.com/nandan-npr"
  },
  {
    id: "aura-shop",
    title: "Aura Shop",
    subtitle: "AI-Integrated Full-Stack E-Commerce Platform",
    category: "ai-backend",
    categoryLabel: "AI & Full-Stack",
    period: "2026",
    statusBadge: "Production Ready",
    isFeatured: true,
    problemSolved: "Generic online stores offer static product catalogs where shoppers cannot easily find relevant items, ask nuanced product queries, or get instant contextual buying advice.",
    solution: "Engineered a full-stack e-commerce web platform integrated with Google's Gemini API to power an intelligent shopping assistant that answers product queries, explains specifications, and guides checkout navigation in real time.",
    technologies: ["React.js", "Express.js", "Node.js", "MongoDB", "Google Gemini API", "Tailwind CSS"],
    features: [
      "Interactive Gemini-powered conversational chatbot for real-time product discovery and FAQ assistance",
      "Dynamic product catalog with category filtering, detailed views, and real-time inventory counters",
      "Persistent cart state management with instant quantity adjustment and pricing recalculation",
      "Structured checkout flow and order record creation",
      "Protected backend routes with environment-based Gemini API key security"
    ],
    contributions: [
      "Architected backend integration with Google GenAI SDK using prompt-engineered system instructions for shopping assistance",
      "Built resilient cart state management in React with local persistence and backend synchronization",
      "Constructed modular REST endpoints for products, cart sessions, order checkout, and chatbot chat sessions",
      "Secured API credentials on the server side to eliminate any client-side key exposure"
    ],
    architectureDetails: "React frontend pairs with Express REST server. The server proxies client chat inputs to Gemini API with conversational context, while product catalog and order states are queried from MongoDB.",
    githubUrl: "https://github.com/nandan-npr"
  },
  {
    id: "verified-careers",
    title: "Verified Careers",
    subtitle: "Recruitment Data Workflow & Opportunity Verification System",
    category: "fullstack",
    categoryLabel: "Workflow & Data Systems",
    period: "2026",
    statusBadge: "Data Platform",
    isFeatured: true,
    problemSolved: "College graduates and freshers face fraudulent recruitment postings, expired job links, and disjointed application tracking across scattered portals.",
    solution: "Designed and built a verification-first career platform that collects, audits, and categorizes genuine entry-level job opportunities with admin verification queues and candidate application tracking.",
    technologies: ["React.js", "Node.js", "MongoDB", "OTP Verification", "REST APIs", "Excel Data Modeling"],
    features: [
      "Company registration and job posting approval workflows (Pending, Approved, Rejected, Expired)",
      "Secure candidate verification via OTP authentication logic",
      "Candidate profile tracking with resume upload metadata handling",
      "Admin visibility dashboard for auditing recruiter credentials and opportunity validity",
      "Centralized opportunity tracker categorizing roles by eligibility criteria, deadlines, and hiring status"
    ],
    contributions: [
      "Designed the data lifecycle flow from initial submission through admin approval states",
      "Implemented role-based verification logic separating public candidate listings from admin management queues",
      "Integrated structured data validation to prevent duplicate or scam company registrations",
      "Utilized Excel-style schema tracking during initial prototype modeling before migrating to MongoDB"
    ],
    architectureDetails: "Layered verification architecture where job records require admin approval state before being published to public candidate streams, backed by MongoDB schemas and Express middleware.",
    githubUrl: "https://github.com/nandan-npr"
  },
  {
    id: "hr-analytics-dashboard",
    title: "HR Analytics Intelligence Dashboard",
    subtitle: "Interactive Workforce Attrition & KPI Reporting Suite",
    category: "data-bi",
    categoryLabel: "Data & BI Analytics",
    period: "2026",
    statusBadge: "BI Analytics",
    isFeatured: true,
    problemSolved: "Human Resources leadership lacked clear visibility into turnover patterns, department-level attrition drivers, workforce demographics, and retention indicators across historical cycles.",
    solution: "Developed an interactive business intelligence dashboard utilizing Power BI Desktop, Power Query data transformation pipelines, and custom DAX measures to translate raw HR records into actionable decision intelligence.",
    technologies: ["Power BI Desktop", "Power Query", "DAX (Data Analysis Expressions)", "Data Modeling", "Excel"],
    features: [
      "Executive KPI scorecards tracking overall attrition rate, headcount distribution, and tenure trends",
      "Department-wise breakdown uncovering retention bottlenecks across engineering, sales, and operations",
      "Interactive slicers for filtering by tenure band, gender, salary tier, and performance rating",
      "Drill-through reporting pages enabling deep-dive analysis into specific employee cohorts",
      "Predictive trend charts supporting quarterly workforce planning and talent acquisition forecasts"
    ],
    contributions: [
      "Cleaned and normalized raw tabular HR datasets using Power Query transformations and error handling",
      "Engineered advanced DAX measures for dynamic attrition calculation, moving averages, and headcount retention ratios",
      "Designed clean, human-centered UI cards prioritizing immediate executive legibility over visual clutter",
      "Validated data model relationships (Star Schema) to ensure instantaneous drill-down response times"
    ],
    architectureDetails: "Multi-table relational data model structured in Power BI, transformed via Power Query M-code, with calculated measures executed dynamically using DAX expressions.",
    githubUrl: "https://github.com/nandan-npr"
  },
  {
    id: "sales-performance-dashboard",
    title: "Executive Sales & Business Performance Dashboard",
    subtitle: "Automated Operational Reporting & Revenue Analytics Model",
    category: "data-bi",
    categoryLabel: "Data & BI Analytics",
    period: "2026",
    statusBadge: "Data Modeling",
    isFeatured: false,
    problemSolved: "Commercial teams were spending hours manually compiling regional sales spreadsheets, resulting in reporting delays, calculation errors, and missed revenue trends.",
    solution: "Engineered an automated Microsoft Excel reporting workbook utilizing Power Query automated ingestion, dynamic formula arrays, and interactive Pivot visualizers to deliver instant sales performance visibility.",
    technologies: ["Microsoft Excel", "Power Query", "XLOOKUP", "SUMIFS", "INDEX-MATCH", "Pivot Tables & Slicers"],
    features: [
      "Automated consolidation of regional sales transaction records with Power Query data cleaning",
      "Dynamic revenue, gross profit, margin %, and top-selling product KPI scorecards",
      "Interactive multi-parameter slicers allowing regional directors to isolate performance by territory and quarter",
      "Conditional formatting heatmaps identifying underperforming product categories instantly",
      "Formulas engineered with robust error handling (IFERROR, INDEX-MATCH, SUMIFS, COUNTIFS)"
    ],
    contributions: [
      "Built clean data pipelines transforming messy raw transaction logs into structured reporting tables",
      "Automated repetitive monthly summary reporting through dynamic formula modeling",
      "Created executive summary dashboard page tailored for business stakeholder presentations",
      "Eliminated manual copy-paste errors across regional sales worksheets"
    ],
    architectureDetails: "Structured Excel workbook with decoupled Raw Data, Calculation Schema, and Executive Dashboard presentation layers.",
    githubUrl: "https://github.com/nandan-npr"
  }
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: "mindmatrix",
    company: "MindMatrix Organisation",
    role: "Android App Development Intern",
    type: "Remote",
    location: "Remote",
    period: "Feb 2026 – May 2026",
    summary: "Spearheaded Android screen development and user interaction flows using Android Studio while leveraging Generative AI tools to accelerate development velocity, debugging, and project execution.",
    responsibilities: [
      "Engineered Android application screens, navigation flows, and form modules using Android Studio",
      "Integrated Generative AI tools into engineering workflows for requirement analysis, UI code refinement, testing, and debugging",
      "Maintained structured project tracking datasets, milestone documentation, and organized team workflow updates",
      "Collaborated remotely with development teams to ensure consistent user experience and clean code standards"
    ],
    technologies: ["Android Studio", "Generative AI Tools", "Mobile UI", "Git", "Spreadsheets Tracking"],
    keyImpact: "Improved sprint delivery and technical documentation velocity by integrating AI assistance into mobile development workflows."
  },
  {
    id: "1stop-ai",
    company: "1Stop.ai",
    role: "Back-End Developer Intern",
    type: "Hybrid",
    location: "Bengaluru (Hybrid)",
    period: "Jun 2025 – Sep 2025",
    summary: "Engineered server-side request management, relational database workflows, and administrative CRUD operations to power core application modules.",
    responsibilities: [
      "Developed backend modules utilizing SQL databases (MySQL) and PHP/Node.js to handle structured request processing",
      "Constructed reliable CRUD endpoints, data validation layers, and session-based authentication logic",
      "Designed and optimized SQL database queries to support admin panel operations and record management",
      "Assisted with API request debugging, workflow tracking, and comprehensive technical documentation"
    ],
    technologies: ["SQL / MySQL", "PHP", "Node.js", "CRUD Operations", "Session Authentication", "REST APIs"],
    keyImpact: "Streamlined data-driven workflows and ensured accurate record handling across administrative backend services."
  },
  {
    id: "homelane",
    company: "HomeLane",
    role: "HR & Recruitment Intern",
    type: "Onsite",
    location: "Bengaluru",
    period: "2026",
    summary: "Managed recruitment coordination, candidate sourcing, structured screening pipelines, and daily recruitment tracking reports.",
    responsibilities: [
      "Executed candidate sourcing and technical screening calls aligned with specific hiring requirements",
      "Coordinated interview schedules, shortlisted candidates, and managed follow-up communication loops",
      "Maintained accurate recruitment datasets and generated daily hiring activity reports using Excel and Google Sheets"
    ],
    technologies: ["Candidate Coordination", "MS Excel", "Google Sheets", "Recruitment Operations", "Stakeholder Communication"],
    keyImpact: "Maintained seamless interview pipelines and provided daily recruitment reporting visibility to senior leadership."
  },
  {
    id: "cit-fest",
    company: "Cambridge Institute of Technology",
    role: "College Fest Recruitment Coordinator",
    type: "Leadership",
    location: "Bengaluru",
    period: "2025 – 2026",
    summary: "Led recruitment operations and cross-functional team allocation for the annual institute festival, coordinating over 50 student volunteers.",
    responsibilities: [
      "Collaborated with a 3-member recruitment committee to interview, select, and onboard 50+ student volunteers",
      "Structured volunteer allocation across Marketing, Video Editing, Crowd Control, and Event Operations teams",
      "Coordinated schedule communication and handled real-time on-ground operational staffing during the festival"
    ],
    technologies: ["Team Leadership", "Volunteer Management", "Cross-Functional Operations", "Event Coordination"],
    keyImpact: "Successfully staffed and operated a 50+ volunteer team for zero-delay execution during the multi-day campus festival."
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "languages",
    categoryName: "Programming Languages",
    iconName: "Code2",
    description: "Core languages used for building web services, data models, and solving computational problems.",
    skills: [
      { name: "Python", level: "Proficient", supportedBy: "Data scripts, Flask, algorithms & analytics" },
      { name: "JavaScript (ES6+)", level: "Advanced", supportedBy: "React.js, Node.js, Express.js production code" },
      { name: "SQL", level: "Advanced", supportedBy: "MySQL queries, relational joins, CRUD, data analysis" },
      { name: "C", level: "Proficient", supportedBy: "Computer science core & algorithmic problem solving" },
      { name: "PHP", level: "Working Knowledge", supportedBy: "Backend internship work at 1Stop.ai" }
    ]
  },
  {
    id: "frontend",
    categoryName: "Frontend Development",
    iconName: "Layout",
    description: "Building responsive, modern, user-centric interfaces with strict attention to layout and performance.",
    skills: [
      { name: "React.js", level: "Advanced", supportedBy: "Skinmatics, Aura Shop, Verified Careers, IBM Certification" },
      { name: "HTML5 & Semantic Web", level: "Advanced", supportedBy: "Accessible, SEO-compliant markup" },
      { name: "CSS3 & Modern Layouts", level: "Advanced", supportedBy: "Flexbox, Grid, CSS animations, variables" },
      { name: "Tailwind CSS", level: "Advanced", supportedBy: "Production styling across web applications" },
      { name: "Responsive UI/UX", level: "Advanced", supportedBy: "Mobile-first layouts (360px - 1440px+)" }
    ]
  },
  {
    id: "backend",
    categoryName: "Backend & Systems",
    iconName: "Server",
    description: "Architecting modular server-side request pipelines, data access layers, and API security.",
    skills: [
      { name: "Node.js", level: "Advanced", supportedBy: "Skinmatics & Aura Shop server architectures" },
      { name: "Express.js", level: "Advanced", supportedBy: "REST routing, middleware, error handling, CORS" },
      { name: "RESTful API Design", level: "Advanced", supportedBy: "CRUD endpoints, JSON serialization, HTTP status conventions" },
      { name: "JWT & Session Auth", level: "Proficient", supportedBy: "Authentication logic at 1Stop.ai and web apps" },
      { name: "Flask", level: "Working Knowledge", supportedBy: "Python micro-services & utility endpoints" }
    ]
  },
  {
    id: "databases",
    categoryName: "Databases & Storage",
    iconName: "Database",
    description: "Data modeling, schema design, relational querying, and document database persistence.",
    skills: [
      { name: "MySQL / Relational DBs", level: "Advanced", supportedBy: "1Stop.ai backend, relational schemas, indexing" },
      { name: "MongoDB", level: "Advanced", supportedBy: "Skinmatics, Aura Shop, Verified Careers collections" },
      { name: "CRUD & Query Optimization", level: "Advanced", supportedBy: "Data access layers and high-volume operations" },
      { name: "Firebase Basics", level: "Working Knowledge", supportedBy: "Authentication & real-time client-side sync" }
    ]
  },
  {
    id: "ai-systems",
    categoryName: "AI Integration & Automation",
    iconName: "Sparkles",
    description: "Integrating modern Large Language Models into user-facing web applications to solve real workflows.",
    skills: [
      { name: "Google Gemini API", level: "Proficient", supportedBy: "Aura Shop conversational shopping assistant" },
      { name: "AI Chatbot Integration", level: "Proficient", supportedBy: "Context-aware conversational UI and API routes" },
      { name: "Prompt Engineering", level: "Proficient", supportedBy: "System prompts for domain-guided LLM responses" },
      { name: "Generative AI Workflow", level: "Proficient", supportedBy: "Development velocity, debugging at MindMatrix" }
    ]
  },
  {
    id: "data-analytics",
    categoryName: "Data Analytics & Business Intelligence",
    iconName: "BarChart3",
    description: "Transforming messy raw operational datasets into executive dashboards, KPIs, and actionable insights.",
    skills: [
      { name: "Microsoft Excel (Advanced)", level: "Advanced", supportedBy: "XLOOKUP, VLOOKUP, INDEX-MATCH, SUMIFS, Pivot Tables" },
      { name: "Power BI Desktop", level: "Proficient", supportedBy: "Interactive HR Analytics and KPI reporting" },
      { name: "Power Query & ETL", level: "Proficient", supportedBy: "Automated data transformation, deduplication, cleaning" },
      { name: "DAX (Data Analysis Expressions)", level: "Proficient", supportedBy: "Custom calculated measures for attrition and trends" },
      { name: "Data Validation & MIS Reporting", level: "Advanced", supportedBy: "Operational metrics tracking and executive scorecards" }
    ]
  },
  {
    id: "tools-devops",
    categoryName: "Developer Tools & Production",
    iconName: "Wrench",
    description: "Version control, debugging tooling, and cloud deployment pipelines.",
    skills: [
      { name: "Git & GitHub", level: "Advanced", supportedBy: "Branching workflows, version control, open repositories" },
      { name: "VS Code", level: "Advanced", supportedBy: "Primary development environment and extensions" },
      { name: "Postman", level: "Proficient", supportedBy: "API endpoint testing, payload inspection, debugging" },
      { name: "Android Studio", level: "Proficient", supportedBy: "Mobile screen creation during MindMatrix internship" },
      { name: "Render & Netlify", level: "Proficient", supportedBy: "Live full-stack and SPA deployments" }
    ]
  },
  {
    id: "computer-science",
    categoryName: "Computer Science Fundamentals",
    iconName: "Cpu",
    description: "Rigorous algorithmic grounding, problem solving, and system design principles.",
    skills: [
      { name: "Data Structures & Algorithms", level: "Advanced", supportedBy: "90+ problems solved on LeetCode & GeeksforGeeks" },
      { name: "Object-Oriented Programming (OOP)", level: "Advanced", supportedBy: "Encapsulation, inheritance, polymorphic design" },
      { name: "Database Management (DBMS)", level: "Advanced", supportedBy: "Normalization, ACID compliance, relational theory" },
      { name: "Software Testing & Debugging", level: "Proficient", supportedBy: "Systematic root-cause analysis and verification" }
    ]
  }
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    id: "deloitte-data",
    name: "Data Analyst Fundamentals",
    issuer: "Deloitte Virtual Experience Program (Forage)",
    description: "Hands-on simulation covering real-world data analysis, business scenario interpretation, data quality validation, and executive presentation of findings.",
    category: "Data Analytics",
    credentialBadge: "Verified Credential"
  },
  {
    id: "ibm-react",
    name: "Introduction to React",
    issuer: "IBM SkillsBuild",
    description: "In-depth training on React core fundamentals, functional components, state and props management, hooks, event handling, and single-page application architecture.",
    category: "Tech & Dev",
    credentialBadge: "Verified Credential"
  },
  {
    id: "infosys-ml",
    name: "Machine Learning",
    issuer: "Infosys Springboard",
    description: "Comprehensive foundation in machine learning algorithms, supervised learning, data pre-processing pipelines, model evaluation metrics, and feature engineering.",
    category: "Tech & Dev",
    credentialBadge: "Verified Credential"
  },
  {
    id: "nextinhr-talent",
    name: "Talent Acquisition Certification",
    issuer: "NextInHR",
    description: "Specialized training in modern recruitment operations, talent sourcing strategies, interview coordination, candidate engagement, and hiring pipeline metrics.",
    category: "Business & Talent",
    credentialBadge: "Verified Credential"
  },
  {
    id: "saylor-hrm",
    name: "Introduction to Human Resource Management",
    issuer: "Saylor University",
    description: "Academic coursework covering workforce planning, organizational behavior, onboarding structures, employee performance evaluation, and workplace relations.",
    category: "Business & Talent",
    credentialBadge: "Verified Credential"
  }
];

export const EDUCATION: EducationItem = {
  degree: "Bachelor of Engineering (B.E.) in Computer Science and Engineering",
  institution: "Cambridge Institute of Technology",
  location: "Bengaluru, Karnataka, India",
  period: "August 2022 – May 2026",
  cgpa: "8.0 / 10.0",
  focus: "Full-Stack Software Engineering, Relational & Distributed Databases, Algorithm Design, and Applied Data Analytics",
  coursework: [
    "Data Structures & Algorithms",
    "Database Management Systems (DBMS)",
    "Object-Oriented Programming (OOP)",
    "Web Application Architecture",
    "Computer Networks",
    "Operating Systems",
    "Software Engineering & Testing"
  ]
};

export const HIGHLIGHT_METRICS = [
  { label: "B.E. Computer Science", value: "8.0", sub: "CGPA at Cambridge Inst. of Tech" },
  { label: "DSA Problem Solving", value: "90+", sub: "LeetCode & GFG Problems Solved" },
  { label: "Production & Analytics Systems", value: "5+", sub: "Full-Stack Apps & BI Dashboards" },
  { label: "Industry Internships", value: "2", sub: "Backend (1Stop.ai) & Mobile (MindMatrix)" }
];
