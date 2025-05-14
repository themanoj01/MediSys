package com.MediSys.MediSys.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ResourceBookingRequest {
    @NotNull(message = "Resource ID is required")
    private Long resourceId;

    private Long appointmentId; //optional

    @NotNull(message = "Start date and time are required")
    private LocalDateTime startDateTime;

    @NotNull(message = "End date and time are required")
    private LocalDateTime endDateTime;
}