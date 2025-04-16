import React from 'react';
import { Typography, Paper, Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SourceSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSourceSelect = (sourceType: 'clickhouse' | 'file') => {
    navigate('/configure', { state: { sourceType } });
  };
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Select Data Source
      </Typography>
      <Stack spacing={3} sx={{ mt: 4, maxWidth: 600 }}>
        <Button
          component={Paper}
          onClick={() => handleSourceSelect('clickhouse')}
          sx={{
            p: 3,
            textTransform: 'none',
            justifyContent: 'flex-start',
            '&:hover': { backgroundColor: 'action.hover' }
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h6" sx={{ color: 'primary.main' }}>📊</Typography>
            <div>
              <Typography variant="h6" align="left">ClickHouse Database</Typography>
              <Typography color="text.secondary" align="left">
                Import data from another ClickHouse database
              </Typography>
            </div>
          </Stack>
        </Button>
        
        <Button
          component={Paper}
          onClick={() => handleSourceSelect('file')}
          sx={{
            p: 3,
            textTransform: 'none',
            justifyContent: 'flex-start',
            '&:hover': { backgroundColor: 'action.hover' }
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h6" sx={{ color: 'primary.main' }}>📄</Typography>
            <div>
              <Typography variant="h6" align="left">Flat File</Typography>
              <Typography color="text.secondary" align="left">
                Import data from CSV, JSON, or other flat file formats
              </Typography>
            </div>
          </Stack>
        </Button>
      </Stack>
    </div>
  );
};

export default SourceSelectionPage;
