import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { registerUserAction } from "../../Redux/Auth/auth.action";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Eye, EyeOff } from "lucide-react";
import * as Yup from "yup";
import "./auth.css";

const initialValues = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  address: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  address: Yup.string().required("Address is required"),
  password: Yup.string().min(6).required("Password is required"),
});

const Register = ({ setIsRegistering }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (values) => {
    dispatch(registerUserAction(values, setIsRegistering));
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <Field name="firstName" placeholder="First Name" />
        <ErrorMessage
          name="firstName"
          component="div"
          className="error-message"
        />

        <Field name="lastName" placeholder="Last Name" />
        <ErrorMessage
          name="lastName"
          component="div"
          className="error-message"
        />

        <Field name="username" placeholder="Username" />
        <ErrorMessage
          name="username"
          component="div"
          className="error-message"
        />

        <Field name="email" type="email" placeholder="Email" />
        <ErrorMessage name="email" component="div" className="error-message" />

        <Field name="address" placeholder="Address" />
        <ErrorMessage
          name="address"
          component="div"
          className="error-message"
        />

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
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
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

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </Form>
    </Formik>
  );
};
export default Register;
