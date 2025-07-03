package com.matildaerenius.exception;

public class DuplicateRecipeException extends RuntimeException {
    public DuplicateRecipeException(String message) {
        super(message);
    }
}
