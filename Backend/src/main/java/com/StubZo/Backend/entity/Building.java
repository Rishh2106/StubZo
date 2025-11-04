package com.StubZo.Backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "buildings")
public class Building {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private Integer totalRooms;

    private Integer startingRoomNumber;

    private Boolean customRoomNumbering = false;

    private Instant createdAt = Instant.now();
}


