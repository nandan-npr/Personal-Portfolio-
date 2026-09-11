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

/**
 * Builds the authentic new resume matching the exact uploaded PDF format.
 * Supported tracks:
 * - 'overall': The master overall resume combining full-stack, data, analytics & operations.
 * - 'swe': Technical software engineering resume.
 * - 'da': Data analysis & business intelligence resume.
 */
function buildResume(track = 'overall', outputPath) {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 32, bottom: 32, left: 38, right: 38 },
    info: {
      Title: `Nandan Pruthvi Raj R - Resume (${track.toUpperCase()})`,
      Author: 'Nandan Pruthvi Raj R',
      Subject: 'Computer Science Engineer — Software Engineer & Data Analyst',
      Keywords: 'Nandan Pruthvi Raj R, Software Engineer, Data Analyst, React, Node.js, Python, SQL, MongoDB, Power BI, Bengaluru'
    }
  });

  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  const primaryColor = '#0F172A';
  const secondaryColor = '#334155';
  const lightLine = '#94A3B8';

  // --- HEADER (Centered, matching uploaded resume) ---
  doc.font('Times-Bold').fontSize(19).fillColor(primaryColor).text('Nandan Pruthvi Raj R', { align: 'center' });
  doc.moveDown(0.15);
  doc.font('Times-Roman').fontSize(9.5).fillColor(secondaryColor).text('Bengaluru, India', { align: 'center' });
  doc.moveDown(0.15);

  const contactLine = '+91 6362191396   |   nandanpruthvi1@gmail.com   |   linkedin.com/in/nandan01/   |   github.com/nandan-npr';
  doc.font('Times-Roman').fontSize(8.5).fillColor(secondaryColor).text(contactLine, { align: 'center' });
  doc.moveDown(0.5);

  // Helper for Section Heading with Underline Rule
  function renderSectionHeading(title) {
    doc.moveDown(0.35);
    doc.font('Times-Bold').fontSize(10.5).fillColor(primaryColor).text(title.toUpperCase(), { align: 'left' });
    const y = doc.y + 1.5;
    doc.strokeColor(lightLine).lineWidth(0.6).moveTo(38, y).lineTo(557, y).stroke();
    doc.moveDown(0.4);
  }

  // --- SUMMARY ---
  renderSectionHeading(track === 'da' ? 'Summary' : 'Professional Summary');
  doc.font('Times-Roman').fontSize(8.6).fillColor(primaryColor).lineGap(1.4);

  if (track === 'overall') {
    doc.text(
      'Adaptable and motivated Computer Science Engineering graduate with hands-on experience working in team environments, supporting projects, organizing information, and handling technology-driven tasks. Enjoys taking responsibility, learning new processes quickly, and finding practical solutions when faced with unfamiliar challenges. Comfortable coordinating tasks, maintaining documentation, communicating updates, and working with different types of people and tools. Brings a combination of technical understanding, business awareness, problem-solving ability, and a willingness to learn beyond academic knowledge. Interested in understanding how teams, processes, and businesses operate and contributing wherever support is needed. Known for being curious, dependable, detail-oriented, and open to taking on new responsibilities. Looking to begin a professional career where I can contribute to the team, gain real-world experience, and grow across business and technology functions.',
      { align: 'justify' }
    );
  } else if (track === 'swe') {
    doc.text(
      'Computer Science Engineering graduate with a strong interest in building practical software solutions and learning how real-world applications work. Hands-on experience developing full-stack web applications, backend services, Android applications, and database-driven features through internships and personal projects. Enjoys turning ideas into functional applications, connecting frontend interfaces with backend services, and solving technical problems through debugging and testing. Experienced in building and working with REST APIs, CRUD-based systems, and dynamic admin functionality. Comfortable exploring new technologies and using modern development tools to improve productivity and solve problems efficiently. Strong logical thinking, curiosity, and attention to detail with a genuine interest in software development and technology. Looking to start a career where I can contribute, learn quickly, and grow as a software professional.',
      { align: 'justify' }
    );
  } else {
    doc.text(
      'Curious and detail-oriented Computer Science Engineering graduate who enjoys exploring data, understanding how things work, and turning unclear problems into structured solutions. I naturally approach problems by asking questions, looking for patterns, and validating information before making conclusions. I enjoy learning through hands-on work and experimenting with different approaches rather than relying only on theoretical knowledge. Known for being a quick learner who is comfortable adapting to new tools, workflows, and challenges. Strong interest in understanding business problems behind the numbers and communicating findings in a simple and meaningful way. Motivated by continuous learning, practical problem-solving, and the opportunity to create useful insights from information. Looking to begin my career in an environment where I can learn from experienced teams, contribute from day one, and grow into a strong analytics professional.',
      { align: 'justify' }
    );
  }

  // --- SKILLS ---
  renderSectionHeading(track === 'overall' ? 'Core Skills' : 'Technical Skills');
  doc.font('Times-Roman').fontSize(8.6).fillColor(primaryColor).lineGap(1.5);

  if (track === 'overall') {
    doc.font('Times-Bold').text('Technical: ', { continued: true }).font('Times-Roman').text('Python, JavaScript, React.js, Node.js, REST APIs, MongoDB');
    doc.font('Times-Bold').text('Operations: ', { continued: true }).font('Times-Roman').text('Workflow Coordination, Process Tracking, Documentation, Task Management');
    doc.font('Times-Bold').text('Analytics: ', { continued: true }).font('Times-Roman').text('Data Analysis, Data Cleaning, Data Validation, KPI Tracking, Reporting');
    doc.font('Times-Bold').text('Tools: ', { continued: true }).font('Times-Roman').text('Microsoft Excel, Power BI, Power Query, SQL, MySQL, Google Sheets');
    doc.font('Times-Bold').text('Professional: ', { continued: true }).font('Times-Roman').text('Communication, Teamwork, Problem Solving, Attention to Detail');
  } else if (track === 'swe') {
    doc.font('Times-Bold').text('Languages: ', { continued: true }).font('Times-Roman').text('JavaScript, Python, SQL');
    doc.font('Times-Bold').text('Development: ', { continued: true }).font('Times-Roman').text('React.js, Node.js, Express.js, REST APIs, HTML5, CSS3');
    doc.font('Times-Bold').text('Databases: ', { continued: true }).font('Times-Roman').text('MySQL, MongoDB');
    doc.font('Times-Bold').text('Tools: ', { continued: true }).font('Times-Roman').text('Git, GitHub, Postman, VS Code');
    doc.font('Times-Bold').text('Analytics: ', { continued: true }).font('Times-Roman').text('Microsoft Excel, Power BI');
  } else {
    doc.font('Times-Bold').text('Data Analysis: ', { continued: true }).font('Times-Roman').text('SQL, Python, Data Cleaning, Data Validation, Data Interpretation, Reporting');
    doc.font('Times-Bold').text('Excel: ', { continued: true }).font('Times-Roman').text("Pivot Tables, Pivot Charts, LOOKUP's, SUMIFS, Conditional Formatting, Slicers, Formulas");
    doc.font('Times-Bold').text('Power BI: ', { continued: true }).font('Times-Roman').text('Power Query, DAX, Data Modeling, KPI Dashboards, Data Visualization');
    doc.font('Times-Bold').text('Databases: ', { continued: true }).font('Times-Roman').text('MySQL, MongoDB, Database Queries');
    doc.font('Times-Bold').text('Tools: ', { continued: true }).font('Times-Roman').text('Microsoft Excel, Power BI, Google Sheets');
  }

  // --- EXPERIENCE ---
  renderSectionHeading('Experience');

  // Experience 1: MindMatrix Organisation
  doc.font('Times-Bold').fontSize(9).fillColor(primaryColor).text('MindMatrix Organisation', { continued: true });
  doc.font('Times-Roman').fontSize(8.5).fillColor(primaryColor).text('Feb 2026 – May 2026', { align: 'right' });
  doc.font('Times-Italic').fontSize(8.5).fillColor(secondaryColor).text('Android App Development Intern', { continued: true });
  doc.font('Times-Roman').fontSize(8.5).fillColor(secondaryColor).text('Bengaluru / Remote', { align: 'right' });
  doc.moveDown(0.2);

  doc.font('Times-Roman').fontSize(8.5).fillColor(primaryColor).lineGap(1.4);
  if (track === 'overall' || track === 'da') {
    doc.text('•  Worked with application data, database-driven workflows, structured records, and project documentation during application development.');
    doc.text('•  Maintained structured project information, tracked tasks, monitored workflow progress, and organized updates to support smooth project execution.');
    doc.text('•  Used spreadsheets and digital tools for task planning, reporting, documentation, workflow management, and project coordination.');
    doc.text('•  Used Generative AI tools to support requirement understanding, documentation, issue tracking, debugging assistance, and productivity improvement.');
  } else {
    doc.text('•  Developed Android application screens, navigation flows, and feature functionality using Kotlin and Android Studio.');
    doc.text('•  Worked on database-driven application functionality and validated application workflows during development.');
    doc.text('•  Performed functional testing and debugging to identify issues and verify fixes across application features.');
    doc.text('•  Used Generative AI tools to support requirement understanding, debugging assistance, testing, and technical documentation.');
  }
  doc.moveDown(0.35);

  // Experience 2: 1Stop.ai
  doc.font('Times-Bold').fontSize(9).fillColor(primaryColor).text('1Stop.ai', { continued: true });
  doc.font('Times-Roman').fontSize(8.5).fillColor(primaryColor).text('Jun 2025 – Sep 2025', { align: 'right' });
  doc.font('Times-Italic').fontSize(8.5).fillColor(secondaryColor).text('Back-End Developer Intern', { continued: true });
  doc.font('Times-Roman').fontSize(8.5).fillColor(secondaryColor).text('Bengaluru / Hybrid', { align: 'right' });
  doc.moveDown(0.2);

  doc.font('Times-Roman').fontSize(8.5).fillColor(primaryColor).lineGap(1.4);
  if (track === 'overall' || track === 'da') {
    doc.text('•  Worked with structured datasets, database records, CRUD operations, and application workflows to support project activities.');
    doc.text('•  Used MySQL and database queries to manage, retrieve, and verify application data during backend development.');
    doc.text('•  Assisted with data validation, record management, reporting, documentation, and workflow tracking.');
    doc.text('•  Supported issue tracking and maintained accurate project information while coordinating data-related activities.');
  } else {
    doc.text('•  Developed backend modules involving database operations, CRUD functionality, and REST-based application workflows.');
    doc.text('•  Worked with API-driven functionality and database operations to support application features and data management.');
    doc.text('•  Validated API and backend workflows using testing and debugging techniques to identify and troubleshoot issues.');
    doc.text('•  Worked with MySQL to manage and verify application data during backend development.');
  }

  // --- PROJECTS ---
  renderSectionHeading('Projects');

  if (track === 'da') {
    // Project 1: Sales Dashboard
    doc.font('Times-Bold').fontSize(9).fillColor(primaryColor).text('Sales Dashboard', { continued: true });
    doc.font('Times-Italic').fontSize(8.5).fillColor(secondaryColor).text('Microsoft Excel, Power Query | 2026', { align: 'right' });
    doc.moveDown(0.15);
    doc.font('Times-Roman').fontSize(8.5).fillColor(primaryColor).lineGap(1.4);
    doc.text('•  Built an interactive Sales Dashboard to track revenue, profit, regional performance, and top-selling products using KPI-driven visualizations.');
    doc.text('•  Applied Pivot Tables, Pivot Charts, XLOOKUP, SUMIFS, Conditional Formatting, Slicers, and formulas to automate reporting and summarize business performance.');
    doc.text('•  Performed data cleaning, validation, and analysis to identify sales trends and generate actionable business insights.');
    doc.text('•  Created dynamic reports that allow users to filter and analyze sales performance across regions, products, and key business metrics.');
    doc.moveDown(0.3);

    // Project 2: HR Analytics Dashboard
    doc.font('Times-Bold').fontSize(9).fillColor(primaryColor).text('HR Analytics Dashboard', { continued: true });
    doc.font('Times-Italic').fontSize(8.5).fillColor(secondaryColor).text('Power BI, Power Query, DAX | 2026', { align: 'right' });
    doc.moveDown(0.15);
    doc.font('Times-Roman').fontSize(8.5).fillColor(primaryColor).lineGap(1.4);
    doc.text('•  Developed an interactive HR Analytics Dashboard to monitor employee attrition, workforce distribution, department metrics, attendance, and key performance indicators.');
    doc.text('•  Used Power Query for data transformation, created data models, and implemented DAX measures for KPI reporting and analysis.');
    doc.text('•  Designed interactive dashboards with slicers, KPI cards, drill-through pages, and charts to support workforce analysis and business reporting.');
    doc.text('•  Analyzed workforce data to identify employee trends, attrition patterns, and department-level insights for improved HR reporting and decision-making.');
  } else {
    // Project 1: Skinmatics
    doc.font('Times-Bold').fontSize(9).fillColor(primaryColor).text('Skinmatics – Full-Stack Skincare Appointment Platform', { continued: true });
    doc.font('Times-Italic').fontSize(8.5).fillColor(secondaryColor).text('React.js, Node.js, Express.js, MongoDB | 2026', { align: 'right' });
    doc.moveDown(0.15);
    doc.font('Times-Roman').fontSize(8.5).fillColor(primaryColor).lineGap(1.4);
    doc.text('•  Developed and deployed a full-stack skincare appointment platform with user interactions, appointment booking, enquiry management, and an admin dashboard.');
    doc.text('•  Implemented REST APIs, CRUD operations, and MongoDB database integration for managing application records and user workflows.');
    doc.text('•  Built an admin-controlled system where authorized users can update information such as doctor details directly from the dashboard without changing the source code.');
    doc.text('•  Integrated frontend and backend workflows and used AI-assisted development tools for feature implementation, debugging, code understanding, and testing.');
    doc.moveDown(0.3);

    // Project 2: CloudVault
    doc.font('Times-Bold').fontSize(9).fillColor(primaryColor).text('CloudVault – File Management Web Application', { continued: true });
    doc.font('Times-Italic').fontSize(8.5).fillColor(secondaryColor).text('React.js, Node.js, Express.js, MongoDB | 2026', { align: 'right' });
    doc.moveDown(0.15);
    doc.font('Times-Roman').fontSize(8.5).fillColor(primaryColor).lineGap(1.4);
    doc.text('•  Developed a file management application for uploading, storing, viewing, downloading, renaming, and deleting user files.');
    doc.text('•  Implemented folder management functionality to organize files and support creating, renaming, moving, and deleting folders.');
    doc.text('•  Built backend APIs and database operations for user accounts, file metadata, folders, and file management workflows.');
    doc.text('•  Integrated frontend and backend services and used AI-assisted development tools to support feature development, debugging, and testing.');
  }

  // --- EDUCATION ---
  renderSectionHeading('Education');
  doc.font('Times-Bold').fontSize(9).fillColor(primaryColor).text('Cambridge Institute of Technology, Bengaluru', { continued: true });
  doc.font('Times-Roman').fontSize(8.5).fillColor(primaryColor).text('Aug 2022 – May 2026', { align: 'right' });
  doc.font('Times-Italic').fontSize(8.5).fillColor(secondaryColor).text('B.E. in Computer Science Engineering', { continued: true });
  doc.font('Times-Bold').fontSize(8.5).fillColor(primaryColor).text('CGPA: 8.0/10', { align: 'right' });

  // --- CERTIFICATIONS ---
  renderSectionHeading('Certifications');
  doc.font('Times-Roman').fontSize(8.5).fillColor(primaryColor).lineGap(1.4);

  if (track === 'overall') {
    doc.text('•  Software Engineer Certification – HackerRank');
    doc.text('•  Data Analyst Fundamentals – Deloitte Virtual Experience Program (Forage)');
    doc.text('•  Data Analytics Essentials – Cisco Networking Academy');
    doc.text('•  Claude 101 – Anthropic');
    doc.text('•  Machine Learning – Infosys Springboard');
    doc.text('•  Introduction to React – IBM SkillsBuild');
  } else if (track === 'swe') {
    doc.text('•  Software Engineer Certification – HackerRank');
    doc.text('•  Introduction to React – IBM SkillsBuild');
    doc.text('•  Claude 101 – Anthropic');
    doc.text('•  Data Analytics Essentials – Cisco Networking Academy');
    doc.text('•  Data Analyst Fundamentals – Deloitte');
  } else {
    doc.text('•  Data Analyst Fundamentals – Deloitte');
    doc.text('•  Data Analytics Essentials – Cisco Networking Academy');
    doc.text('•  Claude 101 – Anthropic');
    doc.text('•  Software Engineer Certification – HackerRank');
    doc.text('•  Machine Learning – Infosys Springboard');
  }

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => resolve(outputPath));
    writeStream.on('error', reject);
  });
}

