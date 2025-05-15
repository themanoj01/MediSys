package com.MediSys.MediSys.controller;

import com.MediSys.MediSys.dto.HospitalResourceDto;
import com.MediSys.MediSys.model.HospitalResource;
import com.MediSys.MediSys.service.HospitalResourceService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class HospitalResourceController {
    private final HospitalResourceService hospitalResourceService;

    public HospitalResourceController(HospitalResourceService hospitalResourceService) {
        this.hospitalResourceService = hospitalResourceService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public HospitalResource createResource(
            @RequestPart("resource") @Valid HospitalResourceDto resourceDto,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        return hospitalResourceService.createResource(resourceDto, image);
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

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HospitalResource> updateResource(
            @PathVariable Long id,
            @RequestPart("resource") @Valid HospitalResourceDto resourceDto,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        return ResponseEntity.ok(hospitalResourceService.updateResource(id, resourceDto, image));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteResource(@PathVariable Long id) {
        hospitalResourceService.deleteResource(id);
    }
}