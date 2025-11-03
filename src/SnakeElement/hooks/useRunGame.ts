import { SnakeHtmlProps } from './makeUseSnakeHtmlProps';
import { useAnimationFrame } from './useAnimationFrame';
import { Point, EMPTY, FOOD, SNAKE, type GameState } from './useSnakeGame';

export const useRunGame = (gameState: GameState, htmlProps: SnakeHtmlProps) => {
  useAnimationFrame(() => {
    const { recompute } = gameState;
    const { snake, matrix } = gameState.current;

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

        const nextPointValue = matrix.getPointValue(nextPoint);
        if (nextPointValue === EMPTY || nextPointValue === FOOD) return nextPoint;

        return getDirection(directions.filter((_, index) => index !== dirIndex));
      };

      return getDirection(DIRECTIONS.slice());
    })();

    if (!nextEmpty) return recompute();

    if (matrix.getPointValue(nextEmpty) === EMPTY) {
      snake.removeTail();
    }

    matrix.setPointValue(nextEmpty, SNAKE);
  }, [htmlProps.intervalSpeed, gameState]);
};

const RIGHT_DIRECTION = { x: 1, y: 0 };
const DOWN_DIRECTION = { x: 0, y: 1 };
const LEFT_DIRECTION = { x: -1, y: 0 };
const UP_DIRECTION = { x: 0, y: -1 };

const DIRECTIONS = [RIGHT_DIRECTION, DOWN_DIRECTION, LEFT_DIRECTION, UP_DIRECTION];
