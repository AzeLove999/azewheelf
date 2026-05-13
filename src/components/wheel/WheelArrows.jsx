import React from 'react';

function ClassicArrow({ color = '#C4A265' }) {
  return (
    <svg width="36" height="46" viewBox="0 0 36 46" fill="none">
      <defs>
        <linearGradient id="acG1" x1="18" y1="0" x2="18" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity="0.6" />
        </linearGradient>
        <filter id="acS1"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor={color} floodOpacity="0.4" /></filter>
      </defs>
      <polygon points="18,42 4,8 18,16 32,8" fill="url(#acG1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" filter="url(#acS1)" />
      <polygon points="18,42 11,13 18,18 25,13" fill="rgba(255,255,255,0.12)" />
    </svg>
  );
}

function ModernArrow({ color = '#A89070' }) {
  return (
    <svg width="32" height="44" viewBox="0 0 32 44" fill="none">
      <defs>
        <linearGradient id="acG2" x1="16" y1="0" x2="16" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={color} stopOpacity="0.95" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
        <filter id="acS2"><feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor={color} floodOpacity="0.35" /></filter>
      </defs>
      <path d="M16 40 L3 6 L16 14 L29 6 Z" fill="url(#acG2)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" filter="url(#acS2)" strokeLinejoin="round" />
      <path d="M16 40 L9 10 L16 15 L23 10 Z" fill="rgba(255,255,255,0.08)" />
      <circle cx="16" cy="10" r="2.5" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

function ElegantArrow({ color = '#D4B896' }) {
  return (
    <svg width="30" height="48" viewBox="0 0 30 48" fill="none">
      <defs>
        <linearGradient id="acG3" x1="15" y1="0" x2="15" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={color} />
          <stop offset="60%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor="#8B7355" stopOpacity="0.6" />
        </linearGradient>
        <filter id="acS3"><feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor={color} floodOpacity="0.3" /></filter>
      </defs>
      <path d="M15 44 L3 10 L9 14 L15 2 L21 14 L27 10 Z" fill="url(#acG3)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" filter="url(#acS3)" strokeLinejoin="round" />
      <path d="M15 44 L8 16 L15 6 L22 16 Z" fill="rgba(255,255,255,0.1)" />
    </svg>
  );
}

const arrowComponents = {
  classic: ClassicArrow,
  modern: ModernArrow,
  elegant: ElegantArrow,
};

export default function WheelArrows({ type = 'classic', color, bouncing = false, tickKey = 0 }) {
  const ArrowComponent = arrowComponents[type] || ClassicArrow;

  return (
    <div
      className="absolute top-0 left-1/2 z-20"
      style={{ transform: 'translate(-50%, -4px)' }}
    >
      <div
        key={tickKey}
        className={bouncing ? 'arrow-bounce' : tickKey > 0 ? 'arrow-tick' : ''}
      >
        <ArrowComponent color={color} />
      </div>
    </div>
  );
}
