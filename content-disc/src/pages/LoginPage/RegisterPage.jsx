import React, { useState } from 'react';
import './AuthPage.css'; 
import { register } from '../../service/apiService';

const Logo = () => <div className="auth-logo">R</div>;

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    country: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      
      const payload = {
        ...registerData,
        dateOfBirth: registerData.dateOfBirth || null
      };

      const response = await register(payload);
      console.log('Registration successful:', response);
      setSuccess('Account created successfully! Redirecting to login...');

      setTimeout(() => {
        window.location.href = '/login'; 
      }, 2500);

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-header">
          <Logo />
          <h1>Create Your Account</h1>
          <p>Join The Director's Club to begin your cinematic journey.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" onChange={handleChange} required disabled={isLoading} />
            </div>
            <div className="input-group">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" onChange={handleChange} required disabled={isLoading} />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" onChange={handleChange} required disabled={isLoading} />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" onChange={handleChange} required disabled={isLoading} />
          </div>
          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" onChange={handleChange} required disabled={isLoading} />
            </div>
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" onChange={handleChange} required disabled={isLoading} />
            </div>
          </div>
          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input type="date" id="dateOfBirth" onChange={handleChange} disabled={isLoading} />
            </div>
            <div className="input-group">
              <label htmlFor="gender">Gender</label>
              <select id="gender" onChange={handleChange} disabled={isLoading}>
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="country">Country</label>
            <input type="text" id="country" onChange={handleChange} disabled={isLoading} />
          </div>
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-redirect">
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
