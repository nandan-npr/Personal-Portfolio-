// ==============================================================================
// CRITICAL BACKUP: COMPLETE PORTFOLIO DATA SNAPSHOT
// Created at: 2026-09-09
// Preserved untouched before Supabase migration & CMS integration.
// ==============================================================================

import { ProjectItem, ExperienceItem, SkillCategory, CertificationItem, EducationItem } from '../types';

export const BACKUP_PERSONAL_INFO = {
  name: "Nandan Pruthvi Raj R",
  preferredName: "Nandan Pruthvi",
  primaryTitle: "Software Engineer & Data Analyst",
  secondaryTitle: "Full-Stack Development & Business Intelligence",
  location: "Bengaluru, India",
  email: "nandanpruthvi1@gmail.com",
  phone: "+91 6362191396",
  phoneDisplay: "+91 63621 91396",
  linkedin: "https://www.linkedin.com/in/nandan01/",
  github: "https://github.com/nandan-npr",
  availability: "Immediate Joiner",
  availabilityStatus: "available" as const, // 'available' | 'unavailable'
  availabilityText: "AVAILABLE FOR ROLES & CONTRACTS • BENGALURU",
  valueProposition: "Adaptable and motivated Computer Science Engineer combining full-stack development, database architecture, workflow coordination, and data analytics with React, Node.js, Python, SQL, and Power BI.",
  shortBio: "Computer Science Engineering graduate from Cambridge Institute of Technology (CGPA 8.0/10) with hands-on experience building full-stack web applications, backend services, Android development workflows (MindMatrix), and database-driven application development (1Stop.ai). Proven track record in problem solving, process tracking, and business intelligence.",
  dsaSolved: "HackerRank Certified Software Engineer",
  educationDegree: "B.E. Computer Science Engineering",
  cgpa: "8.0 / 10.0"
};

export const BACKUP_HOMEPAGE_CONTENT = {
  heroName: "NANDAN PRUTHVI RAJ R",
  heroTitle: "Software Engineer / Data Analyst",
  heroDescription: "Building intelligent digital products, full-stack systems, and data-driven solutions.",
  availabilityLabel: "AVAILABLE FOR ROLES & CONTRACTS • BENGALURU",
  whoIAmEyebrow: "01 // CORE PERSPECTIVE",
  whoIAmHeading: "Engineered with rigor. Decided with data. Designed with discipline.",
  whoIAmP1: "I am a Computer Science Engineer and Data Analyst with a rigorous foundation in software architecture, full-stack web engineering, algorithmic problem solving, and analytical data modeling.",
  whoIAmP2: "My background unites deep technical execution—from scalable React interfaces and Node.js REST services to structured relational database schemas and Power BI reporting suites. I approach development through systematic planning, structured execution, and verifiable quality.",
  quoteText: "Delivering software and analytics where code clarity, performance benchmarks, and measurable business outcomes align effortlessly.",
  quoteAuthor: "Nandan Pruthvi Raj R",
  quoteTitle: "Software Engineer & Data Analyst"
};

export const BACKUP_ABOUT_CONTENT = {
  heading: "SYSTEMATIC PERSPECTIVE",
  subheading: "An engineering mindset anchored by architectural precision, full-stack accountability, and quantitative analysis.",
  narrativeP1: "Graduated with a Bachelor of Engineering in Computer Science and Engineering from Cambridge Institute of Technology (CGPA 8.0/10.0). My background bridges end-to-end software development with structured quantitative analytics.",
  narrativeP2: "Through practical industry experience at MindMatrix Organisation (Android app workflows, Kotlin, task planning, and Generative AI acceleration) and 1Stop.ai (backend CRUD modules, SQL queries, RESTful APIs, and data integrity verification), I have cultivated a disciplined methodology for designing systems that scale reliably.",
  narrativeP3: "Whether architecting full-stack web platforms like Skinmatics and CloudVault, or engineering decision-grade analytics suites like the HR and Sales Dashboards, my objective is clear: build performant, maintainable software and translate complex datasets into immediate, high-confidence executive clarity."
};

