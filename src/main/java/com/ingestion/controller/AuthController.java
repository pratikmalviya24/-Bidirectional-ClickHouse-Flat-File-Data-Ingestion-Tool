package com.ingestion.controller;

import com.ingestion.config.JwtService;
import com.ingestion.dto.AuthRequest;
import com.ingestion.dto.AuthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        // TODO: Implement proper user authentication against a database
        // For now, using a simple hardcoded check
        if ("admin".equals(request.getUsername()) && "admin".equals(request.getPassword())) {
            String token = jwtService.generateToken(request.getUsername());
            AuthResponse response = new AuthResponse();
            response.setToken(token);
            response.setExpiresIn(86400000L); // 24 hours
            return ResponseEntity.ok(response);
        }
        throw new BadCredentialsException("Invalid username or password");
    }

    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return ResponseEntity.ok(jwtService.isTokenValid(token));
        }
        return ResponseEntity.ok(false);
    }
} 

