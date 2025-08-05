import axios from "../../config/axiosConfig";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
} from "./auth.actionType";

// Login user
export const loginUserAction = (credentials, navigate, stayLoggedIn) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const { data } = await axios.post("/api/auth/login", credentials);

    
    if (stayLoggedIn) {
      localStorage.setItem("jwt", data.token);
    } else {
      sessionStorage.setItem("jwt", data.token);
    }

    dispatch({ type: LOGIN_SUCCESS, payload: data.token });
    navigate("/");
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.response?.data?.message || "Login failed",
    });
  }
};


// Register user
export const registerUserAction = (userData, navigate) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const { data } = await axios.post("/api/auth/register", userData); 
    localStorage.setItem("jwt", data.token);

    dispatch({ type: LOGIN_SUCCESS, payload: data.token });
    navigate("/"); 
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.response?.data?.message || "Registration failed",
    });
  }
};
