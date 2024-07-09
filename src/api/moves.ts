import * as api from '@/api.ts';
import { Chess } from '@/api/chess.ts';
import { getColor, isWhite, otherColor } from '@/api/color.ts';
import {
  coordinateColumnNumber,
  coordinateRowNumber,
  getTrail,
  vecToCoordinate,
} from '@/api/coordinates.ts';

const movesLUT = new Map([
  [
    'b',
    [
      [1, 1],
      [-1, 1],
      [1, -1],
      [-1, -1],
      [2, 2],
      [-2, 2],
      [2, -2],
      [-2, -2],
      [3, 3],
      [-3, 3],
      [3, -3],
      [-3, -3],
      [4, 4],
      [-4, 4],
      [4, -4],
      [-4, -4],
      [5, 5],
      [-5, 5],
      [5, -5],
      [-5, -5],
      [6, 6],
      [-6, 6],
      [6, -6],
      [-6, -6],
      [7, 7],
      [-7, 7],
      [7, -7],
      [-7, -7],
    ],
  ],
  [
    'r',
    [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [0, 6],
      [0, 7],
      [0, -1],
      [0, -2],
      [0, -3],
      [0, -4],
      [0, -5],
      [0, -6],
      [0, -7],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0],
      [7, 0],
      [-1, 0],
      [-2, 0],
      [-3, 0],
      [-4, 0],
      [-5, 0],
      [-6, 0],
      [-7, 0],
    ],
  ],
  [
    'n',
    [
      [1, 2],
      [2, 1],
      [-1, 2],
      [-2, 1],
      [1, -2],
      [2, -1],
      [-1, -2],
      [-2, -1],
    ],
  ],
  [
    'q',
    [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [0, 6],
      [0, 7],
      [0, -1],
      [0, -2],
      [0, -3],
      [0, -4],
      [0, -5],
      [0, -6],
      [0, -7],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0],
      [7, 0],
      [-1, 0],
      [-2, 0],
      [-3, 0],
      [-4, 0],
      [-5, 0],
      [-6, 0],
      [-7, 0],
      [1, 1],
      [-1, 1],
      [1, -1],
      [-1, -1],
      [2, 2],
      [-2, 2],
      [2, -2],
      [-2, -2],
      [3, 3],
      [-3, 3],
      [3, -3],
      [-3, -3],
      [4, 4],
      [-4, 4],
      [4, -4],
      [-4, -4],
      [5, 5],
      [-5, 5],
      [5, -5],
      [-5, -5],
      [6, 6],
      [-6, 6],
      [6, -6],
      [-6, -6],
      [7, 7],
      [-7, 7],
      [7, -7],
      [-7, -7],
    ],
  ],
  [
    'k',
    [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
      [1, 1],
      [-1, -1],
      [1, -1],
      [-1, 1],
      [2, 0],
      [-2, 0],
    ],
  ],
  [
    'p',
    [
      [0, 1],
      [0, 2],
      [1, 1],
      [-1, 1],
    ],
  ],
]);

function fixPawnDirection(
  vec: [number, number],
  piece: string,
): [number, number] {
  return piece === 'p' ? [vec[0], -vec[1]] : vec;
}

function isLegalMove(
  from: Coordinate,
  to: Coordinate,
  chess: Chess,
  checkForMates: boolean,
): boolean {
  const board = chess.pieces();
  const fromPiece = board[from];
  const toPiece = board[to];

  // Check if 'to' square has a piece of the same color
  if (toPiece != undefined && getColor(toPiece!) === getColor(fromPiece!))
    return false;

  if (checkForMates && !isSafeMove(from, to, chess)) return false;

  // Knights can jump over pieces
  if (fromPiece?.toLowerCase() === 'n') return true;

  // Check trail for pieces
  const dX = coordinateColumnNumber(to) - coordinateColumnNumber(from);
  const trail = getTrail(from, to);
  for (let i = 0; i < trail.length; i++) {
    const coord = trail[i];
    const piece = board[coord];

    if (piece === undefined) continue; // OK: No piece in the way
    if (i !== trail.length - 1) {
      // There's a piece in the way, it's an illegal move
      return false;
    }
  }

  // Check special cases
  switch (fromPiece!.toLowerCase()) {
    case 'p': {
      if (board[to] !== undefined) {
        // There's piece in the landing square
        return dX !== 0;
      } else {
        // Empty square
        if (dX !== 0 && chess.enPassantTarget() == to) return true;
        const dY = coordinateRowNumber(to) - coordinateRowNumber(from);
        if (dY === 2 || dY === -2) {
          const fromRow = dY > 0 ? 1 : 6;
          return coordinateRowNumber(from) == fromRow;
        }
        return dX === 0;
      }
    }
    case 'k': {
      if (dX !== 2 && dX !== -2) break; // All other moves are legal
      if (!checkForMates) return false;
      if (
        checkForMates &&
        toPiece === undefined && // Can't capture while castling
        !isKingAttacked(getColor(fromPiece!), chess) // Can't castle out of check
      ) {
        // Queen side castle, check if next square is occupied
        if (dX === -2 && board[vecToCoordinate([-1, 0], to)!] !== undefined) {
          return false;
        }

        const dangerousTrailCoord = vecToCoordinate(
          [dX > 0 ? 1 : -1, 0],
          from,
        )!;

        const availability = chess
          .castlingAvailability()
          .getValues(getColor(fromPiece!));
        return isSafeMove(from, dangerousTrailCoord, chess) && dX === 2
          ? availability.K
          : availability.Q;
      }
    }
  }

  return true;
}

