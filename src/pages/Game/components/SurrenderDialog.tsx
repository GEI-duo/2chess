import { DialogActions, DialogContent, DialogContentText } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';

interface SurrenderDialogProps {
  onSurrender: () => void;
  onCancel: () => void;
}

const SurrenderDialog = ({ onSurrender, onCancel }: SurrenderDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={true}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{t('surrender_title')}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t('surrender_message')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCancel} autoFocus>
          {t('cancel')}
        </Button>
        <Button onClick={onSurrender}>{t('surrender')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SurrenderDialog;
