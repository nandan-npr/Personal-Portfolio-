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
 * Builds a properly encoded mailto URL
 */
export function buildMailtoUrl(email: string, subject?: string, body?: string): string {
  let url = `mailto:${encodeURIComponent(email)}`;
  const params: string[] = [];

  if (subject && subject.trim()) {
    params.push(`subject=${encodeURIComponent(subject.trim())}`);
  }
  if (body && body.trim()) {
    params.push(`body=${encodeURIComponent(body.trim())}`);
  }

  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }

  return url;
}

/**
 * Triggers mailto opening reliably across iframes, mobile devices, and standard browsers
 */
export function triggerMailto(email: string, subject?: string, body?: string): void {
  const url = buildMailtoUrl(email, subject, body);

  try {
    // Creating and clicking an anchor with target="_top" ensures mailto opens
    // even if embedded inside sandboxed iframes
    const link = document.createElement('a');
    link.href = url;
    link.target = '_top';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch {
    window.location.href = url;
  }
}
