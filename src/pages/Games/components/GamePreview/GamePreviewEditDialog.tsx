import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

import { useState } from 'react';
import UserProfile from '@/components/UserProfile';
import { Form } from 'react-router-dom';
import { db } from '@/db';
import { useTranslation } from 'react-i18next';

interface GameEditDialogProps {
  gameId: number;
  open: boolean;
  handleClose: () => void;
  gameTitle: string;
  whiteName: string;
  blackName: string;
}

export default function GameEditDialog({
  gameId,
  open,
  handleClose,
  gameTitle,
  whiteName,
  blackName,
}: GameEditDialogProps) {
  const { t } = useTranslation();

  const [newGameTitle, setNewGameTitle] = useState<string>(gameTitle);
  const [newWhiteName, setNewWhiteName] = useState<string>(whiteName);
  const [newBlackName, setNewBlackName] = useState<string>(blackName);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await db.games.update(gameId, {
      title: newGameTitle || gameTitle,
      whiteName: newWhiteName || whiteName,
      blackName: newBlackName || blackName,
    });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <Form method="PATCH" action={`/games/${gameId}`} onSubmit={handleSubmit}>
        <DialogTitle>{t('edit_game')}</DialogTitle>
        <DialogContent className="flex flex-col gap-8">
          <TextField
            id="gameTitle"
            label={t('game_title')}
            name="gameTitle"
            variant="standard"
            className="w-full"
            value={newGameTitle}
            onChange={e => setNewGameTitle(e.target.value)}
          />
          <Box className="flex flex-col gap-6">
            <Box className="flex items-end w-full gap-3">
              <div className="size-8">
                <UserProfile color="white" />
              </div>
              <TextField
                id="whiteName"
                label={t('player1')}
                name="whiteName"
                variant="standard"
                className="w-full"
                value={newWhiteName}
                onChange={e => setNewWhiteName(e.target.value)}
              />
            </Box>
            <Box className="flex items-end w-full gap-3">
              <div className="size-8">
                <UserProfile color="black" />
              </div>
              <TextField
                id="blackName"
                label={t('player2')}
                name="blackName"
                variant="standard"
                className="w-full"
                value={newBlackName}
                onChange={e => setNewBlackName(e.target.value)}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('cancel')}</Button>
          <Button type="submit">{t('edit')}</Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
