import React from 'react';
import { Box, useTheme } from '@mui/material';
import styled from 'styled-components';
import CustomButton from './CustomButton';

interface AuthButtonsProps {
    onLoginClick: () => void;
  }
  

const AuthButtons: React.FC<AuthButtonsProps> = ({ onLoginClick }) => {
    const theme = useTheme();
  
    const ButtonContainer = styled(Box)({
      display: 'flex',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        width: '100%',
      },
    });
  
    return (
      <ButtonContainer>
        <CustomButton 
          variant="login" 
          onClick={onLoginClick}
          style={{ marginRight: '10px', marginBottom: '10px', marginTop: '10px' }}
        >
          Đăng nhập
        </CustomButton>
        <CustomButton 
          variant="signup" 
          onClick={() => console.log('Register clicked')}
          style={{ marginRight: '10px', marginBottom: '10px', marginTop: '10px'  }}
        >
          Đăng ký
        </CustomButton>
      </ButtonContainer>
    );
  };
  
  export default AuthButtons;