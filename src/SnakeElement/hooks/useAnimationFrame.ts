import { useEffect } from 'react';
import { useStableState } from 'react-global-state-hooks/useStableState';

export const useAnimationFrame = (
  callback: () => void,
  [intervalSpeed, ...dependencies]: readonly [intervalSpeed: number, ...dependencies: unknown[]]
) => {
  // recomputes all the time keeping the more recent callback
  const [callbackRef] = useStableState(() => callback);

  useEffect(() => {
    let lastTime = 0;
    let animationId = 0;

    const animate = (time: number) => {
      const shouldUpdate = time - lastTime >= intervalSpeed;
      if (shouldUpdate) {
        lastTime = time;
        callbackRef.value();
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [callbackRef, intervalSpeed, ...dependencies]);
};
