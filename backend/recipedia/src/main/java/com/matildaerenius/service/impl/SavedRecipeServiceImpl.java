package com.matildaerenius.service.impl;

import com.matildaerenius.dto.request.SaveRecipeRequest;
import com.matildaerenius.entity.SavedRecipe;
import com.matildaerenius.entity.User;
import com.matildaerenius.exception.DuplicateRecipeException;
import com.matildaerenius.exception.UserException;
import com.matildaerenius.repository.SavedRecipeRepository;
import com.matildaerenius.service.SavedRecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SavedRecipeServiceImpl implements SavedRecipeService {

    private final SavedRecipeRepository savedRecipeRepository;

    @Override
    public void saveRecipe(SaveRecipeRequest request, User user) {
        boolean exists = savedRecipeRepository.findByUserAndRecipeId(user, request.getRecipeId()).isPresent();
        if (exists) {
            throw new DuplicateRecipeException("This recipe is already saved.");
        }

        SavedRecipe recipe = SavedRecipe.builder()
                .user(user)
                .recipeId(request.getRecipeId())
                .title(request.getTitle())
                .imageUrl(request.getImageUrl())
                .build();

        savedRecipeRepository.save(recipe);
    }

    @Override
    public List<SavedRecipe> getSavedRecipes(User user) {
        return savedRecipeRepository.findByUser(user);
    }

    @Override
    public void deleteSavedRecipe(Integer recipeId, User user) {
        SavedRecipe recipe = savedRecipeRepository.findById(recipeId)
                .orElseThrow(() -> new UserException("Recipe not found"));

        if (!recipe.getUser().getId().equals(user.getId())) {
            throw new UserException("Unauthorized to delete this recipe");
        }

        savedRecipeRepository.delete(recipe);
    }
}
