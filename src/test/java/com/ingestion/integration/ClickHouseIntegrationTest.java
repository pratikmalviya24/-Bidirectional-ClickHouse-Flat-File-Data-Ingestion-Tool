package com.ingestion.integration;

import com.ingestion.dto.ClickHouseConfig;
import com.ingestion.dto.TableSchema;
import com.ingestion.util.ClickHouseUtil;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.testcontainers.containers.ClickHouseContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
@SpringBootTest
public class ClickHouseIntegrationTest {

    @Container
    private static final ClickHouseContainer clickHouseContainer = new ClickHouseContainer("clickhouse/clickhouse-server:latest")
        .withExposedPorts(8123, 9000);

    private static ClickHouseConfig config;
    private static final String TEST_DATABASE = "test_db";
    private static final String TEST_TABLE = "test_table";
    private static final String TEST_JWT = "test-jwt-token";

    @BeforeAll
    static void setup() {
        config = new ClickHouseConfig();
        config.setHost(clickHouseContainer.getHost());
        config.setPort(clickHouseContainer.getMappedPort(8123));
        config.setDatabase(TEST_DATABASE);
        config.setUsername("default");
        config.setPassword("");

        // Create test database and table
        try {
            ClickHouseUtil.executeQuery(config, "CREATE DATABASE IF NOT EXISTS " + TEST_DATABASE, TEST_JWT);
            ClickHouseUtil.executeQuery(config, 
                "CREATE TABLE IF NOT EXISTS " + TEST_DATABASE + "." + TEST_TABLE + 
                " (id UInt32, name String) ENGINE = Memory", TEST_JWT);
            
            // Insert test data
            ClickHouseUtil.executeQuery(config, 
                "INSERT INTO " + TEST_DATABASE + "." + TEST_TABLE + " VALUES (1, 'test1'), (2, 'test2')", 
                TEST_JWT);
        } catch (Exception e) {
            fail("Failed to setup test environment: " + e.getMessage());
        }
    }

    @Test
    void testConnection() {
        assertTrue(ClickHouseUtil.testConnection(config, TEST_JWT));
    }

    @Test
    void getTables() {
        List<String> tables = ClickHouseUtil.getTables(config, TEST_JWT);
        assertNotNull(tables);
        assertTrue(tables.contains(TEST_TABLE));
    }

    @Test
    void getTableSchema() {
        TableSchema schema = ClickHouseUtil.getTableSchema(config, TEST_TABLE, TEST_JWT);
        assertNotNull(schema);
        assertEquals(2, schema.getColumns().size());
        assertEquals("id", schema.getColumns().get(0).getName());
        assertEquals("UInt32", schema.getColumns().get(0).getType());
        assertEquals("name", schema.getColumns().get(1).getName());
        assertEquals("String", schema.getColumns().get(1).getType());
    }

    @Test
    void queryData() {
        List<Map<String, Object>> results = ClickHouseUtil.queryData(
            config, 
            "SELECT * FROM " + TEST_DATABASE + "." + TEST_TABLE, 
            TEST_JWT
        );
        
        assertNotNull(results);
        assertEquals(2, results.size());
        assertEquals(1, results.get(0).get("id"));
        assertEquals("test1", results.get(0).get("name"));
        assertEquals(2, results.get(1).get("id"));
        assertEquals("test2", results.get(1).get("name"));
    }
} 