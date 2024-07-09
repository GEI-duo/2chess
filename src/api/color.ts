export function getColor(piece: Piece): Color {
  return piece.toLowerCase() === piece ? 'black' : 'white';
}

export function otherColor(color: Color): Color {
  return color === 'white' ? 'black' : 'white';
}

export function isWhite(piece: Piece): boolean {
  return getColor(piece) === 'white';
}
