import { Link } from 'react-router-dom';

import MenuAppBar from '@/components/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Fab from '@mui/material/Fab';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import NightModeToggle from '@/components/NightModeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import GitHubIcon from '@mui/icons-material/GitHub';
import GameFilter from '@/pages/Games/components/Search/GameFilter';
import SortButton from '@/pages/Games/components/Search/SortButton';
import SearchBar from '@/pages/Games/components/Search/SearchBar';
import FilterButton from '@/pages/Games/components/Search/FilterButton';
import GameList from '@/pages/Games/components/GameList';
import { filteredAtom } from './state/gameFilters';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import Tooltip from '@mui/material/Tooltip';

export default function Games() {
  const [filtered] = useAtom(filteredAtom);
  const { t } = useTranslation();

  return (
    <>
      <MenuAppBar>
        <LanguageSwitcher />
        <NightModeToggle />
        <Link to="https://github.com/GEI-duo/chess">
          <GitHubIcon />
        </Link>
      </MenuAppBar>
      <Box className="overflow-y-scroll h-full py-12">
        <Box className="flex flex-col w-[40rem] max-w-full mx-auto px-4 mb-12 sm:mt-8">
          <Box className="flex w-full gap-2 items-center">
            <SearchBar />
            <Box className="ml-2">
              <SortButton />
              <FilterButton />
            </Box>
          </Box>
          {filtered && <GameFilter />}
        </Box>
        <Box className="w-full">
          <Container>
            <GameList />
          </Container>
        </Box>
      </Box>
      <Tooltip title={t('add_game')} placement="top" arrow>
        <Link to="/games" className="absolute bottom-12 right-12">
          <Fab color="primary" aria-label="add" className="shadow-lg">
            <AddRoundedIcon />
          </Fab>
        </Link>
      </Tooltip>
    </>
  );
}
