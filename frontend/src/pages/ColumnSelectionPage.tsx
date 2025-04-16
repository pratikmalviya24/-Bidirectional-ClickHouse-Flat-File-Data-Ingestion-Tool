import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ColumnSelectionTable from '../components/columns/ColumnSelectionTable';
import ColumnPreview from '../components/columns/ColumnPreview';
import { sourceApi, ClickHouseConfig, FileConfig } from '../services/api';
import { Column, SourceConfig, TableSchema } from '../types/columns';

const ColumnSelectionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [columns, setColumns] = useState<Column[]>([]);
  const [previewData, setPreviewData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const state = location.state as SourceConfig;

  useEffect(() => {
    if (!state?.sourceType || !state?.config) {
      navigate('/source-selection');
      return;
    }

    const fetchSchema = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let schema: TableSchema | null = null;
        
        if (state.sourceType === 'clickhouse') {
          const response = await sourceApi.getClickHouseTables(state.config as ClickHouseConfig);
          schema = response.data;
        } else if (state.sourceType === 'file' && state.file) {
          const response = await sourceApi.uploadFile(
            state.file,
            state.config as FileConfig
          );
          schema = response.data;
        }

        if (schema) {
          setColumns(schema.columns);
          setPreviewData(schema.preview || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch schema');
      } finally {
        setLoading(false);
      }
    };

    fetchSchema();
  }, [state, navigate]);

  const handleBack = () => {
    navigate('/configure', { state: { sourceType: state.sourceType } });
  };

  const handleColumnChange = (updatedColumns: Column[]) => {
    setColumns(updatedColumns);
  };

  const handleContinue = async () => {
    const selectedColumns = columns.filter(col => col.selected);
    if (selectedColumns.length === 0) {
      setError('Please select at least one column to proceed');
      return;
    }

    try {
      setImporting(true);
      setError(null);

      const response = await sourceApi.startImport(
        state.sourceType,
        state.config,
        selectedColumns,
        state.file
      );

      navigate('/progress', {
        state: {
          ...state,
          jobId: response.data.jobId,
          columns: selectedColumns,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start import');
      setImporting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Stack spacing={3}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handleBack}>
            <Typography variant="h6">←</Typography>
          </IconButton>
          <Typography variant="h4">Select Columns</Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Source: {state?.sourceType === 'clickhouse' ? 'ClickHouse Database' : 'File Upload'}
          </Typography>
          {state?.sourceType === 'file' && state?.file && (
            <Typography variant="body2" color="text.secondary">
              File: {state.file.name}
            </Typography>
          )}
        </Paper>

        <ColumnSelectionTable
          columns={columns}
          onColumnChange={handleColumnChange}
        />

        <Divider />

        <ColumnPreview
          columns={columns}
          previewData={previewData}
          selectedOnly={true}
        />

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={handleBack} disabled={importing}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleContinue}
            disabled={columns.filter(col => col.selected).length === 0 || importing}
          >
            {importing ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Starting Import...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default ColumnSelectionPage;
