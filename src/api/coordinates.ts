function isWithin(coord: Coordinate): boolean {
  return coord.length === 2 && /[a-h]/.test(coord[0]) && /[1-8]/.test(coord[1]);
}

export function indexToCoordinate(row: number, col: number): Coordinate {
  return `${String.fromCharCode(col + 'a'.charCodeAt(0))}${
    row + 1
  }` as Coordinate;
}

export function vecToCoordinate(
  vec: [number, number],
  origin: Coordinate,
): Coordinate | undefined {
  let [col, row] = origin.split('');

  col = String.fromCharCode(col.charCodeAt(0) + vec[0]);
  row = `${parseInt(row) + vec[1]}`;

  const coord = `${col}${row}` as Coordinate;
  return isWithin(coord) ? coord : undefined;
}

export function coordinateColumnNumber(coord: Coordinate): number {
  return coord.charCodeAt(0) - 'a'.charCodeAt(0);
}

export function coordinateRowNumber(coord: Coordinate): number {
  return parseInt(coord.charAt(1)) - 1;
}

export function getTrail(from: Coordinate, to: Coordinate): Coordinate[] {
  // Calculate all the squares in (from, to]
  const [, fromRow] = from.split('');
  const [, toRow] = to.split('');

  const dX = coordinateColumnNumber(to) - coordinateColumnNumber(from);
  const dY = parseInt(toRow) - parseInt(fromRow);

  const totalSteps = Math.max(Math.abs(dX), Math.abs(dY));
  const xDir = dX == 0 ? 0 : dX / Math.abs(dX);
  const yDir = dY == 0 ? 0 : dY / Math.abs(dY);

  const trail: Coordinate[] = [];
  for (let step = 1; step <= totalSteps; step++) {
    const next = vecToCoordinate([xDir * step, yDir * step], from);
    trail.push(next!);
  }

  return trail;
}
