package com.matildaerenius.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ShoppingItemResponse {
    private Long id;
    private String name;
    private int quantity;
    private boolean checked;
}
