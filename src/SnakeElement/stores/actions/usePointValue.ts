import { useMemo, useSyncExternalStore } from 'react';
import { Point, MatrixValue, Subscribe } from '../snakeGame.types';

type SnakeContext = import('../snakeGame').SnakeContext;

export function usePointValue(this: SnakeContext['actions'], point: Point) {
  const key = `${point.x}-${point.y}` as const;

  return ({ getMetadata }: SnakeContext): MatrixValue => {
    const { subscribe, getSnapshot } = useMemo(() => {
      const subscribe: Subscribe = (callback) => {
        const { pointsSubscriptions } = getMetadata();

        pointsSubscriptions.set(key, callback);

        return () => {
          pointsSubscriptions.delete(key);
        };
      };

      const getSnapshot = () => {
        return this.getPointValue(point) as MatrixValue;
      };

      return { subscribe, getSnapshot };
    }, [getMetadata]);

    return useSyncExternalStore(subscribe, getSnapshot);
  };
}

export default usePointValue;
