package com.ingestion.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ingestion.util.ClickHouseUtil;
import com.ingestion.dto.ClickHouseConfig;
import com.ingestion.dto.FileConfig;
import com.ingestion.dto.TableSchema;
import com.ingestion.dto.TableSchema.Column;
import com.ingestion.service.SourceService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class SourceServiceImpl implements SourceService {

    private static final Logger log = LoggerFactory.getLogger(SourceServiceImpl.class);
    
    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public boolean testClickHouseConnection(ClickHouseConfig config, String jwt) {
        log.info("Testing ClickHouse connection to: {}", config.getHost());
        return ClickHouseUtil.testConnection(config, jwt);
    }

    @Override
    public TableSchema getClickHouseTables(ClickHouseConfig config, String jwt) {
        log.info("Fetching tables from ClickHouse database: {}", config.getDatabase());
        List<String> tables = ClickHouseUtil.getTables(config, jwt);
        
        if (!tables.isEmpty()) {
            // Get schema for the first table as an example
            return ClickHouseUtil.getTableSchema(config, tables.get(0), jwt);
        }
        
        List<Column> columns = new ArrayList<>();
        List<Map<String, Object>> preview = Collections.emptyList();
        TableSchema schema = new TableSchema();
        schema.setColumns(columns);
        schema.setPreview(preview);
        return schema;
    }

    @Override
    public TableSchema processFile(MultipartFile file, String configJson) {
        try {
            FileConfig config = objectMapper.readValue(configJson, FileConfig.class);
            log.info("Processing file: {} with config: {}", file.getOriginalFilename(), config);
            
            // TODO: Implement actual file processing
            List<Column> columns = new ArrayList<>();
            List<Map<String, Object>> preview = Collections.emptyList();
            TableSchema schema = new TableSchema();
            schema.setColumns(columns);
            schema.setPreview(preview);
            return schema;
            
        } catch (Exception e) {
            log.error("Error processing file: {}", file.getOriginalFilename(), e);
            throw new RuntimeException("Failed to process file", e);
        }
    }

    @Override
    public TableSchema getFilePreview(String fileId) {
        log.info("Fetching preview for file: {}", fileId);
        
        // TODO: Implement file preview retrieval
        List<Column> columns = new ArrayList<>();
        List<Map<String, Object>> preview = Collections.emptyList();
        TableSchema schema = new TableSchema();
        schema.setColumns(columns);
        schema.setPreview(preview);
        return schema;
    }
}
