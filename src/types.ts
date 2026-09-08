export type PageView = 'home' | 'about' | 'work' | 'experience' | 'skills' | 'social' | 'contact';

export type ProjectCategory = 'all' | 'fullstack' | 'ai-backend' | 'data-bi';

export interface ProjectItem {
  id: string;
  title: string;
  category: 'fullstack' | 'ai-backend' | 'data-bi';
  categoryLabel: string;
  subtitle: string;
  period: string;
  problemSolved: string;
  solution: string;
  technologies: string[];
  features: string[];
  contributions: string[];
  architectureDetails: string;
  githubUrl?: string;
  liveUrl?: string;
  statusBadge: string;
  isFeatured: boolean;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  type: 'Hybrid' | 'Remote' | 'Onsite' | 'Leadership';
  location: string;
  period: string;
  summary?: string;
  responsibilities: string[];
  technologies: string[];
  keyImpact: string;
}

export interface SkillCategory {
  id: string;
  categoryName: string;
  iconName: string;
  description: string;
  skills: {
    name: string;
    level: 'Advanced' | 'Proficient' | 'Working Knowledge';
    supportedBy: string;
  }[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  credentialBadge?: string;
  description: string;
  category: 'Tech & Dev' | 'Data Analytics' | 'Business & Talent';
}

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  cgpa: string;
  focus: string;
  coursework: string[];
}
