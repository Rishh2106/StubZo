package com.StubZo.Backend.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.MessageDigest;
import java.util.Collections;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Value("${app.jwt.secret}")
    private String secret;

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

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(getSignKey())
                        .build()
                        .parseClaimsJws(token)
                        .getBody();
                String email = claims.getSubject();
                String role = String.valueOf(claims.get("role"));
                GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(email, null, Collections.singletonList(authority));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception ignored) {
                // Invalid token, proceed without auth
            }
        }

        filterChain.doFilter(request, response);
    }
}


