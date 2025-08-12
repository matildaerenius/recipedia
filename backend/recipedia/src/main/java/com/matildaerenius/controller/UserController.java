package com.matildaerenius.controller;

import com.matildaerenius.dto.request.UpdateUserRequest;
import com.matildaerenius.entity.User;
import com.matildaerenius.model.Preference;
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
    @GetMapping("/me")
    public ResponseEntity<User> me() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getByUsername(username);
        return ResponseEntity.ok(user);
    }
    @GetMapping("/preference")
    public ResponseEntity<Preference> getPreference() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Preference pref = userService.getByUsername(username).getPreference();
        return ResponseEntity.ok(pref);
    }

    @PutMapping("/preference")
    public ResponseEntity<User> setPreference(@RequestBody Preference preference) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UpdateUserRequest req = new UpdateUserRequest();
        req.setPreference(preference);
        User updated = userService.updateUser(username, req);
        return ResponseEntity.ok(updated);
    }


}
