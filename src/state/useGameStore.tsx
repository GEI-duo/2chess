import { create } from 'zustand';
import * as api from '@/api';
import { db } from '@/db';


interface GameStore {
  // GLOBAL
  id: number;
  title: string;
  gameStatus: GameStatus;
  gameResult: GameResult;
  elapsedTime: number;
  playingSince: number | null;
  increment: number;
  timeControl: number;
  createdAt: number;
  updatedAt: number;

  // DRAWER STATE
  drawerOpen: boolean;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  restartGame: () => void;
  surrender: () => void;
  drawGame: () => void;

  // APPBAR STATE
  boardOrientation: Color;
  flipBoard: () => void;
  isAutoFlip: boolean;
  toggleAutoFlip: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;

  // GAME STATE
  turn: Color;

  whiteName: string;
  whiteCaptures: CapturedPieces;
  whiteScore: number;
  whiteTime: number;

  piecesFen: PiecesFenString;
  spotted: Set<Coordinate>;
  highlighted: Set<Coordinate>;

  blackName: string;
  blackCaptures: CapturedPieces;
  blackScore: number;
  blackTime: number;

  history: GameHistory;
  historyIndex: number;

  from: Coordinate | null;
  to: Coordinate | null;
  legalMoves: Moves;

  promoting: boolean;
  handlePromotion: (piece: Piece) => void;

  loadGame: (game: Game) => void;
  loadGameState: (index: number) => void;
  handleCellClick: (coordinate: Coordinate) => void;
  handlePieceDragStart: (coordinate: Coordinate) => void;
  handlePieceDragEnd: (coordinate?: Coordinate) => void;
  clearBoard: () => void;
  move: (promotionPiece?: Piece) => void;
  setNow: () => void;

  // BOTTOM BAR STATE
  first: () => void;
  previous: () => void;
  togglePlay: () => void;
  next: () => void;
  last: () => void;
}

