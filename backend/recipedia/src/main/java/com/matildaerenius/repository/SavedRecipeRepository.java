package com.matildaerenius.repository;

import com.matildaerenius.entity.SavedRecipe;
import com.matildaerenius.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedRecipeRepository extends JpaRepository<SavedRecipe, Integer> {
    List<SavedRecipe> findByUser(User user);
    Optional<SavedRecipe> findByUserAndRecipeId(User user, Long recipeId);

}
