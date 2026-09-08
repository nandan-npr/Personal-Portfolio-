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
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ResumeModal } from './components/ResumeModal';
import { Footer } from './components/Footer';

export default function App() {
  const [activeView, setActiveView] = useState<PageView>('home');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  // Synchronize with URL hash for browser history & shareable URLs
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'resume') {
        setResumeModalOpen(true);
        return;
      }
      const validViews: PageView[] = ['home', 'about', 'work', 'experience', 'skills', 'social', 'contact'];
      if (validViews.includes(hash as PageView)) {
        setActiveView(hash as PageView);
      }
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  const handleNavigate = (view: PageView) => {
    setActiveView(view);
    window.location.hash = view === 'home' ? '' : view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] flex flex-col font-sans selection:bg-[#B89047]/20 selection:text-[#111111]">
      {/* Top Fixed Minimalist Navbar */}
      <Navbar
        activeView={activeView}
        onNavigate={handleNavigate}
        onOpenResume={() => setResumeModalOpen(true)}
      />

      {/* Main Content View with Smooth Transition */}
      <main className="flex-grow">
        {activeView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onSelectProject={(project) => setSelectedProject(project)}
            onOpenResume={() => setResumeModalOpen(true)}
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
          />
        )}

        {activeView === 'skills' && (
          <SkillsView
            onNavigate={handleNavigate}
          />
        )}

        {activeView === 'social' && (
          <SocialView
            onNavigate={handleNavigate}
          />
        )}

        {activeView === 'contact' && (
          <ContactView />
        )}
      </main>

      {/* Executive Minimalist Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenResume={() => setResumeModalOpen(true)}
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
    </div>
  );
}
