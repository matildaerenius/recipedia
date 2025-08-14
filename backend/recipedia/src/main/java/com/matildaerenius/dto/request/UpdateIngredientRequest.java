package com.matildaerenius.dto.request;

import com.matildaerenius.model.IngredientCategory;
import com.matildaerenius.model.Unit;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Data
public class UpdateIngredientRequest {
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Unit unit;
    @Enumerated(EnumType.STRING)
    private IngredientCategory category;
}
