import BlackBishop from '@/assets/pieces/black-bishop.svg?react';
import BlackKing from '@/assets/pieces/black-king.svg?react';
import BlackKnight from '@/assets/pieces/black-knight.svg?react';
import BlackPawn from '@/assets/pieces/black-pawn.svg?react';
import BlackQueen from '@/assets/pieces/black-queen.svg?react';
import BlackRook from '@/assets/pieces/black-rook.svg?react';
import WhiteBishop from '@/assets/pieces/white-bishop.svg?react';
import WhiteKing from '@/assets/pieces/white-king.svg?react';
import WhiteKnight from '@/assets/pieces/white-knight.svg?react';
import WhitePawn from '@/assets/pieces/white-pawn.svg?react';
import WhiteQueen from '@/assets/pieces/white-queen.svg?react';
import WhiteRook from '@/assets/pieces/white-rook.svg?react';
import { memo } from 'react';

interface PieceProps {
  piece?: Piece;
  clone?: boolean;
}

const Piece = memo(({ piece, clone }: PieceProps) => {
  const figureMap = {
    P: WhitePawn,
    N: WhiteKnight,
    B: WhiteBishop,
    R: WhiteRook,
    Q: WhiteQueen,
    K: WhiteKing,
    p: BlackPawn,
    n: BlackKnight,
    b: BlackBishop,
    r: BlackRook,
    q: BlackQueen,
    k: BlackKing,
  };
  const Figure = piece ? figureMap[piece] : () => <></>;

  !Figure && console.warn("No piece for " + piece)

  const scale = clone ? 1.1 : 1;

  return (
    <Figure
      className="flex h-full w-full max-h-full max-w-full"
      style={{ transform: `scale(${scale})` }}
    />
  );
});

export default Piece;
