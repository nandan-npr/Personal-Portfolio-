import { createClient } from '@supabase/supabase-js';

const url = 'https://hzsfxmocguvlxtiybxih.supabase.co';
const key = 'sb_publishable_E8xXJKVNuIv9UiBO1YyRRA_r3nAMski';

const supabase = createClient(url, key);

async function testTables() {
  const variations = [
    'profile',
    'profiles',
    'portfolio',
    'portfolios',
    'user',
    'users',
    'education',
    'educations',
    'skill',
    'skills',
    'project',
    'projects',
    'experience',
    'experiences',
    'certification',
    'certifications',
    'social',
    'social_links',
    'social_link',
    'resume',
    'resumes',
    'resume_files',
    'site_settings',
    'settings',
    'about',
    'about_content',
    'homepage',
    'homepage_content',
    'recruiter',
    'recruiter_content',
    'seo',
    'seo_settings'
  ];

  for (const table of variations) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (!error) {
      console.log(`FOUND TABLE: ${table}`, data);
    } else if (error.code !== 'PGRST205') {
      console.log(`DIFFERENT ERROR for ${table}:`, error.code, error.message);
    }
  }
  console.log('Checked all variations.');
}

testTables();
