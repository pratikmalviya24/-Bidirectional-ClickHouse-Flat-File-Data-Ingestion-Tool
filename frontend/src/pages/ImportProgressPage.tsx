import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Alert,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { sourceApi, ImportStatus } from '../services/api';
import { SourceConfig } from '../types/columns';

interface LocationState extends SourceConfig {
  jobId: string;
}

const ImportProgressPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<ImportStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const state = location.state as LocationState;

  useEffect(() => {
    if (!state?.jobId) {
      navigate('/source-selection');
      return;
    }

    const pollStatus = async () => {
      try {
        const response = await sourceApi.getImportStatus(state.jobId);
        setStatus(response.data);

        if (response.data.status === 'failed') {
          setError(response.data.error || 'Import failed');
        } else if (response.data.status !== 'completed') {
          // Continue polling if not completed
          setTimeout(pollStatus, 2000);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch import status');
      }
    };

    pollStatus();

    return () => {
      // Cleanup timeout on unmount if needed
    };
  }, [state, navigate]);

  const handleBack = () => {
    navigate('/source-selection');
  };

  const handleRetry = () => {
    navigate('/columns', { state: state });
  };

  const renderStatus = () => {
    if (!status) return null;

    const progress = status.progress || 0;
    const statusColor = {
      pending: 'warning',
      processing: 'info',
      completed: 'success',
      failed: 'error',
    }[status.status] as 'warning' | 'info' | 'success' | 'error';

    return (
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Import {status.status === 'completed' ? 'Completed' : 'In Progress'}
            </Typography>
            <Chip
              label={status.status.toUpperCase()}
              color={statusColor}
              variant="outlined"
            />
          </Box>

          <LinearProgress
            variant="determinate"
            value={progress}
            color={statusColor}
            sx={{ height: 8, borderRadius: 4 }}
          />

          <Typography variant="body2" color="text.secondary" align="center">
            {status.processedRows ?? 0} / {status.totalRows ?? '?'} rows processed
          </Typography>

          {status.error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {status.error}
            </Alert>
          )}

          {(status.status === 'completed' || status.status === 'failed') && (
            <Box display="flex" justifyContent="flex-end" gap={2}>
              {status.status === 'failed' && (
                <Button variant="outlined" onClick={handleRetry}>
                  Retry
                </Button>
              )}
              <Button variant="contained" onClick={handleBack}>
                Return to Home
              </Button>
            </Box>
          )}
        </Stack>
      </Paper>
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Import Progress
      </Typography>

      {error && !status?.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {renderStatus()}
    </Box>
  );
};

export default ImportProgressPage;
