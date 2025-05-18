import { Chess, SQUARES } from '@/api/chess.ts';
import { getColor } from '@/api/color.ts';
import { coordinateRowNumber } from './api/coordinates';
import { inject } from './api/di/container';
import { TOKENS } from './api/di/tokens';
import Serializer from './api/interfaces/serializers';

let chess: Chess;
let _movesCache: Map<[PiecesFenString, Color], Moves>;

export function init(
  fen: FenString,
  initCache: boolean = false,
  serializer: Serializer<Chess> = inject(TOKENS.ChessSerializer),
) {
  chess = serializer.deserialize(fen);
  if (initCache) {
    _movesCache = new Map<[PiecesFenString, Color], Moves>();
  }
}

export function moves(
  color: Color = chess.turn,
  check_for_mates: boolean = true,
): Moves {
  const piecesFEN = piecesFen();
  const cache = _movesCache.get([piecesFEN, color]);
  if (cache !== undefined) {
    const moves = cache;
    _movesCache.set([piecesFEN, color], moves);
    return moves;
  }

  const moves = new Map();

  for (const square of SQUARES) {
    const piece = chess.pieces[square];
    if (piece === undefined || getColor(piece) !== color) continue;
    const squareMoves = chess.moves({ square }, check_for_mates);

    if (squareMoves.length > 0) {
      moves.set(square, new Set(squareMoves));
    }
  }

  _movesCache.set([piecesFEN, color], moves);

  return moves;
}

export function fen(): FenString {
  const fen = chess.fen;
  console.log(fen)
  return fen;
}

export function piecesFen(fen = chess.fen): PiecesFenString {
  return fen.split(' ')[0];
}

export function turn(): Color {
  return chess.turn;
}

export function move(
  from: Coordinate,
  to: Coordinate,
  promotionPiece?: Piece,
): boolean {
  return chess.move(from, to, promotionPiece);
}

export function isPromotion(from: Coordinate, to: Coordinate): boolean {
  const toCoord = coordinateRowNumber(to);
  const fromPiece = chess.pieces[from];
  return (
    fromPiece !== undefined &&
    fromPiece.toLowerCase() === 'p' &&
    (toCoord === 0 || toCoord === 7)
  );
}

export function getWhiteCapturedPieces(): CapturedPieces {
  return chess.whiteCaptured;
}

export function getBlackCapturedPieces(): CapturedPieces {
  return chess.blackCaptured;
}

function score(): number {
  return chess.score;
}

export function getWhiteScore(): number {
  return score();
}

export function getBlackScore(): number {
  return -score();
}

function getOrInitCache(pieces: PiecesFenString, color: Color): Moves {
  let cache = _movesCache.get([pieces, color]);
  if (cache !== undefined) return cache;
  cache = moves();
  _movesCache.set([pieces, color], cache);
  return cache;
}

export function isCheckmate(): boolean {
  const cache = getOrInitCache(piecesFen(), chess.turn);
  return cache !== undefined && cache.size === 0 && chess.isCheck;
}

export function isStalemate(): boolean {
  const cache = getOrInitCache(piecesFen(), chess.turn);
  return cache !== undefined && cache.size === 0 && !chess.isCheck;
}

export function isInsufficientMaterial(): boolean {
  return chess.isInsufficientMaterial();
}

export function isThreefoldRepetition(positions: FenString[]): boolean {
  const count = positions
    .map(piecesFen)
    .reduce((res: number, curr: PiecesFenString) => {
      return curr === piecesFen() ? res + 1 : res;
    }, 1);
  return count >= 3;
}

export function isFiftyMoves(): boolean {
  return chess.isFiftyMoves;
}
