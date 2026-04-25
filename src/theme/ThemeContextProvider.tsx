import { ReactNode, useMemo, useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { enUS as coreEN, esES as coreES } from '@mui/material/locale';
import { createTheme,ThemeProvider } from '@mui/material/styles';
import { enUS as dateEN, esES as dateES } from '@mui/x-date-pickers/locales';
import { useTranslation } from 'react-i18next';

import { themeOptions } from '@/theme/theme.tsx';

import { ThemeContext } from './ThemeContext';

type ThemeProviderProps = {
  children: ReactNode;
};

type ColorMode = 'light' | 'dark';

const locales = {
  es: [coreES, dateES],
  en: [coreEN, dateEN],
};

export function ThemeContextProvider({ children }: ThemeProviderProps) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const loadedMode =
    (localStorage.getItem('colorMode') as ColorMode) ??
    (prefersDarkMode ? 'dark' : 'light');
  const [mode, setMode] = useState<ColorMode>(loadedMode);
  const { i18n } = useTranslation();

  const locale =
    i18n.language in locales
      ? locales[i18n.language as keyof typeof locales]
      : locales['en'];

  const switchColorMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    localStorage.setItem('colorMode', newMode);
    setMode(newMode);
  };

  const theme = useMemo(
    () =>
      createTheme(
        {
          ...themeOptions,
          palette: {
            ...themeOptions.palette,
            mode,
          },
        },
        ...locale,
      ),
    [locale, mode],
  );

  return (
    <ThemeContext.Provider value={{ switchColorMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}
