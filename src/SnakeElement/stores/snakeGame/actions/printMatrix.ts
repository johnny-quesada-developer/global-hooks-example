type SnakeContext = import('..').SnakeContext;

export function printMatrix(this: SnakeContext['actions']) {
  return ({ getMetadata, getState }: SnakeContext) => {
    const { matrixValues } = getMetadata();
    const { matrixSize } = getState();

    for (let y = 0; y < matrixSize; y++) {
      let row = '   ';
      for (let x = 0; x < matrixSize; x++) {
        const value = matrixValues[x + y * matrixSize];
        row += value + '   ';
      }
      console.log(`${y > 9 ? y : `${y} `}:`, row);
    }

    console.log('----------------------------------------');
  };
}

export default printMatrix;
