import { useAnimationFrame } from '../../hooks/useAnimationFrame';
import { Point, EMPTY, FOOD, SNAKE, DIRECTIONS } from '../snakeGame.types';
import snakeGame from '../../stores/snakeGame';

type SnakeContext = import('../../stores/snakeGame').SnakeContext;

export function useRunGame(this: SnakeContext['actions']) {
  return ({ getMetadata, getState }: SnakeContext) => {
    const speedInterval = snakeGame.use.select(({ speedInterval }) => speedInterval);

    useAnimationFrame(() => {
      const { snake } = getMetadata();
      if (!snake) return;

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

          const nextPointValue = this.getPointValue(nextPoint);
          if (nextPointValue === EMPTY || nextPointValue === FOOD) return nextPoint;

          return getDirection(directions.filter((_, index) => index !== dirIndex));
        };

        return getDirection(DIRECTIONS.slice());
      })();

      if (!nextEmpty) return this.createMatrix(getState());

      if (this.getPointValue(nextEmpty) === EMPTY) {
        snake.removeTail();
      }

      this.setPointValue(nextEmpty, SNAKE);
    }, [speedInterval]);
  };
}

export default useRunGame;
