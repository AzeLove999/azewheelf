import React, { memo } from 'react';

const Header = memo(function Header({ mode, onReset }) {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={onReset}
          className="w-10 h-10 rounded-2xl flex items-center justify-center
            hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group header-icon-btn"
          style={{
            background: 'linear-gradient(135deg, rgba(196, 162, 101, 0.2), rgba(139, 115, 85, 0.2))',
            border: '1px solid rgba(196, 162, 101, 0.2)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
          }}
          title="Сбросить всё"
        >
          <svg className="header-wheel-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" className="text-white/60" />
            <circle cx="12" cy="12" r="3" className="text-[#C4A265]" />
            <line x1="12" y1="2" x2="12" y2="5" className="text-white/40" />
            <line x1="12" y1="19" x2="12" y2="22" className="text-white/40" />
            <line x1="2" y1="12" x2="5" y2="12" className="text-white/40" />
            <line x1="19" y1="12" x2="22" y2="12" className="text-white/40" />
            <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" className="text-white/30" />
            <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" className="text-white/30" />
            <line x1="4.93" y1="19.07" x2="7.05" y2="16.95" className="text-white/30" />
            <line x1="16.95" y1="7.05" x2="19.07" y2="4.93" className="text-white/30" />
          </svg>
        </button>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">
            AzeWheelg
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {mode === 'ittop' && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C4A265]/10 border border-[#C4A265]/20">
            <span className="w-2 h-2 rounded-full bg-[#C4A265] animate-pulse" />
            <span className="text-xs text-[#C4A265]/80 font-medium">IT TOP</span>
          </div>
        )}
      </div>
    </header>
  );
});

export default Header;
