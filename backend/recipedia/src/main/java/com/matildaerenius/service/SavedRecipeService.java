package com.matildaerenius.service;

import com.matildaerenius.dto.request.SaveRecipeRequest;
import com.matildaerenius.dto.response.SavedRecipeResponse;
import com.matildaerenius.entity.SavedRecipe;
import com.matildaerenius.entity.User;

import java.util.List;

public interface SavedRecipeService {
    SavedRecipeResponse saveRecipe(SaveRecipeRequest request, String username);
    List<SavedRecipeResponse> getUserRecipes(String username);
    void deleteSavedRecipe(Integer recipeId, User user);
}
