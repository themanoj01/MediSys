package com.MediSys.MediSys.service;


import com.MediSys.MediSys.dto.AppointmentRequest;
import com.MediSys.MediSys.enums.AppointmentStatus;
import com.MediSys.MediSys.exception.BookingConflictException;
import com.MediSys.MediSys.exception.ResourceNotFoundException;
import com.MediSys.MediSys.model.*;
import com.MediSys.MediSys.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentService.class);

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private HospitalRoomRepository roomRepository;

    @Autowired
    private HospitalResourceRepository resourceRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorScheduleRepository doctorScheduleRepository;

    @Transactional
    public Appointment bookAppointment(AppointmentRequest appointmentRequest) {
        if (appointmentRequest.getAppointmentDateTime() == null) {
            throw new IllegalArgumentException("Appointment date and time are required");
        }

        Doctor doctor = doctorRepository.findById(appointmentRequest.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + appointmentRequest.getDoctorId()));

        LocalDateTime startTime = appointmentRequest.getAppointmentDateTime();
        String dayOfWeek = startTime.getDayOfWeek().toString();
        DoctorSchedule schedule = doctorScheduleRepository.findByDoctorAndDayOfWeek(doctor, dayOfWeek)
                .orElseThrow(() -> new ResourceNotFoundException("No schedule found for doctor on " + dayOfWeek));

        LocalDateTime scheduleStart = startTime.toLocalDate().atTime(schedule.getStartTime());
        LocalDateTime scheduleEnd = startTime.toLocalDate().atTime(schedule.getEndTime());
        if (startTime.isBefore(scheduleStart) || startTime.plusMinutes(schedule.getSlotDuration()).isAfter(scheduleEnd)) {
            throw new BookingConflictException("Appointment time is outside doctor's schedule");
        }

        LocalDateTime endTime = startTime.plus(schedule.getSlotDuration(), ChronoUnit.MINUTES);

        if (!checkDoctorAvailability(doctor, startTime, endTime)) {
            logger.warn("Doctor {} is not available at {}", doctor.getId(), startTime);
            throw new BookingConflictException("Doctor is already booked for the selected time");
        }

        // 2. Validate room (if specified)
        HospitalRoom room = null;
        if (appointmentRequest.getRoomId() != null) {
            room = roomRepository.findById(appointmentRequest.getRoomId())
                    .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + appointmentRequest.getRoomId()));
            if (!checkRoomAvailability(room, startTime, endTime)) {
                logger.warn("Room {} is not available at {}", room.getId(), startTime);
                throw new BookingConflictException("Room is already booked for the selected time");
            }
        }

        // 3. Validate resources (if specified)
        List<HospitalResource> resources = new ArrayList<>();
        if (appointmentRequest.getResourceIds() != null && !appointmentRequest.getResourceIds().isEmpty()) {
            resources = resourceRepository.findAllById(appointmentRequest.getResourceIds());
            if (resources.size() != appointmentRequest.getResourceIds().size()) {
                throw new ResourceNotFoundException("One or more resources not found");
            }
            if (!checkResourcesAvailability(resources, startTime, endTime)) {
                logger.warn("Resources not available at {}", startTime);
                throw new BookingConflictException("One or more resources are not available at the selected time");
            }
        }

        // 4. Create appointment
        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor);
        appointment.setPatient(patientRepository.findById(appointmentRequest.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + appointmentRequest.getPatientId())));
        appointment.setAppointmentDateTime(startTime);
        appointment.setRoom(room);
        appointment.setResources(resources);
        appointment.setStatus(AppointmentStatus.BOOKED);

        // Save appointment
        Appointment savedAppointment = appointmentRepository.save(appointment);
        logger.info("Appointment booked successfully: {}", savedAppointment.getId());

        // Update availability
        if (room != null) {
            room.setAvailable(false);
            roomRepository.save(room);
        }
        resources.forEach(res -> {
            res.setAvailable(false);
            resourceRepository.save(res);
        });

        return savedAppointment;
    }


    public List<LocalDateTime> getAvailableSlots(Long doctorId, LocalDate date) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + doctorId));

        String dayOfWeek = date.getDayOfWeek().toString();
        DoctorSchedule schedule = doctorScheduleRepository.findByDoctorAndDayOfWeek(doctor, dayOfWeek)
                .orElseThrow(() -> new ResourceNotFoundException("No schedule found for doctor on " + dayOfWeek));

        LocalDateTime startOfDay = date.atTime(schedule.getStartTime());
        LocalDateTime endOfDay = date.atTime(schedule.getEndTime());

        List<Appointment> bookedAppointments = appointmentRepository.findByDoctorAndAppointmentDateTimeBetween(
                doctor, startOfDay, endOfDay);

        List<LocalDateTime> allSlots = new ArrayList<>();
        LocalDateTime currentSlot = startOfDay;
        while (currentSlot.isBefore(endOfDay)) {
            allSlots.add(currentSlot);
            currentSlot = currentSlot.plus(schedule.getSlotDuration(), ChronoUnit.MINUTES);
        }

        List<LocalDateTime> bookedSlots = bookedAppointments.stream()
                .map(Appointment::getAppointmentDateTime)
                .toList();

        return allSlots.stream()
                .filter(slot -> !bookedSlots.contains(slot))
                .collect(Collectors.toList());
    }

    private boolean checkDoctorAvailability(Doctor doctor, LocalDateTime startTime, LocalDateTime endTime) {
        return appointmentRepository.findByDoctorAndAppointmentDateTimeBetween(doctor, startTime, endTime).isEmpty();
    }

    private boolean checkRoomAvailability(HospitalRoom room, LocalDateTime startTime, LocalDateTime endTime) {
        return appointmentRepository.findByRoomAndAppointmentDateTimeBetween(room, startTime, endTime).isEmpty();
    }

    private boolean checkResourcesAvailability(List<HospitalResource> resources, LocalDateTime startTime, LocalDateTime endTime) {
        return resources.stream().noneMatch(resource ->
                !appointmentRepository.findByResourcesAndAppointmentDateTimeBetween(resource, startTime, endTime).isEmpty());
    }
}