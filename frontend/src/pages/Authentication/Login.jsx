import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUserAction } from "../../Redux/Auth/auth.action";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./auth.css";

const initialValues = { username: "", password: "" };

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().min(6).required("Password is required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    dispatch(loginUserAction(values, navigate));
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <Field name="username" type="text" placeholder="Username" />
        <ErrorMessage name="username" component="div" className="error" />

        <Field name="password" type="password" placeholder="Password" />
        <ErrorMessage name="password" component="div" className="error" />

        <button type="submit" className="submit-btn">
          Login
        </button>
      </Form>
    </Formik>
  );
};

export default Login;
