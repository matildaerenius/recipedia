import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUserAction } from "../../Redux/Auth/auth.action";
import { Formik, Form, Field, ErrorMessage } from "formik";
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
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  username: Yup.string().required("Required"),
  email: Yup.string().email("Invalid").required("Required"),
  address: Yup.string().required("Required"),
  password: Yup.string().min(6).required("Required"),
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    dispatch(registerUserAction(values, navigate));
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <Field name="firstName" placeholder="First Name" />
        <ErrorMessage name="firstName" component="div" className="error" />

        <Field name="lastName" placeholder="Last Name" />
        <ErrorMessage name="lastName" component="div" className="error" />

        <Field name="username" placeholder="Username" />
        <ErrorMessage name="username" component="div" className="error" />

        <Field name="email" type="email" placeholder="Email" />
        <ErrorMessage name="email" component="div" className="error" />

        <Field name="address" placeholder="Address" />
        <ErrorMessage name="address" component="div" className="error" />

        <Field name="password" type="password" placeholder="Password" />
        <ErrorMessage name="password" component="div" className="error" />

        <button type="submit" className="submit-btn">
          Register
        </button>
      </Form>
    </Formik>
  );
};

export default Register;
