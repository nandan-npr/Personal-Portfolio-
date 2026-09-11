import React from 'react';
import { PageView } from '../types';
import { ArrowLeft } from 'lucide-react';

interface NotFoundViewProps {
  onNavigate: (view: PageView) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onNavigate }) => {
  return (
    <div className="w-full min-h-[75vh] flex items-center justify-center pt-28 pb-28 px-6 sm:px-8">
      <div className="max-w-xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-neutral-200 bg-white text-[11px] font-mono tracking-[0.25em] uppercase text-[#B89047]">
          <span>ERROR CODE 404</span>
        </div>

        <h1 className="font-serif-editorial text-6xl sm:text-8xl text-[#111111] font-light tracking-tight">
          404
        </h1>

        <div className="w-12 h-[1.5px] bg-[#B89047] mx-auto" />

        <h2 className="font-serif-editorial text-2xl sm:text-3xl text-[#111111]">
          This page does not exist.
        </h2>

        <p className="text-sm sm:text-base text-neutral-500 font-light max-w-md mx-auto leading-relaxed">
          The requested path could not be located in this directory. Please verify the URL or return to the main portfolio overview.
        </p>

        <div className="pt-4">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold tracking-[0.2em] uppercase bg-[#111111] text-white hover:bg-[#B89047] transition-all duration-200 shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN HOME</span>
          </button>
        </div>
      </div>
    </div>
  );
};
