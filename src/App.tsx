import 'dayjs/locale/es';

import CssBaseline from '@mui/material/CssBaseline';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useTranslation } from 'react-i18next';

import Routes from '@/routes.tsx';
import { ThemeContextProvider } from '@/theme/ThemeContextProvider.tsx';

export default function App() {
  const { i18n } = useTranslation();

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={i18n.language}
    >
      <ThemeContextProvider>
        <CssBaseline />
        <Routes />
      </ThemeContextProvider>
    </LocalizationProvider>
  );
}
