import Piece from '@/components/Piece';

interface PieceStackProps {
  pieces: CapturedPieces;
}

export default function PieceStack({ pieces }: PieceStackProps) {
  return (
    <div className="flex h-6 gap-1 w-fit overflow-hidden">
      {Array.from(pieces.entries()).map(([piece, count]) => (
        <div key={piece} className="flex h-full min-w-0 ml-1.5">
          {Array(count)
            .fill(0)
            .map((_, i) => {
              return (
                <div key={i} className="flex h-full -ml-1.5">
                  <Piece piece={piece as Piece} />
                </div>
              );
            })}
        </div>
      ))}
    </div>
  );
}
