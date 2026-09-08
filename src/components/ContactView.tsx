import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Mail, Phone, Linkedin, Github, Copy, Check, Send, ArrowUpRight, ExternalLink } from 'lucide-react';
import { copyTextToClipboard, buildMailtoUrl, triggerMailto } from '../utils/contactUtils';

export const ContactView: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const defaultSubject = 'Portfolio Opportunity';
  const defaultMessage = 'Hello Nandan,\n\nI came across your portfolio and would like to discuss an opportunity.';

  const handleCopyEmail = async () => {
    const ok = await copyTextToClipboard(PERSONAL_INFO.email);
    if (ok) {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const handleCopyPhone = async () => {
    const ok = await copyTextToClipboard(PERSONAL_INFO.phone);
    if (ok) {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2500);
    }
  };

  const currentMailtoUrl = buildMailtoUrl(
    PERSONAL_INFO.email,
    subject.trim() || defaultSubject,
    message.trim() || defaultMessage
  );

  const handleSendMail = (e: React.FormEvent) => {
    e.preventDefault();
    triggerMailto(
      PERSONAL_INFO.email,
      subject.trim() || defaultSubject,
      message.trim() || defaultMessage
    );
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
                {PERSONAL_INFO.email}
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-4">
              <div className="flex items-center gap-2">
                <a
                  id="contact-email-me-btn"
                  href={`mailto:${PERSONAL_INFO.email}`}
                  onClick={() => triggerMailto(PERSONAL_INFO.email, 'Portfolio Opportunity')}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-mono tracking-wider uppercase bg-[#111111] text-white hover:bg-[#B89047] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>EMAIL ME</span>
                </a>

                <button
                  id="contact-copy-email-btn"
                  onClick={handleCopyEmail}
                  className="px-2.5 py-2 border border-neutral-300 text-neutral-700 hover:border-[#B89047] hover:text-[#111111] transition-colors text-[11px] font-mono inline-flex items-center gap-1"
                  title="Copy Email Address"
                  aria-label="Copy Email Address"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copiedEmail ? 'EMAIL COPIED' : 'COPY EMAIL'}</span>
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
            href={PERSONAL_INFO.linkedin}
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
                /in/nandan01
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
            href={PERSONAL_INFO.github}
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
                github.com/nandan-npr
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
                {PERSONAL_INFO.phoneDisplay}
              </p>
            </div>
            <div className="flex items-center gap-2 pt-4">
              <a
                id="contact-call-btn"
                href={`tel:${PERSONAL_INFO.phone}`}
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
        <div className="p-8 sm:p-12 border border-neutral-200 bg-white shadow-sm">
          <div className="mb-8">
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#B89047] block mb-1">
              DIRECT INBOX DISPATCH
            </span>
            <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#111111]">
              Compose an Opportunity Brief
            </h3>
            <p className="text-xs text-neutral-500 font-mono mt-1">
              Opening directly in your default mail client to <span className="text-[#111111] font-semibold">{PERSONAL_INFO.email}</span>
            </p>
          </div>

          <form onSubmit={handleSendMail} className="space-y-6">
            <div>
              <label htmlFor="contact-subject" className="block text-xs font-mono tracking-wider uppercase text-neutral-600 mb-2">
                Subject
              </label>
              <input
                id="contact-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Portfolio Opportunity"
                className="w-full px-4 py-3 bg-[#FAFAFA] border border-neutral-200 text-sm text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:border-[#B89047] transition-colors font-sans"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-mono tracking-wider uppercase text-neutral-600 mb-2">
                Message
              </label>
              <textarea
                id="contact-message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hello Nandan,&#10;&#10;I came across your portfolio and would like to discuss an opportunity."
                className="w-full px-4 py-3 bg-[#FAFAFA] border border-neutral-200 text-sm text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:border-[#B89047] transition-colors resize-none font-sans"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-100">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button
                  id="contact-submit-mail-btn"
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase bg-[#111111] text-white hover:bg-[#B89047] transition-all duration-200"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>LAUNCH EMAIL CLIENT</span>
                </button>

                <a
                  id="contact-direct-mailto-link"
                  href={currentMailtoUrl}
                  className="inline-flex items-center gap-1 text-xs font-mono text-neutral-500 hover:text-[#B89047] transition-colors py-2 px-1"
                >
                  <span>Direct mailto link</span>
                  <ExternalLink className="w-3 h-3 text-[#B89047]" />
                </a>
              </div>

              <span className="text-xs font-mono text-neutral-400">
                Direct to {PERSONAL_INFO.email}
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