export const BACKUP_RECRUITER_CONTENT = {
  heroHeadline: "EXECUTIVE RECRUITER DOSSIER",
  heroSubtitle: "Verified candidate summary, technical competencies, career timeline, and contact pathways for hiring managers and talent acquisition leaders.",
  summary: "Computer Science Engineering graduate (CGPA 8.0/10.0) with verified software engineering credentials, two industry internships (Android & Backend), and four deployed production/analytics applications.",
  preferredRoles: [
    "Software Engineer (Full-Stack / Frontend / Backend)",
    "Data Analyst / Business Intelligence Engineer",
    "Junior Associate Engineer / Graduate Engineer Trainee",
    "SQL / Database / Power BI Analyst"
  ],
  workAuthorization: "Citizen of India • Available for immediate relocation or remote engagement",
  availabilityTimeline: "Immediate (0 Days Notice)"
};

export const BACKUP_SEO_SETTINGS = {
  siteTitle: "Nandan Pruthvi Raj R — Software Engineer & Data Analyst",
  metaDescription: "Professional portfolio of Nandan Pruthvi Raj R — Software Engineer & Data Analyst specializing in full-stack web applications, AI integration, and business data analytics.",
  keywords: "Nandan Pruthvi Raj R, Software Engineer Bengaluru, Data Analyst Bengaluru, Full Stack Developer, React, Node.js, Python, SQL, Power BI, Cambridge Institute of Technology",
  authorName: "Nandan Pruthvi Raj R",
  ogTitle: "Nandan Pruthvi Raj R — Software Engineer & Data Analyst",
  ogDescription: "Building intelligent digital products, full-stack systems, and data-driven solutions.",
  canonicalUrl: "https://ais-dev-dalsslbnvw4h3sbelgqkeb-463187571582.asia-southeast1.run.app/"
};

export const BACKUP_RESUME_INFO = {
  fileName: "NANDAN_PRUTHVI_RAJ_R_RESUME_2026.pdf",
  fileUrl: "/NANDAN_PRUTHVI_RAJ_R_RESUME_2026.pdf",
  updatedAt: "2026-09-09",
  isActive: true
};

