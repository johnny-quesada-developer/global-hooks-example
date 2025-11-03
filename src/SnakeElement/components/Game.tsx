import React from 'react';
import type { BaseMetadata, StateHook } from 'react-global-state-hooks/types';
import { type SnakeHtmlProps } from '../hooks/makeUseSnakeHtmlProps';
import { useSnakeGame } from '../hooks/useSnakeGame';
import { Score } from '../components/Score';
import { useRunGame } from '../hooks/useRunGame';
import Matrix from '../components/Matrix';

type GameProps = {
  useSnakeHtmlProps: StateHook<
    SnakeHtmlProps,
    React.Dispatch<React.SetStateAction<SnakeHtmlProps>>,
    React.Dispatch<React.SetStateAction<SnakeHtmlProps>>,
    BaseMetadata
  >;
};

export const SnakeGame: React.FC<GameProps> = ({ useSnakeHtmlProps }) => {
  const [htmlProps] = useSnakeHtmlProps();
  const gameRef = useSnakeGame(htmlProps);

  useRunGame(gameRef, htmlProps);

  return (
    <>
      <Score key={Date.now()} useScore={gameRef.current.useScore} />
      <div className="grid w-fit" style={{ gridTemplateColumns: `repeat(${htmlProps.matrix}, 1fr)` }}>
        <Matrix game={gameRef} snakeHtmlProps={htmlProps} />
      </div>
    </>
  );
};
