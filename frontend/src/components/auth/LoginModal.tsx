import React, { useState } from 'react';
import axios from 'axios';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  styled,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ModalContent = styled(Box)({
  backgroundColor: '#fff',
  borderRadius: '24px',
  boxShadow: '0 12px 32px 4px rgba(0, 0, 0, .04), 0 8px 20px rgba(0, 0, 0, .08)',
  padding: '32px',
  width: '400px',
  maxWidth: '90%',
  position: 'relative',
});

const Logo = styled('div')({
  backgroundImage: 'url(/images/logo/main-logo-1.png)',
  backgroundSize: 'cover',
  width: '60px',
  height: '60px',
  margin: '-8px auto 18px auto',
});

const CloseButton = styled(CloseIcon)({
  position: 'absolute',
  top: '16px',
  right: '16px',
  cursor: 'pointer',
});

const StyledTextField = styled(TextField)({
  marginTop: '16px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
  },
});

const StyledButton = styled(Button)({
  width: '100%',
  minHeight: '48px',
  borderRadius: '12px',
  marginTop: '20px',
  marginBottom: '12px',
});

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose, onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/user/token/', { username, password });
      const { access, refresh } = response.data;
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      // Close the modal and update app state (you might want to lift this state up)
      onClose();
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <StyledModal open={open} onClose={onClose}>
      <ModalContent>
        <CloseButton onClick={onClose} />
        <Logo />
        <Typography variant="h5" align="center" gutterBottom>
          Đăng nhập tài khoản
        </Typography>
        <form onSubmit={handleLogin}>
          <StyledTextField
            fullWidth
            label="Tên người dùng"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!error}
          />
          <StyledTextField
            fullWidth
            label="Mật khẩu"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
          />
          {error && (
            <Typography color="error" variant="body2" align="left" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <StyledButton type="submit" variant="contained" color="primary">
            Đăng Nhập
          </StyledButton>
        </form>
        <Box display="flex" justifyContent="space-between" mt={1}>
          <Link href="#" variant="body2">
            Quên mật khẩu?
          </Link>
        </Box>
        <Typography variant="body2" align="center" mt={2}>
          Chưa có tài khoản?{' '}
          <Link component="button" variant="body2" onClick={onSwitchToRegister}>
            Đăng ký ngay
          </Link>
        </Typography>
      </ModalContent>
    </StyledModal>
  );
};

export default LoginModal;

