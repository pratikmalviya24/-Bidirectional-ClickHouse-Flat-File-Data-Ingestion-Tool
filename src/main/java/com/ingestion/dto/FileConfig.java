package com.ingestion.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileConfig {
    private String delimiter;
    private boolean hasHeader;
    private int skipRows;
    private FileType fileType;

    public enum FileType {
        CSV,
        JSON
    }
}
