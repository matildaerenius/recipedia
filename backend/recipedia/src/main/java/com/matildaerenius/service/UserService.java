package com.matildaerenius.service;

import com.matildaerenius.dto.request.LoginRequest;
import com.matildaerenius.dto.request.RegisterRequest;
import com.matildaerenius.dto.response.AuthResponse;

public interface UserService {
        AuthResponse register(RegisterRequest request);
        AuthResponse login(LoginRequest request);
    }