export function isKingAttacked(kingColor: Color, chess: Chess): boolean {
  const enemyMoves = api.moves(otherColor(kingColor), false);
  const kingCoordinate = chess.getKingCoordinate(kingColor);

  for (const [, moves] of enemyMoves) {
    for (const coord of moves.values()) {
      if (coord === kingCoordinate) {
        return true;
      }
    }
  }
  return false;
}

function isSafeMove(from: Coordinate, to: Coordinate, chess: Chess): boolean {
  // Check if the move puts the king in check
  const board = chess.pieces();
  const fromPiece = board[from]!;
  const toPiece = board[to];

  // Simulate move
  move(chess, from, to);

  try {
    return !isKingAttacked(getColor(fromPiece), chess);
  } finally {
    // Reset back to normal
    move(chess, to, from);
    board[to] = toPiece;
  }
}

/**
 * Checks if the move is a special move and applies the necessary changes to the Chess object
 *
 * @param chess where to apply state changes to
 * @param from coordinate
 * @param to coordinate
 */
export function checkSpecialMove(
  chess: Chess,
  from: Coordinate,
  to: Coordinate,
) {
  /* ========= Useful move information ========= */
  const fromPiece = chess.pieces()[from]!;
  const toPiece = chess.pieces()[to];
  const dX = coordinateColumnNumber(to) - coordinateColumnNumber(from);
  const dY = coordinateRowNumber(to) - coordinateRowNumber(from);

  let updatedEnPassant = false;

  switch (fromPiece.toLowerCase()) {
    case 'p': {
      chess.resetHalfmoveClock();
      const dir = isWhite(fromPiece) ? 1 : -1;
      if (to === chess.enPassantTarget()) {
        // Capture the correct piece when doing en passant
        const passedCoord = vecToCoordinate([0, -dir], to)!;
        const enPassantPawn = chess.pieces()[passedCoord];
        chess.addCaptured(enPassantPawn!);
        chess.pieces()[passedCoord] = undefined;
      }
      if (Math.abs(dY) === 2) {
        chess.setEnPassantTarget(vecToCoordinate([0, dir], from)!);
        updatedEnPassant = true;
      }
      break;
    }
    case 'k': {
      chess.castlingAvailability().disableColor(getColor(fromPiece));
      if (Math.abs(dX) === 2) {
        const rookFrom = vecToCoordinate([dX > 0 ? 3 : -4, 0], from)!;
        const rookTo = vecToCoordinate([dX > 0 ? -1 : 1, 0], to)!;
        move(chess, rookFrom, rookTo);
      }
      break;
    }
    case 'r': {
      if (from == 'h1' || from == 'h8') {
        chess.castlingAvailability().disableQueen(getColor(fromPiece));
      } else if (from == 'a1' || from == 'a8') {
        chess.castlingAvailability().disableKing(getColor(fromPiece));
      }
      break;
    }
  }

  // An en passant target is only valid for one move, so reset it
  if (!updatedEnPassant) {
    chess.setEnPassantTarget('-' as Coordinate);
  }

  if (toPiece?.toLowerCase() === 'r') {
    // Captured a rook, disable castling for the enemy
    if (to == 'h1' || to == 'h8') {
      chess.castlingAvailability().disableKing(getColor(toPiece));
    } else if (to == 'a1' || to == 'a8') {
      chess.castlingAvailability().disableQueen(getColor(toPiece));
    }
  }
}

export function moves(
  square: Coordinate,
  chess: Chess,
  check_for_mates: boolean,
): Coordinate[] {
  const piece = chess.pieces()[square];
  if (piece === undefined) return [];
  return movesLUT
    .get(piece.toLowerCase())!
    .map(vec => fixPawnDirection(vec as [number, number], piece))
    .map(vec => vecToCoordinate(vec as [number, number], square))
    .filter(
      coord =>
        coord !== undefined &&
        isLegalMove(square, coord!, chess, check_for_mates),
    ) as Coordinate[];
}

export function move(chess: Chess, from: Coordinate, to: Coordinate) {
  const pieces = chess.pieces();
  pieces[to] = pieces[from];
  pieces[from] = undefined;
}
