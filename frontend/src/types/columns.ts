export interface Column {
  name: string;
  type: string;
  selected: boolean;
  targetName?: string;
  targetType?: string;
}

export interface ColumnMapping {
  sourceColumn: string;
  targetColumn: string;
  dataType: string;
}

export interface TableSchema {
  columns: Column[];
  preview?: Record<string, any>[];
}

export interface SourceConfig {
  sourceType: 'clickhouse' | 'file';
  config: any;
  file?: File;
  schema?: TableSchema;
}
