import {
  coordinateColumnNumber,
  coordinateRowNumber,
  indexToCoordinate,
} from '@/api/coordinates';
import { CastlingAvailability } from '@/api/castling-availability';
import { Chess } from '@/api/chess';

function splitFEN(fen: string): string[] {
  const fields = fen.split(' ');
  if (fields.length != 6) {
    throw new Error(
      'FEN string expected 6 fields, got ' + fields.length + ' fields instead.',
    );
  }
  return fields;
}

export function parsePieces(fen: string): BoardPiece {
  const piecesFEN = splitFEN(fen)[0].split('/');
  if (piecesFEN.length != 8) {
    throw new Error(
      'FEN piece string expected 8 fields, got ' +
        piecesFEN.length +
        ' fields instead.',
    );
  }

  const pieces: BoardPiece = {};
  let col,
    row = 7;
  piecesFEN.forEach(pieceRow => {
    col = 0;
    for (let i = 0; i < pieceRow.length; i++) {
      const char = pieceRow.charAt(i);
      const charNumber = parseInt(char, 10);
      if (isNaN(charNumber)) {
        pieces[indexToCoordinate(row, col)] = char as Piece;
        col++;
      } else {
        col += charNumber;
      }
    }
    row--;
  });

  return pieces;
}

export function parsePlayer(fen: string): Color {
  const playerFEN = splitFEN(fen)[1];
  if (playerFEN.length != 1) {
    throw new Error(
      'FEN player string expected 1 character, got ' +
        playerFEN.length +
        ' characters instead.',
    );
  }
  return playerFEN.charAt(0) === 'w' ? 'white' : 'black';
}

export function parseCastlingRights(fen: string): CastlingAvailability {
  const castlingRightsFEN = splitFEN(fen)[2];
  if (castlingRightsFEN.length < 1 || 4 < castlingRightsFEN.length) {
    throw new Error(
      'FEN player castling rights string expected 1-4 characters, (' +
        castlingRightsFEN +
        ')',
    );
  }

  return new CastlingAvailability(
    castlingRightsFEN.includes('K'),
    castlingRightsFEN.includes('Q'),
    castlingRightsFEN.includes('k'),
    castlingRightsFEN.includes('q'),
  );
}

export function parseEnPassantTarget(fen: string): Coordinate {
  const enPassantTargetFEN = splitFEN(fen)[3];
  if (enPassantTargetFEN.charAt(0) !== '-' && enPassantTargetFEN.length != 2) {
    throw new Error('FEN en passant target string expected a coordinate.');
  }
  return enPassantTargetFEN as Coordinate;
}

export function parseHalfMoveClock(fen: string): number {
  const halfMoveClockFEN = splitFEN(fen)[4];
  return parseInt(halfMoveClockFEN, 10);
}

export function parseFullMoveNumber(fen: string): number {
  const fullMoveNumberFEN = splitFEN(fen)[5];
  return parseInt(fullMoveNumberFEN, 10);
}

function toFENPieces(chess: Chess): PiecesFenString {
  const pieces = new Array<Array<Piece | undefined>>(8);
  for (let i = 0; i < 8; i++) {
    pieces[i] = new Array<Piece | undefined>(8);
  }

  const chessPieces = chess.pieces();
  for (const key in chessPieces) {
    const coord = key as Coordinate;
    pieces[coordinateRowNumber(coord)][coordinateColumnNumber(coord)] =
      chessPieces[coord];
  }

  let pieceString = '';
  for (let row = pieces.length - 1; row >= 0; row--) {
    let emptyCount = 0;
    for (let col = 0; col < pieces[row].length; col++) {
      const piece = pieces[row][col];
      if (piece == undefined) {
        emptyCount++;
      } else {
        if (emptyCount > 0) pieceString += emptyCount;
        pieceString += piece;
        emptyCount = 0;
      }
    }
    if (emptyCount != 0) pieceString += emptyCount;
    pieceString += '/';
  }

  return pieceString.slice(0, -1); // Remove last '/'
}

export function toFEN(chess: Chess): FenString {
  return `${toFENPieces(chess)} ${chess.turn() === 'white' ? 'w' : 'b'} ${chess
    .castlingAvailability()
    .stringify()} ${chess.enPassantTarget()} ${chess.halfmoveClock()} ${chess.fullmoveNumber()}`;
}
