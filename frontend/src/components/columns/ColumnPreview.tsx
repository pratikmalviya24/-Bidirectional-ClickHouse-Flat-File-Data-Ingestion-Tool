import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Column } from '../../types/columns';

interface ColumnPreviewProps {
  columns: Column[];
  previewData?: Record<string, any>[];
  selectedOnly?: boolean;
}

const ColumnPreview: React.FC<ColumnPreviewProps> = ({
  columns,
  previewData = [],
  selectedOnly = true,
}) => {
  const displayColumns = selectedOnly 
    ? columns.filter(col => col.selected)
    : columns;

  if (displayColumns.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          {selectedOnly 
            ? 'Please select columns to preview data'
            : 'No columns available for preview'}
        </Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ mt: 2 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Data Preview
        </Typography>
      </Box>
      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {displayColumns.map((column) => (
                <TableCell key={column.name}>
                  <Typography variant="subtitle2">
                    {column.targetName || column.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {column.type}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {previewData.length > 0 ? (
              previewData.map((row, index) => (
                <TableRow key={index}>
                  {displayColumns.map((column) => (
                    <TableCell key={`${index}-${column.name}`}>
                      {row[column.name]?.toString() || ''}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={displayColumns.length} align="center">
                  <Typography color="text.secondary">
                    No preview data available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ColumnPreview;
