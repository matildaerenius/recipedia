import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUserAction } from "../../Redux/Auth/auth.action";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Eye, EyeOff } from "lucide-react";
import * as Yup from "yup";
import "./auth.css";

const initialValues = { username: "", password: "", stayLoggedIn: false };

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().min(6).required("Password is required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (values) => {
    const { stayLoggedIn, ...credentials } = values;

    dispatch(loginUserAction(credentials, navigate, stayLoggedIn));
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        {}
        <Field name="username" type="text" placeholder="Username" />
        <ErrorMessage
          name="username"
          component="div"
          className="error-message"
        />

        {}
        <Field name="password">
          {({ field, meta }) => (
            <div className="password-wrapper">
              <input
                {...field}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={meta.touched && meta.error ? "input-error" : ""}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          )}
        </Field>
        <ErrorMessage
          name="password"
          component="div"
          className="error-message"
        />
        <div className="stay-logged-in">
          <label className="toggle-label">
            <Field
              type="checkbox"
              name="stayLoggedIn"
              className="toggle-input"
            />
            <span className="toggle-slider" />
            <span className="toggle-text">Stay logged in</span>
          </label>
        </div>

        {}
        <button type="submit" className="submit-btn">
          Sign in
        </button>
      </Form>
    </Formik>
  );
};

export default Login;
