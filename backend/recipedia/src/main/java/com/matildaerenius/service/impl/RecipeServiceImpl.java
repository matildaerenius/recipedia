package com.matildaerenius.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.matildaerenius.dto.response.SpoonacularRecipeResponse;
import com.matildaerenius.entity.Ingredient;
import com.matildaerenius.entity.User;
import com.matildaerenius.integration.SpoonacularService;
import com.matildaerenius.repository.IngredientRepository;
import com.matildaerenius.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipeServiceImpl implements RecipeService {

    private final SpoonacularService spoonacularService;
    private final IngredientRepository ingredientRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<SpoonacularRecipeResponse> generateRecipes(User user, double matchThreshold) {
        List<Ingredient> ingredients = ingredientRepository.findByUser(user);
        List<String> ingredientNames = ingredients.stream()
                .map(Ingredient::getName)
                .collect(Collectors.toList());

        if (ingredientNames.isEmpty()) {
            throw new IllegalArgumentException("No ingredients found for user");
        }

        String json = spoonacularService.getRecipes(ingredientNames, matchThreshold);

        try {
            List<SpoonacularRecipeResponse> recipes = objectMapper.readValue(
                    json, new TypeReference<>() {});

            if (matchThreshold == 1.0) {
                recipes = recipes.stream()
                        .filter(r -> r.getMissedIngredientCount() == 0)
                        .collect(Collectors.toList());
            }

            return recipes;

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse recipes: " + e.getMessage(), e);
        }
    }

    @Override
    public String getRecipeDetails(Long recipeId) {
        return spoonacularService.getRecipeDetails(recipeId);
    }
}
