// src/services/authService.js
import axiosInstance from './axiosInstance';
import {jwtDecode} from 'jwt-decode';


export const register = async (userData) => {
  try {
    const response = await axiosInstance.post('/register', userData);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const login = async ({ usernameOrEmail, password }) => {
  try {
    const response = await axiosInstance.post('/login', { usernameOrEmail, password });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get('/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to get user profile';
  }
};

export const logout = async () => {
  try {
    const response = await axiosInstance.post('/logout');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Logout failed';
  }
};

// Check if token is expired
export const isTokenExpired = () => {
  const token = localStorage.getItem('token');
  if (!token) return true; // If no token, treat it as expired

  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now(); // Convert `exp` to milliseconds
  } catch (error) {
    return true; // If token is invalid, consider it expired
  }
};

// 🔄 Auto-check for token expiration and logout
export const checkTokenExpiration = (navigate) => {
  if (isTokenExpired()) {
    localStorage.removeItem('token');
    navigate('/login');
  }

  setInterval(() => {
    if (isTokenExpired()) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, 60000); // Check every minute
};