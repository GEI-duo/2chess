import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded';
import FullscreenExitRoundedIcon from '@mui/icons-material/FullscreenExitRounded';
import FlipCameraAndroidRoundedIcon from '@mui/icons-material/FlipCameraAndroidRounded';

import UpdateRoundedIcon from '@mui/icons-material/UpdateRounded';
import UpdateDisabledRoundedIcon from '@mui/icons-material/UpdateDisabledRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { memo } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuAppBar from '@/components/AppBar';
import { Tooltip } from '@mui/material';
import { t } from 'i18next';

interface GameAppBarProps {
  isFullscreen?: boolean;
  isAutoFlip?: boolean;
  handleFlip?: () => void;
  handleAutoFlip?: () => void;
  handleFullscreen?: () => void;
  handleMenu?: () => void;
}

const GameAppBar = memo(
  ({
    isFullscreen = false,
    isAutoFlip = false,
    handleFlip = () => {},
    handleAutoFlip = () => {},
    handleFullscreen = () => {},
    handleMenu = () => {},
  }: GameAppBarProps) => {
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
      React.useState<null | HTMLElement>(null);

    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleMobileMenuClose = () => {
      setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
      setMobileMoreAnchorEl(event.currentTarget);
    };

    const mobileMenuId = 'actions-menu-mobile';
    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        id={mobileMenuId}
        keepMounted
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        <Tooltip title={t('flip_board')} placement="left" arrow>
          <MenuItem onClick={handleFlip} sx={{ justifyContent: 'center' }}>
            <FlipCameraAndroidRoundedIcon style={{ fontSize: '1.25rem' }} />
          </MenuItem>
        </Tooltip>
        <Tooltip
          title={t(isAutoFlip ? 'autorotate_board_off' : 'autorotate_board_on')}
          placement="left"
          arrow
        >
          <MenuItem onClick={handleAutoFlip} sx={{ justifyContent: 'center' }}>
            {isAutoFlip ? (
              <UpdateRoundedIcon style={{ fontSize: '1.25rem' }} />
            ) : (
              <UpdateDisabledRoundedIcon style={{ fontSize: '1.25rem' }} />
            )}
          </MenuItem>
        </Tooltip>
        <Tooltip
          title={t(isFullscreen ? 'minimize' : 'maximize')}
          placement="left"
          arrow
        >
          <MenuItem
            onClick={handleFullscreen}
            sx={{ justifyContent: 'center' }}
          >
            {isFullscreen ? (
              <FullscreenExitRoundedIcon sx={{ fontSize: '1.5rem' }} />
            ) : (
              <FullscreenRoundedIcon sx={{ fontSize: '1.5rem' }} />
            )}
          </MenuItem>
        </Tooltip>
      </Menu>
    );

    return (
      <MenuAppBar showMenu={true} handleMenu={handleMenu}>
        <Box sx={{ display: { xxs: 'none', xs: 'flex' } }}>
          <Tooltip title={t('flip_board')}>
            <IconButton
              size="large"
              aria-label="flip"
              onClick={handleFlip}
              color="inherit"
              className="size-12"
            >
              <FlipCameraAndroidRoundedIcon style={{ fontSize: '1.25rem' }} />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={t(
              isAutoFlip ? 'autorotate_board_off' : 'autorotate_board_on',
            )}
          >
            <IconButton
              size="large"
              aria-label="auto-flip"
              onClick={handleAutoFlip}
              color="inherit"
              className="size-12"
            >
              {isAutoFlip ? (
                <UpdateRoundedIcon style={{ fontSize: '1.25rem' }} />
              ) : (
                <UpdateDisabledRoundedIcon style={{ fontSize: '1.25rem' }} />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title={t(isFullscreen ? 'minimize' : 'maximize')}>
            <IconButton
              size="large"
              aria-label="fullscreen"
              onClick={handleFullscreen}
              color="inherit"
              className="size-12"
            >
              {isFullscreen ? (
                <FullscreenExitRoundedIcon sx={{ fontSize: '1.5rem' }} />
              ) : (
                <FullscreenRoundedIcon sx={{ fontSize: '1.5rem' }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ display: { xxs: 'flex', xs: 'none' } }}>
          <IconButton
            size="large"
            aria-label="show more"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
        {renderMobileMenu}
      </MenuAppBar>
    );
  },
);

export default GameAppBar;
