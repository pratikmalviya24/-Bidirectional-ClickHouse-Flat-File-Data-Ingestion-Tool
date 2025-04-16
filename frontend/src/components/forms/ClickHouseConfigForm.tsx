import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import { sourceApi, ClickHouseConfig } from '../../services/api';

interface ClickHouseConfigFormProps {
  onConfigured: (config: ClickHouseConfig) => void;
}

const ClickHouseConfigForm: React.FC<ClickHouseConfigFormProps> = ({ onConfigured }) => {
  const [config, setConfig] = useState<ClickHouseConfig>({
    host: '',
    port: 8123,
    database: '',
    username: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: name === 'port' ? parseInt(value, 10) || '' : value,
    }));
  };

  const validateForm = (): boolean => {
    if (!config.host || !config.port || !config.database || !config.username) {
      setError('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const handleTestConnection = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      await sourceApi.testClickHouseConnection(config);
      onConfigured(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to ClickHouse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}
        
        <TextField
          required
          label="Host"
          name="host"
          value={config.host}
          onChange={handleInputChange}
          fullWidth
        />

        <TextField
          required
          label="Port"
          name="port"
          type="number"
          value={config.port}
          onChange={handleInputChange}
          fullWidth
        />

        <TextField
          required
          label="Database"
          name="database"
          value={config.database}
          onChange={handleInputChange}
          fullWidth
        />

        <TextField
          required
          label="Username"
          name="username"
          value={config.username}
          onChange={handleInputChange}
          fullWidth
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          value={config.password}
          onChange={handleInputChange}
          fullWidth
        />

        <Button
          variant="contained"
          onClick={handleTestConnection}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Testing Connection...' : 'Test Connection'}
        </Button>
      </Stack>
    </Box>
  );
};

export default ClickHouseConfigForm;
