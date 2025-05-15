package com.MediSys.MediSys.auth.service;


import com.MediSys.MediSys.auth.config.TokenProvider;
import com.MediSys.MediSys.auth.dto.AuthResponse;
import com.MediSys.MediSys.auth.dto.UserLoginDto;
import com.MediSys.MediSys.auth.model.Role;
import com.MediSys.MediSys.auth.model.User;
import com.MediSys.MediSys.auth.repository.RoleRepository;
import com.MediSys.MediSys.auth.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


@Service
public class AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final TokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository, TokenProvider tokenProvider, AuthenticationManager authenticationManager){
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
    }
    public AuthResponse generateToken(UserLoginDto request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            throw new BadCredentialsException("Invalid email or password");
        }
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.generateToken(authentication);
        String role = user.getRole().getName();
        Long userId = user.getId();

        return new AuthResponse(
                token, role, userId
        );
    }

}

