package com.MediSys.MediSys.repository;

import com.MediSys.MediSys.model.HospitalResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HospitalResourceRepository extends JpaRepository<HospitalResource, Long> {
    boolean existsByName(String name);
}