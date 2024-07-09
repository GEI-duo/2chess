import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ReactNode, createContext, useMemo, useState } from 'react';
import { themeOptions } from '@/theme/theme.tsx';
import { useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { esES as coreES, enUS as coreEN } from '@mui/material/locale';
import { esES as dateES, enUS as dateEN } from '@mui/x-date-pickers/locales';

type ThemeContextType = {
  switchColorMode: () => void;
};

type ThemeProviderProps = {
  children: ReactNode;
};

type ColorMode = 'light' | 'dark';

export const ThemeContext = createContext<ThemeContextType>({
  switchColorMode: () => {},
});

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
