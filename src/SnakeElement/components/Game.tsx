import React from 'react';
import Score from '../components/Score';
import Matrix from '../components/Matrix';
import snakeGame, { useMatrixSize } from '../stores/snakeGame';

export const SnakeGame: React.FC = () => {
  const matrixSize = useMatrixSize();
  const { useRunGame } = snakeGame.use.actions();

  useRunGame();

  return (
    <>
      <Score key={Date.now()} />

      <div className="grid w-fit" style={{ gridTemplateColumns: `repeat(${matrixSize}, 1fr)` }}>
        <Matrix />
      </div>
    </>
  );
};
