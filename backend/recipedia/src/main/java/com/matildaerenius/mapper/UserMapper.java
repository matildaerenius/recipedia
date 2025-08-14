
package com.matildaerenius.mapper;

import com.matildaerenius.dto.response.IngredientResponse;
import com.matildaerenius.dto.response.UserResponse;
import com.matildaerenius.entity.User;

import java.util.List;
import java.util.stream.Collectors;

public final class UserMapper {
    private UserMapper() {}

    public static UserResponse toDto(User u) {
        List<IngredientResponse> ingredients = null;
        if (u.getIngredients() != null) {
            ingredients = u.getIngredients().stream()
                    .map(IngredientMapper::toDto)
                    .collect(Collectors.toList());
        }

        return UserResponse.builder()
                .id(u.getId())
                .username(u.getUsername())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .email(u.getEmail())
                .address(u.getAddress())
                .preference(u.getPreference())

                .build();
    }
}
