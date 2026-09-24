import React from 'react';
import { Language } from '../types';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'navy';
  showSubtext?: boolean;
  lang?: Language;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'navy',
  showSubtext = true,
  lang = 'en',
}) => {
  const iconDimensions = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
  }[size];

  const primaryTextSize = {
    sm: 'text-base sm:text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
  }[size];

  const textColor = variant === 'light' ? 'text-white' : 'text-[#0F223D]';
  const subtextColor = variant === 'light' ? 'text-[#CBD5E1]' : 'text-[#64748B]';

  const isAr = lang === 'ar';

  return (
    <div id="jazz-brand-logo" className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Authentic Jazz Camp Logo Mark / Emblem */}
      <div className={`relative flex items-center justify-center flex-shrink-0 ${iconDimensions} rounded-xl shadow-sm overflow-hidden border border-black/5 bg-[#EA9F70]`}>
        <img
          src="/logo.png"
          onError={(e) => {
            // Fallback to SVG if png not loaded
            const target = e.currentTarget;
            if (target.src !== '/logo-emblem.svg') {
              target.src = '/logo-emblem.svg';
            }
          }}
          alt="Jazz Camp Emblem"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Brand Text Stack */}
      <div className="flex flex-col text-start justify-center">
        <div className="flex items-center gap-1.5 leading-tight">
          <span className={`font-['Cairo'] font-black tracking-tight ${textColor} ${primaryTextSize}`}>
            {isAr ? 'جاز كامب' : 'Jazz Camp'}
          </span>
          {showSubtext && (
            <span className="text-[#D94E28] font-bold text-xs tracking-wider opacity-90 hidden sm:inline">
              {isAr ? 'JAZZ CAMP' : 'RAS SHITAN'}
            </span>
          )}
        </div>
        {showSubtext && (
          <span className={`font-['Tajawal'] font-medium text-[11px] sm:text-xs tracking-wide ${subtextColor} mt-0.5`}>
            {isAr ? 'رأس شيطان • نويبع • جنوب سيناء' : 'Ras Shitan • Nuweiba • South Sinai'}
          </span>
        )}
      </div>
    </div>
  );
};

