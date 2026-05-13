import React from 'react';
import LiquidModal from '../ui/LiquidModal';
import LiquidButton from '../ui/LiquidButton';

export default function ResultModal({ isOpen, onClose, winner, seriesResults, onKeep, onRemove }) {
  const isSeries = seriesResults && seriesResults.length > 1;

  return (
    <LiquidModal isOpen={isOpen} onClose={onClose} title={isSeries ? 'Результаты серии' : 'Результат'}>
      {isSeries ? (
        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {seriesResults.map((result, i) => (
            <div
              key={i}
              className="result-reveal flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/8"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-[#C4A265]/20 to-[#8B7355]/20 border border-[#C4A265]/20 flex items-center justify-center text-sm font-bold text-[#D4B896]">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{result.label}</p>
                <p className="text-xs text-white/30">ID: {result.id}</p>
              </div>
            </div>
          ))}
        </div>
      ) : winner ? (
        <div className="result-reveal text-center py-4">
          <h3 className="text-2xl font-bold text-white mb-1">{winner.label}</h3>
          <p className="text-sm text-white/40">ID: {winner.id}</p>
        </div>
      ) : null}

      {/* Keep / Remove buttons */}
      {!isSeries && winner && (
        <div className="mt-5 flex gap-3 justify-center">
          <LiquidButton variant="accent" onClick={onKeep}>
            Оставить
          </LiquidButton>
          <LiquidButton variant="danger" onClick={onRemove}>
            Убрать
          </LiquidButton>
        </div>
      )}

      {isSeries && (
        <div className="mt-5 flex gap-3 justify-center">
          <LiquidButton variant="accent" onClick={onKeep}>
            Оставить
          </LiquidButton>
          <LiquidButton variant="danger" onClick={onRemove}>
            Убрать
          </LiquidButton>
        </div>
      )}
    </LiquidModal>
  );
}
