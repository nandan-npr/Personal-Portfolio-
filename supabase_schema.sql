-- ==============================================================================
-- SUPABASE POSTGRESQL SCHEMA & INITIAL DATA MIGRATION
-- Project: Nandan Pruthvi Raj R — Portfolio CMS
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. STORAGE BUCKETS (Creates public resumes and certificates buckets)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('resumes', 'resumes', true, 15728640, ARRAY['application/pdf']::text[]),
  ('certificates', 'certificates', true, 15728640, ARRAY['image/jpeg', 'image/png', 'application/pdf']::text[])
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies: Resumes Bucket
DROP POLICY IF EXISTS "Public Resumes Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow Resumes Download" ON storage.objects;
CREATE POLICY "Allow Resumes Download"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'resumes');

DROP POLICY IF EXISTS "Allow Resumes Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Resumes Upload" ON storage.objects;
CREATE POLICY "Authenticated Resumes Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resumes');

DROP POLICY IF EXISTS "Allow Resumes Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Resumes Update" ON storage.objects;
CREATE POLICY "Authenticated Resumes Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'resumes');

DROP POLICY IF EXISTS "Allow Resumes Delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Resumes Delete" ON storage.objects;
CREATE POLICY "Authenticated Resumes Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'resumes');

-- Storage Policies: Certificates Bucket
DROP POLICY IF EXISTS "Public Certificates Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow Certificates Download" ON storage.objects;
CREATE POLICY "Allow Certificates Download"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'certificates');

DROP POLICY IF EXISTS "Allow Certificates Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Certificates Upload" ON storage.objects;
CREATE POLICY "Authenticated Certificates Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'certificates');

DROP POLICY IF EXISTS "Allow Certificates Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Certificates Update" ON storage.objects;
CREATE POLICY "Authenticated Certificates Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'certificates');

DROP POLICY IF EXISTS "Allow Certificates Delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Certificates Delete" ON storage.objects;
CREATE POLICY "Authenticated Certificates Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'certificates');

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY DEFAULT 'main_profile',
  name TEXT NOT NULL,
  preferred_name TEXT,
  primary_title TEXT NOT NULL,
  secondary_title TEXT,
  location TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  phone_display TEXT,
  linkedin TEXT,
  github TEXT,
  availability TEXT,
  availability_status TEXT DEFAULT 'available',
  availability_text TEXT,
  value_proposition TEXT,
  short_bio TEXT,
  dsa_solved TEXT,
  education_degree TEXT,
  cgpa TEXT,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. HOMEPAGE CONTENT TABLE
