import React from 'react';
import Score from '../components/Score';
import snakeGame, { useMatrixSize } from '../stores/snakeGame';
import { Cell } from './Cell';

export const SnakeGame: React.FC = () => {
  const { useRunGame } = snakeGame.use.actions();

  const matrixSize = useMatrixSize();

  useRunGame();

  return (
    <>
      <Score key={new Date().toString()} />

      <div className="grid w-fit" style={{ gridTemplateColumns: `repeat(${matrixSize}, 1fr)` }}>
        {buildCells(matrixSize)}
      </div>
    </>
  );
};

function buildCells(matrixSize: number) {
  const cells: JSX.Element[] = [];

  // renders the flat matrix as a grid
  for (let rowIndex = 0; rowIndex < matrixSize; rowIndex++) {
    for (let columnIndex = 0; columnIndex < matrixSize; columnIndex++) {
      const point = { x: columnIndex, y: rowIndex };

      cells.push(<Cell key={`${rowIndex}-${columnIndex}`} point={point} />);
    }
  }
  return cells;
}
