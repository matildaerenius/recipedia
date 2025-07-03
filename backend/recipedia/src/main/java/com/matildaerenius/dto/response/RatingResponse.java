package com.matildaerenius.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RatingResponse {
    private Long recipeId;
    private double averageRating;
    private int totalRatings;
}
