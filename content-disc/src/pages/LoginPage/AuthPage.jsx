import React, { useState } from 'react';
import './AuthPage.css'; 
import { login } from '../../service/apiService';

const Logo = () => <div className="auth-logo">R</div>;

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await login(email, password);
      console.log('Login successful:', response);
      if (response.accessToken) 
      {
        localStorage.setItem('authToken', response.accessToken);
        window.location.href = '/'; 
      } 
      else {
        throw new Error("Login successful, but no token received.");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Logo />
          <h1>Welcome Back</h1>
          <p>Log in to access your curated collection.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., name@example.com"
              required
              disabled={isLoading}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading} 
            />
          </div>
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <a href="/forgot-password">Forgot Password?</a>
        </div>

        <div className="auth-redirect">
          <p>Don't have an account? <a href="/register">Sign Up</a></p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
