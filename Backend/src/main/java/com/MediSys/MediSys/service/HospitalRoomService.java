package com.MediSys.MediSys.service;

import com.MediSys.MediSys.dto.HospitalRoomDto;
import com.MediSys.MediSys.exception.ResourceNotFoundException;
import com.MediSys.MediSys.model.HospitalRoom;
import com.MediSys.MediSys.repository.HospitalRoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@Service
public class HospitalRoomService {
    private static final Logger logger = LoggerFactory.getLogger(HospitalRoomService.class);

    private final HospitalRoomRepository hospitalRoomRepository;
    private final FileStorageService fileStorageService;

    public HospitalRoomService(HospitalRoomRepository hospitalRoomRepository, FileStorageService fileStorageService, FileStorageService fileStorageService1) {
        this.hospitalRoomRepository = hospitalRoomRepository;
        this.fileStorageService = fileStorageService1;
    }

    @Transactional
    public HospitalRoom createRoom(HospitalRoomDto dto, MultipartFile image) throws ResourceNotFoundException {
        if (hospitalRoomRepository.existsByRoomNumber(dto.getRoomNumber())) {
            logger.warn("Attempt to create room with existing room number: {}", dto.getRoomNumber());
            throw new IllegalArgumentException("Room number already exists");
        }


        HospitalRoom room = new HospitalRoom();
        room.setRoomNumber(dto.getRoomNumber());
        room.setType(dto.getType());
        room.setPrice(dto.getPrice());

        if (image != null && !image.isEmpty()) {
            String imagePath = fileStorageService.storeFile(image);
            room.setRoomPicture(imagePath);
        }
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
    public HospitalRoom updateRoom(Long id, HospitalRoomDto dto, MultipartFile image){
        HospitalRoom room = hospitalRoomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));

        if (!room.getRoomNumber().equals(dto.getRoomNumber()) &&
                hospitalRoomRepository.existsByRoomNumber(dto.getRoomNumber())) {
            logger.warn("Attempt to update room {} with existing room number: {}", id, dto.getRoomNumber());
            throw new IllegalArgumentException("Room number already exists");
        }

        room.setRoomNumber(dto.getRoomNumber());
        room.setType(dto.getType());
        room.setPrice(dto.getPrice());

        if (image != null && !image.isEmpty()) {
            if (room.getRoomPicture() != null) {
                try {
                    Files.deleteIfExists(Paths.get("uploads/" + room.getRoomPicture().substring("/uploads/".length())));
                } catch (Exception e) {
                    throw new RuntimeException("Error deleting image " + room.getRoomPicture());
                }
            }
            String imageUrl = fileStorageService.storeFile(image);
            room.setRoomPicture(imageUrl);
        }

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