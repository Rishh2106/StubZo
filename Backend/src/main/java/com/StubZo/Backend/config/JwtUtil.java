package com.StubZo.Backend.config;

import com.StubZo.Backend.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.MessageDigest;
import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {
    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;

    private Key getSignKey() {
        try {
            byte[] keyBytes;
            if (secret != null && secret.startsWith("base64:")) {
                keyBytes = Decoders.BASE64.decode(secret.substring(7));
            } else {
                keyBytes = secret.getBytes(StandardCharsets.UTF_8);
            }

            // Ensure >= 256-bit (32 bytes) for HS256
            if (keyBytes.length < 32) {
                MessageDigest md = MessageDigest.getInstance("SHA-256");
                keyBytes = md.digest(keyBytes);
            }

            return Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception e) {
            // Fallback: derive deterministic 256-bit key
            byte[] fallback = (secret == null ? "default-secret" : secret).getBytes(StandardCharsets.UTF_8);
            if (fallback.length < 32) {
                try {
                    MessageDigest md = MessageDigest.getInstance("SHA-256");
                    fallback = md.digest(fallback);
                } catch (Exception ignored) {}
            }
            return Keys.hmacShaKeyFor(fallback);
        }
    }

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .addClaims(Map.of("role", user.getRole().name(), "name", user.getName(), "uid", user.getId()))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }
}


