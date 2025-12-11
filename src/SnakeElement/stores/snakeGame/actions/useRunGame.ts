import { useAnimationFrame } from '../../../hooks/useAnimationFrame';
import { Point, EMPTY, FOOD, SNAKE, DIRECTIONS } from '../snakeGame.types';

type SnakeContext = import('..').SnakeContext;

export function useRunGame(this: SnakeContext['actions']) {
  return ({ getMetadata, getState, use }: SnakeContext) => {
    const speedInterval = use.select(({ speedInterval }) => speedInterval);

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
