import { useState, useContext } from 'react';
import { FirebaseContext } from '../../store/Context';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useContext(FirebaseContext);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Enter a valid email';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      console.log('Signup details:', { username, email, phone, password });
      await signup(username, email, password, phone);
      navigate('/login');
    } catch (error) {
      console.error('Signup Error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setErrors((prev) => ({ ...prev, email: 'Email is already in use' }));
      } else {
        console.error('Unhandled error:', error.message);
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <img
          className="signup-logo"
          src="../../../Images/olx-logo.png"
          alt="OLX Logo"
        />
        <form onSubmit={handleSignup} className="signup-form">
          <div className="signup-form-group">
            <label htmlFor="username" className="signup-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="signup-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && (
              <span className="signup-error">{errors.username}</span>
            )}
          </div>
          <div className="signup-form-group">
            <label htmlFor="email" className="signup-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="signup-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <span className="signup-error">{errors.email}</span>}
          </div>
          <div className="signup-form-group">
            <label htmlFor="phone" className="signup-label">
              Phone
            </label>
            <input
              id="phone"
              type="text"
              className="signup-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {errors.phone && <span className="signup-error">{errors.phone}</span>}
          </div>
          <div className="signup-form-group">
            <label htmlFor="password" className="signup-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="signup-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <span className="signup-error">{errors.password}</span>
            )}
          </div>
          <button type="submit" className="signup-button">
            Signup
          </button>
        </form>
        <div className="signup-footer">
          <span>Already have an account?</span>
          <a
            className="signup-link"
            onClick={() => navigate('/login')}
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
