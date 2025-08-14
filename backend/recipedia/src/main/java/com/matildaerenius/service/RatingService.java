package com.matildaerenius.service;

import com.matildaerenius.dto.request.RatingRequest;
import com.matildaerenius.dto.response.RatingResponse;
import com.matildaerenius.dto.response.UserRatingResponse;
import com.matildaerenius.entity.User;

import java.util.List;

public interface RatingService {
    void rateRecipe(User user, RatingRequest request);
    void deleteRating(User user, Long recipeId);
    RatingResponse getAverageRating(Long recipeId);
    List<UserRatingResponse> getUserRatings(User user);
}
