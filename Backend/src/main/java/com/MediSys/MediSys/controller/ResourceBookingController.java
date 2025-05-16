package com.MediSys.MediSys.controller;

import com.MediSys.MediSys.dto.ResourceBookingRequest;
import com.MediSys.MediSys.model.ResourceBooking;
import com.MediSys.MediSys.service.ResourceBookingService;
import jakarta.annotation.security.PermitAll;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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

    @GetMapping()
    public List<ResourceBooking> getAllResourceBookings() {
        return resourceBookingService.getAllResourceBookings();
    }
    @GetMapping("/check-availability")
    @PermitAll
    public ResponseEntity<Boolean> checkRoomAvailability(
            @RequestParam Long resourceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        boolean isAvailable = resourceBookingService.checkResourceAvailability(resourceId, start, end);
        return ResponseEntity.ok(isAvailable);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelResourceBooking(@PathVariable Long id) {
        resourceBookingService.cancelResourceBooking(id);
        return ResponseEntity.noContent().build();
    }
}