export const BACKUP_PROJECTS: ProjectItem[] = [
  {
    id: "skinmatics",
    title: "Skinmatics",
    subtitle: "Full-Stack Skincare Appointment Platform",
    category: "fullstack",
    categoryLabel: "Full-Stack Web",
    period: "2026",
    statusBadge: "Live Deployed",
    isFeatured: true,
    problemSolved: "Traditional outpatient skincare clinics struggle with chaotic appointment scheduling, unstructured treatment inquiries, and rigid interfaces requiring developer intervention for routine updates.",
    solution: "Developed and deployed a full-stack skincare appointment platform with user interactions, appointment booking, enquiry management, and an admin dashboard allowing authorized users to update information such as doctor details directly without source code changes.",
    technologies: ["React.js", "Node.js", "Express.js", "MongoDB", "REST APIs", "Render"],
    features: [
      "User interactions, appointment booking workflows, and structured treatment enquiry management",
      "REST APIs, CRUD operations, and MongoDB database integration for managing application records and user workflows",
      "Admin-controlled system where authorized users can update information such as doctor details directly from the dashboard without changing source code",
      "Integrated frontend and backend workflows and used AI-assisted development tools for feature implementation, debugging, code understanding, and testing"
    ],
    contributions: [
      "Developed and deployed the complete full-stack web application connecting React components with Express.js APIs",
      "Implemented RESTful endpoints and CRUD handlers for user appointment scheduling and doctor profile management",
      "Structured MongoDB database schemas with indexing on appointment timestamps for fast administrative queries",
      "Integrated AI-assisted development tools for rapid debugging, test validation, and code optimization"
    ],
    architectureDetails: "React single-page application communicates via REST APIs with an Express.js backend. MongoDB Atlas manages persistent appointment records, inquiries, and doctor profiles with dynamic administrative controls.",
    liveUrl: "https://github.com/nandan-npr",
    githubUrl: "https://github.com/nandan-npr"
  },
  {
    id: "cloudvault",
    title: "CloudVault",
    subtitle: "File Management Web Application",
    category: "fullstack",
    categoryLabel: "Full-Stack Web",
    period: "2026",
    statusBadge: "Production Ready",
    isFeatured: true,
    problemSolved: "Users require a secure, reliable, and responsive web platform to upload, organize, preview, download, and manage their personal and project files with hierarchical directory structures.",
    solution: "Developed a full-featured file management web application for uploading, storing, viewing, downloading, renaming, and deleting user files, featuring comprehensive folder organization and metadata management.",
    technologies: ["React.js", "Node.js", "Express.js", "MongoDB", "REST APIs", "File Storage"],
    features: [
      "File management application for uploading, storing, viewing, downloading, renaming, and deleting user files",
      "Folder management functionality to organize files and support creating, renaming, moving, and deleting folders",
      "Backend APIs and database operations for user accounts, file metadata, folders, and file management workflows",
      "Integrated frontend and backend services and used AI-assisted development tools to support feature development, debugging, and testing"
    ],
    contributions: [
      "Engineered backend REST APIs in Express.js for multipart file uploads, streaming downloads, and metadata indexing",
      "Implemented hierarchical directory operations in MongoDB supporting recursive folder creation, renaming, moving, and deletion",
      "Constructed responsive file management interface in React with instant previewing, search filtering, and file action menus",
      "Integrated AI-assisted development tools to support asynchronous file pipeline debugging and error handling"
    ],
    architectureDetails: "Decoupled full-stack architecture. React client handles interactive folder navigation and file actions; Express.js manages file streaming and REST workflows; MongoDB stores relational folder trees and file metadata.",
    githubUrl: "https://github.com/nandan-npr"
  },
  {
    id: "sales-dashboard",
    title: "Sales Dashboard",
    subtitle: "Interactive Business Performance & Regional Sales Suite",
    category: "data-bi",
    categoryLabel: "Data & BI Analytics",
    period: "2026",
    statusBadge: "Executive Model",
    isFeatured: true,
    problemSolved: "Business stakeholders lack immediate visibility into multi-channel revenue trends, regional profitability variations, and top-selling product performance.",
    solution: "Built an interactive Sales Dashboard to track revenue, profit, regional performance, and top-selling products using KPI-driven visualizations and automated spreadsheet modeling.",
    technologies: ["Microsoft Excel", "Power Query", "Pivot Tables", "XLOOKUP", "SUMIFS", "Slicers"],
    features: [
      "Interactive Sales Dashboard tracking revenue, profit, regional performance, and top-selling products using KPI-driven visualizations",
      "Applied Pivot Tables, Pivot Charts, XLOOKUP, SUMIFS, Conditional Formatting, Slicers, and formulas to automate reporting and summarize performance",
      "Data cleaning, validation, and exploratory analysis to identify sales trends and generate actionable business insights",
      "Dynamic reports allowing users to filter and analyze sales performance across regions, products, and key business metrics"
    ],
    contributions: [
      "Extracted, cleansed, and transformed raw transaction datasets utilizing Power Query pipelines",
      "Formulated complex financial modeling formulas (XLOOKUP, SUMIFS, profit margin percentages) for instant metrics recalculation",
      "Designed interactive multi-region slicers and dynamic chart views for executive decision-making"
    ],
    architectureDetails: "Automated spreadsheet analytics engine utilizing Power Query for data cleansing, linked to dynamic Pivot Tables and interactive slicers enabling instant drill-down by region, product, and timeline.",
    githubUrl: "https://github.com/nandan-npr"
  },
  {
    id: "hr-analytics-dashboard",
    title: "HR Analytics Dashboard",
    subtitle: "Workforce Attrition & Department Reporting Suite",
    category: "data-bi",
    categoryLabel: "Data & BI Analytics",
    period: "2026",
    statusBadge: "Power BI Model",
    isFeatured: true,
    problemSolved: "Human Resources leadership lacked clear visibility into turnover patterns, department-level attrition drivers, workforce demographics, and retention indicators.",
    solution: "Developed an interactive HR Analytics Dashboard to monitor employee attrition, workforce distribution, department metrics, attendance, and key performance indicators using Power BI and custom DAX measures.",
    technologies: ["Power BI", "Power Query", "DAX", "Data Modeling", "KPI Dashboards", "Excel"],
    features: [
      "Monitored employee attrition, workforce distribution, department metrics, attendance, and key performance indicators",
      "Power Query data transformation pipelines, dimensional data models, and custom DAX measures for KPI reporting and analysis",
      "Interactive dashboards with slicers, KPI cards, drill-through pages, and charts to support workforce analysis, reporting, and decision-making",
      "Analyzed workforce data to identify employee trends, attrition patterns, and department-level insights for improved HR decision-making"
    ],
    contributions: [
      "Transformed raw workforce records into structured relational star-schema data models using Power Query",
      "Formulated 15+ custom DAX expressions for attrition percentages, headcount variations, and department tenure averages",
      "Engineered drill-through report pages delivering deep visibility into turnover drivers for executive decision-making"
    ],
    architectureDetails: "Power BI analytical model with star-schema relationships. Custom DAX measures calculate rolling attrition rates, satisfaction scores, and demographic tenure distributions.",
    githubUrl: "https://github.com/nandan-npr"
  }
];

