package com.ingestion.service;

import org.springframework.web.multipart.MultipartFile;
import com.ingestion.dto.ClickHouseConfig;
import com.ingestion.dto.FileConfig;
import com.ingestion.dto.TableSchema;

public interface SourceService {
    /**
     * Test connection to a ClickHouse database
     */
    boolean testClickHouseConnection(ClickHouseConfig config, String jwt);

    /**
     * Get tables and their schema from a ClickHouse database
     */
    TableSchema getClickHouseTables(ClickHouseConfig config, String jwt);

    /**
     * Process an uploaded file and return its schema
     */
    TableSchema processFile(MultipartFile file, String configJson);

    /**
     * Get preview data for a previously uploaded file
     */
    TableSchema getFilePreview(String fileId);
}
