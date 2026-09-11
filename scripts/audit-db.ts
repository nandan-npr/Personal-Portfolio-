import { createClient } from '@supabase/supabase-js';

const url = 'https://hzsfxmocguvlxtiybxih.supabase.co';
const key = 'sb_publishable_E8xXJKVNuIv9UiBO1YyRRA_r3nAMski';

const supabase = createClient(url, key);

const tablesToCheck = [
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
  'site_settings',
  'resume_files',
];

async function runAudit() {
  console.log('=== AUDITING SUPABASE DATABASE ===');
  console.log('URL:', url);

  const results: Record<string, any> = {};

  for (const table of tablesToCheck) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: false })
        .limit(2);

      if (error) {
        results[table] = {
          status: 'MISSING or ERROR',
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        };
      } else {
        results[table] = {
          status: 'EXISTS',
          rowCount: count,
          sampleRow: data?.[0] ? Object.keys(data[0]) : 'empty (no rows yet)',
        };
      }
    } catch (e: any) {
      results[table] = { status: 'EXCEPTION', error: e.message };
    }
  }

  console.log('\n--- TABLE AUDIT RESULTS ---');
  for (const [tbl, res] of Object.entries(results)) {
    console.log(tbl, JSON.stringify(res, null, 2));
  }

  console.log('\n--- STORAGE BUCKETS AUDIT ---');
  try {
    const { data: buckets, error: bError } = await supabase.storage.listBuckets();
    if (bError) {
      console.log('Buckets list error:', bError);
    } else {
      console.log('Buckets found:', buckets?.map(b => ({ id: b.id, name: b.name, public: b.public })));
    }
  } catch (e: any) {
    console.log('Bucket check exception:', e.message);
  }

  console.log('\n--- CHECKING OPENAPI / REST ROOT SCHEMA ---');
  try {
    const res = await fetch(`${url}/rest/v1/?apikey=${key}`);
    const openapi = await res.json();
    console.log('PostgREST Title/Version:', openapi.info?.title, openapi.info?.version);
    console.log('Available definitions in schema cache:', Object.keys(openapi.definitions || {}));
  } catch (e: any) {
    console.log('OpenAPI fetch exception:', e.message);
  }
}

runAudit();
