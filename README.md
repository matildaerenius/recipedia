# Recipedia
A recipe assistant where users can register, manage their personal pantry, generate recipe suggestions using real-time Spoonacular API data, create weekly meal plans, build shopping lists, rate and comment on recipes, and set dietary preferences.

## Table of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Installation & Running](#installation--running)
5. [Configuration](#configuration)
6. [API Reference](#api-reference)
7. [Testing](#testing)
8. [Future Development](#future-development)
9. [Contributing](#contributing)
10. [License](#license)
11. [Contact](#contact)

## Features
- **User Registration & Login**
    - Secure password encryption (BCrypt)
    - JWT-based authentication
    - Duplicate account protection and error handling

- **Ingredient Management**
    - Add, categorize, and remove ingredients from your virtual pantry

- **AI-Powered Recipe Suggestions**
    - Generate recipes with 100% ingredient match (all available)
    - Generate recipes with 80% match (some ingredients may be missing)

- **Weekly Meal Planner**
    - Assign recipes to each day of the week

- **Smart Shopping List**
    - Automatically adds missing ingredients for selected recipes
    - Manual addition and removal supported

- **Recipe Ratings & Reviews**
    - Rate recipes (1–5 stars), write comments, edit or delete feedback

- **Dietary Preferences**
    - Set personal preferences (vegan, lactose-free, etc.)

## Tech Stack

### Backend
- **Language & Framework**: Java 22, Spring Boot 3
- **Data**: Spring Data JPA, MySQL 8
- **Build Tool**: Maven
- **Utilities**: Lombok
- **Security**: Spring Security, JWT
- **Testing**: Postman
- **IDE**: IntelliJ IDEA

### Frontend
- **Framework**: React 18
- **State Management**: Redux

## Prerequisites

### Backend
- Java 17+
- Maven 3.6+
- Lombok
- MySQL 8 (with database `recipedia` created)

### Frontend
- Node.js >= 16
- npm >= 8
## Prerequisites

### Backend
- Java 17+
- Maven 3.6+
- Lombok
- MySQL 8 (with database `buzz` created)

### Frontend
- Node.js >= 16
- npm >= 8

## Installation & Running

## Configuration

Before you run the app, copy the example properties and set your real values:

## API Reference

## Importing Postman Collection

## Testing

## Future Development

## Contributing
- Fork and clone the repository
- Create a branch: feature/your-feature-name
- Commit and push following the Conventional Commits specification
- Open a Pull Request

## License
MIT © Matilda Erenius

## Contact
matildaerenius@hotmail.com · GitHub