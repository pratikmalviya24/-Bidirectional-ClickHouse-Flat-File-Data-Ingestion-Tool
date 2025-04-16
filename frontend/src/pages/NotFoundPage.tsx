import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        mt: 8
      }}
    >
      <Typography variant="h1" color="text.secondary">
        404
      </Typography>
      <Typography variant="h5" color="text.secondary" sx={{ mt: 2, mb: 4 }}>
        Page Not Found
      </Typography>
      <Button component={Link} to="/" variant="contained">
        Return to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
