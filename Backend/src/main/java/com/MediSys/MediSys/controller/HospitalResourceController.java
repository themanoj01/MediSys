package com.MediSys.MediSys.controller;

import com.MediSys.MediSys.model.HospitalResource;
import com.MediSys.MediSys.service.HospitalResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class HospitalResourceController {

    @Autowired
    private HospitalResourceService resourceService;

    @GetMapping
    public List<HospitalResource> getAllResources() {
        return resourceService.getAllResources();
    }

    @PostMapping
    public HospitalResource createResource(@RequestBody HospitalResource resource) {
        return resourceService.saveResource(resource);
    }

    @PatchMapping("/{id}/availability")
    public void updateAvailability(@PathVariable Long id, @RequestParam boolean available) {
        resourceService.updateAvailability(id, available);
    }
}

