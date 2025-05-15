package com.MediSys.MediSys.service;

import com.MediSys.MediSys.dto.AppointmentRequest;
import com.MediSys.MediSys.enums.AppointmentStatus;
import com.MediSys.MediSys.exception.BookingConflictException;
import com.MediSys.MediSys.exception.ResourceNotFoundException;
import com.MediSys.MediSys.model.Appointment;
import com.MediSys.MediSys.model.Doctor;
import com.MediSys.MediSys.model.DoctorSchedule;
import com.MediSys.MediSys.model.Patient;
import com.MediSys.MediSys.repository.AppointmentRepository;
import com.MediSys.MediSys.repository.DoctorRepository;
import com.MediSys.MediSys.repository.DoctorScheduleRepository;
import com.MediSys.MediSys.repository.PatientRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentService.class);

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorScheduleRepository doctorScheduleRepository;

    public AppointmentService(DoctorRepository doctorRepository,
                              PatientRepository patientRepository,
                              AppointmentRepository appointmentRepository,
                              DoctorScheduleRepository doctorScheduleRepository) {
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.doctorScheduleRepository = doctorScheduleRepository;
    }

    @Transactional
    public Appointment bookAppointment(AppointmentRequest appointmentRequest) {
        if (appointmentRequest.getAppointmentDateTime() == null) {
            throw new IllegalArgumentException("Appointment date and time are required");
        }

        Doctor doctor = doctorRepository.findById(appointmentRequest.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + appointmentRequest.getDoctorId()));
        if (!doctor.isActive()) {
            throw new BookingConflictException("Doctor is not active");
        }

        Patient patient = patientRepository.findById(appointmentRequest.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + appointmentRequest.getPatientId()));
        if (!patient.isActive()) {
            throw new BookingConflictException("Patient is not active");
        }

        LocalDateTime startTime = appointmentRequest.getAppointmentDateTime();
        String dayOfWeek = startTime.getDayOfWeek().toString();
        DoctorSchedule schedule = doctorScheduleRepository.findByDoctorAndDayOfWeek(doctor, dayOfWeek)
                .orElseThrow(() -> new ResourceNotFoundException("No schedule found for doctor on " + dayOfWeek));

        LocalDateTime scheduleStart = startTime.toLocalDate().atTime(schedule.getStartTime());
        LocalDateTime scheduleEnd = startTime.toLocalDate().atTime(schedule.getEndTime());
        long minutesFromStart = java.time.temporal.ChronoUnit.MINUTES.between(scheduleStart, startTime);
        if (minutesFromStart < 0 || startTime.plusMinutes(schedule.getSlotDuration()).isAfter(scheduleEnd) ||
                minutesFromStart % schedule.getSlotDuration() != 0) {
            throw new BookingConflictException("Appointment time does not align with doctor's schedule slots");
        }

        LocalDateTime endTime = startTime.plusMinutes(schedule.getSlotDuration());
        if (!checkDoctorAvailability(doctor, startTime, endTime)) {
            logger.warn("Doctor {} is not available at {}", doctor.getId(), startTime);
            throw new BookingConflictException("Doctor is already booked for the selected time");
        }

        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        appointment.setAppointmentDateTime(startTime);
        appointment.setStatus(AppointmentStatus.SCHEDULED);

        Appointment savedAppointment = appointmentRepository.save(appointment);
        logger.info("Appointment booked successfully: {}", savedAppointment.getId());
        return savedAppointment;
    }

    public List<LocalDateTime> getAvailableSlots(Long doctorId, LocalDate date) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + doctorId));
        if (!doctor.isActive()) {
            throw new BookingConflictException("Doctor is not active");
        }

        String dayOfWeek = date.getDayOfWeek().toString();
        DoctorSchedule schedule = doctorScheduleRepository.findByDoctorAndDayOfWeek(doctor, dayOfWeek)
                .orElseThrow(() -> new ResourceNotFoundException("No schedule found for doctor on " + dayOfWeek));

        LocalDateTime startOfDay = date.atTime(schedule.getStartTime());
        LocalDateTime endOfDay = date.atTime(schedule.getEndTime());
        List<LocalDateTime> allSlots = new ArrayList<>();
        LocalDateTime currentSlot = startOfDay;
        while (currentSlot.isBefore(endOfDay)) {
            allSlots.add(currentSlot);
            currentSlot = currentSlot.plusMinutes(schedule.getSlotDuration());
        }

        List<Appointment> bookedAppointments = appointmentRepository.findByDoctorIdAndAppointmentDateTimeBetweenAndStatusIn(
                doctorId, startOfDay, endOfDay, List.of(AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED));

        List<LocalDateTime> bookedSlots = bookedAppointments.stream()
                .map(Appointment::getAppointmentDateTime)
                .toList();
        List<LocalDateTime> availableSlots = allSlots.stream()
                .filter(slot -> !bookedSlots.contains(slot))
                .toList();

        LocalDateTime now = LocalDateTime.now();
        return availableSlots.stream()
                .filter(slot -> slot.isAfter(now))
                .sorted()
                .collect(Collectors.toList());
    }

    public Appointment getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + id));
        logger.info("Retrieved appointment: {}", id);
        return appointment;
    }

    public List<Appointment> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        logger.info("Retrieved {} appointments", appointments.size());
        return appointments;
    }

    @Transactional
    public Appointment updateAppointment(Long id, AppointmentRequest request) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + id));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + request.getDoctorId()));
        if (!doctor.isActive()) {
            throw new BookingConflictException("Doctor is not active");
        }

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + request.getPatientId()));
        if (!patient.isActive()) {
            throw new BookingConflictException("Patient is not active");
        }

        LocalDateTime startTime = request.getAppointmentDateTime();
        String dayOfWeek = startTime.getDayOfWeek().toString();
        DoctorSchedule schedule = doctorScheduleRepository.findByDoctorAndDayOfWeek(doctor, dayOfWeek)
                .orElseThrow(() -> new ResourceNotFoundException("No schedule found for doctor on " + dayOfWeek));

        LocalDateTime scheduleStart = startTime.toLocalDate().atTime(schedule.getStartTime());
        LocalDateTime scheduleEnd = startTime.toLocalDate().atTime(schedule.getEndTime());
        long minutesFromStart = java.time.temporal.ChronoUnit.MINUTES.between(scheduleStart, startTime);
        if (minutesFromStart < 0 || startTime.plusMinutes(schedule.getSlotDuration()).isAfter(scheduleEnd) ||
                minutesFromStart % schedule.getSlotDuration() != 0) {
            throw new BookingConflictException("Appointment time does not align with doctor's schedule slots");
        }

        LocalDateTime endTime = startTime.plusMinutes(schedule.getSlotDuration());
        List<Appointment> conflictingAppointments = appointmentRepository.findByDoctorIdAndAppointmentDateTimeBetweenAndStatusIn(
                doctor.getId(), startTime, endTime, List.of(AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED));
        if (!conflictingAppointments.isEmpty() && !conflictingAppointments.get(0).getId().equals(id)) {
            logger.warn("Doctor {} is not available at {}", doctor.getId(), startTime);
            throw new BookingConflictException("Doctor is already booked for the selected time");
        }

        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        appointment.setAppointmentDateTime(startTime);
        appointment.setStatus(AppointmentStatus.SCHEDULED);

        Appointment updatedAppointment = appointmentRepository.save(appointment);
        logger.info("Appointment updated successfully: {}", id);
        return updatedAppointment;
    }

    @Transactional
    public void cancelAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + id));
        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
        logger.info("Appointment cancelled successfully: {}", id);
    }

    private boolean checkDoctorAvailability(Doctor doctor, LocalDateTime startTime, LocalDateTime endTime) {
        List<Appointment> conflictingAppointments = appointmentRepository
                .findByDoctorAndAppointmentDateTimeBetween(doctor, startTime, endTime);
        return conflictingAppointments.isEmpty();
    }

    public List<Appointment> findByDoctor(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow(()-> new RuntimeException("Doctor not found"));
        List<Appointment> appointments = appointmentRepository.findByDoctor(doctor);
        return appointments;
    }
}