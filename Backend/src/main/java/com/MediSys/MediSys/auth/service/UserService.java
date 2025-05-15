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
import com.MediSys.MediSys.service.FileStorageService;
import jakarta.transaction.Transactional;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.Set;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageService fileStorageService;

    public UserService(UserRepository userRepository, RoleRepository roleRepository,
                       PatientRepository patientRepository, DoctorRepository doctorRepository,
                       PasswordEncoder passwordEncoder, FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
        this.fileStorageService = fileStorageService;
    }

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
    public void registerDoctor(RegisterDoctorDto dto, MultipartFile image) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

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

        if (image != null && !image.isEmpty()) {
            String imageUrl = fileStorageService.storeFile(image);
            doctor.setImageUrl(imageUrl);
        }

        doctorRepository.save(doctor);
    }
}