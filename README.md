# Bidirectional ClickHouse & Flat File Data Ingestion Tool

A web-based application that facilitates data ingestion between ClickHouse database and Flat File platform, supporting bidirectional data flow with a user-friendly interface.

## Features

- Bidirectional data transfer between ClickHouse and Flat Files
- JWT token-based authentication for ClickHouse
- Column selection for targeted data ingestion
- Progress tracking and completion reporting
- Data preview functionality
- Error handling and validation

## Tech Stack

- **Backend**: Spring Boot 2.7
- **Frontend**: React with Material-UI
- **Database**: ClickHouse
- **Build Tool**: Maven
- **Container**: Docker

## Prerequisites

- Java 11 or higher
- Node.js 14 or higher
- Docker and Docker Compose
- Maven 3.6 or higher

## Project Structure

```
project/
├── backend/               # Spring Boot backend
├── frontend/             # React frontend
├── clickhouse/           # ClickHouse configuration
│   ├── config/          # Server configuration
│   └── users/           # User settings
└── docker-compose.yml   # Docker services config
```

## Quick Start

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd data-ingestion-tool
   ```

2. Start ClickHouse:
   ```bash
   docker-compose up -d
   ```

3. Run the backend:
   ```bash
   ./mvnw spring-boot:run
   ```

4. Run the frontend (in a new terminal):
   ```bash
   cd frontend
   npm install
   npm start
   ```

5. Access the application at http://localhost:3000

## Development Setup

### Backend Configuration

1. Configure application.yml with your settings
2. Update ClickHouse configuration in clickhouse/config/
3. Set up JWT secret in application.yml

### Frontend Configuration

1. Update API endpoint in frontend/.env
2. Configure proxy settings if needed

## API Documentation

### Authentication
- POST `/api/auth/login` - Authenticate user
- POST `/api/auth/validate` - Validate JWT token

### Data Ingestion
- POST `/api/ingestion/start` - Start ingestion process
- GET `/api/ingestion/{id}/status` - Get ingestion status
- GET `/api/ingestion/{id}/progress` - Get progress details

### Schema Management
- GET `/api/schema/{source}/{table}` - Get columns for source
- POST `/api/preview` - Get data preview

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
