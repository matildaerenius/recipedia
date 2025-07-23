package com.matildaerenius.integration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@Service
public class SpoonacularService {

    @Value("${spoonacular.api.key}")
    private String apiKey;

    private static final String BASE_URL = "https://api.spoonacular.com/recipes/findByIngredients";

    private final RestTemplate restTemplate = new RestTemplate();

    public String getRecipes(List<String> ingredients, double matchThreshold) {
        String ingredientsParam = String.join(",", ingredients);

        URI uri = UriComponentsBuilder.newInstance()
                .scheme("https")
                .host("api.spoonacular.com")
                .path("/recipes/findByIngredients")
                .queryParam("ingredients", ingredientsParam)
                .queryParam("number", 10)
                .queryParam("ranking", matchThreshold >= 1.0 ? 1 : 2)
                .queryParam("ignorePantry", true)
                .queryParam("apiKey", apiKey)
                .build()
                .toUri();

        ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);

        return response.getBody();
    }

    public String getRecipeDetails(Long recipeId) {
        URI uri = UriComponentsBuilder.newInstance()
                .scheme("https")
                .host("api.spoonacular.com")
                .path("/recipes/" + recipeId + "/information")
                .queryParam("includeNutrition", false)
                .queryParam("apiKey", apiKey)
                .build()
                .toUri();

        ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
        return response.getBody();
    }

}
