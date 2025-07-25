import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
  } from "./auth.actionType";
  
  const initialState = {
    jwt: localStorage.getItem("jwt") || null,
    loading: false,
    error: null,
  };
  
  export const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOGIN_REQUEST:
        return { ...state, loading: true, error: null };
      case LOGIN_SUCCESS:
        return { ...state, jwt: action.payload, loading: false };
      case LOGIN_FAILURE:
        return { ...state, error: action.payload, loading: false };
      default:
        return state;
    }
  };
  