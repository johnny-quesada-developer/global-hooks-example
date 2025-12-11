import { Point, EMPTY } from '../snakeGame.types';

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

export default getRandomEmptyPoint;
