import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Welcome to Data Ingestion Tool
      </Typography>
      <Box sx={{ mt: 2, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ width: { xs: '100%', md: '45%' } }}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Import Data
              </Typography>
              <Typography color="text.secondary" paragraph>
                Import data from various sources into ClickHouse database.
              </Typography>
              <Button
                component={Link}
                to="/source-selection"
                variant="contained"
                color="primary"
              >
                Start Import
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </div>
  );
};

export default HomePage;
