// src/services/authService.js
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:5000/api';

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const login = async ({ usernameOrEmail, password }) => {
  try {
      const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ usernameOrEmail, password }),
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw { response: { data: errorData } }; // Modified this line.
      }

      return response.json(); // Return the whole response
  } catch (err) {
      throw err; // Changed to throw the entire err object, for easier error handling in the catch block of Login.js
  }
};

export const getUserProfile = async () => { // Changed to get token from localStorage
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to get user profile';
  }
};

export const logout = async () => { // Changed to get token from localStorage
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axios.post(`${API_URL}/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Logout failed';
  }
};

//checking if token expired
export const isTokenExpired = () => {
  const token = localStorage.getItem("token");
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
    localStorage.removeItem("token");
    navigate("/login");
  }

  setInterval(() => {
    if (isTokenExpired()) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, 60000);//check every minute
}