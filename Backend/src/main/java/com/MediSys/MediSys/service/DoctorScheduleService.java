package com.MediSys.MediSys.service;

import com.MediSys.MediSys.dto.DoctorScheduleDto;
import com.MediSys.MediSys.exception.ResourceNotFoundException;
import com.MediSys.MediSys.model.Doctor;
import com.MediSys.MediSys.model.DoctorSchedule;
import com.MediSys.MediSys.repository.DoctorRepository;
import com.MediSys.MediSys.repository.DoctorScheduleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;

@Service
public class DoctorScheduleService {
    private static final Logger logger = LoggerFactory.getLogger(DoctorScheduleService.class);

    private final DoctorScheduleRepository doctorScheduleRepository;
    private final DoctorRepository doctorRepository;

    public DoctorScheduleService(DoctorScheduleRepository doctorScheduleRepository, DoctorRepository doctorRepository) {
        this.doctorScheduleRepository = doctorScheduleRepository;
        this.doctorRepository = doctorRepository;
    }

    @Transactional
    public DoctorSchedule createSchedule(DoctorScheduleDto dto) {
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + dto.getDoctorId()));

        if (doctorScheduleRepository.existsByDoctorAndDayOfWeek(doctor, dto.getDayOfWeek())) {
            logger.warn("Schedule already exists for doctor {} on {}", dto.getDoctorId(), dto.getDayOfWeek());
            throw new IllegalArgumentException("Schedule already exists for this doctor on " + dto.getDayOfWeek());
        }

        if (dto.getStartTime().isAfter(dto.getEndTime()) || dto.getStartTime().equals(dto.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        DoctorSchedule schedule = new DoctorSchedule();
        schedule.setDoctor(doctor);
        schedule.setDayOfWeek(dto.getDayOfWeek());
        schedule.setStartTime(dto.getStartTime());
        schedule.setEndTime(dto.getEndTime());
        schedule.setSlotDuration(dto.getSlotDuration());

        DoctorSchedule savedSchedule = doctorScheduleRepository.save(schedule);
        logger.info("Schedule created successfully: {}", savedSchedule.getId());
        return savedSchedule;
    }

    public DoctorSchedule getScheduleById(Long id) {
        DoctorSchedule schedule = doctorScheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with ID: " + id));
        logger.info("Retrieved schedule: {}", id);
        return schedule;
    }

    public List<DoctorSchedule> getSchedulesByDoctorId(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + doctorId));
        List<DoctorSchedule> schedules = doctorScheduleRepository.findAll().stream()
                .filter(schedule -> schedule.getDoctor().getId().equals(doctorId))
                .toList();
        logger.info("Retrieved {} schedules for doctor {}", schedules.size(), doctorId);
        return schedules;
    }

    @Transactional
    public DoctorSchedule updateSchedule(Long id, DoctorScheduleDto dto) {
        DoctorSchedule schedule = doctorScheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with ID: " + id));

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + dto.getDoctorId()));

        if (!schedule.getDayOfWeek().equals(dto.getDayOfWeek()) &&
                doctorScheduleRepository.existsByDoctorAndDayOfWeek(doctor, dto.getDayOfWeek())) {
            logger.warn("Attempt to update schedule {} with existing day for doctor {}: {}", id, dto.getDoctorId(), dto.getDayOfWeek());
            throw new IllegalArgumentException("Schedule already exists for this doctor on " + dto.getDayOfWeek());
        }

        if (dto.getStartTime().isAfter(dto.getEndTime()) || dto.getStartTime().equals(dto.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        schedule.setDoctor(doctor);
        schedule.setDayOfWeek(dto.getDayOfWeek());
        schedule.setStartTime(dto.getStartTime());
        schedule.setEndTime(dto.getEndTime());
        schedule.setSlotDuration(dto.getSlotDuration());

        DoctorSchedule updatedSchedule = doctorScheduleRepository.save(schedule);
        logger.info("Schedule updated successfully: {}", id);
        return updatedSchedule;
    }

    @Transactional
    public void deleteSchedule(Long id) {
        if (!doctorScheduleRepository.existsById(id)) {
            logger.warn("Attempt to delete non-existent schedule: {}", id);
            throw new ResourceNotFoundException("Schedule not found with ID: " + id);
        }
        doctorScheduleRepository.deleteById(id);
        logger.info("Schedule deleted successfully: {}", id);
    }

    public List<DoctorSchedule> getAllSchedules() {
        return doctorScheduleRepository.findAll();
    }
}