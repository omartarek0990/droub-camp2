import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'navy';
  showSubtext?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'navy',
  showSubtext = true,
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

  return (
    <div id="droub-brand-logo" className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Real Droub Camp Logo Mark / Emblem */}
      <div className={`relative flex items-center justify-center flex-shrink-0 ${iconDimensions} rounded-xl bg-white p-1 border border-black/5 shadow-sm overflow-hidden`}>
        <img
          src="/logo-emblem.svg"
          alt="Droub Camp Emblem"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Brand Text Stack */}
      <div className="flex flex-col text-start">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-['Cairo'] font-black tracking-tight ${textColor} ${primaryTextSize}`}>
            دروب كامب
          </span>
          <span className="text-[#D94E28] font-bold text-xs tracking-wider opacity-90 hidden sm:inline font-['Outfit']">
            DROUB CAMP
          </span>
        </div>
        {showSubtext && (
          <span className={`font-['Tajawal'] font-medium text-[11px] sm:text-xs tracking-wide ${subtextColor} mt-0.5`}>
            رأس شيطان • نويبع • جنوب سيناء
          </span>
        )}
      </div>
    </div>
  );
};
