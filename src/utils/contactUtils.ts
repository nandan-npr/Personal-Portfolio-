/**
 * Reliable clipboard copy utility with modern Clipboard API and fallback support
 * for iframes and older environments.
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  // Try modern navigator.clipboard first
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('navigator.clipboard.writeText failed, using fallback:', err);
    }
  }

  // Fallback using textarea + document.execCommand('copy')
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('execCommand copy failed:', err);
    return false;
  }
}

/**
 * Target recipient address for inquiries
 */
export const TARGET_INBOX_EMAIL = 'nandanpruthvi1@gmail.com';

let cachedAccessKey: string | null = null;

/**
 * Retrieves the Web3Forms access key from Vite environment or backend config.
 */
export async function getWeb3FormsAccessKey(): Promise<string | null> {
  if (cachedAccessKey) {
    return cachedAccessKey;
  }

  // 1. Check Vite build-time / injected environment variables
  const envKey =
    (import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined) ||
    (import.meta.env.WEB3FORMS_ACCESS_KEY as string | undefined);

  if (envKey && envKey.trim().length > 0) {
    cachedAccessKey = envKey.trim();
    return cachedAccessKey;
  }

  // 2. Query /api/config from server if running in full-stack container
  try {
    const res = await fetch('/api/config', {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (
        data?.web3FormsKey &&
        typeof data.web3FormsKey === 'string' &&
        data.web3FormsKey.trim().length > 0
      ) {
        cachedAccessKey = data.web3FormsKey.trim();
        return cachedAccessKey;
      }
    }
  } catch (err) {
    console.warn('[Web3Forms] Could not fetch key from /api/config:', err);
  }

  return null;
}

/**
 * Submits contact form data directly to Web3Forms official API endpoint.
 * Web3Forms free tier specifically requires client-side API execution.
 */
export async function submitContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  _gotcha?: string;
}): Promise<{ success: boolean; message: string; error?: string }> {
  // 1. Anti-bot honeypot check
  if (data._gotcha && data._gotcha.trim().length > 0) {
    return {
      success: true,
      message: 'Thank you. Your message has been delivered successfully.',
    };
  }

  // 2. Validate required fields
  const trimmedName = data.name.trim();
  const trimmedEmail = data.email.trim();
  const trimmedSubject = data.subject.trim();
  const trimmedMessage = data.message.trim();
  const trimmedCompany = data.company?.trim() || '';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedName || trimmedName.length < 2) {
    return {
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Please enter your name (minimum 2 characters).',
    };
  }
  if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
    return {
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Please enter a valid email address.',
    };
  }
  if (!trimmedSubject || trimmedSubject.length < 3) {
    return {
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Please enter a subject (minimum 3 characters).',
    };
  }
  if (!trimmedMessage || trimmedMessage.length < 10) {
    return {
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Please enter a message (minimum 10 characters).',
    };
  }

  // 3. Resolve Access Key
  const accessKey = await getWeb3FormsAccessKey();

  if (!accessKey) {
    console.error(
      '[Web3Forms Config]: WEB3FORMS_ACCESS_KEY is missing or invalid. Please configure WEB3FORMS_ACCESS_KEY in AI Studio Settings / Secrets.'
    );
    return {
      success: false,
      error: 'CONFIG_MISSING',
      message: 'WEB3FORMS_ACCESS_KEY is missing or invalid.',
    };
  }

  // 4. Submit to Web3Forms API
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
        name: trimmedName,
        email: trimmedEmail,
        subject: `[Portfolio Inquiry] ${trimmedSubject} — from ${trimmedName}`,
        message: trimmedMessage,
        company: trimmedCompany || undefined,
        from_name: `${trimmedName} (Portfolio)`,
        replyto: trimmedEmail,
        botcheck: data._gotcha || '',
      }),
    });

    const result = await response.json().catch(() => null);

    if (response.ok && result?.success) {
      return {
        success: true,
        message: 'Thank you. Your message has been delivered successfully.',
      };
    }

    // Diagnostic logging for development and inspection
    console.error('[Web3Forms Submission Error]:', {
      status: response.status,
      statusText: response.statusText,
      result,
    });

    return {
      success: false,
      error: 'DELIVERY_FAILED',
      message:
        result?.message ||
        'Something went wrong while delivering your message. Please try again.',
    };
  } catch (err) {
    console.error('[Web3Forms Network Error]:', err);
    return {
      success: false,
      error: 'NETWORK_ERROR',
      message:
        'Something went wrong while delivering your message. Please try again.',
    };
  }
}
