import Stats from '@/components/Stats';
import BottomBar from '@/pages/Game/components/BottomBar';

import { useEffect, useState } from 'react';

import Drawer from '@/pages/Game/components/Drawer';

import { db } from '@/db';
import { useParams, useNavigate, useLoaderData } from 'react-router-dom';
import GameAppBar from '@/pages/Game/components/GameAppBar';
import Box from '@mui/material/Box';

import createGameStore from '@/state/useGameStore';
import { useLiveQuery } from 'dexie-react-hooks';
import PromotionDialog from './components/PromotionDialog';
import ResultsDialog from './components/ResultsDialog';
import InteractiveBoard from '@/components/InteractiveBoard';
import { Paper } from '@mui/material';
import RestartDialog from './components/RestartDialog';
import DrawDialog from './components/DrawDialog';
import SurrenderDialog from './components/SurrenderDialog';

export default function Game() {
  const loadedGame = useLoaderData() as Game;
  const gameId = useParams<{ gameId: string }>().gameId as string;
  const game = useLiveQuery(() => db.games.get(Number(gameId))) ?? loadedGame;

  const [useGameStore] = useState(() => createGameStore(game));
  const navigate = useNavigate();

  // DRAWER STATE
  const drawerOpen = useGameStore(state => state.drawerOpen);
  const closeDrawer = useGameStore(state => state.closeDrawer);
  const toggleDrawer = useGameStore(state => state.toggleDrawer);
  const restartGame = useGameStore(state => state.restartGame);
  const surrender = useGameStore(state => state.surrender);
  const drawGame = useGameStore(state => state.drawGame);

  // APPBAR STATE
  const boardOrientation = useGameStore(state => state.boardOrientation);
  const flipBoard = useGameStore(state => state.flipBoard);
  const isAutoFlip = useGameStore(state => state.isAutoFlip);
  const toggleAutoFlip = useGameStore(state => state.toggleAutoFlip);
  const isFullscreen = useGameStore(state => state.isFullscreen);
  const toggleFullscreen = useGameStore(state => state.toggleFullscreen);

  // GAME STATE
  const turn = useGameStore(state => state.turn);

  const blackName = useGameStore(state => state.blackName);
  const blackCaptures = useGameStore(state => state.blackCaptures);
  const blackScore = useGameStore(state => state.blackScore);
  const blackTime = useGameStore(state => state.blackTime);

  const piecesFen = useGameStore(state => state.piecesFen);
  const spotted = useGameStore(state => state.spotted);
  const highlighted = useGameStore(state => state.highlighted);

  const whiteName = useGameStore(state => state.whiteName);
  const whiteCaptures = useGameStore(state => state.whiteCaptures);
  const whiteScore = useGameStore(state => state.whiteScore);
  const whiteTime = useGameStore(state => state.whiteTime);

  const promoting = useGameStore(state => state.promoting);
  const handlePromotion = useGameStore(state => state.handlePromotion);

  const hasGameEnded = useGameStore(state => state.gameResult !== 'none');
  const isLiveGame = useGameStore(
    state => state.historyIndex == state.history.length - 1,
  );

  const draggable = useGameStore(state => new Set(state.legalMoves.keys()));

  const loadGame = useGameStore(state => state.loadGame);
  const handleCellClick = useGameStore(state => state.handleCellClick);
  const handlePieceDragStart = useGameStore(
    state => state.handlePieceDragStart,
  );
  const handlePieceDragEnd = useGameStore(state => state.handlePieceDragEnd);

  const setNow = useGameStore(state => state.setNow);

  // BOTTOM BAR STATE
  const canFirst = useGameStore(state => state.historyIndex > 0);
  const first = useGameStore(state => state.first);
  const canPrevious = useGameStore(state => state.historyIndex > 0);
  const previous = useGameStore(state => state.previous);
  const isPlaying = useGameStore(state => state.playingSince != null);
  const togglePlay = useGameStore(state => state.togglePlay);
  const isTimed = useGameStore(state => state.timeControl > 0);
  const canNext = useGameStore(
    state => state.historyIndex < state.history.length - 1,
  );
  const next = useGameStore(state => state.next);
  const canLast = useGameStore(
    state => state.historyIndex < state.history.length - 1,
  );
  const last = useGameStore(state => state.last);

  // Own state
  const [restarting, setRestarting] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [surrendering, setSurrendering] = useState(false);

  // update timers
  useEffect(() => {
    if (isTimed && !hasGameEnded && isPlaying) {
      const interval = setInterval(() => {
        setNow();
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, setNow, hasGameEnded, isTimed]);

  useEffect(() => {
    loadGame(game);
  }, [game, loadGame]);

  // pause game on space key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTimed && !hasGameEnded && event.code === 'Space') {
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, hasGameEnded, isTimed]);

  const handleExit = () => {
    navigate('/2chess');
  };

  const handleRestart = (restart: boolean) => {
    setRestarting(false);
    if (restart) {
      restartGame();
    }
  };

  const handleDraw = (draw: boolean) => {
    setDrawing(false);
    if (draw) {
      drawGame();
    }
  };

  const handleSurrender = () => {
    setSurrendering(false);
    surrender();
  };

  return (
    <>
      <GameAppBar
        isFullscreen={isFullscreen}
        isAutoFlip={isAutoFlip}
        handleAutoFlip={toggleAutoFlip}
        handleFlip={flipBoard}
        handleFullscreen={toggleFullscreen}
        handleMenu={toggleDrawer}
      />
      <Drawer
        open={drawerOpen}
        closeDrawer={closeDrawer}
        handleDraw={() => setDrawing(true)}
        handleExit={handleExit}
        handleRestart={() => setRestarting(true)}
        handleSurrender={() => setSurrendering(true)}
      />

      <Box
        className="flex justify-center w-full h-full overflow-y-auto"
        style={{ scrollbarGutter: 'stable' }}
      >
        <Box
          className="flex justify-center gap-2 h-fit min-h-full max-w-full py-4"
          style={{
            flexDirection:
              boardOrientation === 'white' ? 'column' : 'column-reverse',
          }}
        >
          <Paper className="p-2" elevation={turn === 'black' ? 3 : 1}>
            <Stats
              color="black"
              username={blackName}
              time={blackTime}
              score={blackScore}
              pieces={blackCaptures}
              active={turn === 'black' && (!isLiveGame || !hasGameEnded)}
              showTimer={isTimed}
            />
          </Paper>
          <InteractiveBoard
            fen={piecesFen}
            spotted={spotted}
            highlighted={highlighted}
            handleCellClick={handleCellClick}
            handlePieceDragStart={handlePieceDragStart}
            handlePieceDragEnd={handlePieceDragEnd}
            orientation={boardOrientation}
            draggable={draggable}
          />
          <Paper className="p-2" elevation={turn === 'white' ? 3 : 1}>
            <Stats
              color="white"
              username={whiteName}
              time={whiteTime}
              score={whiteScore}
              pieces={whiteCaptures}
              active={turn === 'white' && (!isLiveGame || !hasGameEnded)}
              showTimer={isTimed}
            />
          </Paper>
        </Box>
      </Box>

      {!isFullscreen && (
        <BottomBar
          canFirst={canFirst}
          canPrevious={canPrevious}
          canPlay={!hasGameEnded && isTimed}
          canNext={canNext}
          canLast={canLast}
          isPlaying={isPlaying}
          handlePlay={togglePlay}
          handleFirst={first}
          handleLast={last}
          handleNext={next}
          handlePrevious={previous}
        />
      )}

      {drawing && <DrawDialog onDraw={handleDraw} />}
      {restarting && <RestartDialog onRestart={handleRestart} />}
      {surrendering && (
        <SurrenderDialog
          onSurrender={handleSurrender}
          onCancel={() => setSurrendering(false)}
        />
      )}

      {hasGameEnded && isLiveGame && (
        <ResultsDialog
          game={game}
          onRematch={() => navigate('/2chess/games')}
        />
      )}

      {promoting && (
        <PromotionDialog color={turn} onPromote={handlePromotion} />
      )}
    </>
  );
}
