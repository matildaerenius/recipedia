package com.matildaerenius.service.impl;

import com.matildaerenius.dto.response.IngredientResponse;
import static com.matildaerenius.mapper.IngredientMapper.toDto;
import com.matildaerenius.entity.Ingredient;
import com.matildaerenius.entity.User;
import com.matildaerenius.exception.UserException;
import com.matildaerenius.mapper.IngredientMapper;
import com.matildaerenius.model.IngredientCategory;
import com.matildaerenius.model.Unit;
import com.matildaerenius.repository.IngredientRepository;
import com.matildaerenius.repository.UserRepository;
import com.matildaerenius.security.util.JwtTokenProvider;
import com.matildaerenius.service.IngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IngredientServiceImpl implements IngredientService {

    private final IngredientRepository ingredientRepository;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    private User getUserFromToken(String token) {
        String username = jwtTokenProvider.getUsernameFromToken(token.replace("Bearer ", ""));
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

        @Override
        public IngredientResponse addIngredient(String token, String name, int quantity, Unit unit, IngredientCategory category) {
            User user = getUserFromToken(token);

            Ingredient ingredient = Ingredient.builder()
                    .name(name)
                    .quantity(quantity)
                    .unit(unit)
                    .category(category)
                    .user(user)
                    .build();

            return toDto(ingredientRepository.save(ingredient));
        }

        @Override
        public List<IngredientResponse> getUserIngredients(String token) {
            User user = getUserFromToken(token);
            return ingredientRepository.findByUser(user)
                    .stream()
                    .map(IngredientMapper::toDto)
                    .collect(Collectors.toList());
        }

        @Override
        public void deleteIngredient(String token, Long ingredientId) {
            User user = getUserFromToken(token);
            Ingredient ingredient = ingredientRepository.findById(ingredientId)
                    .orElseThrow(() -> new RuntimeException("Ingredient not found"));

            if (!ingredient.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Not allowed to delete this ingredient");
            }

            ingredientRepository.delete(ingredient);
        }

    @Override
    public IngredientResponse updateIngredient(String token, Long ingredientId, String name, Integer quantity, Unit unit, IngredientCategory category) {
        User user = getUserFromToken(token);
        Ingredient ingredient = ingredientRepository.findById(ingredientId)
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));

        if (!ingredient.getUser().getId().equals(user.getId())) {
            throw new UserException("You do not have permission to update this ingredient");
        }

        if (name != null) ingredient.setName(name);
        if (quantity != null) {
            ingredient.setQuantity(quantity);
        }
        if (unit != null) ingredient.setUnit(unit);
        if (category != null) ingredient.setCategory(category);


        Ingredient updated = ingredientRepository.save(ingredient);
        return toDto(updated);
    }

    @Override
    public List<IngredientResponse> searchIngredients(String token, String name, IngredientCategory category) {
        User user = getUserFromToken(token);
        return ingredientRepository.findByUser(user).stream()
                .filter(i -> (name == null || i.getName().toLowerCase().contains(name.toLowerCase())) &&
                        (category == null || i.getCategory() == category))
                .map(IngredientMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteMultipleIngredients(String token, List<Long> ids) {
        User user = getUserFromToken(token);
        List<Ingredient> ingredients = ingredientRepository.findAllById(ids);

        for (Ingredient i : ingredients) {
            if (!i.getUser().getId().equals(user.getId())) {
                throw new UserException("You don't own ingredient " + i.getName());
            }
        }

        ingredientRepository.deleteAll(ingredients);
    }


}
