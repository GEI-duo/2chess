import SortIcon from '@mui/icons-material/Sort';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useAtom } from 'jotai';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { sortedAtom } from '@/pages/Games/state/gameFilters';
import { Tooltip } from '@mui/material';

export default function SortButton() {
  const [sorted, setSorted] = useAtom(sortedAtom);

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSorted((event.target as HTMLInputElement).value as 'newer' | 'older');
    handleMobileMenuClose();
  };

  return (
    <>
      <Tooltip title={t('sort_order')}>
        <IconButton
          ref={anchorRef}
          onClick={handleMobileMenuOpen}
          className="size-12"
        >
          <SortIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={mobileMoreAnchorEl}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={sorted}
            className="px-4"
            onChange={handleChange}
          >
            <FormControlLabel
              value="newer"
              control={<Radio />}
              label={t('newer_first')}
            />
            <FormControlLabel
              value="older"
              control={<Radio />}
              label={t('older_first')}
            />
          </RadioGroup>
        </FormControl>
      </Menu>
    </>
  );
}
