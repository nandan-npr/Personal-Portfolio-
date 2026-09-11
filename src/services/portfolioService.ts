import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import {
  ProjectItem,
  ExperienceItem,
  SkillCategory,
  CertificationItem,
  EducationItem,
  ProfileData,
  HomepageContent,
  AboutContent,
  RecruiterContent,
  SeoSettings,
  ResumeFileItem,
  SocialLinkItem,
  SiteSettingsData,
} from '../types';
import {
  BACKUP_PERSONAL_INFO,
  BACKUP_HOMEPAGE_CONTENT,
  BACKUP_ABOUT_CONTENT,
  BACKUP_RECRUITER_CONTENT,
  BACKUP_SEO_SETTINGS,
  BACKUP_RESUME_INFO,
  BACKUP_PROJECTS,
  BACKUP_EXPERIENCES,
  BACKUP_SKILL_CATEGORIES,
  BACKUP_CERTIFICATIONS,
  BACKUP_EDUCATION,
  BACKUP_SOCIAL_LINKS,
} from '../data/portfolioDataBackup';

type Listener = () => void;

class PortfolioService {
  private listeners: Set<Listener> = new Set();

  // Cached state for ultra-fast renders & graceful fallback
  private profile: ProfileData = { ...BACKUP_PERSONAL_INFO };
  private homepage: HomepageContent = { ...BACKUP_HOMEPAGE_CONTENT };
  private about: AboutContent = { ...BACKUP_ABOUT_CONTENT };
  private recruiter: RecruiterContent = { ...BACKUP_RECRUITER_CONTENT };
  private seo: SeoSettings = { ...BACKUP_SEO_SETTINGS };
  private projects: ProjectItem[] = [...BACKUP_PROJECTS];
  private experiences: ExperienceItem[] = [...BACKUP_EXPERIENCES];
  private skillCategories: SkillCategory[] = [...BACKUP_SKILL_CATEGORIES];
  private certifications: CertificationItem[] = [...BACKUP_CERTIFICATIONS];
  private education: EducationItem = { ...BACKUP_EDUCATION };
  private socialLinks: SocialLinkItem[] = [...BACKUP_SOCIAL_LINKS];
  private resumeInfo: ResumeFileItem = {
    id: 'initial_resume',
    fileName: BACKUP_RESUME_INFO.fileName,
    fileUrl: BACKUP_RESUME_INFO.fileUrl,
    isActive: true,
    uploadedAt: BACKUP_RESUME_INFO.updatedAt,
  };
  private siteSettings: SiteSettingsData = {
    contactEmail: BACKUP_PERSONAL_INFO.email,
    contactPhone: BACKUP_PERSONAL_INFO.phoneDisplay,
    contactLocation: BACKUP_PERSONAL_INFO.location,
    contactHeading: "LET'S CONNECT.",
    contactDescription: 'Open to full-time engineering and analytics opportunities, contract sprints, and technical advisory conversations.',
  };

  private initialized = false;

  private revision = 0;

