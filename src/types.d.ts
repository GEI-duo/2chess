type Piece =
  | 'P'
  | 'N'
  | 'B'
  | 'R'
  | 'Q'
  | 'K'
  | 'p'
  | 'n'
  | 'b'
  | 'r'
  | 'q'
  | 'k';
type Color = 'white' | 'black';
type Coordinate = `${'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'}${
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'}`;

// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
type FenString = string;

// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR
type PiecesFenString = string;

type BoardPiece = Partial<Record<Coordinate, Piece>>;

type Moves = Map<Coordinate, Set<Coordinate>>;
type CellStyle = 'highlighted' | 'spotted' | 'marked' | 'normal';

type CapturedPieces = Map<Piece, number>;

interface Game {
  id?: number;
  title: string;
  blackName: string;
  whiteName: string;
  timeControl: number;
  increment: number;
  playingSince: number | null;
  elapsedTime: number;
  gameStatus: GameStatus;
  gameResult: GameResult;
  history: GameHistory;
  createdAt: number;
  updatedAt: number;
}

type GameStatus =
  | 'whiteTurn'
  | 'blackTurn'
  | 'surrender'
  | 'draw'
  | 'timeout'
  | 'checkmate'
  | 'stalemate'
  | 'insufficientMaterial'
  | 'threefoldRepetition'
  | 'fiftyMoves';

type GameResult = 'white' | 'black' | 'draw' | 'none';

type GameFilter =
  | 'inProgress'
  | 'finished'
  | 'white'
  | 'black'
  | 'playing'
  | 'paused'
  | 'surrender'
  | 'timeout'
  | 'checkmate'
  | 'stalemate'
  | 'insufficientMaterial'
  | 'threefoldRepetition'
  | 'fiftyMoves';

type GameHistory = GameState[];

type GameState = {
  fen: FenString;
  whiteTime: number;
  blackTime: number;
  whiteCaptures: CapturedPieces;
  blackCaptures: CapturedPieces;
  highlighted: Set<Coordinate>;
};

type Increment =
  | '0'
  | '1s'
  | '2s'
  | '3s'
  | '5s'
  | '10s'
  | '30s'
  | '1min'
  | 'inf';
type IncrementOptions = [
  '0',
  '1s',
  '2s',
  '3s',
  '5s',
  '10s',
  '30s',
  '1min',
  'inf',
];

type PlayTime =
  | '0'
  | '1min'
  | '3min'
  | '5min'
  | '10min'
  | '30min'
  | '1h'
  | '1d'
  | '3d'
  | '1w'
  | 'inf';
type PlayTimeOptions = [
  '0',
  '1min',
  '3min',
  '5min',
  '10min',
  '30min',
  '1h',
  '1d',
  '3d',
  '1w',
  'inf',
];

interface LabeledValue {
  label: string;
  value: number;
}

type IncrementMap = Record<Increment, LabeledValue>;
type PlayTimeMap = Record<PlayTime, LabeledValue>;
