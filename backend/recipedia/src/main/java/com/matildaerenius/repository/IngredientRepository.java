package com.matildaerenius.repository;

import com.matildaerenius.entity.Ingredient;
import com.matildaerenius.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    List<Ingredient> findByUser(User user);
}
