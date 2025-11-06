export type MatrixValue = 0 | 1 | 2;

export const EMPTY: MatrixValue = 0;
export const SNAKE: MatrixValue = 1;
export const FOOD: MatrixValue = 2;

export const EMPTY_ICON = '';
export const SNAKE_ICON = '🟩';
export const FOOD_ICON = '🍎';

export const iconsMap = {
  [EMPTY]: EMPTY_ICON,
  [SNAKE]: SNAKE_ICON,
  [FOOD]: FOOD_ICON,
};

export type Point = {
  x: number;
  y: number;
};

export type Subscribe = (callback: () => void) => () => void;

export type htmlAttr = {
  matrixSize: number;
  applesCount: number;
  speedInterval: number;
  showRenders: boolean;
};

export type SnakeApi = {
  getHead: () => Point;
  getTail: () => Point;
  removeTail: () => void;
};

const RIGHT_DIRECTION = { x: 1, y: 0 };
const DOWN_DIRECTION = { x: 0, y: 1 };
const LEFT_DIRECTION = { x: -1, y: 0 };
const UP_DIRECTION = { x: 0, y: -1 };

export const DIRECTIONS = [RIGHT_DIRECTION, DOWN_DIRECTION, LEFT_DIRECTION, UP_DIRECTION];
