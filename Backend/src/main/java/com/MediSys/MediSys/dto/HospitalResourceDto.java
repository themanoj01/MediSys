package com.MediSys.MediSys.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HospitalResourceDto {
    @NotBlank(message = "Resource name is required")
    private String name;

    private String description;
}