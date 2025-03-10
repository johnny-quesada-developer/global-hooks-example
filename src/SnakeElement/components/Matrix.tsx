import React, { useMemo } from 'react';
import { Cell } from './Cell';
import type { useGameState } from '../hooks/useGameState';
import { SnakeHtmlProps } from '../hooks/makeUseSnakeHtmlProps';

export type MatrixProps = {
  game: ReturnType<typeof useGameState>;
  snakeHtmlProps: SnakeHtmlProps;
};

export const Matrix: React.FC<MatrixProps> = ({ game, snakeHtmlProps }: MatrixProps) => {
  return useMemo(() => {
    const cells: JSX.Element[] = [];

    for (let rowIndex = 0; rowIndex < snakeHtmlProps.matrix; rowIndex++) {
      for (let columnIndex = 0; columnIndex < snakeHtmlProps.matrix; columnIndex++) {
        const point = { x: columnIndex, y: rowIndex };

        cells.push(
          <Cell
            key={`${rowIndex}-${columnIndex}`}
            point={point}
            showRenders={snakeHtmlProps.showRenders}
            usePointValue={game.game.usePointValue}
          />
        );
      }
    }

    return cells;
  }, [game.game.usePointValue, snakeHtmlProps.matrix]);
};

export default Matrix;
