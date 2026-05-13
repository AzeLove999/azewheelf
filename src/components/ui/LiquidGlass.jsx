import React from 'react';

export default function LiquidGlass({ children, className = '', variant = 'default', onClick, style }) {
  const variants = {
    default: 'liquid-glass',
    refract: 'liquid-glass-refract',
    card: 'liquid-glass-card',
  };

  const baseClass = variants[variant] || variants.default;

  return (
    <div
      className={`${baseClass} ${className}`}
      onClick={onClick}
      style={{ position: 'relative', ...style }}
    >
      <div className="relative z-[5]">
        {children}
      </div>
    </div>
  );
}
