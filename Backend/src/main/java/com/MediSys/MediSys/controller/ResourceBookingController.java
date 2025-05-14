package com.MediSys.MediSys.controller;

import com.MediSys.MediSys.dto.ResourceBookingRequest;
import com.MediSys.MediSys.model.ResourceBooking;
import com.MediSys.MediSys.service.ResourceBookingService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/resource-bookings")
public class ResourceBookingController {
    private final ResourceBookingService resourceBookingService;

    public ResourceBookingController(ResourceBookingService resourceBookingService) {
        this.resourceBookingService = resourceBookingService;
    }

    @PostMapping("/book")
    public ResourceBooking bookResource(@Valid @RequestBody ResourceBookingRequest request) {
        return resourceBookingService.bookResource(request);
    }

    @GetMapping("/available-slots")
    public List<LocalDateTime> getAvailableResourceSlots(
            @RequestParam Long resourceId,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        return resourceBookingService.getAvailableResourceSlots(resourceId, start, end);
    }
}