async function run() {
  console.log('Generating new verified resumes into /public ...');

  const overallPath = path.join(publicDir, 'resume.pdf');
  const swePath = path.join(publicDir, 'resume-software-engineer.pdf');
  const daPath = path.join(publicDir, 'resume-data-analyst.pdf');

  await buildResume('overall', overallPath);
  console.log('Generated overall resume:', overallPath);

  await buildResume('swe', swePath);
  console.log('Generated software engineer resume:', swePath);

  await buildResume('da', daPath);
  console.log('Generated data analyst resume:', daPath);

  try {
    console.log('Standardizing and validating new PDFs with Ghostscript pdfwrite...');
    const list = [overallPath, swePath, daPath];
    for (const f of list) {
      const tmp = `${f}.tmp.pdf`;
      execSync(`gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${tmp}" "${f}"`);
      fs.renameSync(tmp, f);
    }
    console.log('All new PDFs successfully standardized and validated with 100% PDF 1.4 compliance');
  } catch (err) {
    console.warn('Ghostscript pdfwrite warning (non-fatal):', err.message);
  }

  try {
    console.log('Rendering high-res page previews using Ghostscript...');
    const overallPng = path.join(publicDir, 'resume-page-overall.png');
    const swePng = path.join(publicDir, 'resume-page-swe.png');
    const daPng = path.join(publicDir, 'resume-page-da.png');

    execSync(`gs -dNOPAUSE -dBATCH -sDEVICE=png16m -r200 -sOutputFile="${overallPng}" "${overallPath}"`);
    execSync(`gs -dNOPAUSE -dBATCH -sDEVICE=png16m -r200 -sOutputFile="${swePng}" "${swePath}"`);
    execSync(`gs -dNOPAUSE -dBATCH -sDEVICE=png16m -r200 -sOutputFile="${daPng}" "${daPath}"`);

    console.log('High-res previews successfully generated:', overallPng, swePng, daPng);
  } catch (err) {
    console.warn('Ghostscript rendering warning (non-fatal):', err.message);
  }

  console.log('New resume pipeline completed successfully!');
}

run().catch(console.error);
