import React from 'react';
import { Typography, Box, IconButton } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ClickHouseConfigForm from '../components/forms/ClickHouseConfigForm';
import FileConfigForm from '../components/forms/FileConfigForm';
import { FileConfig, ClickHouseConfig } from '../services/api';
import { SourceConfig } from '../types/columns';

const ConfigurationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sourceType = location.state?.sourceType;

  const handleBack = () => {
    navigate('/source-selection');
  };

  const handleClickHouseConfigured = (config: ClickHouseConfig) => {
    const sourceConfig: SourceConfig = {
      sourceType: 'clickhouse',
      config,
    };
    navigate('/columns', { state: sourceConfig });
  };

  const handleFileConfigured = (config: FileConfig, file: File) => {
    const sourceConfig: SourceConfig = {
      sourceType: 'file',
      config,
      file,
    };
    navigate('/columns', { state: sourceConfig });
  };

  if (!sourceType) {
    navigate('/source-selection');
    return null;
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={handleBack}>
          <Typography variant="h6">←</Typography>
        </IconButton>
        <Typography variant="h4">
          Configure {sourceType === 'clickhouse' ? 'ClickHouse Connection' : 'File Import'}
        </Typography>
      </Box>

      {sourceType === 'clickhouse' ? (
        <ClickHouseConfigForm onConfigured={handleClickHouseConfigured} />
      ) : (
        <FileConfigForm onConfigured={handleFileConfigured} />
      )}
    </Box>
  );
};

export default ConfigurationPage;
