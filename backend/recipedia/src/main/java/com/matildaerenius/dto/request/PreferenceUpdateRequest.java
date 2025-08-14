package com.matildaerenius.dto.request;

import com.matildaerenius.model.Preference;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PreferenceUpdateRequest {
    @NotNull
    private Preference preference;
}