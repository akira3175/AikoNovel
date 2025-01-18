import React from 'react';
import { AppBar, Toolbar, Container, styled } from '@mui/material';
import Logo from './ui/Logo';
import NavLinks from './ui/NavLinks';
import SearchBar from './ui/SearchBar';
import AuthButtons from './ui/AuthButtons';

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
  return (
    <StyledAppBar position="static">
      <Container maxWidth="lg">
        <StyledToolbar>
          <LeftSection>
            <Logo />
            <NavLinks />
          </LeftSection>
          <RightSection>
            <SearchBar />
            <AuthButtons />
          </RightSection>
        </StyledToolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Navbar;

