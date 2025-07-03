package com.matildaerenius.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SavedRecipeResponse {
    private Integer id;
    private Long recipeId;
    private String title;
    private String imageUrl;
}
