package com.MediSys.MediSys.model;

import com.MediSys.MediSys.auth.model.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String fullName;

    private String email;

    private String phone;

    private String specialization;

    private String registrationNumber;

    private int yearsOfExperience;

    private String gender;

    private boolean active = true;

    private String imageUrl;

    @OneToMany(mappedBy = "doctor",orphanRemoval = true, cascade = CascadeType.ALL)
    @JsonManagedReference()
    private List<DoctorSchedule> schedules;
}
