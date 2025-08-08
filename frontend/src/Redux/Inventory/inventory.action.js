import axiosInstance from "../../config/axiosPrivate";
import {
  GET_INGREDIENTS,
  ADD_INGREDIENT,
  DELETE_INGREDIENT,
  UPDATE_INGREDIENT_SUCCESS,
  INVENTORY_ERROR,
} from "./inventory.actionType";
import { toast } from "react-toastify";

export const getIngredients = () => async (dispatch) => {
  try {
    const res = await axiosInstance.get("/api/ingredients");
    dispatch({ type: GET_INGREDIENTS, payload: res.data });
  } catch (error) {
    dispatch({ type: INVENTORY_ERROR });
    toast.error("Failed to load inventory");
  }
};

export const addIngredient = (ingredientData) => async (dispatch) => {
  try {
    const res = await axiosInstance.post("/api/ingredients", ingredientData);
    dispatch({ type: ADD_INGREDIENT, payload: res.data });
    toast.success("Ingredient added");
  } catch (error) {
    dispatch({ type: INVENTORY_ERROR });
    toast.error("Failed to add ingredient");
  }
};

export const deleteIngredient = (id) => async (dispatch) => {
  try {
    await axiosInstance.delete(`/api/ingredients/${id}`);
    dispatch({ type: DELETE_INGREDIENT, payload: id });
    toast.success("Ingredient deleted");
  } catch (error) {
    dispatch({ type: INVENTORY_ERROR });
    toast.error("Failed to delete ingredient");
  }
};
export const updateIngredient = (id, updatedData) => async (dispatch) => {
    try {
      const res = await axiosInstance.put(`/api/ingredients/${id}`, updatedData);
      dispatch({ type: UPDATE_INGREDIENT_SUCCESS, payload: res.data });
    } catch (error) {
      console.error("Update failed", error);
    }
  };
