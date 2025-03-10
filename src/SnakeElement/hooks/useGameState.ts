import { useCallback, useState, useSyncExternalStore } from 'react';
import { useStableState } from 'react-global-state-hooks/useStableState';
import { SnakeHtmlProps } from './makeUseSnakeHtmlProps';

export const useGameState = (htmlProps: SnakeHtmlProps) => {
  const [trigger, setState] = useState({});
  const restartGame = useCallback(() => setState({}), []);

  const gameWrapper = useStableState(() => {
    const values = new Uint8Array(htmlProps.matrix * htmlProps.matrix).fill(0);

    let applesCount = htmlProps.apples;
    const startPoint = getRandomEmptyPoint(values);
    const snakePositions: Point[] = [startPoint!];

    const subscriptions = new Map<`${number}-${number}`, () => void>();
    let updateScore: (() => void) | null = null;

    const getPointValue = (point: Point): MatrixValue | null => {
      const isXValid = point.x >= 0 && point.x < htmlProps.matrix;
      const isYValid = point.y >= 0 && point.y < htmlProps.matrix;
      if (!isXValid || !isYValid) return null;

      return values[point.x + point.y * htmlProps.matrix] as MatrixValue;
    };

    const setPointValue = (point: Point, value: number) => {
      const currentValue = getPointValue(point);
      if (currentValue === FOOD) {
        applesCount--;
      }

      if (value === SNAKE) {
        snakePositions.push(point);
        updateScore?.();
      }

      values[point.x + point.y * htmlProps.matrix] = value;
      subscriptions.get(`${point.x}-${point.y}`)?.();

      if (applesCount === 0) {
        const emptyPoint = getRandomEmptyPoint(values);
        if (!emptyPoint) return restartGame();

        setPointValue(emptyPoint, FOOD);
        applesCount++;
      }
    };

    const initialize = () => {
      setPointValue(startPoint!, SNAKE);

      new Array(applesCount).fill(0).forEach(() => setPointValue(getRandomEmptyPoint(values)!, FOOD));
    };

    const usePointValue = (point: Point) => {
      const subscribe: Subscribe = useCallback(
        (callback) => {
          subscriptions.set(`${point.x}-${point.y}`, callback);

          return () => {
            subscriptions.delete(`${point.x}-${point.y}`);
          };
        },
        [point]
      );

      const getSnapshot = useCallback(() => {
        return getPointValue(point) as MatrixValue;
      }, [point]);

      return useSyncExternalStore(subscribe, getSnapshot);
    };

    const useScore = () => {
      const subscribe: Subscribe = useCallback((callback) => {
        updateScore = callback;

        return () => {
          updateScore = null;
        };
      }, []);

      const getSnapshot = useCallback(() => {
        return snakePositions.length - 1;
      }, []);

      return useSyncExternalStore(subscribe, getSnapshot);
    };

    const snake = {
      getHead: () => snakePositions[snakePositions.length - 1],
      getTail: () => snakePositions[0] as Point,
      removeTail: () => {
        const tail = snakePositions.shift();
        if (!tail) return;

        setPointValue(tail, EMPTY);
        updateScore?.();
      },
    };

    const matrix = {
      values,
      getPointValue,
      setPointValue,
    };

    initialize();

    return [
      {
        matrix,
        snake,
        usePointValue,
        useScore,
      },
    ];
  }, [trigger, htmlProps.matrix, htmlProps.apples]);

  return { game: gameWrapper?.current ?? null, restartGame };
};

export const getRandomEmptyPoint = (matrix: Uint8Array): Point | null => {
  const size = Math.sqrt(matrix.length);

  if (!Number.isInteger(size)) {
    throw new Error(`Matrix is not a perfect square! Length: ${matrix.length}`);
  }

  const emptyIndexes = matrix.reduce((acc: number[], value, index) => {
    if (value === EMPTY) acc.push(index);
    return acc;
  }, []);

  if (!emptyIndexes.length) return null;

  const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];

  const point = {
    x: randomIndex % size,
    y: Math.floor(randomIndex / size),
  };

  const isPointValid = point.x >= 0 && point.x < size && point.y >= 0 && point.y < size;

  if (!isPointValid) {
    throw new Error(`Invalid point: ${JSON.stringify(point)}`);
  }

  return isPointValid ? point : getRandomEmptyPoint(matrix);
};

export type MatrixValue = 0 | 1 | 2;

export const EMPTY: MatrixValue = 0;
export const SNAKE: MatrixValue = 1;
export const FOOD: MatrixValue = 2;

export const EMPTY_ICON = '';
export const SNAKE_ICON = '🟩';
export const FOOD_ICON = '🍎';

export const iconsMap = {
  [EMPTY]: EMPTY_ICON,
  [SNAKE]: SNAKE_ICON,
  [FOOD]: FOOD_ICON,
};

export type Point = {
  x: number;
  y: number;
};

export type Subscribe = (callback: () => void) => () => void;

export type GameState = ReturnType<typeof useGameState>;
