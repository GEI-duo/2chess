import Dexie, { Table } from 'dexie';
import dayjs, { Dayjs } from 'dayjs';
import pkg from 'flexsearch';
const { Document } = pkg;

export class DexieStore extends Dexie {
  games!: Table<Game>;

  constructor() {
    super('2chess');
    this.version(1).stores({
      games:
        '++id, title, blackName, whiteName, timeControl, increment, playingSince, gameStatus, gameResult, updatedAt',
    });
  }
}

export const db = new DexieStore();

interface GameSearchFilters {
  search: string;
  sort: string;
  fromDate: Dayjs | null;
  toDate: Dayjs | null;
  minIncrement: number | null;
  maxIncrement: number | null;
  minPlayTime: number | null;
  maxPlayTime: number | null;
  filters: GameFilter[];
  enableFilter: boolean;
}

export const getFilteredGames = async ({
  search,
  sort,
  fromDate,
  toDate,
  minIncrement,
  maxIncrement,
  minPlayTime,
  maxPlayTime,
  filters,
  enableFilter,
}: GameSearchFilters) => {
  if (enableFilter === false) {
    return (sort === 'newer' ? db.games.reverse() : db.games).toArray();
  }

  const fromDateUnix = fromDate ? dayjs(fromDate).unix() * 1000 : 0;
  const toDateUnix =
    dayjs(toDate || undefined)
      .add(1, 'day')
      .unix() * 1000;

  const inProgress = filters.includes('inProgress');
  const finished = filters.includes('finished');
  const white = filters.includes('white');
  const black = filters.includes('black');
  const playing = filters.includes('playing');
  const paused = filters.includes('paused');
  const surrender = filters.includes('surrender');
  const timeout = filters.includes('timeout');
  const checkmate = filters.includes('checkmate');
  const stalemate = filters.includes('stalemate');
  const insufficientMaterial = filters.includes('insufficientMaterial');
  const threefoldRepetition = filters.includes('threefoldRepetition');
  const fiftyMoves = filters.includes('fiftyMoves');

  let games = db.games
    .where('updatedAt')
    .between(fromDateUnix, toDateUnix)
    .and(game => {
      const increment = game.increment;
      const parsedMinIncrement = minIncrement || 0;
      const parsedMaxIncrement =
        maxIncrement === null || maxIncrement === -1 ? Infinity : maxIncrement;

      if (increment === 0) {
        return parsedMinIncrement === 0 || parsedMaxIncrement === Infinity;
      }

      return parsedMinIncrement <= increment && increment <= parsedMaxIncrement;
    })
    .and(game => {
      const timeControl = game.timeControl;
      const parsedMaxPlayTime =
        maxPlayTime === null || maxPlayTime === -1 ? Infinity : maxPlayTime;
      const parsedMinPlayTime = minPlayTime ?? 0;

      if (timeControl === 0) {
        return parsedMinPlayTime === 0 || parsedMaxPlayTime === Infinity;
      }

      return (
        parsedMinPlayTime <= timeControl && timeControl <= parsedMaxPlayTime
      );
    })
    .and(game => {
      if (filters.length === 0) return true;

      const isInProgress =
        game.gameStatus === 'whiteTurn' || game.gameStatus === 'blackTurn';

      // Status: in progress
      if (inProgress && isInProgress) {
        // Turn
        if (!white || !black) {
          if (white && game.gameStatus !== 'whiteTurn') return false;
          if (black && game.gameStatus !== 'blackTurn') return false;
        }
        // Timer
        if (!playing || !paused) {
          const isPlaying = game.playingSince !== null;
          if (playing && !isPlaying) return false;
          if (paused && isPlaying) return false;
        }
      }

      // Status: finished
      if (finished && !isInProgress) {
        // Finalization
        if (
          surrender ||
          timeout ||
          checkmate ||
          stalemate ||
          insufficientMaterial ||
          threefoldRepetition ||
          fiftyMoves
        ) {
          if (surrender && game.gameStatus === 'surrender') return true;
          if (timeout && game.gameStatus === 'timeout') return true;
          if (checkmate && game.gameStatus === 'checkmate') return true;
          if (stalemate && game.gameStatus === 'stalemate') return true;
          if (
            insufficientMaterial &&
            game.gameStatus === 'insufficientMaterial'
          )
            return true;
          if (threefoldRepetition && game.gameStatus === 'threefoldRepetition')
            return true;
          if (fiftyMoves && game.gameStatus === 'fiftyMoves') return true;
        } else {
          return false;
        }
      }

      return true;
    });

  if (sort === 'newer') {
    games = games.reverse();
  }

  const document = new Document({
    tokenize: 'full',
    optimize: true,
    resolution: 9,
    document: {
      id: 'id',
      index: ['title', 'blackName', 'whiteName'],
    },
  });

  await games.each(async game => {
    document.add(game.id!, {
      title: game.title,
      blackName: game.blackName,
      whiteName: game.whiteName,
    });
  });

  if (search) {
    const results = document.search(search, { suggest: true });
    const gameIDs = new Set();
    for (const game of results) {
      for (const id of game.result) {
        gameIDs.add(id);
      }
    }
    games = games.filter(game => gameIDs.has(game.id));
  }

  return games.sortBy('updatedAt');
};
