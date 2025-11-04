package com.StubZo.Backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "rooms")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String roomNumber;

    @ManyToOne(optional = false)
    @JoinColumn(name = "building_id")
    private Building building;

    private String sharingType; // single/double/triple/custom

    private Integer capacity;

    private Double rent;

    private String status; // AVAILABLE/OCCUPIED/MAINTENANCE
}


