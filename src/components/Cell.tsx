import Piece from '@/components/Piece';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { memo } from 'react';

interface CellProps {
  id: Coordinate;
  color: Color;
  piece?: Piece;
  highlighted?: boolean;
  spotted?: boolean;
  isDraggable?: boolean;
  handleCellClick?: (coordinate: Coordinate) => void;
}

const Cell = memo(
  ({
    id,
    color,
    piece,
    highlighted,
    spotted,
    isDraggable,
    handleCellClick,
  }: CellProps) => {
    const { setNodeRef: setDroppableRef } = useDroppable({ id });

    const {
      attributes,
      listeners,
      setNodeRef: setDraggableRef,
    } = useDraggable({
      id,
      data: {
        piece,
      },
    });

    function handleClick() {
      handleCellClick && handleCellClick(id);
    }

    const bgColor =
      color === 'white'
        ? highlighted
          ? '#F5F682'
          : '#E9EDCC'
        : highlighted
          ? '#B9CA43'
          : '#779954';

    return (
      <div
        id={`cell-${id}`}
        onClick={handleClick}
        className="flex flex-1 aspect-square relative"
        ref={setDroppableRef}
      >
        {spotted && !piece && (
          <div className="absolute w-[35%] inset-0 m-auto aspect-square rounded-full bg-black opacity-15 box-border pointer-events-none" />
        )}
        {spotted && piece && (
          <div className="absolute w-[100%] inset-0 m-auto aspect-square rounded-full border-solid border-[5px] border-black opacity-15 box-border pointer-events-none" />
        )}
        <div
          id={id}
          className="flex w-full h-full py-[10%] justify-center"
          style={{
            backgroundColor: bgColor,
            cursor: spotted ? 'pointer' : 'default',
          }}
        >
          {piece && !isDraggable && <Piece piece={piece} />}
          {piece && isDraggable && (
            <div ref={setDraggableRef} {...listeners} {...attributes}>
              <Piece piece={piece} />
            </div>
          )}
        </div>
      </div>
    );
  },
);

export default Cell;
