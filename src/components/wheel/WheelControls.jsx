import React from 'react';
import LiquidButton from '../ui/LiquidButton';
import { SPEED_CONFIGS, ARROW_TYPES, MAX_SERIES } from '../../utils/constants';

export default function WheelControls({
  speed,
  setSpeed,
  seriesCount,
  setSeriesCount,
  arrowType,
  setArrowType,
  onSpin,
  isSpinning,
  itemsCount,
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Speed */}
      <div>
        <label className="text-xs font-medium text-white/40 mb-1.5 block">Скорость</label>
        <div className="flex gap-1.5">
          {Object.entries(SPEED_CONFIGS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setSpeed(key)}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-200 border ${
                speed === key
                  ? 'bg-[#C4A265]/15 border-[#C4A265]/30 text-white'
                  : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/8'
              }`}
            >
              {val.label}
            </button>
          ))}
        </div>
      </div>

      {/* Arrow + Series in one row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-white/40 mb-1.5 block">Стрелка</label>
          <div className="flex gap-1">
            {Object.entries(ARROW_TYPES).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setArrowType(key)}
                className={`flex-1 py-2 rounded-xl text-[11px] font-medium transition-all duration-200 border ${
                  arrowType === key
                    ? 'bg-[#C4A265]/15 border-[#C4A265]/30 text-white'
                    : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/8'
                }`}
              >
                {val.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-white/40 mb-1.5 block">Серия</label>
          <div className="flex gap-1">
            {Array.from({ length: MAX_SERIES }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setSeriesCount(n)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                  seriesCount === n
                    ? 'bg-[#C4A265]/15 border-[#C4A265]/30 text-white'
                    : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/8'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Spin button */}
      <LiquidButton
        variant="accent"
        size="lg"
        onClick={onSpin}
        disabled={isSpinning || itemsCount === 0}
        glow={false}
        className="w-full text-base font-bold tracking-wide"
      >
        {isSpinning ? (
          <span className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Вращается...
          </span>
        ) : (
          <span>КРУТИТЬ{seriesCount > 1 ? ` (x${seriesCount})` : ''}</span>
        )}
      </LiquidButton>

      {itemsCount === 0 && (
        <p className="text-xs text-center text-white/30 mt-1">
          Нет доступных элементов
        </p>
      )}
    </div>
  );
}
