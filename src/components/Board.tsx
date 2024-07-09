import Cell from '@/components/Cell';
import { Box } from '@mui/material';
import { memo, useEffect, useMemo } from 'react';

function numberToChar(num: number): string {
  if (num < 0 || num > 25) {
    throw new Error('Input number must be between 0 and 25');
  }
  const asciiA = 'a'.charCodeAt(0); // ASCII value for 'a'
  const char = String.fromCharCode(asciiA + num);
  return char;
}

const board = () => {
  const board = [];

  for (let rowIndex = 8; rowIndex > 0; rowIndex--) {
    const row = [];
    for (let colIndex = 0; colIndex < 8; colIndex++) {
      const coordinate = (numberToChar(colIndex) + rowIndex) as Coordinate;
      const color =
        (rowIndex + colIndex) % 2 === 0 ? 'white' : ('black' as Color);
      row.push({ coordinate, color });
    }
    board.push(row);
  }
  return board;
};

function loadPieces(fen: FenString) {
  const pieces: BoardPiece = {};

  let row = 8;
  let col = 0;
  for (const char of fen) {
    if (char === '/') {
      row--;
      col = 0;
      continue;
    }
    if (isNaN(parseInt(char))) {
      const coordinate = (String.fromCharCode(97 + col) + row) as Coordinate;
      pieces[coordinate] = char as Piece;
      col++;
    } else {
      col += parseInt(char);
    }
  }
  return pieces;
}

interface BoardProps {
  fen: FenString;
  orientation?: Color;
  spotted?: Set<Coordinate>;
  highlighted?: Set<Coordinate>;
  draggable?: Set<Coordinate>;
  draggedPiece?: Coordinate;
  handleCellClick?: (coordinate: Coordinate) => void;
  onDraggedPiece?: (piece: Piece) => void;
}

const Board = memo(
  ({
    fen,
    orientation = 'white',
    spotted = new Set(),
    highlighted = new Set(),
    draggable = new Set(),
    draggedPiece = undefined,
    handleCellClick = () => {},
    onDraggedPiece = () => {},
  }: BoardProps) => {
    const pieces = useMemo(() => (fen ? loadPieces(fen) : {}), [fen]);

    useEffect(() => {
      if (draggedPiece && pieces[draggedPiece]) {
        const piece = pieces[draggedPiece] as Piece;
        if (piece) {
          onDraggedPiece(piece);
        }
      }
    }, [draggedPiece, onDraggedPiece, pieces]);

    return (
      <Box
        className="flex w-full"
        style={{
          flexDirection: orientation === 'white' ? 'column' : 'column-reverse',
        }}
      >
        {board().map((row, index) => {
          return (
            <div
              key={`row-${index}`}
              className={'flex'}
              style={{
                flexDirection: orientation === 'white' ? 'row' : 'row-reverse',
              }}
            >
              {row.map(cell => {
                return (
                  <Cell
                    key={cell.coordinate}
                    id={cell.coordinate}
                    color={cell.color}
                    piece={
                      cell.coordinate === draggedPiece
                        ? undefined
                        : (pieces[cell.coordinate] as Piece)
                    }
                    isDraggable={draggable.has(cell.coordinate)}
                    highlighted={highlighted.has(cell.coordinate)}
                    spotted={spotted.has(cell.coordinate)}
                    handleCellClick={handleCellClick}
                  />
                );
              })}
            </div>
          );
        })}
      </Box>
    );
  },
);

export default Board;
