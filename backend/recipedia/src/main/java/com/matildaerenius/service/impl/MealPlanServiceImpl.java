package com.matildaerenius.service.impl;

import com.matildaerenius.dto.request.MealPlanRequest;
import com.matildaerenius.entity.MealPlan;
import com.matildaerenius.entity.User;
import com.matildaerenius.repository.MealPlanRepository;
import com.matildaerenius.repository.UserRepository;
import com.matildaerenius.service.MealPlanService;
import com.matildaerenius.entity.MealPlanEntry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class MealPlanServiceImpl implements MealPlanService {

    private final MealPlanRepository mealPlanRepository;
    private final UserRepository userRepository;

    @Override
    public MealPlan getOrCreateCurrentWeek(User user) {
        LocalDate monday = LocalDate.now().with(DayOfWeek.MONDAY);
        return mealPlanRepository.findByUserAndWeekStart(user, monday)
                .orElseGet(() -> mealPlanRepository.save(MealPlan.builder()
                        .user(user)
                        .weekStart(monday)
                        .entries(new ArrayList<>())
                        .build()));

    }

    @Override
    public MealPlan addOrUpdateEntry(User user, MealPlanRequest request) {
        MealPlan plan = getOrCreateCurrentWeek(user);

        plan.getEntries().removeIf(e -> e.getDayOfWeek() == request.getDayOfWeek());

        plan.getEntries().add(MealPlanEntry.builder()
                .dayOfWeek(request.getDayOfWeek())
                .recipeId(request.getRecipeId())
                .title(request.getTitle())
                .imageUrl(request.getImageUrl())
                .mealPlan(plan)
                .build());

        return mealPlanRepository.save(plan);
    }

    @Override
    public MealPlan removeEntry(User user, DayOfWeek dayOfWeek) {
        MealPlan plan = getOrCreateCurrentWeek(user);
        plan.getEntries().removeIf(e -> e.getDayOfWeek() == dayOfWeek);
        return mealPlanRepository.save(plan);
    }

    @Override
    public MealPlan getCurrentWeek(User user) {
        return getOrCreateCurrentWeek(user);
    }
}
