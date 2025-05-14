package com.MediSys.MediSys.auth.controller;


import com.MediSys.MediSys.auth.dto.AuthResponse;
import com.MediSys.MediSys.auth.dto.RegisterDoctorDto;
import com.MediSys.MediSys.auth.dto.RegisterDto;
import com.MediSys.MediSys.auth.dto.UserLoginDto;
import com.MediSys.MediSys.auth.service.AuthService;
import com.MediSys.MediSys.auth.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
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

    @PostMapping(value = "/register-doctor", consumes = {"multipart/form-data"})
    public ResponseEntity<?> registerDoctor(
            @Valid @RequestPart("dto") RegisterDoctorDto registerDto,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        userService.registerDoctor(registerDto, image);
        return ResponseEntity.ok("Doctor registered successfully.");
    }
}
