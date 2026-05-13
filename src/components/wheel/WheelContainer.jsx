import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import WheelCanvas from './WheelCanvas';
import WheelArrows from './WheelArrows';
import { ARROW_TYPES } from '../../utils/constants';

function WheelContainerInner({ items, rotationAngle, arrowType, isSpinning, tickKey = 0 }) {
  const [wheelSize, setWheelSize] = useState(340);
  const containerRef = useRef(null);
  const arrow = ARROW_TYPES[arrowType] || ARROW_TYPES.classic;

  const calcSize = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;
    // Use actual container dimensions for zoom-friendly sizing
    const rect = parent.getBoundingClientRect();
    const available = Math.min(rect.width - 24, rect.height - 80);
    setWheelSize(Math.max(200, Math.min(available, 560)));
  }, []);

  useEffect(() => {
    calcSize();
    const ro = new ResizeObserver(calcSize);
    const parent = containerRef.current?.parentElement;
    if (parent) ro.observe(parent);
    return () => ro.disconnect();
  }, [calcSize]);

  return (
    <div ref={containerRef} className="relative flex items-center justify-center flex-shrink-0">
      {/* Glass ring */}
      <div
        className="relative rounded-full flex-shrink-0"
        style={{
          padding: '8px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(196, 162, 101, 0.15)',
        }}
      >
        <WheelArrows type={arrowType} color={arrow.color} bouncing={!isSpinning} tickKey={isSpinning ? tickKey : 0} />

        <div className="rounded-full overflow-hidden">
          <WheelCanvas items={items} rotationAngle={rotationAngle} size={wheelSize} />
        </div>
      </div>
    </div>
  );
}

export default memo(WheelContainerInner);
