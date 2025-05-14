package com.MediSys.MediSys.service;

import com.MediSys.MediSys.auth.dto.RegisterDoctorDto;
import com.MediSys.MediSys.exception.ResourceNotFoundException;
import com.MediSys.MediSys.model.Doctor;
import com.MediSys.MediSys.repository.DoctorRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private final FileStorageService fileStorageService;

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }

    @Transactional
    public Doctor updateDoctor(Long id, RegisterDoctorDto dto, MultipartFile image) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));

        doctor.setFullName(dto.getFullName());
        doctor.setEmail(dto.getEmail());
        doctor.setPhone(dto.getPhone());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setRegistrationNumber(dto.getRegistrationNumber());
        doctor.setYearsOfExperience(dto.getYearsOfExperience());
        doctor.setGender(dto.getGender());

        if (image != null && !image.isEmpty()) {
            if (doctor.getImageUrl() != null) {
                try {
                    Files.deleteIfExists(Paths.get("uploads/" + doctor.getImageUrl().substring("/uploads/".length())));
                } catch (Exception e) {
                    throw new RuntimeException("Error deleting image " + doctor.getImageUrl());
                }
            }
            String imageUrl = fileStorageService.storeFile(image);
            doctor.setImageUrl(imageUrl);
        }

        Doctor updatedDoctor = doctorRepository.save(doctor);
        return updatedDoctor;
    }

    @Transactional
    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));

        if (doctor.getImageUrl() != null) {
            try {
                Files.deleteIfExists(Paths.get("uploads/" + doctor.getImageUrl().substring("/uploads/".length())));
            } catch (Exception e) {
            }
        }

        doctorRepository.deleteById(id);
    }
}

