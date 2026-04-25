import { lazy, Suspense } from 'react';
import type { ActionFunction } from 'react-router-dom';
import {
  createBrowserRouter,
  LoaderFunction,
  redirect,
  RouterProvider,
} from 'react-router-dom';

import { db } from '@/db';

const ErrorPage = lazy(() => import('@/pages/ErrorPage/ErrorPage'));
const Game = lazy(() => import('@/pages/Game/Game'));
const Layout = lazy(() => import('@/pages/Layout'));
const NewGame = lazy(() => import('@/pages/NewGame/NewGame'));
const Games = lazy(() => import('@/pages/Games/Games'));

interface newGameFormData {
  whiteName: string;
  blackName: string;
  minutes: string;
  seconds: string;
  increment: string;
  gameTitle: string;
}

const newGame: ActionFunction = async ({ request }) => {
  const { whiteName, blackName, minutes, seconds, increment, gameTitle } =
    Object.fromEntries(await request.formData()) as unknown as newGameFormData;

  const timeMs =
    parseInt(minutes || '0') * 60000 + parseInt(seconds || '0') * 1000;

  const initialState: GameState = {
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    whiteTime: timeMs,
    blackTime: timeMs,
    highlighted: new Set(),
    whiteCaptures: new Map(),
    blackCaptures: new Map(),
  };

  const gameHistory = [initialState] as GameHistory;

  const game = {
    title: gameTitle,
    whiteName: whiteName || 'Player 1',
    blackName: blackName || 'Player 2',
    timeControl: parseInt(minutes) * 60 + parseInt(seconds),
    increment: parseInt(increment || '0'),
    isPlaying: false,
    playingSince: null,
    elapsedTime: 0,
    history: gameHistory,
    gameStatus: 'whiteTurn' as GameStatus,
    gameResult: 'none' as GameResult,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  } as Game;

  const id = await db.games.add(game as Game);
  if (gameTitle === '') {
    await db.games.update(id, { title: `Game #${id}` });
  }

  return redirect(`/2chess/games/${id}`);
};

const loadGame: LoaderFunction = async ({ params }) => {
  const game = await db.games.get(Number(params.gameId));
  if (game === undefined) {
    return redirect('/2chess/404');
  }
  return game;
};

const router = createBrowserRouter([
  {
    path: '/2chess/',
    element: (
      <Suspense fallback={null}>
        <Layout />
      </Suspense>
    ),
    children: [
      {
        path: '/2chess/',
        element: (
          <Suspense fallback={null}>
            <Games />
          </Suspense>
        ),
      },
      {
        path: '/2chess/games',
        element: (
          <Suspense fallback={null}>
            <NewGame />
          </Suspense>
        ),
        action: newGame,
      },
      {
        path: '/2chess/games/:gameId',
        element: (
          <Suspense fallback={null}>
            <Game />
          </Suspense>
        ),
        loader: loadGame,
      },
      {
        path: '*',
        element: (
          <Suspense fallback={null}>
            <ErrorPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
