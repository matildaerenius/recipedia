package com.matildaerenius.service;

import com.matildaerenius.dto.request.RatingRequest;
import com.matildaerenius.dto.response.RatingResponse;
import com.matildaerenius.entity.User;

public interface RatingService {
    void rateRecipe(User user, RatingRequest request);
    void deleteRating(User user, Long recipeId);
    RatingResponse getAverageRating(Long recipeId);
}
