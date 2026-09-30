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
  const primaryTextSize = {
    sm: 'text-base sm:text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
  }[size];

  const textColor = variant === 'light' ? 'text-white' : 'text-[#0F223D]';
  const subtextColor = variant === 'light' ? 'text-[#CBD5E1]' : 'text-[#64748B]';

  const isAr = lang === 'ar';

  return (
    <div id="brand-logo" className={`inline-flex flex-col text-start justify-center select-none ${className}`}>
      {/* Brand Name Text */}
      <div className="flex items-center gap-2 leading-tight">
        <span className={`font-['Cairo'] font-black tracking-tight ${textColor} ${primaryTextSize}`}>
          {isAr ? 'نويبع كامب' : 'Nuweiba Camp'}
        </span>
        {showSubtext && (
          <span className="text-[#D94E28] font-bold text-xs tracking-wider opacity-90 hidden sm:inline">
            {isAr ? 'NUWEIBA CAMP' : 'RAS SHITAN'}
          </span>
        )}
      </div>
      {showSubtext && (
        <span className={`font-['Tajawal'] font-medium text-[11px] sm:text-xs tracking-wide ${subtextColor} mt-0.5`}>
          {isAr ? 'رأس شيطان • نويبع • جنوب سيناء' : 'Ras Shitan • Nuweiba • South Sinai'}
        </span>
      )}
    </div>
  );
};

