package com.matildaerenius.dto.request;

import com.matildaerenius.model.IngredientCategory;
import lombok.Data;

@Data
public class UpdateIngredientRequest {
    private String name;
    private IngredientCategory category;
}
