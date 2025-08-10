package com.matildaerenius.dto.request;

import com.matildaerenius.model.IngredientCategory;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateIngredientRequest {

    @NotBlank
    private String name;

    private int quantity;

    @Enumerated(EnumType.STRING)
    IngredientCategory category;
}
