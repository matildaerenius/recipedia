package com.matildaerenius.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserException.class)
    public ResponseEntity<ErrorDetails> handleUserException(UserException ex, WebRequest request) {
        ErrorDetails details = new ErrorDetails(
                ex.getMessage(),
                request.getDescription(false),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(details, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(HttpClientErrorException.TooManyRequests.class)
    public ResponseEntity<ErrorDetails> handleTooManyRequests(HttpClientErrorException.TooManyRequests ex, WebRequest request) {
        ErrorDetails details = new ErrorDetails(
                "You've reached the daily Spoonacular API limit (150 requests/day). Please try again tomorrow.",
                request.getDescription(false),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(details, HttpStatus.TOO_MANY_REQUESTS);
    }

    @ExceptionHandler(RestClientException.class)
    public ResponseEntity<ErrorDetails> handleRestClient(RestClientException ex, WebRequest request) {
        ErrorDetails details = new ErrorDetails(
                "Could not reach Spoonacular API. Please try again later.",
                request.getDescription(false),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(details, HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetails> handleGlobalException(Exception ex, WebRequest request) {
        ErrorDetails details = new ErrorDetails(
                ex.getMessage(),
                request.getDescription(false),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(details, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(DuplicateRecipeException.class)
    public ResponseEntity<String> handleDuplicateRecipe(DuplicateRecipeException ex) {
        return ResponseEntity.status(409).body(ex.getMessage());
    }

}
