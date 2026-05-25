import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, X } from 'lucide-react';
import { supabase } from '../../../config/supabase';
import useAuthStore from '../../../store/useAuthStore';
import { ROUTES } from '../../../constants';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import './ChangePasswordModal.css';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Verify old password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPassword,
      });

      if (signInError) {
        throw new Error('Incorrect old password');
      }

      // 2. Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        throw updateError;
      }

      alert('Password updated successfully!');
      onClose();
      
      // Reset form
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    onClose();
    navigate(ROUTES.FORGOT_PASSWORD);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content change-password-modal">
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="modal-header">
          <div className="modal-icon-wrapper">
            <Lock size={24} />
          </div>
          <h2>Change Password</h2>
          <p>Update your password to keep your account secure.</p>
        </div>

        <form onSubmit={handleSubmit} className="change-password-form">
          <Input
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            value={oldPassword}
            onChange={(e) => {
              setOldPassword(e.target.value);
              if (error) setError('');
            }}
            rightLabel={
              <button type="button" onClick={handleForgotPassword} className="forgot-password-link">
                Forgot password?
              </button>
            }
          />

          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (error) setError('');
            }}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (error) setError('');
            }}
            error={error}
          />

          <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
