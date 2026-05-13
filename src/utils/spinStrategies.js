import { SPEED_CONFIGS, RIG_PROBABILITY } from './constants';
import { calculateTargetAngle, getWinnerIndex, getSectorAngle } from './wheelMath';

/**
 * Easing functions for different spin speeds
 */
const easings = {
  normal: (t) => {
    // Smooth cubic ease-out
    return 1 - Math.pow(1 - t, 3);
  },
  fast: (t) => {
    // Quartic ease-out — quick acceleration, smooth deceleration
    return 1 - Math.pow(1 - t, 3.5);
  },
  ultra: (t) => {
    // Snappy ease-out — very fast start, gentle stop
    return 1 - Math.pow(1 - t, 2.5);
  },
};

/**
 * Standard spin strategy (normal, fast, turbo).
 * Returns a function that, given elapsed time [0..1], returns the current angle.
 */
export function createStandardSpin(speed, targetAngle, startAngle) {
  const config = SPEED_CONFIGS[speed] || SPEED_CONFIGS.normal;
  const totalDelta = targetAngle - startAngle;
  const easingFn = easings[speed] || easings.normal;

  return (progress) => {
    const easedProgress = easingFn(Math.min(progress, 1));
    return startAngle + totalDelta * easedProgress;
  };
}

/**
 * Gambling (azartnaya) spin — dramatic near-misses, fake slowdowns,
 * sudden accelerations, back-and-forth wobbles, then slow crawl to result.
 */
export function createGamblingSpin(targetAngle, startAngle) {
  const totalDelta = targetAngle - startAngle;

  return (progress) => {
    const t = Math.min(progress, 1);

    if (t < 0.10) {
      // Phase 1: explosive start — fast ramp up
      const p = t / 0.10;
      const ease = 1 - Math.pow(1 - p, 2);
      return startAngle + totalDelta * ease * 0.30;
    } else if (t < 0.22) {
      // Phase 2: fake slowdown — almost stops, tease the viewer
      const p = (t - 0.10) / 0.12;
      const slowEase = p * p * 0.03;
      return startAngle + totalDelta * (0.30 + slowEase);
    } else if (t < 0.35) {
      // Phase 3: sudden burst forward
      const p = (t - 0.22) / 0.13;
      const burstEase = 1 - Math.pow(1 - p, 3);
      return startAngle + totalDelta * (0.33 + burstEase * 0.25);
    } else if (t < 0.45) {
      // Phase 4: another fake slowdown
      const p = (t - 0.35) / 0.10;
      const slowEase = p * p * 0.02;
      return startAngle + totalDelta * (0.58 + slowEase);
    } else if (t < 0.58) {
      // Phase 5: big burst again
      const p = (t - 0.45) / 0.13;
      const burstEase = 1 - Math.pow(1 - p, 3);
      return startAngle + totalDelta * (0.60 + burstEase * 0.18);
    } else if (t < 0.78) {
      // Phase 6: dramatic wobble — back and forth, near misses
      const p = (t - 0.58) / 0.20;
      const base = 0.78 + p * 0.10;
      const wobble = Math.sin(p * Math.PI * 7) * 0.035 * (1 - p);
      return startAngle + totalDelta * (base + wobble);
    } else {
      // Phase 7: slow dramatic crawl to final position
      const p = (t - 0.78) / 0.22;
      const crawl = 1 - Math.pow(1 - p, 5);
      return startAngle + totalDelta * (0.88 + crawl * 0.12);
    }
  };
}

/**
 * Determine the target index. If rigged, returns the rigged target (95% chance).
 * Otherwise picks a random sector from available ones.
 */
export function determineTarget(items, riggedId) {
  if (riggedId !== null && riggedId !== undefined) {
    const roll = Math.random();
    if (roll < RIG_PROBABILITY) {
      const idx = items.findIndex(item => item.id === riggedId);
      if (idx !== -1) return idx;
    }
  }
  // Random target
  return Math.floor(Math.random() * items.length);
}

/**
 * Create a complete spin animation configuration.
 */
export function createSpinConfig(speed, items, currentAngle, riggedId) {
  const config = SPEED_CONFIGS[speed] || SPEED_CONFIGS.normal;
  const targetIndex = determineTarget(items, riggedId);
  const extraRotations = config.minRotations + Math.floor(Math.random() * (config.maxRotations - config.minRotations + 1));
  const targetAngle = calculateTargetAngle(targetIndex, items.length, currentAngle, extraRotations);

  let animationFn;
  if (speed === 'gambling') {
    animationFn = createGamblingSpin(targetAngle, currentAngle);
  } else {
    animationFn = createStandardSpin(speed, targetAngle, currentAngle);
  }

  return {
    targetIndex,
    targetAngle,
    duration: config.duration,
    animationFn,
    winner: items[targetIndex],
  };
}
