import { DialogActions, DialogContent, DialogContentText } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';

interface DrawDialogProps {
  onDraw: (draw: boolean) => void;
}

const DrawDialog = ({ onDraw }: DrawDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={true}
      onClose={() => onDraw(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{t('draw_title')}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t('draw_message')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => onDraw(false)} autoFocus>
          {t('cancel')}
        </Button>
        <Button onClick={() => onDraw(true)}>{t('draw')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DrawDialog;
