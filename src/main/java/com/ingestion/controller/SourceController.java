package com.ingestion.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.ingestion.dto.ClickHouseConfig;
import com.ingestion.dto.FileConfig;
import com.ingestion.dto.TableSchema;
import com.ingestion.service.SourceService;

import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/source")
@RequiredArgsConstructor
public class SourceController {

    private final SourceService sourceService;

    @PostMapping("/clickhouse/test")
    public ResponseEntity<Boolean> testClickHouseConnection(
            @RequestBody ClickHouseConfig config) {
        return ResponseEntity.ok(sourceService.testClickHouseConnection(config, null));
    }

    @PostMapping("/clickhouse/tables")
    public ResponseEntity<TableSchema> getClickHouseTables(
            @RequestBody ClickHouseConfig config,
            HttpServletRequest request) {
        String jwt = extractJwtFromRequest(request);
        return ResponseEntity.ok(sourceService.getClickHouseTables(config, jwt));
    }

    @PostMapping("/file/upload")
    public ResponseEntity<TableSchema> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("config") String configJson) {
        return ResponseEntity.ok(sourceService.processFile(file, configJson));
    }

    @GetMapping("/file/preview/{fileId}")
    public ResponseEntity<TableSchema> getFilePreview(
            @PathVariable String fileId) {
        return ResponseEntity.ok(sourceService.getFilePreview(fileId));
    }

    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
