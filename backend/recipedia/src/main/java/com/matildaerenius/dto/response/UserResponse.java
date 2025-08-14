package com.matildaerenius.dto.response;

import com.matildaerenius.model.Preference;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String address;
    private Preference preference;
}