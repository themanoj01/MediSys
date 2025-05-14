package com.MediSys.MediSys.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class RoomBookingRequest {
    @NotNull(message = "Room ID is required")
    private Long roomId;

    private Long appointmentId; //optional

    @NotNull(message = "Start date and time are required")
    private LocalDateTime startDateTime;

    @NotNull(message = "End date and time are required")
    private LocalDateTime endDateTime;
}