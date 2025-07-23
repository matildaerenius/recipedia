package com.matildaerenius.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.matildaerenius.entity.MealPlan;
import com.matildaerenius.entity.ShoppingItem;
import com.matildaerenius.entity.User;
import com.matildaerenius.integration.SpoonacularService;
import com.matildaerenius.repository.IngredientRepository;
import com.matildaerenius.repository.MealPlanRepository;
import com.matildaerenius.repository.ShoppingItemRepository;
import com.matildaerenius.service.ShoppingListService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShoppingListServiceImpl implements ShoppingListService {

    private final ShoppingItemRepository shoppingItemRepository;
    private final MealPlanRepository mealPlanRepository;
    private final IngredientRepository ingredientRepository;
    private final SpoonacularService spoonacularService;
    private final ObjectMapper objectMapper = new ObjectMapper();


    @Override
    public List<ShoppingItem> getShoppingList(User user) {
        return shoppingItemRepository.findByUser(user);
    }

    @Override
    public ShoppingItem addItem(User user, String name, int quantity) {
        ShoppingItem item = ShoppingItem.builder()
                .user(user)
                .name(name)
                .quantity(quantity)
                .checked(false)
                .build();
        return shoppingItemRepository.save(item);
    }

    @Override
    public void removeItem(User user, Long itemId) {
        ShoppingItem item = shoppingItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        if (!item.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        shoppingItemRepository.delete(item);
    }

    @Override
    public void generateFromMealPlan(User user) {
        MealPlan plan = mealPlanRepository.findByUserAndWeekStart(user,
                        java.time.LocalDate.now().with(java.time.DayOfWeek.MONDAY))
                .orElseThrow(() -> new RuntimeException("Meal plan not found"));

        List<String> userIngredients = ingredientRepository.findByUser(user).stream()
                .map(i -> i.getName().toLowerCase())
                .toList();

        plan.getEntries().forEach(entry -> {
            try {
                String detailsJson = spoonacularService.getRecipeDetails(entry.getRecipeId());

                JsonNode root = objectMapper.readTree(detailsJson);
                JsonNode ingredients = root.get("extendedIngredients");

                if (ingredients != null && ingredients.isArray()) {
                    for (JsonNode ingredient : ingredients) {
                        String name = ingredient.get("name").asText();

                        boolean userHasIt = userIngredients.contains(name.toLowerCase());
                        boolean alreadyExists = shoppingItemRepository
                                .findByUser(user).stream()
                                .anyMatch(item -> item.getName().equalsIgnoreCase(name));

                        if (!userHasIt && !alreadyExists) {
                            addItem(user, name, 1);
                        }
                    }
                }

            } catch (Exception e) {
                throw new RuntimeException("Failed to process recipe " + entry.getRecipeId() + ": " + e.getMessage());
            }
        });
    }

    @Override
    public void toggleChecked(User user, Long itemId) {
        ShoppingItem item = shoppingItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        if (!item.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        item.setChecked(!item.isChecked());
        shoppingItemRepository.save(item);
    }

}
