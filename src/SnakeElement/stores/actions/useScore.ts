import { useMemo, useSyncExternalStore } from 'react';
import { Subscribe } from '../snakeGame.types';

type SnakeContext = import('../snakeGame').SnakeContext;

/*
 * Hook to get the current score of the snake game
 */
export function useScore(this: SnakeContext['actions']) {
  return ({ getMetadata }: SnakeContext) => {
    const { subscribe, getSnapshot } = useMemo(() => {
      const metadata = getMetadata();

      const subscribe: Subscribe = (callback) => {
        metadata.scoreSubscriptions.add(callback);

        return () => {
          metadata.scoreSubscriptions.delete(callback);
        };
      };

      const getSnapshot = () => {
        return metadata.snakePositions.length - 1;
      };

      return { subscribe, getSnapshot };
    }, [getMetadata]);

    return useSyncExternalStore(subscribe, getSnapshot);
  };
}

export default useScore;
