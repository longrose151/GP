import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../api';
import Spinner from '../components/Spinner';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Trim whitespace before submission
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    try {
      const response = await api.post('/login/', { 
        username: trimmedUsername, 
        password: trimmedPassword 
      });

      const accessToken = response.data.access;
      const refreshToken = response.data.refresh;
      const userType = response.data.user_type;
      const userName = response.data.user_name;
      sessionStorage.setItem('access_token', accessToken);
      sessionStorage.setItem('refresh_token', refreshToken);
      sessionStorage.setItem('user_type', userType);
      sessionStorage.setItem('user_name', userName);

      if (sessionStorage.getItem('access_token')) {
        if (userType === '1') {
          navigate('/admin');
        } else if (userType === '2') {
          navigate('/landing');
        }
      } else {
        console.error('Access token is missing after login!');
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid credentials. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleTrimInput = (setter) => (e) => {
    setter(e.target.value.trim());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-gray">
      <div className="max-w-lg w-full p-12 bg-light-beige rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-semibold text-beige">Login</h2>
          <p className="mt-2 text-center text-lg text-dark-blue">
            Enter Credentials to Login
          </p>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {loading ? (
          <Spinner loading={loading} />
        ) : (
          <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 border-2 border-beige placeholder-dark-blue focus:outline-none focus:ring-beige focus:ring-opacity-50 text-dark-blue bg-white"
                placeholder="Username or Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={handleTrimInput(setUsername)} // Trim on blur
              />
              <div className="relative mt-4">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-4 py-3 border-2 border-beige placeholder-dark-blue focus:outline-none focus:ring-beige focus:ring-opacity-50 text-dark-blue bg-white"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handleTrimInput(setPassword)} // Trim on blur
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-dark-blue"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-beige text-dark-blue font-bold rounded-md hover:bg-light-beige focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beige"
            >
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginForm;
