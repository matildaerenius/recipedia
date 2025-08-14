package com.matildaerenius.mapper;

import com.matildaerenius.dto.response.MealPlanEntryResponse;
import com.matildaerenius.dto.response.MealPlanResponse;
import com.matildaerenius.entity.MealPlan;

import java.util.List;

public final class MealPlanMapper {

    public static MealPlanResponse toDto(MealPlan plan) {
        List<MealPlanEntryResponse> entries = plan.getEntries().stream()
                .map(entry -> new MealPlanEntryResponse(
                        entry.getDayOfWeek(),
                        entry.getRecipeId(),
                        entry.getTitle(),
                        entry.getImageUrl()
                ))
                .toList();

        return new MealPlanResponse(plan.getWeekStart(), entries);
    }
}
