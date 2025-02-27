export const Score: React.FC<{ useScore: () => number }> = ({ useScore }) => {
  const score = useScore();

  return (
    <div className="flex items-center gap-2">
      <span className="font-bold">Score:</span>
      <span>{score}</span>
    </div>
  );
};
