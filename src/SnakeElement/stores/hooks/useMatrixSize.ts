import snakeGame from '../snakeGame';

const useMatrixSize = snakeGame.use.createSelectorHook((state) => state.matrixSize);

export default useMatrixSize;
