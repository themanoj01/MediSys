package com.MediSys.MediSys.repository;

import com.MediSys.MediSys.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    boolean existsByEmail(String email);

    Patient findByEmail(String email);
    Optional<Patient> findByUserId(Long userId);

}

