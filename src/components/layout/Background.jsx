import React, { memo } from 'react';

const Background = memo(function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #131110 0%, #1a1510 25%, #201a14 50%, #1a1612 75%, #131110 100%)',
          backgroundSize: '400% 400%',
          animation: 'bgShift 20s ease infinite',
        }}
      />

      {/* Ambient orbs */}
      <div
        className="ambient-orb"
        style={{
          width: 500,
          height: 500,
          top: '-10%',
          left: '-5%',
          background: 'radial-gradient(circle, rgba(196, 162, 101, 0.1) 0%, transparent 70%)',
          animationDelay: '0s',
          animationDuration: '25s',
        }}
      />
      <div
        className="ambient-orb"
        style={{
          width: 600,
          height: 600,
          bottom: '-15%',
          right: '-10%',
          background: 'radial-gradient(circle, rgba(139, 115, 85, 0.08) 0%, transparent 70%)',
          animationDelay: '-8s',
          animationDuration: '30s',
        }}
      />
      <div
        className="ambient-orb"
        style={{
          width: 400,
          height: 400,
          top: '40%',
          left: '50%',
          background: 'radial-gradient(circle, rgba(212, 184, 150, 0.06) 0%, transparent 70%)',
          animationDelay: '-15s',
          animationDuration: '22s',
        }}
      />
      <div
        className="ambient-orb"
        style={{
          width: 350,
          height: 350,
          top: '10%',
          right: '20%',
          background: 'radial-gradient(circle, rgba(201, 144, 139, 0.06) 0%, transparent 70%)',
          animationDelay: '-5s',
          animationDuration: '28s',
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.4) 100%)',
        }}
      />
    </div>
  );
});

export default Background;
