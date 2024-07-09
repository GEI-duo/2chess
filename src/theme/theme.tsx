// https://zenoo.github.io/mui-theme-creator/
import { ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xxs: true;
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
  }
}

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#689f38',
    },
    secondary: {
      main: '#558b2f',
    },
  },
  breakpoints: {
    values: {
      xxs: 0,
      xs: 360,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
};
