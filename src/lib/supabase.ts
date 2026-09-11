import { createClient, SupabaseClient } from '@supabase/supabase-js';

function normalizeSupabaseUrl(url: string): string {
  if (!url) return '';
  let cleaned = url.trim();
  // Strip REST endpoint or trailing slash if entered (e.g. /rest/v1/)
  cleaned = cleaned.replace(/\/rest\/v1\/?$/i, '');
  cleaned = cleaned.replace(/\/+$/, '');
  return cleaned;
}

const rawEnvUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://hzsfxmocguvlxtiybxih.supabase.co';
const rawEnvKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'sb_publishable_E8xXJKVNuIv9UiBO1YyRRA_r3nAMski';

export const getSupabaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem('supabase_url_override');
    if (override) return normalizeSupabaseUrl(override);
  }
  return normalizeSupabaseUrl(rawEnvUrl);
};

export const getSupabaseAnonKey = (): string => {
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem('supabase_anon_key_override');
    if (override) return override.trim();
  }
  return rawEnvKey.trim();
};

export const isSupabaseConfigured = (): boolean => {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return Boolean(
    url &&
    key &&
    url.startsWith('http') &&
    key.length > 10
  );
};

// Lazy / safe initialization so app never crashes if variables are missing
let clientInstance: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const currentUrl = getSupabaseUrl();
  const currentKey = getSupabaseAnonKey();

  if (!clientInstance || lastUrl !== currentUrl || lastKey !== currentKey) {
    lastUrl = currentUrl;
    lastKey = currentKey;
    clientInstance = createClient(currentUrl, currentKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
    });
  }
  return clientInstance;
};

// Direct client proxy for convenience
export const supabase = getSupabaseClient();

