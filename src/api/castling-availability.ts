type Values = {
  K: boolean;
  Q: boolean;
};

export class CastlingAvailability {
  whiteKingSide: boolean;
  blackKingSide: boolean;
  whiteQueenSide: boolean;
  blackQueenSide: boolean;

  constructor(
    whiteKingSide: boolean,
    whiteQueenSide: boolean,
    blackKingSide: boolean,
    blackQueenSide: boolean,
  ) {
    this.whiteKingSide = whiteKingSide;
    this.blackKingSide = blackKingSide;
    this.whiteQueenSide = whiteQueenSide;
    this.blackQueenSide = blackQueenSide;
  }

  stringify(): string {
    let castlingRights = '';
    if (this.whiteKingSide) castlingRights += 'K';
    if (this.whiteQueenSide) castlingRights += 'Q';
    if (this.blackKingSide) castlingRights += 'k';
    if (this.blackQueenSide) castlingRights += 'q';
    if (castlingRights === '') castlingRights = '-';
    return castlingRights;
  }

  getValues(color: Color): Values {
    if (color === 'white') {
      return {
        K: this.whiteKingSide,
        Q: this.whiteQueenSide,
      };
    }
    return {
      K: this.blackKingSide,
      Q: this.blackQueenSide,
    };
  }

  disableColor(color: Color) {
    if (color === 'white') {
      this.whiteKingSide = false;
      this.whiteQueenSide = false;
    } else {
      this.blackKingSide = false;
      this.blackQueenSide = false;
    }
  }

  disableKing(color: Color) {
    if (color === 'white') {
      this.whiteKingSide = false;
    } else {
      this.blackKingSide = false;
    }
  }

  disableQueen(color: Color) {
    if (color === 'white') {
      this.whiteQueenSide = false;
    } else {
      this.blackQueenSide = false;
    }
  }
}
