import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import useTheme from '@mui/material/styles/useTheme';
import { memo } from 'react';

interface BottomBarProps {
  canFirst: boolean;
  canPrevious: boolean;
  canPlay: boolean;
  canNext: boolean;
  canLast: boolean;
  isPlaying: boolean;
  handlePlay: () => void;
  handlePrevious: () => void;
  handleNext: () => void;
  handleFirst: () => void;
  handleLast: () => void;
}

const BottomBar = memo(
  ({
    canFirst,
    canPrevious,
    canPlay,
    canNext,
    canLast,
    isPlaying,
    handlePlay,
    handlePrevious,
    handleNext,
    handleFirst,
    handleLast,
  }: BottomBarProps) => {
    const theme = useTheme();

    return (
      <Box
        className="flex w-full justify-center items-center shadow h-12 sm:h-14 min-h-12 sm:min-h-14"
        sx={{
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box className="flex overflow-hidden w-[28rem] justify-between px-4">
          <IconButton
            color="inherit"
            aria-label="navigate first"
            onClick={handleFirst}
            disabled={!canFirst}
            className="size-12"
          >
            <SkipPreviousRoundedIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="navigate previous"
            onClick={handlePrevious}
            disabled={!canPrevious}
            className="size-12"
          >
            <NavigateBeforeRoundedIcon />
          </IconButton>
          {canPlay && (
            <IconButton
              color="inherit"
              aria-label="pause"
              onClick={handlePlay}
              className="size-12"
            >
              {isPlaying ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
            </IconButton>
          )}

          <IconButton
            color="inherit"
            aria-label="navigate next"
            onClick={handleNext}
            disabled={!canNext}
            className="size-12"
          >
            <NavigateNextRoundedIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="navigate last"
            onClick={handleLast}
            disabled={!canLast}
            className="size-12"
          >
            <SkipNextRoundedIcon />
          </IconButton>
        </Box>
      </Box>
    );
  },
);

export default BottomBar;
