package com.MediSys.MediSys.controller;

import com.MediSys.MediSys.model.HospitalRoom;
import com.MediSys.MediSys.service.HospitalRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class HospitalRoomController {

    @Autowired
    private HospitalRoomService roomService;

    @GetMapping
    public List<HospitalRoom> getAllRooms() {
        return roomService.getAllRooms();
    }

    @PostMapping
    public HospitalRoom createRoom(@RequestBody HospitalRoom room) {
        return roomService.saveRoom(room);
    }

    @PatchMapping("/{id}/availability")
    public void updateRoomAvailability(@PathVariable Long id, @RequestParam boolean available) {
        roomService.updateAvailability(id, available);
    }
}
