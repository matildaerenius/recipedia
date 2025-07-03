package com.matildaerenius.controller;

import com.matildaerenius.dto.request.SaveRecipeRequest;
import com.matildaerenius.entity.SavedRecipe;
import com.matildaerenius.entity.User;
import com.matildaerenius.exception.UserException;
import com.matildaerenius.repository.UserRepository;
import com.matildaerenius.service.SavedRecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saved-recipes")
@RequiredArgsConstructor
public class SavedRecipeController {

    private final UserRepository userRepository;
    private final SavedRecipeService savedRecipeService;

    private User getCurrentUser(Authentication authentication) {
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new UserException("User not found"));
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveRecipe(@RequestBody SaveRecipeRequest request,
                                        Authentication authentication) {
        savedRecipeService.saveRecipe(request, getCurrentUser(authentication));
        return ResponseEntity.ok("Recipe saved!");
    }

    @GetMapping
    public ResponseEntity<List<SavedRecipe>> getUserRecipes(Authentication authentication) {
        return ResponseEntity.ok(savedRecipeService.getSavedRecipes(getCurrentUser(authentication)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSavedRecipe(@PathVariable Integer id,
                                               Authentication authentication) {
        savedRecipeService.deleteSavedRecipe(id, getCurrentUser(authentication));
        return ResponseEntity.ok("Recipe deleted");
    }
}

