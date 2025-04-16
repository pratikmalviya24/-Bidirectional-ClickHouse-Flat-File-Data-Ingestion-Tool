package com.ingestion.service.impl;

import com.ingestion.dto.ClickHouseConfig;
import com.ingestion.dto.FileConfig;
import com.ingestion.dto.TableSchema;
import com.ingestion.util.ClickHouseUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SourceServiceImplTest {

    @Mock
    private ClickHouseUtil clickHouseUtil;

    @InjectMocks
    private SourceServiceImpl sourceService;

    private ClickHouseConfig config;
    private String jwt = "test-jwt-token";

    @BeforeEach
    void setUp() {
        config = new ClickHouseConfig();
        config.setHost("localhost");
        config.setPort(8123);
        config.setDatabase("test_db");
        config.setUsername("test_user");
        config.setPassword("test_pass");
    }

    @Test
    void testClickHouseConnection_Success() {
        when(clickHouseUtil.testConnection(any(ClickHouseConfig.class), anyString()))
            .thenReturn(true);

        boolean result = sourceService.testClickHouseConnection(config, jwt);
        
        assertTrue(result);
        verify(clickHouseUtil).testConnection(config, jwt);
    }

    @Test
    void testClickHouseConnection_Failure() {
        when(clickHouseUtil.testConnection(any(ClickHouseConfig.class), anyString()))
            .thenReturn(false);

        boolean result = sourceService.testClickHouseConnection(config, jwt);
        
        assertFalse(result);
        verify(clickHouseUtil).testConnection(config, jwt);
    }

    @Test
    void getClickHouseTables_Success() {
        TableSchema expectedSchema = new TableSchema();
        when(clickHouseUtil.getTables(any(ClickHouseConfig.class), anyString()))
            .thenReturn(Collections.singletonList("test_table"));
        when(clickHouseUtil.getTableSchema(any(ClickHouseConfig.class), anyString(), anyString()))
            .thenReturn(expectedSchema);

        TableSchema result = sourceService.getClickHouseTables(config, jwt);
        
        assertNotNull(result);
        assertEquals(expectedSchema, result);
        verify(clickHouseUtil).getTables(config, jwt);
        verify(clickHouseUtil).getTableSchema(config, "test_table", jwt);
    }

    @Test
    void getClickHouseTables_NoTables() {
        when(clickHouseUtil.getTables(any(ClickHouseConfig.class), anyString()))
            .thenReturn(Collections.emptyList());

        TableSchema result = sourceService.getClickHouseTables(config, jwt);
        
        assertNotNull(result);
        assertTrue(result.getColumns().isEmpty());
        assertTrue(result.getPreview().isEmpty());
        verify(clickHouseUtil).getTables(config, jwt);
        verify(clickHouseUtil, never()).getTableSchema(any(), anyString(), anyString());
    }

    @Test
    void processFile_Success() throws Exception {
        String configJson = "{\"delimiter\":\",\",\"hasHeader\":true}";
        MultipartFile file = new MockMultipartFile(
            "test.csv",
            "test.csv",
            "text/csv",
            "id,name\n1,test".getBytes()
        );

        TableSchema result = sourceService.processFile(file, configJson);
        
        assertNotNull(result);
        // Add more specific assertions based on your file processing logic
    }

    @Test
    void getFilePreview_Success() {
        String fileId = "test-file-id";
        TableSchema expectedSchema = new TableSchema();

        TableSchema result = sourceService.getFilePreview(fileId);
        
        assertNotNull(result);
        // Add more specific assertions based on your file preview logic
    }
} 