package com.MediSys.MediSys.service;

import com.MediSys.MediSys.dto.HospitalResourceDto;
import com.MediSys.MediSys.exception.ResourceNotFoundException;
import com.MediSys.MediSys.model.HospitalResource;
import com.MediSys.MediSys.repository.HospitalResourceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class HospitalResourceService {
    private static final Logger logger = LoggerFactory.getLogger(HospitalResourceService.class);

    private final HospitalResourceRepository hospitalResourceRepository;

    public HospitalResourceService(HospitalResourceRepository hospitalResourceRepository) {
        this.hospitalResourceRepository = hospitalResourceRepository;
    }

    @Transactional
    public HospitalResource createResource(HospitalResourceDto dto) {
        if (hospitalResourceRepository.existsByName(dto.getName())) {
            logger.warn("Attempt to create resource with existing name: {}", dto.getName());
            throw new IllegalArgumentException("Resource name already exists");
        }

        HospitalResource resource = new HospitalResource();
        resource.setName(dto.getName());
        resource.setDescription(dto.getDescription());

        HospitalResource savedResource = hospitalResourceRepository.save(resource);
        logger.info("Resource created successfully: {}", savedResource.getId());
        return savedResource;
    }

    public HospitalResource getResourceById(Long id) {
        HospitalResource resource = hospitalResourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + id));
        logger.info("Retrieved resource: {}", id);
        return resource;
    }

    public List<HospitalResource> getAllResources() {
        List<HospitalResource> resources = hospitalResourceRepository.findAll();
        logger.info("Retrieved {} resources", resources.size());
        return resources;
    }

    @Transactional
    public HospitalResource updateResource(Long id, HospitalResourceDto dto) {
        HospitalResource resource = hospitalResourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + id));

        if (!resource.getName().equals(dto.getName()) &&
                hospitalResourceRepository.existsByName(dto.getName())) {
            logger.warn("Attempt to update resource {} with existing name: {}", id, dto.getName());
            throw new IllegalArgumentException("Resource name already exists");
        }

        resource.setName(dto.getName());
        resource.setDescription(dto.getDescription());

        HospitalResource updatedResource = hospitalResourceRepository.save(resource);
        logger.info("Resource updated successfully: {}", id);
        return updatedResource;
    }

    @Transactional
    public void deleteResource(Long id) {
        if (!hospitalResourceRepository.existsById(id)) {
            logger.warn("Attempt to delete non-existent resource: {}", id);
            throw new ResourceNotFoundException("Resource not found with ID: " + id);
        }
        hospitalResourceRepository.deleteById(id);
        logger.info("Resource deleted successfully: {}", id);
    }
}