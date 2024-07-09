import { Link } from 'react-router-dom';
import Board from '@/components/Board';
import Stats from '@/components/Stats';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import AvTimerRoundedIcon from '@mui/icons-material/AvTimerRounded';
import MoreTimeRoundedIcon from '@mui/icons-material/MoreTimeRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useEffect, useState } from 'react';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import EditGame from '@/pages/Games/components/GamePreview/GamePreviewEditDialog';
import createGameStore from '@/state/useGameStore';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

interface GamePreviewProps {
  game: Game;
  deleteGame: (gameId: number) => void;
}

export default function GamePreview({ game, deleteGame }: GamePreviewProps) {
  const { t } = useTranslation();

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const [editModalOpen, setEditModalOpen] = React.useState(false);

  const gameId = game.id as number;
  const [useGameStore] = useState(() => createGameStore(game));

  const gameTitle = useGameStore(state => state.title);
  const gameStatus = useGameStore(state => state.gameStatus);
  const gameResult = useGameStore(state => state.gameResult);

  const blackName = useGameStore(state => state.blackName);
  const blackTime = useGameStore(state => state.blackTime);

  const piecesFen = useGameStore(state => state.piecesFen);
  const highlighted = useGameStore(state => state.highlighted);

  const whiteName = useGameStore(state => state.whiteName);
  const whiteTime = useGameStore(state => state.whiteTime);

  const isPlaying = useGameStore(state => state.playingSince != null);
  const setNow = useGameStore(state => state.setNow);

  const timeControl = useGameStore(state => state.timeControl);
  const minutes = useGameStore(state => Math.floor(state.timeControl / 60));
  const seconds = useGameStore(state => state.timeControl % 60);

  const loadGame = useGameStore(state => state.loadGame);

  const roundTime = `${minutes ? `${minutes}min` : ''}${
    seconds ? ` ${seconds}s` : ''
  }`;

  const roundIncrement = useGameStore(state =>
    state.increment != 0 ? `${state.increment}s` : '',
  );

  const updatedAt = useGameStore(state => state.updatedAt);

  const dateString = dayjs(updatedAt).format('LL');

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleDeleteGame = () => {
    handleMobileMenuClose();
    deleteGame(gameId as number);
  };

  const editGame = () => {
    handleMobileMenuClose();
    setEditModalOpen(true);
  };

  // load game
  useEffect(() => {
    loadGame(game);
  }, [game, loadGame]);

  // update timers
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setNow();
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, setNow]);

  return (
    <>
      <Card className="h-fit">
        <CardHeader
          title={gameTitle}
          subheader={dateString}
          action={
            <IconButton
              ref={anchorRef}
              aria-label="show more"
              aria-haspopup="true"
              aria-expanded={isMobileMenuOpen ? 'true' : undefined}
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreVertIcon />
            </IconButton>
          }
          sx={{ pb: 1 }}
        ></CardHeader>
        <Stack direction="row" spacing={1} className="mx-4 overflow-x-auto">
          {isPlaying && <Chip size="small" label="playing" />}
          {gameResult != 'none' && <Chip size="small" label={gameResult} />}
          {gameResult == 'none' && <Chip size="small" label={gameStatus} />}
          {roundTime && (
            <Chip
              icon={<AvTimerRoundedIcon />}
              size="small"
              label={roundTime}
            />
          )}
          {roundIncrement && (
            <Chip
              icon={<MoreTimeRoundedIcon />}
              size="small"
              label={roundIncrement}
            />
          )}
        </Stack>
        <CardContent className="flex flex-col h-fit gap-2">
          <Stats
            color="black"
            username={blackName}
            time={blackTime}
            score={7}
            pieces={new Map()}
            active={gameStatus == 'blackTurn'}
            size="compact"
            showTimer={timeControl != 0}
          />
          <Link to={`/2chess/games/${gameId}`} className="flex w-full">
            <CardActionArea>
              <CardMedia className="flex w-full aspect-square">
                <Board fen={piecesFen} highlighted={highlighted} />
              </CardMedia>
            </CardActionArea>
          </Link>
          <Stats
            color="white"
            username={whiteName}
            time={whiteTime}
            score={7}
            pieces={new Map()}
            active={gameStatus == 'whiteTurn'}
            size="compact"
            showTimer={timeControl != 0}
          />
        </CardContent>
        <Menu
          anchorEl={mobileMoreAnchorEl}
          open={isMobileMenuOpen}
          onClose={handleMobileMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleDeleteGame}>
            <ListItemIcon>
              <DeleteRoundedIcon style={{ fontSize: '1.25rem' }} />
            </ListItemIcon>
            <ListItemText>{t('delete')}</ListItemText>
          </MenuItem>
          <MenuItem onClick={editGame}>
            <ListItemIcon>
              <EditRoundedIcon style={{ fontSize: '1.25rem' }} />
            </ListItemIcon>
            <ListItemText>{t('edit')}</ListItemText>
          </MenuItem>
        </Menu>
      </Card>
      <EditGame
        gameId={gameId as number}
        open={editModalOpen}
        handleClose={handleEditModalClose}
        gameTitle={gameTitle}
        whiteName={whiteName}
        blackName={blackName}
      />
    </>
  );
}
