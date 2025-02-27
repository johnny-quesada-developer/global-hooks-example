import { MatrixValue, Point, iconsMap } from '../hooks/useGameState';

export const Cell: React.FC<{ point: Point; usePointValue: (point: Point) => MatrixValue }> = ({
  point,
  usePointValue,
}) => {
  const pointValue = usePointValue(point);
  const icon = iconsMap[pointValue];

  return (
    <div className={`w-6 h-6 border text-xl border-gray-400 flex items-center justify-center`}>{icon}</div>
  );
};
