import getRandomEmptyPoint from '../helpers/getRandomEmptyPoint';
import { EMPTY, FOOD, Point, SNAKE, SnakeApi, htmlAttr } from '../snakeGame.types';

type SnakeContext = import('../snakeGame').SnakeContext;

export function createMatrix(this: SnakeContext['actions'], attrs: htmlAttr) {
  return ({ setState, getState, getMetadata }: SnakeContext) => {
    const metadata = getMetadata();

    const newState = { ...getState(), ...attrs };

    const matrixDimension = newState.matrixSize * newState.matrixSize;
    const matrixValues = new Uint8Array(matrixDimension).fill(0);
    const startPoint = getRandomEmptyPoint(matrixValues);
    const snakePositions: Point[] = [startPoint!];

    const snake: SnakeApi = {
      getHead: () => snakePositions[snakePositions.length - 1],
      getTail: () => snakePositions[0] as Point,
      removeTail: () => {
        const tail = snakePositions.shift();
        if (!tail) return;

        this.setPointValue(tail, EMPTY);
        this.updateScore();
      },
    };

    Object.assign(metadata, {
      snakePositions,
      snake,
      remainApplesCount: attrs.applesCount,
      matrixValues,
    });

    setState(newState);

    // set first snake position
    this.setPointValue(startPoint!, SNAKE);

    // add apples
    new Array(metadata.remainApplesCount)
      .fill(0)
      .forEach(() => this.setPointValue(getRandomEmptyPoint(matrixValues)!, FOOD));

    // update all points
    metadata.pointsSubscriptions.forEach((callback) => callback());
    metadata.scoreSubscriptions.forEach((callback) => callback());
  };
}

export default createMatrix;
