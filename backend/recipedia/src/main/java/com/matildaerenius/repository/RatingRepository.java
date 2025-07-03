package com.matildaerenius.repository;

import com.matildaerenius.entity.Rating;
import com.matildaerenius.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Integer> {
    Optional<Rating> findByUserAndRecipeId(User user, Long recipeId);
    List<Rating> findByRecipeId(Long recipeId);
}
