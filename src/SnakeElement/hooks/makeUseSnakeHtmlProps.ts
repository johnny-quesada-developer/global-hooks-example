import { createGlobalState } from 'react-global-state-hooks/createGlobalState';

export type SnakeHtmlProps = {
  matrix: number;
  intervalSpeed: number;
};

const initialState: SnakeHtmlProps = {
  matrix: 10,
  intervalSpeed: 100,
};

export const makeUseSnakeHtmlProps = () => {
  return createGlobalState(initialState);
};
