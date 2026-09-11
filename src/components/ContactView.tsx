import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { usePortfolio } from '../hooks/usePortfolio';
import {
  Mail,
  Phone,
  Linkedin,
  Github,
  Copy,
  Check,
  Send,
  ArrowUpRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { copyTextToClipboard, submitContactForm } from '../utils/contactUtils';

interface ContactViewProps {
  onOpenContactModal?: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onOpenContactModal }) => {
  const { profile, socialLinks } = usePortfolio();
  const contactEmail = profile?.email || PERSONAL_INFO.email;
  const contactPhone = profile?.phone || PERSONAL_INFO.phone;
  const linkedinUrl =
    (Array.isArray(socialLinks) && socialLinks.find((s) => s.platform.toLowerCase() === 'linkedin')?.url) ||
    PERSONAL_INFO.linkedin;
  const githubUrl =
    (Array.isArray(socialLinks) && socialLinks.find((s) => s.platform.toLowerCase() === 'github')?.url) ||
    PERSONAL_INFO.github;

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Direct Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [gotcha, setGotcha] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCopyEmail = async () => {
    const ok = await copyTextToClipboard(contactEmail);
    if (ok) {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const handleCopyPhone = async () => {
    const ok = await copyTextToClipboard(contactPhone);
    if (ok) {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2500);
    }
  };

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
    setTouched({ name: true, email: true, subject: true, message: true });

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

    const res = await submitContactForm({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      company: company.trim() || undefined,
      _gotcha: gotcha,
    });

    if (res.success) {
      setStatus('success');
      setName('');
      setEmail('');
      setSubject('');
      setCompany('');
      setMessage('');
      setTouched({});
    } else {
      setStatus('error');
      setErrorMessage(res.message || 'Please try again.');
    }
  };

  const scrollToComposer = () => {
    const el = document.getElementById('contact-direct-composer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      const input = document.getElementById('contact-form-name');
      if (input) input.focus();
    } else if (onOpenContactModal) {
      onOpenContactModal();
    }
  };

  return (
    <div className="w-full pt-28 pb-32">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Editorial Heading */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#B89047] block">
            06 // INITIATE DIALOGUE
          </span>
          <h2 className="font-serif-editorial text-3xl sm:text-5xl md:text-6xl font-light text-neutral-500 tracking-tight">
            HAVE A PROJECT, OPPORTUNITY, OR IDEA?
          </h2>
          <h1 className="font-serif-editorial text-5xl sm:text-7xl md:text-8xl font-normal text-[#111111] tracking-tight leading-[1.05]">
            LET'S TALK.
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 font-light max-w-xl mx-auto pt-2 leading-relaxed">
            I am actively evaluating full-time Software Engineer, Web Developer, and Data Analyst roles in Bengaluru, hybrid, and remote teams.
          </p>
        </div>

        {/* Primary Contact Action Hub */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {/* EMAIL ME Card */}
          <div className="p-6 border border-neutral-200 bg-white hover:border-[#B89047] transition-all flex flex-col justify-between min-h-[175px]">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#B89047] block mb-1">
                PRIMARY CONTACT
              </span>
              <h3 className="font-serif-editorial text-2xl text-[#111111]">
                EMAIL ME
              </h3>
              <p className="text-xs text-neutral-500 font-mono mt-1 truncate">
                {contactEmail}
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-4">
              <div className="flex items-center gap-2">
                <button
                  id="contact-email-me-btn"
                  onClick={onOpenContactModal || scrollToComposer}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-mono tracking-wider uppercase bg-[#111111] text-white hover:bg-[#B89047] transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>EMAIL ME</span>
                </button>

                <button
                  id="contact-copy-email-btn"
                  onClick={handleCopyEmail}
                  className="px-2.5 py-2 border border-neutral-300 text-neutral-700 hover:border-[#B89047] hover:text-[#111111] transition-colors text-[11px] font-mono inline-flex items-center gap-1"
                  title="Copy Email Address"
                  aria-label="Copy Email Address"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copiedEmail ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>

              {copiedEmail && (
                <span className="text-[10px] font-mono text-emerald-600 block text-center">
                  EMAIL COPIED
                </span>
              )}
            </div>
          </div>

          {/* LINKEDIN Button */}
          <a
            id="contact-linkedin-btn"
            href={linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="p-6 border border-neutral-200 bg-white hover:border-[#B89047] transition-all flex flex-col justify-between min-h-[175px] group"
          >
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block mb-1">
                PROFESSIONAL NETWORK
              </span>
              <h3 className="font-serif-editorial text-2xl text-[#111111] group-hover:text-[#B89047] transition-colors">
                LINKEDIN
              </h3>
              <p className="text-xs text-neutral-500 font-mono mt-1">
                {linkedinUrl.replace('https://www.linkedin.com', '').replace('https://linkedin.com', '') || '/in/nandan01'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono tracking-wider uppercase text-[#B89047] pt-4">
              <span>CONNECT ON LINKEDIN</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </a>

          {/* GITHUB Button */}
          <a
            id="contact-github-btn"
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="p-6 border border-neutral-200 bg-white hover:border-[#B89047] transition-all flex flex-col justify-between min-h-[175px] group"
          >
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block mb-1">
                SOURCE REPOSITORIES
              </span>
              <h3 className="font-serif-editorial text-2xl text-[#111111] group-hover:text-[#B89047] transition-colors">
                GITHUB
              </h3>
              <p className="text-xs text-neutral-500 font-mono mt-1">
                {githubUrl.replace('https://', '') || 'github.com/nandan-npr'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono tracking-wider uppercase text-[#B89047] pt-4">
              <span>EXPLORE CODE</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </a>

          {/* CALL Button */}
          <div className="p-6 border border-neutral-200 bg-white hover:border-[#B89047] transition-all flex flex-col justify-between min-h-[175px]">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block mb-1">
                DIRECT VOICE
              </span>
              <h3 className="font-serif-editorial text-2xl text-[#111111]">
                CALL DIRECT
              </h3>
              <p className="text-xs text-neutral-500 font-mono mt-1">
                {contactPhone}
              </p>
            </div>
            <div className="flex items-center gap-2 pt-4">
              <a
                id="contact-call-btn"
                href={`tel:${contactPhone}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-mono tracking-wider uppercase border border-neutral-300 text-neutral-800 hover:border-[#B89047] hover:text-[#111111] transition-colors"
              >
                <Phone className="w-3 h-3 text-[#B89047]" />
                <span>CALL NOW</span>
              </a>
              <button
                id="contact-copy-phone-btn"
                onClick={handleCopyPhone}
                className="p-2 border border-neutral-200 text-neutral-600 hover:border-[#B89047] hover:text-[#111111] transition-colors"
                title="Copy Phone Number"
                aria-label="Copy Phone Number"
              >
                {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            {copiedPhone && (
              <span className="text-[10px] font-mono text-emerald-600 mt-1 block text-center">
                PHONE COPIED
              </span>
            )}
          </div>
        </div>

        {/* Direct Functional Email Dispatch Composer */}
        <div id="contact-direct-composer" className="p-8 sm:p-12 border border-neutral-200 bg-white shadow-sm">
          <div className="mb-8">
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#B89047] block mb-1">
              DIRECT INBOX DISPATCH
            </span>
            <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#111111]">
              Compose an Opportunity Brief
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 font-light mt-1">
              Delivered directly to <span className="text-[#111111] font-semibold">{PERSONAL_INFO.email}</span>. No local mail client required.
            </p>
          </div>

          {/* Success Notification */}
          {status === 'success' ? (
            <div className="p-8 border border-neutral-200 bg-[#FAFAFA] text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full border-2 border-[#B89047] flex items-center justify-center bg-[#B89047]/10">
                <CheckCircle2 className="w-6 h-6 text-[#B89047]" />
              </div>
              <h4 className="font-serif-editorial text-2xl text-[#111111]">MESSAGE SENT</h4>
              <p className="text-sm text-neutral-600 font-light max-w-md mx-auto leading-relaxed">
                Thank you. Your message has been sent successfully to {PERSONAL_INFO.email}.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="inline-flex items-center gap-2 px-6 py-2 text-xs font-mono tracking-wider uppercase border border-neutral-300 text-neutral-700 hover:border-[#B89047] hover:text-[#111111] transition-colors"
              >
                <span>SEND ANOTHER MESSAGE</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Anti-spam honeypot */}
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

              {/* Error Notice */}
              {status === 'error' && (
                <div className="p-4 border border-rose-200 bg-rose-50/70 text-xs font-sans text-rose-900 space-y-1.5">
                  <div className="flex items-center gap-2 font-mono uppercase tracking-wider text-rose-800 font-semibold">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>MESSAGE COULD NOT BE SENT</span>
                  </div>
                  <p className="text-rose-700 leading-relaxed">{errorMessage}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-form-name" className="block text-xs font-mono tracking-wider uppercase text-neutral-600 mb-2">
                    Your Name <span className="text-[#B89047]">*</span>
                  </label>
                  <input
                    id="contact-form-name"
                    type="text"
                    required
                    value={name}
                    onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    disabled={status === 'submitting'}
                    className={`w-full px-4 py-3 bg-[#FAFAFA] border text-sm text-[#111111] placeholder:text-neutral-400 focus:outline-none transition-colors font-sans ${
                      nameError ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' : 'border-neutral-200 focus:border-[#B89047]'
                    }`}
                  />
                  {nameError && (
                    <p className="text-[11px] font-mono text-rose-600 mt-1">{nameError}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-form-email" className="block text-xs font-mono tracking-wider uppercase text-neutral-600 mb-2">
                    Your Email <span className="text-[#B89047]">*</span>
                  </label>
                  <input
                    id="contact-form-email"
                    type="email"
                    required
                    value={email}
                    onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alex@company.com"
                    disabled={status === 'submitting'}
                    className={`w-full px-4 py-3 bg-[#FAFAFA] border text-sm text-[#111111] placeholder:text-neutral-400 focus:outline-none transition-colors font-sans ${
                      emailError ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' : 'border-neutral-200 focus:border-[#B89047]'
                    }`}
                  />
                  {emailError && (
                    <p className="text-[11px] font-mono text-rose-600 mt-1">{emailError}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-form-subject" className="block text-xs font-mono tracking-wider uppercase text-neutral-600 mb-2">
                    Subject <span className="text-[#B89047]">*</span>
                  </label>
                  <input
                    id="contact-form-subject"
                    type="text"
                    required
                    value={subject}
                    onBlur={() => setTouched((prev) => ({ ...prev, subject: true }))}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Software Engineer / Data Analyst Position"
                    disabled={status === 'submitting'}
                    className={`w-full px-4 py-3 bg-[#FAFAFA] border text-sm text-[#111111] placeholder:text-neutral-400 focus:outline-none transition-colors font-sans ${
                      subjectError ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' : 'border-neutral-200 focus:border-[#B89047]'
                    }`}
                  />
                  {subjectError && (
                    <p className="text-[11px] font-mono text-rose-600 mt-1">{subjectError}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-form-company" className="block text-xs font-mono tracking-wider uppercase text-neutral-600 mb-2">
                    Company / Organization <span className="text-neutral-400 text-[10px]">(Optional)</span>
                  </label>
                  <input
                    id="contact-form-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Acme Innovations"
                    disabled={status === 'submitting'}
                    className="w-full px-4 py-3 bg-[#FAFAFA] border border-neutral-200 text-sm text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:border-[#B89047] transition-colors font-sans"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-form-message" className="block text-xs font-mono tracking-wider uppercase text-neutral-600 mb-2">
                  Message <span className="text-[#B89047]">*</span>
                </label>
                <textarea
                  id="contact-form-message"
                  required
                  rows={5}
                  value={message}
                  onBlur={() => setTouched((prev) => ({ ...prev, message: true }))}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hello Nandan,&#10;&#10;I came across your portfolio and would like to discuss an opportunity."
                  disabled={status === 'submitting'}
                  className={`w-full px-4 py-3 bg-[#FAFAFA] border text-sm text-[#111111] placeholder:text-neutral-400 focus:outline-none transition-colors resize-none font-sans ${
                    messageError ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' : 'border-neutral-200 focus:border-[#B89047]'
                  }`}
                />
                {messageError && (
                  <p className="text-[11px] font-mono text-rose-600 mt-1">{messageError}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-100">
                <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                  <button
                    id="contact-submit-mail-btn"
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase bg-[#111111] text-white hover:bg-[#B89047] transition-all duration-200 cursor-pointer disabled:opacity-60 shadow-xs"
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

                <span className="text-xs font-mono text-neutral-400">
                  Direct to {PERSONAL_INFO.email}
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
