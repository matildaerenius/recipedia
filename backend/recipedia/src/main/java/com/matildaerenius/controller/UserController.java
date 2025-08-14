package com.matildaerenius.controller;

import com.matildaerenius.dto.request.PreferenceUpdateRequest;
import com.matildaerenius.dto.request.UpdateUserRequest;
import com.matildaerenius.dto.response.UserResponse;
import com.matildaerenius.entity.User;
import com.matildaerenius.mapper.UserMapper;
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
    public ResponseEntity<UserResponse> me() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getByUsername(username);
        return ResponseEntity.ok(UserMapper.toDto(user));
    }
    @GetMapping("/preference")
    public ResponseEntity<Preference> getPreference() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Preference pref = userService.getByUsername(username).getPreference();
        return ResponseEntity.ok(pref);
    }

    @PutMapping("/preference")
    public ResponseEntity<Preference> setPreference(@RequestBody PreferenceUpdateRequest body) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UpdateUserRequest req = new UpdateUserRequest();
        req.setPreference(body.getPreference());
        User updated = userService.updateUser(username, req);
        return ResponseEntity.ok(updated.getPreference());
    }


}
