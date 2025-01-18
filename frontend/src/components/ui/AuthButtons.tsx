import React from 'react';
import { Box } from '@mui/material';
import CustomButton from './CustomButton';

interface AuthButtonsProps {
  onLoginClick: () => void;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ onLoginClick }) => (
  <Box>
    <CustomButton 
      variant="login" 
      onClick={onLoginClick}
      style={{ marginRight: '10px' }}
    >
      Đăng nhập
    </CustomButton>
    <CustomButton 
      variant="signup" 
      onClick={() => console.log('Register clicked')}
    >
      Đăng ký
    </CustomButton>
  </Box>
);

export default AuthButtons;

