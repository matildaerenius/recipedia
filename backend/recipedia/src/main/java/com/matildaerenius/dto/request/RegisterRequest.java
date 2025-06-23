package com.matildaerenius.dto.request;

import com.matildaerenius.model.Preference;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String address;
    private String email;
    private Preference preference;
}
