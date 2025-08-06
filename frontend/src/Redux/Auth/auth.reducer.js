import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    REGISTER_SUCCESS,
    CLEAR_AUTH_MESSAGES
  } from "./auth.actionType";
  
  const initialState = {
    jwt: localStorage.getItem("jwt") || null,
    loading: false,
    error: null,
    message: null,
  };
  
  export const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOGIN_REQUEST:
        return { ...state, loading: true, error: null };
      case LOGIN_SUCCESS:
        return { ...state, jwt: action.payload, loading: false,  message: null };
      case LOGIN_FAILURE:
        return { ...state, error: action.payload, loading: false, message: null };
        case REGISTER_SUCCESS:
  return {
    ...state,
    loading: false,
    error: null,
    message: action.payload,
  };
  case CLEAR_AUTH_MESSAGES:
  return {
    ...state,
    message: null,
    error: null,
  };


      default:
        return state;
    }
  };
  