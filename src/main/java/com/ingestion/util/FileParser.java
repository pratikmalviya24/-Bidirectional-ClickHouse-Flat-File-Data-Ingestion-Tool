package com.ingestion.util;

import com.ingestion.dto.FileConfig;
import com.ingestion.dto.TableSchema;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class FileParser {

    private final ObjectMapper objectMapper;

    public FileParser() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    public TableSchema parseSchema(MultipartFile file, FileConfig config) throws IOException {
        String fileType = getFileType(file.getOriginalFilename());
        
        switch (fileType.toLowerCase()) {
            case "csv":
                return parseCsvSchema(file, config);
            case "json":
                return parseJsonSchema(file);
            default:
                throw new IllegalArgumentException("Unsupported file type: " + fileType);
        }
    }

    public List<Map<String, Object>> readData(Path filePath, FileConfig config, int page, int size) throws IOException {
        String fileType = getFileType(filePath.getFileName().toString());
        
        switch (fileType.toLowerCase()) {
            case "csv":
                return readCsvData(filePath, config, page, size);
            case "json":
                return readJsonData(filePath, page, size);
            default:
                throw new IllegalArgumentException("Unsupported file type: " + fileType);
        }
    }

    private TableSchema parseCsvSchema(MultipartFile file, FileConfig config) throws IOException {
        try (Reader reader = new InputStreamReader(file.getInputStream());
             CSVParser parser = CSVFormat.DEFAULT
                     .withDelimiter(config.getDelimiter().charAt(0))
                     .withFirstRecordAsHeader()
                     .parse(reader)) {

            List<TableSchema.Column> columns = new ArrayList<>();
            List<Map<String, Object>> preview = new ArrayList<>();
            
            // Read first data row to infer types
            if (parser.iterator().hasNext()) {
                CSVRecord firstRow = parser.iterator().next();
                for (String header : parser.getHeaderNames()) {
                    String value = firstRow.get(header);
                    columns.add(new TableSchema.Column(header, inferType(value), true, header, inferType(value)));
                }
                
                // Add first row to preview
                Map<String, Object> previewRow = new HashMap<>();
                for (String header : parser.getHeaderNames()) {
                    previewRow.put(header, firstRow.get(header));
                }
                preview.add(previewRow);
            }

            return new TableSchema(columns, preview);
        }
    }

    private TableSchema parseJsonSchema(MultipartFile file) throws IOException {
        try (Reader reader = new InputStreamReader(file.getInputStream())) {
            Map<String, Object> firstObject = objectMapper.readValue(reader, Map.class);
            List<TableSchema.Column> columns = new ArrayList<>();
            List<Map<String, Object>> preview = new ArrayList<>();
            
            for (Map.Entry<String, Object> entry : firstObject.entrySet()) {
                String type = inferType(entry.getValue());
                columns.add(new TableSchema.Column(entry.getKey(), type, true, entry.getKey(), type));
            }
            
            preview.add(firstObject);
            
            return new TableSchema(columns, preview);
        }
    }

    private List<Map<String, Object>> readCsvData(Path filePath, FileConfig config, int page, int size) throws IOException {
        try (Reader reader = Files.newBufferedReader(filePath);
             CSVParser parser = CSVFormat.DEFAULT
                     .withDelimiter(config.getDelimiter().charAt(0))
                     .withFirstRecordAsHeader()
                     .parse(reader)) {

            List<Map<String, Object>> result = new ArrayList<>();
            int start = page * size;
            int end = start + size;
            int current = 0;

            for (CSVRecord record : parser) {
                if (current >= start && current < end) {
                    Map<String, Object> row = new HashMap<>();
                    for (String header : parser.getHeaderNames()) {
                        row.put(header, record.get(header));
                    }
                    result.add(row);
                }
                current++;
                if (current >= end) break;
            }

            return result;
        }
    }

    private List<Map<String, Object>> readJsonData(Path filePath, int page, int size) throws IOException {
        try (Reader reader = Files.newBufferedReader(filePath)) {
            List<Map<String, Object>> allData = objectMapper.readValue(reader, 
                    objectMapper.getTypeFactory().constructCollectionType(List.class, Map.class));
            
            int start = page * size;
            int end = Math.min(start + size, allData.size());
            
            return allData.subList(start, end);
        }
    }

    private String getFileType(String filename) {
        int lastDot = filename.lastIndexOf('.');
        if (lastDot == -1) {
            throw new IllegalArgumentException("File has no extension: " + filename);
        }
        return filename.substring(lastDot + 1);
    }

    private String inferType(Object value) {
        if (value == null) return "string";
        
        if (value instanceof Number) {
            if (value instanceof Integer || value instanceof Long) {
                return "integer";
            } else if (value instanceof Float || value instanceof Double) {
                return "float";
            }
        } else if (value instanceof Boolean) {
            return "boolean";
        }
        return "string";
    }
} 