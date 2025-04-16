# Configuration Options

## Application Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | `dev` | No |
| `SERVER_PORT` | Server port | `8080` | No |
| `JWT_SECRET` | JWT secret key | - | Yes |
| `JWT_EXPIRATION` | JWT expiration time in milliseconds | `86400000` | No |

### ClickHouse Configuration

| Property | Description | Default | Required |
|----------|-------------|---------|----------|
| `clickhouse.host` | ClickHouse server host | `localhost` | Yes |
| `clickhouse.port` | ClickHouse server port | `9000` | Yes |
| `clickhouse.database` | Default database | - | Yes |
| `clickhouse.username` | Username | - | Yes |
| `clickhouse.password` | Password | - | Yes |
| `clickhouse.connection-timeout` | Connection timeout in milliseconds | `30000` | No |
| `clickhouse.socket-timeout` | Socket timeout in milliseconds | `30000` | No |

### File Storage Configuration

| Property | Description | Default | Required |
|----------|-------------|---------|----------|
| `file.storage.directory` | Directory for storing uploaded files | `./uploads` | Yes |
| `file.storage.max-size` | Maximum file size in bytes | `10485760` | No |
| `file.storage.allowed-types` | Allowed file types | `csv,json` | No |

### Security Configuration

| Property | Description | Default | Required |
|----------|-------------|---------|----------|
| `security.cors.allowed-origins` | Allowed CORS origins | `*` | No |
| `security.cors.allowed-methods` | Allowed CORS methods | `GET,POST,PUT,DELETE` | No |
| `security.cors.allowed-headers` | Allowed CORS headers | `*` | No |
| `security.cors.max-age` | CORS max age in seconds | `3600` | No |

## Frontend Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:8080` | No |
| `REACT_APP_WS_URL` | WebSocket URL | `ws://localhost:8080` | No |
| `REACT_APP_MAX_FILE_SIZE` | Maximum file size in bytes | `10485760` | No |

### UI Configuration

| Property | Description | Default |
|----------|-------------|---------|
| `theme.primaryColor` | Primary color | `#1976d2` |
| `theme.secondaryColor` | Secondary color | `#dc004e` |
| `theme.fontFamily` | Font family | `Roboto, sans-serif` |
| `ui.maxPreviewRows` | Maximum rows in preview | `100` |
| `ui.autoRefreshInterval` | Auto-refresh interval in milliseconds | `5000` |

## Example Configuration Files

### application.yml
```yaml
spring:
  profiles:
    active: dev

server:
  port: 8080

jwt:
  secret: your-secret-key
  expiration: 86400000

clickhouse:
  host: localhost
  port: 9000
  database: default
  username: default
  password: password
  connection-timeout: 30000
  socket-timeout: 30000

file:
  storage:
    directory: ./uploads
    max-size: 10485760
    allowed-types: csv,json

security:
  cors:
    allowed-origins: "*"
    allowed-methods: GET,POST,PUT,DELETE
    allowed-headers: "*"
    max-age: 3600
```

### .env
```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_WS_URL=ws://localhost:8080
REACT_APP_MAX_FILE_SIZE=10485760
``` 