package com.MediSys.MediSys.service;

import com.MediSys.MediSys.model.Patient;
import com.MediSys.MediSys.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    public Patient addPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public Patient updatePatient(Long id, Patient updatedPatient) {
        return patientRepository.findById(id)
                .map(p -> {
                    p.setFullName(updatedPatient.getFullName());
                    p.setEmail(updatedPatient.getEmail());
                    p.setPhone(updatedPatient.getPhone());
                    p.setDateOfBirth(updatedPatient.getDateOfBirth());
                    p.setGender(updatedPatient.getGender());
                    p.setAddress(updatedPatient.getAddress());
                    p.setMedicareNumber(updatedPatient.getMedicareNumber());
                    p.setEmergencyContact(updatedPatient.getEmergencyContact());
                    p.setMedicalHistory(updatedPatient.getMedicalHistory());
                    return patientRepository.save(p);
                })
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }
}
