package com.matildaerenius.dto.response;

import com.matildaerenius.model.IngredientCategory;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class IngredientResponse {

    private Long id;
    private String name;
    private int quantity;
    private IngredientCategory category;
}
