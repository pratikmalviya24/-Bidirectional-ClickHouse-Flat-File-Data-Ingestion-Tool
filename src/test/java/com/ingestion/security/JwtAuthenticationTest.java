package com.ingestion.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import javax.crypto.SecretKey;
import java.util.Collections;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

public class JwtAuthenticationTest {

    private static final String SECRET_KEY = "your-secret-key-that-is-at-least-256-bits-long";
    private static final long JWT_EXPIRATION = 86400000; // 24 hours
    private SecretKey key;

    @BeforeEach
    void setUp() {
        key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    @Test
    void generateToken() {
        String username = "testuser";
        String token = Jwts.builder()
            .setSubject(username)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
            .signWith(key)
            .compact();

        assertNotNull(token);
        assertTrue(token.split("\\.").length == 3); // JWT should have 3 parts
    }

    @Test
    void validateToken() {
        String username = "testuser";
        String token = Jwts.builder()
            .setSubject(username)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
            .signWith(key)
            .compact();

        String subject = Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();

        assertEquals(username, subject);
    }

    @Test
    void tokenExpiration() {
        String token = Jwts.builder()
            .setSubject("testuser")
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() - 1000)) // Expired token
            .signWith(key)
            .compact();

        assertThrows(Exception.class, () -> {
            Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
        });
    }

    @Test
    void invalidToken() {
        String invalidToken = "invalid.token.signature";

        assertThrows(Exception.class, () -> {
            Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(invalidToken);
        });
    }

    @Test
    void authenticationDetails() {
        String username = "testuser";
        String token = Jwts.builder()
            .setSubject(username)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
            .signWith(key)
            .compact();

        Authentication authentication = new JwtAuthenticationToken(token, Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));

        assertEquals(username, authentication.getPrincipal());
        assertTrue(authentication.isAuthenticated());
        assertTrue(authentication.getAuthorities().stream()
            .anyMatch(auth -> auth.getAuthority().equals("ROLE_USER")));
    }
} 