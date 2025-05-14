package com.MediSys.MediSys.service;

import com.MediSys.MediSys.dto.HospitalRoomDto;
import com.MediSys.MediSys.exception.ResourceNotFoundException;
import com.MediSys.MediSys.model.HospitalRoom;
import com.MediSys.MediSys.repository.HospitalRoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class HospitalRoomService {
    private static final Logger logger = LoggerFactory.getLogger(HospitalRoomService.class);

    private final HospitalRoomRepository hospitalRoomRepository;

    public HospitalRoomService(HospitalRoomRepository hospitalRoomRepository) {
        this.hospitalRoomRepository = hospitalRoomRepository;
    }

    @Transactional
    public HospitalRoom createRoom(HospitalRoomDto dto) {
        if (hospitalRoomRepository.existsByRoomNumber(dto.getRoomNumber())) {
            logger.warn("Attempt to create room with existing room number: {}", dto.getRoomNumber());
            throw new IllegalArgumentException("Room number already exists");
        }

        HospitalRoom room = new HospitalRoom();
        room.setRoomNumber(dto.getRoomNumber());
        room.setType(dto.getType());

        HospitalRoom savedRoom = hospitalRoomRepository.save(room);
        logger.info("Room created successfully: {}", savedRoom.getId());
        return savedRoom;
    }

    public HospitalRoom getRoomById(Long id) {
        HospitalRoom room = hospitalRoomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));
        logger.info("Retrieved room: {}", id);
        return room;
    }

    public List<HospitalRoom> getAllRooms() {
        List<HospitalRoom> rooms = hospitalRoomRepository.findAll();
        logger.info("Retrieved {} rooms", rooms.size());
        return rooms;
    }

    @Transactional
    public HospitalRoom updateRoom(Long id, HospitalRoomDto dto) {
        HospitalRoom room = hospitalRoomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));

        if (!room.getRoomNumber().equals(dto.getRoomNumber()) &&
                hospitalRoomRepository.existsByRoomNumber(dto.getRoomNumber())) {
            logger.warn("Attempt to update room {} with existing room number: {}", id, dto.getRoomNumber());
            throw new IllegalArgumentException("Room number already exists");
        }

        room.setRoomNumber(dto.getRoomNumber());
        room.setType(dto.getType());

        HospitalRoom updatedRoom = hospitalRoomRepository.save(room);
        logger.info("Room updated successfully: {}", id);
        return updatedRoom;
    }

    @Transactional
    public void deleteRoom(Long id) {
        if (!hospitalRoomRepository.existsById(id)) {
            logger.warn("Attempt to delete non-existent room: {}", id);
            throw new ResourceNotFoundException("Room not found with ID: " + id);
        }
        hospitalRoomRepository.deleteById(id);
        logger.info("Room deleted successfully: {}", id);
    }
}