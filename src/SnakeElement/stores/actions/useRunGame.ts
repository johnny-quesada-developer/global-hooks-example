import { useAnimationFrame } from '../../hooks/useAnimationFrame';
import snakeGame, { EMPTY, FOOD, SNAKE, type Point } from '../../stores/snakeGame';

type SnakeContext = import('../../stores/snakeGame').SnakeContext;

export function useRunGame(this: SnakeContext['actions']) {
  return ({ actions, getMetadata, getState }: SnakeContext) => {
    const [speedInterval] = snakeGame.use(({ speedInterval }) => speedInterval);

    useAnimationFrame(() => {
      const { snake } = getMetadata();

      actions.printMatrix();

      const nextEmpty = (() => {
        const head = snake.getHead();

        const getDirection = (directions: Point[]): Point | null => {
          if (!directions.length) return null;

          const dirIndex = Math.floor(Math.random() * directions.length);
          const direction = directions[dirIndex];

          const nextPoint = {
            x: head.x + direction.x,
            y: head.y + direction.y,
          };

          const nextPointValue = actions.getPointValue(nextPoint);
          if (nextPointValue === EMPTY || nextPointValue === FOOD) return nextPoint;

          return getDirection(directions.filter((_, index) => index !== dirIndex));
        };

        return getDirection(DIRECTIONS.slice());
      })();

      if (!nextEmpty) return actions.createMatrix(getState());

      if (actions.getPointValue(nextEmpty) === EMPTY) {
        snake.removeTail();
      }

      actions.setPointValue(nextEmpty, SNAKE);
    }, [speedInterval]);
  };
}

const RIGHT_DIRECTION = { x: 1, y: 0 };
const DOWN_DIRECTION = { x: 0, y: 1 };
const LEFT_DIRECTION = { x: -1, y: 0 };
const UP_DIRECTION = { x: 0, y: -1 };

const DIRECTIONS = [RIGHT_DIRECTION, DOWN_DIRECTION, LEFT_DIRECTION, UP_DIRECTION];

export default useRunGame;
