package com.ingestion.service;

import com.ingestion.dto.FileConfig;
import com.ingestion.dto.TableSchema;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface FileService {
    /**
     * Upload a file and store it in the configured location
     * @param file The file to upload
     * @param config Configuration for file handling
     * @return The path where the file was stored
     */
    String uploadFile(MultipartFile file, FileConfig config) throws IOException;

    /**
     * Download a file from the storage location
     * @param filePath The path of the file to download
     * @return The file as a byte array
     */
    byte[] downloadFile(String filePath) throws IOException;

    /**
     * Parse the schema of an uploaded file
     * @param file The file to parse
     * @param config Configuration for parsing
     * @return The parsed table schema
     */
    TableSchema parseFileSchema(MultipartFile file, FileConfig config) throws IOException;

    /**
     * Read data from a file with pagination
     * @param filePath The path of the file to read
     * @param config Configuration for reading
     * @param page The page number (0-based)
     * @param size The page size
     * @return List of rows as maps
     */
    List<Map<String, Object>> readFileData(String filePath, FileConfig config, int page, int size) throws IOException;
} 