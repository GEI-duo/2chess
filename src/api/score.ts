function pieceScore(piece: Piece): number {
  switch (piece) {
    case 'p':
    case 'P':
      return 1;
    case 'r':
    case 'R':
      return 5;
    case 'n':
    case 'N':
      return 3;
    case 'b':
    case 'B':
      return 3;
    case 'q':
    case 'Q':
      return 10;
  }
  return 0;
}

export function score(
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
      pieceScore(piece) * amount * (piece === piece.toUpperCase() ? -1 : 1);
  });
  return score;
}
