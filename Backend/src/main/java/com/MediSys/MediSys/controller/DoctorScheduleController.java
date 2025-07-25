package com.MediSys.MediSys.controller;

import com.MediSys.MediSys.dto.DoctorScheduleDto;
import com.MediSys.MediSys.model.DoctorSchedule;
import com.MediSys.MediSys.service.DoctorScheduleService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor-schedules")
public class DoctorScheduleController {
    private final DoctorScheduleService doctorScheduleService;

    public DoctorScheduleController(DoctorScheduleService doctorScheduleService) {
        this.doctorScheduleService = doctorScheduleService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public DoctorSchedule createSchedule(@Valid @RequestBody DoctorScheduleDto dto) {
        return doctorScheduleService.createSchedule(dto);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public List<DoctorSchedule> getAllSchedules() {
        return doctorScheduleService.getAllSchedules();
    }
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public DoctorSchedule getScheduleById(@PathVariable Long id) {
        return doctorScheduleService.getScheduleById(id);
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public List<DoctorSchedule> getSchedulesByDoctorId(@PathVariable Long doctorId) {
        return doctorScheduleService.getSchedulesByDoctorId(doctorId);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public DoctorSchedule updateSchedule(@PathVariable Long id, @Valid @RequestBody DoctorScheduleDto dto) {
        return doctorScheduleService.updateSchedule(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public void deleteSchedule(@PathVariable Long id) {
        doctorScheduleService.deleteSchedule(id);
    }
}