CREATE TABLE IF NOT EXISTS public.homepage_content (
  id TEXT PRIMARY KEY DEFAULT 'main_homepage',
  hero_name TEXT NOT NULL,
  hero_title TEXT NOT NULL,
  hero_description TEXT NOT NULL,
  availability_label TEXT,
  who_i_am_eyebrow TEXT,
  who_i_am_heading TEXT,
  who_i_am_p1 TEXT,
  who_i_am_p2 TEXT,
  quote_text TEXT,
  quote_author TEXT,
  quote_title TEXT,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. ABOUT CONTENT TABLE
CREATE TABLE IF NOT EXISTS public.about_content (
  id TEXT PRIMARY KEY DEFAULT 'main_about',
  heading TEXT NOT NULL,
  subheading TEXT NOT NULL,
  narrative_p1 TEXT NOT NULL,
  narrative_p2 TEXT NOT NULL,
  narrative_p3 TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. RECRUITER CONTENT TABLE
CREATE TABLE IF NOT EXISTS public.recruiter_content (
  id TEXT PRIMARY KEY DEFAULT 'main_recruiter',
  hero_headline TEXT NOT NULL,
  hero_subtitle TEXT NOT NULL,
  summary TEXT NOT NULL,
  preferred_roles JSONB NOT NULL DEFAULT '[]'::jsonb,
  work_authorization TEXT NOT NULL,
  availability_timeline TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. SEO SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.seo_settings (
  id TEXT PRIMARY KEY DEFAULT 'main_seo',
  site_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  keywords TEXT NOT NULL,
  author_name TEXT NOT NULL,
  og_title TEXT NOT NULL,
  og_description TEXT NOT NULL,
  canonical_url TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  category TEXT NOT NULL,
  category_label TEXT NOT NULL,
  period TEXT NOT NULL,
  status_badge TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT true NOT NULL,
  is_enabled BOOLEAN DEFAULT true NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  problem_solved TEXT NOT NULL,
  solution TEXT NOT NULL,
  technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  contributions JSONB NOT NULL DEFAULT '[]'::jsonb,
  architecture_details TEXT NOT NULL,
  live_url TEXT,
  github_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. EXPERIENCES TABLE
CREATE TABLE IF NOT EXISTS public.experiences (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  type TEXT NOT NULL,
  location TEXT NOT NULL,
  period TEXT NOT NULL,
  is_current BOOLEAN DEFAULT false NOT NULL,
  is_enabled BOOLEAN DEFAULT true NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  summary TEXT NOT NULL,
  responsibilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
  key_impact TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  category_name TEXT NOT NULL,
  name TEXT NOT NULL,
  level TEXT NOT NULL,
  supported_by TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  is_enabled BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 11. CERTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.certifications (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  credential_badge TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  credential_url TEXT,
  file_url TEXT,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  is_enabled BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 12. EDUCATION TABLE
CREATE TABLE IF NOT EXISTS public.education (
  id TEXT PRIMARY KEY DEFAULT 'main_education',
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  location TEXT NOT NULL,
  period TEXT NOT NULL,
  cgpa TEXT NOT NULL,
  focus TEXT NOT NULL,
  coursework JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INTEGER DEFAULT 1 NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 13. SOCIAL LINKS TABLE
CREATE TABLE IF NOT EXISTS public.social_links (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_name TEXT,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  is_enabled BOOLEAN DEFAULT true NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 14. RESUME FILES TABLE
CREATE TABLE IF NOT EXISTS public.resume_files (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 15. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main_settings',
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  contact_location TEXT,
  contact_heading TEXT,
  contact_description TEXT,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies (Allow anyone to SELECT enabled content)
DROP POLICY IF EXISTS "Public Read Profiles" ON public.profiles;
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Public Read Homepage" ON public.homepage_content;
CREATE POLICY "Public Read Homepage" ON public.homepage_content FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Public Read About" ON public.about_content;
CREATE POLICY "Public Read About" ON public.about_content FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Public Read Recruiter" ON public.recruiter_content;
CREATE POLICY "Public Read Recruiter" ON public.recruiter_content FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Public Read SEO" ON public.seo_settings;
CREATE POLICY "Public Read SEO" ON public.seo_settings FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Public Read Projects" ON public.projects;
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT TO public USING (is_enabled = true);
DROP POLICY IF EXISTS "Public Read Experiences" ON public.experiences;
CREATE POLICY "Public Read Experiences" ON public.experiences FOR SELECT TO public USING (is_enabled = true);
DROP POLICY IF EXISTS "Public Read Skills" ON public.skills;
CREATE POLICY "Public Read Skills" ON public.skills FOR SELECT TO public USING (is_enabled = true);
DROP POLICY IF EXISTS "Public Read Certifications" ON public.certifications;
CREATE POLICY "Public Read Certifications" ON public.certifications FOR SELECT TO public USING (is_enabled = true);
DROP POLICY IF EXISTS "Public Read Education" ON public.education;
CREATE POLICY "Public Read Education" ON public.education FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Public Read Social Links" ON public.social_links;
CREATE POLICY "Public Read Social Links" ON public.social_links FOR SELECT TO public USING (is_enabled = true);
DROP POLICY IF EXISTS "Public Read Resume" ON public.resume_files;
CREATE POLICY "Public Read Resume" ON public.resume_files FOR SELECT TO public USING (is_active = true);
DROP POLICY IF EXISTS "Public Read Settings" ON public.site_settings;
CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT TO public USING (true);

-- 2. Admin Write / Mutation Policies (Restricted to authenticated Supabase admin user)
DROP POLICY IF EXISTS "Admin CRUD Profiles" ON public.profiles;
CREATE POLICY "Admin CRUD Profiles" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Admin CRUD Homepage" ON public.homepage_content;
CREATE POLICY "Admin CRUD Homepage" ON public.homepage_content FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Admin CRUD About" ON public.about_content;
CREATE POLICY "Admin CRUD About" ON public.about_content FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Admin CRUD Recruiter" ON public.recruiter_content;
CREATE POLICY "Admin CRUD Recruiter" ON public.recruiter_content FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Admin CRUD SEO" ON public.seo_settings;
CREATE POLICY "Admin CRUD SEO" ON public.seo_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Admin CRUD Projects" ON public.projects;
CREATE POLICY "Admin CRUD Projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Admin CRUD Experiences" ON public.experiences;
CREATE POLICY "Admin CRUD Experiences" ON public.experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Admin CRUD Skills" ON public.skills;
CREATE POLICY "Admin CRUD Skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Admin CRUD Certifications" ON public.certifications;
CREATE POLICY "Admin CRUD Certifications" ON public.certifications FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Admin CRUD Education" ON public.education;
CREATE POLICY "Admin CRUD Education" ON public.education FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Admin CRUD Social Links" ON public.social_links;
CREATE POLICY "Admin CRUD Social Links" ON public.social_links FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Admin CRUD Resume" ON public.resume_files;
CREATE POLICY "Admin CRUD Resume" ON public.resume_files FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Admin CRUD Settings" ON public.site_settings;
CREATE POLICY "Admin CRUD Settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA (Exact match with current portfolio data)
-- ==============================================================================

INSERT INTO public.profiles (
  id, name, preferred_name, primary_title, secondary_title, location, email, phone, phone_display,
  linkedin, github, availability, availability_status, availability_text, value_proposition, short_bio, dsa_solved, education_degree, cgpa
) VALUES (
  'main_profile',
  'Nandan Pruthvi Raj R',
  'Nandan Pruthvi',
  'Software Engineer & Data Analyst',
  'Full-Stack Development & Business Intelligence',
  'Bengaluru, India',
  'nandanpruthvi1@gmail.com',
  '+91 6362191396',
  '+91 63621 91396',
  'https://www.linkedin.com/in/nandan01/',
  'https://github.com/nandan-npr',
  'Immediate Joiner',
  'available',
  'AVAILABLE FOR ROLES & CONTRACTS • BENGALURU',
  'Adaptable and motivated Computer Science Engineer combining full-stack development, database architecture, workflow coordination, and data analytics with React, Node.js, Python, SQL, and Power BI.',
  'Computer Science Engineering graduate from Cambridge Institute of Technology (CGPA 8.0/10) with hands-on experience building full-stack web applications, backend services, Android development workflows (MindMatrix), and database-driven application development (1Stop.ai). Proven track record in problem solving, process tracking, and business intelligence.',
  'HackerRank Certified Software Engineer',
  'B.E. Computer Science Engineering',
  '8.0 / 10.0'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.homepage_content (
  id, hero_name, hero_title, hero_description, availability_label, who_i_am_eyebrow, who_i_am_heading, who_i_am_p1, who_i_am_p2, quote_text, quote_author, quote_title
) VALUES (
  'main_homepage',
  'NANDAN PRUTHVI RAJ R',
  'Software Engineer / Data Analyst',
  'Building intelligent digital products, full-stack systems, and data-driven solutions.',
  'AVAILABLE FOR ROLES & CONTRACTS • BENGALURU',
  '01 // CORE PERSPECTIVE',
  'Engineered with rigor. Decided with data. Designed with discipline.',
  'I am a Computer Science Engineer and Data Analyst with a rigorous foundation in software architecture, full-stack web engineering, algorithmic problem solving, and analytical data modeling.',
  'My background unites deep technical execution—from scalable React interfaces and Node.js REST services to structured relational database schemas and Power BI reporting suites. I approach development through systematic planning, structured execution, and verifiable quality.',
  'Delivering software and analytics where code clarity, performance benchmarks, and measurable business outcomes align effortlessly.',
  'Nandan Pruthvi Raj R',
  'Software Engineer & Data Analyst'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.about_content (
  id, heading, subheading, narrative_p1, narrative_p2, narrative_p3
) VALUES (
  'main_about',
  'SYSTEMATIC PERSPECTIVE',
  'An engineering mindset anchored by architectural precision, full-stack accountability, and quantitative analysis.',
  'Graduated with a Bachelor of Engineering in Computer Science and Engineering from Cambridge Institute of Technology (CGPA 8.0/10.0). My background bridges end-to-end software development with structured quantitative analytics.',
  'Through practical industry experience at MindMatrix Organisation (Android app workflows, Kotlin, task planning, and Generative AI acceleration) and 1Stop.ai (backend CRUD modules, SQL queries, RESTful APIs, and data integrity verification), I have cultivated a disciplined methodology for designing systems that scale reliably.',
  'Whether architecting full-stack web platforms like Skinmatics and CloudVault, or engineering decision-grade analytics suites like the HR and Sales Dashboards, my objective is clear: build performant, maintainable software and translate complex datasets into immediate, high-confidence executive clarity.'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.recruiter_content (
  id, hero_headline, hero_subtitle, summary, preferred_roles, work_authorization, availability_timeline
) VALUES (
  'main_recruiter',
  'EXECUTIVE RECRUITER DOSSIER',
  'Verified candidate summary, technical competencies, career timeline, and contact pathways for hiring managers and talent acquisition leaders.',
  'Computer Science Engineering graduate (CGPA 8.0/10.0) with verified software engineering credentials, two industry internships (Android & Backend), and four deployed production/analytics applications.',
  '["Software Engineer (Full-Stack / Frontend / Backend)", "Data Analyst / Business Intelligence Engineer", "Junior Associate Engineer / Graduate Engineer Trainee", "SQL / Database / Power BI Analyst"]'::jsonb,
  'Citizen of India • Available for immediate relocation or remote engagement',
  'Immediate (0 Days Notice)'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.seo_settings (
  id, site_title, meta_description, keywords, author_name, og_title, og_description, canonical_url
) VALUES (
  'main_seo',
  'Nandan Pruthvi Raj R — Software Engineer & Data Analyst',
  'Professional portfolio of Nandan Pruthvi Raj R — Software Engineer & Data Analyst specializing in full-stack web applications, AI integration, and business data analytics.',
  'Nandan Pruthvi Raj R, Software Engineer Bengaluru, Data Analyst Bengaluru, Full Stack Developer, React, Node.js, Python, SQL, Power BI, Cambridge Institute of Technology',
  'Nandan Pruthvi Raj R',
  'Nandan Pruthvi Raj R — Software Engineer & Data Analyst',
  'Building intelligent digital products, full-stack systems, and data-driven solutions.',
  'https://ais-dev-dalsslbnvw4h3sbelgqkeb-463187571582.asia-southeast1.run.app/'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.education (
  id, degree, institution, location, period, cgpa, focus, coursework, sort_order
) VALUES (
  'main_education',
  'Bachelor of Engineering (B.E.) in Computer Science and Engineering',
  'Cambridge Institute of Technology',
  'Bengaluru, Karnataka, India',
  'August 2022 – May 2026',
  '8.0 / 10.0',
  'Full-Stack Software Engineering, Database Systems (MySQL & MongoDB), REST APIs, and Applied Data Analytics',
  '["Data Structures & Algorithms", "Database Management Systems (DBMS)", "Object-Oriented Programming (OOP)", "Web Application Architecture", "Computer Networks", "Operating Systems", "Software Engineering & Testing"]'::jsonb,
  1
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.site_settings (
  id, contact_email, contact_phone, contact_location, contact_heading, contact_description
) VALUES (
  'main_settings',
  'nandanpruthvi1@gmail.com',
  '+91 63621 91396',
  'Bengaluru, Karnataka, India',
  'LET''S CONNECT.',
  'Open to full-time engineering and analytics opportunities, contract sprints, and technical advisory conversations.'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.resume_files (
  id, file_name, file_url, file_size, is_active
) VALUES (
  'initial_resume',
  'NANDAN_PRUTHVI_RAJ_R_RESUME_2026.pdf',
  '/NANDAN_PRUTHVI_RAJ_R_RESUME_2026.pdf',
  180000,
  true
) ON CONFLICT (id) DO NOTHING;

-- Projects
INSERT INTO public.projects (
  id, title, subtitle, category, category_label, period, status_badge, is_featured, is_enabled, sort_order,
  problem_solved, solution, technologies, features, contributions, architecture_details, live_url, github_url
) VALUES 
(
  'skinmatics',
  'Skinmatics',
  'Full-Stack Skincare Appointment Platform',
  'fullstack',
  'Full-Stack Web',
  '2026',
  'Live Deployed',
  true,
  true,
  1,
  'Traditional outpatient skincare clinics struggle with chaotic appointment scheduling, unstructured treatment inquiries, and rigid interfaces requiring developer intervention for routine updates.',
  'Developed and deployed a full-stack skincare appointment platform with user interactions, appointment booking, enquiry management, and an admin dashboard allowing authorized users to update information such as doctor details directly without source code changes.',
  '["React.js", "Node.js", "Express.js", "MongoDB", "REST APIs", "Render"]'::jsonb,
  '["User interactions, appointment booking workflows, and structured treatment enquiry management", "REST APIs, CRUD operations, and MongoDB database integration for managing application records and user workflows", "Admin-controlled system where authorized users can update information such as doctor details directly from the dashboard without changing source code", "Integrated frontend and backend workflows and used AI-assisted development tools for feature implementation, debugging, code understanding, and testing"]'::jsonb,
  '["Developed and deployed the complete full-stack web application connecting React components with Express.js APIs", "Implemented RESTful endpoints and CRUD handlers for user appointment scheduling and doctor profile management", "Structured MongoDB database schemas with indexing on appointment timestamps for fast administrative queries", "Integrated AI-assisted development tools for rapid debugging, test validation, and code optimization"]'::jsonb,
  'React single-page application communicates via REST APIs with an Express.js backend. MongoDB Atlas manages persistent appointment records, inquiries, and doctor profiles with dynamic administrative controls.',
  'https://github.com/nandan-npr',
  'https://github.com/nandan-npr'
),
(
  'cloudvault',
  'CloudVault',
  'File Management Web Application',
  'fullstack',
  'Full-Stack Web',
  '2026',
  'Production Ready',
  true,
  true,
  2,
  'Users require a secure, reliable, and responsive web platform to upload, organize, preview, download, and manage their personal and project files with hierarchical directory structures.',
  'Developed a full-featured file management web application for uploading, storing, viewing, downloading, renaming, and deleting user files, featuring comprehensive folder organization and metadata management.',
  '["React.js", "Node.js", "Express.js", "MongoDB", "REST APIs", "File Storage"]'::jsonb,
  '["File management application for uploading, storing, viewing, downloading, renaming, and deleting user files", "Folder management functionality to organize files and support creating, renaming, moving, and deleting folders", "Backend APIs and database operations for user accounts, file metadata, folders, and file management workflows", "Integrated frontend and backend services and used AI-assisted development tools to support feature development, debugging, and testing"]'::jsonb,
  '["Engineered backend REST APIs in Express.js for multipart file uploads, streaming downloads, and metadata indexing", "Implemented hierarchical directory operations in MongoDB supporting recursive folder creation, renaming, moving, and deletion", "Constructed responsive file management interface in React with instant previewing, search filtering, and file action menus", "Integrated AI-assisted development tools to support asynchronous file pipeline debugging and error handling"]'::jsonb,
  'Decoupled full-stack architecture. React client handles interactive folder navigation and file actions; Express.js manages file streaming and REST workflows; MongoDB stores relational folder trees and file metadata.',
  NULL,
  'https://github.com/nandan-npr'
),
(
  'sales-dashboard',
  'Sales Dashboard',
  'Interactive Business Performance & Regional Sales Suite',
  'data-bi',
  'Data & BI Analytics',
  '2026',
  'Executive Model',
  true,
  true,
  3,
  'Business stakeholders lack immediate visibility into multi-channel revenue trends, regional profitability variations, and top-selling product performance.',
  'Built an interactive Sales Dashboard to track revenue, profit, regional performance, and top-selling products using KPI-driven visualizations and automated spreadsheet modeling.',
  '["Microsoft Excel", "Power Query", "Pivot Tables", "XLOOKUP", "SUMIFS", "Slicers"]'::jsonb,
  '["Interactive Sales Dashboard tracking revenue, profit, regional performance, and top-selling products using KPI-driven visualizations", "Applied Pivot Tables, Pivot Charts, XLOOKUP, SUMIFS, Conditional Formatting, Slicers, and formulas to automate reporting and summarize performance", "Data cleaning, validation, and exploratory analysis to identify sales trends and generate actionable business insights", "Dynamic reports allowing users to filter and analyze sales performance across regions, products, and key business metrics"]'::jsonb,
  '["Extracted, cleansed, and transformed raw transaction datasets utilizing Power Query pipelines", "Formulated complex financial modeling formulas (XLOOKUP, SUMIFS, profit margin percentages) for instant metrics recalculation", "Designed interactive multi-region slicers and dynamic chart views for executive decision-making"]'::jsonb,
  'Automated spreadsheet analytics engine utilizing Power Query for data cleansing, linked to dynamic Pivot Tables and interactive slicers enabling instant drill-down by region, product, and timeline.',
  NULL,
  'https://github.com/nandan-npr'
),
(
  'hr-analytics-dashboard',
  'HR Analytics Dashboard',
  'Workforce Attrition & Department Reporting Suite',
  'data-bi',
  'Data & BI Analytics',
  '2026',
  'Power BI Model',
  true,
  true,
  4,
  'Human Resources leadership lacked clear visibility into turnover patterns, department-level attrition drivers, workforce demographics, and retention indicators.',
  'Developed an interactive HR Analytics Dashboard to monitor employee attrition, workforce distribution, department metrics, attendance, and key performance indicators using Power BI and custom DAX measures.',
  '["Power BI", "Power Query", "DAX", "Data Modeling", "KPI Dashboards", "Excel"]'::jsonb,
  '["Monitored employee attrition, workforce distribution, department metrics, attendance, and key performance indicators", "Power Query data transformation pipelines, dimensional data models, and custom DAX measures for KPI reporting and analysis", "Interactive dashboards with slicers, KPI cards, drill-through pages, and charts to support workforce analysis, reporting, and decision-making", "Analyzed workforce data to identify employee trends, attrition patterns, and department-level insights for improved HR decision-making"]'::jsonb,
  '["Transformed raw workforce records into structured relational star-schema data models using Power Query", "Formulated 15+ custom DAX expressions for attrition percentages, headcount variations, and department tenure averages", "Engineered drill-through report pages delivering deep visibility into turnover drivers for executive decision-making"]'::jsonb,
  'Power BI analytical model with star-schema relationships. Custom DAX measures calculate rolling attrition rates, satisfaction scores, and demographic tenure distributions.',
  NULL,
  'https://github.com/nandan-npr'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  period = EXCLUDED.period,
  status_badge = EXCLUDED.status_badge,
  is_featured = EXCLUDED.is_featured,
  problem_solved = EXCLUDED.problem_solved,
  solution = EXCLUDED.solution,
  technologies = EXCLUDED.technologies,
  features = EXCLUDED.features,
  contributions = EXCLUDED.contributions,
  architecture_details = EXCLUDED.architecture_details,
  live_url = EXCLUDED.live_url,
  github_url = EXCLUDED.github_url;

-- Experiences
INSERT INTO public.experiences (
  id, company, role, type, location, period, is_current, is_enabled, sort_order, summary, responsibilities, technologies, key_impact
) VALUES 
(
  'mindmatrix',
  'MindMatrix Organisation',
  'Android App Development Intern',
  'Remote',
  'Bengaluru / Remote',
  'Feb 2026 – May 2026',
  true,
  true,
  1,
  'Maintained structured project information, tracked tasks, monitored workflow progress, developed Android application screens in Android Studio, and utilized Generative AI tools to accelerate development workflows and testing.',
  '["Maintained structured project information, tracked tasks, monitored workflow progress, and organized updates to support smooth project execution.", "Developed Android application screens, navigation flows, and feature functionality using Kotlin and Android Studio.", "Used spreadsheets and digital tools for task planning, reporting, documentation, workflow management, and project coordination.", "Maintained accurate records and coordinated task updates while working with the project team on day-to-day activities.", "Performed functional testing and debugging to identify issues and validate functionality across different workflows.", "Used Generative AI tools to support requirement understanding, documentation, issue tracking, debugging assistance, testing, and productivity improvement."]'::jsonb,
  '["Android Studio", "Kotlin", "Generative AI Tools", "Spreadsheets & Digital Tools", "Task Management", "Functional Testing"]'::jsonb,
  'Streamlined project milestone tracking, ensured dependable mobile screen delivery, and elevated documentation velocity through AI-assisted workflows.'
),
(
  '1stop-ai',
  '1Stop.ai',
  'Back-End Developer Intern',
  'Hybrid',
  'Bengaluru / Hybrid',
  'Jun 2025 – Sep 2025',
  false,
  true,
  2,
  'Worked with structured datasets, database records, CRUD operations, and application workflows to support project activities and backend request management.',
  '["Worked with structured datasets, database records, CRUD operations, and application workflows to support project activities.", "Developed backend modules involving database operations, CRUD functionality, and REST-based application workflows.", "Used MySQL and database queries to manage, retrieve, and verify application data during backend development.", "Assisted with data validation, record management, reporting, documentation, and workflow tracking.", "Supported issue tracking and maintained accurate project information while coordinating data-related activities."]'::jsonb,
  '["SQL / MySQL", "Node.js / Express", "CRUD Operations", "REST APIs", "Data Validation", "Workflow Tracking"]'::jsonb,
  'Optimized database query reliability, verified data integrity across backend records, and maintained accurate technical documentation.'
) ON CONFLICT (id) DO UPDATE SET
  company = EXCLUDED.company,
  role = EXCLUDED.role,
  type = EXCLUDED.type,
  location = EXCLUDED.location,
  period = EXCLUDED.period,
  is_current = EXCLUDED.is_current,
  summary = EXCLUDED.summary,
  responsibilities = EXCLUDED.responsibilities,
  technologies = EXCLUDED.technologies,
  key_impact = EXCLUDED.key_impact;

-- Certifications
INSERT INTO public.certifications (
  id, name, issuer, date, credential_badge, category, description, credential_url, sort_order, is_enabled
) VALUES
(
  'hackerrank-swe',
  'Software Engineer Certification',
  'HackerRank',
  '2026',
  'Verified Credential',
  'Tech & Dev',
  'Industry credential validating core software engineering proficiency, problem solving, data structures, algorithms, and REST API development.',
  'https://www.hackerrank.com/certificates',
  1,
  true
),
(
  'deloitte-data',
  'Data Analyst Fundamentals',
  'Deloitte Virtual Experience Program (Forage)',
  '2026',
  'Verified Credential',
  'Data Analytics',
  'Practical simulation covering real-world business data analysis, data quality validation, statistical interpretation, and executive presentation of findings.',
  'https://www.theforage.com/simulations/deloitte/data-analyst-fundamentals',
  2,
  true
),
(
  'cisco-analytics',
  'Data Analytics Essentials',
  'Cisco Networking Academy',
  '2026',
  'Verified Credential',
  'Data Analytics',
  'Comprehensive foundation in data analytics lifecycle, data gathering, exploratory data analysis, and transforming raw inputs into actionable business intelligence.',
  'https://www.netacad.com/courses/data-analytics-essentials',
  3,
  true
),
(
  'anthropic-claude',
  'Claude 101',
  'Anthropic',
  '2026',
  'Verified Credential',
  'AI & Systems',
  'Official credential in large language model fundamentals, prompt engineering principles, generative AI integration, and AI-assisted engineering workflows.',
  'https://anthropic.com',
  4,
  true
),
(
  'infosys-ml',
  'Machine Learning',
  'Infosys Springboard',
  '2026',
  'Verified Credential',
  'Tech & Dev',
  'Foundation in machine learning algorithms, supervised learning, data pre-processing pipelines, model evaluation metrics, and feature engineering.',
  'https://infyspringboard.onwingspan.com',
  5,
  true
),
(
  'ibm-react',
  'Introduction to React',
  'IBM SkillsBuild',
  '2026',
  'Verified Credential',
  'Tech & Dev',
  'In-depth training on React core fundamentals, functional components, state and props management, hooks, event handling, and single-page application architecture.',
  'https://skillsbuild.org',
  6,
  true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  issuer = EXCLUDED.issuer,
  date = EXCLUDED.date,
  credential_badge = EXCLUDED.credential_badge,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  credential_url = EXCLUDED.credential_url;

-- Skills Seed Data
INSERT INTO public.skills (
  id, category_id, category_name, name, level, supported_by, sort_order, is_enabled
) VALUES
('skill-js', 'technical', 'Technical & Development', 'JavaScript', 'Advanced', 'Full-stack web applications, React.js & Node.js development', 1, true),
('skill-py', 'technical', 'Technical & Development', 'Python', 'Advanced', 'Data analysis, backend scripts, algorithmic problem solving', 2, true),
('skill-react', 'technical', 'Technical & Development', 'React.js', 'Advanced', 'Skinmatics, CloudVault, IBM SkillsBuild Certification', 3, true),
('skill-node', 'technical', 'Technical & Development', 'Node.js & Express.js', 'Advanced', 'Skinmatics and CloudVault RESTful API architectures', 4, true),
('skill-rest', 'technical', 'Technical & Development', 'REST APIs & CRUD', 'Advanced', '1Stop.ai internship, Skinmatics, CloudVault', 5, true),
('skill-mongo', 'technical', 'Technical & Development', 'MongoDB', 'Advanced', 'Skinmatics & CloudVault document schemas and metadata', 6, true),
('skill-html-css', 'technical', 'Technical & Development', 'HTML5 & CSS3', 'Advanced', 'Responsive layouts, mobile-first design, accessibility', 7, true),
('skill-wf-coord', 'operations', 'Operations & Project Management', 'Workflow Coordination', 'Advanced', 'MindMatrix internship task tracking & cross-team execution', 1, true),
('skill-proc-track', 'operations', 'Operations & Project Management', 'Process Tracking', 'Advanced', 'Sprint planning, milestone tracking, timeline management', 2, true),
('skill-doc', 'operations', 'Operations & Project Management', 'Documentation', 'Advanced', 'Technical specifications, API docs, sprint logs', 3, true),
('skill-task-mgmt', 'operations', 'Operations & Project Management', 'Task Management', 'Advanced', 'Digital task boards, backlog grooming, priority alignment', 4, true),
('skill-issue-track', 'operations', 'Operations & Project Management', 'Issue Tracking', 'Proficient', '1Stop.ai and MindMatrix bug logging and resolution tracking', 5, true),
('skill-data-analysis', 'analytics', 'Data Analytics & Reporting', 'Data Analysis', 'Advanced', 'Sales Dashboard, HR Analytics, Deloitte Forage program', 1, true),
('skill-data-clean', 'analytics', 'Data Analytics & Reporting', 'Data Cleaning & Validation', 'Advanced', '1Stop.ai dataset validation, Power Query pipelines', 2, true),
('skill-kpi-track', 'analytics', 'Data Analytics & Reporting', 'KPI Tracking & Modeling', 'Advanced', 'HR Analytics Dashboard, regional sales performance', 3, true),
('skill-mis-report', 'analytics', 'Data Analytics & Reporting', 'MIS & Business Reporting', 'Advanced', 'Executive summary dashboards, weekly metric reports', 4, true),
('skill-data-interp', 'analytics', 'Data Analytics & Reporting', 'Data Interpretation', 'Advanced', 'Translating complex metrics into actionable decisions', 5, true),
('skill-excel', 'tools', 'Tools, Databases & Platforms', 'Microsoft Excel', 'Advanced', 'Pivot Tables, XLOOKUP, SUMIFS, Slicers, Sales Dashboard', 1, true),
('skill-powerbi', 'tools', 'Tools, Databases & Platforms', 'Power BI', 'Advanced', 'Power Query, DAX measures, KPI Dashboards, HR Analytics', 2, true),
('skill-sql', 'tools', 'Tools, Databases & Platforms', 'SQL & MySQL', 'Advanced', '1Stop.ai backend, relational queries, join optimizations', 3, true),
('skill-gsheets', 'tools', 'Tools, Databases & Platforms', 'Google Sheets', 'Advanced', 'Collaborative reporting, data tracking, formula automation', 4, true),
('skill-git', 'tools', 'Tools, Databases & Platforms', 'Git & GitHub', 'Advanced', 'Version control, branching, repository management', 5, true),
('skill-postman', 'tools', 'Tools, Databases & Platforms', 'Postman & VS Code', 'Advanced', 'API endpoint testing, debugging, development environment', 6, true),
('skill-android', 'tools', 'Tools, Databases & Platforms', 'Android Studio', 'Proficient', 'MindMatrix Android development internship', 7, true)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  category_name = EXCLUDED.category_name,
  name = EXCLUDED.name,
  level = EXCLUDED.level,
  supported_by = EXCLUDED.supported_by,
  sort_order = EXCLUDED.sort_order,
  is_enabled = EXCLUDED.is_enabled;

-- Social Links
INSERT INTO public.social_links (
  id, platform, label, url, icon_name, sort_order, is_enabled
) VALUES
('linkedin', 'LinkedIn', 'LINKEDIN', 'https://www.linkedin.com/in/nandan01/', 'Linkedin', 1, true),
('github', 'GitHub', 'GITHUB', 'https://github.com/nandan-npr', 'Github', 2, true),
('email', 'Email', 'EMAIL', 'mailto:nandanpruthvi1@gmail.com', 'Mail', 3, true),
('phone', 'Phone', 'PHONE', 'tel:+916362191396', 'Phone', 4, true)
ON CONFLICT (id) DO UPDATE SET
  platform = EXCLUDED.platform,
  label = EXCLUDED.label,
  url = EXCLUDED.url;
