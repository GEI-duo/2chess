import Piece from '@/components/Piece';
import { ButtonGroup } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';

interface PromotionDialogProps {
  color: Color;
  onPromote: (piece: Piece) => void;
}

const PromotionDialog = ({ color, onPromote }: PromotionDialogProps) => {
  const { t } = useTranslation();

  const PromoteButton = ({ piece }: { piece: Piece }) => {
    const parsedPiece = (
      color === 'white' ? piece.toUpperCase() : piece.toLowerCase()
    ) as Piece;

    return (
      <Button onClick={() => onPromote(parsedPiece)}>
        <Piece piece={parsedPiece} />
      </Button>
    );
  };

  return (
    <Dialog
      open={true}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{t('promotion_title')}</DialogTitle>
      <DialogContent>
        <ButtonGroup variant="outlined" className="h-16">
          <PromoteButton piece="Q" />
          <PromoteButton piece="R" />
          <PromoteButton piece="N" />
          <PromoteButton piece="B" />
        </ButtonGroup>
      </DialogContent>
    </Dialog>
  );
};

export default PromotionDialog;
