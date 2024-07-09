import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import Piece from './Piece';
import { memo, useCallback, useState } from 'react';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import Board from './Board';
import { Paper } from '@mui/material';

interface InteractiveBoardProps {
  fen: FenString;
  orientation?: Color;
  spotted?: Set<Coordinate>;
  highlighted?: Set<Coordinate>;
  draggable?: Set<Coordinate>;
  handleCellClick?: (coordinate: Coordinate) => void;
  handlePieceDragStart?: (coordinate: Coordinate) => void;
  handlePieceDragEnd?: (coordinate?: Coordinate) => void;
}

const InteractiveBoard = memo(
  ({
    fen,
    orientation = 'white',
    spotted = new Set(),
    highlighted = new Set(),
    draggable = new Set(),
    handleCellClick = () => {},
    handlePieceDragStart = () => {},
    handlePieceDragEnd = () => {},
  }: InteractiveBoardProps) => {
    const [overlayPiece, setOverlayPiece] = useState<Piece | undefined>(
      undefined,
    );
    const [draggedPiece, setDraggedPiece] = useState<Coordinate | undefined>(
      undefined,
    );

    const onDraggedPiece = useCallback((piece: Piece) => {
      setOverlayPiece(piece);
    }, []);

    const handleDragStart = useCallback(
      (event: DragStartEvent) => {
        const coordinate = event.active.id as Coordinate;
        handlePieceDragStart(coordinate);
        setDraggedPiece(coordinate);
      },
      [handlePieceDragStart],
    );

    const handleDragEnd = useCallback(
      (event: DragOverEvent) => {
        setOverlayPiece(undefined);
        setDraggedPiece(undefined);
        if (event.over === null) {
          handlePieceDragEnd();
          return;
        }
        const coordinate = event.over.id as Coordinate;
        handlePieceDragEnd(coordinate);
      },
      [handlePieceDragEnd],
    );

    const handleDragCancel = useCallback(() => {
      setOverlayPiece(undefined);
      setDraggedPiece(undefined);
    }, []);

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 4,
        },
      }),
    );

    return (
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        sensors={sensors}
      >
        <Paper className="p-2 resize-x overflow-auto w-[28rem] min-w-96 max-w-full">
          <Board
            fen={fen}
            orientation={orientation}
            highlighted={highlighted}
            spotted={spotted}
            draggable={draggable}
            handleCellClick={handleCellClick}
            draggedPiece={draggedPiece}
            onDraggedPiece={onDraggedPiece}
          />
        </Paper>
        <DragOverlay modifiers={[restrictToWindowEdges]}>
          {overlayPiece ? <Piece piece={overlayPiece} clone={true} /> : null}
        </DragOverlay>
      </DndContext>
    );
  },
);

export default InteractiveBoard;
