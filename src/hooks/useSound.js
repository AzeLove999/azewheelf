import { useRef, useCallback } from 'react';

// ── Tick sound (always plays on sector change) ──

function createTickBuffer(ctx) {
  const sr = ctx.sampleRate, dur = 0.04, len = Math.floor(sr * dur);
  const buf = ctx.createBuffer(1, len, sr), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    const t = i / sr, env = Math.exp(-t * 80);
    d[i] = (Math.sin(2*Math.PI*800*t)*0.5 + Math.sin(2*Math.PI*1600*t)*0.3 + Math.sin(2*Math.PI*3200*t)*0.2) * env * 0.6;
  }
  return buf;
}

// ── Sound packs ──
export const SOUND_PACKS = {
  classic:  { label: 'Без музыки' },
  melstroy: { label: 'Мелстрой',   spinSrc: `${import.meta.env.BASE_URL}sounds/melstroy.mp3` },
  zhdun:    { label: 'Ждун',       spinSrc: `${import.meta.env.BASE_URL}sounds/zhdun.mp3` },
  baraban:  { label: 'Барабан',     spinSrc: `${import.meta.env.BASE_URL}sounds/baraban.mp3` },
};

const WIN_MP3_SRC = `${import.meta.env.BASE_URL}sounds/rizz.mp3`;

export function useSound() {
  const audioCtxRef = useRef(null);
  const tickBufferRef = useRef(null);
  const isInitRef = useRef(false);
  const packRef = useRef('classic');
  const volumeRef = useRef(0.5);

  const loopAudioRef = useRef(null);
  const winAudioRef = useRef(null);
  // Master gain for tick sounds
  const tickGainRef = useRef(null);

  const init = useCallback(() => {
    if (isInitRef.current) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      tickBufferRef.current = createTickBuffer(ctx);
      // Master gain node for ticks
      const gain = ctx.createGain();
      gain.gain.value = volumeRef.current;
      gain.connect(ctx.destination);
      tickGainRef.current = gain;
      // Preload win MP3
      winAudioRef.current = new Audio(WIN_MP3_SRC);
      winAudioRef.current.volume = volumeRef.current;
      winAudioRef.current.preload = 'auto';
      // Preload loop MP3s
      Object.values(SOUND_PACKS).forEach(pack => {
        if (pack.spinSrc) {
          const a = new Audio(pack.spinSrc);
          a.preload = 'auto';
          a.load();
        }
      });
      isInitRef.current = true;
    } catch (e) {
      console.warn('Audio not available:', e);
    }
  }, []);

  const setVolume = useCallback((v) => {
    volumeRef.current = v;
    if (tickGainRef.current) tickGainRef.current.gain.value = v;
    if (loopAudioRef.current) loopAudioRef.current.volume = v;
    if (winAudioRef.current) winAudioRef.current.volume = v;
  }, []);

  const setSoundPack = useCallback((packKey) => {
    if (loopAudioRef.current) {
      loopAudioRef.current.pause();
      loopAudioRef.current.currentTime = 0;
      loopAudioRef.current = null;
    }
    packRef.current = packKey;
  }, []);

  const startSpinSound = useCallback(() => {
    const pack = SOUND_PACKS[packRef.current];
    if (!pack || !pack.spinSrc) return;
    try {
      const audio = new Audio(pack.spinSrc);
      audio.loop = true;
      audio.volume = volumeRef.current;
      audio.play().catch(() => {});
      loopAudioRef.current = audio;
    } catch (e) { /* ignore */ }
  }, []);

  const stopSpinSound = useCallback(() => {
    if (loopAudioRef.current) {
      loopAudioRef.current.pause();
      loopAudioRef.current.currentTime = 0;
      loopAudioRef.current = null;
    }
  }, []);

  // Tick always plays (sector click)
  const playTick = useCallback(() => {
    if (!isInitRef.current || !audioCtxRef.current || !tickBufferRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const source = ctx.createBufferSource();
      source.buffer = tickBufferRef.current;
      source.connect(tickGainRef.current);
      source.start(0);
    } catch (e) { /* ignore */ }
  }, []);

  const playWin = useCallback(() => {
    try {
      if (winAudioRef.current) {
        winAudioRef.current.currentTime = 0;
        winAudioRef.current.volume = volumeRef.current;
        winAudioRef.current.play().catch(() => {});
      }
    } catch (e) { /* ignore */ }
  }, []);

  return { init, playTick, playWin, setSoundPack, startSpinSound, stopSpinSound, setVolume };
}