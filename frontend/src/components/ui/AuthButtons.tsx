import React from 'react';
import { Box } from '@mui/material';
import CustomButton from './CustomButton';

const AuthButtons: React.FC = () => (
  <Box>
    <CustomButton 
      variant="login" 
      onClick={() => console.log('Login clicked')}
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

