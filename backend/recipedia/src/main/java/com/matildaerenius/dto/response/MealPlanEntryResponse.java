package com.matildaerenius.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.DayOfWeek;

@Data
@AllArgsConstructor
public class MealPlanEntryResponse {
    private DayOfWeek dayOfWeek;
    private Long recipeId;
    private String title;
    private String imageUrl;
}
