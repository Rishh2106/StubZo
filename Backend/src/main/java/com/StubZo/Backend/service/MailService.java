package com.StubZo.Backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {
    private final JavaMailSender mailSender;

    public void sendOtp(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your StubZo OTP Code");
        message.setText("Your OTP is: " + code + "\nThis code expires in 10 minutes.");
        try {
            mailSender.send(message);
            log.info("OTP email sent successfully to: {}", to);
            // For development: also log OTP to console
            log.info("DEV MODE - OTP for {} is: {}", to, code);
        } catch (Exception e) {
            log.error("Failed to send OTP email to: {}", to, e);
            // For development: log OTP even if email fails
            log.warn("DEV MODE - Email sending failed, but OTP for {} is: {}", to, code);
            // Don't throw exception - allow user to still receive OTP via console logs in dev
            // In production, you might want to throw this exception
        }
    }
}


