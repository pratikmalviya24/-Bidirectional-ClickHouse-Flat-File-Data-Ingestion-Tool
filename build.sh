#!/bin/bash

# Clean and build the project
echo "Building backend..."
./mvnw clean install -DskipTests

# Start the Spring Boot application
echo "Starting backend server..."
./mvnw spring-boot:run &

# Wait for backend to start
sleep 5

# Change to frontend directory and install dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install

# Start the frontend development server
echo "Starting frontend server..."
npm start
