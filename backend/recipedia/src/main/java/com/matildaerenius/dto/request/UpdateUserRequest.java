package com.matildaerenius.dto.request;

import com.matildaerenius.model.Preference;
import lombok.Data;

@Data
public class UpdateUserRequest {
    private String username;
    private String firstName;
    private String lastName;
    private String address;
    private String email;
    private Preference preference;
}
