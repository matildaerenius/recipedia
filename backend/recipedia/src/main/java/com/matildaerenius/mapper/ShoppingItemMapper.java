package com.matildaerenius.mapper;

import com.matildaerenius.dto.response.ShoppingItemResponse;
import com.matildaerenius.entity.ShoppingItem;

public final class ShoppingItemMapper {

    public static ShoppingItemResponse toDto(ShoppingItem item) {
        return new ShoppingItemResponse(
                item.getId(),
                item.getName(),
                item.getQuantity(),
                item.isChecked()
        );
    }
}
