import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TextField,
  Typography,
  Box,
} from '@mui/material';

export interface Column {
  name: string;
  type: string;
  selected: boolean;
  targetName?: string;
  targetType?: string;
}

interface ColumnSelectionTableProps {
  columns: Column[];
  onColumnChange: (columns: Column[]) => void;
}

const ColumnSelectionTable: React.FC<ColumnSelectionTableProps> = ({
  columns,
  onColumnChange,
}) => {
  const handleSelectColumn = (index: number, checked: boolean) => {
    const updatedColumns = columns.map((col, i) =>
      i === index ? { ...col, selected: checked } : col
    );
    onColumnChange(updatedColumns);
  };

  const handleTargetNameChange = (index: number, value: string) => {
    const updatedColumns = columns.map((col, i) =>
      i === index ? { ...col, targetName: value } : col
    );
    onColumnChange(updatedColumns);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={
                  columns.some((col) => col.selected) &&
                  !columns.every((col) => col.selected)
                }
                checked={columns.every((col) => col.selected)}
                onChange={(e) => {
                  const newColumns = columns.map((col) => ({
                    ...col,
                    selected: e.target.checked,
                  }));
                  onColumnChange(newColumns);
                }}
              />
            </TableCell>
            <TableCell>Source Column</TableCell>
            <TableCell>Data Type</TableCell>
            <TableCell>Target Column Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {columns.map((column, index) => (
            <TableRow key={`row-${index}`}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={column.selected}
                  onChange={(e) => handleSelectColumn(index, e.target.checked)}
                />
              </TableCell>
              <TableCell>{column.name}</TableCell>
              <TableCell>{column.type}</TableCell>
              <TableCell>
                <TextField
                  size="small"
                  value={column.targetName || column.name}
                  onChange={(e) => handleTargetNameChange(index, e.target.value)}
                  disabled={!column.selected}
                  fullWidth
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {columns.length === 0 && (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No columns available. Please configure the data source first.
          </Typography>
        </Box>
      )}
    </TableContainer>
  );
};

export default ColumnSelectionTable;
