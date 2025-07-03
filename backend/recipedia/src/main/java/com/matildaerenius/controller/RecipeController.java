package com.matildaerenius.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.matildaerenius.dto.response.SpoonacularRecipeResponse;
import com.matildaerenius.entity.User;
import com.matildaerenius.exception.UserException;
import com.matildaerenius.repository.UserRepository;
import com.matildaerenius.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final UserRepository userRepository;
    private final RecipeService recipeService;
    private final ObjectMapper objectMapper;

    private User getCurrentUser(Authentication auth) {
        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new UserException("User not found"));
    }

    @GetMapping("/generate")
    public ResponseEntity<?> generateRecipes(
            @RequestParam(defaultValue = "100") String match,
            Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);
            double threshold = match.equals("80") ? 0.8 : 1.0;
            List<SpoonacularRecipeResponse> recipes = recipeService.generateRecipes(user, threshold);

            if (recipes.isEmpty()) {
                return ResponseEntity.ok("No recipes matched your ingredients.");
            }

            return ResponseEntity.ok(recipes);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Unexpected error: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRecipeDetails(@PathVariable int id) {
        try {
            String detailsJson = recipeService.getRecipeDetails(id);
            return ResponseEntity.ok(objectMapper.readTree(detailsJson));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to retrieve recipe: " + e.getMessage());
        }
    }
}
