import React from 'react';

interface MisprintTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
}

const MisprintText: React.FC<MisprintTextProps> = ({ text, className = '', as: Component = 'h1' }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      {/* Cyan Layer */}
      <Component className="absolute top-0 left-0 w-full h-full text-cyan-bright opacity-70 mix-blend-multiply select-none -translate-x-[2px] -translate-y-[2px] pointer-events-none">
        {text}
      </Component>
      {/* Orange Layer */}
      <Component className="absolute top-0 left-0 w-full h-full text-orange-bright opacity-70 mix-blend-multiply select-none translate-x-[2px] translate-y-[2px] pointer-events-none">
        {text}
      </Component>
      {/* Main Ink Layer */}
      <Component className="relative z-10 text-ink">
        {text}
      </Component>
    </div>
  );
};

export default MisprintText;
