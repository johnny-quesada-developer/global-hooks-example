import React, { useEffect, useSyncExternalStore, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import type {
  BaseMetadata,
  StateHook,
  StateSetter,
} from 'react-global-state-hooks/types';
import { createGlobalState } from 'react-global-state-hooks/createGlobalState';
import { useStableState } from 'react-global-state-hooks';

type SnakeMatrixState = {
  matrix: number;
  intervalSpeed: number;
};

type SnakeProps = {
  useSnakeHtmlProps: StateHook<
    SnakeMatrixState,
    StateSetter<SnakeMatrixState>,
    BaseMetadata
  >;
};

type Point = {
  x: number;
  y: number;
};

type MatrixValue = 0 | 1 | 2;

const EMPTY: MatrixValue = 0;
const SNAKE: MatrixValue = 1;
const FOOD: MatrixValue = 2;

const EMPTY_ICON = '';
const SNAKE_ICON = '🟢';
const FOOD_ICON = '🍎';

const iconsMap = {
  [EMPTY]: EMPTY_ICON,
  [SNAKE]: SNAKE_ICON,
  [FOOD]: FOOD_ICON,
}

const RIGHT_DIRECTION = { x: 1, y: 0 };
const DOWN_DIRECTION = { x: 0, y: 1 };
const LEFT_DIRECTION = { x: -1, y: 0 };
const UP_DIRECTION = { x: 0, y: -1 };

const DIRECTIONS = [RIGHT_DIRECTION, DOWN_DIRECTION, LEFT_DIRECTION, UP_DIRECTION];

const SnakeExample: React.FC<SnakeProps> = ({ useSnakeHtmlProps }) => {
  const [htmlProps] = useSnakeHtmlProps();

  const [state, recomputeState] = useStableState(() => {
    // plain array of indexes
    const matrix = new Uint8Array(htmlProps.matrix * htmlProps.matrix).fill(0);
    const subscriptions = new Map<`${number}-${number}`, () => void>();
    const scoreSubscriptions = new Set<() => void>();

    const getPointValue = (point: Point): MatrixValue | null => {
      const isXValid = point.x >= 0 && point.x < htmlProps.matrix;
      const isYValid = point.y >= 0 && point.y < htmlProps.matrix;

      if (!isXValid || !isYValid) return null;

      return (matrix[point.x + point.y * htmlProps.matrix]) as MatrixValue;
    };

    const updateScore = () => {
      for (const sub of scoreSubscriptions) {
        sub();
      }
    };

    const setPointValue = (point: Point, value: number) => {     
      // add snake position
      if (value === SNAKE) {
        snakePositions.push(point);

        updateScore();
      }

      matrix[point.x + point.y * htmlProps.matrix] = value;

      subscriptions.get(`${point.x}-${point.y}`)?.();
    }

    const startPoint = getRandomEmptyPoint(matrix);
    const snakePositions = [startPoint];

    setPointValue(startPoint, SNAKE);
    new Array(10).fill(0).forEach(() => setPointValue(getRandomEmptyPoint(matrix), FOOD));

    const usePointValue = (point: Point) => {
      const subscribe = useCallback((callback: () => void) => {
        subscriptions.set(`${point.x}-${point.y}`, callback);

        return () => {
          subscriptions.delete(`${point.x}-${point.y}`);
        };
      }, [point]);

      const getSnapshot = useCallback(() => {
        return getPointValue(point);
      }, [point]);

      return useSyncExternalStore(
        subscribe,
        getSnapshot
      );
    };

    const useScore = () => {
      const subscribe = useCallback((callback: () => void) => {
        scoreSubscriptions.add(callback);

        return () => {
          scoreSubscriptions.delete(callback);
        };
      }, []);

      const getSnapshot = useCallback(() => {
        return snakePositions.length - 1;
      }, []);

      return useSyncExternalStore(
        subscribe,
        getSnapshot
      );
    };

    const snake = {
      getHead: () => snakePositions[snakePositions.length - 1],
      getTail: () => snakePositions[0],
      removeTail: () => {
        const tail = snakePositions.shift();
        setPointValue(tail, EMPTY);

        updateScore();
      },
    }

    return {
      useScore,
      usePointValue,
      snake,
      setPointValue,
      matrix,
      getPointValue,
    }
  }, [htmlProps.matrix]);

  useAnimationFrame(() => {
    const { snake } = state.value;

    const head = snake.getHead();
    const nextEmpty = (() => {
      const getDirection = (directions: Point[]): Point | null => {
        if (!directions.length) return null;

        const dirIndex = Math.floor(Math.random() * directions.length);
        const direction = directions[dirIndex];

        const nextPoint = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        const nextPointValue = state.value.getPointValue(nextPoint);
        if (nextPointValue === EMPTY || nextPointValue === FOOD) return nextPoint;

        return getDirection(directions.filter((_, index) => index !== dirIndex));
      };

      return getDirection(DIRECTIONS.slice());
    })();

    if (!nextEmpty) return recomputeState();

    if (state.value.getPointValue(nextEmpty) === EMPTY) {
      snake.removeTail();
    }

    state.value.setPointValue(nextEmpty, SNAKE);
  }, [htmlProps.intervalSpeed, state]);

  return (
    <>
      <Score useScore={state.value.useScore} />
      <div
        className='grid w-fit'
        style={{ gridTemplateColumns: `repeat(${htmlProps.matrix}, 1fr)` }}
      >
        {(() => {
          const cells: JSX.Element[] = [];

          for (let rowIndex = 0; rowIndex < htmlProps.matrix; rowIndex++) {
            for (let columnIndex = 0; columnIndex < htmlProps.matrix; columnIndex++) {
              const point = { x: columnIndex, y: rowIndex };

              cells.push(
                <Cell
                  key={`${rowIndex}-${columnIndex}`}
                  point={point}
                  usePointValue={state.value.usePointValue}
                />
              );
            }
          }

          return cells;
        })()}
      </div>
    </>
  );
};

const Score: React.FC<{ useScore: () => number }> = ({ useScore }) => {
  const score = useScore();

  return (
    <div className='flex items-center gap-2'>
      <span>Score:</span>
      <span>{score}</span>
    </div>
  );
}

const Cell: React.FC<{ point: Point, usePointValue: (point: Point) => MatrixValue }> = ({ point, usePointValue }) => {
  const pointValue = usePointValue(point);
  const icon = iconsMap[pointValue];

  // count renders
  const renderCountRef = React.useRef(0);
  renderCountRef.current += 1;

  return (
    <div
      className={`w-6 h-6 border border-gray-400 flex items-center justify-center`}
    >{icon}</div>
  );
}

const useAnimationFrame = (callback: () => void, [intervalSpeed, ...dependencies]: readonly [intervalSpeed: number, ...dependencies: unknown[]]
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
    }

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [callbackRef, intervalSpeed, ...dependencies]);
};

