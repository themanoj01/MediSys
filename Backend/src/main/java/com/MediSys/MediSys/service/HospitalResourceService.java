package com.MediSys.MediSys.service;

import com.MediSys.MediSys.model.HospitalResource;
import com.MediSys.MediSys.repository.HospitalResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HospitalResourceService {

    @Autowired
    private HospitalResourceRepository resourceRepository;

    public List<HospitalResource> getAllResources() {
        return resourceRepository.findAll();
    }

    public HospitalResource getResourceById(Long id) {
        return resourceRepository.findById(id).orElse(null);
    }

    public HospitalResource saveResource(HospitalResource resource) {
        return resourceRepository.save(resource);
    }

    public void updateAvailability(Long id, boolean available) {
        HospitalResource res = getResourceById(id);
        if (res != null) {
            res.setAvailable(available);
            resourceRepository.save(res);
        }
    }
}

