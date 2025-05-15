package com.MediSys.MediSys.service;

import com.MediSys.MediSys.dto.RoomBookingRequest;
import com.MediSys.MediSys.enums.BookingStatus;
import com.MediSys.MediSys.exception.BookingConflictException;
import com.MediSys.MediSys.exception.ResourceNotFoundException;
import com.MediSys.MediSys.model.Appointment;
import com.MediSys.MediSys.model.HospitalRoom;
import com.MediSys.MediSys.model.RoomBooking;
import com.MediSys.MediSys.auth.model.User;
import com.MediSys.MediSys.repository.AppointmentRepository;
import com.MediSys.MediSys.repository.HospitalRoomRepository;
import com.MediSys.MediSys.repository.RoomBookingRepository;
import com.MediSys.MediSys.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RoomBookingService {
    private static final Logger logger = LoggerFactory.getLogger(RoomBookingService.class);

    private final RoomBookingRepository roomBookingRepository;
    private final HospitalRoomRepository hospitalRoomRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public RoomBookingService(RoomBookingRepository roomBookingRepository,
                              HospitalRoomRepository hospitalRoomRepository,
                              AppointmentRepository appointmentRepository,
                              UserRepository userRepository) {
        this.roomBookingRepository = roomBookingRepository;
        this.hospitalRoomRepository = hospitalRoomRepository;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public RoomBooking bookRoom(RoomBookingRequest request) {
        if (request.getStartDateTime() == null || request.getEndDateTime() == null) {
            throw new IllegalArgumentException("Start and end date times are required");
        }
        if (request.getStartDateTime().isAfter(request.getEndDateTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + username));

        HospitalRoom room = hospitalRoomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + request.getRoomId()));

        if (!checkRoomAvailability(room, request.getStartDateTime(), request.getEndDateTime())) {
            logger.warn("Room {} is not available from {} to {}", room.getId(), request.getStartDateTime(), request.getEndDateTime());
            throw new RuntimeException("Room is already booked for the selected time");
        }

        RoomBooking booking = new RoomBooking();
        booking.setRoom(room);
        booking.setUser(user);
        booking.setStartDateTime(request.getStartDateTime());
        booking.setEndDateTime(request.getEndDateTime());
        booking.setStatus(BookingStatus.BOOKED);

        if (request.getAppointmentId() != null) {
            Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + request.getAppointmentId()));
            booking.setAppointment(appointment);
        }

        RoomBooking savedBooking = roomBookingRepository.save(booking);
        logger.info("Room booking created successfully: {} by user: {}", savedBooking.getId(), user.getId());
        return savedBooking;
    }

    public List<LocalDateTime> getAvailableRoomSlots(Long roomId, LocalDateTime start, LocalDateTime end) {
        HospitalRoom room = hospitalRoomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + roomId));

        List<RoomBooking> bookings = roomBookingRepository.findByRoomAndStartDateTimeBetweenAndStatus(room, start, end, BookingStatus.BOOKED);
        return bookings.stream().map(RoomBooking::getStartDateTime).toList();
    }

    private boolean checkRoomAvailability(HospitalRoom room, LocalDateTime start, LocalDateTime end) {
        return roomBookingRepository.findByRoomAndStartDateTimeBetweenAndStatus(room, start, end, BookingStatus.BOOKED).isEmpty();
    }

    public List<RoomBooking> getAllRoomBookings() {
        return roomBookingRepository.findAll();
    }
}