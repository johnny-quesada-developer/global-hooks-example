import snakeGame from '../stores/snakeGame';

const Score: React.FC = () => {
  const game = snakeGame.use.api();
  const score = game.actions.useScore();

  return (
    <div className="flex items-center gap-2">
      <span className="font-bold">Score:</span>
      <span>{score}</span>
    </div>
  );
};

export default Score;
