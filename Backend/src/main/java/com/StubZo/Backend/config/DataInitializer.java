package com.StubZo.Backend.config;

import com.StubZo.Backend.entity.User;
import com.StubZo.Backend.entity.UserRole;
import com.StubZo.Backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@admin.com";
            if (userRepository.existsByEmail(adminEmail)) return;
            User admin = User.builder()
                    .name("Administrator")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("admin"))
                    .role(UserRole.ADMIN)
                    .active(true)
                    .build();
            userRepository.save(admin);
        };
    }
}


