package com.MediSys.MediSys.repository;

import com.MediSys.MediSys.model.Doctor;
import com.MediSys.MediSys.model.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule, Long> {
    Optional<DoctorSchedule> findByDoctorAndDayOfWeek(Doctor doctor, String dayOfWeek);
}

