type SnakeContext = import('../snakeGame').SnakeContext;

export function updateScore(this: SnakeContext['actions']) {
  return ({ getMetadata }: SnakeContext) => {
    const { scoreSubscriptions } = getMetadata();

    scoreSubscriptions.forEach((callback) => callback());
  };
}

export default updateScore;