export const BACKUP_EXPERIENCES: ExperienceItem[] = [
  {
    id: "mindmatrix",
    company: "MindMatrix Organisation",
    role: "Android App Development Intern",
    type: "Remote",
    location: "Bengaluru / Remote",
    period: "Feb 2026 – May 2026",
    summary: "Maintained structured project information, tracked tasks, monitored workflow progress, developed Android application screens in Android Studio, and utilized Generative AI tools to accelerate development workflows and testing.",
    responsibilities: [
      "Maintained structured project information, tracked tasks, monitored workflow progress, and organized updates to support smooth project execution.",
      "Developed Android application screens, navigation flows, and feature functionality using Kotlin and Android Studio.",
      "Used spreadsheets and digital tools for task planning, reporting, documentation, workflow management, and project coordination.",
      "Maintained accurate records and coordinated task updates while working with the project team on day-to-day activities.",
      "Performed functional testing and debugging to identify issues and validate functionality across different workflows.",
      "Used Generative AI tools to support requirement understanding, documentation, issue tracking, debugging assistance, testing, and productivity improvement."
    ],
    technologies: ["Android Studio", "Kotlin", "Generative AI Tools", "Spreadsheets & Digital Tools", "Task Management", "Functional Testing"],
    keyImpact: "Streamlined project milestone tracking, ensured dependable mobile screen delivery, and elevated documentation velocity through AI-assisted workflows."
  },
  {
    id: "1stop-ai",
    company: "1Stop.ai",
    role: "Back-End Developer Intern",
    type: "Hybrid",
    location: "Bengaluru / Hybrid",
    period: "Jun 2025 – Sep 2025",
    summary: "Worked with structured datasets, database records, CRUD operations, and application workflows to support project activities and backend request management.",
    responsibilities: [
      "Worked with structured datasets, database records, CRUD operations, and application workflows to support project activities.",
      "Developed backend modules involving database operations, CRUD functionality, and REST-based application workflows.",
      "Used MySQL and database queries to manage, retrieve, and verify application data during backend development.",
      "Assisted with data validation, record management, reporting, documentation, and workflow tracking.",
      "Supported issue tracking and maintained accurate project information while coordinating data-related activities."
    ],
    technologies: ["SQL / MySQL", "Node.js / Express", "CRUD Operations", "REST APIs", "Data Validation", "Workflow Tracking"],
    keyImpact: "Optimized database query reliability, verified data integrity across backend records, and maintained accurate technical documentation."
  }
];

