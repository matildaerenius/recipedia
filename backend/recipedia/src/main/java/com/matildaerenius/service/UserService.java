package com.matildaerenius.service;

import com.matildaerenius.dto.request.LoginRequest;
import com.matildaerenius.dto.request.RegisterRequest;
import com.matildaerenius.dto.response.AuthResponse;
import com.matildaerenius.dto.request.UpdateUserRequest;
import com.matildaerenius.entity.User;

public interface UserService {
        AuthResponse register(RegisterRequest request);
        AuthResponse login(LoginRequest request);
        User updateUser(String username, UpdateUserRequest request);
        void deleteUserByUsername(String username);
        String getUsernameFromToken(String token);
        User getByUsername(String username);

}

