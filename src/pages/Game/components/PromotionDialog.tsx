import { ButtonGroup } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';

import Piece from '@/components/Piece';

interface PromotionDialogProps {
  color: Color;
  onPromote: (piece: Piece) => void;
}

interface PromoteButtonProps {
  color: Color;
  piece: Piece;
  onPromote: (piece: Piece) => void;
}

const PromoteButton = ({ color, piece, onPromote }: PromoteButtonProps) => {
  const parsedPiece = (
    color === 'white' ? piece.toUpperCase() : piece.toLowerCase()
  ) as Piece;

  return (
    <Button onClick={() => onPromote(parsedPiece)}>
      <Piece piece={parsedPiece} />
    </Button>
  );
};

const PromotionDialog = ({ color, onPromote }: PromotionDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={true}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{t('promotion_title')}</DialogTitle>
      <DialogContent>
        <ButtonGroup variant="outlined" className="h-16">
          <PromoteButton color={color} piece="Q" onPromote={onPromote} />
          <PromoteButton color={color} piece="R" onPromote={onPromote} />
          <PromoteButton color={color} piece="N" onPromote={onPromote} />
          <PromoteButton color={color} piece="B" onPromote={onPromote} />
        </ButtonGroup>
      </DialogContent>
    </Dialog>
  );
};

export default PromotionDialog;
