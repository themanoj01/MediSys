package com.MediSys.MediSys.auth.service;

import com.MediSys.MediSys.auth.dto.RegisterDoctorDto;
import com.MediSys.MediSys.auth.dto.RegisterDto;
import com.MediSys.MediSys.auth.model.Role;
import com.MediSys.MediSys.auth.model.User;
import com.MediSys.MediSys.auth.repository.RoleRepository;
import com.MediSys.MediSys.auth.repository.UserRepository;
import com.MediSys.MediSys.exception.ResourceNotFoundException;
import com.MediSys.MediSys.model.Doctor;
import com.MediSys.MediSys.model.Patient;
import com.MediSys.MediSys.repository.DoctorRepository;
import com.MediSys.MediSys.repository.PatientRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return new org.springframework.security.core.userdetails.User(email, user.getPassword(), getAuthority(user));
    }

    private Set<SimpleGrantedAuthority> getAuthority(User user) {
        return Collections.singleton(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().getName().toUpperCase())
        );
    }


    @Transactional
    public void registerPatient(RegisterDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
//        if (!dto.getMedicareNumber().matches("\\d{10,11}")) {
//            throw new IllegalArgumentException("Invalid Medicare number");
//        }

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        Role patientRole = roleRepository.findByName("PATIENT")
                .orElseThrow(() -> new ResourceNotFoundException("Role PATIENT not found"));
        user.setRole(patientRole);
        userRepository.save(user);

        Patient patient = new Patient();
        patient.setUser(user);
        patient.setFullName(dto.getFullName());
        patient.setEmail(dto.getEmail());
        patient.setPhone(dto.getPhone());
        patient.setDateOfBirth(dto.getDateOfBirth());
        patient.setGender(dto.getGender());
        patient.setAddress(dto.getAddress());
        patient.setMedicareNumber(dto.getMedicareNumber());
        patient.setEmergencyContact(dto.getEmergencyContact());
        patient.setActive(true);
        patientRepository.save(patient);
    }

    @Transactional
    public void registerDoctor(RegisterDoctorDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
//        if (!dto.getRegistrationNumber().matches("MED\\d{9}")) {
//            throw new IllegalArgumentException("Invalid AHPRA number");
//        }

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        Role doctorRole = roleRepository.findByName("DOCTOR")
                .orElseThrow(() -> new ResourceNotFoundException("Role DOCTOR not found"));
        user.setRole(doctorRole);
        userRepository.save(user);

        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setFullName(dto.getFullName());
        doctor.setEmail(dto.getEmail());
        doctor.setPhone(dto.getPhone());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setRegistrationNumber(dto.getRegistrationNumber());
        doctor.setYearsOfExperience(dto.getYearsOfExperience());
        doctor.setGender(dto.getGender());
        doctor.setActive(true);
        doctorRepository.save(doctor);
    }
}