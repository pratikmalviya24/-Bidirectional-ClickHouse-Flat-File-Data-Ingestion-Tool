package com.ingestion.controller;

import com.ingestion.dto.FileConfig;
import com.ingestion.dto.TableSchema;
import com.ingestion.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileService fileService;

    @Autowired
    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "delimiter", defaultValue = ",") String delimiter) throws IOException {
        FileConfig config = new FileConfig();
        config.setDelimiter(delimiter);
        String filePath = fileService.uploadFile(file, config);
        return ResponseEntity.ok(filePath);
    }

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadFile(@RequestParam("path") String filePath) throws IOException {
        byte[] fileContent = fileService.downloadFile(filePath);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", filePath.substring(filePath.lastIndexOf("/") + 1));
        
        return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
    }

    @PostMapping("/schema")
    public ResponseEntity<TableSchema> getFileSchema(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "delimiter", defaultValue = ",") String delimiter) throws IOException {
        FileConfig config = new FileConfig();
        config.setDelimiter(delimiter);
        TableSchema schema = fileService.parseFileSchema(file, config);
        return ResponseEntity.ok(schema);
    }

    @GetMapping("/preview")
    public ResponseEntity<List<Map<String, Object>>> previewFileData(
            @RequestParam("path") String filePath,
            @RequestParam(value = "delimiter", defaultValue = ",") String delimiter,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) throws IOException {
        FileConfig config = new FileConfig();
        config.setDelimiter(delimiter);
        List<Map<String, Object>> data = fileService.readFileData(filePath, config, page, size);
        return ResponseEntity.ok(data);
    }
} 