import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

export interface AdminUser {
  email: string;
  id: string;
}

export const ADMIN_EMAIL = 'nandanpruthvi1@gmail.com';

class AuthService {
  private currentUser: AdminUser | null = null;
  private listeners: Set<() => void> = new Set();
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private async init() {
    await this.checkSession();
    this.initAuthListener();
    this.isInitialized = true;
  }

  private initAuthListener() {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabaseClient();
    if (!supabase) return;

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user?.email) {
        const email = session.user.email.toLowerCase();
        if (email === ADMIN_EMAIL.toLowerCase()) {
          this.currentUser = {
            email: session.user.email,
            id: session.user.id,
          };
        } else {
          // Reject any non-admin email
          await supabase.auth.signOut();
          this.currentUser = null;
        }
      } else if (event === 'SIGNED_OUT' || !session) {
        this.currentUser = null;
      }
      this.notify();
    });
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  /**
   * Directly verifies actual Supabase Auth session via getSession() and getUser().
   * Does NOT use custom admin flags, localStorage mock keys, or mock bypasses.
   */
  public async checkSession(): Promise<AdminUser | null> {
    if (!isSupabaseConfigured()) {
      this.currentUser = null;
      this.notify();
      return null;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      this.currentUser = null;
      this.notify();
      return null;
    }

    try {
      const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
      if (sessionErr || !sessionData.session) {
        this.currentUser = null;
        this.notify();
        return null;
      }

      // Verify authentic user from Supabase server
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData.user || !userData.user.email) {
        this.currentUser = null;
        this.notify();
        return null;
      }

      const email = userData.user.email.toLowerCase();
      if (email !== ADMIN_EMAIL.toLowerCase()) {
        await supabase.auth.signOut();
        this.currentUser = null;
        this.notify();
        return null;
      }

      this.currentUser = {
        email: userData.user.email,
        id: userData.user.id,
      };
      this.notify();
      return this.currentUser;
    } catch {
      this.currentUser = null;
      this.notify();
      return null;
    }
  }

  public getUser(): AdminUser | null {
    return this.currentUser;
  }

  /**
   * Only returns true if a verified Supabase Auth session exists for the admin email.
   */
  public isAuthenticated(): boolean {
    return Boolean(
      this.currentUser &&
      this.currentUser.id &&
      this.currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
    );
  }

  public isSupabaseAuthenticated(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Signs in via Supabase Auth signInWithPassword().
   * No mock bypasses, no hardcoded passwords, no fake success states.
   */
  public async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedEmail !== ADMIN_EMAIL.toLowerCase()) {
      return {
        success: false,
        error: `Access restricted: Only the designated portfolio administrator (${ADMIN_EMAIL}) may authenticate.`,
      };
    }

    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Supabase URL and publishable key are not configured.',
      };
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client could not be initialized.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Invalid email or password.',
        };
      }

      if (!data.user) {
        return {
          success: false,
          error: 'Authentication failed: No user returned by Supabase.',
        };
      }

      this.currentUser = {
        email: data.user.email || trimmedEmail,
        id: data.user.id,
      };
      this.notify();
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'An unexpected error occurred during authentication.',
      };
    }
  }

  /**
   * One-time registration for the single admin account in Supabase Auth
   */
  public async signUpAdmin(password: string, email: string = ADMIN_EMAIL): Promise<{
    success: boolean;
    requiresEmailConfirmation?: boolean;
    error?: string;
    message?: string;
  }> {
    const targetEmail = (email || ADMIN_EMAIL).trim().toLowerCase();
    if (targetEmail !== ADMIN_EMAIL.toLowerCase()) {
      return {
        success: false,
        error: `Only the designated admin email (${ADMIN_EMAIL}) is permitted.`,
      };
    }

    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase credentials are not configured.' };
    }
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: 'Supabase client could not be initialized.' };

    try {
      const { data, error } = await supabase.auth.signUp({
        email: ADMIN_EMAIL,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.session && data.user) {
        this.currentUser = {
          email: data.user.email || ADMIN_EMAIL,
          id: data.user.id,
        };
        this.notify();
        return { success: true, message: 'Admin account created and authenticated.' };
      }

      return {
        success: true,
        requiresEmailConfirmation: true,
        message: `Admin registration submitted for ${ADMIN_EMAIL}. If email confirmation is enabled in your Supabase project settings, check your inbox or confirm the user in Supabase Dashboard > Authentication > Users, then sign in.`,
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to create admin account in Supabase.' };
    }
  }

  /**
   * Real Supabase signOut()
   */
  public async logout(): Promise<void> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase.auth.signOut();
        } catch {
          // ignore signout errors
        }
      }
    }
    this.currentUser = null;
    this.notify();
  }
}

export const authService = new AuthService();
