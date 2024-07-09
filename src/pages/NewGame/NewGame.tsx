import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Form } from 'react-router-dom';
import MenuAppBar from '@/components/AppBar';
import UserProfile from '@/components/UserProfile';
import { useTranslation } from 'react-i18next';

export default function NewGame() {
  const { t } = useTranslation();

  const [whiteName, setWhiteName] = useState<string>('');
  const [blackName, setBlackName] = useState<string>('');
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [increment, setIncrement] = useState<number>(0);
  const [gameTitle, setGameTitle] = useState<string>('');

  return (
    <>
      <MenuAppBar />
      <Form method="post" action="/2chess/games" className="overflow-y-auto">
        <Box className="flex flex-col items-center gap-16 m-auto max-w-96 min-w-0 w-full py-12 px-2">
          <Typography variant="h4">{t('new_game')}</Typography>
          <Box className="flex flex-col justify-center w-full gap-12">
            <Box>
              <TextField
                id="gameTitle"
                label={t('game_title')}
                name="gameTitle"
                variant="standard"
                className="w-full"
                value={gameTitle}
                onChange={e => setGameTitle(e.target.value)}
              />
            </Box>
            <Box className="flex flex-col gap-4">
              <Box className="flex items-end w-full gap-3">
                <Box className="size-8">
                  <UserProfile color="white" />
                </Box>
                <TextField
                  id="whiteName"
                  label={t('player1')}
                  name="whiteName"
                  variant="standard"
                  className="w-full"
                  value={whiteName}
                  onChange={e => setWhiteName(e.target.value)}
                />
              </Box>
              <Box className="flex items-end w-full gap-3">
                <Box className="size-8">
                  <UserProfile color="black" />
                </Box>
                <TextField
                  id="blackName"
                  label={t('player2')}
                  name="blackName"
                  variant="standard"
                  className="w-full"
                  value={blackName}
                  onChange={e => setBlackName(e.target.value)}
                />
              </Box>
            </Box>
            <Box className="flex gap-2">
              <TextField
                id="minutes"
                label={t('minutes')}
                name="minutes"
                type="number"
                variant="filled"
                value={minutes}
                InputProps={{ inputProps: { min: 0 } }}
                onChange={e => setMinutes(e.target.value as unknown as number)}
                onBlur={e => e.target.value === '' && setMinutes(0)}
                className="flex-1"
              />
              <TextField
                id="seconds"
                label={t('seconds')}
                name="seconds"
                type="number"
                variant="filled"
                value={seconds}
                InputProps={{ inputProps: { min: 0, max: 59 } }}
                onChange={e => setSeconds(e.target.value as unknown as number)}
                onBlur={e => e.target.value === '' && setSeconds(0)}
                className="flex-1"
              />
              <TextField
                id="increment"
                label={`${t('increment')} (s)`}
                name="increment"
                type="number"
                variant="filled"
                value={increment}
                InputProps={{ inputProps: { min: 0 } }}
                onChange={e =>
                  setIncrement(e.target.value as unknown as number)
                }
                onBlur={e => e.target.value === '' && setIncrement(0)}
                className="flex-1"
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              sx={{ marginTop: '1rem' }}
            >
              {t('play')}
            </Button>
          </Box>
        </Box>
      </Form>
    </>
  );
}
