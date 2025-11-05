import { MatrixValue, Point } from '../snakeGame.types';

type SnakeContext = import('../snakeGame').SnakeContext;

export function getPointValue(this: SnakeContext['actions'], point: Point) {
  return ({ getMetadata, getState }: SnakeContext): MatrixValue | null => {
    const { matrixValues } = getMetadata();
    const { matrixSize } = getState();

    const isXValid = point.x >= 0 && point.x < matrixSize;
    const isYValid = point.y >= 0 && point.y < matrixSize;
    if (!isXValid || !isYValid) return null;

    return matrixValues[point.x + point.y * matrixSize] as MatrixValue;
  };
}

export default getPointValue;