const getRandomEmptyPoint = (matrix: Uint8Array): Point | null => {
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

class SnakeGame extends HTMLElement {
  public static selector = 'snake-game';

  private static _propsMap: Map<string, string> = new Map([
    ['matrix', 'matrix'],
    ['interval-speed', 'intervalSpeed'],
  ]);

  /**
   * Observe the attributes you care about updating
   */
  static get observedAttributes() {
    return Array.from(SnakeGame._propsMap.keys());
  }

  constructor() {
    super();

    const initialState: SnakeMatrixState = {
      matrix: 10,
      intervalSpeed: 100,
    }

    this.useSnakeHtmlProps = createGlobalState(initialState);
  }

  private useSnakeHtmlProps: StateHook<SnakeMatrixState, StateSetter<SnakeMatrixState>, BaseMetadata>;

  connectedCallback() {
    createRoot(this).render(<SnakeExample useSnakeHtmlProps={this.useSnakeHtmlProps} />);
  }

  /**
   * Update the state of the component when attribute values change.
   */
  attributeChangedCallback(
    name: string,
    _oldValue: string,
    newValueString: string
  ) {
    const isProp = SnakeGame._propsMap.has(name);

    if (!isProp) return;

    const [getProps, setProps] = this.useSnakeHtmlProps.stateControls();

    const propName = SnakeGame._propsMap.get(name) as keyof SnakeMatrixState;
    const newValue = parseInt(newValueString ?? '0');
    const currentValue = getProps()[propName];

    if (newValueString === undefined || newValue === currentValue) return;

    setProps((prevProps) => ({
      ...prevProps,
      [propName]: newValue,
    }));
  }
}



document.addEventListener('DOMContentLoaded', () => {
  customElements.define(SnakeGame.selector, SnakeGame);

  const snakeGame = document.createElement(SnakeGame.selector);

  document.getElementById('html-content').prepend(snakeGame);

  snakeGame.setAttribute('matrix', '10');
  snakeGame.setAttribute('interval-speed', '100');
});
