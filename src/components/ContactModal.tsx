import React, { useState, useEffect } from 'react';
import { X, Mail, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { submitContactForm } from '../utils/contactUtils';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  defaultSubject = '',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(defaultSubject);
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [gotcha, setGotcha] = useState(''); // Honeypot

  // Validation errors
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Sync subject when modal opens with new defaultSubject
  useEffect(() => {
    if (isOpen) {
      if (defaultSubject) {
        setSubject(defaultSubject);
      }
      setStatus('idle');
      setErrorMessage('');
    }
  }, [isOpen, defaultSubject]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && status !== 'submitting') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, status, onClose]);

  if (!isOpen) return null;

  // Validation rules
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameError = touched.name && name.trim().length < 2 ? 'Please enter your name.' : '';
  const emailError =
    touched.email && !emailRegex.test(email.trim()) ? 'Please enter a valid email address.' : '';
  const subjectError =
    touched.subject && subject.trim().length < 3 ? 'Please enter a subject.' : '';
  const messageError =
    touched.message && message.trim().length < 10
      ? 'Please enter a message (minimum 10 characters).'
      : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({ name: true, email: true, subject: true, message: true });

    // Validate
    if (
      name.trim().length < 2 ||
      !emailRegex.test(email.trim()) ||
      subject.trim().length < 3 ||
      message.trim().length < 10
    ) {
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    const result = await submitContactForm({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      company: company.trim() || undefined,
      _gotcha: gotcha,
    });

    if (result.success) {
      setStatus('success');
      // Reset form fields
      setName('');
      setEmail('');
      setSubject('');
      setCompany('');
      setMessage('');
      setTouched({});

      // Auto-close after 3.5 seconds so visitor can clearly read confirmation
      setTimeout(() => {
        onClose();
      }, 3500);
    } else {
      setStatus('error');
      setErrorMessage(result.message || 'Please try again.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      onClick={() => {
        if (status !== 'submitting') onClose();
      }}
    >
      <div
        className="relative w-full max-w-xl bg-white border border-neutral-200 shadow-2xl overflow-hidden my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Minimalist Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-neutral-200 bg-[#FAFAFA]">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#B89047]">
              COMMUNICATION // DISPATCH
            </span>
            <span className="w-1 h-1 rounded-full bg-neutral-300" />
            <span className="text-[11px] font-mono text-neutral-400">DIRECT INBOX</span>
          </div>

          <button
            onClick={onClose}
            disabled={status === 'submitting'}
            className="p-1.5 text-neutral-400 hover:text-[#111111] hover:bg-neutral-100 transition-colors focus:outline-none disabled:opacity-40"
            aria-label="Close Contact Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Container */}
        <div className="p-6 sm:p-8">
          {status === 'success' ? (
            /* Success State */
            <div className="text-center py-10 space-y-5">
              <div className="w-14 h-14 mx-auto rounded-full border-2 border-[#B89047] flex items-center justify-center bg-[#B89047]/10">
                <CheckCircle2 className="w-7 h-7 text-[#B89047]" />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#B89047] block">
                  DELIVERY CONFIRMED
                </span>
                <h3
                  id="contact-modal-title"
                  className="font-serif-editorial text-3xl sm:text-4xl text-[#111111]"
                >
                  MESSAGE SENT
                </h3>
                <p className="text-sm text-neutral-600 font-light max-w-md mx-auto pt-1 leading-relaxed">
                  Thank you. Your message has been sent successfully to{' '}
                  <span className="font-mono text-[#111111] font-medium">{PERSONAL_INFO.email}</span>.
                </p>
                <p className="text-xs text-neutral-400 font-mono pt-1">
                  I will review your inquiry and respond directly to your inbox shortly.
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 text-xs font-mono tracking-[0.18em] uppercase bg-[#111111] text-white hover:bg-[#B89047] transition-colors"
                >
                  CLOSE WINDOW
                </button>
              </div>
            </div>
          ) : (
            /* Form View */
            <div>
              <div className="mb-6">
                <h3
                  id="contact-modal-title"
                  className="font-serif-editorial text-2xl sm:text-3xl text-[#111111] tracking-tight"
                >
                  Send a Direct Message
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 font-light mt-1">
                  Delivers straight to <span className="font-mono text-neutral-800">{PERSONAL_INFO.email}</span> without requiring your local email client.
                </p>
              </div>

              {/* Error Notice */}
              {status === 'error' && (
                <div className="mb-6 p-4 border border-rose-200 bg-rose-50/70 text-xs font-sans text-rose-900 space-y-1.5">
                  <div className="flex items-center gap-2 font-mono uppercase tracking-wider text-rose-800 font-semibold">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>MESSAGE COULD NOT BE SENT</span>
                  </div>
                  <p className="text-rose-700 leading-relaxed">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Anti-spam honeypot hidden field */}
                <input
                  type="text"
                  name="_gotcha"
                  value={gotcha}
                  onChange={(e) => setGotcha(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="modal-contact-name"
                      className="block text-[11px] font-mono tracking-wider uppercase text-neutral-700 mb-1.5"
                    >
                      Your Name <span className="text-[#B89047]">*</span>
                    </label>
                    <input
                      id="modal-contact-name"
                      type="text"
                      required
                      value={name}
                      onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      disabled={status === 'submitting'}
                      className={`w-full px-3.5 py-2.5 bg-white border text-sm text-[#111111] placeholder:text-neutral-400 focus:outline-none transition-colors ${
                        nameError
                          ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20'
                          : 'border-neutral-300 focus:border-[#B89047]'
                      }`}
                    />
                    {nameError && (
                      <p className="text-[11px] font-mono text-rose-600 mt-1">{nameError}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="modal-contact-email"
                      className="block text-[11px] font-mono tracking-wider uppercase text-neutral-700 mb-1.5"
                    >
                      Your Email <span className="text-[#B89047]">*</span>
                    </label>
                    <input
                      id="modal-contact-email"
                      type="email"
                      required
                      value={email}
                      onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. alex@example.com"
                      disabled={status === 'submitting'}
                      className={`w-full px-3.5 py-2.5 bg-white border text-sm text-[#111111] placeholder:text-neutral-400 focus:outline-none transition-colors ${
                        emailError
                          ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20'
                          : 'border-neutral-300 focus:border-[#B89047]'
                      }`}
                    />
                    {emailError && (
                      <p className="text-[11px] font-mono text-rose-600 mt-1">{emailError}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="modal-contact-subject"
                      className="block text-[11px] font-mono tracking-wider uppercase text-neutral-700 mb-1.5"
                    >
                      Subject <span className="text-[#B89047]">*</span>
                    </label>
                    <input
                      id="modal-contact-subject"
                      type="text"
                      required
                      value={subject}
                      onBlur={() => setTouched((prev) => ({ ...prev, subject: true }))}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Software Engineer Role / Project"
                      disabled={status === 'submitting'}
                      className={`w-full px-3.5 py-2.5 bg-white border text-sm text-[#111111] placeholder:text-neutral-400 focus:outline-none transition-colors ${
                        subjectError
                          ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20'
                          : 'border-neutral-300 focus:border-[#B89047]'
                      }`}
                    />
                    {subjectError && (
                      <p className="text-[11px] font-mono text-rose-600 mt-1">{subjectError}</p>
                    )}
                  </div>

                  {/* Company (Optional) */}
                  <div>
                    <label
                      htmlFor="modal-contact-company"
                      className="block text-[11px] font-mono tracking-wider uppercase text-neutral-700 mb-1.5"
                    >
                      Company / Organization <span className="text-neutral-400 text-[10px]">(Optional)</span>
                    </label>
                    <input
                      id="modal-contact-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Acme Tech"
                      disabled={status === 'submitting'}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 text-sm text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:border-[#B89047] transition-colors"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="modal-contact-message"
                    className="block text-[11px] font-mono tracking-wider uppercase text-neutral-700 mb-1.5"
                  >
                    Message <span className="text-[#B89047]">*</span>
                  </label>
                  <textarea
                    id="modal-contact-message"
                    required
                    rows={4}
                    value={message}
                    onBlur={() => setTouched((prev) => ({ ...prev, message: true }))}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hello Nandan,&#10;&#10;I came across your portfolio and would like to discuss an opportunity..."
                    disabled={status === 'submitting'}
                    className={`w-full px-3.5 py-2.5 bg-white border text-sm text-[#111111] placeholder:text-neutral-400 focus:outline-none transition-colors font-sans resize-none ${
                      messageError
                        ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20'
                        : 'border-neutral-300 focus:border-[#B89047]'
                    }`}
                  />
                  {messageError && (
                    <p className="text-[11px] font-mono text-rose-600 mt-1">{messageError}</p>
                  )}
                </div>

                {/* Submit Action Bar */}
                <div className="pt-3 border-t border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-[11px] font-mono text-neutral-400 text-center sm:text-left">
                    ⚡ Reply-To sets automatically to your email
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={status === 'submitting'}
                      className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-mono tracking-wider uppercase border border-neutral-300 text-neutral-600 hover:text-[#111111] hover:border-neutral-400 transition-colors"
                    >
                      CANCEL
                    </button>

                    <button
                      id="modal-submit-message-btn"
                      type="submit"
                      disabled={status === 'submitting'}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold tracking-[0.18em] uppercase bg-[#111111] text-white hover:bg-[#B89047] transition-all disabled:opacity-60 cursor-pointer shadow-xs"
                    >
                      {status === 'submitting' ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>SENDING...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-[#B89047]" />
                          <span>SEND MESSAGE</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
