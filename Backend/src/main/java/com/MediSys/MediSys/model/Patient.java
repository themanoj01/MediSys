package com.MediSys.MediSys.model;

import com.MediSys.MediSys.auth.model.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String fullName;

    private String email;

    private String phone;

    private LocalDate dateOfBirth;

    private String gender;

    private String address;

    private String medicareNumber;

    private String emergencyContact;

    private boolean active = true;

    @Column(columnDefinition = "TEXT")
    private String medicalHistory;
}
