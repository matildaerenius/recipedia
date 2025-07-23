package com.matildaerenius.service;

import com.matildaerenius.entity.ShoppingItem;
import com.matildaerenius.entity.User;

import java.util.List;

public interface ShoppingListService {
    List<ShoppingItem> getShoppingList(User user);
    ShoppingItem addItem(User user, String name, int quantity);
    void removeItem(User user, Long itemId);
    void generateFromMealPlan(User user);
    void toggleChecked(User user, Long itemId);
}
