package com.StubZo.Backend.controller;

import com.StubZo.Backend.dto.LoginRequest;
import com.StubZo.Backend.dto.SignupRequest;
import com.StubZo.Backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        try {
            authService.signup(request);
            // For development: return OTP in response if email not configured
            String devOtp = authService.getLastOtpForEmail(request.getEmail());
            Map<String, Object> response = Map.of("success", true, "message", "Signup successful. Check your email for OTP.");
            if (devOtp != null) {
                response = Map.of("success", true, "message", "Signup successful. Check your email for OTP.", "devOtp", devOtp);
            }
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        String token = authService.login(request);
        return ResponseEntity.ok(Map.of("success", true, "token", token));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            authService.resendOtp(email);
            String devOtp = authService.getLastOtpForEmail(email);
            Map<String, Object> response = Map.of("success", true);
            if (devOtp != null) {
                response = Map.of("success", true, "devOtp", devOtp);
            }
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            authService.resendOtp(email);
            String devOtp = authService.getLastOtpForEmail(email);
            Map<String, Object> response = Map.of("success", true);
            if (devOtp != null) {
                response = Map.of("success", true, "devOtp", devOtp);
            }
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String otp = body.get("otp");
            if (email == null || otp == null) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Email and OTP are required"));
            }
            boolean ok = authService.verifyOtp(email, otp);
            if (ok) {
                return ResponseEntity.ok(Map.of("success", true, "message", "Email verified successfully"));
            } else {
                return ResponseEntity.ok(Map.of("success", false, "message", "Invalid OTP. Please try again."));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}