export const BACKUP_SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "technical",
    name: "Technical & Development",
    categoryName: "Technical & Development",
    iconName: "Code2",
    description: "Core programming languages, full-stack frameworks, backend APIs, and modern database technologies.",
    skills: [
      { name: "JavaScript", level: "Advanced", supportedBy: "Full-stack web applications, React.js & Node.js development" },
      { name: "Python", level: "Advanced", supportedBy: "Data analysis, backend scripts, algorithmic problem solving" },
      { name: "React.js", level: "Advanced", supportedBy: "Skinmatics, CloudVault, IBM SkillsBuild Certification" },
      { name: "Node.js & Express.js", level: "Advanced", supportedBy: "Skinmatics and CloudVault RESTful API architectures" },
      { name: "REST APIs & CRUD", level: "Advanced", supportedBy: "1Stop.ai internship, Skinmatics, CloudVault" },
      { name: "MongoDB", level: "Advanced", supportedBy: "Skinmatics & CloudVault document schemas and metadata" },
      { name: "HTML5 & CSS3", level: "Advanced", supportedBy: "Responsive layouts, mobile-first design, accessibility" }
    ]
  },
  {
    id: "operations",
    name: "Operations & Project Management",
    categoryName: "Operations & Project Management",
    iconName: "FileCheck",
    description: "Workflow coordination, process tracking, task management, and structured project documentation.",
    skills: [
      { name: "Workflow Coordination", level: "Advanced", supportedBy: "MindMatrix internship task tracking & cross-team execution" },
      { name: "Process Tracking", level: "Advanced", supportedBy: "Sprint planning, milestone tracking, timeline management" },
      { name: "Documentation", level: "Advanced", supportedBy: "Technical specifications, API docs, sprint logs" },
      { name: "Task Management", level: "Advanced", supportedBy: "Digital task boards, backlog grooming, priority alignment" },
      { name: "Issue Tracking", level: "Proficient", supportedBy: "1Stop.ai and MindMatrix bug logging and resolution tracking" }
    ]
  },
  {
    id: "analytics",
    name: "Data Analytics & Reporting",
    categoryName: "Data Analytics & Reporting",
    iconName: "BarChart3",
    description: "Data analysis, validation, KPI modeling, and business performance reporting.",
    skills: [
      { name: "Data Analysis", level: "Advanced", supportedBy: "Sales Dashboard, HR Analytics, Deloitte Forage program" },
      { name: "Data Cleaning & Validation", level: "Advanced", supportedBy: "1Stop.ai dataset validation, Power Query pipelines" },
      { name: "KPI Tracking & Modeling", level: "Advanced", supportedBy: "HR Analytics Dashboard, regional sales performance" },
      { name: "MIS & Business Reporting", level: "Advanced", supportedBy: "Executive summary dashboards, weekly metric reports" },
      { name: "Data Interpretation", level: "Advanced", supportedBy: "Translating complex metrics into actionable decisions" }
    ]
  },
  {
    id: "tools",
    name: "Tools, Databases & Platforms",
    categoryName: "Tools, Databases & Platforms",
    iconName: "Cpu",
    description: "Database engines, development environments, version control, and data visualization software.",
    skills: [
      { name: "Microsoft Excel", level: "Advanced", supportedBy: "Pivot Tables, XLOOKUP, SUMIFS, Slicers, Sales Dashboard" },
      { name: "Power BI", level: "Advanced", supportedBy: "Power Query, DAX measures, KPI Dashboards, HR Analytics" },
      { name: "SQL & MySQL", level: "Advanced", supportedBy: "1Stop.ai backend, relational queries, join optimizations" },
      { name: "Google Sheets", level: "Advanced", supportedBy: "Collaborative reporting, data tracking, formula automation" },
      { name: "Git & GitHub", level: "Advanced", supportedBy: "Version control, branching, repository management" },
      { name: "Postman & VS Code", level: "Advanced", supportedBy: "API endpoint testing, debugging, development environment" },
      { name: "Android Studio", level: "Proficient", supportedBy: "MindMatrix Android development internship" }
    ]
  }
];

