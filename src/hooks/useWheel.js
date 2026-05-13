import { useState, useRef, useCallback } from 'react';
import { createSpinConfig } from '../utils/spinStrategies';
import { getWinnerIndex } from '../utils/wheelMath';

export function useWheel({ items, onSpinEnd, playTick, playWin, startSpinSound, stopSpinSound }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [winner, setWinner] = useState(null);
  const [tickKey, setTickKey] = useState(0);

  const animFrameRef = useRef(null);
  const angleRef = useRef(0);
  const lastTickSectorRef = useRef(-1);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const spinOnce = useCallback((speed, riggedId = null) => {
    return new Promise((resolve) => {
      const currentItems = itemsRef.current;
      if (currentItems.length === 0) {
        resolve(null);
        return;
      }

      const config = createSpinConfig(speed, currentItems, angleRef.current, riggedId);
      const startTime = performance.now();

      setIsSpinning(true);
      setWinner(null);
      if (startSpinSound) startSpinSound();

      const animate = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / config.duration, 1);
        const newAngle = config.animationFn(progress);

        angleRef.current = newAngle;
        setCurrentAngle(newAngle);

        const idx = getWinnerIndex(newAngle, currentItems.length);
        if (idx !== lastTickSectorRef.current) {
          lastTickSectorRef.current = idx;
          setTickKey(k => k + 1);
          if (playTick) playTick();
        }

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(animate);
        } else {
          if (stopSpinSound) stopSpinSound();
          setIsSpinning(false);
          const visualIdx = getWinnerIndex(newAngle, currentItems.length);
          const winnerData = currentItems[visualIdx];
          setWinner(winnerData);
          if (playWin) playWin();
          if (onSpinEnd) onSpinEnd(winnerData);
          resolve(winnerData);
        }
      };

      animFrameRef.current = requestAnimationFrame(animate);
    });
  }, [onSpinEnd, playTick, playWin, startSpinSound, stopSpinSound]);

  const spinSeries = useCallback(async (count, speed, riggedId = null, onEachResult) => {
    const results = [];
    for (let i = 0; i < count; i++) {
      const result = await spinOnce(speed, i === 0 ? riggedId : null);
      if (result) {
        results.push(result);
        if (onEachResult) onEachResult(result, i);
      }
      if (i < count - 1) {
        await new Promise(r => setTimeout(r, 300));
      }
    }
    return results;
  }, [spinOnce]);

  const stopSpin = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setIsSpinning(false);
  }, []);

  const resetAngle = useCallback(() => {
    angleRef.current = 0;
    setCurrentAngle(0);
    setWinner(null);
  }, []);

  return {
    isSpinning,
    currentAngle,
    winner,
    tickKey,
    spinOnce,
    spinSeries,
    stopSpin,
    setWinner,
    resetAngle,
  };
}