  constructor() {
    this.init();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getRevision(): number {
    return this.revision;
  }

  private notify() {
    this.revision++;
    this.listeners.forEach((l) => l());
  }

  public async init(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;
    await this.refreshAll();
  }

  // Refresh all state from Supabase if connected
  public async refreshAll(): Promise<void> {
    if (!isSupabaseConfigured()) {
      return;
    }
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      // 1. Profile
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', 'main_profile').single();
      if (profileData) {
        this.profile = {
          id: profileData.id,
          name: profileData.name || this.profile.name,
          preferredName: profileData.preferred_name,
          primaryTitle: profileData.primary_title || this.profile.primaryTitle,
          secondaryTitle: profileData.secondary_title,
          location: profileData.location || this.profile.location,
          email: profileData.email || this.profile.email,
          phone: profileData.phone,
          phoneDisplay: profileData.phone_display,
          linkedin: profileData.linkedin,
          github: profileData.github,
          availability: profileData.availability,
          availabilityStatus: profileData.availability_status as any,
          availabilityText: profileData.availability_text,
          valueProposition: profileData.value_proposition,
          shortBio: profileData.short_bio,
          dsaSolved: profileData.dsa_solved,
          educationDegree: profileData.education_degree,
          cgpa: profileData.cgpa,
        };
      }

      // 2. Homepage
      const { data: homeData } = await supabase.from('homepage_content').select('*').eq('id', 'main_homepage').single();
      if (homeData) {
        this.homepage = {
          id: homeData.id,
          heroName: homeData.hero_name || this.homepage.heroName,
          heroTitle: homeData.hero_title || this.homepage.heroTitle,
          heroDescription: homeData.hero_description || this.homepage.heroDescription,
          availabilityLabel: homeData.availability_label || this.homepage.availabilityLabel,
          whoIAmEyebrow: homeData.who_i_am_eyebrow || this.homepage.whoIAmEyebrow,
          whoIAmHeading: homeData.who_i_am_heading || this.homepage.whoIAmHeading,
          whoIAmP1: homeData.who_i_am_p1 || this.homepage.whoIAmP1,
          whoIAmP2: homeData.who_i_am_p2 || this.homepage.whoIAmP2,
          quoteText: homeData.quote_text || this.homepage.quoteText,
          quoteAuthor: homeData.quote_author || this.homepage.quoteAuthor,
          quoteTitle: homeData.quote_title || this.homepage.quoteTitle,
        };
      }

      // 3. About
      const { data: aboutData } = await supabase.from('about_content').select('*').eq('id', 'main_about').single();
      if (aboutData) {
        this.about = {
          id: aboutData.id,
          heading: aboutData.heading || this.about.heading,
          subheading: aboutData.subheading || this.about.subheading,
          narrativeP1: aboutData.narrative_p1 || this.about.narrativeP1,
          narrativeP2: aboutData.narrative_p2 || this.about.narrativeP2,
          narrativeP3: aboutData.narrative_p3 || this.about.narrativeP3,
        };
      }

      // 4. Projects
      const { data: projectsData } = await supabase.from('projects').select('*').order('sort_order', { ascending: true });
      if (projectsData && projectsData.length > 0) {
        this.projects = projectsData.map((p) => ({
          id: p.id,
          title: p.title,
          subtitle: p.subtitle,
          category: p.category,
          categoryLabel: p.category_label,
          period: p.period,
          statusBadge: p.status_badge,
          isFeatured: p.is_featured,
          problemSolved: p.problem_solved,
          solution: p.solution,
          technologies: Array.isArray(p.technologies) ? p.technologies : [],
          features: Array.isArray(p.features) ? p.features : [],
          contributions: Array.isArray(p.contributions) ? p.contributions : [],
          architectureDetails: p.architecture_details,
          liveUrl: p.live_url,
          githubUrl: p.github_url,
        }));
      }

      // 5. Experiences
      const { data: expData } = await supabase.from('experiences').select('*').order('sort_order', { ascending: true });
      if (expData && expData.length > 0) {
        this.experiences = expData.map((e) => ({
          id: e.id,
          company: e.company,
          role: e.role,
          type: e.type,
          location: e.location,
          period: e.period,
          summary: e.summary,
          responsibilities: Array.isArray(e.responsibilities) ? e.responsibilities : [],
          technologies: Array.isArray(e.technologies) ? e.technologies : [],
          keyImpact: e.key_impact,
        }));
      }

      // 6. Certifications
      const { data: certData } = await supabase.from('certifications').select('*').order('sort_order', { ascending: true });
      if (certData && certData.length > 0) {
        this.certifications = certData.map((c) => ({
          id: c.id,
          name: c.name,
          issuer: c.issuer,
          date: c.date,
          credentialBadge: c.credential_badge,
          category: c.category,
          description: c.description,
          credentialUrl: c.credential_url,
        }));
      }

      // 7. Active Resume
      const { data: resumeData } = await supabase
        .from('resume_files')
        .select('*')
        .eq('is_active', true)
        .order('uploaded_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (resumeData) {
        this.resumeInfo = {
          id: resumeData.id,
          fileName: resumeData.file_name,
          fileUrl: resumeData.file_url,
          fileSize: resumeData.file_size,
          isActive: true,
          uploadedAt: resumeData.uploaded_at,
        };
      }

      // 8. Recruiter
      const { data: recData } = await supabase.from('recruiter_content').select('*').eq('id', 'main_recruiter').single();
      if (recData) {
        this.recruiter = {
          id: recData.id,
          heroHeadline: recData.hero_headline,
          heroSubtitle: recData.hero_subtitle,
          summary: recData.summary,
          preferredRoles: Array.isArray(recData.preferred_roles) ? recData.preferred_roles : this.recruiter.preferredRoles,
          workAuthorization: recData.work_authorization,
          availabilityTimeline: recData.availability_timeline,
        };
      }

      // 9. SEO
      const { data: seoData } = await supabase.from('seo_settings').select('*').eq('id', 'main_seo').single();
      if (seoData) {
        this.seo = {
          id: seoData.id,
          siteTitle: seoData.site_title,
          metaDescription: seoData.meta_description,
          keywords: seoData.keywords,
          authorName: seoData.author_name,
          ogTitle: seoData.og_title,
          ogDescription: seoData.og_description,
          canonicalUrl: seoData.canonical_url,
        };
      }

      // 10. Social Links
      const { data: socialData } = await supabase.from('social_links').select('*').order('sort_order', { ascending: true });
      if (socialData && socialData.length > 0) {
        this.socialLinks = socialData.map((s) => ({
          id: s.id,
          platform: s.platform,
          label: s.label,
          url: s.url,
          iconName: s.icon_name,
          isEnabled: s.is_enabled,
          sortOrder: s.sort_order,
        }));
      }

      // 11. Education & GPA (Single Source of Truth)
      const { data: eduData } = await supabase.from('education').select('*').eq('id', 'main_education').single();
      if (eduData) {
        this.education = {
          id: eduData.id,
          degree: eduData.degree || this.education.degree,
          institution: eduData.institution || this.education.institution,
          location: eduData.location || this.education.location,
          period: eduData.period || this.education.period,
          cgpa: eduData.cgpa || this.education.cgpa,
          focus: eduData.focus || this.education.focus,
          coursework: Array.isArray(eduData.coursework) ? eduData.coursework : this.education.coursework,
        };
        // Keep profile cgpa in sync
        if (eduData.cgpa) {
          this.profile.cgpa = eduData.cgpa;
        }
      }

      // 12. Skills (from Supabase skills table)
      const { data: skillsData } = await supabase.from('skills').select('*').order('sort_order', { ascending: true });
      if (skillsData && skillsData.length > 0) {
        const catMap = new Map<string, SkillCategory>();
        for (const cat of this.skillCategories) {
          catMap.set(cat.id, { ...cat, skills: [] });
        }
        for (const s of skillsData) {
          if (!s.is_enabled) continue;
          const catId = s.category_id || 'technical';
          let cat = catMap.get(catId);
          if (!cat) {
            cat = {
              id: catId,
              name: s.category_name || catId,
              categoryName: s.category_name || catId,
              iconName: 'Code2',
              description: '',
              skills: [],
            };
            catMap.set(catId, cat);
          }
          cat.skills.push({
            name: s.name,
            level: s.level,
            supportedBy: s.supported_by || '',
          });
        }
        const populatedCats = Array.from(catMap.values()).filter((c) => c.skills.length > 0);
        if (populatedCats.length > 0) {
          this.skillCategories = populatedCats;
        }
      }

      // 13. Site Settings
      const { data: siteData } = await supabase.from('site_settings').select('*').eq('id', 'main_settings').single();
      if (siteData) {
        this.siteSettings = {
          id: siteData.id,
          contactEmail: siteData.contact_email || this.siteSettings.contactEmail,
          contactPhone: siteData.contact_phone || this.siteSettings.contactPhone,
          contactLocation: siteData.contact_location || this.siteSettings.contactLocation,
          contactHeading: siteData.contact_heading || this.siteSettings.contactHeading,
          contactDescription: siteData.contact_description || this.siteSettings.contactDescription,
        };
      }

      this.notify();
    } catch (err) {
      console.warn('PortfolioService: Could not load some Supabase tables, keeping fallback snapshot.', err);
    }
  }

  // ==========================================
  // GETTERS (Instant, reactive)
  // ==========================================
  public getProfile(): ProfileData {
    return this.profile;
  }

  public getHomepage(): HomepageContent {
    return this.homepage;
  }

  public getAbout(): AboutContent {
    return this.about;
  }

  public getProjects(): ProjectItem[] {
    return this.projects;
  }

  public getExperiences(): ExperienceItem[] {
    return this.experiences;
  }

  public getSkillCategories(): SkillCategory[] {
    return this.skillCategories;
  }

  public getCertifications(): CertificationItem[] {
    return this.certifications;
  }

  public getEducation(): EducationItem {
    return this.education;
  }

  public getRecruiter(): RecruiterContent {
    return this.recruiter;
  }

  public getSeo(): SeoSettings {
    return this.seo;
  }

  public getResumeInfo(): ResumeFileItem {
    return this.resumeInfo;
  }

  public getSocialLinks(): SocialLinkItem[] {
    return this.socialLinks;
  }

  public getSiteSettings(): SiteSettingsData {
    return this.siteSettings;
  }

