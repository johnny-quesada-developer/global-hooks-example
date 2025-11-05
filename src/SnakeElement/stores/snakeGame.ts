import { useMemo, useSyncExternalStore } from 'react';
import createContext, { InferContextApi } from 'react-global-state-hooks/createContext';
import useRunGame from './actions/useRunGame';

export const initialValue = {
  matrixSize: 11,
  applesCount: 10,
  speedInterval: 100,
  showRenders: false,
};

const initialMetadata = {
  matrixValues: new Uint8Array(0),
  remainApplesCount: 0,
  snakePositions: [] as Point[],
  snake: null as unknown as SnakeApi,

  // manually handle subscriptions for better performance
  pointsSubscriptions: new Map<`${number}-${number}`, () => void>(),
  scoreSubscriptions: new Set<() => void>(),
};

export type SnakeContext = InferContextApi<typeof snakeGame.Context>;

const snakeGame = createContext(initialValue, {
  metadata: initialMetadata,
  actions: {
    /**
     * Initializes the game state
     */
    createMatrix(attrs: htmlAttr) {
      const actions = this as SnakeContext['actions'];

      return ({ setState, getState, setMetadata }) => {
        const newState = { ...getState(), ...attrs };

        const matrixDimension = newState.matrixSize * newState.matrixSize;
        const matrixValues = new Uint8Array(matrixDimension).fill(0);
        const startPoint = getRandomEmptyPoint(matrixValues);
        const snakePositions: Point[] = [startPoint!];
        const pointsSubscriptions = new Map<`${number}-${number}`, () => void>();
        const scoreSubscriptions = new Set<() => void>();

        const snake: SnakeApi = {
          getHead: () => snakePositions[snakePositions.length - 1],
          getTail: () => snakePositions[0] as Point,
          removeTail: () => {
            const tail = snakePositions.shift();
            if (!tail) return;

            actions.setPointValue(tail, EMPTY);
            actions.updateScore();
          },
        };

        const metadata = {
          matrixValues,
          pointsSubscriptions,
          remainApplesCount: attrs.applesCount,
          scoreSubscriptions,
          snake,
          snakePositions,
        };

        setMetadata(metadata);
        setState(newState);

        // set first snake position
        actions.setPointValue(startPoint!, SNAKE);

        // add apples
        new Array(metadata.remainApplesCount).fill(0).forEach(() => actions.setPointValue(getRandomEmptyPoint(matrixValues)!, FOOD));

        queueMicrotask(() => {
          console.log('--- New Matrix ---');
          actions.printMatrix();
        });
      };
    },

    getPointValue(point: Point) {
      return ({ getMetadata, getState }): MatrixValue | null => {
        const { matrixValues } = getMetadata();
        const { matrixSize } = getState();

        const isXValid = point.x >= 0 && point.x < matrixSize;
        const isYValid = point.y >= 0 && point.y < matrixSize;
        if (!isXValid || !isYValid) return null;

        return matrixValues[point.x + point.y * matrixSize] as MatrixValue;
      };
    },

    setPointValue(point: Point, value: number) {
      const actions = this as SnakeContext['actions'];

      return ({ getMetadata, getState }) => {
        const metadata = getMetadata();
        const htmlProps = getState();

        const currentValue = actions.getPointValue(point);
        if (currentValue === FOOD) {
          metadata.remainApplesCount--;
        }

        if (value === SNAKE) {
          metadata.snakePositions.push(point);
          actions.updateScore?.();
        }

        metadata.matrixValues[point.x + point.y * htmlProps.matrixSize] = value;
        metadata.pointsSubscriptions.get(`${point.x}-${point.y}`)?.();

        if (metadata.remainApplesCount === 0) {
          const emptyPoint = getRandomEmptyPoint(metadata.matrixValues);
          if (!emptyPoint) return actions.createMatrix(htmlProps);

          actions.setPointValue(emptyPoint, FOOD);
          metadata.remainApplesCount++;
        }
      };
    },

    updateScore() {
      return ({ getMetadata }) => {
        const { scoreSubscriptions } = getMetadata();

        scoreSubscriptions.forEach((callback) => callback());
      };
    },

    usePointValue(point: Point) {
      const key = `${point.x}-${point.y}` as const;
      const actions = this as SnakeContext['actions'];

      return ({ getMetadata }) => {
        const { subscribe, getSnapshot } = useMemo(() => {
          const subscribe: Subscribe = (callback) => {
            const { pointsSubscriptions } = getMetadata();

            pointsSubscriptions.set(key, callback);

            return () => {
              pointsSubscriptions.delete(key);
            };
          };

          const getSnapshot = () => {
            return actions.getPointValue(point) as MatrixValue;
          };

          return { subscribe, getSnapshot };
        }, [getMetadata]);

        return useSyncExternalStore(subscribe, getSnapshot);
      };
    },

    useScore() {
      return ({ getMetadata }) => {
        const { subscribe, getSnapshot } = useMemo(() => {
          const subscribe: Subscribe = (callback) => {
            const { scoreSubscriptions } = getMetadata();

            scoreSubscriptions.add(callback);

            return () => {
              scoreSubscriptions.delete(callback);
            };
          };

          const getSnapshot = () => {
            const { snakePositions } = getMetadata();

            return snakePositions.length - 1;
          };

          return { subscribe, getSnapshot };
        }, [getMetadata]);

        return useSyncExternalStore(subscribe, getSnapshot);
      };
    },

    useRunGame,

    printMatrix() {
      return ({ getMetadata, getState }) => {
        const { matrixValues } = getMetadata();
        const { matrixSize } = getState();

        for (let y = 0; y < matrixSize; y++) {
          let row = '   ';
          for (let x = 0; x < matrixSize; x++) {
            const value = matrixValues[x + y * matrixSize] as MatrixValue;
            row += value + '   ';
          }
          console.log(`${y > 9 ? y : `${y} `}:`, row);
        }

        console.log('----------------------------------------');
      };
    },
  },
  callbacks: {
    onInit({ actions, getState }) {
      actions.createMatrix(getState());
    },
  },
});

export type MatrixValue = 0 | 1 | 2;

export const EMPTY: MatrixValue = 0;
export const SNAKE: MatrixValue = 1;
export const FOOD: MatrixValue = 2;

const EMPTY_ICON = '';
const SNAKE_ICON = '🟩';
const FOOD_ICON = '🍎';

export const iconsMap = {
  [EMPTY]: EMPTY_ICON,
  [SNAKE]: SNAKE_ICON,
  [FOOD]: FOOD_ICON,
};

export type Point = {
  x: number;
  y: number;
};

type Subscribe = (callback: () => void) => () => void;

type htmlAttr = {
  matrixSize: number;
  applesCount: number;
  speedInterval: number;
  showRenders: boolean;
};

function getRandomEmptyPoint(matrix: Uint8Array): Point | null {
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
}

type SnakeApi = {
  getHead: () => Point;
  getTail: () => Point;
  removeTail: () => void;
};

export const useMatrixSize = snakeGame.use.createSelectorHook((state) => state.matrixSize);

export default snakeGame;
