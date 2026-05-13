import React, { useState, useMemo } from 'react';
import LiquidGlass from '../ui/LiquidGlass';
import LiquidSelect from '../ui/LiquidSelect';
import LiquidInput from '../ui/LiquidInput';
import LiquidButton from '../ui/LiquidButton';
import { IT_TOP_PASSWORD, SPEED_CONFIGS, ARROW_TYPES, MAX_SERIES } from '../../utils/constants';
import { SOUND_PACKS } from '../../hooks/useSound';

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
        enabled ? 'bg-[#C4A265]' : 'bg-white/15'
      }`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
        enabled ? 'translate-x-5' : 'translate-x-0'
      }`} />
    </button>
  );
}

export default function SettingsPanel({
  mode,
  setMode,
  normalTab,
  setNormalTab,
  rangeMin,
  setRangeMin,
  rangeMax,
  setRangeMax,
  customNames,
  setCustomNames,
  normalItems,
  riggedId,
  setRiggedId,
  rigEnabled,
  setRigEnabled,
  groupNames,
  selectedGroup,
  setSelectedGroup,
  allStudents,
  excluded,
  toggleExclusion,
  resetExclusions,
  loading,
  speed,
  setSpeed,
  seriesCount,
  setSeriesCount,
  arrowType,
  setArrowType,
  onSpin,
  isSpinning,
  itemsCount,
  soundPack,
  setSoundPack,
  volume,
  setVolume,
}) {
  const [password, setPassword] = useState('');
  const [showSoundPicker, setShowSoundPicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [rigInput, setRigInput] = useState('');

  const handleModeChange = (newMode) => {
    if (newMode === 'ittop' && mode !== 'ittop') {
      setShowPassword(true);
    } else {
      setMode(newMode);
      setShowPassword(false);
      setPassword('');
      setPasswordError(false);
    }
  };

  const handlePasswordSubmit = () => {
    if (password === IT_TOP_PASSWORD) {
      setMode('ittop');
      setShowPassword(false);
      setPassword('');
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleRangeInput = (setter) => (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw === '') { setter(''); return; }
    const num = Number(raw);
    if (num > 100) { setter('100'); return; }
    setter(raw);
  };

  // Range warning
  const rangeWarning = useMemo(() => {
    const min = rangeMin === '' ? null : Number(rangeMin);
    const max = rangeMax === '' ? null : Number(rangeMax);
    if (min !== null && max !== null && Math.abs(max - min) + 1 > 100) return 'Максимум 100 спинов';
    return null;
  }, [rangeMin, rangeMax]);

  // Find matching item for rig input — supports both ID and name
  const rigHint = useMemo(() => {
    if (!rigEnabled || !rigInput.trim()) return null;
    const q = rigInput.trim().toLowerCase();
    if (mode === 'ittop') {
      // Try ID first
      const id = Number(rigInput);
      if (!isNaN(id) && id > 0) {
        const byId = allStudents.find(s => s.id === id);
        if (byId) return byId;
      }
      // Then try name match
      return allStudents.find(s => s.label.toLowerCase().startsWith(q)) || null;
    }
    if (normalTab === 'numbers') {
      const num = Number(rigInput);
      if (!isNaN(num)) {
        return normalItems.find(s => s.id === num) || null;
      }
    } else {
      return normalItems.find(s => s.label.toLowerCase().startsWith(q)) || null;
    }
    return null;
  }, [rigEnabled, rigInput, mode, normalTab, normalItems, allStudents]);

  // Auto-apply rig when hint found
  React.useEffect(() => {
    if (rigHint) {
      setRiggedId(rigHint.id);
    } else if (rigInput.trim() === '') {
      setRiggedId(null);
    }
  }, [rigHint, rigInput, setRiggedId]);

  const clearRig = () => {
    setRiggedId(null);
    setRigInput('');
  };

  return (
    <LiquidGlass className="p-5 panel-slide-left" variant="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-white">
          Настройки
        </h3>
        <button
          onClick={() => setShowSoundPicker(p => !p)}
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 border ${
            showSoundPicker
              ? 'bg-white/15 border-white/30 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]'
              : 'bg-white/8 border-white/20 text-white/60 hover:bg-white/12 hover:text-white hover:border-white/30'
          }`}
          title="Звуки"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          </svg>
        </button>
      </div>

      {/* Sound picker — opens down */}
      {showSoundPicker && (
        <div className="mb-4 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] space-y-3">
          <div>
            <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-1.5 block">Мелодия</label>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(SOUND_PACKS).map(([key, pack]) => (
                <button
                  key={key}
                  onClick={() => { setSoundPack(key); setShowSoundPicker(false); }}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all duration-200 border ${
                    soundPack === key
                      ? 'bg-white/12 border-white/25 text-white'
                      : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/8 hover:text-white/60'
                  }`}
                >
                  {pack.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider">Громкость</label>
              <span className="text-[10px] text-white/30 tabular-nums">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="volume-slider w-full"
            />
          </div>
        </div>
      )}

      {/* Mode toggle */}
      <div className="mb-4">
        <label className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 block">Режим</label>
        <div className="flex gap-2">
          <button
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-300 border ${
              mode === 'normal'
                ? 'bg-[#C4A265]/15 border-[#C4A265]/30 text-white shadow-lg'
                : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
            }`}
            onClick={() => handleModeChange('normal')}
          >
            Обычный
          </button>
          <button
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-300 border ${
              mode === 'ittop'
                ? 'bg-[#C4A265]/15 border-[#C4A265]/30 text-white shadow-lg'
                : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
            }`}
            onClick={() => handleModeChange('ittop')}
          >
            IT TOP
          </button>
        </div>
      </div>

      {/* Password dialog */}
      {showPassword && (
        <div className="mb-4 p-3 rounded-2xl bg-white/5 border border-white/10">
          <LiquidInput
            label="Пароль IT TOP"
            type="password"
            value={password}
            onChange={(v) => { setPassword(v); setPasswordError(false); }}
            placeholder="Введите пароль..."
          />
          {passwordError && <p className="text-xs text-red-400 mt-1">Неверный пароль</p>}
          <div className="flex gap-2 mt-3">
            <LiquidButton size="sm" variant="accent" onClick={handlePasswordSubmit}>Войти</LiquidButton>
            <LiquidButton size="sm" onClick={() => { setShowPassword(false); setPassword(''); }}>Отмена</LiquidButton>
          </div>
        </div>
      )}

      {/* === NORMAL MODE === */}
      {mode === 'normal' && (
        <>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setNormalTab('numbers')}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-300 border ${
                normalTab === 'numbers'
                  ? 'bg-[#C4A265]/15 border-[#C4A265]/30 text-white shadow-lg'
                  : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
              }`}
            >
              Числа
            </button>
            <button
              onClick={() => setNormalTab('names')}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-300 border ${
                normalTab === 'names'
                  ? 'bg-[#C4A265]/15 border-[#C4A265]/30 text-white shadow-lg'
                  : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
              }`}
            >
              Имена
            </button>
          </div>

          {normalTab === 'numbers' ? (
            <div className="mb-4">
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 block">Диапазон чисел</label>
              <div className="flex gap-1.5 items-center">
                <span className="text-xs text-white/40 shrink-0">от</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={rangeMin}
                  onChange={handleRangeInput(setRangeMin)}
                  placeholder="1"
                  className="w-16 bg-white/5 border border-white/10 rounded-xl px-2 py-1.5 text-sm text-white outline-none focus:border-[#C4A265]/40 transition-colors text-center placeholder-white/20"
                />
                <span className="text-xs text-white/40 shrink-0">до</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={rangeMax}
                  onChange={handleRangeInput(setRangeMax)}
                  placeholder="10"
                  className="w-16 bg-white/5 border border-white/10 rounded-xl px-2 py-1.5 text-sm text-white outline-none focus:border-[#C4A265]/40 transition-colors text-center placeholder-white/20"
                />
              </div>
              {rangeWarning ? (
                <p className="text-xs text-amber-400/80 mt-1.5">{rangeWarning}</p>
              ) : (
                <p className="text-xs text-white/30 mt-1.5">
                  {(() => {
                    const lo = rangeMin === '' ? 1 : Number(rangeMin);
                    const hi = rangeMax === '' ? 10 : Number(rangeMax);
                    return `${Math.max(0, Math.abs(hi - lo) + 1)} элементов`;
                  })()}
                </p>
              )}
            </div>
          ) : (
            <div className="mb-4">
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 block">
                Имена (по одному на строку)
              </label>
              <textarea
                value={customNames}
                onChange={e => setCustomNames(e.target.value)}
                rows={5}
                placeholder={"Иван\nМария\nАлексей"}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-[#C4A265]/40 transition-colors resize-none"
              />
              <p className="text-xs text-white/30 mt-1.5">
                {customNames.split('\n').filter(n => n.trim()).length} элементов
              </p>
            </div>
          )}
        </>
      )}

      {/* === IT TOP MODE === */}
      {mode === 'ittop' && (
        <>
          {loading ? (
            <div className="flex items-center justify-center h-20">
              <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <LiquidSelect
                label="Группа"
                value={selectedGroup}
                onChange={setSelectedGroup}
                options={groupNames}
                className="mb-4"
              />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                    Участники ({allStudents.length - excluded.size}/{allStudents.length})
                  </label>
                  {excluded.size > 0 && (
                    <button onClick={resetExclusions} className="text-xs text-[#C4A265] hover:text-[#D4B896] transition-colors">
                      Сбросить
                    </button>
                  )}
                </div>
                <div className="max-h-36 overflow-y-auto pr-1 space-y-1">
                  {allStudents.map((student) => {
                    const isExcl = excluded.has(student.id);
                    return (
                      <button
                        key={student.id}
                        onClick={() => toggleExclusion(student.id)}
                        className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm text-left transition-all duration-200 ${
                          isExcl ? 'bg-white/3 text-white/25 line-through' : 'bg-white/5 text-white/80 hover:bg-white/10'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] transition-all ${
                          isExcl ? 'border-white/10 bg-white/5' : 'border-[#C4A265]/40 bg-[#C4A265]/10'
                        }`}>
                          {!isExcl && '✓'}
                        </span>
                        <span className="truncate">{student.label}</span>
                        <span className="ml-auto text-xs text-white/20">#{student.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* === SPEED === */}
      <div className="mt-4 pt-3 border-t border-white/8">
        <label className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 block">Скорость</label>
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

      {/* === ARROW === */}
      <div className="mt-3">
        <label className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 block">Стрелка</label>
        <div className="flex gap-1.5">
          {Object.entries(ARROW_TYPES).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setArrowType(key)}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-200 border ${
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

      {/* === SERIES === */}
      <div className="mt-3">
        <label className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 block">Серия</label>
        <div className="flex gap-1.5">
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

      {/* === RIGGING SECTION (both modes) === */}
      {(mode === 'normal' || (mode === 'ittop' && !loading)) && (
        <div className="mt-3 pt-3 border-t border-white/8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider block">
                Подкрутка
              </label>
              <p className="text-[10px] text-white/25 mt-0.5">Гарантированный результат (100%)</p>
            </div>
            <Toggle enabled={rigEnabled} onChange={(v) => { setRigEnabled(v); if (!v) clearRig(); }} />
          </div>

          {rigEnabled && (
            <div className="mt-2">
              <div className="flex gap-1.5 items-center">
                <input
                  type="text"
                  inputMode={normalTab === 'numbers' && mode !== 'ittop' ? 'numeric' : 'text'}
                  value={rigInput}
                  onChange={e => setRigInput(e.target.value)}
                  placeholder={mode === 'ittop' ? 'ID или имя...' : normalTab === 'numbers' ? 'Введите число...' : 'Введите имя...'}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white outline-none focus:border-[#C4A265]/40 transition-colors placeholder-white/20"
                />
                {rigInput.trim() && (
                  <button onClick={clearRig} className="text-xs text-white/30 hover:text-white/60 transition-colors px-1">✕</button>
                )}
              </div>

              {rigInput.trim() && rigHint && (
                <div className="mt-1.5 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#C4A265]/10 border border-[#C4A265]/20">
                  <span className="text-xs text-[#C4A265]/70 font-medium">#{rigHint.id}</span>
                  <span className="text-sm text-white">{rigHint.label}</span>
                </div>
              )}
              {rigInput.trim() && !rigHint && (
                <div className="mt-1.5 px-3 py-2 rounded-xl bg-white/4 border border-white/8">
                  <p className="text-xs text-white/30">Не найдено</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </LiquidGlass>
  );
}
