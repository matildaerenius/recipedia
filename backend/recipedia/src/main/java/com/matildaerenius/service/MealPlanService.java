package com.matildaerenius.service;

import com.matildaerenius.dto.request.MealPlanRequest;
import com.matildaerenius.entity.MealPlan;
import com.matildaerenius.entity.User;

import java.time.DayOfWeek;

public interface MealPlanService {

    MealPlan getOrCreateCurrentWeek(User user);
    MealPlan addOrUpdateEntry(User user, MealPlanRequest request);
    MealPlan removeEntry(User user, DayOfWeek dayOfWeek);
    MealPlan getCurrentWeek(User user);
}
