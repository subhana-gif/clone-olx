import { useState, useContext } from 'react';
import { FirebaseContext } from '../../store/Context';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const { login } = useContext(FirebaseContext);
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await login(email, password);
        navigate('/');
      } catch (error) {
        setErrors({ firebase: error.message });
      }
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-card">
        <img
          src="../../../Images/olx-logo.png"
          alt="OLX Logo"
          className="login-logo"
        />
        <form onSubmit={handleLogin} className="login-form">
          <div className="login-form-group">
            <label htmlFor="email" className="login-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`login-input ${errors.email ? 'login-input-error' : ''}`}
              placeholder="Enter your email"
            />
            {errors.email && <span className="login-error-message">{errors.email}</span>}
          </div>

          <div className="login-form-group">
            <label htmlFor="password" className="login-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`login-input ${errors.password ? 'login-input-error' : ''}`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className="login-error-message">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        {errors.firebase && (
          <div className="login-firebase-error">{errors.firebase}</div>
        )}
        <button
          onClick={() => navigate('/signup')}
          className="login-signup-link"
        >
          Signup
        </button>
      </div>
    </div>
  );
}

export default Login;

