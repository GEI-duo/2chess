import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { availableLanguages, getLanguageName } from '@/i18n';
import dayjs from 'dayjs';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import { Box } from '@mui/material';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const [language, setLanguage] = useState(i18n.language);

  const changeLanguage = (e: SelectChangeEvent<string>) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    dayjs.locale(newLanguage);
  };

  return (
    <Select
      id="language-switcher"
      value={language}
      onChange={changeLanguage}
      renderValue={selected => (
        <Box className="flex gap-2 items-center">
          <LanguageRoundedIcon sx={{ paddingBottom: '1px' }} />
          <span>{getLanguageName(selected)}</span>
        </Box>
      )}
      variant="outlined"
      sx={{
        height: '2.5rem',
        color: 'text.primary',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'text.secondary',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'text.secondary',
        },
        '& .MuiSvgIcon-root': {
          color: 'text.secondary',
        },
      }}
    >
      {availableLanguages.map(lang => (
        <MenuItem key={lang.code} value={lang.code}>
          {lang.name}
        </MenuItem>
      ))}
    </Select>
  );
}
