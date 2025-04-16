import React, { useState, useRef } from 'react';
import {
  TextField,
  Button,
  Box,
  Stack,
  Alert,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from '@mui/material';
import { FileConfig } from '../../services/api';

interface FileConfigFormProps {
  onConfigured: (config: FileConfig, file: File) => void;
}

const FileConfigForm: React.FC<FileConfigFormProps> = ({ onConfigured }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [config, setConfig] = useState<FileConfig>({
    delimiter: ',',
    hasHeader: true,
    skipRows: 0,
    fileType: 'CSV',
  });
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileType = file.name.toLowerCase().endsWith('.csv') ? 'CSV' : 'JSON';
    
    setSelectedFile(file);
    setConfig(prev => ({ ...prev, fileType }));
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'hasHeader') {
      setConfig(prev => ({ ...prev, [name]: e.target.checked }));
    } else if (name === 'skipRows') {
      const numValue = parseInt(value, 10);
      setConfig(prev => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
    } else {
      setConfig(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<'CSV' | 'JSON'>) => {
    setConfig(prev => ({ ...prev, fileType: e.target.value as 'CSV' | 'JSON' }));
  };

  const validateConfig = (): boolean => {
    if (!selectedFile) {
      setError('Please select a file');
      return false;
    }
    if (config.fileType === 'CSV' && !config.delimiter) {
      setError('Please specify a delimiter for CSV files');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateConfig()) return;
    if (!selectedFile) return;

    onConfigured(config, selectedFile);
  };

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}

        <input
          type="file"
          accept=".csv,.json"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileSelect}
          data-testid="file-input"
        />

        <Button
          variant="outlined"
          onClick={() => fileInputRef.current?.click()}
        >
          {selectedFile ? selectedFile.name : '📁 Select File'}
        </Button>

        <FormControl fullWidth>
          <InputLabel>File Type</InputLabel>
          <Select
            name="fileType"
            value={config.fileType}
            onChange={handleSelectChange}
            label="File Type"
          >
            <MenuItem value="CSV">CSV</MenuItem>
            <MenuItem value="JSON">JSON</MenuItem>
          </Select>
        </FormControl>

        {config.fileType === 'CSV' && (
          <>
            <TextField
              label="Delimiter"
              name="delimiter"
              value={config.delimiter}
              onChange={handleInputChange}
              fullWidth
            />

            <FormControlLabel
              control={
                <Switch
                  checked={config.hasHeader}
                  onChange={handleInputChange}
                  name="hasHeader"
                />
              }
              label="File has header row"
            />
          </>
        )}

        <TextField
          label="Skip Rows"
          name="skipRows"
          type="number"
          value={config.skipRows}
          onChange={handleInputChange}
          fullWidth
          InputProps={{ inputProps: { min: 0 } }}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!selectedFile}
        >
          Configure Import
        </Button>
      </Stack>
    </Box>
  );
};

export default FileConfigForm;
