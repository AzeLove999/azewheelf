import React, { useRef } from 'react';

export default function LiquidButton({
  children,
  onClick,
  variant = 'default',
  disabled = false,
  className = '',
  size = 'md',
  glow = false,
}) {
  const btnRef = useRef(null);

  const variants = {
    default: '',
    accent: 'liquid-glass-btn-accent',
    danger: 'liquid-glass-btn-danger',
    success: 'liquid-glass-btn-success',
  };

  const sizes = {
    sm: 'text-xs px-4 py-2',
    md: 'text-sm px-6 py-3',
    lg: 'text-base px-8 py-4',
    xl: 'text-lg px-10 py-5',
  };

  const handleClick = (e) => {
    if (disabled) return;

    // Ripple effect
    const btn = btnRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = '10px';
      ripple.style.height = '10px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }

    if (onClick) onClick(e);
  };

  return (
    <button
      ref={btnRef}
      className={`liquid-glass-btn ${variants[variant]} ${sizes[size]} ${glow ? 'spin-ready' : ''} ${className}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
