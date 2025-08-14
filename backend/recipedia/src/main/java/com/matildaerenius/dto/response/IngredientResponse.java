package com.matildaerenius.dto.response;

import com.matildaerenius.model.IngredientCategory;
import com.matildaerenius.model.Unit;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class IngredientResponse {

    private Long id;
    private String name;
    private int quantity;
    private Unit unit;
    private IngredientCategory category;
}
