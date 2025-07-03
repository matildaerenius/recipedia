package com.matildaerenius.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "saved_recipes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedRecipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Long recipeId;
    private String title;
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
