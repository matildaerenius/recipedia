package com.matildaerenius.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class SpoonacularIngredientResponse {
    private int id;
    private String name;
    private String image;
    private String original;
}
