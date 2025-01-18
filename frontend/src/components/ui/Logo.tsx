import React from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const LogoImage = styled('img')({
  height: '50px',
  marginRight: '20px',
});

const Logo: React.FC = () => (
  <Link to="/">
    <LogoImage src="https://akira3175.pythonanywhere.com/static/app/images/logo/main-logo-1.png" alt="Aiko Novel" />
  </Link>
);

export default Logo;

