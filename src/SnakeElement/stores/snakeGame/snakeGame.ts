import createContext, { InferContextApi } from 'react-global-state-hooks/createContext';
import type { Point, SnakeApi } from './snakeGame.types';

import createMatrix from './actions/createMatrix';
import getPointValue from './actions/getPointValue';
import setPointValue from './actions/setPointValue';
import useRunGame from './actions/useRunGame';
import printMatrix from './actions/printMatrix';
import usePointValue from './actions/usePointValue';
import useScore from './actions/useScore';
import updateScore from './actions/updateScore';

export type SnakeContext = InferContextApi<typeof snakeGame.Context>;

export const initialValue = {
  matrixSize: 11,
  applesCount: 10,
  speedInterval: 100,
  showRenders: false,
};

const snakeGame = createContext(() => ({ ...initialValue }), {
  metadata: () => ({
    matrixValues: new Uint8Array(0),
    remainApplesCount: 0,
    snakePositions: [] as Point[],
    snake: null as SnakeApi | null,

    /**
     * manually handle subscriptions for better performance,
     * this object should not be reassigned
     */
    pointsSubscriptions: new Map<`${number}-${number}`, () => void>(),
    scoreSubscriptions: new Set<() => void>(),
  }),
  actions: {
    createMatrix,
    setPointValue,
    getPointValue,
    updateScore,
    usePointValue,
    useScore,
    useRunGame,
    printMatrix,
  },
});

export default snakeGame;
