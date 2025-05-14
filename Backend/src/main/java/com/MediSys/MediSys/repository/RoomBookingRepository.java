package com.MediSys.MediSys.repository;

import com.MediSys.MediSys.enums.BookingStatus;
import com.MediSys.MediSys.model.HospitalRoom;
import com.MediSys.MediSys.model.RoomBooking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface RoomBookingRepository extends JpaRepository<RoomBooking, Long> {
    List<RoomBooking> findByRoomAndStartDateTimeBetweenAndStatus(HospitalRoom room, LocalDateTime start, LocalDateTime end, BookingStatus bookingStatus);
}
