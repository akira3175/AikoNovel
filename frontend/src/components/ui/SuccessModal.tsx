import React, { useEffect } from 'react';
import { Modal, Box, Typography, styled } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: '24px',
  boxShadow: '0 12px 32px 4px rgba(0, 0, 0, .04), 0 8px 20px rgba(0, 0, 0, .08)',
  padding: '32px',
  width: '400px',
  maxWidth: '90%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
}));

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open, onClose, message }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  return (
    <StyledModal open={open} onClose={onClose}>
      <ModalContent>
        <CheckCircle color="primary" style={{ fontSize: 64, marginBottom: 16 }} />
        <Typography variant="h5" gutterBottom>
          Thành công!
        </Typography>
        <Typography variant="body1" gutterBottom>
          {message}
        </Typography>
      </ModalContent>
    </StyledModal>
  );
};

export default SuccessModal;
