import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Menu, MenuItem, styled } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const NavLinkContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 'var(--underline-left, 0)',
    width: 'var(--underline-width, 0)',
    height: '2px',
    backgroundColor: '#039be5',
    transition: 'all 0.3s ease',
  },
});

const NavLink = styled(Link)<{ $active: boolean }>(({ $active }) => ({
  color: '#039be5',
  textDecoration: 'none',
  padding: '8px 16px',
  fontSize: 'large',
  fontWeight: 700,
  position: 'relative',
  transition: 'all 0.3s ease',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: $active ? '100%' : '0',
    height: '2px',
    backgroundColor: '#039be5',
    transition: 'all 0.3s ease',
    transform: 'translateX(-50%)',
  },
}));

const DropdownLink = styled(Box)<{ $active: boolean }>(({ $active }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  color: '#039be5',
  padding: '8px 16px',
  fontSize: 'large',
  fontWeight: 700,
  position: 'relative',
  transition: 'all 0.3s ease',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: $active ? '100%' : '0',
    height: '2px',
    backgroundColor: '#039be5',
    transition: 'all 0.3s ease',
    transform: 'translateX(-50%)',
  },
}));

const NavLinks: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const updateUnderline = () => {
      const activeLink = containerRef.current?.querySelector('[data-active="true"]') as HTMLElement | null;
      if (activeLink && containerRef.current) {
        containerRef.current.style.setProperty('--underline-width', `${activeLink.offsetWidth}px`);
        containerRef.current.style.setProperty('--underline-left', `${activeLink.offsetLeft}px`);
      }
    };

    updateUnderline();
    window.addEventListener('resize', updateUnderline);
    return () => window.removeEventListener('resize', updateUnderline);
  }, [location]);

  return (
    <NavLinkContainer
      ref={containerRef}
      onMouseLeave={() => {
        const activeLink = containerRef.current?.querySelector('[data-active="true"]') as HTMLElement | null;
        if (activeLink && containerRef.current) {
          containerRef.current.style.setProperty('--underline-width', `${activeLink.offsetWidth}px`);
          containerRef.current.style.setProperty('--underline-left', `${activeLink.offsetLeft}px`);
        }
      }}
    >
      <NavLink to="/" $active={isActive('/')} data-active={isActive('/')}>
        Trang chủ
      </NavLink>
      <NavLink to="/danh-sach" $active={isActive('/danh-sach')} data-active={isActive('/danh-sach')}>
        Danh sách
      </NavLink>
      <DropdownLink
        onClick={handleMenuOpen}
        $active={isActive('/huong-dan') || isActive('/chung-toi')}
        data-active={isActive('/huong-dan') || isActive('/chung-toi')}
      >
        Khác
        <KeyboardArrowDownIcon />
      </DropdownLink>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <NavLink to="/huong-dan" $active={isActive('/huong-dan')} data-active={isActive('/huong-dan')}>
            Hướng dẫn
          </NavLink>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <NavLink to="/chung-toi" $active={isActive('/chung-toi')} data-active={isActive('/chung-toi')}>
            Chúng tôi
          </NavLink>
        </MenuItem>
      </Menu>
    </NavLinkContainer>
  );
};

export default NavLinks;

