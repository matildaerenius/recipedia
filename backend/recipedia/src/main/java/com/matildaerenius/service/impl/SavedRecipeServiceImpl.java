package com.matildaerenius.service.impl;

import com.matildaerenius.dto.request.SaveRecipeRequest;
import com.matildaerenius.dto.response.SavedRecipeResponse;
import com.matildaerenius.entity.SavedRecipe;
import com.matildaerenius.entity.User;
import com.matildaerenius.exception.DuplicateRecipeException;
import com.matildaerenius.exception.UserException;
import com.matildaerenius.repository.SavedRecipeRepository;
import com.matildaerenius.repository.UserRepository;
import com.matildaerenius.service.SavedRecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavedRecipeServiceImpl implements SavedRecipeService {

    private final SavedRecipeRepository savedRecipeRepository;
    private final UserRepository userRepository;

    @Override
    public SavedRecipeResponse saveRecipe(SaveRecipeRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserException("User not found"));

        boolean exists = savedRecipeRepository
                .findByUser(user).stream()
                .anyMatch(r -> r.getRecipeId().equals(request.getRecipeId()));

        if (exists) {
            throw new IllegalStateException("Recipe already saved");
        }

        SavedRecipe saved = SavedRecipe.builder()
                .recipeId(request.getRecipeId())
                .title(request.getTitle())
                .imageUrl(request.getImageUrl())
                .user(user)
                .build();

        SavedRecipe savedEntity = savedRecipeRepository.save(saved);

        return new SavedRecipeResponse(
                savedEntity.getId(),
                savedEntity.getRecipeId(),
                savedEntity.getTitle(),
                savedEntity.getImageUrl()
        );
    }

    @Override
    public List<SavedRecipeResponse> getUserRecipes(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserException("User not found"));

        return savedRecipeRepository.findByUser(user).stream()
                .map(r -> new SavedRecipeResponse(r.getId(), r.getRecipeId(), r.getTitle(), r.getImageUrl()))
                .collect(Collectors.toList());
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
