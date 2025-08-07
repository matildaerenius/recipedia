import {
    GET_INGREDIENTS,
    ADD_INGREDIENT,
    DELETE_INGREDIENT,
    INVENTORY_ERROR,
  } from "./inventory.actionType";
  
  const initialState = {
    ingredients: [],
    error: null,
  };
  
  const inventoryReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_INGREDIENTS:
        return { ...state, ingredients: action.payload, error: null };
  
      case ADD_INGREDIENT:
        return { ...state, ingredients: [...state.ingredients, action.payload] };
  
      case DELETE_INGREDIENT:
        return {
          ...state,
          ingredients: state.ingredients.filter((i) => i.id !== action.payload),
        };
  
      case INVENTORY_ERROR:
        return { ...state, error: "Something went wrong." };
  
      default:
        return state;
    }
  };
  
  export default inventoryReducer;
  