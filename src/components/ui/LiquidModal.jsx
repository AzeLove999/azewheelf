import React, { useEffect, useState } from 'react';

export default function LiquidModal({ isOpen, onClose, children, title }) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      requestAnimationFrame(() => setAnimating(true));
    } else if (visible) {
      setAnimating(false);
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!visible) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className={`liquid-glass-overlay transition-opacity duration-300 ${
        animating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleOverlayClick}
    >
      <div
        className={`liquid-glass-refract max-w-lg w-[90%] mx-4 transition-all duration-400 ${
          animating
            ? 'opacity-100 scale-100 translate-y-0 blur-0'
            : 'opacity-0 scale-90 translate-y-5 blur-sm'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', position: 'relative' }}
      >
        <div className="shimmer-layer"><div className="shimmer-bar" /></div>
        <div className="relative z-[5] p-8">
          {title && (
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center
                  bg-white/10 hover:bg-white/20 border border-white/10
                  transition-all duration-200 text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
