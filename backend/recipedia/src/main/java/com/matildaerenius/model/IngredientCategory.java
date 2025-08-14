package com.matildaerenius.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum IngredientCategory {
    VEGETABLE,
    FRUIT,
    MEAT,
    FISH,
    DAIRY,
    GRAIN,
    SPICE,
    FROZEN,
    LEGUME,
    SAUCE,
    OTHER;

    @JsonCreator
    public static IngredientCategory fromString(String value) {
        if (value == null) return null;
        return IngredientCategory.valueOf(value.trim().toUpperCase());
    }

    @JsonValue
    public String toJson() {
        return this.name();
    }

}
