package com.MediSys.MediSys.config;

import com.MediSys.MediSys.enums.BookingStatus;
import com.MediSys.MediSys.model.HospitalResource;
import com.MediSys.MediSys.model.ResourceBooking;
import com.MediSys.MediSys.repository.HospitalResourceRepository;
import com.MediSys.MediSys.repository.ResourceBookingRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class ResourceBookingScheduler {
    private final ResourceBookingRepository bookingRepository;
    private final HospitalResourceRepository resourceRepository;

    public ResourceBookingScheduler(
            ResourceBookingRepository bookingRepository,
            HospitalResourceRepository resourceRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
    }

    @Scheduled(fixedRate = 3600000) // Run every hour
    public void restoreExpiredBookings() {
        LocalDateTime now = LocalDateTime.now();
        List<ResourceBooking> expiredBookings = bookingRepository.findByEndDateTimeBeforeAndStatus(
                now, BookingStatus.BOOKED
        );
        for (ResourceBooking booking : expiredBookings) {
            booking.setStatus(BookingStatus.COMPLETED);
            HospitalResource resource = booking.getResource();
            resource.setQuantity(resource.getQuantity() + 1);
            resourceRepository.save(resource);
            bookingRepository.save(booking);
        }
    }
}