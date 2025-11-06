import { useRef } from 'react';
import snakeGame from '../stores/snakeGame';
import { Point, iconsMap } from '../stores/snakeGame/snakeGame.types';

type CellProps = {
  point: Point;
};

export const Cell: React.FC<CellProps> = ({ point }) => {
  const { usePointValue } = snakeGame.use.actions();

  const pointValue = usePointValue(point);
  const showRenders = snakeGame.use.select(({ showRenders }) => showRenders);

  const icon = iconsMap[pointValue];

  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  return (
    <div
      className={`relative w-6 h-6 border text-xl border-gray-400 flex items-center justify-center`}
    >
      {Boolean(showRenders) && (
        <span className="absolute text-xs top-1 right-2">{renderCountRef.current}</span>
      )}
      {icon}
    </div>
  );
};
