import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Column, TableSchema } from '../types/columns';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Common error handler
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Source configuration endpoints
export const sourceApi = {
  testClickHouseConnection: (config: ClickHouseConfig) =>
    api.post<{ success: boolean }>('/source/clickhouse/test', config),
  
  getClickHouseTables: (config: ClickHouseConfig) =>
    api.post<TableSchema>('/source/clickhouse/tables', config),

  getClickHousePreview: (config: ClickHouseConfig, tableName: string) =>
    api.post<TableSchema>(`/source/clickhouse/preview/${tableName}`, config),
  
  uploadFile: (file: File, config: FileConfig) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('config', JSON.stringify(config));
    return api.post<TableSchema>('/source/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getFilePreview: (fileId: string, config: FileConfig) =>
    api.get<TableSchema>(`/source/file/preview/${fileId}`),

  startImport: (
    sourceType: 'clickhouse' | 'file',
    config: ClickHouseConfig | FileConfig,
    columns: Column[],
    file?: File
  ) => {
    const formData = new FormData();
    formData.append('sourceType', sourceType);
    formData.append('config', JSON.stringify(config));
    formData.append('columns', JSON.stringify(columns));
    if (file) {
      formData.append('file', file);
    }
    return api.post<{ jobId: string }>('/import/start', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getImportStatus: (jobId: string) =>
    api.get<ImportStatus>(`/import/status/${jobId}`),
};

// Types
export interface ClickHouseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export interface FileConfig {
  delimiter?: string;
  hasHeader: boolean;
  skipRows: number;
  fileType: 'CSV' | 'JSON';
}

export interface ImportStatus {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalRows?: number;
  processedRows?: number;
  error?: string;
}

export default api;