export const BACKUP_CERTIFICATIONS: CertificationItem[] = [
  {
    id: "hackerrank-swe",
    name: "Software Engineer Certification",
    issuer: "HackerRank",
    date: "2026",
    credentialBadge: "Verified Credential",
    category: "Tech & Dev",
    description: "Industry credential validating core software engineering proficiency, problem solving, data structures, algorithms, and REST API development.",
    credentialUrl: "https://www.hackerrank.com/certificates"
  },
  {
    id: "deloitte-data",
    name: "Data Analyst Fundamentals",
    issuer: "Deloitte Virtual Experience Program (Forage)",
    date: "2026",
    credentialBadge: "Verified Credential",
    category: "Data Analytics",
    description: "Practical simulation covering real-world business data analysis, data quality validation, statistical interpretation, and executive presentation of findings.",
    credentialUrl: "https://www.theforage.com/simulations/deloitte/data-analyst-fundamentals"
  },
  {
    id: "cisco-analytics",
    name: "Data Analytics Essentials",
    issuer: "Cisco Networking Academy",
    date: "2026",
    credentialBadge: "Verified Credential",
    category: "Data Analytics",
    description: "Comprehensive foundation in data analytics lifecycle, data gathering, exploratory data analysis, and transforming raw inputs into actionable business intelligence.",
    credentialUrl: "https://www.netacad.com/courses/data-analytics-essentials"
  },
  {
    id: "anthropic-claude",
    name: "Claude 101",
    issuer: "Anthropic",
    date: "2026",
    credentialBadge: "Verified Credential",
    category: "AI & Systems",
    description: "Official credential in large language model fundamentals, prompt engineering principles, generative AI integration, and AI-assisted engineering workflows.",
    credentialUrl: "https://anthropic.com"
  },
  {
    id: "infosys-ml",
    name: "Machine Learning",
    issuer: "Infosys Springboard",
    date: "2026",
    credentialBadge: "Verified Credential",
    category: "Tech & Dev",
    description: "Foundation in machine learning algorithms, supervised learning, data pre-processing pipelines, model evaluation metrics, and feature engineering.",
    credentialUrl: "https://infyspringboard.onwingspan.com"
  },
  {
    id: "ibm-react",
    name: "Introduction to React",
    issuer: "IBM SkillsBuild",
    date: "2026",
    credentialBadge: "Verified Credential",
    category: "Tech & Dev",
    description: "In-depth training on React core fundamentals, functional components, state and props management, hooks, event handling, and single-page application architecture.",
    credentialUrl: "https://skillsbuild.org"
  }
];

export const BACKUP_EDUCATION: EducationItem = {
  degree: "Bachelor of Engineering (B.E.) in Computer Science and Engineering",
  institution: "Cambridge Institute of Technology",
  location: "Bengaluru, Karnataka, India",
  period: "August 2022 – May 2026",
  cgpa: "8.0 / 10.0",
  focus: "Full-Stack Software Engineering, Database Systems (MySQL & MongoDB), REST APIs, and Applied Data Analytics",
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

export const BACKUP_SOCIAL_LINKS = [
  { id: "linkedin", platform: "LinkedIn", label: "LINKEDIN", url: "https://www.linkedin.com/in/nandan01/", enabled: true, isEnabled: true, sortOrder: 1 },
  { id: "github", platform: "GitHub", label: "GITHUB", url: "https://github.com/nandan-npr", enabled: true, isEnabled: true, sortOrder: 2 },
  { id: "email", platform: "Email", label: "EMAIL", url: "mailto:nandanpruthvi1@gmail.com", enabled: true, isEnabled: true, sortOrder: 3 },
  { id: "phone", platform: "Phone", label: "PHONE", url: "tel:+916362191396", enabled: true, isEnabled: true, sortOrder: 4 }
];
