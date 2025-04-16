# Usage Examples

## ClickHouse to Flat File Transfer

### 1. Select Source
1. Open the application
2. Click on "ClickHouse" as the source
3. Enter ClickHouse connection details:
   - Host: `localhost`
   - Port: `9000`
   - Database: `your_database`
   - Username: `your_username`
   - Password: `your_password`
4. Click "Connect"

### 2. Select Data
1. Choose the table from the dropdown
2. Select the columns you want to transfer
3. Click "Preview" to see sample data
4. Click "Next" to proceed

### 3. Configure Target
1. Select "Flat File" as the target
2. Choose the output format (CSV or JSON)
3. Specify the output file name
4. Click "Next"

### 4. Start Transfer
1. Review the transfer configuration
2. Click "Start Transfer"
3. Monitor the progress
4. Download the file when complete

## Flat File to ClickHouse Transfer

### 1. Select Source
1. Open the application
2. Click on "Flat File" as the source
3. Upload your CSV or JSON file
4. Wait for file validation

### 2. Select Data
1. Review the detected columns
2. Select the columns you want to transfer
3. Click "Preview" to see sample data
4. Click "Next" to proceed

### 3. Configure Target
1. Select "ClickHouse" as the target
2. Enter ClickHouse connection details:
   - Host: `localhost`
   - Port: `9000`
   - Database: `your_database`
   - Username: `your_username`
   - Password: `your_password`
3. Choose the target table
4. Click "Next"

### 4. Start Transfer
1. Review the transfer configuration
2. Click "Start Transfer"
3. Monitor the progress
4. View the results when complete

## Command Line Examples

### Using cURL for API Calls

1. Login and get JWT token:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

2. Test ClickHouse connection:
```bash
curl -X POST http://localhost:8080/api/clickhouse/test-connection \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "host": "localhost",
    "port": 9000,
    "database": "test_db",
    "username": "user",
    "password": "pass"
  }'
```

3. Start data transfer:
```bash
curl -X POST http://localhost:8080/api/transfer/start \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "source": {
      "type": "clickhouse",
      "config": {
        "host": "localhost",
        "port": 9000,
        "database": "source_db",
        "table": "source_table"
      }
    },
    "target": {
      "type": "file",
      "config": {
        "format": "csv"
      }
    },
    "columns": ["id", "name", "email"]
  }'
```

## Error Handling Examples

### 1. Invalid Credentials
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid username or password",
    "details": "Please check your credentials and try again"
  }
}
```

### 2. Connection Error
```json
{
  "error": {
    "code": "CONNECTION_FAILED",
    "message": "Failed to connect to ClickHouse",
    "details": "Connection refused: localhost:9000"
  }
}
```

### 3. File Error
```json
{
  "error": {
    "code": "FILE_ERROR",
    "message": "Invalid file format",
    "details": "Only CSV and JSON files are supported"
  }
}
```

## Best Practices

1. **Data Transfer**
   - Always preview data before starting the transfer
   - Use appropriate batch sizes for large datasets
   - Monitor memory usage during transfers

2. **Security**
   - Use strong passwords for ClickHouse
   - Keep JWT tokens secure
   - Regularly rotate credentials

3. **Performance**
   - Optimize ClickHouse queries
   - Use appropriate indexes
   - Monitor transfer progress

4. **Error Handling**
   - Check error messages carefully
   - Retry failed operations
   - Keep logs for debugging 