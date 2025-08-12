package com.matildaerenius.service;

import com.matildaerenius.dto.response.SpoonacularRecipeResponse;
import com.matildaerenius.entity.User;

import java.util.List;

public interface RecipeService {
    List<SpoonacularRecipeResponse> generateRecipes(User user, double matchThreshold, int limit);
    String getRecipeDetails(Long recipeId);
}
