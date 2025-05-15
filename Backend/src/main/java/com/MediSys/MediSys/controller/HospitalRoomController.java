package com.MediSys.MediSys.controller;

import com.MediSys.MediSys.dto.HospitalRoomDto;
import com.MediSys.MediSys.model.HospitalRoom;
import com.MediSys.MediSys.service.HospitalRoomService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class HospitalRoomController {
    private final HospitalRoomService hospitalRoomService;

    public HospitalRoomController(HospitalRoomService hospitalRoomService) {
        this.hospitalRoomService = hospitalRoomService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public HospitalRoom createRoom(@Valid @RequestPart ("room") HospitalRoomDto dto,
                                   @RequestPart(value="image", required = false) MultipartFile image) {
        return hospitalRoomService.createRoom(dto, image);
    }


    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<HospitalRoom> getAllRooms() {
        return hospitalRoomService.getAllRooms();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HospitalRoom> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(hospitalRoomService.getRoomById(id));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HospitalRoom> updateRoom(
            @PathVariable Long id,
            @RequestPart("room") @Valid HospitalRoomDto roomDto,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        return ResponseEntity.ok(hospitalRoomService.updateRoom(id, roomDto, image));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        hospitalRoomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
}