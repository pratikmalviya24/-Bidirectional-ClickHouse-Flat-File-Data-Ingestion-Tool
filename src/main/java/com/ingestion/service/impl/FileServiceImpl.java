package com.ingestion.service.impl;

import com.ingestion.dto.FileConfig;
import com.ingestion.dto.TableSchema;
import com.ingestion.service.FileService;
import com.ingestion.util.FileParser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService {

    @Value("${file.upload.dir}")
    private String uploadDir;

    private final FileParser fileParser;

    public FileServiceImpl(FileParser fileParser) {
        this.fileParser = fileParser;
    }

    @Override
    public String uploadFile(MultipartFile file, FileConfig config) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = UUID.randomUUID().toString() + extension;
        Path filePath = uploadPath.resolve(uniqueFilename);

        // Save the file
        Files.copy(file.getInputStream(), filePath);

        return filePath.toString();
    }

    @Override
    public byte[] downloadFile(String filePath) throws IOException {
        Path path = Paths.get(filePath);
        if (!Files.exists(path)) {
            throw new IOException("File not found: " + filePath);
        }
        return Files.readAllBytes(path);
    }

    @Override
    public TableSchema parseFileSchema(MultipartFile file, FileConfig config) throws IOException {
        return fileParser.parseSchema(file, config);
    }

    @Override
    public List<Map<String, Object>> readFileData(String filePath, FileConfig config, int page, int size) throws IOException {
        Path path = Paths.get(filePath);
        if (!Files.exists(path)) {
            throw new IOException("File not found: " + filePath);
        }
        return fileParser.readData(path, config, page, size);
    }
} 