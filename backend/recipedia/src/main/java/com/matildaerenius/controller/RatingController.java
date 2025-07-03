package com.matildaerenius.controller;

import com.matildaerenius.dto.request.RatingRequest;
import com.matildaerenius.dto.response.RatingResponse;
import com.matildaerenius.entity.User;
import com.matildaerenius.exception.UserException;
import com.matildaerenius.repository.UserRepository;
import com.matildaerenius.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService recipeRatingService;
    private final UserRepository userRepository;

    private User getUser(Authentication auth) {
        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new UserException("User not found"));
    }

    @PostMapping
    public ResponseEntity<?> rateRecipe(@RequestBody RatingRequest request, Authentication auth) {
        recipeRatingService.rateRecipe(getUser(auth), request);
        return ResponseEntity.ok("Rating saved!");
    }

    @DeleteMapping("/{recipeId}")
    public ResponseEntity<?> deleteRating(@PathVariable Long recipeId, Authentication auth) {
        recipeRatingService.deleteRating(getUser(auth), recipeId);
        return ResponseEntity.ok("Rating deleted");
    }

    @GetMapping("/{recipeId}")
    public ResponseEntity<RatingResponse> getRating(@PathVariable Long recipeId) {
        return ResponseEntity.ok(recipeRatingService.getAverageRating(recipeId));
    }
}
