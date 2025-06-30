package com.matildaerenius.controller;

import com.matildaerenius.dto.request.UpdateUserRequest;
import com.matildaerenius.entity.User;
import com.matildaerenius.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/update")
    public ResponseEntity<User> updateUser(@RequestBody UpdateUserRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User updatedUser = userService.updateUser(username, request);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser(@RequestHeader("Authorization") String token) {
        String username = userService.getUsernameFromToken(token);
        userService.deleteUserByUsername(username);
        return ResponseEntity.ok("User deleted successfully");
    }

}
