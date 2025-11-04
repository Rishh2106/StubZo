package com.StubZo.Backend.service;

import com.StubZo.Backend.config.JwtUtil;
import com.StubZo.Backend.dto.LoginRequest;
import com.StubZo.Backend.dto.SignupRequest;
import com.StubZo.Backend.entity.*;
import com.StubZo.Backend.repository.OtpTokenRepository;
import com.StubZo.Backend.repository.ResidentRepository;
import com.StubZo.Backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final ResidentRepository residentRepository;
    private final OtpTokenRepository otpTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final MailService mailService;

    // Store last OTP for dev mode
    private final Map<String, String> lastOtpMap = new HashMap<>();

    public void signup(SignupRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Save user as RESIDENT inactive until OTP verified
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(UserRole.RESIDENT)
                .active(false)
                .build();
        userRepository.save(user);

        residentRepository.save(Resident.builder()
                .user(user)
                .aadharNumber(req.getAadharNumber())
                .aadharImagePath(null)
                .assignedRoom(null)
                .build());

        // Generate OTP
        String code = String.format("%06d", new Random().nextInt(999999));
        OtpToken token = OtpToken.builder()
                .email(req.getEmail())
                .code(code)
                .expiresAt(Instant.now().plus(10, ChronoUnit.MINUTES))
                .verified(false)
                .build();
        otpTokenRepository.save(token);

        // Store OTP for dev mode
        lastOtpMap.put(req.getEmail(), code);

        mailService.sendOtp(req.getEmail(), code);
    }

    public String login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!user.isActive()) {
            throw new RuntimeException("Please verify your email before login");
        }
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        return jwtUtil.generateToken(user);
    }

    public void resendOtp(String email) {
        String code = String.format("%06d", new Random().nextInt(999999));
        OtpToken token = OtpToken.builder()
                .email(email)
                .code(code)
                .expiresAt(Instant.now().plus(10, ChronoUnit.MINUTES))
                .verified(false)
                .build();
        otpTokenRepository.save(token);

        // Store OTP for dev mode
        lastOtpMap.put(email, code);

        mailService.sendOtp(email, code);
    }

    public boolean verifyOtp(String email, String code) {
        OtpToken latest = otpTokenRepository.findTopByEmailOrderByIdDesc(email)
                .orElseThrow(() -> new RuntimeException("OTP not found"));
        if (latest.isVerified() || latest.getExpiresAt().isBefore(Instant.now())) {
            throw new RuntimeException("OTP expired. Please resend.");
        }
        if (!latest.getCode().equals(code)) {
            return false;
        }
        latest.setVerified(true);
        otpTokenRepository.save(latest);

        // Activate user
        User user = userRepository.findByEmail(email).orElseThrow();
        user.setActive(true);
        userRepository.save(user);
        return true;
    }

    public String getLastOtpForEmail(String email) {
        return lastOtpMap.get(email);
    }
}