export default function createGameStore(game: Game) {
  // LOAD DEFAULT VALUES FROM GAME
  const id = game.id as number;

  const {
    title,
    blackName,
    whiteName,
    timeControl,
    increment,
    playingSince,
    elapsedTime,
    history,
    gameStatus,
    gameResult,
    createdAt,
    updatedAt,
  } = game;

  const historyIndex = history.length - 1;

  const elapsed =
    elapsedTime + (playingSince != null ? Date.now() - playingSince : 0);

  const gameState = history[history.length - 1];

  api.init(
    gameState.fen,
    true
  );
  const turn = api.turn();
  const piecesFen = api.piecesFen();
  const legalMoves = api.moves();

  const whiteScore = api.getWhiteScore();
  const whiteCaptures = gameState.whiteCaptures;
  const whiteTime =
    turn === 'white' ? gameState.whiteTime - elapsed : gameState.whiteTime;

  const blackScore = api.getBlackScore();
  const blackCaptures = gameState.blackCaptures;
  const blackTime =
    turn === 'black' ? gameState.blackTime - elapsed : gameState.blackTime;

  return create<GameStore>((set, get) => ({
    // GLOBAL
    id,
    title,
    gameStatus,
    gameResult,
    timeControl,
    increment,
    playingSince,
    elapsedTime,
    createdAt,
    updatedAt,

    // DRAWER OPEN
    drawerOpen: false,
    closeDrawer: () => set({ drawerOpen: false }),
    toggleDrawer: () => set(state => ({ drawerOpen: !state.drawerOpen })),
    restartGame: () => {
      db.games.update(id, {
        playingSince: null,
        elapsedTime: 0,
        gameStatus: 'whiteTurn',
        history: [history[0]],
      });
      const gameState = history[0];
      api.init(gameState.fen);
    },
    surrender: () => {
      const state = get();

      const newState = {
        playingSince: null,
        elapsedTime: 0,
        gameStatus: 'surrender' as GameStatus,
        gameResult: (state.turn === 'white' ? 'black' : 'white') as GameResult,
      };

      set(() => newState); // update immediately
      db.games.update(state.id, newState); // update database
    },
    drawGame: () => {
      const state = get();

      const newState = {
        playingSince: null,
        elapsedTime: 0,
        gameStatus: 'draw' as GameStatus,
        gameResult: 'draw' as GameResult,
      };

      set(() => newState); // update immediately
      db.games.update(state.id, newState); // update database
    },

    // APPBAR STATE
    boardOrientation: 'white',
    flipBoard: () =>
      set(state => ({
        boardOrientation:
          state.boardOrientation === 'white' ? 'black' : 'white',
      })),
    isAutoFlip: false,
    toggleAutoFlip: () => set(state => ({ isAutoFlip: !state.isAutoFlip })),
    isFullscreen: false,
    toggleFullscreen: () =>
      set(state => ({ isFullscreen: !state.isFullscreen })),

    // GAME STATE
    turn,

    whiteName,
    whiteCaptures,
    whiteScore,
    whiteTime,

    piecesFen,
    spotted: new Set(),
    highlighted: new Set(),

    blackName,
    blackCaptures,
    blackScore,
    blackTime,

    history,
    historyIndex,

    from: null,
    to: null,
    legalMoves,

    promoting: false,
    handlePromotion: piece => {
      get().move(piece);
    },

    loadGame: game => {
      set(() => ({
        ...game,
      }));
      get().loadGameState(game.history.length - 1);
    },

    loadGameState: index => {
      const state = get();

      const isLiveGame = index === state.history.length - 1;
      const gameState = state.history[index];
      api.init(
        gameState.fen,
      );

      const elapsed =
        state.elapsedTime +
        (state.playingSince != null ? Date.now() - state.playingSince : 0);

      set(() => ({
        piecesFen: api.fen(),

        turn: api.turn(),

        whiteCaptures: gameState.whiteCaptures,
        whiteScore: api.getWhiteScore(),
        whiteTime: isLiveGame
          ? gameState.whiteTime - elapsed
          : gameState.whiteTime,

        blackCaptures: gameState.blackCaptures,
        blackScore: api.getBlackScore(),
        blackTime: isLiveGame
          ? gameState.blackTime - elapsed
          : gameState.blackTime,

        legalMoves: api.moves(),

        highlighted: gameState.highlighted,
        from: null,
        spotted: new Set(),

        historyIndex: index,
      }));
    },
    handlePieceDragStart: coordinate => {
      const state = get();
      if (state.from === coordinate) {
        return;
      }
      state.handleCellClick(coordinate);
    },
    handlePieceDragEnd: coordinate => {
      const state = get();
      if (coordinate === undefined) {
        state.clearBoard();
        return;
      }
      state.handleCellClick(coordinate);
    },
    handleCellClick: coordinate => {
      const state = get();
      const gameState = state.history[state.historyIndex];

      // FROM
      if (state.from === null) {
        // Click on invalid cell
        if (!state.legalMoves.has(coordinate)) return;

        set(() => ({
          from: coordinate,
          highlighted: new Set([...gameState.highlighted, coordinate]),
          spotted: new Set(state.legalMoves.get(coordinate)),
        }));
        return;
      }

      // TO
      // Click on same piece
      if (coordinate == state.from) {
        state.clearBoard();
        return;
      }

      // Click on team's piece
      if (state.legalMoves.has(coordinate)) {
        set(() => ({
          from: coordinate,
          highlighted: new Set([...gameState.highlighted, coordinate]),
          spotted: new Set(state.legalMoves.get(coordinate)),
        }));
        return;
      }

      // Click on invalid cell
      if (!state.legalMoves.get(state.from)!.has(coordinate)) {
        state.clearBoard();
        return;
      }

      set(() => ({
        to: coordinate,
      }));
      state.move();
    },
    clearBoard: () =>
      set(state => {
        const gameState = state.history[state.historyIndex];

        return {
          from: null,
          highlighted: gameState.highlighted,
          spotted: new Set(),
        };
      }),
    move: (promotionPiece?) => {
      const state = get();

      if (!state.from || !state.to) return;

      if (!state.promoting && api.isPromotion(state.from, state.to)) {
        set(() => ({ promoting: true }));
        return;
      }

      if (!api.move(state.from, state.to, promotionPiece)) {
        state.clearBoard();
        console.log(`Invalid move: ${state.from} -> ${state.to}`);
        return;
      }

      // CHECK FOR END GAME CONDITIONS
      let gameStatus: GameStatus =
        state.turn === 'white' ? 'blackTurn' : 'whiteTurn';
      let gameResult: GameResult = 'none';

      if (api.isInsufficientMaterial()) {
        gameStatus = 'insufficientMaterial';
        gameResult = 'draw';
      } else if (api.isStalemate()) {
        gameStatus = 'stalemate';
        gameResult = 'draw';
      } else if (api.isCheckmate()) {
        gameStatus = 'checkmate';
        gameResult = state.turn;
      } else if (api.isFiftyMoves()) {
        gameStatus = 'fiftyMoves';
        gameResult = 'draw';
      } else if (api.isThreefoldRepetition(state.history.map(h => h.fen))) {
        gameStatus = 'threefoldRepetition';
        gameResult = 'draw';
      }

      // ADD GAME STATE
      const gameState = state.history[state.historyIndex];

      const elapsed =
        state.playingSince != null ? Date.now() - state.playingSince : 0;

      const newGameState: GameState = {
        fen: api.fen(),
        whiteTime:
          state.turn === 'white'
            ? gameState.whiteTime +
              state.increment * 1000 -
              state.elapsedTime -
              elapsed
            : gameState.whiteTime,
        blackTime:
          state.turn === 'black'
            ? gameState.blackTime +
              state.increment * 1000 -
              state.elapsedTime -
              elapsed
            : gameState.blackTime,
        highlighted: new Set([state.from, state.to]),
        whiteCaptures: api.getWhiteCapturedPieces(),
        blackCaptures: api.getBlackCapturedPieces(),
      };

      const newState = {
        elapsedTime: 0,
        promoting: false,
        playingSince:
          timeControl !== 0 && gameResult == 'none' ? Date.now() : null,
        gameResult,
        gameStatus,
        history: [
          ...state.history.slice(0, state.historyIndex + 1),
          newGameState,
        ],
      };

      set(() => newState); // update immediately
      db.games.update(state.id, newState); // update database

      state.loadGameState(state.historyIndex + 1);

      if (state.isAutoFlip) state.flipBoard(); // flip board on move
    },
    setNow: () => {
      const state = get();
      const isLiveGame = state.historyIndex === state.history.length - 1;
      const gameState = state.history[state.historyIndex];

      const elapsed =
        state.elapsedTime +
        (state.playingSince != null ? Date.now() - state.playingSince : 0);

      set(state => ({
        whiteTime:
          state.turn === 'white' && isLiveGame
            ? gameState.whiteTime - elapsed
            : gameState.whiteTime,
        blackTime:
          state.turn === 'black' && isLiveGame
            ? gameState.blackTime - elapsed
            : gameState.blackTime,
      }));
    },

    // BOTTOM BAR STATE
    first: () => {
      get().loadGameState(0);
    },
    previous: () => {
      get().loadGameState(get().historyIndex - 1);
    },
    togglePlay: () => {
      const state = get();
      const newState = state.playingSince
        ? {
            elapsedTime: state.elapsedTime + Date.now() - state.playingSince,
            playingSince: null,
          }
        : {
            playingSince: Date.now(),
          };

      set(() => newState); // update immediately
      db.games.update(state.id, newState); // update database

      // move to last state
      if (state.historyIndex !== state.history.length - 1) state.last();
    },
    next: () => {
      get().loadGameState(get().historyIndex + 1);
    },
    last: () => {
      get().loadGameState(get().history.length - 1);
    },
  }));
}
