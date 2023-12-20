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

const RIGHT_DIRECTION = { x: 1, y: 0 };
const DOWN_DIRECTION = { x: 0, y: 1 };
const LEFT_DIRECTION = { x: -1, y: 0 };
const UP_DIRECTION = { x: 0, y: -1 };

const getDirection = (
  prevSnakePositions: TSnakeCordinates[],
  props: TSnakeExampleState
): TSnakeCordinates => {
  const lastSnakePosition = prevSnakePositions[prevSnakePositions.length - 1];

  const isSnakeInTopLeftCorner =
    lastSnakePosition.x === 0 && lastSnakePosition.y === 0;

  if (isSnakeInTopLeftCorner) return RIGHT_DIRECTION;

  const isSnakeInTopRightCorner =
    lastSnakePosition.x === props.matrix - 1 && lastSnakePosition.y === 0;

  if (isSnakeInTopRightCorner) return DOWN_DIRECTION;

  const isSnakeInBottomRightCorner =
    lastSnakePosition.x === props.matrix - 1 &&
    lastSnakePosition.y === props.matrix - 1;

  if (isSnakeInBottomRightCorner) return LEFT_DIRECTION;

  const isSnakeInBottomLeftCorner =
    lastSnakePosition.x === 0 && lastSnakePosition.y === props.matrix - 1;

  if (isSnakeInBottomLeftCorner) return UP_DIRECTION;

  const isSnakeInTopRow = lastSnakePosition.x === 0;

  if (isSnakeInTopRow) return UP_DIRECTION;

  const isSnakeInRightColumn = lastSnakePosition.y === 0;

  if (isSnakeInRightColumn) return RIGHT_DIRECTION;

  const isSnakeInBottomRow = lastSnakePosition.x === props.matrix - 1;

  if (isSnakeInBottomRow) return DOWN_DIRECTION;

  const isSnakeInLeftColumn = lastSnakePosition.y === props.matrix - 1;

  if (isSnakeInLeftColumn) return LEFT_DIRECTION;

  return RIGHT_DIRECTION;
};

const SnakeExample: React.FC<SnakeExampleProps> = ({ useExternalHook }) => {
  const [props] = useExternalHook();

  const [snakePositions, setSnakePositions] = useState<TSnakeCordinates[]>([]);

  const matrixIndexs = useMemo(() => {
    return new Array(props.matrix).fill(0).map((_, index) => index);
  }, [props.matrix]);

  useEffect(() => {
    const snakePositions: TSnakeCordinates[] = [];

    snakePositions.push(
      ...new Array(props.snakeSize)
        .fill(0)
        .map((_, index) => ({ x: index, y: 0 }))
    );

    setSnakePositions(snakePositions);
  }, [props.matrix, props.snakeSize]);

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

    this.state = createGlobalStateWithDecoupledFuncs({
      matrix: 10,
      snakeSize: 5,
      intervalSpeed: 1000,
    } as TSnakeExampleState);
  }

  private state: [
    hook: StateHook<TSnakeExampleState, StateSetter<TSnakeExampleState>, null>,
    getter: StateGetter<TSnakeExampleState>,
    setter: StateSetter<TSnakeExampleState>
  ];

  connectedCallback() {
    const [useExternalHook] = this.state;

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

    const [, getProps, setProps] = this.state;

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

  document.getElementById('html-content').prepend(snakeGame);

  snakeGame.setAttribute('matrix', '10');
  snakeGame.setAttribute('snake-size', '5');
  snakeGame.setAttribute('interval-speed', '100');
});
