import React from 'react';
import type { BaseMetadata, StateHook, StateSetter } from 'react-global-state-hooks/types';
import { type SnakeHtmlProps } from '../hooks/makeUseSnakeHtmlProps';
import { useGameState } from '../hooks/useGameState';
import { Score } from '../components/Score';
import { useRunGame } from '../hooks/useRunGame';
import Matrix from '../components/Matrix';

type GameProps = {
  useSnakeHtmlProps: StateHook<SnakeHtmlProps, StateSetter<SnakeHtmlProps>, BaseMetadata>;
};

export const Game: React.FC<GameProps> = ({ useSnakeHtmlProps }) => {
  const [htmlProps] = useSnakeHtmlProps();
  const gameState = useGameState(htmlProps);

  useRunGame(gameState, htmlProps);

  return (
    <>
      <Score key={Date.now()} useScore={gameState.value.useScore} />
      <div className="grid w-fit" style={{ gridTemplateColumns: `repeat(${htmlProps.matrix}, 1fr)` }}>
        <Matrix game={gameState} snakeHtmlProps={htmlProps} />
      </div>
    </>
  );
};
