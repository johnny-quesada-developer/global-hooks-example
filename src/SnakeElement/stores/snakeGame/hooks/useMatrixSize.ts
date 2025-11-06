import snakeGame from '..';

const useMatrixSize = snakeGame.use.createSelectorHook((state) => state.matrixSize);

export default useMatrixSize;
