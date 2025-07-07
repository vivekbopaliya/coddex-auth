package org.oppex.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.oppex.model.User;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Arrays;
import java.util.HashSet;
import java.util.UUID;

@ApplicationScoped
public class JwtService {

    @ConfigProperty(name = "app.jwt.secret")
    String jwtSecret;

    @ConfigProperty(name = "app.jwt.expiration", defaultValue = "86400")
    long jwtExpiration;

    /**
     * Get the secret key for JWT operations
     */
    private SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Generates a JWT token for a user
     */
    public String generateToken(User user) {
        return Jwt.issuer("http://localhost:3000")
                .subject(user.getId().toString())
                .upn(user.getEmail())
                .groups(new HashSet<>(Arrays.asList("user")))
                .claim(org.eclipse.microprofile.jwt.Claims.email.name(), user.getEmail())
                .claim("email_verified", user.isEmailVerified())
                .expiresIn(Duration.ofSeconds(jwtExpiration))
                .sign();
    }

    /**
     * Generates a short-lived token for email verification
     */
    public String generateEmailVerificationToken(String email) {
        return Jwt.issuer("http://localhost:3000")
                .subject(email)
                .upn(email)
                .groups(new HashSet<>(Arrays.asList("email_verification")))
                .claim("purpose", "email_verification")
                .expiresIn(Duration.ofHours(1))
                .sign();
    }

    /**
     * Extracts user ID from JWT token
     */
    public UUID extractUserId(String token) {
        try {
            // Remove "Bearer " prefix if present
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            Claims claims = Jwts.parser()
                    .verifyWith(getSecretKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return UUID.fromString(claims.getSubject());
        } catch (Exception e) {
            throw new RuntimeException("Invalid JWT token", e);
        }
    }

    /**
     * Extracts email from JWT token
     */
    public String extractEmail(String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            Claims claims = Jwts.parser()
                    .verifyWith(getSecretKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return claims.get("email", String.class);
        } catch (Exception e) {
            throw new RuntimeException("Invalid JWT token", e);
        }
    }

    /**
     * Validates if a token is valid and not expired
     */
    public boolean validateToken(String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            Jwts.parser()
                    .verifyWith(getSecretKey())
                    .build()
                    .parseSignedClaims(token);

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Extracts all claims from JWT token
     */
    public Claims extractAllClaims(String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            return Jwts.parser()
                    .verifyWith(getSecretKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            throw new RuntimeException("Invalid JWT token", e);
        }
    }
}