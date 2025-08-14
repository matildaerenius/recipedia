package com.matildaerenius.dto.response;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Data
@AllArgsConstructor
public class UserRatingResponse {
    private Long id;
    private Long recipeId;
    private int rating;
    private String comment;

}
