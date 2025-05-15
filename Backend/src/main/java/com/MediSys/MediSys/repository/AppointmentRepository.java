package com.MediSys.MediSys.repository;

import com.MediSys.MediSys.enums.AppointmentStatus;
import com.MediSys.MediSys.model.Appointment;
import com.MediSys.MediSys.model.Doctor;
import com.MediSys.MediSys.model.HospitalResource;
import com.MediSys.MediSys.model.HospitalRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
        List<Appointment> findByDoctorAndAppointmentDateTimeBetween(
                @Param("doctor") Doctor doctor,
                @Param("startTime") LocalDateTime startTime,
                @Param("endTime") LocalDateTime endTime
        );

        List<Appointment> findByDoctorIdAndAppointmentDateTimeBetweenAndStatusIn(
                Long doctorId, LocalDateTime startTime, LocalDateTime endTime, List<AppointmentStatus> statuses);

    List<Appointment> findByDoctor(Doctor doctor);
}

