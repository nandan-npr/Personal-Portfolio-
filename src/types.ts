export type PageView =
  | 'home'
  | 'about'
  | 'work'
  | 'experience'
  | 'skills'
  | 'certificates'
  | 'social'
  | 'contact'
  | 'recruiter'
  | 'notfound'
  | 'admin-login'
  | 'admin';

export type AdminSection =
  | 'overview'
  | 'profile'
  | 'homepage'
  | 'about'
  | 'projects'
  | 'experience'
  | 'skills'
  | 'certifications'
  | 'education'
  | 'resume'
  | 'social'
  | 'recruiter'
  | 'contact'
  | 'seo'
  | 'settings';

export type ProjectCategory = 'all' | 'fullstack' | 'ai-backend' | 'data-bi';

export interface ProfileData {
  id?: string;
  name: string;
  preferredName?: string;
  primaryTitle: string;
  secondaryTitle?: string;
  location: string;
  email: string;
  phone?: string;
  phoneDisplay?: string;
  linkedin?: string;
  github?: string;
  availability?: string;
  availabilityStatus?: 'available' | 'unavailable';
  availabilityText?: string;
  valueProposition?: string;
  shortBio?: string;
  dsaSolved?: string;
  educationDegree?: string;
  cgpa?: string;
}

export interface HomepageContent {
  id?: string;
  heroName: string;
  heroTitle: string;
  heroDescription: string;
  availabilityLabel: string;
  whoIAmEyebrow: string;
  whoIAmHeading: string;
  whoIAmP1: string;
  whoIAmP2: string;
  quoteText: string;
  quoteAuthor: string;
  quoteTitle: string;
}

export interface AboutContent {
  id?: string;
  heading: string;
  subheading: string;
  narrativeP1: string;
  narrativeP2: string;
  narrativeP3: string;
}

export interface RecruiterContent {
  id?: string;
  heroHeadline: string;
  heroSubtitle: string;
  summary: string;
  preferredRoles: string[];
  workAuthorization: string;
  availabilityTimeline: string;
}

export interface SeoSettings {
  id?: string;
  siteTitle: string;
  metaDescription: string;
  keywords: string;
  authorName: string;
  ogTitle: string;
  ogDescription: string;
  canonicalUrl: string;
}

export interface ResumeFileItem {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  isActive: boolean;
  uploadedAt?: string;
}

export interface SocialLinkItem {
  id: string;
  platform: string;
  label: string;
  url: string;
  iconName?: string;
  isEnabled: boolean;
  sortOrder: number;
}

export interface SiteSettingsData {
  id?: string;
  contactEmail: string;
  contactPhone?: string;
  contactLocation?: string;
  contactHeading?: string;
  contactDescription?: string;
}

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

export interface SkillItem {
  id?: string;
  name: string;
  level: 'Advanced' | 'Proficient' | 'Working Knowledge';
  supportedBy: string;
  categoryId?: string;
  sortOrder?: number;
  isEnabled?: boolean;
}

export interface SkillCategory {
  id: string;
  categoryName: string;
  name?: string;
  iconName: string;
  description: string;
  skills: SkillItem[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  credentialBadge?: string;
  description: string;
  category: 'Tech & Dev' | 'Data Analytics' | 'AI & Systems';
  credentialId?: string;
  credentialUrl?: string;
  fileUrl?: string;
  storagePath?: string;
  sortOrder?: number;
}

export interface EducationItem {
  id?: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  cgpa: string;
  focus: string;
  coursework: string[];
  sortOrder?: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  _gotcha?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  error?: string;
  id?: string;
}
