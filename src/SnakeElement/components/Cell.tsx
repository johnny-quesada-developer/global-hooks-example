import { useRef } from 'react';
import snakeGame, { Point, iconsMap } from '../stores/snakeGame';

type CellProps = {
  point: Point;
};

export const Cell: React.FC<CellProps> = ({ point }) => {
  const game = snakeGame.use.api();
  const pointValue = game.actions.usePointValue(point);
  const [showRenders] = snakeGame.use(({ showRenders }) => showRenders);

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
