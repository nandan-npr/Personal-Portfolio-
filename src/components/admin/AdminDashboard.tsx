import React, { useState, useEffect } from 'react';
import {
  Shield,
  LogOut,
  ExternalLink,
  Layers,
  User,
  Home,
  FileText,
  Briefcase,
  Award,
  BookOpen,
  Upload,
  Globe,
  Database,
  CheckCircle,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Save,
  ArrowUp,
  ArrowDown,
  Copy,
  RefreshCw,
  Search,
  Sliders,
  Download,
  Eye,
  Settings as SettingsIcon,
  ToggleLeft,
  ToggleRight,
  Key,
  Lock,
} from 'lucide-react';
import {
  AdminSection,
  ProjectItem,
  ExperienceItem,
  CertificationItem,
  SkillItem,
  SocialLinkItem,
  ResumeFileItem,
} from '../../types';
import { portfolioService } from '../../services/portfolioService';
import { authService, ADMIN_EMAIL } from '../../services/authService';
import { isSupabaseConfigured, getSupabaseClient } from '../../lib/supabase';
import { usePortfolio } from '../../hooks/usePortfolio';

interface AdminDashboardProps {
  onBackToSite: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite, onLogout }) => {
  const {
    profile,
    homepage,
    about,
    projects,
    experiences,
    skillCategories,
    certifications,
    education,
    recruiter,
    seo,
    resumeInfo,
    socialLinks,
    siteSettings,
  } = usePortfolio();

  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [migrationStatus, setMigrationStatus] = useState<any | null>(null);
  const [migrating, setMigrating] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);

  // Multi-Resume state
  const [resumeList, setResumeList] = useState<ResumeFileItem[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  // Skill editing state
  const [editingSkill, setEditingSkill] = useState<{ categoryId: string; oldName?: string; skill: SkillItem } | null>(null);
  const [isNewSkill, setIsNewSkill] = useState(false);

  // Social link editing state
  const [editingSocial, setEditingSocial] = useState<SocialLinkItem | null>(null);
  const [isNewSocial, setIsNewSocial] = useState(false);

  // Certificate file upload state
  const [certUploading, setCertUploading] = useState(false);

  // Supabase Auth modal & session state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState(ADMIN_EMAIL);
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSupabaseAuthed, setIsSupabaseAuthed] = useState(authService.isSupabaseAuthenticated());

  // Real Supabase Auth session diagnostic (Requirement 1 & 4)
  const [authDiagnostic, setAuthDiagnostic] = useState<{
    dbStatus: 'CONNECTED' | 'DISCONNECTED';
    sessionStatus: 'AUTHENTICATED' | 'UNAUTHENTICATED' | 'VERIFYING';
    adminEmail: string;
    userId: string;
  }>({
    dbStatus: isSupabaseConfigured() ? 'CONNECTED' : 'DISCONNECTED',
    sessionStatus: 'VERIFYING',
    adminEmail: '',
    userId: '',
  });

  // Reusable confirmation modal state to replace window.confirm (avoids iframe blocking)
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => Promise<void> | void;
  } | null>(null);

  // Track forms modified by user so active keystrokes are NEVER overwritten by background sync
  const dirtyForms = React.useRef<Set<string>>(new Set());

  const verifySupabaseSession = async () => {
    if (!isSupabaseConfigured()) {
      setAuthDiagnostic({
        dbStatus: 'DISCONNECTED',
        sessionStatus: 'UNAUTHENTICATED',
        adminEmail: '',
        userId: '',
      });
      return;
    }
    const supabase = getSupabaseClient();
    if (!supabase) {
      setAuthDiagnostic({
        dbStatus: 'DISCONNECTED',
        sessionStatus: 'UNAUTHENTICATED',
        adminEmail: '',
        userId: '',
      });
      return;
    }
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user || !user.email) {
        setAuthDiagnostic({
          dbStatus: 'CONNECTED',
          sessionStatus: 'UNAUTHENTICATED',
          adminEmail: '',
          userId: '',
        });
        setIsSupabaseAuthed(false);
      } else {
        setAuthDiagnostic({
          dbStatus: 'CONNECTED',
          sessionStatus: 'AUTHENTICATED',
          adminEmail: user.email,
          userId: user.id,
        });
        setIsSupabaseAuthed(true);
      }
    } catch {
      setAuthDiagnostic({
        dbStatus: 'CONNECTED',
        sessionStatus: 'UNAUTHENTICATED',
        adminEmail: '',
        userId: '',
      });
      setIsSupabaseAuthed(false);
    }
  };

  useEffect(() => {
    verifySupabaseSession();
    const unsub = authService.subscribe(() => {
      verifySupabaseSession();
    });
    return () => unsub();
  }, []);

  const ensureAuthed = (): boolean => {
    if (authDiagnostic.sessionStatus !== 'AUTHENTICATED') {
      showToast('Protected operation blocked: Supabase admin authentication required. Please sign in via /admin/login.', 'error');
      return false;
    }
    return true;
  };

  // Local editing states for current forms
  const [profileForm, setProfileForm] = useState({ ...profile });
  const [homeForm, setHomeForm] = useState({ ...homepage });
  const [aboutForm, setAboutForm] = useState({ ...about });
  const [recruiterForm, setRecruiterForm] = useState({ ...recruiter, preferredRolesText: (recruiter.preferredRoles || []).join('\n') });
  const [seoForm, setSeoForm] = useState({ ...seo });
  const [eduForm, setEduForm] = useState({ ...education, courseworkText: (education.coursework || []).join('\n') });
  const [contactForm, setContactForm] = useState({ ...siteSettings });
  const [dbHealth, setDbHealth] = useState<any | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  // Synchronize form states whenever central portfolioService updates (only when not actively typing)
  useEffect(() => {
    if (!dirtyForms.current.has('profile')) {
      setProfileForm({ ...profile });
    }
  }, [profile]);

  useEffect(() => {
    if (!dirtyForms.current.has('homepage')) {
      setHomeForm({ ...homepage });
    }
  }, [homepage]);

  useEffect(() => {
    if (!dirtyForms.current.has('about')) {
      setAboutForm({ ...about });
    }
  }, [about]);

  useEffect(() => {
    if (!dirtyForms.current.has('recruiter')) {
      setRecruiterForm({ ...recruiter, preferredRolesText: (recruiter.preferredRoles || []).join('\n') });
    }
  }, [recruiter]);

  useEffect(() => {
    if (!dirtyForms.current.has('seo')) {
      setSeoForm({ ...seo });
    }
  }, [seo]);

  useEffect(() => {
    if (!dirtyForms.current.has('education')) {
      setEduForm({ ...education, courseworkText: (education.coursework || []).join('\n') });
    }
  }, [education]);

  useEffect(() => {
    if (!dirtyForms.current.has('contact')) {
      setContactForm({ ...siteSettings });
    }
  }, [siteSettings]);

  // Load list of all uploaded resumes
  const loadResumes = async () => {
    setLoadingResumes(true);
    try {
      const list = await portfolioService.fetchResumeList();
      setResumeList(list);
    } catch {
      // ignore
    } finally {
      setLoadingResumes(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, [resumeInfo.id, resumeInfo.fileUrl]);

  // Auth state listener
  useEffect(() => {
    const unsub = authService.subscribe(() => {
      setIsSupabaseAuthed(authService.isSupabaseAuthenticated());
    });
    return () => unsub();
  }, []);

  // Project editing modal / drawer state
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);

  // Experience editing state
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [isNewExp, setIsNewExp] = useState(false);

  // Certification editing state
  const [editingCert, setEditingCert] = useState<CertificationItem | null>(null);
  const [isNewCert, setIsNewCert] = useState(false);

  const isConfigured = isSupabaseConfigured();

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // 1. Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureAuthed()) return;
    try {
      await portfolioService.updateProfile(profileForm);
      dirtyForms.current.delete('profile');
      showToast('Personal profile updated successfully.');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile.', 'error');
    }
  };

  // 2. Homepage Save
  const handleSaveHomepage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureAuthed()) return;
    try {
      await portfolioService.updateHomepage(homeForm);
      dirtyForms.current.delete('homepage');
      showToast('Homepage hero & perspective updated successfully.');
    } catch (err: any) {
      showToast(err.message || 'Failed to update homepage.', 'error');
    }
  };

  // 3. About Save
  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureAuthed()) return;
    try {
      await portfolioService.updateAbout(aboutForm);
      dirtyForms.current.delete('about');
      showToast('About narrative updated successfully.');
    } catch (err: any) {
      showToast(err.message || 'Failed to update about section.', 'error');
    }
  };

  // 4. Recruiter Save
  const handleSaveRecruiter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureAuthed()) return;
    try {
      const roles = recruiterForm.preferredRolesText
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean);
      await portfolioService.updateRecruiter({
        ...recruiterForm,
        preferredRoles: roles,
      });
      dirtyForms.current.delete('recruiter');
      showToast('Recruiter dossier updated successfully.');
    } catch (err: any) {
      showToast(err.message || 'Failed to update recruiter dossier.', 'error');
    }
  };

  // 5. SEO Save
  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureAuthed()) return;
    try {
      await portfolioService.updateSeo(seoForm);
      dirtyForms.current.delete('seo');
      showToast('SEO metadata & social graph tags updated.');
    } catch (err: any) {
      showToast(err.message || 'Failed to update SEO settings.', 'error');
    }
  };

  // 6. Education Save
  const handleSaveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureAuthed()) return;
    try {
      const courses = eduForm.courseworkText
        .split('\n')
        .map((c) => c.trim())
        .filter(Boolean);
      await portfolioService.updateEducation({
        ...eduForm,
        coursework: courses,
      });
      dirtyForms.current.delete('education');
      showToast('Academic credentials & coursework updated.');
    } catch (err: any) {
      showToast(err.message || 'Failed to update education.', 'error');
    }
  };

  // 7. Project CRUD Handlers
  const handleSaveProjectModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureAuthed()) return;
    if (!editingProject) return;
    try {
      await portfolioService.saveProject(editingProject);
      setEditingProject(null);
      setIsNewProject(false);
      showToast(`Project "${editingProject.title}" saved successfully.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to save project.', 'error');
    }
  };

  const handleDeleteProject = (id: string, title: string) => {
    if (!ensureAuthed()) return;
    setConfirmModal({
      title: 'Remove Project',
      message: `Are you sure you want to remove project "${title}"? This action cannot be undone.`,
      confirmText: 'Delete Project',
      onConfirm: async () => {
        try {
          await portfolioService.deleteProject(id);
          showToast(`Project "${title}" removed.`);
        } catch (err: any) {
          showToast(err.message || 'Failed to delete project.', 'error');
        }
      },
    });
  };

  const handleMoveProject = async (index: number, direction: 'up' | 'down') => {
    if (!ensureAuthed()) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= projects.length) return;
    const newItems = [...projects];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIdx, 0, moved);
    await portfolioService.reorderProjects(newItems);
    showToast('Project display order updated.');
  };

  // 8. Experience CRUD Handlers
  const handleSaveExpModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureAuthed()) return;
    if (!editingExp) return;
    try {
      await portfolioService.saveExperience(editingExp);
      setEditingExp(null);
      setIsNewExp(false);
      showToast(`Experience at "${editingExp.company}" saved.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to save experience.', 'error');
    }
  };

  const handleDeleteExp = (id: string, company: string) => {
    if (!ensureAuthed()) return;
    setConfirmModal({
      title: 'Remove Experience',
      message: `Are you sure you want to remove experience record at "${company}"?`,
      confirmText: 'Delete Experience',
      onConfirm: async () => {
        try {
          await portfolioService.deleteExperience(id);
          showToast(`Experience at ${company} removed.`);
        } catch (err: any) {
          showToast(err.message || 'Failed to delete experience.', 'error');
        }
      },
    });
  };

  const handleMoveExp = async (index: number, direction: 'up' | 'down') => {
    if (!ensureAuthed()) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= experiences.length) return;
    const newItems = [...experiences];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIdx, 0, moved);
    try {
      await portfolioService.reorderExperiences(newItems);
      showToast('Experience ordering updated.');
    } catch (err: any) {
      showToast(err.message || 'Failed to reorder experiences.', 'error');
    }
  };

  // 9. Certification CRUD
  const handleSaveCertModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureAuthed()) return;
    if (!editingCert) return;
    try {
      await portfolioService.saveCertification(editingCert);
      setEditingCert(null);
      setIsNewCert(false);
      showToast(`Certification "${editingCert.name}" saved.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to save certification.', 'error');
    }
  };

  const handleDeleteCert = (id: string, name: string) => {
    if (!ensureAuthed()) return;
    setConfirmModal({
      title: 'Remove Certification',
      message: `Are you sure you want to remove certification "${name}"?`,
      confirmText: 'Delete Certification',
      onConfirm: async () => {
        try {
          await portfolioService.deleteCertification(id);
          showToast(`Certification "${name}" removed.`);
        } catch (err: any) {
          showToast(err.message || 'Failed to delete certification.', 'error');
        }
      },
    });
  };

  const handleMoveCert = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= certifications.length) return;
    const newItems = [...certifications];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIdx, 0, moved);
    try {
      await portfolioService.reorderCertifications(newItems);
      showToast('Certification ordering updated.');
    } catch (err: any) {
      showToast(err.message || 'Failed to reorder certifications.', 'error');
    }
  };

  const handleCertFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCert) return;
    setCertUploading(true);
    try {
      const res = await portfolioService.uploadCertificateFile(file);
      if (res.success && res.url) {
        setEditingCert({ ...editingCert, fileUrl: res.url, credentialUrl: res.url });
        showToast('Certificate document uploaded to storage.');
      } else {
        showToast(res.error || 'Failed to upload certificate document.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Upload error.', 'error');
    } finally {
      setCertUploading(false);
    }
  };

  // 10. Skills CMS Handlers
  const handleSaveSkillModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;
    try {
      if (isNewSkill || !editingSkill.oldName) {
        await portfolioService.saveSkill(editingSkill.categoryId, editingSkill.skill);
      } else {
        await portfolioService.updateSkill(editingSkill.categoryId, editingSkill.oldName, editingSkill.skill);
      }
      setEditingSkill(null);
      setIsNewSkill(false);
      showToast(`Skill "${editingSkill.skill.name}" saved successfully.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to save skill.', 'error');
    }
  };

  const handleDeleteSkill = (categoryId: string, skillName: string) => {
    if (!ensureAuthed()) return;
    setConfirmModal({
      title: 'Remove Skill',
      message: `Are you sure you want to remove skill "${skillName}"?`,
      confirmText: 'Delete Skill',
      onConfirm: async () => {
        try {
          await portfolioService.deleteSkill(categoryId, skillName);
          showToast(`Skill "${skillName}" removed.`);
        } catch (err: any) {
          showToast(err.message || 'Failed to delete skill.', 'error');
        }
      },
    });
  };

  const handleMoveSkill = async (categoryId: string, index: number, direction: 'up' | 'down') => {
    if (!ensureAuthed()) return;
    const cat = skillCategories.find((c) => c.id === categoryId);
    if (!cat) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= cat.skills.length) return;
    const newSkills = [...cat.skills];
    const [moved] = newSkills.splice(index, 1);
    newSkills.splice(targetIdx, 0, moved);
    try {
      await portfolioService.reorderSkills(categoryId, newSkills);
      showToast('Skill ordering updated.');
    } catch (err: any) {
      showToast(err.message || 'Failed to reorder skills.', 'error');
    }
  };

  // 11. Social Channels Handlers
  const handleSaveSocialModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureAuthed()) return;
    if (!editingSocial) return;
    try {
      await portfolioService.saveSocialLink(editingSocial);
      setEditingSocial(null);
      setIsNewSocial(false);
      showToast(`Social channel "${editingSocial.label}" saved.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to save social channel.', 'error');
    }
  };

  const handleToggleSocial = async (id: string, currentStatus: boolean) => {
    if (!ensureAuthed()) return;
    try {
      await portfolioService.toggleSocialLink(id, !currentStatus);
      showToast(`Social channel visibility ${!currentStatus ? 'enabled' : 'disabled'}.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle social link.', 'error');
    }
  };

  const handleDeleteSocial = (id: string, label: string) => {
    if (!ensureAuthed()) return;
    setConfirmModal({
      title: 'Remove Social Channel',
      message: `Are you sure you want to remove social channel "${label}"?`,
      confirmText: 'Delete Channel',
      onConfirm: async () => {
        try {
          await portfolioService.deleteSocialLink(id);
          showToast(`Channel "${label}" removed.`);
        } catch (err: any) {
          showToast(err.message || 'Failed to delete channel.', 'error');
        }
      },
    });
  };

  const handleMoveSocial = async (index: number, direction: 'up' | 'down') => {
    if (!ensureAuthed()) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= socialLinks.length) return;
    const newLinks = [...socialLinks];
    const [moved] = newLinks.splice(index, 1);
    newLinks.splice(targetIdx, 0, moved);
    try {
      await portfolioService.reorderSocialLinks(newLinks);
      showToast('Social channel ordering updated.');
    } catch (err: any) {
      showToast(err.message || 'Failed to reorder social links.', 'error');
    }
  };

  // 12. Site & Contact Settings Save
  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureAuthed()) return;
    try {
      await portfolioService.updateSiteSettings(contactForm);
      dirtyForms.current.delete('contact');
      showToast('Site and contact settings saved successfully.');
    } catch (err: any) {
      showToast(err.message || 'Failed to save site settings.', 'error');
    }
  };

  // 13. Resume Upload & Management Handlers
  const handleResumeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ensureAuthed()) {
      if (e.target) e.target.value = '';
      return;
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Please select a valid PDF file.', 'error');
      return;
    }

    setResumeUploading(true);
    try {
      const res = await portfolioService.uploadResume(file);
      if (res.success) {
        showToast('New resume uploaded and activated successfully!');
        await loadResumes();
      } else {
        showToast(res.error || 'Upload failed.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to process resume.', 'error');
    } finally {
      setResumeUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSetActiveResume = async (id: string) => {
    if (!ensureAuthed()) return;
    try {
      const res = await portfolioService.setActiveResume(id);
      if (res.success) {
        showToast('Active resume updated.');
        await loadResumes();
      } else {
        showToast(res.error || 'Failed to switch active resume.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error setting active resume.', 'error');
    }
  };

  const handleDeleteResume = (id: string, fileUrl?: string) => {
    if (!ensureAuthed()) return;
    setConfirmModal({
      title: 'Delete Resume File',
      message: 'Are you sure you want to permanently delete this resume from Supabase Storage and records?',
      confirmText: 'Delete Resume',
      onConfirm: async () => {
        try {
          const res = await portfolioService.deleteResume(id, fileUrl);
          if (res.success) {
            showToast('Resume removed successfully.');
            await loadResumes();
          } else {
            showToast(res.error || 'Failed to delete resume.', 'error');
          }
        } catch (err: any) {
          showToast(err.message || 'Error deleting resume.', 'error');
        }
      },
    });
  };

  // 14. Run Migration to Supabase
  const handleRunMigration = async () => {
    setMigrating(true);
    try {
      const res = await portfolioService.migrateLocalDataToSupabase();
      setMigrationStatus(res);
      if (res.success) {
        showToast('Database successfully synchronized with Supabase!');
      } else {
        showToast(res.message, 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Migration failed.', 'error');
    } finally {
      setMigrating(false);
    }
  };

  // 15. Health Check & Storage Bucket Verification
  const handleCheckHealth = async () => {
    setCheckingHealth(true);
    try {
      const health = await portfolioService.checkDatabaseHealth();
      setDbHealth(health);
      if (health.connected) {
        showToast('Supabase connection verified successfully.');
      } else {
        showToast('Could not reach tables in Supabase.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Health check error.', 'error');
    } finally {
      setCheckingHealth(false);
    }
  };

  const handleEnsureBucket = async () => {
    try {
      const res = await portfolioService.ensureStorageBuckets();
      if (res.success) {
        showToast(res.message);
      } else {
        showToast(res.message, 'error');
      }
      await handleCheckHealth();
    } catch (err: any) {
      showToast(err.message || 'Error checking storage buckets.', 'error');
    }
  };

  // 16. Connect Supabase Auth handler
  const handleSupabaseAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (authModalMode === 'login') {
        const res = await authService.login(authEmail, authPassword);
        if (res.success) {
          setIsSupabaseAuthed(authService.isSupabaseAuthenticated());
          setShowAuthModal(false);
          showToast('Connected to Supabase Auth! All RLS policies and Storage are now authorized.');
        } else {
          setAuthError(res.error || 'Supabase authentication failed.');
          showToast(res.error || 'Supabase authentication failed.', 'error');
        }
      } else {
        const res = await authService.signUpAdmin(authPassword, authEmail);
        if (res.success) {
          setIsSupabaseAuthed(authService.isSupabaseAuthenticated());
          setShowAuthModal(false);
          showToast('Admin user registered and session authenticated!');
        } else {
          setAuthError(res.error || 'Registration failed.');
          showToast(res.error || 'Registration failed.', 'error');
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication error.');
      showToast(err.message || 'Authentication error.', 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-neutral-900 flex flex-col font-sans selection:bg-[#B8934A]/20">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`px-4 py-3 rounded-none border shadow-md text-xs font-mono uppercase tracking-wider flex items-center gap-2.5 ${
              notification.type === 'success'
                ? 'bg-neutral-950 text-white border-neutral-900'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-3.5 h-3.5 text-[#B8934A]" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Top Application Bar */}
      <header className="h-16 border-b border-neutral-200/80 bg-white sticky top-0 z-40 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#B8934A]" />
            <span className="text-xs font-mono uppercase tracking-widest font-semibold text-neutral-950">
              CMS • Control Center
            </span>
          </div>
          <span className="text-neutral-300">|</span>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono border border-neutral-200">
            <span className={`w-1.5 h-1.5 rounded-full ${isConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span className="text-neutral-600">
              {isConfigured ? 'Supabase Database Connected' : 'Local Persistence (Ready for Supabase)'}
            </span>
          </div>
          {isSupabaseAuthed ? (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono border border-emerald-200 bg-emerald-50 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Supabase Auth: Active Session</span>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthModalMode('login');
                setShowAuthModal(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 transition-colors"
            >
              <Lock className="w-2.5 h-2.5 text-amber-600" />
              <span>Connect Supabase Auth (RLS / Storage)</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!isSupabaseAuthed && (
            <button
              onClick={() => {
                setAuthModalMode('login');
                setShowAuthModal(true);
              }}
              className="sm:hidden px-2.5 py-1 text-[10px] font-mono bg-amber-100 text-amber-900 border border-amber-300"
            >
              Connect Auth
            </button>
          )}
          <button
            onClick={onBackToSite}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 border border-neutral-200 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            <span>View Public Site</span>
          </button>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-red-700 transition-colors"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Non-sensitive Supabase Authentication & Session Diagnostic Banner (Requirement 1 & 4) */}
      <div className="bg-neutral-950 text-neutral-200 px-6 py-2.5 border-b border-neutral-800 text-xs font-mono flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 uppercase tracking-wider text-[10px]">Authentication:</span>
            <span className={`inline-flex items-center gap-1.5 font-bold tracking-wide ${authDiagnostic.dbStatus === 'CONNECTED' ? 'text-emerald-400' : 'text-rose-400'}`}>
              <span className={`w-2 h-2 rounded-full ${authDiagnostic.dbStatus === 'CONNECTED' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
              {authDiagnostic.dbStatus}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 uppercase tracking-wider text-[10px]">Admin session:</span>
            <span className={`inline-flex items-center gap-1.5 font-bold tracking-wide ${authDiagnostic.sessionStatus === 'AUTHENTICATED' ? 'text-emerald-400' : authDiagnostic.sessionStatus === 'VERIFYING' ? 'text-amber-400' : 'text-rose-400'}`}>
              <span className={`w-2 h-2 rounded-full ${authDiagnostic.sessionStatus === 'AUTHENTICATED' ? 'bg-emerald-400' : 'bg-rose-500'}`} />
              {authDiagnostic.sessionStatus}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 uppercase tracking-wider text-[10px]">Admin email:</span>
            <span className="text-white font-medium bg-neutral-900 px-2.5 py-0.5 rounded border border-neutral-800">
              {authDiagnostic.adminEmail || 'None (Sign-in required)'}
            </span>
          </div>
        </div>

        {authDiagnostic.sessionStatus !== 'AUTHENTICATED' ? (
          <div className="flex items-center gap-3">
            <span className="text-rose-400 text-[11px] flex items-center gap-1.5 font-sans">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Protected operations restricted</span>
            </span>
            <button
              onClick={onLogout}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-[10px] uppercase tracking-wider transition-colors"
            >
              Sign In via /admin/login
            </button>
          </div>
        ) : (
          <div className="text-[11px] text-neutral-400 font-sans hidden md:block">
            All Storage & Database RLS policies authenticated
          </div>
        )}
      </div>

      {/* Main Workspace with Sidebar and Content Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-64 border-r border-neutral-200/80 bg-white shrink-0 overflow-y-auto p-4 space-y-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-600 px-3">
              Core Management
            </span>
            <div className="mt-2 space-y-0.5">
              {[
                { id: 'overview', label: '01 // Overview & Sync', icon: Database },
                { id: 'profile', label: '02 // Personal Profile', icon: User },
                { id: 'homepage', label: '03 // Hero & Perspective', icon: Home },
                { id: 'about', label: '04 // Systematic About', icon: FileText },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as AdminSection)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-mono tracking-wide text-left transition-colors ${
                      isActive
                        ? 'bg-neutral-950 text-white font-medium'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#B8934A]' : 'text-neutral-600'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-600 px-3">
              Portfolio Content
            </span>
            <div className="mt-2 space-y-0.5">
              {[
                { id: 'projects', label: '05 // Projects CMS', icon: Layers },
                { id: 'experience', label: '06 // Work Experience', icon: Briefcase },
                { id: 'skills', label: '07 // Skills Matrix', icon: Sliders },
                { id: 'certifications', label: '08 // Certifications', icon: Award },
                { id: 'education', label: '09 // Education & GPA', icon: BookOpen },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as AdminSection)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-mono tracking-wide text-left transition-colors ${
                      isActive
                        ? 'bg-neutral-950 text-white font-medium'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#B8934A]' : 'text-neutral-600'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-600 px-3">
              Assets & Distribution
            </span>
            <div className="mt-2 space-y-0.5">
              {[
                { id: 'resume', label: '10 // Resume Manager', icon: Upload },
                { id: 'recruiter', label: '11 // Recruiter Dossier', icon: Shield },
                { id: 'social', label: '12 // Social Channels', icon: Globe },
                { id: 'seo', label: '13 // SEO & Meta Graph', icon: Search },
                { id: 'settings', label: '14 // Site & Contact Settings', icon: Key },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as AdminSection)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-mono tracking-wide text-left transition-colors ${
                      isActive
                        ? 'bg-neutral-950 text-white font-medium'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#B8934A]' : 'text-neutral-600'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Dynamic Content Panel */}
        <main className="flex-1 overflow-y-auto p-8 sm:p-12 max-w-5xl">
          {/* ========================================================================= */}
          {/* 1. OVERVIEW & DATABASE SYNC */}
          {/* ========================================================================= */}
          {activeSection === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#B8934A] block mb-1">
                  01 // Overview & Database Health
                </span>
                <h2 className="text-2xl font-serif font-light text-neutral-950 tracking-tight">
                  Portfolio Operations & Supabase Sync
                </h2>
                <p className="text-xs text-neutral-500 font-mono mt-1">
                  Manage the centralized source of truth backing the portfolio.
                </p>
              </div>

              {/* Status Banner */}
              <div className="p-6 bg-white border border-neutral-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${isConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className="text-sm font-semibold text-neutral-950">
                      {isConfigured ? 'Supabase Connected & Active' : 'Fallback Mode Active (Credentials Pending)'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
                    {isConfigured
                      ? 'The public website is connected directly to your PostgreSQL database in Supabase. Real-time changes are synchronized instantly.'
                      : 'All existing projects, certifications, experiences, skills, and recruiter details are preserved intact in verified storage. You can run the database migration as soon as environment keys are provided.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    onClick={handleCheckHealth}
                    disabled={checkingHealth}
                    className="px-3.5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-mono uppercase tracking-wider transition-colors inline-flex items-center gap-2 border border-neutral-300 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${checkingHealth ? 'animate-spin' : ''}`} />
                    <span>{checkingHealth ? 'Testing Connection...' : 'Check Connection'}</span>
                  </button>
                  <button
                    onClick={handleRunMigration}
                    disabled={migrating}
                    className="px-4 py-2.5 bg-neutral-950 hover:bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${migrating ? 'animate-spin' : ''}`} />
                    <span>{migrating ? 'Migrating Records...' : 'Sync Records to Supabase'}</span>
                  </button>
                </div>
              </div>

              {/* Database & Storage Health Panel */}
              {dbHealth && (
                <div className="p-6 bg-white border border-neutral-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-900 font-semibold">
                      Supabase Health & Storage Diagnostics
                    </h3>
                    <span className={`px-2 py-0.5 text-[10px] font-mono uppercase ${dbHealth.connected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      {dbHealth.connected ? 'Connected' : 'Connection Issues'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-3 bg-neutral-50 border border-neutral-200/60">
                      <span className="text-neutral-500 block mb-1">Tables Verified:</span>
                      <span className="font-bold text-neutral-950">{Object.keys(dbHealth.tables || {}).length} Checked</span>
                    </div>
                    <div className="p-3 bg-neutral-50 border border-neutral-200/60">
                      <span className="text-neutral-500 block mb-1">Resume Bucket:</span>
                      <span className={`font-bold ${dbHealth.storageBucketReady ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {dbHealth.storageBucketReady ? 'Ready (public)' : 'Missing / Unreachable'}
                      </span>
                    </div>
                  </div>
                  {!dbHealth.storageBucketReady && (
                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={handleEnsureBucket}
                        className="px-3 py-1.5 bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                      >
                        Auto-Create 'resumes' Storage Bucket
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Data Verification Metrics Table */}
              <div className="bg-white border border-neutral-200/80 p-6">
                <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-700 mb-4">
                  Current Database Inventory
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-[#FAF9F7] border border-neutral-200/60">
                    <span className="text-2xl font-serif text-neutral-950 block">{projects.length}</span>
                    <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                      Projects Active
                    </span>
                  </div>
                  <div className="p-4 bg-[#FAF9F7] border border-neutral-200/60">
                    <span className="text-2xl font-serif text-neutral-950 block">{experiences.length}</span>
                    <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                      Work Experiences
                    </span>
                  </div>
                  <div className="p-4 bg-[#FAF9F7] border border-neutral-200/60">
                    <span className="text-2xl font-serif text-neutral-950 block">{certifications.length}</span>
                    <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                      Certifications
                    </span>
                  </div>
                  <div className="p-4 bg-[#FAF9F7] border border-neutral-200/60">
                    <span className="text-2xl font-serif text-neutral-950 block">
                      {skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0)}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                      Verified Skills
                    </span>
                  </div>
                </div>
              </div>

              {/* Migration Status Report */}
              {migrationStatus && (
                <div className="p-6 bg-white border border-neutral-200">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-900 mb-2">
                    Migration Output Report
                  </h4>
                  <p className="text-xs text-neutral-600 mb-4">{migrationStatus.message}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                    <div className="flex justify-between p-2 bg-neutral-50">
                      <span>Projects:</span>
                      <span className="font-bold">{migrationStatus.details.projects}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-neutral-50">
                      <span>Experiences:</span>
                      <span className="font-bold">{migrationStatus.details.experiences}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-neutral-50">
                      <span>Certifications:</span>
                      <span className="font-bold">{migrationStatus.details.certifications}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-neutral-50">
                      <span>Profile:</span>
                      <span className="text-emerald-600">VERIFIED</span>
                    </div>
                    <div className="flex justify-between p-2 bg-neutral-50">
                      <span>Homepage:</span>
                      <span className="text-emerald-600">VERIFIED</span>
                    </div>
                    <div className="flex justify-between p-2 bg-neutral-50">
                      <span>Education:</span>
                      <span className="text-emerald-600">VERIFIED</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Setup Helper */}
              <div className="p-6 bg-neutral-50 border border-neutral-200">
                <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-950 mb-2">
                  Database Script Reference
                </h4>
                <p className="text-xs text-neutral-600 mb-3 leading-relaxed">
                  A production SQL schema file with full Row-Level-Security (RLS), public read policies, and tables is available in{' '}
                  <code className="px-1 py-0.5 bg-neutral-200 font-mono text-neutral-800">/supabase_schema.sql</code>.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('See /supabase_schema.sql in workspace');
                      showToast('Reference path copied to clipboard');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 text-xs font-mono text-neutral-700 hover:text-neutral-950 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Schema Reference</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. PERSONAL PROFILE */}
          {/* ========================================================================= */}
          {activeSection === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#B8934A] block mb-1">
                  02 // Personal Profile
                </span>
                <h2 className="text-2xl font-serif font-light text-neutral-950 tracking-tight">
                  Identity & Contact Information
                </h2>
              </div>

              <form onSubmit={handleSaveProfile} className="bg-white border border-neutral-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#B8934A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                      Preferred / Display Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.preferredName || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, preferredName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#B8934A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                      Primary Professional Title
                    </label>
                    <input
                      type="text"
                      value={profileForm.primaryTitle}
                      onChange={(e) => setProfileForm({ ...profileForm, primaryTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#B8934A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                      Secondary Discipline Subtitle
                    </label>
                    <input
                      type="text"
                      value={profileForm.secondaryTitle || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, secondaryTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#B8934A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#B8934A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                      Phone Number (Formatted)
                    </label>
                    <input
                      type="text"
                      value={profileForm.phoneDisplay || ''}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          phoneDisplay: e.target.value,
                          phone: e.target.value.replace(/\s+/g, ''),
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#B8934A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                      Location / Region
                    </label>
                    <input
                      type="text"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#B8934A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                      Availability Status
                    </label>
                    <select
                      value={profileForm.availabilityStatus || 'available'}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          availabilityStatus: e.target.value as any,
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#B8934A]"
                    >
                      <option value="available">Available (Immediate Joiner)</option>
                      <option value="unavailable">Contract Engaged / Unavailable</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                    Hero Availability Badge Text
                  </label>
                  <input
                    type="text"
                    value={profileForm.availabilityText || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, availabilityText: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#B8934A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                    Core Value Proposition
                  </label>
                  <textarea
                    rows={3}
                    value={profileForm.valueProposition || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, valueProposition: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#B8934A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                    Short Bio (Overview Narrative)
                  </label>
                  <textarea
                    rows={4}
                    value={profileForm.shortBio || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, shortBio: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#B8934A]"
                  />
                </div>

                <div className="pt-4 border-t border-neutral-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-neutral-950 hover:bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. HOMEPAGE & HERO */}
          {/* ========================================================================= */}
          {activeSection === 'homepage' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#B8934A] block mb-1">
                  03 // Homepage & Hero
                </span>
                <h2 className="text-2xl font-serif font-light text-neutral-950 tracking-tight">
                  Hero Typography & Core Perspective
                </h2>
              </div>

              <form onSubmit={handleSaveHomepage} className="bg-white border border-neutral-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                    Hero Main Headline (Name)
                  </label>
                  <input
                    type="text"
                    value={homeForm.heroName}
                    onChange={(e) => setHomeForm({ ...homeForm, heroName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#B8934A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                    Hero Title
                  </label>
                  <input
                    type="text"
                    value={homeForm.heroTitle}
                    onChange={(e) => setHomeForm({ ...homeForm, heroTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#B8934A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                    Hero Description Sentence
                  </label>
                  <textarea
                    rows={2}
                    value={homeForm.heroDescription}
                    onChange={(e) => setHomeForm({ ...homeForm, heroDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#B8934A]"
                  />
                </div>

                <div className="pt-4 border-t border-neutral-100">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-950 mb-3">
                    01 // Core Perspective Section
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                        Perspective Heading
                      </label>
                      <input
                        type="text"
                        value={homeForm.whoIAmHeading}
                        onChange={(e) => setHomeForm({ ...homeForm, whoIAmHeading: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#B8934A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                        First Paragraph
                      </label>
                      <textarea
                        rows={3}
                        value={homeForm.whoIAmP1}
                        onChange={(e) => setHomeForm({ ...homeForm, whoIAmP1: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#B8934A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                        Second Paragraph
                      </label>
                      <textarea
                        rows={3}
                        value={homeForm.whoIAmP2}
                        onChange={(e) => setHomeForm({ ...homeForm, whoIAmP2: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#B8934A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                        Featured Quote Text
                      </label>
                      <textarea
                        rows={2}
                        value={homeForm.quoteText}
                        onChange={(e) => setHomeForm({ ...homeForm, quoteText: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#B8934A]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-neutral-950 hover:bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Homepage Content</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. ABOUT & PHILOSOPHY */}
          {/* ========================================================================= */}
          {activeSection === 'about' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#B8934A] block mb-1">
                  04 // Systematic About
                </span>
                <h2 className="text-2xl font-serif font-light text-neutral-950 tracking-tight">
                  About Narrative & Engineering Methodology
                </h2>
              </div>

              <form onSubmit={handleSaveAbout} className="bg-white border border-neutral-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={aboutForm.heading}
                    onChange={(e) => setAboutForm({ ...aboutForm, heading: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#B8934A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                    Subheading / Standout Line
                  </label>
                  <textarea
                    rows={2}
                    value={aboutForm.subheading}
                    onChange={(e) => setAboutForm({ ...aboutForm, subheading: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#B8934A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                    Narrative Block 1 (Academic & Core Foundations)
                  </label>
                  <textarea
                    rows={3}
                    value={aboutForm.narrativeP1}
                    onChange={(e) => setAboutForm({ ...aboutForm, narrativeP1: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#B8934A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                    Narrative Block 2 (Industry Experience & Internships)
                  </label>
                  <textarea
                    rows={3}
                    value={aboutForm.narrativeP2}
                    onChange={(e) => setAboutForm({ ...aboutForm, narrativeP2: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#B8934A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                    Narrative Block 3 (Production Standards & Scalability)
                  </label>
                  <textarea
                    rows={3}
                    value={aboutForm.narrativeP3}
                    onChange={(e) => setAboutForm({ ...aboutForm, narrativeP3: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#B8934A]"
                  />
                </div>

                <div className="pt-4 border-t border-neutral-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-neutral-950 hover:bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save About Narrative</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. PROJECTS CMS */}
          {/* ========================================================================= */}
          {activeSection === 'projects' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#B8934A] block mb-1">
                    05 // Projects CMS
                  </span>
                  <h2 className="text-2xl font-serif font-light text-neutral-950 tracking-tight">
                    Engineered Systems & Dashboards
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setIsNewProject(true);
                    setEditingProject({
                      id: `project-${Date.now()}`,
                      title: '',
                      subtitle: '',
                      category: 'fullstack',
                      categoryLabel: 'Full-Stack Web',
                      period: '2026',
                      statusBadge: 'Production Ready',
                      isFeatured: true,
                      problemSolved: '',
                      solution: '',
                      technologies: ['React.js', 'Node.js', 'MongoDB'],
                      features: ['Key capability statement'],
                      contributions: ['Key contribution'],
                      architectureDetails: '',
                      liveUrl: '',
                      githubUrl: 'https://github.com/nandan-npr',
                    });
                  }}
                  className="px-4 py-2 bg-neutral-950 hover:bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider inline-flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Project</span>
                </button>
              </div>

              {/* Projects List */}
              <div className="space-y-4">
                {projects.map((proj, idx) => (
                  <div
                    key={proj.id}
                    className="p-5 bg-white border border-neutral-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono text-neutral-400">0{idx + 1}.</span>
                        <h4 className="text-base font-medium text-neutral-950">{proj.title}</h4>
                        <span className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-[10px] font-mono text-neutral-600 uppercase">
                          {proj.categoryLabel}
                        </span>
                        {proj.isFeatured && (
                          <span className="px-1.5 py-0.5 bg-amber-50 text-[#B8934A] border border-amber-200 text-[9px] font-mono uppercase">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 font-sans line-clamp-1">{proj.subtitle}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.technologies.slice(0, 5).map((t, i) => (
                          <span key={i} className="text-[10px] font-mono text-neutral-600 bg-neutral-50 px-1.5 py-0.5">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleMoveProject(idx, 'up')}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1.5 text-neutral-400 hover:text-neutral-950 disabled:opacity-20 transition-colors"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveProject(idx, 'down')}
                        disabled={idx === projects.length - 1}
                        title="Move Down"
                        className="p-1.5 text-neutral-400 hover:text-neutral-950 disabled:opacity-20 transition-colors"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setIsNewProject(false);
                          setEditingProject({ ...proj });
                        }}
                        className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-mono uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id, proj.title)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Project Modal / Editor */}
              {editingProject && (
                <div className="fixed inset-0 bg-neutral-950/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-white max-w-2xl w-full border border-neutral-200 p-6 sm:p-8 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                      <h3 className="text-lg font-serif font-light text-neutral-950">
                        {isNewProject ? 'Create New Project Record' : `Edit: ${editingProject.title}`}
                      </h3>
                      <button
                        onClick={() => setEditingProject(null)}
                        className="text-xs font-mono uppercase text-neutral-400 hover:text-neutral-950"
                      >
                        Close [ESC]
                      </button>
                    </div>

                    <form onSubmit={handleSaveProjectModal} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                            Project Title
                          </label>
                          <input
                            type="text"
                            required
                            value={editingProject.title}
                            onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                            className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                            Category
                          </label>
                          <select
                            value={editingProject.category}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                category: e.target.value as any,
                                categoryLabel:
                                  e.target.value === 'fullstack'
                                    ? 'Full-Stack Web'
                                    : e.target.value === 'ai-backend'
                                    ? 'AI & Backend Systems'
                                    : 'Data & BI Analytics',
                              })
                            }
                            className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm"
                          >
                            <option value="fullstack">Full-Stack Web</option>
                            <option value="ai-backend">AI & Backend Systems</option>
                            <option value="data-bi">Data & BI Analytics</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProject.subtitle}
                          onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                            Status Badge
                          </label>
                          <input
                            type="text"
                            value={editingProject.statusBadge}
                            onChange={(e) => setEditingProject({ ...editingProject, statusBadge: e.target.value })}
                            className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                            Timeline Period
                          </label>
                          <input
                            type="text"
                            value={editingProject.period}
                            onChange={(e) => setEditingProject({ ...editingProject, period: e.target.value })}
                            className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                          Technologies (Comma separated)
                        </label>
                        <input
                          type="text"
                          value={editingProject.technologies.join(', ')}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              technologies: e.target.value
                                .split(',')
                                .map((s) => s.trim())
                                .filter(Boolean),
                            })
                          }
                          className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                          Problem Solved
                        </label>
                        <textarea
                          rows={2}
                          value={editingProject.problemSolved}
                          onChange={(e) => setEditingProject({ ...editingProject, problemSolved: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                          Solution Architecture
                        </label>
                        <textarea
                          rows={2}
                          value={editingProject.solution}
                          onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                          Key Features (One bullet per line)
                        </label>
                        <textarea
                          rows={3}
                          value={editingProject.features.join('\n')}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              features: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                            })
                          }
                          className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                            Live Demo URL
                          </label>
                          <input
                            type="text"
                            value={editingProject.liveUrl || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                            GitHub Repository URL
                          </label>
                          <input
                            type="text"
                            value={editingProject.githubUrl || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                            placeholder="https://github.com/..."
                            className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm font-mono"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setEditingProject(null)}
                          className="px-4 py-2 border border-neutral-200 text-neutral-600 text-xs font-mono uppercase"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-neutral-950 hover:bg-neutral-900 text-white text-xs font-mono uppercase"
                        >
                          Save Project
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. WORK EXPERIENCE */}
          {/* ========================================================================= */}
          {activeSection === 'experience' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#B8934A] block mb-1">
                    06 // Work Experience
                  </span>
                  <h2 className="text-2xl font-serif font-light text-neutral-950 tracking-tight">
                    Professional Roles & Internships
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setIsNewExp(true);
                    setEditingExp({
                      id: `exp-${Date.now()}`,
                      company: '',
                      role: '',
                      type: 'Remote',
                      location: 'Bengaluru',
                      period: '2026',
                      summary: '',
                      responsibilities: ['Maintained structured project records.'],
                      technologies: ['React', 'Node.js'],
                      keyImpact: 'Key delivery milestone achieved.',
                    });
                  }}
                  className="px-4 py-2 bg-neutral-950 hover:bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider inline-flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Experience</span>
                </button>
              </div>

              <div className="space-y-4">
                {experiences.map((exp, idx) => (
                  <div key={exp.id} className="p-6 bg-white border border-neutral-200/80 shadow-sm space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-base font-medium text-neutral-950">{exp.company}</h4>
                        <p className="text-xs font-mono text-[#B8934A]">
                          {exp.role} • {exp.period} ({exp.type})
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleMoveExp(idx, 'up')}
                          disabled={idx === 0}
                          title="Move earlier in order"
                          className="p-1.5 text-neutral-400 hover:text-neutral-900 disabled:opacity-20 transition-colors"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveExp(idx, 'down')}
                          disabled={idx === experiences.length - 1}
                          title="Move later in order"
                          className="p-1.5 text-neutral-400 hover:text-neutral-900 disabled:opacity-20 transition-colors"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setIsNewExp(false);
                            setEditingExp({ ...exp });
                          }}
                          className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-mono uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors ml-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteExp(exp.id, exp.company)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">{exp.summary}</p>
                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                      <span>Impact: {exp.keyImpact}</span>
                      <span>{exp.responsibilities.length} verified duties</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Experience Editor Modal */}
              {editingExp && (
                <div className="fixed inset-0 bg-neutral-950/40 z-50 flex items-center justify-center p-4">
                  <div className="bg-white max-w-xl w-full border border-neutral-200 p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                      <h3 className="text-lg font-serif font-light text-neutral-950">
                        {isNewExp ? 'Add Experience' : `Edit: ${editingExp.company}`}
                      </h3>
                      <button
                        onClick={() => setEditingExp(null)}
                        className="text-xs font-mono uppercase text-neutral-400 hover:text-neutral-950"
                      >
                        Close
                      </button>
                    </div>

                    <form onSubmit={handleSaveExpModal} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                            Organization / Company
                          </label>
                          <input
                            type="text"
                            required
                            value={editingExp.company}
                            onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                            className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                            Role Title
                          </label>
                          <input
                            type="text"
                            required
                            value={editingExp.role}
                            onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                            className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                            Engagement Period
                          </label>
                          <input
                            type="text"
                            value={editingExp.period}
                            onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                            className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                            Location & Mode
                          </label>
                          <input
                            type="text"
                            value={editingExp.location}
                            onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                            className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                          Role Summary
                        </label>
                        <textarea
                          rows={3}
                          value={editingExp.summary || ''}
                          onChange={(e) => setEditingExp({ ...editingExp, summary: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                          Responsibilities (One per line)
                        </label>
                        <textarea
                          rows={4}
                          value={editingExp.responsibilities.join('\n')}
                          onChange={(e) =>
                            setEditingExp({
                              ...editingExp,
                              responsibilities: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                            })
                          }
                          className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                          Key Deliverable Impact Statement
                        </label>
                        <input
                          type="text"
                          value={editingExp.keyImpact}
                          onChange={(e) => setEditingExp({ ...editingExp, keyImpact: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm"
                        />
                      </div>

                      <div className="pt-4 border-t border-neutral-100 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setEditingExp(null)}
                          className="px-4 py-2 border border-neutral-200 text-neutral-600 text-xs font-mono uppercase"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-neutral-950 text-white text-xs font-mono uppercase"
                        >
                          Save Experience
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 7. SKILLS MATRIX */}
          {/* ========================================================================= */}
          {activeSection === 'skills' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#B8934A] block mb-1">
                    07 // Skills Matrix
                  </span>
                  <h2 className="text-2xl font-serif font-light text-neutral-950 tracking-tight">
                    Technical Pillars & Competency Tiers
                  </h2>
                  <p className="text-xs text-neutral-500 font-mono mt-1">
                    Manage categories, skill levels, and supporting production context.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsNewSkill(true);
                    setEditingSkill({
                      categoryId: skillCategories[0]?.id || 'languages',
                      oldName: '',
                      skill: { name: '', level: 'Advanced', supportedBy: '' },
                    });
                  }}
                  className="px-4 py-2 bg-neutral-950 hover:bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider inline-flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {skillCategories.map((cat) => (
                  <div key={cat.id} className="bg-white border border-neutral-200/80 p-6 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-950 uppercase tracking-wide">
                          {cat.categoryName}
                        </h4>
                        <p className="text-[11px] text-neutral-500 font-sans mt-0.5">{cat.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[#B8934A] font-semibold">{cat.skills.length}</span>
                        <button
                          onClick={() => {
                            setIsNewSkill(true);
                            setEditingSkill({
                              categoryId: cat.id,
                              oldName: '',
                              skill: { name: '', level: 'Advanced', supportedBy: '' },
                            });
                          }}
                          title="Add skill to this category"
                          className="p-1 text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {cat.skills.map((s, idx) => (
                        <div
                          key={`${cat.id}-${s.name}-${idx}`}
                          className="p-2.5 bg-[#FAF9F7] border border-neutral-200/60 flex items-center justify-between text-xs hover:border-neutral-300 transition-colors"
                        >
                          <div className="flex-1 pr-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-neutral-900">{s.name}</span>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase ${
                                  s.level === 'Advanced'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : s.level === 'Proficient'
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                    : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                                }`}
                              >
                                {s.level}
                              </span>
                            </div>
                            {s.supportedBy && (
                              <p className="text-[10px] text-neutral-500 font-sans line-clamp-1 mt-0.5">
                                {s.supportedBy}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMoveSkill(cat.id, idx, 'up')}
                              disabled={idx === 0}
                              title="Move Up"
                              className="p-1 text-neutral-400 hover:text-neutral-900 disabled:opacity-20 transition-colors"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleMoveSkill(cat.id, idx, 'down')}
                              disabled={idx === cat.skills.length - 1}
                              title="Move Down"
                              className="p-1 text-neutral-400 hover:text-neutral-900 disabled:opacity-20 transition-colors"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                setIsNewSkill(false);
                                setEditingSkill({
                                  categoryId: cat.id,
                                  oldName: s.name,
                                  skill: { ...s },
                                });
                              }}
                              title="Edit Skill"
                              className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteSkill(cat.id, s.name)}
                              title="Delete Skill"
                              className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {cat.skills.length === 0 && (
                        <p className="text-[11px] font-mono text-neutral-400 py-3 text-center">
                          No skills configured in this tier.
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 8. CERTIFICATIONS */}
          {/* ========================================================================= */}
          {activeSection === 'certifications' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#B8934A] block mb-1">
                    08 // Certifications
                  </span>
                  <h2 className="text-2xl font-serif font-light text-neutral-950 tracking-tight">
                    Verified Industry Credentials
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setIsNewCert(true);
                    setEditingCert({
                      id: `cert-${Date.now()}`,
                      name: '',
                      issuer: '',
                      date: '2026',
                      credentialBadge: 'Verified Credential',
                      category: 'Tech & Dev',
                      description: '',
                      credentialUrl: '',
                    });
                  }}
                  className="px-4 py-2 bg-neutral-950 hover:bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider inline-flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Certification</span>
                </button>
              </div>

              <div className="space-y-3">
                {certifications.map((cert, idx) => (
                  <div
                    key={cert.id}
                    className="p-5 bg-white border border-neutral-200/80 shadow-sm flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-neutral-950">{cert.name}</h4>
                        <span className="px-2 py-0.5 bg-neutral-100 text-[10px] font-mono text-neutral-600">
                          {cert.category}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 font-mono mt-0.5">
                        {cert.issuer} • {cert.date}
                      </p>
                      {(cert.credentialUrl || cert.fileUrl) && (
                        <a
                          href={cert.credentialUrl || cert.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-mono text-[#B8934A] hover:underline inline-flex items-center gap-1 mt-1"
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                          <span>View Verification Document</span>
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleMoveCert(idx, 'up')}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1.5 text-neutral-400 hover:text-neutral-900 disabled:opacity-20 transition-colors"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveCert(idx, 'down')}
                        disabled={idx === certifications.length - 1}
                        title="Move Down"
                        className="p-1.5 text-neutral-400 hover:text-neutral-900 disabled:opacity-20 transition-colors"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setIsNewCert(false);
                          setEditingCert({ ...cert });
                        }}
                        className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-mono uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors ml-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCert(cert.id, cert.name)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {certifications.length === 0 && (
                  <p className="text-xs font-mono text-neutral-400 py-6 text-center bg-white border border-neutral-200">
                    No certifications found. Click "Add Certification" to create one.
                  </p>
                )}
              </div>

              {/* Certification Editor Modal */}
              {editingCert && (
                <div className="fixed inset-0 bg-neutral-950/40 z-50 flex items-center justify-center p-4">
                  <div className="bg-white max-w-lg w-full border border-neutral-200 p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-lg font-serif font-light text-neutral-950 pb-2 border-b border-neutral-100">
                      {isNewCert ? 'New Certification' : `Edit: ${editingCert.name}`}
                    </h3>

                    <form onSubmit={handleSaveCertModal} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                          Credential Title
                        </label>
                        <input
                          type="text"
                          required
                          value={editingCert.name}
                          onChange={(e) => setEditingCert({ ...editingCert, name: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                            Issuing Entity
                          </label>
                          <input
                            type="text"
                            required
                            value={editingCert.issuer}
                            onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                            className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                            Category
                          </label>
                          <select
                            value={editingCert.category}
                            onChange={(e) => setEditingCert({ ...editingCert, category: e.target.value as any })}
                            className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm"
                          >
                            <option value="Tech & Dev">Tech & Dev</option>
                            <option value="Data Analytics">Data Analytics</option>
                            <option value="AI & Systems">AI & Systems</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                            Issue Year / Date
                          </label>
                          <input
                            type="text"
                            value={editingCert.date}
                            onChange={(e) => setEditingCert({ ...editingCert, date: e.target.value })}
                            placeholder="e.g. 2026"
                            className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                            Badge Label
                          </label>
                          <input
                            type="text"
                            value={editingCert.credentialBadge || ''}
                            onChange={(e) => setEditingCert({ ...editingCert, credentialBadge: e.target.value })}
                            placeholder="e.g. Verified Credential"
                            className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                          Verification URL
                        </label>
                        <input
                          type="text"
                          value={editingCert.credentialUrl || ''}
                          onChange={(e) => setEditingCert({ ...editingCert, credentialUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                          Upload Certificate Document (PDF / Image)
                        </label>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          disabled={certUploading}
                          onChange={handleCertFileUpload}
                          className="w-full text-xs font-mono file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:bg-neutral-950 file:text-white hover:file:bg-neutral-800"
                        />
                        {certUploading && (
                          <span className="text-[11px] font-mono text-[#B8934A] mt-1 block">
                            Uploading document to Supabase storage...
                          </span>
                        )}
                        {editingCert.fileUrl && (
                          <p className="text-[11px] font-mono text-emerald-600 mt-1 truncate">
                            Attached: {editingCert.fileUrl}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={editingCert.description}
                          onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm"
                        />
                      </div>

                      <div className="pt-4 border-t border-neutral-100 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setEditingCert(null)}
                          className="px-4 py-2 border border-neutral-200 text-neutral-600 text-xs font-mono uppercase"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={certUploading}
                          className="px-6 py-2 bg-neutral-950 text-white text-xs font-mono uppercase disabled:opacity-50"
                        >
                          Save Credential
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 9. EDUCATION */}
          {/* ========================================================================= */}
          {activeSection === 'education' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#B8934A] block mb-1">
                  09 // Education & GPA
                </span>
                <h2 className="text-2xl font-serif font-light text-neutral-950 tracking-tight">
                  Academic Degree & Verified Coursework
                </h2>
              </div>

              <form onSubmit={handleSaveEducation} className="bg-white border border-neutral-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                    Degree Name
                  </label>
                  <input
                    type="text"
                    value={eduForm.degree}
                    onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                      Institution Name
                    </label>
                    <input
                      type="text"
                      value={eduForm.institution}
                      onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                      Cumulative GPA
                    </label>
                    <input
                      type="text"
                      value={eduForm.cgpa}
                      onChange={(e) => setEduForm({ ...eduForm, cgpa: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                      Location
                    </label>
                    <input
                      type="text"
                      value={eduForm.location}
                      onChange={(e) => setEduForm({ ...eduForm, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                      Tenure Period
                    </label>
                    <input
                      type="text"
                      value={eduForm.period}
                      onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                    Coursework Modules (One per line)
                  </label>
                  <textarea
                    rows={6}
                    value={eduForm.courseworkText}
                    onChange={(e) => setEduForm({ ...eduForm, courseworkText: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm font-mono"
                  />
                </div>

                <div className="pt-4 border-t border-neutral-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-neutral-950 text-white text-xs font-mono uppercase tracking-wider inline-flex items-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Academic Details</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 10. RESUME MANAGER */}
          {/* ========================================================================= */}
          {activeSection === 'resume' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#B8934A] block mb-1">
                    10 // Resume Manager
                  </span>
                  <h2 className="text-2xl font-serif font-light text-neutral-950 tracking-tight">
                    Curriculum Vitae File Distribution
                  </h2>
                  <p className="text-xs text-neutral-500 font-mono mt-1">
                    Upload, replace, activate, and manage public PDF resume versions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={loadResumes}
                  className="px-3 py-1.5 border border-neutral-200 text-xs font-mono uppercase text-neutral-600 hover:text-neutral-950 inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh List</span>
                </button>
              </div>

              {/* Supabase Storage Bucket & Auth Advisory */}
              {!isSupabaseAuthed && (
                <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-amber-950 font-mono">
                        Supabase RLS & Storage Authorization
                      </span>
                      <p className="text-amber-800 text-[11px] mt-0.5">
                        Storage bucket write operations honor Row Level Security (RLS) policies. If uploading fails with RLS policy violations, ensure you are authenticated.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setAuthModalMode('login');
                      setShowAuthModal(true);
                    }}
                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 font-mono text-[11px] uppercase tracking-wider shrink-0 transition-colors"
                  >
                    Connect Auth
                  </button>
                </div>
              )}

              {/* Active Resume Status Card */}
              <div className="p-6 bg-white border border-neutral-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">
                      Currently Active Public Document
                    </span>
                    <h3 className="text-base font-medium text-neutral-950 mt-1">
                      {resumeInfo.fileName || 'No active PDF resume selected'}
                    </h3>
                  </div>
                  {resumeInfo.isActive ? (
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono uppercase">
                      Active on Site
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-neutral-100 text-neutral-600 text-[10px] font-mono uppercase">
                      Inactive
                    </span>
                  )}
                </div>

                {resumeInfo.fileUrl && (
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a
                      href={resumeInfo.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-mono uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View Active PDF</span>
                    </a>
                    <a
                      href={resumeInfo.fileUrl}
                      download={resumeInfo.fileName || 'resume.pdf'}
                      className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-mono uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </a>
                    <button
                      onClick={() => {
                        if (!ensureAuthed()) return;
                        setConfirmModal({
                          title: 'Deactivate Active Resume',
                          message: 'Are you sure you want to deactivate the current active resume? Visitors will see the fallback summary.',
                          confirmText: 'Deactivate',
                          onConfirm: async () => {
                            await portfolioService.deleteActiveResume();
                            await loadResumes();
                            showToast('Resume deactivated.');
                          },
                        });
                      }}
                      className="px-3 py-1.5 text-xs font-mono uppercase text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
                    >
                      Deactivate
                    </button>
                  </div>
                )}
              </div>

              {/* Upload Dropzone */}
              <div className="p-8 bg-white border-2 border-dashed border-neutral-300 hover:border-[#B8934A] transition-colors text-center space-y-3">
                <Upload className="w-8 h-8 text-neutral-400 mx-auto" />
                <div>
                  <label className="cursor-pointer">
                    <span className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-900 text-white text-xs font-mono uppercase tracking-widest inline-block transition-colors">
                      {resumeUploading ? 'Uploading PDF Document...' : 'Upload New PDF Resume'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      disabled={resumeUploading}
                      onChange={handleResumeFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-[11px] font-mono text-neutral-600">
                  Accepts standard PDF documents. Files are stored in Supabase Storage bucket <code className="bg-neutral-100 px-1 py-0.5 font-bold">resumes</code> with fallback.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleEnsureBucket}
                    className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 hover:text-neutral-900 underline underline-offset-4"
                  >
                    Verify or Auto-Create 'resumes' Storage Bucket
                  </button>
                </div>
              </div>

              {/* Stored Resumes History & Versions */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-serif font-light text-neutral-950">
                    Uploaded Resume Repository ({resumeList.length})
                  </h3>
                </div>

                {resumeList.length > 0 ? (
                  <div className="space-y-2">
                    {resumeList.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 bg-white border transition-colors flex items-center justify-between gap-4 ${
                          item.isActive ? 'border-[#B8934A]/80 shadow-xs' : 'border-neutral-200/80'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-medium text-neutral-900 truncate">
                              {item.fileName}
                            </span>
                            {item.isActive && (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-mono uppercase shrink-0">
                                Active Version
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-500 mt-1">
                            {item.fileSize && <span>{(item.fileSize / 1024).toFixed(1)} KB</span>}
                            {item.uploadedAt && <span>Uploaded: {new Date(item.uploadedAt).toLocaleDateString()}</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {!item.isActive && (
                            <button
                              type="button"
                              onClick={() => handleSetActiveResume(item.id)}
                              className="px-3 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-white text-[11px] font-mono uppercase tracking-wider transition-colors"
                            >
                              Set Active
                            </button>
                          )}
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
                            title="View PDF"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <a
                            href={item.fileUrl}
                            download={item.fileName}
                            className="p-1.5 text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDeleteResume(item.id, item.fileUrl)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Resume"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center bg-white border border-neutral-200 text-xs font-mono text-neutral-500">
                    No additional resume records stored in the repository. Use the upload box above to upload a new version.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 11. RECRUITER DOSSIER */}
          {/* ========================================================================= */}
          {activeSection === 'recruiter' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#B8934A] block mb-1">
                  11 // Recruiter Dossier
                </span>
                <h2 className="text-2xl font-serif font-light text-neutral-950 tracking-tight">
                  Talent Acquisition & Role Fit
                </h2>
              </div>

              <form onSubmit={handleSaveRecruiter} className="bg-white border border-neutral-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                    Hero Headline
                  </label>
                  <input
                    type="text"
                    value={recruiterForm.heroHeadline}
                    onChange={(e) => setRecruiterForm({ ...recruiterForm, heroHeadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                    Hero Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={recruiterForm.heroSubtitle}
                    onChange={(e) => setRecruiterForm({ ...recruiterForm, heroSubtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                    Executive Summary Paragraph
                  </label>
                  <textarea
                    rows={3}
                    value={recruiterForm.summary}
                    onChange={(e) => setRecruiterForm({ ...recruiterForm, summary: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                    Target Role Titles (One per line)
                  </label>
                  <textarea
                    rows={4}
                    value={recruiterForm.preferredRolesText}
                    onChange={(e) => setRecruiterForm({ ...recruiterForm, preferredRolesText: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                      Work Authorization
                    </label>
                    <input
                      type="text"
                      value={recruiterForm.workAuthorization}
                      onChange={(e) => setRecruiterForm({ ...recruiterForm, workAuthorization: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                      Availability Notice Timeline
                    </label>
                    <input
                      type="text"
                      value={recruiterForm.availabilityTimeline}
                      onChange={(e) => setRecruiterForm({ ...recruiterForm, availabilityTimeline: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-neutral-950 text-white text-xs font-mono uppercase tracking-wider inline-flex items-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Recruiter Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 12. SOCIAL CHANNELS */}
          {/* ========================================================================= */}
          {activeSection === 'social' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#B8934A] block mb-1">
                    12 // Social Channels
                  </span>
                  <h2 className="text-2xl font-serif font-light text-neutral-950 tracking-tight">
                    Public Network Endpoints
                  </h2>
                  <p className="text-xs text-neutral-500 font-mono mt-1">
                    Configure social links, portfolio channels, order, and public visibility.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsNewSocial(true);
                    setEditingSocial({
                      id: `social-${Date.now()}`,
                      platform: 'GitHub',
                      label: '',
                      url: 'https://',
                      icon: 'Github',
                      isEnabled: true,
                    });
                  }}
                  className="px-4 py-2 bg-neutral-950 hover:bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider inline-flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Channel</span>
                </button>
              </div>

              <div className="space-y-3">
                {socialLinks.map((link, idx) => (
                  <div
                    key={link.id}
                    className="p-4 bg-white border border-neutral-200/80 shadow-sm flex items-center justify-between gap-4 hover:border-neutral-300 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono uppercase tracking-wider text-neutral-950 font-semibold">
                          {link.platform}
                        </span>
                        {link.label && (
                          <span className="text-xs text-neutral-600 font-sans truncate">({link.label})</span>
                        )}
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase ${
                            link.isEnabled !== false
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                          }`}
                        >
                          {link.isEnabled !== false ? 'Enabled' : 'Hidden'}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 font-mono mt-0.5 truncate">{link.url}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveSocial(idx, 'up')}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1.5 text-neutral-400 hover:text-neutral-900 disabled:opacity-20 transition-colors"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSocial(idx, 'down')}
                        disabled={idx === socialLinks.length - 1}
                        title="Move Down"
                        className="p-1.5 text-neutral-400 hover:text-neutral-900 disabled:opacity-20 transition-colors"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleSocial(link.id, link.isEnabled)}
                        title={link.isEnabled !== false ? 'Hide from public site' : 'Show on public site'}
                        className={`px-2.5 py-1 text-[10px] font-mono uppercase border transition-colors ${
                          link.isEnabled !== false
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200'
                        }`}
                      >
                        {link.isEnabled !== false ? 'Visible' : 'Hidden'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsNewSocial(false);
                          setEditingSocial({ ...link });
                        }}
                        className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-mono uppercase tracking-wider inline-flex items-center gap-1 transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSocial(link.id, link.label || link.platform)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-[#B8934A] hover:text-[#9A7B3E] transition-colors"
                        title="Test Link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}

                {socialLinks.length === 0 && (
                  <div className="p-6 text-center bg-white border border-neutral-200 text-xs font-mono text-neutral-400">
                    No social channels configured. Click "Add Channel" above.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 13. SEO & META GRAPH */}
          {/* ========================================================================= */}
          {activeSection === 'seo' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#B8934A] block mb-1">
                  13 // SEO & Meta Graph
                </span>
                <h2 className="text-2xl font-serif font-light text-neutral-950 tracking-tight">
                  Search Engine Indexing & OpenGraph
                </h2>
              </div>

              <form onSubmit={handleSaveSeo} className="bg-white border border-neutral-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                    Meta Title Tag (&lt;title&gt;)
                  </label>
                  <input
                    type="text"
                    value={seoForm.siteTitle}
                    onChange={(e) => setSeoForm({ ...seoForm, siteTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                    Meta Description (&lt;meta name="description"&gt;)
                  </label>
                  <textarea
                    rows={3}
                    value={seoForm.metaDescription}
                    onChange={(e) => setSeoForm({ ...seoForm, metaDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    value={seoForm.keywords}
                    onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                      OpenGraph Title (og:title)
                    </label>
                    <input
                      type="text"
                      value={seoForm.ogTitle}
                      onChange={(e) => setSeoForm({ ...seoForm, ogTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                      Canonical Production URL
                    </label>
                    <input
                      type="text"
                      value={seoForm.canonicalUrl}
                      onChange={(e) => setSeoForm({ ...seoForm, canonicalUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-neutral-950 text-white text-xs font-mono uppercase tracking-wider inline-flex items-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save SEO Configurations</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 14. SITE & CONTACT SETTINGS */}
          {/* ========================================================================= */}
          {activeSection === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#B8934A] block mb-1">
                  14 // Site & Contact Settings
                </span>
                <h2 className="text-2xl font-serif font-light text-neutral-950 tracking-tight">
                  Inquiries, Contact Dispatch & System Settings
                </h2>
                <p className="text-xs text-neutral-500 font-mono mt-1">
                  Configure direct contact endpoints and public inquiries information.
                </p>
              </div>

              <form onSubmit={handleSaveSiteSettings} className="bg-white border border-neutral-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                      Primary Contact Email
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                      Direct Telephone Line
                    </label>
                    <input
                      type="text"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                      Geographic Location
                    </label>
                    <input
                      type="text"
                      value={contactForm.location}
                      onChange={(e) => setContactForm({ ...contactForm, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                      Contact Section Title
                    </label>
                    <input
                      type="text"
                      value={contactForm.contactHeading}
                      onChange={(e) => setContactForm({ ...contactForm, contactHeading: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                    Contact Section Subtitle / Narrative
                  </label>
                  <textarea
                    rows={3}
                    value={contactForm.contactDescription}
                    onChange={(e) => setContactForm({ ...contactForm, contactDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm"
                  />
                </div>

                <div className="pt-4 border-t border-neutral-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-neutral-950 text-white text-xs font-mono uppercase tracking-wider inline-flex items-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Contact Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODALS & DIALOGS */}
      {/* ========================================================================= */}

      {/* 1. Skill Editor Modal */}
      {editingSkill && (
        <div className="fixed inset-0 bg-neutral-950/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full border border-neutral-200 p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-serif font-light text-neutral-950 pb-2 border-b border-neutral-100">
              {isNewSkill ? 'Add Technical Competency' : `Edit: ${editingSkill.skill.name}`}
            </h3>
            <form onSubmit={handleSaveSkillModal} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                  Skill / Technology Name
                </label>
                <input
                  type="text"
                  required
                  value={editingSkill.skill.name}
                  onChange={(e) =>
                    setEditingSkill({
                      ...editingSkill,
                      skill: { ...editingSkill.skill, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm"
                  placeholder="e.g. TypeScript, Docker, PyTorch"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                    Category Tier
                  </label>
                  <select
                    value={editingSkill.categoryId}
                    onChange={(e) => setEditingSkill({ ...editingSkill, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm"
                  >
                    {skillCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                    Proficiency Level
                  </label>
                  <select
                    value={editingSkill.skill.level}
                    onChange={(e) =>
                      setEditingSkill({
                        ...editingSkill,
                        skill: { ...editingSkill.skill, level: e.target.value as any },
                      })
                    }
                    className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm"
                  >
                    <option value="Advanced">Advanced</option>
                    <option value="Proficient">Proficient</option>
                    <option value="Working Knowledge">Working Knowledge</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                  Supporting Context / Production Evidence
                </label>
                <textarea
                  rows={2}
                  value={editingSkill.skill.supportedBy}
                  onChange={(e) =>
                    setEditingSkill({
                      ...editingSkill,
                      skill: { ...editingSkill.skill, supportedBy: e.target.value },
                    })
                  }
                  placeholder="e.g. Distributed high-throughput architectures"
                  className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm"
                />
              </div>

              <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
                  className="px-4 py-2 border border-neutral-200 text-neutral-600 text-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-950 text-white text-xs font-mono uppercase"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Social Channel Editor Modal */}
      {editingSocial && (
        <div className="fixed inset-0 bg-neutral-950/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full border border-neutral-200 p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-serif font-light text-neutral-950 pb-2 border-b border-neutral-100">
              {isNewSocial ? 'Add Social Channel' : `Edit: ${editingSocial.platform}`}
            </h3>
            <form onSubmit={handleSaveSocialModal} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                  Platform Name
                </label>
                <input
                  type="text"
                  required
                  value={editingSocial.platform}
                  onChange={(e) => setEditingSocial({ ...editingSocial, platform: e.target.value })}
                  placeholder="e.g. GitHub, LinkedIn, Substack, YouTube"
                  className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                  Display Label
                </label>
                <input
                  type="text"
                  required
                  value={editingSocial.label}
                  onChange={(e) => setEditingSocial({ ...editingSocial, label: e.target.value })}
                  placeholder="e.g. github.com/username or LinkedIn Profile"
                  className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                  Channel URL
                </label>
                <input
                  type="url"
                  required
                  value={editingSocial.url}
                  onChange={(e) => setEditingSocial({ ...editingSocial, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="social-enabled-toggle"
                  checked={editingSocial.isEnabled !== false}
                  onChange={(e) => setEditingSocial({ ...editingSocial, isEnabled: e.target.checked })}
                  className="w-4 h-4 rounded border-neutral-300 text-neutral-950 focus:ring-0"
                />
                <label htmlFor="social-enabled-toggle" className="text-xs font-mono text-neutral-700">
                  Visible on public portfolio header & footer
                </label>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSocial(null)}
                  className="px-4 py-2 border border-neutral-200 text-neutral-600 text-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-950 text-white text-xs font-mono uppercase"
                >
                  Save Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Supabase Auth Connect Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-neutral-950/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full border border-neutral-200 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#B8934A]" />
                <h3 className="text-lg font-serif font-light text-neutral-950">
                  {authModalMode === 'login' ? 'Supabase Admin Sign In' : 'Create Supabase Admin Account'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="text-neutral-400 hover:text-neutral-900 text-xs font-mono uppercase"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Authenticate directly with your configured Supabase project. An active authenticated session satisfies storage and database RLS policies.
            </p>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
                {authError}
              </div>
            )}

            <form onSubmit={handleSupabaseAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-[#FAF9F7] border border-neutral-200 text-sm font-mono"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode(authModalMode === 'login' ? 'signup' : 'login');
                    setAuthError(null);
                  }}
                  className="text-[#B8934A] hover:underline"
                >
                  {authModalMode === 'login' ? 'Need to create an account? Sign Up' : 'Already registered? Sign In'}
                </button>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="px-4 py-2 border border-neutral-200 text-neutral-600 text-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="px-5 py-2 bg-neutral-950 text-white text-xs font-mono uppercase disabled:opacity-50"
                >
                  {authLoading
                    ? 'Authenticating...'
                    : authModalMode === 'login'
                    ? 'Sign In to Supabase'
                    : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Non-blocking In-App Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-neutral-950/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full border border-neutral-300 p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-red-50 text-red-600 rounded-full shrink-0 mt-0.5 border border-red-100">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-serif font-medium text-neutral-950">
                  {confirmModal.title}
                </h3>
                <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                  {confirmModal.message}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 border border-neutral-200 text-neutral-600 hover:bg-neutral-50 text-xs font-mono uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const onConfirm = confirmModal.onConfirm;
                  setConfirmModal(null);
                  await onConfirm();
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-mono uppercase tracking-wider transition-colors shadow-xs"
              >
                {confirmModal.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
