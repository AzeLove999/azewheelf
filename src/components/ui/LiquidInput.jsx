import React from 'react';

export default function LiquidInput({
  value,
  onChange,
  placeholder,
  label,
  type = 'text',
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        type={type}
        className="liquid-glass-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
