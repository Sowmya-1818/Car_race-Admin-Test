'use client';

import React, { useState } from 'react';
import { Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { CButton, CForm, CFormInput, CInputGroup, CInputGroupText } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilEnvelopeClosed, cilLockLocked } from '@coreui/icons';
import { postData } from "../../../apiConfigs/apiCalls";
import { FORGOT_PASSWORD, RESET_PASSWORD } from "../../../apiConfigs/endpoints";

import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

const handleForgotPassword = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  if (!email) {
    setError('Email is required.');
    return;
  }

  setLoading(true);

  try {
    // Using your postData helper with the endpoint constant
    const response = await postData(FORGOT_PASSWORD, { email });

    if (response && response.success !== false) {
      setSuccess('OTP sent to your email.');
      setStep(2);
    } else {
      setError(response?.message || 'Failed to send OTP. Please try again.');
    }
  } catch (error) {
    setError('Failed to send OTP. Please try again.');
  } finally {
    setLoading(false);
  }
};

const handleResetPassword = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  if (!otp || !newPassword || !confirmPassword) {
    setError('All fields are required.');
    return;
  }

  if (newPassword !== confirmPassword) {
    setError('Passwords do not match.');
    return;
  }

  setLoading(true);

  try {
    const response = await postData(RESET_PASSWORD, {
      email,
      otp,
      newPassword,
      confirmPassword,
    });

    if (response && response.success !== false) {
      setSuccess('Password reset successfully.');
      setTimeout(() => navigate('/'), 3000);
    } else {
      setError(response?.message || 'Failed to reset password. Please try again.');
    }
  } catch (error) {
    setError('Failed to reset password. Please try again.');
  } finally {
    setLoading(false);
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
                <i className="feather icon-mail auth-icon" style={{ color: '#00B5E2' }} />
              </div>

              {step === 1 ? (
                <div>
                  <h4 className="mb-3" style={{ color: '#0A2A38' }}>
                    Forgot Password
                  </h4>
                  <p className="mb-4 text-muted">Enter your registered email address, we will send a verification code.</p>

                  {error && <Alert variant="danger">{error}</Alert>}
                  {success && <Alert variant="success">{success}</Alert>}

                  <CForm onSubmit={handleForgotPassword}>
                    <CInputGroup className="mb-3">
                      <CInputGroupText style={{ backgroundColor: '#00B5E2', color: 'white' }}>
                        <CIcon icon={cilEnvelopeClosed} />
                      </CInputGroupText>
                      <CFormInput placeholder="Email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </CInputGroup>

                    <CButton
                      type="submit"
                      className="btn-block mb-4"
                      style={{
                        backgroundColor: '#00B5E2',
                        borderColor: '#00B5E2',
                        color: 'white',
                        width: '100%'
                      }}
                      disabled={loading}
                    >
                      {loading ? <Spinner animation="border" size="sm" /> : 'Send OTP'}
                    </CButton>
                  </CForm>

                  <p className="mb-0 text-muted">
                    <Link to="/" style={{ color: '#00B5E2' }}>
                      Back to Login
                    </Link>
                  </p>
                </div>
              ) : (
                <div>
                  <h4 className="mb-3" style={{ color: '#0A2A38' }}>
                    Reset Password
                  </h4>
                  <p className="mb-4 text-muted">Enter the OTP sent to your email and your new password</p>

                  {error && <Alert variant="danger">{error}</Alert>}
                  {success && <Alert variant="success">{success}</Alert>}

                  <CForm onSubmit={handleResetPassword}>
                    <CInputGroup className="mb-3">
                      <CInputGroupText style={{ backgroundColor: '#00B5E2', color: 'white' }}>OTP</CInputGroupText>
                      <CFormInput placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                    </CInputGroup>

                    <CInputGroup className="mb-3">
                      <CInputGroupText style={{ backgroundColor: '#00B5E2', color: 'white' }}>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-4">
                      <CInputGroupText style={{ backgroundColor: '#00B5E2', color: 'white' }}>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </CInputGroup>

                    <CButton
                      type="submit"
                      className="btn-block mb-4"
                      style={{
                        backgroundColor: '#00B5E2',
                        borderColor: '#00B5E2',
                        color: 'white',
                        width: '100%'
                      }}
                      disabled={loading}
                    >
                      {loading ? <Spinner animation="border" size="sm" /> : 'Reset Password'}
                    </CButton>
                  </CForm>

                  <p className="mb-0 text-muted">
                    <a href="#" onClick={() => setStep(1)} style={{ color: '#00B5E2' }}>
                      Back to Previous Step
                    </a>
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ForgotPassword;
