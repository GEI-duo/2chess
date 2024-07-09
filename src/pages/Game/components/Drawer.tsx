import MUIDrawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { useTranslation } from 'react-i18next';
import { Suspense } from 'react';

interface DrawerProps {
  open: boolean;
  closeDrawer: () => void;
  handleDraw: () => void;
  handleSurrender: () => void;
  handleRestart: () => void;
  handleExit: () => void;
}

export default function Drawer({
  open,
  closeDrawer,
  handleDraw,
  handleSurrender,
  handleRestart,
  handleExit,
}: DrawerProps) {
  const { t } = useTranslation();
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      if (!open) closeDrawer();
    };

  return (
    <Suspense fallback="loading">
      <MUIDrawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem key="continue" disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <PlayArrowRoundedIcon />
                </ListItemIcon>
                <ListItemText>{t('continue')}</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem key="restart" disablePadding>
              <ListItemButton onClick={handleRestart}>
                <ListItemIcon>
                  <RestartAltRoundedIcon />
                </ListItemIcon>
                <ListItemText>{t('restart')}</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem key="exit" disablePadding>
              <ListItemButton onClick={handleExit}>
                <ListItemIcon>
                  <HomeRoundedIcon />
                </ListItemIcon>
                <ListItemText>{t('exit')}</ListItemText>
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem key="draw" disablePadding>
              <ListItemButton onClick={handleDraw}>
                <ListItemText>{t('draw')}</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem key="surrender" disablePadding>
              <ListItemButton onClick={handleSurrender}>
                <ListItemText>{t('surrender')}</ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </MUIDrawer>
    </Suspense>
  );
}
