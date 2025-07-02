package com.matildaerenius.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;


@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class SpoonacularRecipeResponse {
    private int id;
    private String title;
    private String image;
    private int usedIngredientCount;
    private int missedIngredientCount;
}
