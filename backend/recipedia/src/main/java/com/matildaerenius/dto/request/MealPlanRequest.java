package com.matildaerenius.dto.request;

import lombok.Data;

import java.time.DayOfWeek;

@Data
public class MealPlanRequest {
    private DayOfWeek dayOfWeek;
    private Long recipeId;
    private String title;
    private String imageUrl;
}
