import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import {
  StateGetter,
  StateHook,
  StateSetter,
  createGlobalStateWithDecoupledFuncs,
} from 'react-global-state-hooks';

type TSnakeExampleState = {
  matrix?: number;
  snakeSize?: number;
  intervalSpeed?: number;
};

type SnakeExampleProps = {
  useExternalHook: StateHook<
    TSnakeExampleState,
    StateSetter<TSnakeExampleState>,
    null
  >;
};

type TSnakeCordinates = {
  x: number;
  y: number;
};

/**
 * The snake should move around the matrix in spiral.
 */
const getDirection = (
  prevSnakePositions: TSnakeCordinates[],
  props: TSnakeExampleState
): TSnakeCordinates => {
  const lastSnakePosition = prevSnakePositions[prevSnakePositions.length - 1];

  // If the snake is in the top left corner, it should move right.
  if (lastSnakePosition.x === 0 && lastSnakePosition.y === 0) {
    return { x: 1, y: 0 }; // right
  }

  // If the snake is in the top right corner, it should move down.
  if (lastSnakePosition.x === props.matrix - 1 && lastSnakePosition.y === 0) {
    return { x: 0, y: 1 }; // down
  }

  // If the snake is in the bottom right corner, it should move left.
  if (
    lastSnakePosition.x === props.matrix - 1 &&
    lastSnakePosition.y === props.matrix - 1
  ) {
    return { x: -1, y: 0 }; // left
  }

  // If the snake is in the bottom left corner, it should move up.
  if (lastSnakePosition.x === 0 && lastSnakePosition.y === props.matrix - 1) {
    return { x: 0, y: -1 }; // up
  }

  // If the snake is in the top row, it should move right.
  if (lastSnakePosition.x === 0) {
    return { x: 0, y: -1 }; // up
  }

  // If the snake is in the right column, it should move down.
  if (lastSnakePosition.y === 0) {
    return { x: 1, y: 0 }; // right
  }

  // If the snake is in the bottom row, it should move left.
  if (lastSnakePosition.x === props.matrix - 1) {
    return { x: 0, y: 1 }; // down
  }

  // If the snake is in the left column, it should move up.
  if (lastSnakePosition.y === props.matrix - 1) {
    return { x: -1, y: 0 }; // left
  }

  return { x: 1, y: 0 }; // right
};

const SnakeExample: React.FC<SnakeExampleProps> = ({ useExternalHook }) => {
  const [props] = useExternalHook();

  const [snakePositions, setSnakePositions] = useState<TSnakeCordinates[]>(
    () => {
      const snakePositions: TSnakeCordinates[] = [];

      snakePositions.push(
        ...new Array(props.snakeSize)
          .fill(0)
          .map((_, index) => ({ x: index, y: 0 }))
      );
      return snakePositions;
    }
  );

  const matrixIndexs = useMemo(() => {
    return new Array(props.matrix).fill(0).map((_, index) => index);
  }, [props.matrix]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSnakePositions((prevSnakePositions) => {
        const newSnakePositions = [...prevSnakePositions];
        const direction = getDirection(prevSnakePositions, props);

        newSnakePositions.push({
          x: prevSnakePositions[prevSnakePositions.length - 1].x + direction.x,
          y: prevSnakePositions[prevSnakePositions.length - 1].y + direction.y,
        });

        newSnakePositions.shift();

        return newSnakePositions;
      });
    }, props.intervalSpeed);

    return () => clearInterval(interval);
  }, [props]);

  return (
    <div
      className='grid w-fit'
      style={{ gridTemplateColumns: `repeat(${props.matrix}, 1fr)` }}
    >
      {matrixIndexs.map((rowIndex) => {
        return matrixIndexs.map((columnIndex) => {
          return (
            <div
              key={`${rowIndex}-${columnIndex}`}
              className={`w-6 h-6 border border-gray-400 ${
                snakePositions.some(
                  (snakePosition) =>
                    snakePosition.x === columnIndex &&
                    snakePosition.y === rowIndex
                )
                  ? 'bg-blue-500'
                  : ''
              }`}
            />
          );
        });
      })}
    </div>
  );
};

class SnakeGame extends HTMLElement {
  public static selector = 'snake-game';

  private static _propsMap: Map<string, string> = new Map([
    ['matrix', 'matrix'],
    ['snake-size', 'snakeSize'],
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

    this.hook = createGlobalStateWithDecoupledFuncs({
      matrix: 10,
      snakeSize: 5,
      intervalSpeed: 1000,
    } as TSnakeExampleState);
  }

  private hook: [
    hook: StateHook<TSnakeExampleState, StateSetter<TSnakeExampleState>, null>,
    getter: StateGetter<TSnakeExampleState>,
    setter: StateSetter<TSnakeExampleState>
  ];

  connectedCallback() {
    const [useExternalHook] = this.hook;
    const snakeExample = <SnakeExample useExternalHook={useExternalHook} />;

    createRoot(this).render(snakeExample);
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

    const [, getProps, setProps] = this.hook;

    const propName = SnakeGame._propsMap.get(name) as keyof TSnakeExampleState;
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

  snakeGame.setAttribute('matrix', '10');
  snakeGame.setAttribute('snake-size', '5');
  snakeGame.setAttribute('interval-speed', '100');

  document.getElementById('html-content').prepend(snakeGame);
});
