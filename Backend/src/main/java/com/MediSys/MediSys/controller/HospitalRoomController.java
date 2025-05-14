package com.MediSys.MediSys.controller;

import com.MediSys.MediSys.dto.HospitalRoomDto;
import com.MediSys.MediSys.model.HospitalRoom;
import com.MediSys.MediSys.service.HospitalRoomService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospital-rooms")
public class HospitalRoomController {
    private final HospitalRoomService hospitalRoomService;

    public HospitalRoomController(HospitalRoomService hospitalRoomService) {
        this.hospitalRoomService = hospitalRoomService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public HospitalRoom createRoom(@Valid @RequestBody HospitalRoomDto dto) {
        return hospitalRoomService.createRoom(dto);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public HospitalRoom getRoomById(@PathVariable Long id) {
        return hospitalRoomService.getRoomById(id);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<HospitalRoom> getAllRooms() {
        return hospitalRoomService.getAllRooms();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public HospitalRoom updateRoom(@PathVariable Long id, @Valid @RequestBody HospitalRoomDto dto) {
        return hospitalRoomService.updateRoom(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteRoom(@PathVariable Long id) {
        hospitalRoomService.deleteRoom(id);
    }
}