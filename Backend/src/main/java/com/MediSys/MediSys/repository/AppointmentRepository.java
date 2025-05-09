package com.MediSys.MediSys.repository;

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
    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND a.appointmentDateTime >= :startTime AND a.appointmentDateTime < :endTime AND a.status != 'CANCELLED'")
    List<Appointment> findByDoctorAndAppointmentDateTimeBetween(
            @Param("doctor") Doctor doctor,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    @Query("SELECT a FROM Appointment a WHERE a.room = :room AND a.appointmentDateTime >= :startTime AND a.appointmentDateTime < :endTime AND a.status != 'CANCELLED'")
    List<Appointment> findByRoomAndAppointmentDateTimeBetween(
            @Param("room") HospitalRoom room,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    @Query("SELECT a FROM Appointment a JOIN a.resources r WHERE r = :resource AND a.appointmentDateTime >= :startTime AND a.appointmentDateTime < :endTime AND a.status != 'CANCELLED'")
    List<Appointment> findByResourcesAndAppointmentDateTimeBetween(
            @Param("resource") HospitalResource resource,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
}
