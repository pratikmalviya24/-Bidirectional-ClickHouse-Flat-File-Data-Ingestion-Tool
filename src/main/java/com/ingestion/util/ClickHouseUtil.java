package com.ingestion.util;

import com.ingestion.dto.ClickHouseConfig;
import com.ingestion.dto.TableSchema;
import com.ingestion.dto.TableSchema.Column;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.BufferedReader;
import java.io.Reader;
import java.io.StringReader;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.stream.Collectors;

/**
 * Utility class for ClickHouse database operations
 */
public class ClickHouseUtil {
    private static final Logger log = LoggerFactory.getLogger(ClickHouseUtil.class);
    private static final String JDBC_URL_TEMPLATE = "jdbc:clickhouse://%s:%d/%s";
    private static final int PREVIEW_LIMIT = 10;

    /**
     * Get a connection to ClickHouse
     */
    public static Connection getConnection(String host, int port, String database, String username, String password, String jwt) throws SQLException {
        String url = String.format(JDBC_URL_TEMPLATE, host, port, database);
        Properties properties = new Properties();
        properties.setProperty("user", username);
        properties.setProperty("password", password);
        properties.setProperty("ssl", "false"); // Disable SSL by default
        properties.setProperty("socket_timeout", "30000"); // 30 seconds timeout
        
        if (jwt != null && !jwt.isEmpty()) {
            properties.setProperty("custom_http_headers", "Authorization: Bearer " + jwt);
        }
        
        return DriverManager.getConnection(url, properties);
    }

    /**
     * Get a connection to ClickHouse using config object
     */
    public static Connection getConnection(ClickHouseConfig config, String jwt) throws SQLException {
        return getConnection(
            config.getHost(), 
            config.getPort(), 
            config.getDatabase(), 
            config.getUsername(), 
            config.getPassword(), 
            jwt
        );
    }

    /**
     * Test connection to ClickHouse
     */
    public static boolean testConnection(ClickHouseConfig config, String jwt) {
        try (Connection conn = getConnection(config, jwt)) {
            Statement stmt = conn.createStatement();
            stmt.execute("SELECT 1");
            stmt.close();
            return true;
        } catch (Exception e) {
            log.error("Failed to connect to ClickHouse", e);
            return false;
        }
    }

    /**
     * Get schema for a table
     */
    public static TableSchema getTableSchema(ClickHouseConfig config, String tableName, String jwt) {
        List<Column> columns = new ArrayList<>();
        List<Map<String, Object>> preview = new ArrayList<>();

        try (Connection conn = getConnection(config, jwt)) {
            // First check if table exists
            boolean tableExists = false;
            try (Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery("SHOW TABLES LIKE '" + tableName + "'")) {
                tableExists = rs.next();
            }

            if (!tableExists) {
                log.warn("Table {} does not exist in database {}", tableName, config.getDatabase());
                return new TableSchema(columns, preview);
            }

            // Get column information
            DatabaseMetaData metaData = conn.getMetaData();
            try (ResultSet columnsRs = metaData.getColumns(config.getDatabase(), null, tableName, null)) {
                while (columnsRs.next()) {
                    String columnName = columnsRs.getString("COLUMN_NAME");
                    String columnType = columnsRs.getString("TYPE_NAME");
                    
                    Column column = new Column(
                        columnName,
                        columnType,
                        true,
                        columnName,
                        columnType
                    );
                    
                    columns.add(column);
                }
            }

            // Get preview data only if we have columns
            if (!columns.isEmpty()) {
                try (Statement stmt = conn.createStatement();
                     ResultSet rs = stmt.executeQuery("SELECT * FROM " + tableName + " LIMIT " + PREVIEW_LIMIT)) {
                    
                    ResultSetMetaData rsMetaData = rs.getMetaData();
                    int columnCount = rsMetaData.getColumnCount();
                    
                    while (rs.next()) {
                        Map<String, Object> row = new HashMap<>();
                        for (int i = 1; i <= columnCount; i++) {
                            String columnName = rsMetaData.getColumnName(i);
                            Object value = rs.getObject(i);
                            row.put(columnName, value);
                        }
                        preview.add(row);
                    }
                }
            }

            return new TableSchema(columns, preview);
        } catch (Exception e) {
            log.error("Failed to get table schema for table: {}", tableName, e);
            throw new RuntimeException("Failed to get table schema", e);
        }
    }

    /**
     * Get list of tables in the database
     */
    public static List<String> getTables(ClickHouseConfig config, String jwt) {
        List<String> tables = new ArrayList<>();
        try (Connection conn = getConnection(config, jwt)) {
            DatabaseMetaData metaData = conn.getMetaData();
            try (ResultSet tablesRs = metaData.getTables(config.getDatabase(), null, null, new String[]{"TABLE"})) {
                while (tablesRs.next()) {
                    tables.add(tablesRs.getString("TABLE_NAME"));
                }
            }
            return tables;
        } catch (Exception e) {
            log.error("Failed to get tables list", e);
            throw new RuntimeException("Failed to get tables list", e);
        }
    }

    /**
     * Execute a query and return results
     */
    public static List<Map<String, Object>> queryData(ClickHouseConfig config, String query, String jwt) {
        List<Map<String, Object>> results = new ArrayList<>();
        try (Connection conn = getConnection(config, jwt);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
            
            ResultSetMetaData metaData = rs.getMetaData();
            int columnCount = metaData.getColumnCount();
            
            while (rs.next()) {
                Map<String, Object> row = new HashMap<>();
                for (int i = 1; i <= columnCount; i++) {
                    String columnName = metaData.getColumnName(i);
                    Object value = rs.getObject(i);
                    row.put(columnName, value);
                }
                results.add(row);
            }
            return results;
        } catch (Exception e) {
            log.error("Failed to execute query", e);
            throw new RuntimeException("Failed to execute query", e);
        }
    }

    /**
     * Import data into a table
     */
    public static void importData(ClickHouseConfig config, String tableName, List<String> columns, Reader data, String jwt) {
        String columnList = String.join(", ", columns);
        String placeholders = columns.stream().map(c -> "?").collect(Collectors.joining(", "));
        String sql = String.format("INSERT INTO %s (%s) VALUES (%s)", tableName, columnList, placeholders);

        try (Connection conn = getConnection(config, jwt);
             PreparedStatement stmt = conn.prepareStatement(sql);
             BufferedReader reader = new BufferedReader(data)) {
            
            String line;
            conn.setAutoCommit(false);
            int batchSize = 1000;
            int count = 0;

            while ((line = reader.readLine()) != null) {
                String[] values = line.split(","); // Assuming CSV format
                for (int i = 0; i < values.length; i++) {
                    stmt.setObject(i + 1, values[i]);
                }
                stmt.addBatch();
                
                if (++count % batchSize == 0) {
                    stmt.executeBatch();
                    conn.commit();
                }
            }
            
            stmt.executeBatch();
            conn.commit();
        } catch (Exception e) {
            log.error("Failed to import data", e);
            throw new RuntimeException("Failed to import data", e);
        }
    }

    /**
     * Execute a query without returning results
     */
    public static void executeQuery(ClickHouseConfig config, String query, String jwt) {
        try (Connection conn = getConnection(config, jwt);
             Statement stmt = conn.createStatement()) {
            stmt.execute(query);
        } catch (Exception e) {
            log.error("Failed to execute query", e);
            throw new RuntimeException("Failed to execute query", e);
        }
    }
}
