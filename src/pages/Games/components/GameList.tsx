import { db, getFilteredGames } from '@/db';
import { useLiveQuery } from 'dexie-react-hooks';
import GamePreview from '@/pages/Games/components/GamePreview/GamePreview';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';

import { useAtom } from 'jotai';
import {
  filteredAtom,
  filtersAtom,
  fromDateAtom,
  maxIncrementAtom,
  maxPlayTimeAtom,
  minIncrementAtom,
  minPlayTimeAtom,
  searchAtom,
  sortedAtom,
  toDateAtom,
} from '@/pages/Games/state/gameFilters';
import {
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  useTheme,
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';
import NewGameCard from './GamePreview/NewGameCard';

export default function GameList() {
  const theme = useTheme();
  const { t } = useTranslation();

  const [filters] = useAtom(filtersAtom);
  const [fromDate] = useAtom(fromDateAtom);
  const [toDate] = useAtom(toDateAtom);
  const [minPlayTime] = useAtom(minPlayTimeAtom);
  const [maxPlayTime] = useAtom(maxPlayTimeAtom);
  const [search] = useAtom(searchAtom);
  const [sorted] = useAtom(sortedAtom);
  const [enableFilter] = useAtom(filteredAtom);
  const [minIncrement] = useAtom(minIncrementAtom);
  const [maxIncrement] = useAtom(maxIncrementAtom);

  const [deleteSnackbarOpen, setDeleteSnackbarOpen] = useState(false);
  const [lastDeletedGame, setLastDeletedGame] = useState<Game | undefined>(
    undefined,
  );

  const onUndoDelete = useCallback(async () => {
    if (lastDeletedGame) {
      await db.games.add(lastDeletedGame);
      setLastDeletedGame(undefined);
      setDeleteSnackbarOpen(false);
    }
  }, [lastDeletedGame]);

  const handleDelete = useCallback(async (gameId: number) => {
    const game = await db.games.get(gameId);
    await db.games.delete(gameId);
    console.log(game);
    setLastDeletedGame(game);
    setDeleteSnackbarOpen(true);
  }, []);

  const games = useLiveQuery(
    () =>
      getFilteredGames({
        search,
        sort: sorted,
        fromDate,
        toDate,
        minIncrement,
        maxIncrement,
        minPlayTime,
        maxPlayTime,
        filters,
        enableFilter,
      }),
    [
      search,
      sorted,
      fromDate,
      toDate,
      minIncrement,
      maxIncrement,
      minPlayTime,
      maxPlayTime,
      filters,
      enableFilter,
    ],
  );

  return (
    <>
      <Box
        className="grid gap-10 justify-center min-h-[100vh]"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(0, 18rem))',
        }}
      >
        {games?.map(game => (
          <GamePreview key={game.id} game={game} deleteGame={handleDelete} />
        ))}
        {games === undefined && (
          <Box className="flex justify-center">
            <CircularProgress />
          </Box>
        )}
        <NewGameCard />
      </Box>
      <Snackbar
        open={deleteSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setDeleteSnackbarOpen(false)}
        message={t('game_deleted')}
        action={
          <>
            <Button
              color="secondary"
              size="small"
              onClick={() => onUndoDelete()}
            >
              {t('undo')}
            </Button>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setDeleteSnackbarOpen(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />
    </>
  );
}
