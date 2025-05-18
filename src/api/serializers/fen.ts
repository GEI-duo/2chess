import {
  coordinateColumnNumber,
  coordinateRowNumber,
  indexToCoordinate,
} from '@/api/coordinates';
import GameCastlingAvailability, { CastlingAvailability } from '@/api/CastlingAvailability';
import { Chess } from '@/api/chess';
import Serializer from '../interfaces/serializers';
import { isWhite } from '../color';

const BOARD_SIZE = 8;
const FEN_FIELDS = 6;
const EMPTY_SQUARE = '-';

function getCapturedPieces(fen: PiecesFenString): CapturedPieces {
  const initialCounts: Record<string, number> = {
    P: 8, N: 2, B: 2, R: 2, Q: 1,
    p: 8, n: 2, b: 2, r: 2, q: 1,
  };

  // Count pieces on the board
  const boardCounts: Record<string, number> = {
    P: 0, N: 0, B: 0, R: 0, Q: 0,
    p: 0, n: 0, b: 0, r: 0, q: 0,
  };

  for (const char of fen) {
    if (char in boardCounts) {
      boardCounts[char] = (boardCounts[char] || 0) + 1;
    }
  }

  // Calculate captured pieces for both colors
  const captured: CapturedPieces = new Map<Piece, number>();
  for (const symbol of Object.keys(initialCounts)) {
    const diff = initialCounts[symbol] - (boardCounts[symbol] || 0);
    if (diff > 0) captured.set(symbol as Piece, diff);
  }

  return captured;
}

class FenSerializer implements Serializer<Chess> {
  serialize(data: Chess): string {
    const piecesFEN = this.serializePieces(data.pieces);
    const turnFEN = data.turn === 'white' ? 'w' : 'b';
    const castlingFEN = data.castlingAvailability.stringify();
    const enPassantFEN = data.enPassantTarget;
    const halfMoveFEN = data.halfMoveClock.toString();
    const fullMoveFEN = data.fullMoveNumber.toString();

    return `${piecesFEN} ${turnFEN} ${castlingFEN} ${enPassantFEN} ${halfMoveFEN} ${fullMoveFEN}`;
  }

  deserialize(fen: string): Chess {
    const fields = this.splitFEN(fen);
    const [piecesFEN, playerFEN, castlingFEN, enPassantFEN, halfMoveFEN, fullMoveFEN] = fields;

    const pieces = this.parsePieces(piecesFEN);
    const turn = playerFEN === 'w' ? 'white' : 'black';

    const castlingAvailability = new GameCastlingAvailability({
      white: new CastlingAvailability(
        castlingFEN.includes('K'),
        castlingFEN.includes('Q'),
      ),
      black: new CastlingAvailability(
        castlingFEN.includes('k'),
        castlingFEN.includes('q'),
      ),
    });

    if (enPassantFEN !== EMPTY_SQUARE && enPassantFEN.length !== 2) {
      throw new Error(`Invalid en passant target: "${enPassantFEN}"`);
    }

    const halfMoveClock = parseInt(halfMoveFEN, 10);
    const fullMoveNumber = parseInt(fullMoveFEN, 10);

    if (isNaN(halfMoveClock) || isNaN(fullMoveNumber)) {
      throw new Error(`Invalid move clock values: ${halfMoveFEN}, ${fullMoveFEN}`);
    }

    const capturedPieces = getCapturedPieces(piecesFEN)
    const filterCaptured = (captured: CapturedPieces, color: Color): CapturedPieces => 
      new Map(Array.from(captured.entries()).filter(([piece]) => color === 'white' ? isWhite(piece) : !isWhite(piece)))

    return new Chess(
      pieces,
      turn,
      castlingAvailability,
      enPassantFEN as Coordinate,
      filterCaptured(capturedPieces, "white"),
      filterCaptured(capturedPieces, "black"),
      halfMoveClock,
      fullMoveNumber
    );
  }

  private splitFEN(fen: string): string[] {
    const fields = fen.trim().split(' ');
    if (fields.length !== FEN_FIELDS) {
      throw new Error(`FEN string expected ${FEN_FIELDS} fields, got ${fields.length}`);
    }
    return fields;
  }

  private parsePieces(piecesFEN: string): BoardPiece {
    const rows = piecesFEN.split('/');
    if (rows.length !== BOARD_SIZE) {
      throw new Error(`FEN piece string expected ${BOARD_SIZE} rows, got ${rows.length}`);
    }

    const pieces: BoardPiece = {};
    let rowIndex = BOARD_SIZE - 1;

    for (const rowStr of rows) {
      let colIndex = 0;
      for (const char of rowStr) {
        const num = parseInt(char, 10);
        if (isNaN(num)) {
          pieces[indexToCoordinate(rowIndex, colIndex)] = char as Piece;
          colIndex++;
        } else {
          colIndex += num;
        }
      }
      if (colIndex !== BOARD_SIZE) {
        throw new Error(`Row "${rowStr}" does not fill exactly 8 columns.`);
      }
      rowIndex--;
    }

    return pieces;
  }

  private serializePieces(pieces: BoardPiece): string {
    const grid: (Piece | undefined)[][] = Array.from({ length: BOARD_SIZE }, () =>
      new Array(BOARD_SIZE).fill(undefined)
    );

    for (const key in pieces) {
      const coord = key as Coordinate;
      const row = coordinateRowNumber(coord);
      const col = coordinateColumnNumber(coord);
      grid[row][col] = pieces[coord];
    }

    const rowsFEN = grid
      .slice()
      .reverse()
      .map(row => {
        let fenRow = '';
        let emptyCount = 0;

        for (const cell of row) {
          if (!cell) {
            emptyCount++;
          } else {
            if (emptyCount > 0) {
              fenRow += emptyCount;
              emptyCount = 0;
            }
            fenRow += cell;
          }
        }

        if (emptyCount > 0) fenRow += emptyCount;
        return fenRow;
      });

    return rowsFEN.join('/');
  }
}

export default FenSerializer;
