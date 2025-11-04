package com.StubZo.Backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    private String aadharNumber;

    private String occupation; // student / working-professional / other

    private String localAddress;

    private String dateOfBirth;

    private Integer age;

    private String mobileNumber;
}


