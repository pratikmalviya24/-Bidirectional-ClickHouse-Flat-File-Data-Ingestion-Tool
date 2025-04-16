# Data Ingestion Tool

A full-stack application for data ingestion into ClickHouse database, featuring a React frontend and Spring Boot backend.

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
- npm 6 or higher
- Docker and Docker Compose
- Maven 3.6 or higher

## Project Structure

```
.
├── frontend/           # React frontend application
├── src/               # Spring Boot backend source code
├── clickhouse/        # ClickHouse related configurations
├── docs/             # Documentation files
└── docker-compose.yml # Docker Compose configuration
```

## Setup Instructions

### 1. Backend Setup

1. Navigate to the project root directory
2. Install dependencies:
   ```bash
   mvn clean install
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### 3. Database Setup

1. Start the ClickHouse database using Docker Compose:
   ```bash
   docker-compose up -d
   ```
2. Initialize the database schema:
   ```bash
   # Run the SQL script to set up the database
   cat setup_nyc_taxi.sql | docker exec -i clickhouse clickhouse-client
   ```

## Configuration

### Backend Configuration

The backend uses Spring Boot with the following key configurations:
- Port: 8080 (default)
- ClickHouse connection settings (configured in application.properties)
- JWT authentication (configured in SecurityConfig)

### Frontend Configuration

The frontend React application uses:
- Material-UI for components
- React Router for navigation
- Axios for API calls
- TypeScript for type safety

## Running the Application

### Development Mode

1. Start the backend:
   ```bash
   mvn spring-boot:run
   ```

2. Start the frontend (in a separate terminal):
   ```bash
   cd frontend
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

### Production Mode

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Build and run the backend:
   ```bash
   mvn clean package
   java -jar target/data-ingestion-tool-0.0.1-SNAPSHOT.jar
   ```

## Testing

### Backend Tests
```bash
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Environment Variables

The following environment variables can be configured:

### Backend
- `SPRING_DATASOURCE_URL`: ClickHouse connection URL
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password
- `JWT_SECRET`: JWT secret key for authentication

### Frontend
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:8080)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
