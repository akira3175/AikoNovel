import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

type CustomVariant = 'login' | 'signup' | 'default';

interface CustomButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: CustomVariant;
}

const StyledButton = styled(MuiButton)<{ customVariant?: CustomVariant }>(({ theme, customVariant }) => ({
  display: 'inline-flex',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  verticalAlign: 'middle',
  overflow: 'hidden',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  fontWeight: 600,
  borderRadius: '0.4rem',
  padding: '8px 16px',
  transition: 'all 0.3s ease',

  ...(customVariant === 'login' && {
    backgroundColor: 'hsla(240, 7%, 70%, .22)',
    color: '#039be5',
    borderColor: 'transparent',
    '&:hover': {
      backgroundColor: 'hsla(240, 7%, 70%, .3)',
    },
  }),

  ...(customVariant === 'signup' && {
    backgroundColor: '#039be5',
    color: 'white !important',
    '&:hover': {
      backgroundColor: '#0288d1',
    },
  }),

  ...(customVariant === 'default' && {
    // You can define default styles here if needed
    backgroundColor: theme.palette.grey[200],
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.grey[300],
    },
  }),
}));

const CustomButton: React.FC<CustomButtonProps> = ({ children, variant = 'default', ...props }) => {
  return (
    <StyledButton customVariant={variant} {...props}>
      {children}
    </StyledButton>
  );
};

export default CustomButton;

