package com.matildaerenius.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.matildaerenius.entity.Ingredient;
import com.matildaerenius.entity.User;
import com.matildaerenius.integration.SpoonacularService;
import com.matildaerenius.repository.IngredientRepository;
import com.matildaerenius.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Map;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final SpoonacularService spoonacularService;
    private final UserRepository userRepository;
    private final IngredientRepository ingredientRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/generate")
    public ResponseEntity<?> generateRecipes(
            @RequestParam(defaultValue = "100") String match,
            Authentication authentication) {

        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User user = optionalUser.get();
        List<Ingredient> ingredients = ingredientRepository.findByUser(user);

        List<String> ingredientNames = ingredients.stream()
                .map(Ingredient::getName)
                .collect(Collectors.toList());

        if (ingredientNames.isEmpty()) {
            return ResponseEntity.badRequest().body("No ingredients found for user");
        }

        double threshold = match.equals("80") ? 0.8 : 1.0;
        String recipesJson = spoonacularService.getRecipes(ingredientNames, threshold);

        try {
            List<Map<String, Object>> recipes = objectMapper.readValue(
                    recipesJson, new TypeReference<>() {});

            if (threshold == 1.0) {
                recipes = recipes.stream()
                        .filter(recipe -> ((int) recipe.getOrDefault("missedIngredientCount", 0)) == 0)
                        .collect(Collectors.toList());
            }

            if (recipes.isEmpty()) {
                return ResponseEntity.ok("No recipes matched your ingredients.");
            }

            return ResponseEntity.ok(recipes);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to parse recipe response: " + e.getMessage());
        }
    }
}
