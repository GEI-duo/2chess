import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { useAtom } from 'jotai';
import { searchAtom } from '@/pages/Games/state/gameFilters';
import { useTranslation } from 'react-i18next';
import { IconButton, Paper } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

export default function SearchBar() {
  const [search, setSearch] = useAtom(searchAtom);
  const { t } = useTranslation();

  return (
    <Paper
      component="form"
      className="pl-6 pr-2 h-14 flex items-center flex-1"
      sx={{ borderRadius: '9999px' }}
    >
      <SearchIcon />
      <InputBase
        placeholder={t('search')}
        inputProps={{ 'aria-label': 'search games' }}
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="flex-1 px-4"
      />
      {search && (
        <IconButton onClick={() => setSearch('')}>
          <ClearIcon />
        </IconButton>
      )}
    </Paper>
  );
}
