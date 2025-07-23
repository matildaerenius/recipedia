package com.matildaerenius.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealPlanEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private DayOfWeek dayOfWeek;

    private Long recipeId;
    private String title;
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "meal_plan_id")
    private MealPlan mealPlan;
}
