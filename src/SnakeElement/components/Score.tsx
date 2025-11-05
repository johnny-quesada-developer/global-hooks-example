import snakeGame from '../stores/snakeGame';

const Score: React.FC = () => {
  const { useScore } = snakeGame.use.actions();
  const score = useScore();

  return (
    <div className="flex items-center gap-2">
      <span className="font-bold">Score:</span>
      <span>{score}</span>
    </div>
  );
};

export default Score;
