import { db } from '@/db';
import ErrorPage from '@/pages/ErrorPage/ErrorPage';
import Game from '@/pages/Game/Game';
import Layout from '@/pages/Layout';
import NewGame from '@/pages/NewGame/NewGame';

import type { ActionFunction } from 'react-router-dom';

import {
  LoaderFunction,
  RouterProvider,
  createBrowserRouter,
  redirect,
} from 'react-router-dom';
import Games from '@/pages/Games/Games';

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
    element: <Layout />,
    children: [
      {
        path: '/2chess/',
        element: <Games />,
      },
      {
        path: '/2chess/games',
        element: <NewGame />,
        action: newGame,
      },
      {
        path: '/2chess/games/:gameId',
        element: <Game />,
        loader: loadGame,
      },
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
