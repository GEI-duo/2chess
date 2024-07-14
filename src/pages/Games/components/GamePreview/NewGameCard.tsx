import {
  Card,
  CardActionArea,
  CardContent,
  Fab,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Link } from 'react-router-dom';

export default function NewGameCard() {
  const { t } = useTranslation();

  return (
    <>
      <Card className="h-[30rem] flex">
        <CardActionArea component={Link} to={'/2chess/games/'}>
          <CardContent className="flex flex-col h-full gap-2 justify-center">
            <Tooltip
              title={t('add_game')}
              placement="top"
              arrow
              className="flex items-center"
            >
              <Stack className="flex gap-2">
                <Fab color="primary" aria-label="add" className="shadow-lg">
                  <AddRoundedIcon />
                </Fab>
                <Typography variant="body2">{t('new_game')}</Typography>
              </Stack>
            </Tooltip>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}
