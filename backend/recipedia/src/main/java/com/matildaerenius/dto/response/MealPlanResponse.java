package com.matildaerenius.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
public class MealPlanResponse {
    private LocalDate weekStart;
    private List<MealPlanEntryResponse> entries;
}
