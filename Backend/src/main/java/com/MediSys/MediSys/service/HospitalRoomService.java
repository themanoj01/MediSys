package com.MediSys.MediSys.service;

import com.MediSys.MediSys.model.HospitalRoom;
import com.MediSys.MediSys.repository.HospitalRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HospitalRoomService {

    @Autowired
    private HospitalRoomRepository roomRepository;

    public List<HospitalRoom> getAllRooms() {
        return roomRepository.findAll();
    }

    public HospitalRoom getRoomById(Long id) {
        return roomRepository.findById(id).orElse(null);
    }

    public HospitalRoom saveRoom(HospitalRoom room) {
        return roomRepository.save(room);
    }

    public void updateAvailability(Long id, boolean available) {
        HospitalRoom room = getRoomById(id);
        if (room != null) {
            room.setAvailable(available);
            roomRepository.save(room);
        }
    }
}
