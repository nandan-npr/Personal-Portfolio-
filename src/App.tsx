import React, { useState, useEffect } from 'react';
import { PageView, ProjectItem } from './types';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { AboutView } from './components/AboutView';
import { WorkView } from './components/WorkView';
import { ExperienceView } from './components/ExperienceView';
import { SkillsView } from './components/SkillsView';
import { SocialView } from './components/SocialView';
import { ContactView } from './components/ContactView';
import { RecruiterView } from './components/RecruiterView';
import { CertificatesView } from './components/CertificatesView';
import { NotFoundView } from './components/NotFoundView';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ResumeModal } from './components/ResumeModal';
import { ContactModal } from './components/ContactModal';
import { Footer } from './components/Footer';
import { ScrollProgress } from './components/ScrollProgress';
import { CustomCursor } from './components/CustomCursor';
import { InitialLoader } from './components/InitialLoader';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLogin } from './components/admin/AdminLogin';
import { authService } from './services/authService';

export default function App() {
  const [activeView, setActiveView] = useState<PageView>('home');
  const [adminSubView, setAdminSubView] = useState<'dashboard' | 'login'>('login');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(authService.isAuthenticated());
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Initial auth verification directly from Supabase session
  useEffect(() => {
    let mounted = true;
    const verifyAuth = async () => {
      try {
        const user = await authService.checkSession();
        if (mounted) {
          setIsAdminAuthenticated(Boolean(user));
        }
      } finally {
        if (mounted) {
          setIsCheckingAuth(false);
        }
      }
    };
    verifyAuth();

    const unsub = authService.subscribe(() => {
      setIsAdminAuthenticated(authService.isAuthenticated());
    });
    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  // Synchronize with URL pathname and hash for clean routes (/admin, /admin/login, /recruiter)
  useEffect(() => {
    const parseRoute = () => {
      const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
      const hash = window.location.hash.replace('#', '').toLowerCase();

      // Route: /admin/login or #admin/login
      if (path === 'admin/login' || hash === 'admin/login') {
        setActiveView('admin');
        setAdminSubView('login');
        return;
      }

      // Route: /admin or /admin/* or #admin
      if (path === 'admin' || path.startsWith('admin/') || hash === 'admin' || hash.startsWith('admin/')) {
        setActiveView('admin');
        setAdminSubView('dashboard');
        return;
      }

      if (path === 'recruiter' || hash === 'recruiter') {
        setActiveView('recruiter');
        return;
      }
      if (hash === 'resume') {
        setResumeModalOpen(true);
        return;
      }
      if (hash === 'email' || hash === 'contact-modal') {
        setContactModalOpen(true);
        return;
      }
      const validViews: PageView[] = ['home', 'about', 'work', 'experience', 'skills', 'certificates', 'social', 'contact', 'recruiter', 'admin'];
      if (validViews.includes(hash as PageView)) {
        setActiveView(hash as PageView);
      } else if (validViews.includes(path as PageView)) {
        setActiveView(path as PageView);
      } else if (hash.length > 0 && !validViews.includes(hash as PageView)) {
        setActiveView('notfound');
      }
    };

    parseRoute();
    window.addEventListener('hashchange', parseRoute);
    window.addEventListener('popstate', parseRoute);
    return () => {
      window.removeEventListener('hashchange', parseRoute);
      window.removeEventListener('popstate', parseRoute);
    };
  }, []);

  const handleNavigate = (view: PageView) => {
    setActiveView(view);
    if (view === 'recruiter') {
      window.history.pushState(null, '', '/recruiter');
    } else if (view === 'admin') {
      window.history.pushState(null, '', isAdminAuthenticated ? '/admin' : '/admin/login');
      setAdminSubView(isAdminAuthenticated ? 'dashboard' : 'login');
    } else if (view === 'home') {
      window.history.pushState(null, '', '/');
    } else if (view === 'notfound') {
      window.history.pushState(null, '', '/#404');
    } else {
      window.history.pushState(null, '', `/#${view}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenContact = (subject?: string) => {
    setContactSubject(subject || '');
    setContactModalOpen(true);
  };

  // Dedicated Admin routing with strict unauthenticated -> /admin/login redirect
  if (activeView === 'admin') {
    if (isCheckingAuth) {
      return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-mono text-xs text-neutral-500 uppercase tracking-widest">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#B8934A] animate-ping" />
            <span>Verifying Supabase Session...</span>
          </div>
        </div>
      );
    }

    // Unauthenticated user attempting to access /admin -> redirect to /admin/login
    if (!isAdminAuthenticated) {
      if (window.location.pathname !== '/admin/login' && window.location.hash !== '#admin/login') {
        window.history.replaceState(null, '', '/admin/login');
      }
      return (
        <AdminLogin
          onSuccess={() => {
            setIsAdminAuthenticated(true);
            setAdminSubView('dashboard');
            window.history.replaceState(null, '', '/admin');
          }}
          onBackToSite={() => handleNavigate('home')}
        />
      );
    }

    // Authenticated admin accessing /admin/login -> redirect to /admin
    if (adminSubView === 'login' || window.location.pathname === '/admin/login' || window.location.hash === '#admin/login') {
      window.history.replaceState(null, '', '/admin');
    }

    return (
      <AdminDashboard
        onBackToSite={() => handleNavigate('home')}
        onLogout={async () => {
          await authService.logout();
          setIsAdminAuthenticated(false);
          setAdminSubView('login');
          window.history.replaceState(null, '', '/admin/login');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] flex flex-col font-sans selection:bg-[#B89047]/20 selection:text-[#111111]">
      {/* 04: Minimal Initial Loading Sequence (Once per session) */}
      <InitialLoader />

      {/* 28: Reading Progress Indicator (Subtle Top Hairline) */}
      <ScrollProgress />

      {/* 07: Custom Minimalist Cursor (Desktop Pointer-Only) */}
      <CustomCursor />

      {/* Top Fixed Minimalist Navbar */}
      <Navbar
        activeView={activeView}
        onNavigate={handleNavigate}
        onOpenResume={() => setResumeModalOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-grow">
        {activeView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onSelectProject={(project) => setSelectedProject(project)}
            onOpenResume={() => setResumeModalOpen(true)}
            onOpenContact={() => handleOpenContact('Portfolio Inquiry — Software Engineer / Data Analyst')}
          />
        )}

        {activeView === 'about' && (
          <AboutView
            onNavigate={handleNavigate}
            onOpenResume={() => setResumeModalOpen(true)}
          />
        )}

        {activeView === 'work' && (
          <WorkView
            onSelectProject={(project) => setSelectedProject(project)}
          />
        )}

        {activeView === 'experience' && (
          <ExperienceView
            onNavigate={handleNavigate}
            onOpenResume={() => setResumeModalOpen(true)}
            onOpenContact={() => handleOpenContact('Role Inquiry / Discussion')}
          />
        )}

        {activeView === 'skills' && (
          <SkillsView
            onNavigate={handleNavigate}
          />
        )}

        {activeView === 'certificates' && (
          <CertificatesView
            onNavigate={handleNavigate}
            onOpenResume={() => setResumeModalOpen(true)}
          />
        )}

        {activeView === 'social' && (
          <SocialView
            onNavigate={handleNavigate}
            onOpenContact={() => handleOpenContact('Direct Message from Social Channel')}
          />
        )}

        {activeView === 'contact' && (
          <ContactView
            onOpenContactModal={() => handleOpenContact('Portfolio Opportunity')}
          />
        )}

        {activeView === 'recruiter' && (
          <RecruiterView
            onNavigate={handleNavigate}
            onOpenResume={() => setResumeModalOpen(true)}
            onOpenContact={(subject) => handleOpenContact(subject || 'Recruiter Inquiry — Candidate Profile')}
            onSelectProject={(project) => setSelectedProject(project)}
          />
        )}

        {activeView === 'notfound' && (
          <NotFoundView
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Executive Minimalist Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenResume={() => setResumeModalOpen(true)}
        onOpenContact={() => handleOpenContact('Direct Message from Footer')}
      />

      {/* Project Case Study Deep-Dive Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* A4 Executive Resume Modal */}
      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
      />

      {/* Real Email Dispatch Contact Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        defaultSubject={contactSubject}
      />
    </div>
  );
}
