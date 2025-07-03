package com.matildaerenius.service;

import com.matildaerenius.dto.request.SaveRecipeRequest;
import com.matildaerenius.entity.SavedRecipe;
import com.matildaerenius.entity.User;

import java.util.List;

public interface SavedRecipeService {
    void saveRecipe(SaveRecipeRequest request, User user);
    List<SavedRecipe> getSavedRecipes(User user);
    void deleteSavedRecipe(Integer recipeId, User user);
}
