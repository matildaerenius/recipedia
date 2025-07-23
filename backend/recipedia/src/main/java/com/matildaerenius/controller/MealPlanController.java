package com.matildaerenius.controller;

import com.matildaerenius.dto.request.MealPlanRequest;
import com.matildaerenius.dto.response.MealPlanResponse;
import com.matildaerenius.entity.MealPlan;
import com.matildaerenius.entity.User;
import com.matildaerenius.exception.UserException;
import com.matildaerenius.mapper.MealPlanMapper;
import com.matildaerenius.repository.UserRepository;
import com.matildaerenius.service.MealPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;

@RestController
@RequestMapping("/api/mealplan")
@RequiredArgsConstructor
public class MealPlanController {

    private final MealPlanService mealPlanService;
    private final UserRepository userRepository;

    @PostMapping("/add")
    public ResponseEntity<MealPlanResponse> addRecipeToDay(@RequestBody MealPlanRequest request,
                                                           Authentication authentication) {
        User user = getUser(authentication);
        MealPlan plan = mealPlanService.addOrUpdateEntry(user, request);
        return ResponseEntity.ok(MealPlanMapper.toDto(plan));
    }

    @DeleteMapping("/remove/{day}")
    public ResponseEntity<MealPlanResponse> removeRecipeFromDay(@PathVariable DayOfWeek day,
                                                                Authentication authentication) {
        User user = getUser(authentication);
        MealPlan plan = mealPlanService.removeEntry(user, day);
        return ResponseEntity.ok(MealPlanMapper.toDto(plan));
    }

    @GetMapping("/week")
    public ResponseEntity<MealPlanResponse> getCurrentWeek(Authentication authentication) {
        User user = getUser(authentication);
        MealPlan plan = mealPlanService.getCurrentWeek(user);
        return ResponseEntity.ok(MealPlanMapper.toDto(plan));
    }

    private User getUser(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserException("User not found"));
    }
}
