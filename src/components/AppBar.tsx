import MUIAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import React from 'react';
import { Link } from 'react-router-dom';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface AppBarProps {
  showMenu?: boolean;
  handleMenu?: () => void;
  children?: React.ReactNode;
}

export default function AppBar({
  showMenu = false,
  handleMenu = () => {},
  children,
}: AppBarProps) {
  const { t } = useTranslation();

  return (
    <Box>
      <MUIAppBar position="static">
        <Toolbar>
          {showMenu && (
            <Toolbar title={t('menu')}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                onClick={handleMenu}
                aria-label="menu"
                sx={{ mr: 2 }}
                className="size-12"
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            <Link to="/2chess">2Chess</Link>
          </Typography>
          <Stack direction="row" spacing={2} className="items-center">
            {children}
          </Stack>
        </Toolbar>
      </MUIAppBar>
    </Box>
  );
}
