import FilterListIcon from '@mui/icons-material/FilterList';
import { IconButton, Tooltip } from '@mui/material';
import { useAtom } from 'jotai';
import { filteredAtom } from '../../state/gameFilters';
import { useTranslation } from 'react-i18next';

export default function FilterButton() {
  const [enableFilter, setEnableFilter] = useAtom(filteredAtom);
  const { t } = useTranslation();

  return (
    <Tooltip title={t(enableFilter ? 'filter_off' : 'filter_on')}>
      <IconButton
        onClick={() => setEnableFilter(prev => !prev)}
        color={enableFilter ? 'primary' : 'default'}
        className="size-12"
      >
        <FilterListIcon />
      </IconButton>
    </Tooltip>
  );
}
