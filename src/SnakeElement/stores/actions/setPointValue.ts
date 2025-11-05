import getRandomEmptyPoint from '../helpers/getRandomEmptyPoint';
import { Point, FOOD, SNAKE } from '../snakeGame.types';

type SnakeContext = import('../snakeGame').SnakeContext;

export function setPointValue(
  this: SnakeContext['actions'],
  point: Point,
  value: number
) {
  return ({ getMetadata, getState }: SnakeContext) => {
    const metadata = getMetadata();
    const htmlProps = getState();

    const currentValue = this.getPointValue(point);
    if (currentValue === FOOD) {
      metadata.remainApplesCount--;
    }

    if (value === SNAKE) {
      metadata.snakePositions.push(point);
      this.updateScore?.();
    }

    metadata.matrixValues[point.x + point.y * htmlProps.matrixSize] = value;
    metadata.pointsSubscriptions.get(`${point.x}-${point.y}`)?.();

    if (metadata.remainApplesCount === 0) {
      const emptyPoint = getRandomEmptyPoint(metadata.matrixValues);
      if (!emptyPoint) return this.createMatrix(htmlProps);

      this.setPointValue(emptyPoint, FOOD);
      metadata.remainApplesCount++;
    }
  };
}

export default setPointValue;
