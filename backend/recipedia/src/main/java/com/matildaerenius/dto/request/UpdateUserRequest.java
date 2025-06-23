package com.matildaerenius.dto.request;

import com.matildaerenius.model.Preference;
import lombok.Data;

@Data
public class UpdateUserRequest {
    private String firstName;
    private String lastName;
    private String address;
    private Preference preference;
}
