import CssBaseline from '@mui/material/CssBaseline';
import { ThemeContextProvider } from '@/theme/ThemeContextProvider.tsx';
import Routes from '@/routes.tsx';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useTranslation } from 'react-i18next';
import 'dayjs/locale/es';

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
