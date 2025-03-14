import { createGlobalState } from 'react-global-state-hooks/createGlobalState';

export type SnakeHtmlProps = {
  matrix: number;
  apples: number;
  intervalSpeed: number;
  showRenders: number;
};

const initialState: SnakeHtmlProps = {
  matrix: 10,
  apples: 0,
  intervalSpeed: 100,
  showRenders: 0,
};

export const makeUseSnakeHtmlProps = () => {
  return createGlobalState({
    ...initialState,
    apples: Math.floor(Math.random() * 5) + 5,
  });
};
