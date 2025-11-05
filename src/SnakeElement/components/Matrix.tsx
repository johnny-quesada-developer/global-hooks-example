import React, { useMemo } from 'react';
import { Cell } from './Cell';
import { useMatrixSize } from '../stores/snakeGame';

export const Matrix: React.FC = () => {
  const matrixSize = useMatrixSize();

  return useMemo(() => {
    const cells: JSX.Element[] = [];

    for (let rowIndex = 0; rowIndex < matrixSize; rowIndex++) {
      for (let columnIndex = 0; columnIndex < matrixSize; columnIndex++) {
        const point = { x: columnIndex, y: rowIndex };

        cells.push(<Cell key={`${rowIndex}-${columnIndex}`} point={point} />);
      }
    }

    return cells;
  }, [matrixSize]);
};

export default Matrix;
