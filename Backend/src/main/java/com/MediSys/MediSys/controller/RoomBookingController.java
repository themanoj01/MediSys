package com.MediSys.MediSys.controller;

import com.MediSys.MediSys.dto.RoomBookingRequest;
import com.MediSys.MediSys.model.RoomBooking;
import com.MediSys.MediSys.service.RoomBookingService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/room-bookings")
@CrossOrigin
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
    public List<LocalDateTime> getAvailableRoomSlots(
            @RequestParam Long roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return roomBookingService.getAvailableRoomSlots(roomId, start, end);
    }
}