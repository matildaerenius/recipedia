package com.matildaerenius.dto.request;

import com.matildaerenius.model.IngredientCategory;
import com.matildaerenius.model.Unit;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateIngredientRequest {

    @NotBlank
    private String name;

    @NotNull
    private int quantity;

    @NotNull
    private Unit unit;

    @NotNull(message = "category is required")
    private IngredientCategory category;
}
