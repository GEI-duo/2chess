import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DialogContent } from '@mui/material';

interface ResultsDialogProps {
  game: Game;
  onRematch: () => void;
}

const getTitleTranslationKey = (gameResult: GameResult) => {
  switch (gameResult) {
    case 'white':
      return 'white_won';
    case 'black':
      return 'black_won';
    case 'draw':
      return 'draw';
    default:
      return '';
  }
};

const getResultTranslationKey = (gameStatus: GameStatus) => {
  switch (gameStatus) {
    case 'surrender':
      return 'surrender';
    case 'checkmate':
      return 'checkmate';
    case 'stalemate':
      return 'stalemate';
    case 'insufficientMaterial':
      return 'insufficient_material';
    case 'threefoldRepetition':
      return 'threefold_repetition';
    case 'fiftyMoves':
      return 'fifty_moves';
    case `timeout`:
      return 'timeout';
    case 'draw':
      return 'draw_agreed';
    default:
      return '';
  }
};

const ResultsDialog = ({ game, onRematch: onAccept }: ResultsDialogProps) => {
  const { t } = useTranslation();

  const title = t(getTitleTranslationKey(game.gameResult));
  const result = t(getResultTranslationKey(game.gameStatus));

  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>{result}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('accept')}</Button>
        <Button autoFocus onClick={onAccept} variant="contained">
          {t('rematch')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResultsDialog;
