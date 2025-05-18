import GameCastlingAvailability from '@/api/CastlingAvailability';
import { checkSpecialMove, move, moves, isKingAttacked } from '@/api/moves.ts';
import { isWhite, otherColor } from '@/api/color.ts';
import { inject } from './di/container';
import { TOKENS } from './di/tokens';
import Calculator from './interfaces/calculator';
import Serializer from './interfaces/serializers';

export const SQUARES: Coordinate[] = Array.from('12345678')
  .map(rank => Array.from('abcdefgh').map(file => `${file}${rank}`))
  .flat() as Coordinate[];

export class Chess {
  constructor(
    private _pieces: BoardPiece,
    private _playerTurn: Color,
    private _gameCastlingAvailability: GameCastlingAvailability,
    private _enPassantTarget: Coordinate,
    private _whiteCaptured: CapturedPieces,
    private _blackCaptured: CapturedPieces,
    public halfMoveClock: number,
    public fullMoveNumber: number,

    private _scores_calculator: Calculator<number> = inject(TOKENS.ScoresCalculator),
    // private _moves_calculator: Calculator<Moves> = inject(TOKENS.MovesCalculator), TODO
    private _fen_calculator: Serializer<Chess> = inject(TOKENS.ChessSerializer),
  ) { }

  get fen(): FenString { return this._fen_calculator.serialize(this); }
  get turn(): Color { return this._playerTurn; }
  get castlingAvailability(): GameCastlingAvailability { return this._gameCastlingAvailability; }
  get pieces(): BoardPiece { return this._pieces; }
  get enPassantTarget(): Coordinate { return this._enPassantTarget; }
  get whiteCaptured(): CapturedPieces { return this._whiteCaptured; }
  get blackCaptured(): CapturedPieces { return this._blackCaptured; }
  get score(): number { return this._scores_calculator.calculate(this); }
  get isCheck(): boolean { return isKingAttacked(this._playerTurn, this); }
  get isFiftyMoves(): boolean { return this.halfMoveClock >= 50; }

  set enPassantTarget(coordinate: Coordinate) { this._enPassantTarget = coordinate; }

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

      this.halfMoveClock += 1;

      if (toPiece !== undefined) {
        this.addCaptured(toPiece);
        this.halfMoveClock = 0;
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
}
