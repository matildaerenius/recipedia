package com.matildaerenius.mapper;

import com.matildaerenius.dto.response.IngredientResponse;
import com.matildaerenius.entity.Ingredient;

public class IngredientMapper {

    public static IngredientResponse toDto(Ingredient ingredient) {
        return new IngredientResponse(
                ingredient.getId(),
                ingredient.getName(),
                ingredient.getQuantity(),
                ingredient.getCategory()
        );
    }
}
