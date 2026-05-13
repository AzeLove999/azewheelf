import React, { useRef, useEffect, useCallback, memo } from 'react';
import { SECTOR_COLORS } from '../../utils/constants';
import { getSectorAngles, truncateText, formatWheelLabel } from '../../utils/wheelMath';

const WheelCanvas = memo(function WheelCanvas({ items, rotationAngle, size = 420 }) {
  const canvasRef = useRef(null);
  // Use at least 2x DPR for crisp text rendering
  const dpr = Math.max(window.devicePixelRatio || 1, 2);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || items.length === 0) return;

    const ctx = canvas.getContext('2d');
    const w = size;
    const h = size;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(cx, cy) - 6;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotationAngle);

    const totalSectors = items.length;

    for (let i = 0; i < totalSectors; i++) {
      const { startAngle, endAngle, midAngle } = getSectorAngles(i, totalSectors);
      const color = SECTOR_COLORS[i % SECTOR_COLORS.length];

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      const grad = ctx.createRadialGradient(0, 0, radius * 0.05, 0, 0, radius);
      grad.addColorStop(0, color + 'dd');
      grad.addColorStop(0.6, color + 'ee');
      grad.addColorStop(1, color + 'ff');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Glass highlight
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      const hlGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      hlGrad.addColorStop(0, 'rgba(255,255,255,0.12)');
      hlGrad.addColorStop(0.4, 'rgba(255,255,255,0.03)');
      hlGrad.addColorStop(1, 'rgba(0,0,0,0.06)');
      ctx.fillStyle = hlGrad;
      ctx.fill();

      // Text — alternate black/white
      ctx.save();
      ctx.rotate(midAngle);
      const textColor = i % 2 === 0 ? '#FFFFFF' : '#1a1a1a';
      ctx.fillStyle = textColor;
      // Scale font relative to wheel radius for zoom responsiveness
      const baseSize = radius * 0.065;
      const fontSize = totalSectors > 40 ? baseSize * 0.65 : totalSectors > 25 ? baseSize * 0.75 : totalSectors > 18 ? baseSize * 0.85 : totalSectors > 12 ? baseSize * 0.92 : baseSize;
      ctx.font = `700 ${Math.round(fontSize)}px Inter, sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      const textRadius = radius * 0.76;
      const maxTextWidth = radius * 0.56;
      const formatted = formatWheelLabel(items[i].label);
      const displayText = truncateText(ctx, formatted, maxTextWidth);

      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 2;
      ctx.fillText(displayText, textRadius, 0);
      ctx.shadowColor = 'transparent';
      ctx.restore();
    }

    // Outer ring
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(196, 162, 101, 0.25)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, radius + 2, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(196, 162, 101, 0.08)';
    ctx.lineWidth = 5;
    ctx.stroke();

    // White center circle
    const hubR = radius * 0.1;
    ctx.beginPath();
    ctx.arc(0, 0, hubR, 0, 2 * Math.PI);
    const hubGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, hubR);
    hubGrad.addColorStop(0, 'rgba(255,255,255,0.95)');
    hubGrad.addColorStop(0.7, 'rgba(255,255,255,0.85)');
    hubGrad.addColorStop(1, 'rgba(220,220,220,0.8)');
    ctx.fillStyle = hubGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(196, 162, 101, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }, [items, rotationAngle, size, dpr]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="block"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        filter: 'none',
      }}
    />
  );
});

export default WheelCanvas;
