package com.matildaerenius.service;

import com.matildaerenius.dto.response.IngredientResponse;
import com.matildaerenius.model.IngredientCategory;

import java.util.List;

public interface IngredientService {
    IngredientResponse addIngredient(String token, String name, int quantity, IngredientCategory category);
    List<IngredientResponse> getUserIngredients(String token);
    void deleteIngredient(String token, Long ingredientId);
    IngredientResponse updateIngredient(String token, Long ingredientId, String name, Integer quantity, IngredientCategory category);
    List<IngredientResponse> searchIngredients(String token, String name, IngredientCategory category);
    void deleteMultipleIngredients(String token, List<Long> ids);


}
