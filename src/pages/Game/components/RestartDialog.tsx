import { DialogActions, DialogContent, DialogContentText } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';

interface RestartDialogProps {
  onRestart: (restart: boolean) => void;
}

const RestartDialog = ({ onRestart }: RestartDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={true}
      onClose={() => onRestart(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{t('restart_title')}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t('restart_message')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => onRestart(false)} autoFocus>
          {t('cancel')}
        </Button>
        <Button onClick={() => onRestart(true)}>{t('restart')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RestartDialog;
