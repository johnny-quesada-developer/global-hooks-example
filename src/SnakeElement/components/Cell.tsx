import { useRef } from 'react';
import { MatrixValue, Point, iconsMap } from '../hooks/useSnakeGame';

export const Cell: React.FC<{
  point: Point;
  showRenders: number;
  usePointValue: (point: Point) => MatrixValue;
}> = ({ point, showRenders, usePointValue }) => {
  const pointValue = usePointValue(point);
  const icon = iconsMap[pointValue];

  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  return (
    <div className={`relative w-6 h-6 border text-xl border-gray-400 flex items-center justify-center`}>
      {Boolean(showRenders) && (
        <span className="absolute text-xs top-1 right-2">{renderCountRef.current}</span>
      )}
      {icon}
    </div>
  );
};
