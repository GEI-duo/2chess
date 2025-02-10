import { Chess } from '@/api/chess';
import Calculator from '@/api/interfaces/calculator';

class ScoresCalculator implements Calculator<Number> {
  calculate(chess: Chess): Number {
    return this.score(chess.whiteCaptured(), chess.blackCaptured());
  }

  private pieceScore(piece: Piece): number {
    switch (piece) {
      case 'p':
        return 1;
      case 'P':
        return -1;
      case 'r':
        return 5;
      case 'R':
        return -5;
      case 'N':
      case 'B':
        return -3;
      case 'n':
      case 'b':
        return 3;
      case 'Q':
        return -10;
      case 'q':
        return 10;
      default:
        return 0;
    }
  }

  private score(
    whiteCaptured: CapturedPieces,
    blackCaptured: CapturedPieces,
  ): number {
    const captured = new Map([
      ...Array.from(whiteCaptured.entries()),
      ...Array.from(blackCaptured.entries()),
    ]);

    let score = 0;
    captured.forEach((amount, piece) => {
      score +=
        this.pieceScore(piece) *
        amount *
        (piece === piece.toUpperCase() ? -1 : 1);
    });
    return score;
  }
}

export default ScoresCalculator;