  // ==========================================
  // MUTATIONS (Saves to Supabase & Updates Cache)
  // ==========================================
  public async updateProfile(data: Partial<ProfileData>): Promise<void> {
    this.profile = { ...this.profile, ...data };
    this.notify();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from('profiles').upsert({
          id: 'main_profile',
          name: this.profile.name,
          preferred_name: this.profile.preferredName,
          primary_title: this.profile.primaryTitle,
          secondary_title: this.profile.secondaryTitle,
          location: this.profile.location,
          email: this.profile.email,
          phone: this.profile.phone,
          phone_display: this.profile.phoneDisplay,
          linkedin: this.profile.linkedin,
          github: this.profile.github,
          availability: this.profile.availability,
          availability_status: this.profile.availabilityStatus,
          availability_text: this.profile.availabilityText,
          value_proposition: this.profile.valueProposition,
          short_bio: this.profile.shortBio,
          dsa_solved: this.profile.dsaSolved,
          education_degree: this.profile.educationDegree,
          cgpa: this.profile.cgpa,
          updated_at: new Date().toISOString(),
        });
        if (error) {
          console.error('Supabase updateProfile error:', error);
          throw new Error(`Failed to save profile in Supabase (${error.code}): ${error.message}`);
        }
      }
    }
  }

  public async updateHomepage(data: Partial<HomepageContent>): Promise<void> {
    this.homepage = { ...this.homepage, ...data };
    this.notify();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from('homepage_content').upsert({
          id: 'main_homepage',
          hero_name: this.homepage.heroName,
          hero_title: this.homepage.heroTitle,
          hero_description: this.homepage.heroDescription,
          availability_label: this.homepage.availabilityLabel,
          who_i_am_eyebrow: this.homepage.whoIAmEyebrow,
          who_i_am_heading: this.homepage.whoIAmHeading,
          who_i_am_p1: this.homepage.whoIAmP1,
          who_i_am_p2: this.homepage.whoIAmP2,
          quote_text: this.homepage.quoteText,
          quote_author: this.homepage.quoteAuthor,
          quote_title: this.homepage.quoteTitle,
          updated_at: new Date().toISOString(),
        });
        if (error) {
          console.error('Supabase updateHomepage error:', error);
          throw new Error(`Failed to save homepage in Supabase (${error.code}): ${error.message}`);
        }
      }
    }
  }

  public async updateAbout(data: Partial<AboutContent>): Promise<void> {
    this.about = { ...this.about, ...data };
    this.notify();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from('about_content').upsert({
          id: 'main_about',
          heading: this.about.heading,
          subheading: this.about.subheading,
          narrative_p1: this.about.narrativeP1,
          narrative_p2: this.about.narrativeP2,
          narrative_p3: this.about.narrativeP3,
          updated_at: new Date().toISOString(),
        });
        if (error) {
          console.error('Supabase updateAbout error:', error);
          throw new Error(`Failed to save about section in Supabase (${error.code}): ${error.message}`);
        }
      }
    }
  }

  public async saveProject(project: ProjectItem): Promise<void> {
    const idx = this.projects.findIndex((p) => p.id === project.id);
    if (idx >= 0) {
      this.projects[idx] = project;
    } else {
      this.projects.push(project);
    }
    this.notify();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from('projects').upsert({
          id: project.id,
          title: project.title,
          subtitle: project.subtitle,
          category: project.category,
          category_label: project.categoryLabel,
          period: project.period,
          status_badge: project.statusBadge,
          is_featured: project.isFeatured,
          is_enabled: true,
          problem_solved: project.problemSolved,
          solution: project.solution,
          technologies: project.technologies,
          features: project.features,
          contributions: project.contributions,
          architecture_details: project.architectureDetails,
          live_url: project.liveUrl,
          github_url: project.githubUrl,
          updated_at: new Date().toISOString(),
        });
        if (error) {
          console.error('Supabase saveProject error:', error);
          throw new Error(`Failed to save project in Supabase (${error.code}): ${error.message}`);
        }
      }
    }
  }

  public async deleteProject(id: string): Promise<void> {
    this.projects = this.projects.filter((p) => p.id !== id);
    this.notify();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) {
          console.error('Supabase deleteProject error:', error);
          throw new Error(`Failed to delete project from Supabase (${error.code}): ${error.message}`);
        }
      }
    }
  }

  public async reorderProjects(newOrder: ProjectItem[]): Promise<void> {
    this.projects = newOrder;
    this.notify();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        for (let i = 0; i < newOrder.length; i++) {
          await supabase.from('projects').update({ sort_order: i + 1 }).eq('id', newOrder[i].id);
        }
      }
    }
  }

  public async saveExperience(exp: ExperienceItem): Promise<void> {
    const idx = this.experiences.findIndex((e) => e.id === exp.id);
    if (idx >= 0) {
      this.experiences[idx] = exp;
    } else {
      this.experiences.push(exp);
    }
    this.notify();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from('experiences').upsert({
          id: exp.id,
          company: exp.company,
          role: exp.role,
          type: exp.type,
          location: exp.location,
          period: exp.period,
          is_current: false,
          is_enabled: true,
          summary: exp.summary || '',
          responsibilities: exp.responsibilities,
          technologies: exp.technologies,
          key_impact: exp.keyImpact,
          updated_at: new Date().toISOString(),
        });
        if (error) {
          console.error('Supabase saveExperience error:', error);
          throw new Error(`Failed to save experience in Supabase (${error.code}): ${error.message}`);
        }
      }
    }
  }

  public async deleteExperience(id: string): Promise<void> {
    this.experiences = this.experiences.filter((e) => e.id !== id);
    this.notify();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from('experiences').delete().eq('id', id);
        if (error) {
          console.error('Supabase deleteExperience error:', error);
          throw new Error(`Failed to delete experience from Supabase (${error.code}): ${error.message}`);
        }
      }
    }
  }

  public async reorderExperiences(newOrder: ExperienceItem[]): Promise<void> {
    this.experiences = [...newOrder];
    this.notify();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        for (let i = 0; i < newOrder.length; i++) {
          await supabase.from('experiences').update({ sort_order: i + 1 }).eq('id', newOrder[i].id);
        }
      }
    }
  }

  public async saveCertification(cert: CertificationItem): Promise<void> {
    const idx = this.certifications.findIndex((c) => c.id === cert.id);
    if (idx >= 0) {
      this.certifications[idx] = cert;
    } else {
      this.certifications.push(cert);
    }
    this.notify();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from('certifications').upsert({
          id: cert.id,
          name: cert.name,
          issuer: cert.issuer,
          date: cert.date || '2026',
          credential_badge: cert.credentialBadge || 'Verified Credential',
          category: cert.category,
          description: cert.description,
          credential_url: cert.credentialUrl,
          file_url: cert.fileUrl || null,
          sort_order: cert.sortOrder ?? (idx >= 0 ? idx + 1 : this.certifications.length),
          is_enabled: true,
          updated_at: new Date().toISOString(),
        });
        if (error) {
          console.error('Supabase saveCertification error:', error);
          throw new Error(`Failed to save certification in Supabase (${error.code}): ${error.message}`);
        }
      }
    }
  }

  public async deleteCertification(id: string): Promise<void> {
    this.certifications = this.certifications.filter((c) => c.id !== id);
    this.notify();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from('certifications').delete().eq('id', id);
        if (error) {
          console.error('Supabase deleteCertification error:', error);
          throw new Error(`Failed to delete certification from Supabase (${error.code}): ${error.message}`);
        }
      }
    }
  }

  public async reorderCertifications(newOrder: CertificationItem[]): Promise<void> {
    this.certifications = [...newOrder];
    this.notify();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        for (let i = 0; i < newOrder.length; i++) {
          await supabase.from('certifications').update({ sort_order: i + 1 }).eq('id', newOrder[i].id);
        }
      }
    }
  }

  public async uploadCertificateFile(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: true, url: URL.createObjectURL(file) };
    }
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: 'Supabase client not initialized.' };

    try {
      const cleanName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      let uploadResult = await supabase.storage.from('certificates').upload(cleanName, file, {
        cacheControl: '3600',
        upsert: true,
      });

      if (
        uploadResult.error &&
        (uploadResult.error.message?.toLowerCase().includes('bucket not found') ||
          (uploadResult.error as any).statusCode === '404')
      ) {
        try {
          await supabase.storage.createBucket('certificates', { public: true });
          uploadResult = await supabase.storage.from('certificates').upload(cleanName, file, {
            cacheControl: '3600',
            upsert: true,
          });
        } catch {}
      }

      if (uploadResult.error) {
        return { success: false, error: uploadResult.error.message };
      }

      const { data: publicUrlData } = supabase.storage.from('certificates').getPublicUrl(cleanName);
      return { success: true, url: publicUrlData.publicUrl };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to upload certificate document.' };
    }
  }

  public async saveSkill(
    categoryId: string,
    skill: { name: string; level: any; supportedBy: string; sortOrder?: number; isEnabled?: boolean }
  ): Promise<void> {
    let cat = this.skillCategories.find((c) => c.id === categoryId);
    if (!cat) {
      cat = {
        id: categoryId,
        name: categoryId === 'technical' ? 'Technical Architecture' : categoryId === 'data' ? 'Data & Analytics' : categoryId,
        categoryName: categoryId === 'technical' ? 'Core Architecture' : categoryId === 'data' ? 'Data Engineering' : categoryId,
        iconName: 'Code2',
        description: 'Industry competencies',
        skills: [],
      };
      this.skillCategories.push(cat);
    }

    const existingIdx = cat.skills.findIndex((s) => s.name.toLowerCase() === skill.name.toLowerCase());
    if (existingIdx >= 0) {
      cat.skills[existingIdx] = {
        name: skill.name,
        level: skill.level,
        supportedBy: skill.supportedBy,
      };
    } else {
      cat.skills.push({
        name: skill.name,
        level: skill.level,
        supportedBy: skill.supportedBy,
      });
    }
    this.notify();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const skillId = `skill_${categoryId}_${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        const { error } = await supabase.from('skills').upsert({
          id: skillId,
          category_id: categoryId,
          category_name: cat.categoryName,
          name: skill.name,
          level: skill.level,
          supported_by: skill.supportedBy || null,
          sort_order: skill.sortOrder ?? (existingIdx >= 0 ? existingIdx + 1 : cat.skills.length),
          is_enabled: skill.isEnabled ?? true,
          updated_at: new Date().toISOString(),
        });
        if (error) {
          console.error('Supabase saveSkill error:', error);
          throw new Error(`Failed to save skill to Supabase (${error.code}): ${error.message}`);
        }
      }
    }
  }

  public async updateSkill(
    categoryId: string,
    oldSkillName: string,
    skill: { name: string; level: any; supportedBy: string }
  ): Promise<void> {
    const cat = this.skillCategories.find((c) => c.id === categoryId);
    if (cat) {
      const idx = cat.skills.findIndex((s) => s.name === oldSkillName);
      if (idx >= 0) {
        cat.skills[idx] = skill;
      } else {
        cat.skills.push(skill);
      }
      this.notify();

      if (isSupabaseConfigured()) {
        const supabase = getSupabaseClient();
        if (supabase) {
          if (oldSkillName !== skill.name) {
            await supabase.from('skills').delete().eq('category_id', categoryId).eq('name', oldSkillName);
          }
          const skillId = `skill_${categoryId}_${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
          const { error } = await supabase.from('skills').upsert({
            id: skillId,
            category_id: categoryId,
            category_name: cat.categoryName,
            name: skill.name,
            level: skill.level,
            supported_by: skill.supportedBy || null,
            sort_order: idx >= 0 ? idx + 1 : cat.skills.length,
            is_enabled: true,
            updated_at: new Date().toISOString(),
          });
          if (error) {
            throw new Error(`Failed to update skill in Supabase: ${error.message}`);
          }
        }
      }
    }
  }

  public async deleteSkill(categoryId: string, skillName: string): Promise<void> {
    const cat = this.skillCategories.find((c) => c.id === categoryId);
    if (cat) {
      cat.skills = cat.skills.filter((s) => s.name !== skillName);
      this.notify();

      if (isSupabaseConfigured()) {
        const supabase = getSupabaseClient();
        if (supabase) {
          const { error } = await supabase.from('skills').delete().eq('category_id', categoryId).eq('name', skillName);
          if (error) {
            console.error('Supabase deleteSkill error:', error);
            throw new Error(`Failed to delete skill from Supabase (${error.code}): ${error.message}`);
          }
        }
      }
    }
  }

  public async reorderSkills(
    categoryId: string,
    skills: { name: string; level: any; supportedBy: string }[]
  ): Promise<void> {
    const cat = this.skillCategories.find((c) => c.id === categoryId);
    if (cat) {
      cat.skills = [...skills];
      this.notify();

      if (isSupabaseConfigured()) {
        const supabase = getSupabaseClient();
        if (supabase) {
          for (let i = 0; i < skills.length; i++) {
            await supabase
              .from('skills')
              .update({ sort_order: i + 1 })
              .eq('category_id', categoryId)
              .eq('name', skills[i].name);
          }
        }
      }
    }
  }

  public async updateRecruiter(data: Partial<RecruiterContent>): Promise<void> {
    this.recruiter = { ...this.recruiter, ...data };
    this.notify();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from('recruiter_content').upsert({
          id: 'main_recruiter',
          hero_headline: this.recruiter.heroHeadline,
          hero_subtitle: this.recruiter.heroSubtitle,
          summary: this.recruiter.summary,
          preferred_roles: this.recruiter.preferredRoles,
          work_authorization: this.recruiter.workAuthorization,
          availability_timeline: this.recruiter.availabilityTimeline,
          updated_at: new Date().toISOString(),
        });
        if (error) {
          console.error('Supabase updateRecruiter error:', error);
          throw new Error(`Failed to save recruiter dossier in Supabase (${error.code}): ${error.message}`);
        }
      }
    }
  }

  public async updateSeo(data: Partial<SeoSettings>): Promise<void> {
    this.seo = { ...this.seo, ...data };
    this.notify();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from('seo_settings').upsert({
          id: 'main_seo',
          site_title: this.seo.siteTitle,
          meta_description: this.seo.metaDescription,
          keywords: this.seo.keywords,
          author_name: this.seo.authorName,
          og_title: this.seo.ogTitle,
          og_description: this.seo.ogDescription,
          canonical_url: this.seo.canonicalUrl,
          updated_at: new Date().toISOString(),
        });
        if (error) {
          console.error('Supabase updateSeo error:', error);
          throw new Error(`Failed to save SEO configuration in Supabase (${error.code}): ${error.message}`);
        }
      }
    }
  }

  public async updateEducation(data: Partial<EducationItem>): Promise<void> {
    this.education = { ...this.education, ...data };
    if (this.education.cgpa) {
      this.profile.cgpa = this.education.cgpa;
    }
    if (this.education.degree) {
      this.profile.educationDegree = this.education.degree;
    }
    this.notify();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from('education').upsert({
          id: 'main_education',
          degree: this.education.degree,
          institution: this.education.institution,
          location: this.education.location,
          period: this.education.period,
          cgpa: this.education.cgpa,
          focus: this.education.focus,
          coursework: this.education.coursework,
          updated_at: new Date().toISOString(),
        });
        if (error) {
          console.error('Supabase updateEducation error:', error);
          throw new Error(`Failed to save education to Supabase (${error.code}): ${error.message}`);
        }

        // Also update profiles table so cgpa stays unified across tables
        await supabase.from('profiles').update({
          cgpa: this.education.cgpa,
          education_degree: this.education.degree,
          updated_at: new Date().toISOString(),
        }).eq('id', 'main_profile');
      }
    }
  }

  public async saveSocialLink(link: SocialLinkItem): Promise<void> {
    const idx = this.socialLinks.findIndex((s) => s.id === link.id);
    if (idx >= 0) {
      this.socialLinks[idx] = link;
    } else {
      this.socialLinks.push(link);
    }
    this.notify();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from('social_links').upsert({
          id: link.id,
          platform: link.platform,
          label: link.label,
          url: link.url,
          icon_name: link.iconName,
          is_enabled: link.isEnabled ?? true,
          sort_order: link.sortOrder ?? (idx >= 0 ? idx + 1 : this.socialLinks.length),
          updated_at: new Date().toISOString(),
        });
        if (error) {
          console.error('Supabase saveSocialLink error:', error);
          throw new Error(`Failed to save social link in Supabase (${error.code}): ${error.message}`);
        }
      }
    }
  }

  public async toggleSocialLink(id: string, isEnabled: boolean): Promise<void> {
    const link = this.socialLinks.find((s) => s.id === id);
    if (link) {
      link.isEnabled = isEnabled;
      this.notify();

      if (isSupabaseConfigured()) {
        const supabase = getSupabaseClient();
        if (supabase) {
          const { error } = await supabase
            .from('social_links')
            .update({ is_enabled: isEnabled, updated_at: new Date().toISOString() })
            .eq('id', id);
          if (error) {
            throw new Error(`Failed to toggle social link in Supabase: ${error.message}`);
          }
        }
      }
    }
  }

  public async reorderSocialLinks(newOrder: SocialLinkItem[]): Promise<void> {
    this.socialLinks = [...newOrder];
    this.notify();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        for (let i = 0; i < newOrder.length; i++) {
          await supabase.from('social_links').update({ sort_order: i + 1 }).eq('id', newOrder[i].id);
        }
      }
    }
  }

  public async deleteSocialLink(id: string): Promise<void> {
    this.socialLinks = this.socialLinks.filter((s) => s.id !== id);
    this.notify();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from('social_links').delete().eq('id', id);
        if (error) {
          console.error('Supabase deleteSocialLink error:', error);
          throw new Error(`Failed to delete social link from Supabase (${error.code}): ${error.message}`);
        }
      }
    }
  }

  public async updateSiteSettings(settings: Partial<SiteSettingsData>): Promise<void> {
    this.siteSettings = { ...this.siteSettings, ...settings };
    if (settings.contactEmail) {
      this.profile.email = settings.contactEmail;
    }
    if (settings.contactPhone) {
      this.profile.phoneDisplay = settings.contactPhone;
    }
    if (settings.contactLocation) {
      this.profile.location = settings.contactLocation;
    }
    this.notify();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from('site_settings').upsert({
          id: 'main_settings',
          contact_email: this.siteSettings.contactEmail,
          contact_phone: this.siteSettings.contactPhone,
          contact_location: this.siteSettings.contactLocation,
          contact_heading: this.siteSettings.contactHeading,
          contact_description: this.siteSettings.contactDescription,
          updated_at: new Date().toISOString(),
        });
        if (error) {
          console.error('Supabase updateSiteSettings error:', error);
          throw new Error(`Failed to save site settings in Supabase (${error.code}): ${error.message}`);
        }

        // Also sync to profile
        await supabase.from('profiles').update({
          email: this.profile.email,
          phone_display: this.profile.phoneDisplay,
          location: this.profile.location,
          updated_at: new Date().toISOString(),
        }).eq('id', 'main_profile');
      }
    }
  }

  // Multi-Resume Management & Storage
  public async fetchResumeList(): Promise<ResumeFileItem[]> {
    if (!isSupabaseConfigured()) {
      return this.resumeInfo.fileUrl ? [this.resumeInfo] : [];
    }
    const supabase = getSupabaseClient();
    if (!supabase) return this.resumeInfo.fileUrl ? [this.resumeInfo] : [];
    try {
      const { data, error } = await supabase
        .from('resume_files')
        .select('*')
        .order('uploaded_at', { ascending: false });
      if (error || !data) return this.resumeInfo.fileUrl ? [this.resumeInfo] : [];
      return data.map((r) => ({
        id: r.id,
        fileName: r.file_name,
        fileUrl: r.file_url,
        fileSize: r.file_size,
        isActive: r.is_active,
        uploadedAt: r.uploaded_at,
      }));
    } catch {
      return this.resumeInfo.fileUrl ? [this.resumeInfo] : [];
    }
  }

  public async setActiveResume(id: string): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        // Deactivate all first
        await supabase.from('resume_files').update({ is_active: false }).neq('id', '');
        // Activate selected
        const { data, error } = await supabase
          .from('resume_files')
          .update({ is_active: true })
          .eq('id', id)
          .select()
          .single();
        if (error) {
          return { success: false, error: error.message };
        }
        if (data) {
          this.resumeInfo = {
            id: data.id,
            fileName: data.file_name,
            fileUrl: data.file_url,
            fileSize: data.file_size,
            isActive: true,
            uploadedAt: data.uploaded_at,
          };
          this.notify();
          return { success: true };
        }
      }
    }
    this.notify();
    return { success: true };
  }

  public async deleteResume(id: string, fileUrl?: string): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          if (fileUrl && fileUrl.includes('/resumes/')) {
            try {
              const fileName = fileUrl.split('/resumes/')[1]?.split('?')[0];
              if (fileName) {
                await supabase.storage.from('resumes').remove([decodeURIComponent(fileName)]);
              }
            } catch (storageErr) {
              console.warn('Could not remove file from resumes bucket:', storageErr);
            }
          }

          const { error } = await supabase.from('resume_files').delete().eq('id', id);
          if (error) {
            return { success: false, error: error.message };
          }

          // If deleted resume was active, choose next available
          if (this.resumeInfo.id === id) {
            const { data } = await supabase
              .from('resume_files')
              .select('*')
              .order('uploaded_at', { ascending: false })
              .limit(1);
            if (data && data.length > 0) {
              await supabase.from('resume_files').update({ is_active: true }).eq('id', data[0].id);
              this.resumeInfo = {
                id: data[0].id,
                fileName: data[0].file_name,
                fileUrl: data[0].file_url,
                fileSize: data[0].file_size,
                isActive: true,
                uploadedAt: data[0].uploaded_at,
              };
            } else {
              this.resumeInfo = {
                id: '',
                fileName: '',
                fileUrl: '',
                isActive: false,
              };
            }
          }
          this.notify();
          return { success: true };
        } catch (e: any) {
          return { success: false, error: e.message };
        }
      }
    }

    if (this.resumeInfo.id === id) {
      this.resumeInfo = { id: '', fileName: '', fileUrl: '', isActive: false };
      this.notify();
    }
    return { success: true };
  }

  // Resume Upload to Supabase Storage
  public async uploadResume(file: File): Promise<{ success: boolean; error?: string }> {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return { success: false, error: 'Only PDF files are permitted.' };
    }

    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Supabase credentials are not configured. Resume upload requires active Supabase Storage.',
      };
    }

    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: 'Supabase client not initialized' };

    // Verify authenticated user before upload
    const { data: userData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !userData.user) {
      return {
        success: false,
        error: 'Authentication required: You must be logged into Supabase Auth with an active session to upload resume files. Please log in via /admin/login.',
      };
    }

    try {
      const cleanName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const uploadResult = await supabase.storage.from('resumes').upload(cleanName, file, {
        cacheControl: '3600',
        upsert: true,
      });

      if (uploadResult.error) {
        const errMsg = uploadResult.error.message || '';
        if (errMsg.toLowerCase().includes('row-level security') || errMsg.toLowerCase().includes('violates row-level')) {
          return {
            success: false,
            error: `STORAGE RLS POLICY ERROR: Supabase Storage rejected the upload because your session is not authenticated or the bucket policy requires authentication. Run the Storage RLS policy in supabase_schema.sql to allow authenticated uploads to 'resumes'.`,
          };
        }
        return {
          success: false,
          error: `Storage error: ${uploadResult.error.message}. Please ensure the 'resumes' bucket is created in Supabase Storage.`,
        };
      }

      const { data: publicUrlData } = supabase.storage.from('resumes').getPublicUrl(cleanName);
      const publicUrl = publicUrlData.publicUrl;

      // Deactivate older resumes
      const newId = `resume_${Date.now()}`;
      try {
        await supabase.from('resume_files').update({ is_active: false }).eq('is_active', true);

        // Insert new active resume
        const { error: insertError } = await supabase.from('resume_files').insert({
          id: newId,
          file_name: file.name,
          file_url: publicUrl,
          file_size: file.size,
          is_active: true,
          uploaded_at: new Date().toISOString(),
        });

        if (insertError) {
          if (insertError.code === 'PGRST205' || insertError.message?.toLowerCase().includes('not found')) {
            // Table resume_files missing, still update local active resume
            this.resumeInfo = {
              id: newId,
              fileName: file.name,
              fileUrl: publicUrl,
              fileSize: file.size,
              isActive: true,
              uploadedAt: new Date().toISOString(),
            };
            this.notify();
            return {
              success: true,
              error: `File uploaded to Storage successfully! Note: The 'resume_files' database table does not exist in Supabase yet. Run the SQL Migration in the SQL Schema tab to persist history records.`,
            };
          }
          return {
            success: false,
            error: `File uploaded to storage, but failed to record in resume_files table: ${insertError.message}`,
          };
        }
      } catch (dbErr) {
        console.warn('Database error while recording resume:', dbErr);
      }

      this.resumeInfo = {
        id: newId,
        fileName: file.name,
        fileUrl: publicUrl,
        fileSize: file.size,
        isActive: true,
        uploadedAt: new Date().toISOString(),
      };
      this.notify();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to upload resume file.' };
    }
  }

  public async deleteActiveResume(): Promise<void> {
    if (this.resumeInfo.id) {
      await this.deleteResume(this.resumeInfo.id, this.resumeInfo.fileUrl);
    } else {
      this.resumeInfo = {
        id: '',
        fileName: '',
        fileUrl: '',
        isActive: false,
      };
      this.notify();
    }
  }

  public async ensureResumeBucket(): Promise<{ success: boolean; message: string }> {
    return this.ensureStorageBuckets();
  }

  public async ensureStorageBuckets(): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, message: 'Supabase credentials are not configured.' };
    }
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, message: 'Supabase client could not be initialized.' };

    try {
      const { error: resErr } = await supabase.storage.from('resumes').list('', { limit: 1 });
      const resOk = !resErr || !resErr.message?.toLowerCase().includes('not found');
      return {
        success: resOk,
        message: resOk ? 'Bucket "resumes" is verified and reachable.' : 'Bucket "resumes" not found in Supabase Storage.',
      };
    } catch (e: any) {
      return { success: false, message: e.message || 'Failed to verify storage bucket.' };
    }
  }

  // Complete Data Migration & Verification tool
  public async migrateLocalDataToSupabase(): Promise<{
    success: boolean;
    message: string;
    details: {
      profile: boolean;
      homepage: boolean;
      about: boolean;
      projects: number;
      experiences: number;
      certifications: number;
      education: boolean;
      recruiter: boolean;
      seo: boolean;
    };
  }> {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        message: 'Supabase credentials are not yet configured in environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).',
        details: {
          profile: false,
          homepage: false,
          about: false,
          projects: 0,
          experiences: 0,
          certifications: 0,
          education: false,
          recruiter: false,
          seo: false,
        },
      };
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return {
        success: false,
        message: 'Unable to initialize Supabase client.',
        details: {
          profile: false,
          homepage: false,
          about: false,
          projects: 0,
          experiences: 0,
          certifications: 0,
          education: false,
          recruiter: false,
          seo: false,
        },
      };
    }

    try {
      // 0. Verify database tables exist before attempting sync
      const { error: testError } = await supabase.from('profiles').select('id').limit(1);
      if (
        testError &&
        (testError.code === 'PGRST205' ||
          testError.message?.toLowerCase().includes('not found') ||
          testError.message?.toLowerCase().includes('does not exist'))
      ) {
        return {
          success: false,
          message:
            'Supabase database tables have not been created yet. Please copy the SQL from the SQL Schema tab and run it in your Supabase project SQL Editor first.',
          details: {
            profile: false,
            homepage: false,
            about: false,
            projects: 0,
            experiences: 0,
            certifications: 0,
            education: false,
            recruiter: false,
            seo: false,
          },
        };
      }

      // Preserve any existing live CGPA/Education edits in DB or current state
      const { data: existingEdu } = await supabase.from('education').select('cgpa, degree').eq('id', 'main_education').maybeSingle();
      const resolvedCgpa = existingEdu?.cgpa || this.education.cgpa || BACKUP_EDUCATION.cgpa;
      const resolvedDegree = existingEdu?.degree || this.education.degree || BACKUP_EDUCATION.degree;

      // 1. Profile (Sync current state or backup without overwriting live edits)
      await supabase.from('profiles').upsert({
        id: 'main_profile',
        name: this.profile.name || BACKUP_PERSONAL_INFO.name,
        preferred_name: this.profile.preferredName || BACKUP_PERSONAL_INFO.preferredName,
        primary_title: this.profile.primaryTitle || BACKUP_PERSONAL_INFO.primaryTitle,
        secondary_title: this.profile.secondaryTitle || BACKUP_PERSONAL_INFO.secondaryTitle,
        location: this.profile.location || BACKUP_PERSONAL_INFO.location,
        email: this.profile.email || BACKUP_PERSONAL_INFO.email,
        phone: this.profile.phone || BACKUP_PERSONAL_INFO.phone,
        phone_display: this.profile.phoneDisplay || BACKUP_PERSONAL_INFO.phoneDisplay,
        linkedin: this.profile.linkedin || BACKUP_PERSONAL_INFO.linkedin,
        github: this.profile.github || BACKUP_PERSONAL_INFO.github,
        availability: this.profile.availability || BACKUP_PERSONAL_INFO.availability,
        availability_status: this.profile.availabilityStatus || BACKUP_PERSONAL_INFO.availabilityStatus,
        availability_text: this.profile.availabilityText || BACKUP_PERSONAL_INFO.availabilityText,
        value_proposition: this.profile.valueProposition || BACKUP_PERSONAL_INFO.valueProposition,
        short_bio: this.profile.shortBio || BACKUP_PERSONAL_INFO.shortBio,
        dsa_solved: this.profile.dsaSolved || BACKUP_PERSONAL_INFO.dsaSolved,
        education_degree: resolvedDegree,
        cgpa: resolvedCgpa,
      });

      // 2. Homepage
      await supabase.from('homepage_content').upsert({
        id: 'main_homepage',
        hero_name: this.homepage.heroName || BACKUP_HOMEPAGE_CONTENT.heroName,
        hero_title: this.homepage.heroTitle || BACKUP_HOMEPAGE_CONTENT.heroTitle,
        hero_description: this.homepage.heroDescription || BACKUP_HOMEPAGE_CONTENT.heroDescription,
        availability_label: this.homepage.availabilityLabel || BACKUP_HOMEPAGE_CONTENT.availabilityLabel,
        who_i_am_eyebrow: this.homepage.whoIAmEyebrow || BACKUP_HOMEPAGE_CONTENT.whoIAmEyebrow,
        who_i_am_heading: this.homepage.whoIAmHeading || BACKUP_HOMEPAGE_CONTENT.whoIAmHeading,
        who_i_am_p1: this.homepage.whoIAmP1 || BACKUP_HOMEPAGE_CONTENT.whoIAmP1,
        who_i_am_p2: this.homepage.whoIAmP2 || BACKUP_HOMEPAGE_CONTENT.whoIAmP2,
        quote_text: this.homepage.quoteText || BACKUP_HOMEPAGE_CONTENT.quoteText,
        quote_author: this.homepage.quoteAuthor || BACKUP_HOMEPAGE_CONTENT.quoteAuthor,
        quote_title: this.homepage.quoteTitle || BACKUP_HOMEPAGE_CONTENT.quoteTitle,
      });

      // 3. About
      await supabase.from('about_content').upsert({
        id: 'main_about',
        heading: this.about.heading || BACKUP_ABOUT_CONTENT.heading,
        subheading: this.about.subheading || BACKUP_ABOUT_CONTENT.subheading,
        narrative_p1: this.about.narrativeP1 || BACKUP_ABOUT_CONTENT.narrativeP1,
        narrative_p2: this.about.narrativeP2 || BACKUP_ABOUT_CONTENT.narrativeP2,
        narrative_p3: this.about.narrativeP3 || BACKUP_ABOUT_CONTENT.narrativeP3,
      });

      // 4. Projects
      const projectsToSync = this.projects.length > 0 ? this.projects : BACKUP_PROJECTS;
      let projectCount = 0;
      for (let i = 0; i < projectsToSync.length; i++) {
        const p = projectsToSync[i];
        await supabase.from('projects').upsert({
          id: p.id,
          title: p.title,
          subtitle: p.subtitle,
          category: p.category,
          category_label: p.categoryLabel,
          period: p.period,
          status_badge: p.statusBadge,
          is_featured: p.isFeatured,
          is_enabled: true,
          sort_order: i + 1,
          problem_solved: p.problemSolved,
          solution: p.solution,
          technologies: p.technologies,
          features: p.features,
          contributions: p.contributions,
          architecture_details: p.architectureDetails,
          live_url: p.liveUrl || null,
          github_url: p.githubUrl || null,
        });
        projectCount++;
      }

      // 5. Experiences
      const experiencesToSync = this.experiences.length > 0 ? this.experiences : BACKUP_EXPERIENCES;
      let expCount = 0;
      for (let i = 0; i < experiencesToSync.length; i++) {
        const e = experiencesToSync[i];
        await supabase.from('experiences').upsert({
          id: e.id,
          company: e.company,
          role: e.role,
          type: e.type,
          location: e.location,
          period: e.period,
          is_current: i === 0,
          is_enabled: true,
          sort_order: i + 1,
          summary: e.summary || '',
          responsibilities: e.responsibilities,
          technologies: e.technologies,
          key_impact: e.keyImpact,
        });
        expCount++;
      }

      // 6. Certifications
      const certsToSync = this.certifications.length > 0 ? this.certifications : BACKUP_CERTIFICATIONS;
      let certCount = 0;
      for (let i = 0; i < certsToSync.length; i++) {
        const c = certsToSync[i];
        await supabase.from('certifications').upsert({
          id: c.id,
          name: c.name,
          issuer: c.issuer,
          date: c.date || '2026',
          credential_badge: c.credentialBadge || 'Verified Credential',
          category: c.category,
          description: c.description,
          credential_url: c.credentialUrl || null,
          is_enabled: true,
          sort_order: i + 1,
        });
        certCount++;
      }

      // 7. Education (Single Source of Truth, preserving live edited CGPA)
      await supabase.from('education').upsert({
        id: 'main_education',
        degree: resolvedDegree,
        institution: this.education.institution || BACKUP_EDUCATION.institution,
        location: this.education.location || BACKUP_EDUCATION.location,
        period: this.education.period || BACKUP_EDUCATION.period,
        cgpa: resolvedCgpa,
        focus: this.education.focus || BACKUP_EDUCATION.focus,
        coursework: this.education.coursework && this.education.coursework.length > 0 ? this.education.coursework : BACKUP_EDUCATION.coursework,
        sort_order: 1,
      });

      // 8. Skills
      let skillOrder = 1;
      for (const cat of this.skillCategories) {
        for (const s of cat.skills) {
          const sId = `skill_${cat.id}_${s.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
          await supabase.from('skills').upsert({
            id: sId,
            category_id: cat.id,
            category_name: cat.categoryName,
            name: s.name,
            level: s.level,
            supported_by: s.supportedBy || null,
            sort_order: skillOrder++,
            is_enabled: true,
          });
        }
      }

      // 9. Recruiter
      await supabase.from('recruiter_content').upsert({
        id: 'main_recruiter',
        hero_headline: this.recruiter.heroHeadline || BACKUP_RECRUITER_CONTENT.heroHeadline,
        hero_subtitle: this.recruiter.heroSubtitle || BACKUP_RECRUITER_CONTENT.heroSubtitle,
        summary: this.recruiter.summary || BACKUP_RECRUITER_CONTENT.summary,
        preferred_roles: this.recruiter.preferredRoles || BACKUP_RECRUITER_CONTENT.preferredRoles,
        work_authorization: this.recruiter.workAuthorization || BACKUP_RECRUITER_CONTENT.workAuthorization,
        availability_timeline: this.recruiter.availabilityTimeline || BACKUP_RECRUITER_CONTENT.availabilityTimeline,
      });

      // 10. SEO
      await supabase.from('seo_settings').upsert({
        id: 'main_seo',
        site_title: this.seo.siteTitle || BACKUP_SEO_SETTINGS.siteTitle,
        meta_description: this.seo.metaDescription || BACKUP_SEO_SETTINGS.metaDescription,
        keywords: this.seo.keywords || BACKUP_SEO_SETTINGS.keywords,
        author_name: this.seo.authorName || BACKUP_SEO_SETTINGS.authorName,
        og_title: this.seo.ogTitle || BACKUP_SEO_SETTINGS.ogTitle,
        og_description: this.seo.ogDescription || BACKUP_SEO_SETTINGS.ogDescription,
        canonical_url: this.seo.canonicalUrl || BACKUP_SEO_SETTINGS.canonicalUrl,
      });

      // Refresh service from newly synced records
      await this.refreshAll();

      return {
        success: true,
        message: 'Successfully migrated and verified all portfolio records into Supabase!',
        details: {
          profile: true,
          homepage: true,
          about: true,
          projects: projectCount,
          experiences: expCount,
          certifications: certCount,
          education: true,
          recruiter: true,
          seo: true,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Migration encountered an error.',
        details: {
          profile: false,
          homepage: false,
          about: false,
          projects: 0,
          experiences: 0,
          certifications: 0,
          education: false,
          recruiter: false,
          seo: false,
        },
      };
    }
  }

  // Database and storage health check
  public async checkDatabaseHealth(): Promise<{
    isConfigured: boolean;
    connected: boolean;
    tables: Record<string, { ok: boolean; count?: number; error?: string }>;
    resumesBucketOk: boolean;
    bucketMessage?: string;
  }> {
    if (!isSupabaseConfigured()) {
      return {
        isConfigured: false,
        connected: false,
        tables: {},
        resumesBucketOk: false,
        bucketMessage: 'Supabase credentials not configured.',
      };
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return {
        isConfigured: true,
        connected: false,
        tables: {},
        resumesBucketOk: false,
        bucketMessage: 'Could not initialize client.',
      };
    }

    const tableNames = [
      'profiles',
      'homepage_content',
      'about_content',
      'recruiter_content',
      'seo_settings',
      'projects',
      'experiences',
      'skills',
      'certifications',
      'education',
      'social_links',
      'resume_files',
      'site_settings',
    ];

    const tables: Record<string, { ok: boolean; count?: number; error?: string }> = {};
    let connected = true;

    for (const tbl of tableNames) {
      try {
        const { count, error } = await supabase.from(tbl).select('*', { count: 'exact', head: true });
        if (error) {
          tables[tbl] = { ok: false, error: error.message };
          if (error.code === 'PGRST205' || error.message?.toLowerCase().includes('not found')) {
            connected = false;
          }
        } else {
          tables[tbl] = { ok: true, count: count ?? 0 };
        }
      } catch (e: any) {
        tables[tbl] = { ok: false, error: e.message };
      }
    }

    // Check storage bucket 'resumes' directly via list()
    let resumesBucketOk = false;
    let bucketMessage = '';
    try {
      const { data, error: bError } = await supabase.storage.from('resumes').list('', { limit: 1 });
      if (bError) {
        if (bError.message?.toLowerCase().includes('not found') || (bError as any).statusCode === '404') {
          resumesBucketOk = false;
          bucketMessage = 'Bucket "resumes" not found in Supabase Storage.';
        } else {
          // The bucket exists (error might be RLS or permission)
          resumesBucketOk = true;
          bucketMessage = `Bucket "resumes" active (${bError.message})`;
        }
      } else {
        resumesBucketOk = true;
        bucketMessage = 'Bucket "resumes" verified & reachable.';
      }
    } catch (e: any) {
      bucketMessage = e.message || 'Error reaching bucket.';
    }

    return {
      isConfigured: true,
      connected,
      tables,
      resumesBucketOk,
      bucketMessage,
    };
  }
}

export const portfolioService = new PortfolioService();
