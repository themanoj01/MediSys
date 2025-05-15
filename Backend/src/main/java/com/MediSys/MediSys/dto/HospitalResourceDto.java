package com.MediSys.MediSys.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HospitalResourceDto {
    @NotBlank(message = "Resource name is required")
    private String name;

    private String description;
    @NotNull
    @PositiveOrZero
    private Integer quantity;

    @NotNull
    @Positive
    private Double price;
}