import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import IconButton from '@mui/material/IconButton';
import { Tooltip, useTheme } from '@mui/material';
import { useContext } from 'react';
import { ThemeContext } from '@/theme/ThemeContextProvider';
import { useTranslation } from 'react-i18next';

export default function NightModeToggle() {
  const { switchColorMode } = useContext(ThemeContext);
  const theme = useTheme();
  const { t } = useTranslation();

  const darkMode = theme.palette.mode === 'dark';

  return (
    <Tooltip title={t(darkMode ? 'light_theme' : 'dark_theme')}>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        className="size-12"
        onClick={switchColorMode}
      >
        {darkMode ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
      </IconButton>
    </Tooltip>
  );
}
