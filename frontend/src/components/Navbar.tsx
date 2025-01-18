import React, { useState } from 'react';
import { AppBar, Toolbar, Container, styled } from '@mui/material';
import Logo from './ui/Logo';
import NavLinks from './ui/NavLinks';
import SearchBar from './ui/SearchBar';
import AuthButtons from './ui/AuthButtons';
import LoginModal from './auth/LoginModal';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#ffffff',
  boxShadow: 'none',
  borderBottom: '1px solid #e0e0e0',
});

const StyledToolbar = styled(Toolbar)({
  minHeight: '64px',
  padding: '0 !important',
  display: 'flex',
  justifyContent: 'space-between',
});

const LeftSection = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const RightSection = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const Navbar: React.FC = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const handleOpenLoginModal = () => {
    setLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setLoginModalOpen(false);
  };

  const handleSwitchToRegister = () => {
    // Implement this when you create the register modal
    console.log('Switch to register');
  };

  return (
    <>
      <StyledAppBar position="static">
        <Container maxWidth="lg">
          <StyledToolbar>
            <LeftSection>
              <Logo />
              <NavLinks />
            </LeftSection>
            <RightSection>
              <SearchBar />
              <AuthButtons onLoginClick={handleOpenLoginModal} />
            </RightSection>
          </StyledToolbar>
        </Container>
      </StyledAppBar>
      <LoginModal
        open={loginModalOpen}
        onClose={handleCloseLoginModal}
        onSwitchToRegister={handleSwitchToRegister}
      />
    </>
  );
};

export default Navbar;

