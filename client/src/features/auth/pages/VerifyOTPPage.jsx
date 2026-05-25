import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { supabase } from '../../../config/supabase';
import { ROUTES } from '../../../constants';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import './ForgotPasswordPage.css'; // Reuse existing styles

const VerifyOTPPage = () => {
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const type = location.state?.type || 'signup'; // 'signup' or 'recovery'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    if (!email) {
      setError('Email address is missing. Please try again.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: type,
      });

      if (error) throw error;
      
      // Successfully verified
      if (type === 'recovery') {
        navigate(ROUTES.RESET_PASSWORD);
      } else {
        navigate(ROUTES.LOGIN); // After signup verify, ask them to login
      }
    } catch (err) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-header">
        <div className="icon-circle">
          <ShieldCheck size={28} />
        </div>
        <h1>Verify OTP</h1>
        <p>
          We've sent a one-time password (OTP) to your email.<br />
          Please enter it below to verify.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="forgot-password-form">
        <Input
          label="One-Time Password (OTP)"
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value);
            if (error) setError('');
          }}
          error={error}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isSubmitting}
          className="submit-btn"
        >
          <span>Verify</span>
          <ArrowRight size={18} />
        </Button>
      </form>
    </div>
  );
};

export default VerifyOTPPage;
