package com.MediSys.MediSys.service;

import com.MediSys.MediSys.model.Doctor;
import com.MediSys.MediSys.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }

    public Doctor addDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public Doctor updateDoctor(Long id, Doctor updatedDoctor) {
        return doctorRepository.findById(id)
                .map(d -> {
                    d.setFullName(updatedDoctor.getFullName());
                    d.setEmail(updatedDoctor.getEmail());
                    d.setPhone(updatedDoctor.getPhone());
                    d.setSpecialization(updatedDoctor.getSpecialization());
                    d.setRegistrationNumber(updatedDoctor.getRegistrationNumber());
                    d.setYearsOfExperience(updatedDoctor.getYearsOfExperience());
                    d.setGender(updatedDoctor.getGender());
                    return doctorRepository.save(d);
                })
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }
}

