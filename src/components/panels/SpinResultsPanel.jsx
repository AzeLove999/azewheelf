import React from 'react';
import LiquidGlass from '../ui/LiquidGlass';

export default function SpinResultsPanel({ results, isSpinning }) {
  const summary = results.map((r, i) => `${i + 1}. ${r.label} (#${r.id})`).join('\n');

  return (
    <LiquidGlass className="p-4" variant="card">
      <h4 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">
        Результаты спинов
      </h4>
      {results.length === 0 && !isSpinning ? (
        <div className="flex flex-col items-center justify-center py-5">
          <p className="text-xs text-white/25">Пока пусто</p>
          <p className="text-[10px] text-white/15 mt-1">Результаты появятся после спина</p>
        </div>
      ) : results.length === 0 && isSpinning ? (
        <div className="flex items-center justify-center gap-2.5 py-4">
          <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          <span className="text-sm text-white/40">Вращение...</span>
        </div>
      ) : (
        <div className="px-3 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <pre className="text-sm font-medium text-white whitespace-pre-wrap leading-relaxed">{summary}</pre>
        </div>
      )}
    </LiquidGlass>
  );
}
