package com.MediSys.MediSys.controller;

import com.MediSys.MediSys.dto.HospitalResourceDto;
import com.MediSys.MediSys.model.HospitalResource;
import com.MediSys.MediSys.service.HospitalResourceService;
import com.MediSys.MediSys.service.ResourceBookingService;
import jakarta.annotation.security.PermitAll;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class HospitalResourceController {
    private final HospitalResourceService hospitalResourceService;
    private final ResourceBookingService resourceBookingService;

    public HospitalResourceController(HospitalResourceService hospitalResourceService, ResourceBookingService resourceBookingService) {
        this.hospitalResourceService = hospitalResourceService;
        this.resourceBookingService = resourceBookingService;
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