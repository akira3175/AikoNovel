import axios from 'axios';
import { validateUsername, validateEmail, validatePassword, 
  validateConfirmPassword } from "../utils/validation"

const API_URL = process.env.REACT_APP_API_URL;

// Get the access token from localStorage
export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Get the refresh token from localStorage
export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

// Save the access token to localStorage
export const setAccessToken = (token: string) => {
  localStorage.setItem('accessToken', token);
};

// Save the refresh token to localStorage
export const setRefreshToken = (token: string) => {
  localStorage.setItem('refreshToken', token);
};

// Remove the access token from localStorage
export const removeAccessToken = () => {
  localStorage.removeItem('accessToken');
};

// Remove the refresh token from localStorage
export const removeRefreshToken = () => {
  localStorage.removeItem('refreshToken');
};

// Update the Authorization header for axios
export const setAuthToken = (token: string) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Refresh the access token using the refresh token
export const refreshToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post(`${API_URL}/user/token/refresh/`, { refresh: refreshToken });
    const { access } = response.data;

    // Save the new access token
    setAccessToken(access);
    setAuthToken(access);
    return access;
  } catch (error) {
    // Clear tokens and reset Authorization header on failure
    removeAccessToken();
    removeRefreshToken();
    setAuthToken('');
    throw error;
  }
};

// Axios Interceptor for automatic token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const newAccessToken = await refreshToken();
        error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axios(error.config); // Retry the original request with the new token
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        handleAuthError();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Handle authentication errors
export const handleAuthError = () => {
  alert("Session expired. Please log in again.");
  removeAccessToken();
  removeRefreshToken();
  setAuthToken('');
  window.location.href = "/login"; // Redirect to login page
};

// Login and save tokens to localStorage
export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/user/login/`, { username, password });
    const { access, refresh } = response.data;

    // Save tokens to localStorage
    setAccessToken(access);
    setRefreshToken(refresh);

    // Update Authorization header
    setAuthToken(access);
    return { access, refresh };
  } catch (error) {
    throw new Error('Invalid username or password');
  }
};

// Register 
export const register = async (
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
): Promise<void> => {
  try {
    const usernameError = await validateUsername(username);
    if (usernameError) throw new Error(usernameError);

    const emailError = await validateEmail(email);
    if (emailError) throw new Error(emailError);

    const passwordError = validatePassword(password);
    if (passwordError) throw new Error(passwordError);

    const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
    if (confirmPasswordError) throw new Error(confirmPasswordError);

    const response = await axios.post(`${API_URL}/user/register/`, {
      username,
      email,
      password,
    });

    if (response.status !== 201) {
      throw new Error('Registration failed. Please try again.');
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Registration failed. Please try again.');
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
}

// Logout and clear tokens from localStorage
export const logout = () => {
  removeAccessToken();
  removeRefreshToken();
  setAuthToken('');
};

// Fetch user information using the access token
export const fetchUserInfo = async () => {
  try {
    const token = getAccessToken();
    if (!token) throw new Error('No access token available');

    setAuthToken(token);
    const response = await axios.get(`${API_URL}/user/info/`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        // Token expired, attempt to refresh the token
        try {
          const newAccessToken = await refreshToken();
          setAuthToken(newAccessToken);
          const retryResponse = await axios.get(`${API_URL}/user/info/`);
          return retryResponse.data;
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          throw refreshError;
        }
      } else {
        console.error('Failed to fetch user info:', error.response?.data || error.message);
        throw error;
      }
    } else {
      console.error('An unknown error occurred:', error);
      throw new Error('An unknown error occurred');
    }
  }
};

