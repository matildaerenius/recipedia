package com.matildaerenius.repository;

import com.matildaerenius.entity.MealPlanEntry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MealPlanEntryRepository extends JpaRepository<MealPlanEntry, Long> {
}