package com.MediSys.MediSys.controller;

import com.MediSys.MediSys.dto.HospitalResourceDto;
import com.MediSys.MediSys.model.HospitalResource;
import com.MediSys.MediSys.service.HospitalResourceService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospital-resources")
public class HospitalResourceController {
    private final HospitalResourceService hospitalResourceService;

    public HospitalResourceController(HospitalResourceService hospitalResourceService) {
        this.hospitalResourceService = hospitalResourceService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public HospitalResource createResource(@Valid @RequestBody HospitalResourceDto dto) {
        return hospitalResourceService.createResource(dto);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public HospitalResource getResourceById(@PathVariable Long id) {
        return hospitalResourceService.getResourceById(id);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<HospitalResource> getAllResources() {
        return hospitalResourceService.getAllResources();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public HospitalResource updateResource(@PathVariable Long id, @Valid @RequestBody HospitalResourceDto dto) {
        return hospitalResourceService.updateResource(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteResource(@PathVariable Long id) {
        hospitalResourceService.deleteResource(id);
    }
}