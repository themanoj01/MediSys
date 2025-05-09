package com.MediSys.MediSys.auth.controller;


import com.MediSys.MediSys.auth.dto.AuthResponse;
import com.MediSys.MediSys.auth.dto.RegisterDoctorDto;
import com.MediSys.MediSys.auth.dto.RegisterDto;
import com.MediSys.MediSys.auth.dto.UserLoginDto;
import com.MediSys.MediSys.auth.service.AuthService;
import com.MediSys.MediSys.auth.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService){
        this.authService = authService;
        this.userService = userService;
    }
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody UserLoginDto dto) {
        AuthResponse response = authService.generateToken(dto);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/register-patient")
    public ResponseEntity<?> register(@RequestBody RegisterDto registerDto) {
        userService.registerPatient(registerDto);
        return ResponseEntity.ok("Patient registered successfully.");
    }

    @PostMapping("/register-doctor")
    public ResponseEntity<?> register(@RequestBody RegisterDoctorDto registerDto) {
        userService.registerDoctor(registerDto);
        return ResponseEntity.ok("Doctor registered successfully.");
    }
}
