package com.matildaerenius.dto.request;

import lombok.Data;

@Data
public class RatingRequest {
    private Long recipeId;
    private int rating;
    private String comment;
}
