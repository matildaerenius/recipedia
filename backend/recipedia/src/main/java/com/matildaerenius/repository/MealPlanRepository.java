package com.matildaerenius.repository;

import com.matildaerenius.entity.MealPlan;
import com.matildaerenius.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface MealPlanRepository extends JpaRepository<MealPlan, Long> {
    Optional<MealPlan> findByUserAndWeekStart(User user, LocalDate weekStart);
}
