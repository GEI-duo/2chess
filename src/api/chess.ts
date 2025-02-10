import * as FEN from '@/api/fen';
import GameCastlingAvailability from '@/api/CastlingAvailability';
import { checkSpecialMove, move, moves, isKingAttacked } from '@/api/moves.ts';
import { isWhite, otherColor } from '@/api/color.ts';
import { inject } from './di/container';
import TOKENS from './di/tokens';

export const SQUARES: Coordinate[] = Array.from('12345678')
  .map(rank => Array.from('abcdefgh').map(file => `${file}${rank}`))
  .flat() as Coordinate[];

export class Chess {
  private _pieces: BoardPiece;
  private _playerTurn: Color;
  private _gameCastlingAvailability: GameCastlingAvailability;
  private _enPassantTarget: Coordinate;
  private _halfmoveClock: number;
  private _fullmoveNumber: number;

  constructor(
    fen: string,
    private _whiteCaptured: CapturedPieces,
    private _blackCaptured: CapturedPieces,

    private _scores_calculator = inject(TOKENS.ScoresCalculator),
    private _moves_calculator = inject(TOKENS.MovesCalculator),
  ) {
    this._pieces = FEN.parsePieces(fen);
    this._playerTurn = FEN.parsePlayer(fen);
    this._gameCastlingAvailability = FEN.parseCastlingAvailability(fen);
    this._enPassantTarget = FEN.parseEnPassantTarget(fen);
    this._halfmoveClock = FEN.parseHalfMoveClock(fen);
    this._fullmoveNumber = FEN.parseFullMoveNumber(fen);
  }

  fen(): FenString {
    return FEN.toFEN(this);
  }

  turn(): Color {
    return this._playerTurn;
  }

  castlingAvailability(): GameCastlingAvailability {
    return this._gameCastlingAvailability;
  }

  pieces(): BoardPiece {
    return this._pieces;
  }

  enPassantTarget(): Coordinate {
    return this._enPassantTarget;
  }

  setEnPassantTarget(coord: Coordinate) {
    this._enPassantTarget = coord;
  }

  halfmoveClock(): number {
    return this._halfmoveClock;
  }

  fullmoveNumber(): number {
    return this._fullmoveNumber;
  }

  whiteCaptured(): CapturedPieces {
    return this._whiteCaptured;
  }

  blackCaptured(): CapturedPieces {
    return this._blackCaptured;
  }

  score(): Number {
    return this._scores_calculator.calculate(this);
  }

  addCaptured(piece: Piece) {
    const capturedPieces = isWhite(piece)
      ? this._blackCaptured
      : this._whiteCaptured;
    capturedPieces.set(
      piece,
      capturedPieces.has(piece) ? capturedPieces.get(piece)! + 1 : 1,
    );
  }

  move(from: Coordinate, to: Coordinate, promotion?: Piece): boolean {
    try {
      const toPiece = this._pieces[to];

      this.increaseHalfmoveClock();

      if (toPiece !== undefined) {
        this.addCaptured(toPiece);
        this.resetHalfmoveClock();
      }
      checkSpecialMove(this, from, to);

      move(this, from, to);
      if (promotion !== undefined) {
        this._pieces[to] = promotion;
      }

      this._playerTurn = otherColor(this._playerTurn);
    } catch (e) {
      console.log(e);
      return false;
    }
    return true;
  }

  resetHalfmoveClock() {
    this._halfmoveClock = 0;
  }

  increaseHalfmoveClock(value: number = 1) {
    this._halfmoveClock += value;
  }

  moves(
    { square }: { square: Coordinate },
    check_for_mates: boolean,
  ): Coordinate[] {
    return moves(square, this, check_for_mates);
  }

  getKingCoordinate(color: Color) {
    const checkKing = color === 'white' ? 'K' : 'k';
    for (const key in this._pieces) {
      const piece = this._pieces[key as Coordinate];
      if (checkKing == piece) {
        return key as Coordinate;
      }
    }
    return '-';
  }

  isCheck(): boolean {
    return isKingAttacked(this._playerTurn, this);
  }

  isInsufficientMaterial(): boolean {
    const whitePieces = new Map<Piece, number>();
    const blackPieces = new Map<Piece, number>();

    for (const key in this._pieces) {
      const piece = this._pieces[key as Coordinate]?.toLowerCase() as Piece;
      if (piece === undefined) continue;
      const pieces = isWhite(piece) ? whitePieces : blackPieces;
      const val = pieces.get(piece);
      pieces.set(piece, val ? val + 1 : 1);
    }

    const isEnough = (pieces: Map<Piece, number>): boolean => {
      if (pieces.has('p') || pieces.has('r') || pieces.has('q')) return true;
      let total = 0;
      if (pieces.has('n')) {
        total += pieces.get('n')!;
      }
      if (pieces.has('b')) {
        total += pieces.get('b')! * 2;
      }
      // 2 Knights 1 bishop or 1 knight 1 bishop should be enough
      return total > 2;
    };

    return !isEnough(whitePieces) && !isEnough(blackPieces);
  }

  isFiftyMoves(): boolean {
    return this._halfmoveClock >= 50;
  }
}
