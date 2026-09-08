import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

function buildResume(version = 'swe', outputPath) {
  const isSwe = version === 'swe';
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 36, bottom: 36, left: 40, right: 40 },
    info: {
      Title: `Nandan Pruthvi Raj R - ${isSwe ? 'Software Engineer' : 'Data Analyst'} Resume`,
      Author: 'Nandan Pruthvi Raj R',
      Subject: isSwe ? 'Software Engineering & AI Integration' : 'Data Analytics & Business Intelligence',
      Keywords: 'Software Engineer, Data Analyst, React, Node.js, Python, SQL, Power BI, Bengaluru'
    }
  });

  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  const primaryColor = '#111111';
  const accentColor = '#8A6A27'; // Sophisticated metallic gold/bronze
  const secondaryColor = '#4B5563';
  const lightBorder = '#D1D5DB';

  // --- HEADER ---
  doc.font('Helvetica-Bold').fontSize(22).fillColor(primaryColor).text('NANDAN PRUTHVI RAJ R', { align: 'left' });
  doc.moveDown(0.2);

  const titleText = isSwe
    ? 'SOFTWARE ENGINEER  |  FULL-STACK & AI INTEGRATION'
    : 'DATA ANALYST  |  BUSINESS INTELLIGENCE & DATA SYSTEMS';

  doc.font('Helvetica-Bold').fontSize(10).fillColor(accentColor).text(titleText, { align: 'left', tracking: 1.5 });
  doc.moveDown(0.3);

  const contactLine = 'Bengaluru, Karnataka, India  |  +91 63621 91396  |  nandanpruthvi1@gmail.com';
  doc.font('Helvetica').fontSize(8.5).fillColor(secondaryColor).text(contactLine);

  const linksLine = 'LinkedIn: linkedin.com/in/nandan01   |   GitHub: github.com/nandan-npr   |   Immediate Joiner';
  doc.text(linksLine);

  doc.moveDown(0.5);
  doc.strokeColor(lightBorder).lineWidth(0.75).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
  doc.moveDown(0.5);

  // Helper for Section Titles
  function sectionHeading(title) {
    doc.moveDown(0.4);
    doc.font('Helvetica-Bold').fontSize(10).fillColor(primaryColor).text(title.toUpperCase(), { tracking: 1.2 });
    doc.strokeColor(accentColor).lineWidth(1.2).moveTo(40, doc.y + 2).lineTo(140, doc.y + 2).stroke();
    doc.strokeColor(lightBorder).lineWidth(0.5).moveTo(140, doc.y + 2).lineTo(555, doc.y + 2).stroke();
    doc.moveDown(0.5);
  }

  // --- PROFESSIONAL SUMMARY ---
  sectionHeading('Professional Summary');
  doc.font('Helvetica').fontSize(8.8).fillColor(primaryColor).lineGap(2);
  if (isSwe) {
    doc.text(
      'Computer Science Engineering graduate (Cambridge Institute of Technology, CGPA 8.0/10) with hands-on expertise building scalable full-stack web applications, AI-integrated microservices, and high-performance REST APIs. Proven internship experience at 1Stop.ai (Backend Systems) and MindMatrix (Mobile Gen-AI Workflows). Skilled across JavaScript/TypeScript, React, Node.js, Express, Python, MongoDB, and SQL with 90+ LeetCode/GFG algorithmic problems solved.'
    );
  } else {
    doc.text(
      'Computer Science Engineering graduate (Cambridge Institute of Technology, CGPA 8.0/10) specializing in quantitative data analytics, business intelligence modeling, and data pipeline development. Proven track record transforming complex relational datasets into strategic decision dashboards using Power BI Desktop, Power Query ETL, custom DAX measures, Advanced SQL, Python (Pandas/NumPy), and Excel modeling. Experienced in HR attrition analytics and retail sales reporting.'
    );
  }

  // --- TECHNICAL SKILLS ---
  sectionHeading('Technical Skills');
  doc.font('Helvetica').fontSize(8.5).fillColor(primaryColor).lineGap(1.5);
  if (isSwe) {
    doc.font('Helvetica-Bold').text('Languages & Frameworks: ', { continued: true })
       .font('Helvetica').text('JavaScript (ES6+), TypeScript, Python, C++, HTML5, CSS3, React.js, Node.js, Express.js, Tailwind CSS');
    doc.font('Helvetica-Bold').text('Databases & Storage: ', { continued: true })
       .font('Helvetica').text('MongoDB, PostgreSQL, MySQL, Relational Database Modeling, Schema Indexing');
    doc.font('Helvetica-Bold').text('AI Integration & Tools: ', { continued: true })
       .font('Helvetica').text('Google Gemini API, RESTful APIs, Git, GitHub, Postman, Vite, Vercel, Render, Cloudflare');
    doc.font('Helvetica-Bold').text('Core Engineering: ', { continued: true })
       .font('Helvetica').text('Data Structures & Algorithms (90+ LeetCode/GFG), Object-Oriented Programming, System Architecture');
  } else {
    doc.font('Helvetica-Bold').text('BI & Visualization: ', { continued: true })
       .font('Helvetica').text('Power BI Desktop, Power Query ETL, DAX (Data Analysis Expressions), KPI Dashboards, Star Schemas');
    doc.font('Helvetica-Bold').text('Data Analysis & Code: ', { continued: true })
       .font('Helvetica').text('Python (Pandas, NumPy, Matplotlib, Seaborn), SQL (Aggregations, Window Functions, Joins, CTEs), Excel (Pivot, VLOOKUP, Solver)');
    doc.font('Helvetica-Bold').text('Databases & Web: ', { continued: true })
       .font('Helvetica').text('PostgreSQL, MySQL, MongoDB, React.js, Node.js, REST API Data Extraction');
    doc.font('Helvetica-Bold').text('Core Competencies: ', { continued: true })
       .font('Helvetica').text('Workforce Attrition Modeling, Retail Sales Analytics, Data Cleansing, Statistical Summaries, A/B Testing Analysis');
  }

  // --- PROFESSIONAL EXPERIENCE ---
  sectionHeading('Work & Internship Experience');

  // Experience 1: 1Stop.ai
  doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text('Backend Engineering Intern  |  1Stop.ai', { continued: true });
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(accentColor).text('Bengaluru, India', { align: 'right' });
  doc.font('Helvetica-Oblique').fontSize(8).fillColor(secondaryColor).text('May 2024 – Jul 2024  (Full-Time Internship)');
  doc.moveDown(0.2);
  doc.font('Helvetica').fontSize(8.5).fillColor(primaryColor).lineGap(1.5);
  doc.text('• Designed and maintained scalable server-side REST API endpoints utilizing Node.js and Express.js for platform user operations.');
  doc.text('• Integrated database CRUD operations with structured query optimization, reducing query response times across high-traffic tables.');
  doc.text('• Collaborated in cross-functional standups to resolve backend authentication, request validation, and production error debugging.');

  doc.moveDown(0.4);

  // Experience 2: MindMatrix
  doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text('Mobile Application & AI Intern  |  MindMatrix', { continued: true });
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(accentColor).text('Bengaluru, India', { align: 'right' });
  doc.font('Helvetica-Oblique').fontSize(8).fillColor(secondaryColor).text('Dec 2023 – Jan 2024  (Winter Internship)');
  doc.moveDown(0.2);
  doc.font('Helvetica').fontSize(8.5).fillColor(primaryColor).lineGap(1.5);
  doc.text('• Developed responsive user interface screens and tested interactive state handlers within production mobile application workflows.');
  doc.text('• Evaluated generative AI workflow prompts and assisted in integrating client-side request pipelines with backend services.');
  doc.text('• Authored technical documentation and test cases verifying user validation rules and cross-platform consistency.');

  // --- KEY PROJECTS ---
  sectionHeading('Featured Technical Projects');

  if (isSwe) {
    // Project 1: Skinmatics
    doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text('Skinmatics — Skincare Clinic Appointment Management System', { continued: true });
    doc.font('Helvetica').fontSize(8).fillColor(accentColor).text('React, Node.js, Express, MongoDB, REST APIs, Render', { align: 'right' });
    doc.font('Helvetica').fontSize(8.5).fillColor(primaryColor).lineGap(1.5);
    doc.text('• Built complete end-to-end medical clinic booking web platform with responsive user appointment scheduling and inquiries.');
    doc.text('• Engineered protected administrative dashboard allowing clinic staff to review, update status, and manage incoming patient queues.');
    doc.text('• Designed indexed MongoDB collections for consultation slots and implemented input validation preventing double-booking.');
    doc.moveDown(0.35);

    // Project 2: Aura Shop
    doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text('Aura Shop — AI-Integrated Full-Stack E-Commerce Platform', { continued: true });
    doc.font('Helvetica').fontSize(8).fillColor(accentColor).text('React, Express, Node.js, MongoDB, Google Gemini API, Tailwind CSS', { align: 'right' });
    doc.font('Helvetica').fontSize(8.5).fillColor(primaryColor).lineGap(1.5);
    doc.text('• Developed an interactive online store featuring real-time catalog filtering, responsive cart state, and order workflows.');
    doc.text('• Integrated Google Gemini API on the backend to deliver a contextual shopping assistant answering customer product queries.');
    doc.text('• Secured API keys via backend proxy architecture and handled concurrent client requests with stateless session tokens.');
    doc.moveDown(0.35);

    // Project 3: Verified Careers
    doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text('Verified Careers — Recruitment Opportunity & Verification System', { continued: true });
    doc.font('Helvetica').fontSize(8).fillColor(accentColor).text('React.js, Node.js, Express, MongoDB, OTP Auth, Data Validation', { align: 'right' });
    doc.font('Helvetica').fontSize(8.5).fillColor(primaryColor).lineGap(1.5);
    doc.text('• Designed verification-first job board combating fraudulent postings with dedicated admin approval queues and candidate feeds.');
    doc.text('• Implemented OTP-based authentication and role-based permissions separating candidate applications from admin review controls.');
  } else {
    // Project 1: HR Analytics Intelligence Dashboard
    doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text('HR Analytics Intelligence Dashboard — Workforce Attrition Reporting Suite', { continued: true });
    doc.font('Helvetica').fontSize(8).fillColor(accentColor).text('Power BI Desktop, Power Query, DAX, Data Modeling, Excel', { align: 'right' });
    doc.font('Helvetica').fontSize(8.5).fillColor(primaryColor).lineGap(1.5);
    doc.text('• Built an interactive BI executive dashboard analyzing 1,400+ workforce records across department, tenure, and compensation tiers.');
    doc.text('• Formulated 15+ custom DAX measures for Attrition Rate %, Average Monthly Income, Headcount, and Job Satisfaction indexes.');
    doc.text('• Uncovered key turnover drivers in sales and R&D departments, enabling HR leadership to simulate retention interventions.');
    doc.moveDown(0.35);

    // Project 2: Blinkit Grocery Sales Intelligence Engine
    doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text('Blinkit Grocery Retail Sales Analytics & Outlet Performance Dashboard', { continued: true });
    doc.font('Helvetica').fontSize(8).fillColor(accentColor).text('Power BI Desktop, Power Query ETL, DAX Measures, Excel', { align: 'right' });
    doc.font('Helvetica').fontSize(8.5).fillColor(primaryColor).lineGap(1.5);
    doc.text('• Developed multi-page grocery retail intelligence suite tracking 8,500+ SKU transaction records across Tier 1-3 urban outlets.');
    doc.text('• Engineered star-schema data models and DAX KPIs for Total Sales Revenue ($1.20M), Average Sales/Item ($141), and Outlet Ratings.');
    doc.text('• Isolated top-performing product categories (Snacks, Dairy, Fruits) and revealed outlet vintage vs. revenue efficiency patterns.');
    doc.moveDown(0.35);

    // Project 3: Aura Shop / Verified Careers Data Systems
    doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text('Verified Careers & Platform Data Lifecycle Systems', { continued: true });
    doc.font('Helvetica').fontSize(8).fillColor(accentColor).text('Python, SQL, MongoDB, Excel Data Modeling, REST Data APIs', { align: 'right' });
    doc.font('Helvetica').fontSize(8.5).fillColor(primaryColor).lineGap(1.5);
    doc.text('• Modeled data schemas for candidate applicant flows, recruitment eligibility criteria, and administrative status state machines.');
    doc.text('• Executed data cleansing scripts in Python and SQL queries to eliminate duplicate recruiter entries and benchmark job trends.');
  }

  // --- EDUCATION ---
  sectionHeading('Education');
  doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text('Bachelor of Engineering (B.E.) in Computer Science & Engineering', { continued: true });
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(accentColor).text('CGPA: 8.0 / 10.0', { align: 'right' });
  doc.font('Helvetica').fontSize(8.5).fillColor(secondaryColor).text('Cambridge Institute of Technology, Bengaluru, Karnataka (VTU)  |  Graduation: 2026');
  doc.font('Helvetica').fontSize(8).fillColor(secondaryColor).text('Key Coursework: Data Structures & Algorithms, Database Management Systems (DBMS), Operating Systems, Computer Networks, Software Engineering');

  // --- CERTIFICATIONS & ACHIEVEMENTS ---
  sectionHeading('Certifications & Achievements');
  doc.font('Helvetica').fontSize(8.5).fillColor(primaryColor).lineGap(1.5);
  doc.text('• Full Stack Web Development (MERN Stack) — Cambridge Institute of Technology & Industry Partners');
  doc.text('• Data Analytics & Visualization Job Simulation — Forage (Accenture North America & Boston Consulting Group)');
  doc.text('• Problem Solving & Algorithmic Practice — 90+ LeetCode and GeeksforGeeks problems solved (Arrays, Strings, Linked Lists, Trees)');

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => resolve(outputPath));
    writeStream.on('error', reject);
  });
}

