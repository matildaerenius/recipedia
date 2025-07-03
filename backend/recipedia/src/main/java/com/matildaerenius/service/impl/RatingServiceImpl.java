package com.matildaerenius.service.impl;

import com.matildaerenius.dto.request.RatingRequest;
import com.matildaerenius.dto.response.RatingResponse;
import com.matildaerenius.entity.Rating;
import com.matildaerenius.entity.User;
import com.matildaerenius.repository.RatingRepository;
import com.matildaerenius.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;

    @Override
    public void rateRecipe(User user, RatingRequest request) {
        Rating rating = ratingRepository
                .findByUserAndRecipeId(user, request.getRecipeId())
                .orElse(new Rating());

        rating.setUser(user);
        rating.setRecipeId(request.getRecipeId());
        rating.setRating(request.getRating());
        rating.setComment(request.getComment());

        ratingRepository.save(rating);
    }

    @Override
    public void deleteRating(User user, Long recipeId) {
        Rating rating = ratingRepository
                .findByUserAndRecipeId(user, recipeId)
                .orElseThrow(() -> new RuntimeException("Rating not found"));

        ratingRepository.delete(rating);
    }

    @Override
    public RatingResponse getAverageRating(Long recipeId) {
        List<Rating> ratings = ratingRepository.findByRecipeId(recipeId);

        double avg = ratings.stream().mapToInt(Rating::getRating).average().orElse(0.0);
        return new RatingResponse(recipeId, avg, ratings.size());
    }
}
