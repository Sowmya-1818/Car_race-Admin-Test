"use client"

import React, { useState, useEffect } from "react"
import { Card, Alert, Spinner } from "react-bootstrap"
import { useNavigate, Link } from "react-router-dom"
import { CButton, CForm, CFormInput, CInputGroup, CInputGroupText } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilEnvelopeClosed, cilLockLocked } from "@coreui/icons"
import * as Yup from "yup"
import { Formik } from "formik"
import { postData } from "../../../apiConfigs/apiCalls";
import {ADMIN_LOGIN } from "../../../apiConfigs/endpoints";

import Breadcrumb from "../../../layouts/AdminLayout/Breadcrumb"

const SignIn = () => {
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)

  // Load email and password from localStorage if available
  useEffect(() => {
    const savedEmail = localStorage.getItem("email")
    const savedPassword = localStorage.getItem("password")
    if (savedEmail && savedPassword) {
      setRememberMe(true) // Set remember me to true if values exist in localStorage
    }
  }, [])

const handleLogin = async (values, { setSubmitting }) => {
  const { email, password } = values;
  setError("");
  setLoading(true);

  if (!email || !password) {
    setError("Email and password are required.");
    setLoading(false);
    setSubmitting(false);
    return;
  }

  try {
    // Use your postData helper with ADMIN_LOGIN endpoint
    const data = await postData(ADMIN_LOGIN, { email, password });

    if (data && data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("id", data.user.id);

      if (rememberMe) {
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      }

      navigate("/dashboard");
    } else {
      setError(data.message || "Invalid email or password. Please try again.");
    }
  } catch (error) {
    setError(error.message || "Invalid email or password. Please try again.");
  } finally {
    setLoading(false);
    setSubmitting(false);
  }
};

  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless text-center">
            <Card.Body>
              <div className="mb-4">
                <i className="feather icon-unlock auth-icon" style={{ color: "#00B5E2" }} />
              </div>

              <h4 className="mb-3" style={{ color: "#0A2A38" }}>
                Login
              </h4>
              <p className="mb-4 text-muted">Enter your email address and password to access admin panel.</p>

              {error && <Alert variant="danger">{error}</Alert>}

              <Formik
                initialValues={{
                  email: localStorage.getItem("email") || "",
                  password: localStorage.getItem("password") || "",
                  submit: null,
                }}
                validationSchema={Yup.object().shape({
                  email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
                  password: Yup.string().max(255).required("Password is required"),
                })}
                onSubmit={handleLogin}
              >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                  <CForm onSubmit={handleSubmit}>
                    <CInputGroup className="mb-3">
                      <CInputGroupText style={{ backgroundColor: "#00B5E2", color: "white" }}>
                        <CIcon icon={cilEnvelopeClosed} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        name="email"
                        autoComplete="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </CInputGroup>
                    {touched.email && errors.email && (
                      <div className="text-danger text-start mb-3 ms-1" style={{ fontSize: "0.875rem" }}>
                        {errors.email}
                      </div>
                    )}

                    <CInputGroup className="mb-3">
                      <CInputGroupText style={{ backgroundColor: "#00B5E2", color: "white" }}>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        name="password"
                        autoComplete="current-password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </CInputGroup>
                    {touched.password && errors.password && (
                      <div className="text-danger text-start mb-3 ms-1" style={{ fontSize: "0.875rem" }}>
                        {errors.password}
                      </div>
                    )}

                    <div className="form-group text-start mb-4">
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="customCheck1"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          style={{ marginRight: "8px" }}
                        />
                        <label className="custom-control-label text-muted" htmlFor="customCheck1">
                          Remember me
                        </label>
                      </div>
                    </div>

                    <CButton
                      type="submit"
                      className="btn-block mb-4"
                      style={{
                        backgroundColor: "#00B5E2",
                        borderColor: "#00B5E2",
                        color: "white",
                        width: "100%",
                      }}
                      disabled={loading || isSubmitting}
                    >
                      {loading || isSubmitting ? <Spinner animation="border" size="sm" /> : "LOGIN"}
                    </CButton>
                  </CForm>
                )}
              </Formik>

              <p className="mb-0 text-muted">
                Forgot password?{" "}
                <Link to="/auth/forgotpassword" style={{ color: "#00B5E2" }}>
                  Reset
                </Link>
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  )
}

export default SignIn
