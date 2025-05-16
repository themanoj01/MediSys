package com.MediSys.MediSys.controller;

import com.MediSys.MediSys.dto.RoomBookingRequest;
import com.MediSys.MediSys.model.RoomBooking;
import com.MediSys.MediSys.service.RoomBookingService;
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
@RequestMapping("/api/room-bookings")
public class RoomBookingController {
    private final RoomBookingService roomBookingService;

    public RoomBookingController(RoomBookingService roomBookingService) {
        this.roomBookingService = roomBookingService;
    }

    @PostMapping("/book")
    public RoomBooking bookRoom(@Valid @RequestBody RoomBookingRequest request) {
        return roomBookingService.bookRoom(request);
    }

    @GetMapping("/available-slots")
    @PermitAll
    public List<LocalDateTime> getAvailableRoomSlots(
            @RequestParam Long roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return roomBookingService.getAvailableRoomSlots(roomId, start, end);
    }

    @GetMapping("/check-availability")
    @PermitAll
    public ResponseEntity<Boolean> checkRoomAvailability(
            @RequestParam Long roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        boolean isAvailable = roomBookingService.checkRoomAvailability(roomId, start, end);
        return ResponseEntity.ok(isAvailable);
    }

    @GetMapping
    public List<RoomBooking> getRoomBookings(){
        return roomBookingService.getAllRoomBookings();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelRoomBooking(@PathVariable Long id) {
        roomBookingService.cancelRoomBooking(id);
        return ResponseEntity.noContent().build();
    }

}