import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Container, IconButton, 
  Drawer, List, ListItemButton, ListItemText, 
  useMediaQuery, Avatar, Menu, MenuItem, 
  Typography, Box, Divider
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Logo from './ui/Logo';
import NavLinks from './ui/NavLinks';
import SearchBar from './ui/SearchBar';
import AuthButtons from './ui/AuthButtons';
import LoginModal from './auth/LoginModal';
import { useAuth } from '../contexts/AuthContext';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#ffffff',
  boxShadow: 'none',
  borderBottom: '1px solid #e0e0e0',
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: '64px',
  padding: '0 !important',
  display: 'flex',
  justifyContent: 'space-between',
}));

const LeftSection = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

const RightSection = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const DrawerContent = styled(Box)(({ theme }) => ({
  width: 250,
  padding: theme.spacing(2),
}));

const Navbar: React.FC = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { user, isAuthenticated, login, logout } = useAuth();

  const handleOpenLoginModal = () => {
    setLoginModalOpen(true);
    setDrawerOpen(false);
  };

  const handleCloseLoginModal = () => {
    setLoginModalOpen(false);
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      await login(username, password);
      handleCloseLoginModal();
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error (e.g., show an error message to the user)
    }
  };

  const handleLogout = () => {
    logout();
    handleCloseMenu();
    setDrawerOpen(false);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSwitchToRegister = () => {
    console.log('Switching to register modal');
  };  

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerContent = (
    <DrawerContent>
      <DrawerHeader>
        <IconButton onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Box mt={2} mb={2}>
        <SearchBar />
      </Box>
      <Divider />
      <List>
        {['Trang chủ', 'Danh sách', 'Hướng dẫn', 'Chúng tôi'].map((text) => (
          <ListItemButton key={text} onClick={toggleDrawer(false)}>
            <ListItemText primary={text} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      {isAuthenticated ? (
        <List>
          <ListItemButton onClick={handleOpenMenu}>
            <Avatar alt={user?.username || 'User'} src={user?.img_avatar || '/default-avatar.png'} sx={{ marginRight: 1 }} />
            <ListItemText primary={user?.fullname || user?.username || 'User'} />
          </ListItemButton>
          <ListItemButton onClick={toggleDrawer(false)}>
            <ListItemText primary="Thư viện" />
          </ListItemButton>
          <ListItemButton onClick={toggleDrawer(false)}>
            <ListItemText primary="Đổi mật khẩu" />
          </ListItemButton>
          <ListItemButton onClick={toggleDrawer(false)}>
            <ListItemText primary="Danh sách nhóm" />
          </ListItemButton>
          <ListItemButton onClick={handleLogout}>
            <ListItemText primary="Đăng xuất" />
          </ListItemButton>
        </List>
      ) : (
        <Box mt={2}>
          <AuthButtons onLoginClick={handleOpenLoginModal} />
        </Box>
      )}
    </DrawerContent>
  );

  return (
    <>
      <StyledAppBar position="static">
        <Container maxWidth="lg">
          <StyledToolbar>
            <LeftSection>
              <Logo />
              {!isMobile && <NavLinks />}
            </LeftSection>
            <RightSection>
              {!isMobile && (
                <>
                  <SearchBar />
                  {isAuthenticated ? (
                    <>
                      <IconButton onClick={handleOpenMenu}>
                        <Avatar alt={user?.username || 'User'} src={user?.img_avatar || '/default-avatar.png'} />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                      >
                        <MenuItem onClick={handleCloseMenu}>
                          <Avatar alt={user?.username || 'User'} src={user?.img_avatar || '/default-avatar.png'} sx={{ marginRight: 1 }} />
                          <ListItemText primary={user?.fullname || user?.username || 'User'} />
                        </MenuItem>
                        <MenuItem onClick={handleCloseMenu}>Thư viện</MenuItem>
                        <MenuItem onClick={handleCloseMenu}>Đổi mật khẩu</MenuItem>
                        <MenuItem onClick={handleCloseMenu}>Danh sách nhóm</MenuItem>
                        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <AuthButtons onLoginClick={handleOpenLoginModal} />
                  )}
                </>
              )}
              {isMobile && (
                <IconButton
                  edge="start"
                  sx={{ color: "#708090" }}
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </RightSection>
          </StyledToolbar>
        </Container>
      </StyledAppBar>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerContent}
      </Drawer>
      <LoginModal
        open={loginModalOpen}
        onClose={handleCloseLoginModal}
        onLogin={handleLogin}
        onSwitchToRegister={handleSwitchToRegister}
      />
    </>
  );
};

export default Navbar;

