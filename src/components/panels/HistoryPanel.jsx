import React, { memo } from 'react';
import LiquidGlass from '../ui/LiquidGlass';

const numWords = { 1: 'одного', 2: 'двух', 3: 'трёх', 4: 'четырёх', 5: 'пяти' };

const HistoryPanel = memo(function HistoryPanel({ history, clearHistory }) {
  return (
    <LiquidGlass className="p-5 panel-slide-right" variant="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-white tracking-wide">
          История
        </h3>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-3 py-1 rounded-lg text-[11px] font-medium bg-white/[0.04] border border-white/[0.08] text-white/30 hover:bg-red-500/10 hover:border-red-400/20 hover:text-red-400/70 transition-all duration-200"
          >
            Очистить
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-white/20">
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center mb-3">
            <span className="text-lg">🎯</span>
          </div>
          <p className="text-sm font-medium">Пока пусто</p>
          <p className="text-[11px] mt-0.5 text-white/15">Результаты появятся после спина</p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((entry, i) => (
            entry.isSeries ? (
              <div
                key={entry.timestamp || i}
                className="rounded-2xl bg-gradient-to-br from-[#C4A265]/[0.06] to-white/[0.02] border border-[#C4A265]/[0.12] overflow-hidden"
              >
                <div className="flex items-center gap-2.5 px-3.5 py-2 border-b border-white/[0.04]">
                  <span className="w-6 h-6 rounded-lg bg-[#C4A265]/10 flex items-center justify-center text-[10px] font-bold text-[#C4A265]/50 shrink-0">
                    {history.length - i}
                  </span>
                  <span className="text-[11px] text-[#C4A265]/70 font-semibold tracking-wide">
                    Серия из {numWords[entry.seriesCount] || entry.seriesCount}
                  </span>
                </div>
                <div className="px-3.5 py-2 space-y-1">
                  {entry.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <span className="text-[10px] text-white/20 w-4 text-right shrink-0">{j + 1}.</span>
                      <span className="text-sm text-white/80 font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                key={entry.timestamp || i}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-white/[0.025] border border-white/[0.06] hover:bg-white/[0.04] transition-colors duration-200"
              >
                <span className="w-6 h-6 rounded-lg bg-white/[0.05] flex items-center justify-center text-[10px] font-bold text-white/25 shrink-0">
                  {history.length - i}
                </span>
                <span className="text-sm font-semibold text-white/90 truncate">{entry.label}</span>
              </div>
            )
          ))}
        </div>
      )}
    </LiquidGlass>
  );
});

export default HistoryPanel;
