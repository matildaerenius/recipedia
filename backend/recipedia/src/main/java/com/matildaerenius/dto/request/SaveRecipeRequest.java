package com.matildaerenius.dto.request;

import lombok.Data;

@Data
public class SaveRecipeRequest {
    private Long recipeId;
    private String title;
    private String imageUrl;
}

