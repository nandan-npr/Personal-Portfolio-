import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ArrowUpRight, Copy, Check, Mail, Phone, Linkedin, Github } from 'lucide-react';
import { PageView } from '../types';
import { copyTextToClipboard, triggerMailto } from '../utils/contactUtils';

interface SocialViewProps {
  onNavigate: (view: PageView) => void;
}

export const SocialView: React.FC<SocialViewProps> = ({ onNavigate }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

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

  return (
    <div className="w-full pt-28 pb-28">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-20 pb-8 border-b border-neutral-200">
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#B89047] block mb-3">
            DIRECTORY // DIGITAL CHANNELS
          </span>
          <h1 className="font-serif-editorial text-5xl sm:text-7xl md:text-8xl font-normal text-[#111111] tracking-tight leading-[1.05]">
            LET'S CONNECT.
          </h1>
          <p className="text-base sm:text-lg text-neutral-500 font-light mt-6 max-w-xl leading-relaxed">
            Direct communication channels for engineering opportunities, technical discussions, and professional inquiries.
          </p>
        </div>

        {/* Channels Grid — Clean Architectural Editorial Lines */}
        <div className="space-y-6">
          {/* LinkedIn Link */}
          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noreferrer"
            className="group block p-8 sm:p-10 border border-neutral-200 bg-white hover:border-[#B89047] transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 border border-neutral-200 flex items-center justify-center text-neutral-800 group-hover:border-[#B89047] group-hover:text-[#B89047] transition-colors">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-400 block">
                    PROFESSIONAL PROFILE
                  </span>
                  <h3 className="font-serif-editorial text-3xl text-[#111111] group-hover:text-[#B89047] transition-colors">
                    LINKEDIN
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#B89047] tracking-widest uppercase">
                <span>VIEW PROFILE</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </div>
            <p className="text-xs text-neutral-400 font-mono mt-4 pt-4 border-t border-neutral-100">
              {PERSONAL_INFO.linkedin}
            </p>
          </a>

          {/* GitHub Link */}
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noreferrer"
            className="group block p-8 sm:p-10 border border-neutral-200 bg-white hover:border-[#B89047] transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 border border-neutral-200 flex items-center justify-center text-neutral-800 group-hover:border-[#B89047] group-hover:text-[#B89047] transition-colors">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-400 block">
                    CODE REPOSITORIES & OSS
                  </span>
                  <h3 className="font-serif-editorial text-3xl text-[#111111] group-hover:text-[#B89047] transition-colors">
                    GITHUB
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#B89047] tracking-widest uppercase">
                <span>VIEW REPOSITORIES</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </div>
            <p className="text-xs text-neutral-400 font-mono mt-4 pt-4 border-t border-neutral-100">
              {PERSONAL_INFO.github}
            </p>
          </a>

          {/* Email Channel */}
          <div className="p-8 sm:p-10 border border-neutral-200 bg-white hover:border-[#B89047] transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 border border-neutral-200 flex items-center justify-center text-neutral-800">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-400 block">
                    DIRECT INBOX
                  </span>
                  <h3 className="font-serif-editorial text-3xl text-[#111111]">
                    EMAIL
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  id="social-copy-email-btn"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono tracking-wider uppercase border border-neutral-200 hover:border-[#B89047] transition-colors"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'EMAIL COPIED' : 'COPY EMAIL'}</span>
                </button>

                <a
                  id="social-send-email-btn"
                  href={`mailto:${PERSONAL_INFO.email}`}
                  onClick={() => triggerMailto(PERSONAL_INFO.email, 'Engineering Opportunity')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono tracking-wider uppercase bg-[#111111] text-white hover:bg-[#B89047] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>EMAIL ME</span>
                </a>
              </div>
            </div>
            <p className="text-xs text-neutral-400 font-mono mt-4 pt-4 border-t border-neutral-100">
              {PERSONAL_INFO.email}
            </p>
          </div>

          {/* Phone Channel */}
          <div className="p-8 sm:p-10 border border-neutral-200 bg-white hover:border-[#B89047] transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 border border-neutral-200 flex items-center justify-center text-neutral-800">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-400 block">
                    DIRECT VOICE / WHATSAPP
                  </span>
                  <h3 className="font-serif-editorial text-3xl text-[#111111]">
                    PHONE
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopyPhone}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono tracking-wider uppercase border border-neutral-200 hover:border-[#B89047] transition-colors"
                >
                  {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPhone ? 'PHONE COPIED' : 'COPY PHONE'}</span>
                </button>

                <a
                  href={`tel:${PERSONAL_INFO.phone}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono tracking-wider uppercase border border-neutral-300 text-neutral-800 hover:border-[#B89047] hover:text-[#111111] transition-colors"
                >
                  <span>CALL</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#B89047]" />
                </a>
              </div>
            </div>
            <p className="text-xs text-neutral-400 font-mono mt-4 pt-4 border-t border-neutral-100">
              {PERSONAL_INFO.phoneDisplay}
            </p>
          </div>
        </div>

        {/* Bottom Location Note */}
        <div className="mt-16 text-center text-xs font-mono text-neutral-400 tracking-wider">
          LOCATED IN BENGALURU, KARNATAKA, INDIA • AVAILABLE GLOBALLY FOR HYBRID & REMOTE TEAMS
        </div>
      </div>
    </div>
  );
};