async function run() {
  console.log('Generating resumes into /public ...');
  const swePath = path.join(publicDir, 'resume-software-engineer.pdf');
  const daPath = path.join(publicDir, 'resume-data-analyst.pdf');
  const defaultPath = path.join(publicDir, 'resume.pdf');

  await buildResume('swe', swePath);
  console.log('Generated:', swePath);

  await buildResume('da', daPath);
  console.log('Generated:', daPath);

  try {
    console.log('Standardizing and validating PDFs with Ghostscript pdfwrite...');
    const sweTmp = `${swePath}.tmp.pdf`;
    const daTmp = `${daPath}.tmp.pdf`;
    execSync(`gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${sweTmp}" "${swePath}"`);
    fs.renameSync(sweTmp, swePath);
    execSync(`gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${daTmp}" "${daPath}"`);
    fs.renameSync(daTmp, daPath);
    console.log('PDFs successfully standardized and validated with 100% PDF 1.4 compliance');
  } catch (err) {
    console.warn('Ghostscript pdfwrite warning (non-fatal):', err.message);
  }

  // Copy or build default resume.pdf (Software Engineer & Data Systems positioning)
  fs.copyFileSync(swePath, defaultPath);
  console.log('Generated default:', defaultPath);

  try {
    console.log('Rendering high-res page previews using Ghostscript...');
    const swePng = path.join(publicDir, 'resume-page-swe.png');
    const daPng = path.join(publicDir, 'resume-page-da.png');
    execSync(`gs -dNOPAUSE -dBATCH -sDEVICE=png16m -r200 -sOutputFile="${swePng}" "${swePath}"`);
    execSync(`gs -dNOPAUSE -dBATCH -sDEVICE=png16m -r200 -sOutputFile="${daPng}" "${daPath}"`);
    console.log('Page previews rendered:', swePng, daPng);
  } catch (err) {
    console.warn('Ghostscript rendering warning (non-fatal):', err.message);
  }

  console.log('All resume PDFs and previews generated successfully!');
}

run().catch(console.error);
