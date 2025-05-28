import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const location = useLocation();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error: authError, isAuthenticated } = useSelector(state => state.auth);
  
  useEffect(() => {
    // Only navigate if authenticated and this component is mounted
    // The "replace" flag prevents adding to history stack
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
    
    if (authError) {
      setError(authError);
    }
  }, [authError, isAuthenticated, navigate]);  // Proper dependency array

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }
    
    dispatch(loginUser({
      email: formData.email,
      password: formData.password
    }));
  };

  return (
    <div className="auth-form">
      <h2>Login to Employee Manager</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>
        
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p className="auth-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
