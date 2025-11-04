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
@Table(name = "pseudo_admins")
public class PseudoAdmin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne
    @JoinColumn(name = "assigned_by")
    private User assignedBy;

    private Instant startDate;

    private Instant endDate;

    @Lob
    private String permissionsJson;

    private boolean revoked = false;
}


