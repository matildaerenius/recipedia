package com.matildaerenius.controller;

import com.matildaerenius.dto.request.ShoppingItemRequest;
import com.matildaerenius.dto.response.ShoppingItemResponse;
import com.matildaerenius.entity.ShoppingItem;
import com.matildaerenius.entity.User;
import com.matildaerenius.exception.UserException;
import com.matildaerenius.mapper.ShoppingItemMapper;
import com.matildaerenius.repository.UserRepository;
import com.matildaerenius.service.ShoppingListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shopping-list")
@RequiredArgsConstructor
public class ShoppingListController {

    private final ShoppingListService shoppingListService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<ShoppingItemResponse>> getShoppingList(Authentication authentication) {
        User user = getUser(authentication);
        List<ShoppingItemResponse> list = shoppingListService.getShoppingList(user).stream()
                .map(ShoppingItemMapper::toDto)
                .toList();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/add")
    public ResponseEntity<ShoppingItemResponse> addItem(@RequestBody ShoppingItemRequest request,
                                                        Authentication authentication) {
        User user = getUser(authentication);
        ShoppingItem item = shoppingListService.addItem(user, request.getName(), request.getQuantity());
        return ResponseEntity.ok(ShoppingItemMapper.toDto(item));
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<?> removeItem(@PathVariable Long id,
                                        Authentication authentication) {
        User user = getUser(authentication);
        shoppingListService.removeItem(user, id);
        return ResponseEntity.ok("Item removed");
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateFromMealPlan(Authentication authentication) {
        User user = getUser(authentication);
        shoppingListService.generateFromMealPlan(user);
        return ResponseEntity.ok("Shopping list generated from meal plan");
    }

    @PatchMapping("/check/{id}")
    public ResponseEntity<?> toggleChecked(@PathVariable Long id,
                                           Authentication authentication) {
        User user = getUser(authentication);
        shoppingListService.toggleChecked(user, id);
        return ResponseEntity.ok("Item status updated");
    }


    private User getUser(Authentication authentication) {
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new UserException("User not found"));
    }
}
