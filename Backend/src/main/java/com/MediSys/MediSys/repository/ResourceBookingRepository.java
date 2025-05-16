package com.MediSys.MediSys.repository;

import com.MediSys.MediSys.enums.BookingStatus;
import com.MediSys.MediSys.model.HospitalResource;
import com.MediSys.MediSys.model.ResourceBooking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ResourceBookingRepository extends JpaRepository<ResourceBooking, Long> {
    List<ResourceBooking> findByResourceAndStartDateTimeBetweenAndStatus(HospitalResource resource, LocalDateTime start, LocalDateTime end, BookingStatus bookingStatus);

    List<ResourceBooking> findByEndDateTimeBeforeAndStatus(LocalDateTime now, BookingStatus bookingStatus);
}
