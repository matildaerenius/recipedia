import axios from "../../config/axiosConfig";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_SUCCESS,
  CLEAR_AUTH_MESSAGES,
} from "./auth.actionType";
import { toast } from "react-toastify";



// Login user
export const loginUserAction = (credentials, navigate, stayLoggedIn) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const { data } = await axios.post("/auth/login", credentials);
    if (stayLoggedIn) {
      localStorage.setItem("jwt", data.token);
    } else {
      sessionStorage.setItem("jwt", data.token);
    }

    dispatch({ type: LOGIN_SUCCESS, payload: data.token });
    
    toast.success("Login successful!");

    
    setTimeout(() => {
      navigate("/");
    }, 1500);
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.response?.data?.message || "Login failed",
    });

    toast.error(error.response?.data?.message || "Login failed");
  }
};

// Register user
export const registerUserAction = (userData, setIsRegistering) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const { data } = await axios.post("/auth/register", userData); 
    localStorage.setItem("jwt", data.token);
    

    dispatch({
      type: REGISTER_SUCCESS,
      payload: "Registration successful!",
    });

    toast.success("Registration successful!");

    
    setTimeout(() => {
      setIsRegistering(false);
    }, 1500);
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.response?.data || "Registration failed",
    });
    toast.error(error.response?.data || "Registration failed");
  }
};
export const clearAuthMessages = () => ({
  type: CLEAR_AUTH_MESSAGES,
});

