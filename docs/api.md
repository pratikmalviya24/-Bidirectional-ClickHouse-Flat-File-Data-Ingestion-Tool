# API Documentation

## Authentication

### Login
```http
POST /api/auth/login
```

Request body:
```json
{
  "username": "string",
  "password": "string"
}
```

Response:
```json
{
  "token": "string",
  "expiresIn": "number"
}
```

## ClickHouse Operations

### Test Connection
```http
POST /api/clickhouse/test-connection
```

Request body:
```json
{
  "host": "string",
  "port": "number",
  "database": "string",
  "username": "string",
  "password": "string"
}
```

Response:
```json
{
  "success": "boolean",
  "message": "string"
}
```

### Get Tables
```http
GET /api/clickhouse/tables
```

Query parameters:
- `database`: string (required)

Response:
```json
{
  "tables": [
    {
      "name": "string",
      "columns": [
        {
          "name": "string",
          "type": "string"
        }
      ]
    }
  ]
}
```

### Get Table Data
```http
GET /api/clickhouse/table-data
```

Query parameters:
- `database`: string (required)
- `table`: string (required)
- `limit`: number (optional, default: 100)

Response:
```json
{
  "data": [
    {
      "column1": "value1",
      "column2": "value2"
    }
  ]
}
```

## File Operations

### Upload File
```http
POST /api/files/upload
```

Request body:
- `file`: File (multipart/form-data)
- `type`: string (enum: "csv", "json")

Response:
```json
{
  "id": "string",
  "name": "string",
  "type": "string",
  "columns": [
    {
      "name": "string",
      "type": "string"
    }
  ]
}
```

### Get File Data
```http
GET /api/files/{fileId}/data
```

Query parameters:
- `limit`: number (optional, default: 100)

Response:
```json
{
  "data": [
    {
      "column1": "value1",
      "column2": "value2"
    }
  ]
}
```

## Data Transfer Operations

### Start Transfer
```http
POST /api/transfer/start
```

Request body:
```json
{
  "source": {
    "type": "string", // "clickhouse" or "file"
    "config": {
      // ClickHouse config
      "host": "string",
      "port": "number",
      "database": "string",
      "table": "string",
      // or File config
      "fileId": "string"
    }
  },
  "target": {
    "type": "string", // "clickhouse" or "file"
    "config": {
      // ClickHouse config
      "host": "string",
      "port": "number",
      "database": "string",
      "table": "string",
      // or File config
      "format": "string" // "csv" or "json"
    }
  },
  "columns": ["string"]
}
```

Response:
```json
{
  "transferId": "string",
  "status": "string"
}
```

### Get Transfer Status
```http
GET /api/transfer/{transferId}/status
```

Response:
```json
{
  "status": "string",
  "progress": "number",
  "message": "string"
}
```

## Error Responses

All API endpoints may return the following error responses:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "string"
  }
}
```

Common error codes:
- `AUTH_REQUIRED`: Authentication is required
- `INVALID_CREDENTIALS`: Invalid username or password
- `INVALID_CONFIG`: Invalid configuration
- `CONNECTION_FAILED`: Connection to ClickHouse failed
- `FILE_ERROR`: File operation failed
- `TRANSFER_ERROR`: Data transfer failed 