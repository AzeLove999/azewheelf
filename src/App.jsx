import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Background from './components/layout/Background';
import Header from './components/layout/Header';
import WheelContainer from './components/wheel/WheelContainer';
import SettingsPanel from './components/panels/SettingsPanel';
import HistoryPanel from './components/panels/HistoryPanel';
import ResultModal from './components/panels/ResultModal';
import LiquidGlass from './components/ui/LiquidGlass';
import { useGroups } from './hooks/useGroups';
import { useWheel } from './hooks/useWheel';
import { useHistory } from './hooks/useHistory';
import { useSound } from './hooks/useSound';
import { SPEED_CONFIGS } from './utils/constants';

export default function App() {
  const [mode, setMode] = useState('normal');
  const [speed, setSpeed] = useState('normal');
  const [seriesCount, setSeriesCount] = useState(1);
  const [arrowType, setArrowType] = useState('classic');
  const [riggedId, setRiggedId] = useState(null);
  const [rigEnabled, setRigEnabled] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [seriesResults, setSeriesResults] = useState([]);
  const [mobilePanel, setMobilePanel] = useState('wheel');
  const [lastWinner, setLastWinner] = useState(null);

  // Normal mode state
  const [normalTab, setNormalTab] = useState('numbers');
  const [rangeMin, setRangeMin] = useState('');
  const [rangeMax, setRangeMax] = useState('');
  const [customNames, setCustomNames] = useState('');
  const [normalExcluded, setNormalExcluded] = useState(new Set());

  const {
    groupNames, selectedGroup, setSelectedGroup,
    activeStudents: groupStudents, allStudents, excluded,
    excludeStudent, resetExclusions, toggleExclusion,
    loading, error,
  } = useGroups();

  // Generate items for normal mode (full list)
  // Default to 1-15 when inputs are empty
  const normalItems = useMemo(() => {
    if (normalTab === 'numbers') {
      const minVal = rangeMin === '' ? 1 : Number(rangeMin);
      const maxVal = rangeMax === '' ? 10 : Number(rangeMax);
      if (isNaN(minVal) || isNaN(maxVal)) return [];
      const lo = Math.min(minVal, maxVal);
      const hi = Math.max(minVal, maxVal);
      if (hi - lo + 1 > 200) return [];
      return Array.from({ length: hi - lo + 1 }, (_, i) => ({
        id: lo + i,
        label: String(lo + i),
      }));
    }
    return customNames
      .split('\n')
      .map(n => n.trim())
      .filter(Boolean)
      .map((name, i) => ({ id: i + 1, label: name }));
  }, [normalTab, rangeMin, rangeMax, customNames]);

  // Active items = full list minus excluded
  const activeNormalItems = useMemo(() => {
    return normalItems.filter(item => !normalExcluded.has(item.id));
  }, [normalItems, normalExcluded]);

  const activeItems = mode === 'ittop' ? groupStudents : activeNormalItems;

  const { history, addEntry, addSeriesEntry, clearHistory } = useHistory();
  const [soundPack, setSoundPackState] = useState('classic');
  const [volume, setVolumeState] = useState(0.5);
  const { init: initSound, playTick, playWin, setSoundPack, startSpinSound, stopSpinSound, setVolume } = useSound();

  const handleVolumeChange = useCallback((v) => {
    setVolumeState(v);
    setVolume(v);
  }, [setVolume]);

  const handleSoundPackChange = useCallback((pack) => {
    setSoundPackState(pack);
    setSoundPack(pack);
  }, [setSoundPack]);

  const { isSpinning, currentAngle, winner, tickKey, spinOnce, spinSeries, setWinner, resetAngle } = useWheel({
    items: activeItems,
    onSpinEnd: () => {},
    playTick,
    playWin,
    startSpinSound,
    stopSpinSound,
  });

  useEffect(() => {
    const handler = () => { initSound(); window.removeEventListener('click', handler); };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [initSound]);

  // Reset normalExcluded when range/names change
  useEffect(() => {
    setNormalExcluded(new Set());
  }, [rangeMin, rangeMax, customNames, normalTab]);

  const excludeItem = useCallback((id) => {
    if (mode === 'ittop') {
      excludeStudent(id);
    } else {
      setNormalExcluded(prev => new Set(prev).add(id));
    }
  }, [mode, excludeStudent]);

  const effectiveRiggedId = rigEnabled ? riggedId : null;

  const handleSpin = useCallback(async () => {
    if (isSpinning || activeItems.length === 0) return;
    initSound();
    setSeriesResults([]);
    const speedLabel = SPEED_CONFIGS[speed]?.label || speed;

    if (seriesCount === 1) {
      const result = await spinOnce(speed, effectiveRiggedId);
      if (result) {
        setLastWinner(result);
        setSeriesResults([result]);
        setShowResult(true);
        addEntry({
          id: result.id,
          label: result.label,
          group: mode === 'ittop' ? selectedGroup : '',
          speed: speedLabel,
        });
      }
    } else {
      const results = [];
      const totalSpins = Math.min(seriesCount, activeItems.length);
      await spinSeries(
        totalSpins,
        speed,
        effectiveRiggedId,
        (result, idx) => {
          results.push(result);
          excludeItem(result.id);
          setSeriesResults([...results]);
        }
      );
      if (results.length > 0) {
        addSeriesEntry(results, results.length);
        setShowResult(true);
      }
    }
  }, [isSpinning, activeItems, seriesCount, speed, effectiveRiggedId, selectedGroup, mode, spinOnce, spinSeries, addEntry, addSeriesEntry, excludeItem, initSound]);

  const handleKeep = useCallback(() => {
    setShowResult(false);
    setWinner(null);
    setLastWinner(null);
  }, [setWinner]);

  const handleRemove = useCallback(() => {
    if (seriesResults.length > 1) {
      seriesResults.forEach(r => excludeItem(r.id));
    } else if (lastWinner) {
      excludeItem(lastWinner.id);
    }
    setShowResult(false);
    setWinner(null);
    setLastWinner(null);
  }, [lastWinner, seriesResults, excludeItem, setWinner]);

  const handleReset = useCallback(() => {
    resetAngle();
    resetExclusions();
    setNormalExcluded(new Set());
    setRiggedId(null);
    setRigEnabled(false);
    setSeriesResults([]);
    setShowResult(false);
    setLastWinner(null);
    setSeriesCount(1);
    setSpeed('normal');
    setRangeMin('');
    setRangeMax('');
    setCustomNames('');
  }, [resetAngle, resetExclusions]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Background />
      <Header mode={mode} onReset={handleReset} />

      {/* Mobile tabs */}
      <div className="flex lg:hidden px-4 mb-3 gap-2">
        {[
          { key: 'settings', label: 'Настройки' },
          { key: 'wheel', label: 'Колесо' },
          { key: 'history', label: 'История' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setMobilePanel(tab.key)}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-300 border ${
              mobilePanel === tab.key
                ? 'bg-[#C4A265]/12 border-[#C4A265]/20 text-white'
                : 'bg-white/4 border-white/8 text-white/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <main className="flex-1 overflow-hidden px-4 pb-4 lg:px-6 lg:pb-6">
        <div className="h-full grid grid-cols-1 lg:grid-cols-[minmax(280px,340px)_1fr_minmax(250px,300px)] gap-3 lg:gap-4">
          {/* Left — Settings */}
          <div className={`overflow-y-auto ${mobilePanel === 'settings' ? 'block' : 'hidden'} lg:block`}>
            <SettingsPanel
              mode={mode}
              setMode={setMode}
              normalTab={normalTab}
              setNormalTab={setNormalTab}
              rangeMin={rangeMin}
              setRangeMin={setRangeMin}
              rangeMax={rangeMax}
              setRangeMax={setRangeMax}
              customNames={customNames}
              setCustomNames={setCustomNames}
              normalItems={normalItems}
              riggedId={riggedId}
              setRiggedId={setRiggedId}
              rigEnabled={rigEnabled}
              setRigEnabled={setRigEnabled}
              groupNames={groupNames}
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
              allStudents={allStudents}
              excluded={excluded}
              toggleExclusion={toggleExclusion}
              resetExclusions={resetExclusions}
              loading={loading}
              speed={speed}
              setSpeed={setSpeed}
              seriesCount={seriesCount}
              setSeriesCount={setSeriesCount}
              arrowType={arrowType}
              setArrowType={setArrowType}
              onSpin={handleSpin}
              isSpinning={isSpinning}
              itemsCount={activeItems.length}
              soundPack={soundPack}
              setSoundPack={handleSoundPackChange}
              volume={volume}
              setVolume={handleVolumeChange}
            />
          </div>

          {/* Center — Wheel + spin button */}
          <div className={`flex flex-col items-center justify-center overflow-hidden relative z-10 ${mobilePanel === 'wheel' ? 'flex' : 'hidden'} lg:flex`}>
            {mode === 'ittop' && error ? (
              <LiquidGlass className="p-6 text-center" variant="card">
                <p className="text-white/70 text-sm">{error}</p>
              </LiquidGlass>
            ) : (
              <>
                <WheelContainer
                  items={activeItems}
                  rotationAngle={currentAngle}
                  arrowType={arrowType}
                  isSpinning={isSpinning}
                  tickKey={tickKey}
                />
                {/* Spin button below wheel — all screen sizes */}
                <button
                  onClick={handleSpin}
                  disabled={isSpinning || activeItems.length === 0}
                  className="mt-3 w-full max-w-xs py-3 rounded-2xl text-base font-bold tracking-wide transition-all duration-200 border bg-[#C4A265]/15 border-[#C4A265]/30 text-white disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 hover:bg-[#C4A265]/25 shrink-0"
                >
                  {isSpinning ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Вращается...
                    </span>
                  ) : (
                    <span>КРУТИТЬ{seriesCount > 1 ? ` (x${seriesCount})` : ''}</span>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Right — History */}
          <div className={`overflow-y-auto ${mobilePanel === 'history' ? 'block' : 'hidden'} lg:block`}>
            <HistoryPanel history={history} clearHistory={clearHistory} />
          </div>
        </div>
      </main>

      <ResultModal
        isOpen={showResult}
        onClose={handleKeep}
        winner={seriesResults.length === 1 ? seriesResults[0] : null}
        seriesResults={seriesResults.length > 1 ? seriesResults : null}
        onKeep={handleKeep}
        onRemove={handleRemove}
      />
    </div>
  );
}
