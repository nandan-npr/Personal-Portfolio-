import React, { useState } from 'react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { usePortfolio } from '../hooks/usePortfolio';
import { Check, Info } from 'lucide-react';
import { PageView } from '../types';

interface SkillsViewProps {
  onNavigate: (view: PageView) => void;
}

export const SkillsView: React.FC<SkillsViewProps> = ({ onNavigate }) => {
  const { skillCategories } = usePortfolio();
  const categories = skillCategories && skillCategories.length > 0 ? skillCategories : SKILL_CATEGORIES;
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSkillEvidence, setActiveSkillEvidence] = useState<{
    name: string;
    level: string;
    supportedBy: string;
  } | null>(null);

  const displayedCategories = activeCategory === 'all'
    ? categories
    : categories.filter((c) => c.id === activeCategory);

  return (
    <div className="w-full pt-28 pb-28">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-16 pb-8 border-b border-neutral-200">
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#B89047] block mb-3">
            TECHNICAL ARSENAL // VERIFIED PROFICIENCIES
          </span>
          <h1 className="font-serif-editorial text-4xl sm:text-6xl md:text-7xl font-normal text-[#111111] tracking-tight">
            Technical Knowledge Map
          </h1>
          <p className="text-base sm:text-lg text-neutral-500 font-light mt-4 max-w-2xl leading-relaxed">
            Every capability in this map is backed by real engineering codebases, production deployments, or business data modeling. Zero arbitrary percentages.
          </p>
        </div>

        {/* Quick Category Filter */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 pb-6 mb-16 border-b border-neutral-200/80 text-xs font-mono tracking-[0.16em] uppercase">
          <button
            onClick={() => setActiveCategory('all')}
            className={`pb-2 relative transition-colors focus:outline-none ${
              activeCategory === 'all' ? 'text-[#111111] font-semibold' : 'text-neutral-400 hover:text-[#111111]'
            }`}
          >
            <span>ALL DISCIPLINES ({categories.length})</span>
            {activeCategory === 'all' && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#B89047]" />
            )}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`pb-2 relative transition-colors focus:outline-none ${
                activeCategory === cat.id ? 'text-[#111111] font-semibold' : 'text-neutral-400 hover:text-[#111111]'
              }`}
            >
              <span>{cat.categoryName}</span>
              {activeCategory === cat.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#B89047]" />
              )}
            </button>
          ))}
        </div>

        {/* Interactive Evidence Banner */}
        {activeSkillEvidence && (
          <div className="mb-14 p-6 border border-[#B89047] bg-[#FAFAFA] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
            <div>
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#B89047] block">
                VERIFIED EVIDENCE // {activeSkillEvidence.level}
              </span>
              <h3 className="font-serif-editorial text-2xl text-[#111111] mt-1">
                {activeSkillEvidence.name}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 font-mono mt-1">
                Applied In: {activeSkillEvidence.supportedBy}
              </p>
            </div>
            <button
              onClick={() => setActiveSkillEvidence(null)}
              className="text-xs font-mono uppercase text-neutral-400 hover:text-[#111111] underline self-start sm:self-auto"
            >
              DISMISS
            </button>
          </div>
        )}

        {/* Visual Technical Map — Architectural Typography Grid */}
        <div className="space-y-16">
          {displayedCategories.map((category, idx) => {
            const catNum = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;
            return (
              <div
                key={category.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-10 border-t border-neutral-200"
              >
                {/* Category Identifier */}
                <div className="lg:col-span-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-serif-editorial text-2xl text-[#B89047] font-light">
                      {catNum}
                    </span>
                    <span className="w-6 h-[1px] bg-[#B89047]/40" />
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
                      DISCIPLINE
                    </span>
                  </div>

                  <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#111111]">
                    {category.categoryName}
                  </h3>

                  <p className="text-xs text-neutral-500 font-light leading-relaxed max-w-sm">
                    {category.description}
                  </p>
                </div>

                {/* Typography-Driven Technologies with Interactive Evidence */}
                <div className="lg:col-span-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {category.skills.map((skill) => (
                      <div
                        key={skill.name}
                        onClick={() => setActiveSkillEvidence(skill)}
                        onMouseEnter={() => setActiveSkillEvidence(skill)}
                        className="group p-5 border border-neutral-200/90 bg-white hover:border-[#B89047] transition-all cursor-pointer flex flex-col justify-between min-h-[110px]"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-base font-medium text-[#111111] group-hover:text-[#B89047] transition-colors">
                            {skill.name}
                          </h4>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 px-1.5 py-0.5 bg-neutral-50 border border-neutral-200">
                            {skill.level}
                          </span>
                        </div>

                        <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                          <span className="truncate max-w-[240px]">
                            {skill.supportedBy}
                          </span>
                          <span className="text-[#B89047] opacity-0 group-hover:opacity-100 transition-opacity">
                            INFO →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
