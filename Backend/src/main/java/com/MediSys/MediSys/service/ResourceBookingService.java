package com.MediSys.MediSys.service;

import com.MediSys.MediSys.dto.ResourceBookingRequest;
import com.MediSys.MediSys.enums.BookingStatus;
import com.MediSys.MediSys.exception.BookingConflictException;
import com.MediSys.MediSys.exception.ResourceNotFoundException;
import com.MediSys.MediSys.model.Appointment;
import com.MediSys.MediSys.model.HospitalResource;
import com.MediSys.MediSys.model.Patient;
import com.MediSys.MediSys.model.ResourceBooking;
import com.MediSys.MediSys.auth.model.User;
import com.MediSys.MediSys.repository.AppointmentRepository;
import com.MediSys.MediSys.repository.HospitalResourceRepository;
import com.MediSys.MediSys.repository.PatientRepository;
import com.MediSys.MediSys.repository.ResourceBookingRepository;
import com.MediSys.MediSys.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ResourceBookingService {
    private static final Logger logger = LoggerFactory.getLogger(ResourceBookingService.class);

    private final ResourceBookingRepository resourceBookingRepository;
    private final HospitalResourceRepository hospitalResourceRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;

    public ResourceBookingService(ResourceBookingRepository resourceBookingRepository,
                                  HospitalResourceRepository hospitalResourceRepository,
                                  AppointmentRepository appointmentRepository,
                                  UserRepository userRepository,
                                  PatientRepository patientRepository) {
        this.resourceBookingRepository = resourceBookingRepository;
        this.hospitalResourceRepository = hospitalResourceRepository;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
    }

    @Transactional
    public ResourceBooking bookResource(ResourceBookingRequest request) {
        if (request.getStartDateTime() == null || request.getEndDateTime() == null) {
            throw new IllegalArgumentException("Start and end date times are required");
        }
        if (request.getStartDateTime().isAfter(request.getEndDateTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + username));

        HospitalResource resource = hospitalResourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + request.getResourceId()));

        if (resource.getQuantity() <= 0) {
            throw new RuntimeException("Resource is out of stock");
        }
        if (!checkResourceAvailability(resource.getId(), request.getStartDateTime(), request.getEndDateTime())) {
            logger.warn("Resource {} is not available from {} to {}", resource.getId(), request.getStartDateTime(), request.getEndDateTime());
            throw new RuntimeException("Resource is already booked for the selected time");
        }

        resource.setQuantity(resource.getQuantity() - 1);
        hospitalResourceRepository.save(resource);

        ResourceBooking booking = new ResourceBooking();
        booking.setResource(resource);
        booking.setUser(user);
        booking.setStartDateTime(request.getStartDateTime());
        booking.setEndDateTime(request.getEndDateTime());
        booking.setStatus(BookingStatus.BOOKED);

        if (request.getAppointmentId() != null) {
            Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + request.getAppointmentId()));
            booking.setAppointment(appointment);
        }

        ResourceBooking savedBooking = resourceBookingRepository.save(booking);
        logger.info("Resource booking created successfully: {} by user: {}", savedBooking.getId(), user.getId());
        return savedBooking;
    }

    public List<LocalDateTime> getAvailableResourceSlots(Long resourceId, LocalDateTime start, LocalDateTime end) {
        HospitalResource resource = hospitalResourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + resourceId));

        List<ResourceBooking> bookings = resourceBookingRepository.findByResourceAndStartDateTimeBetweenAndStatus(resource, start, end, BookingStatus.BOOKED);
        return bookings.stream().map(ResourceBooking::getStartDateTime).toList();
    }

    public boolean checkResourceAvailability(Long resourceId, LocalDateTime start, LocalDateTime end) {
        HospitalResource resource = hospitalResourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + resourceId));
        if (resource.getQuantity() <= 0) return false;
        return resourceBookingRepository.findByResourceAndStartDateTimeBetweenAndStatus(resource, start, end, BookingStatus.BOOKED).isEmpty();
    }

    public List<ResourceBooking> getAllResourceBookings() {
        return resourceBookingRepository.findAll();
    }

    public void cancelResourceBooking(Long id) {
        ResourceBooking booking = resourceBookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource booking not found"));
        booking.setStatus(BookingStatus.CANCELLED);
        HospitalResource resource = booking.getResource();
        resource.setQuantity(resource.getQuantity() + 1);
        hospitalResourceRepository.save(resource);
        resourceBookingRepository.save(booking);
    }
}