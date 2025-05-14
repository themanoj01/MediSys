package com.MediSys.MediSys.repository;

import com.MediSys.MediSys.model.HospitalRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HospitalRoomRepository extends JpaRepository<HospitalRoom, Long> {
    boolean existsByRoomNumber(String roomNumber);
}