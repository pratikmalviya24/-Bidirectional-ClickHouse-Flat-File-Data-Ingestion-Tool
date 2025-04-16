package com.ingestion.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClickHouseConfig {
    private String host;
    private int port;
    private String database;
    private String username;
    private String password;
}
