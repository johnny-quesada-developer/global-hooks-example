type SnakeContext = import('..').SnakeContext;

export function updateScore(this: SnakeContext['actions']) {
  return ({ getMetadata }: SnakeContext) => {
    const { scoreSubscriptions } = getMetadata();

    scoreSubscriptions.forEach((callback) => callback());
  };
}

export default updateScore;
