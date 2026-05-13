/**
 * Calculate the angle (in radians) for each sector
 */
export function getSectorAngle(totalSectors) {
  return (2 * Math.PI) / totalSectors;
}

/**
 * Calculate start and end angles for sector at index
 */
export function getSectorAngles(index, totalSectors) {
  const sectorAngle = getSectorAngle(totalSectors);
  return {
    startAngle: index * sectorAngle,
    endAngle: (index + 1) * sectorAngle,
    midAngle: (index + 0.5) * sectorAngle,
  };
}

/**
 * Determine which sector the pointer lands on given a rotation angle.
 * The pointer is at the top (12 o'clock = -π/2).
 * Canvas draws sectors starting at 0 rad (3 o'clock), clockwise.
 * ctx.rotate(rotationAngle) is applied before drawing.
 */
export function getWinnerIndex(rotationAngle, totalSectors) {
  const sectorAngle = getSectorAngle(totalSectors);
  // In wheel's local frame, the pointer is at angle (-π/2 - rotationAngle)
  let pointerLocal = (-Math.PI / 2 - rotationAngle) % (2 * Math.PI);
  pointerLocal = ((pointerLocal % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  return Math.floor(pointerLocal / sectorAngle) % totalSectors;
}

/**
 * Calculate the target rotation angle for a specific sector to land on the pointer.
 * Adds random offset within the sector to avoid landing exactly on a boundary.
 */
export function calculateTargetAngle(targetIndex, totalSectors, currentAngle, extraRotations) {
  const sectorAngle = getSectorAngle(totalSectors);
  const padding = sectorAngle * 0.15;
  const randomOffset = padding + Math.random() * (sectorAngle - 2 * padding);
  // Local angle within the sector that should align with the pointer
  const localAngle = targetIndex * sectorAngle + randomOffset;
  // We need: (-π/2 - finalAngle) ≡ localAngle (mod 2π)
  // So: finalAngle = -π/2 - localAngle (mod 2π)
  let baseAngle = -Math.PI / 2 - localAngle;
  baseAngle = ((baseAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  // Add extra rotations and ensure we always spin well beyond current angle
  let finalAngle = baseAngle + extraRotations * 2 * Math.PI;
  // Guarantee at least extraRotations full turns ahead of current position
  const minTarget = currentAngle + extraRotations * 2 * Math.PI;
  while (finalAngle < minTarget) {
    finalAngle += 2 * Math.PI;
  }
  return finalAngle;
}

/**
 * Format a label for display on the wheel.
 * Multi-word names get abbreviated: "Кристина Петрова" → "Кристина П."
 */
export function formatWheelLabel(text) {
  const parts = text.trim().split(/\s+/);
  if (parts.length <= 1) return text;
  // Keep first word, abbreviate the rest
  return parts[0] + ' ' + parts.slice(1).map(p => p.charAt(0).toUpperCase() + '.').join(' ');
}

/**
 * Truncated text for canvas rendering
 */
export function truncateText(ctx, text, maxWidth) {
  let truncated = text;
  while (ctx.measureText(truncated).width > maxWidth && truncated.length > 0) {
    truncated = truncated.slice(0, -1);
  }
  if (truncated.length < text.length) {
    truncated = truncated.slice(0, -2) + '…';
  }
  return truncated;
}

/**
 * Get contrasting text color for a background hex color
 */
export function getContrastColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#000000' : '#ffffff';
}
