package com.matildaerenius.controller;

import com.matildaerenius.dto.request.CreateIngredientRequest;
import com.matildaerenius.dto.request.UpdateIngredientRequest;
import com.matildaerenius.dto.response.IngredientResponse;
import com.matildaerenius.model.IngredientCategory;
import com.matildaerenius.service.IngredientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ingredients")
@RequiredArgsConstructor
public class IngredientController {

    private final IngredientService ingredientService;

    @PostMapping
    public IngredientResponse addIngredient(
            @RequestHeader("Authorization") String token,
            @RequestBody @Valid CreateIngredientRequest request
    ) {
        return ingredientService.addIngredient(token, request.getName(), request.getQuantity(), request.getCategory());
    }

    @GetMapping
    public List<IngredientResponse> getAllUserIngredients(
            @RequestHeader("Authorization") String token
    ) {
        return ingredientService.getUserIngredients(token);
    }
    @DeleteMapping("/{id}")
    public void deleteIngredient(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id
    ) {
        ingredientService.deleteIngredient(token, id);
    }

    @PutMapping("/{id}")
    public IngredientResponse updateIngredient(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id,
            @RequestBody @Valid UpdateIngredientRequest request
    ) {
        return ingredientService.updateIngredient(token, id, request.getName(), request.getCategory());
    }

    @GetMapping("/search")
    public List<IngredientResponse> searchIngredients(
            @RequestHeader("Authorization") String token,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) IngredientCategory category
    ) {
        return ingredientService.searchIngredients(token, name, category);
    }


    @DeleteMapping("/batch")
    public void deleteMultiple(
            @RequestHeader("Authorization") String token,
            @RequestBody List<Long> ids
    ) {
        ingredientService.deleteMultipleIngredients(token, ids);
    }

}
