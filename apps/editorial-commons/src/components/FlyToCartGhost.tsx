import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

export const FlyToCartGhost: React.FC = () => {
  const { flyState } = useCart();
  const [targetCoords, setTargetCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (flyState.active) {
      const bagBtn = document.getElementById('header-bag-btn');
      if (bagBtn) {
        const rect = bagBtn.getBoundingClientRect();
        setTargetCoords({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      }
    }
  }, [flyState.active]);

  if (!flyState.active) return null;

  const dx = targetCoords.x - flyState.startX;
  const dy = targetCoords.y - flyState.startY;

  return (
    <div
      className="flying-ghost-item"
      style={{
        left: `${flyState.startX}px`,
        top: `${flyState.startY}px`,
        '--target-x': `${dx}px`,
        '--target-y': `${dy}px`
      } as React.CSSProperties}
    >
      <div className="w-8 h-8 rounded-full bg-[#8b181b] border-2 border-white shadow-[0_0_15px_rgba(139,24,27,0.8)] flex items-center justify-center text-white text-xs font-bold">
        +1
      </div>
    </div>
  );
};
