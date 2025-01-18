import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'success.main', color: 'white', p: 3, mt: 5 }}>
      <Typography variant="h6" align="center">
        Aiko Novel - All rights reserved
      </Typography>
    </Box>
  );
};

export default Footer;