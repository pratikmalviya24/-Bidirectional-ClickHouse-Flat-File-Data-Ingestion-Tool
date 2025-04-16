package com.ingestion.util;

import com.ingestion.dto.ClickHouseConfig;
import com.ingestion.dto.TableSchema;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ClickHouseUtilTest {

    @Mock
    private Connection mockConnection;
    
    @Mock
    private Statement mockStatement;
    
    @Mock
    private ResultSet mockResultSet;
    
    @Mock
    private DatabaseMetaData mockMetaData;
    
    @Mock
    private ResultSet mockColumnsResultSet;
    
    @Mock
    private ResultSetMetaData mockResultSetMetaData;
    
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
    void testConnection_Success() throws SQLException {
        when(mockConnection.createStatement()).thenReturn(mockStatement);
        when(mockStatement.execute(anyString())).thenReturn(true);
        
        assertTrue(ClickHouseUtil.testConnection(config, jwt));
    }

    @Test
    void testConnection_Failure() throws SQLException {
        when(mockConnection.createStatement()).thenThrow(new SQLException("Connection failed"));
        
        assertFalse(ClickHouseUtil.testConnection(config, jwt));
    }

    @Test
    void getTableSchema_Success() throws SQLException {
        // Setup mock behavior
        when(mockConnection.getMetaData()).thenReturn(mockMetaData);
        when(mockMetaData.getColumns(anyString(), anyString(), anyString(), anyString()))
            .thenReturn(mockColumnsResultSet);
        when(mockColumnsResultSet.next()).thenReturn(true, false);
        when(mockColumnsResultSet.getString("COLUMN_NAME")).thenReturn("test_column");
        when(mockColumnsResultSet.getString("TYPE_NAME")).thenReturn("String");
        
        when(mockConnection.createStatement()).thenReturn(mockStatement);
        when(mockStatement.executeQuery(anyString())).thenReturn(mockResultSet);
        when(mockResultSet.getMetaData()).thenReturn(mockResultSetMetaData);
        when(mockResultSet.next()).thenReturn(true, false);
        when(mockResultSet.getObject(anyInt())).thenReturn("test_value");
        when(mockResultSetMetaData.getColumnCount()).thenReturn(1);
        when(mockResultSetMetaData.getColumnName(anyInt())).thenReturn("test_column");

        TableSchema schema = ClickHouseUtil.getTableSchema(config, "test_table", jwt);
        
        assertNotNull(schema);
        assertEquals(1, schema.getColumns().size());
        assertEquals("test_column", schema.getColumns().get(0).getName());
        assertEquals("String", schema.getColumns().get(0).getType());
    }

    @Test
    void getTables_Success() throws SQLException {
        when(mockConnection.getMetaData()).thenReturn(mockMetaData);
        when(mockMetaData.getTables(anyString(), anyString(), anyString(), any()))
            .thenReturn(mockResultSet);
        when(mockResultSet.next()).thenReturn(true, false);
        when(mockResultSet.getString("TABLE_NAME")).thenReturn("test_table");

        List<String> tables = ClickHouseUtil.getTables(config, jwt);
        
        assertNotNull(tables);
        assertEquals(1, tables.size());
        assertEquals("test_table", tables.get(0));
    }

    @Test
    void queryData_Success() throws SQLException {
        when(mockConnection.createStatement()).thenReturn(mockStatement);
        when(mockStatement.executeQuery(anyString())).thenReturn(mockResultSet);
        when(mockResultSet.getMetaData()).thenReturn(mockResultSetMetaData);
        when(mockResultSet.next()).thenReturn(true, false);
        when(mockResultSet.getObject(anyInt())).thenReturn("test_value");
        when(mockResultSetMetaData.getColumnCount()).thenReturn(1);
        when(mockResultSetMetaData.getColumnName(anyInt())).thenReturn("test_column");

        List<Map<String, Object>> results = ClickHouseUtil.queryData(config, "SELECT * FROM test_table", jwt);
        
        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals("test_value", results.get(0).get("test_column"));
    }
} 