package com.ingestion.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TableSchema {
    private List<Column> columns;
    private List<Map<String, Object>> preview;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Column {
        private String name;
        private String type;
        private boolean selected;
        private String targetName;
        private String targetType;
    }
}
