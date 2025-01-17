type Values = {
  K: boolean;
  Q: boolean;
};

export class CastlingAvailability {
  kingSide: boolean;
  queenSide: boolean;

  constructor();
  constructor(kingSide: boolean)
  constructor(queenSide: boolean)
  constructor(kingSide: boolean, queenSide: boolean);
  constructor(kingSide?: boolean, queenSide?: boolean) {
    this.kingSide = kingSide ?? true;
    this.queenSide = queenSide ?? true;
  }

  toString() {
    let result = '';
    if (this.kingSide) result += 'K';
    if (this.queenSide) result += 'Q';
    return result;
  }

  any(): boolean {
    return this.kingSide || this.queenSide;
  }

  disable() {
    this.kingSide = false;
    this.queenSide = false;
  }

  disableKingSide() {
    this.kingSide = false;
  }

  disableQueenSide() {
    this.queenSide = false;
  }

  getValues(): Values  {
    return {
      K: this.kingSide,
      Q: this.queenSide,
    } as const;
  }
}

export default class GameCastlingAvailability {
  
  availabilities: { [color in Color]: CastlingAvailability; };
  
  constructor(
    availabilities: { [color in Color]: CastlingAvailability; } = {
      white: new CastlingAvailability(),
      black: new CastlingAvailability(),
    },
  ) {
    this.availabilities = availabilities;
  }

  stringify(): string {
    let castlingRights = '';

    castlingRights += this.availabilities.white.toString();
    castlingRights += this.availabilities.black.toString().toLowerCase();

    return castlingRights || '-';
  }

  getValues(color: Color): Values {
    return this.availabilities[color].getValues();
  }

  disableColor(color: Color) {
    this.availabilities[color].disable();
  }

  disableKing(color: Color) {
    this.availabilities[color].disableKingSide();
  }

  disableQueen(color: Color) {
    this.availabilities[color].disableQueenSide();
  }
}
