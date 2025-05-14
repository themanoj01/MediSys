package com.MediSys.MediSys.repository;

import com.MediSys.MediSys.model.Doctor;
import com.MediSys.MediSys.model.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule, Long> {
    Optional<DoctorSchedule> findByDoctorAndDayOfWeek(Doctor doctor, String dayOfWeek);
    boolean existsByDoctorAndDayOfWeek(Doctor doctor, String dayOfWeek);
}