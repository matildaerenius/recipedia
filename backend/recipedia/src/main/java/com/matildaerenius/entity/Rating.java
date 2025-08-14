package com.matildaerenius.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long recipeId;

    @Column(nullable = false)
    private int rating;

    @Column(length = 1000)
    private String comment;

//    @CreationTimestamp
//    @Column(updatable = false)
//    private Instant createdAt;

    @ManyToOne(optional = false)
    private User user;
}
