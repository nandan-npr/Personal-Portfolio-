import { useState, useEffect } from 'react';
import { portfolioService } from '../services/portfolioService';

function getSnapshot() {
  return {
    profile: portfolioService.getProfile(),
    homepage: portfolioService.getHomepage(),
    about: portfolioService.getAbout(),
    projects: portfolioService.getProjects(),
    experiences: portfolioService.getExperiences(),
    skillCategories: portfolioService.getSkillCategories(),
    certifications: portfolioService.getCertifications(),
    education: portfolioService.getEducation(),
    recruiter: portfolioService.getRecruiter(),
    seo: portfolioService.getSeo(),
    resumeInfo: portfolioService.getResumeInfo(),
    socialLinks: portfolioService.getSocialLinks(),
    siteSettings: portfolioService.getSiteSettings(),
    revision: portfolioService.getRevision(),
    service: portfolioService,
  };
}

export function usePortfolio() {
  const [data, setData] = useState(getSnapshot);

  useEffect(() => {
    const unsubscribe = portfolioService.subscribe(() => {
      setData(getSnapshot());
    });
    return unsubscribe;
  }, []);

  return data;
}

