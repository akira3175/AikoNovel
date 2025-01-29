import axios from "axios"
import { validateUsername, validateEmail, validatePassword, validateConfirmPassword } from "../utils/validation"

const API_URL = process.env.REACT_APP_API_URL

// Manage time to refresh token
let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
      if (error) {
          prom.reject(error);
      } else {
          prom.resolve(token);
      }
  });

  failedQueue = [];
};

// Get the access token from localStorage
export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken")
}

// Get the refresh token from localStorage
export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken")
}

// Save the access token to localStorage
export const setAccessToken = (token: string) => {
  localStorage.setItem("accessToken", token)
}

// Save the refresh token to localStorage
export const setRefreshToken = (token: string) => {
  localStorage.setItem("refreshToken", token)
}

// Remove the access token from localStorage
export const removeAccessToken = () => {
  localStorage.removeItem("accessToken")
}

// Remove the refresh token from localStorage
export const removeRefreshToken = () => {
  localStorage.removeItem("refreshToken")
}

// Update the Authorization header for axios
export const setAuthToken = (token: string) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common["Authorization"]
  }
}

// Refresh the access token using the refresh token
// Refresh the access token using the refresh token
export const refreshToken = async () => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    throw new Error("No refresh token available")
  }

  try {
    console.log("Starting refresh token request")
    
    // Thêm cấu hình timeout và validateStatus
    const response = await axios.post(
      `${API_URL}/user/token/refresh/`, 
      { refresh: refreshToken },
      {
        timeout: 5000, // 5 seconds timeout
        validateStatus: function (status) {
          return status >= 200 && status < 500; // Chấp nhận cả status lỗi để vào catch
        }
      }
    )

    console.log("Got response:", response.status)

    // Kiểm tra status code
    if (response.status !== 200) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const { access } = response.data
    console.log("Got new access token")

    setAccessToken(access)
    setAuthToken(access)
    return access
  } catch (error) {
    console.log("Error in refreshToken:", error)
    
    // Xử lý lỗi cụ thể
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.log("Request timed out");
        throw new Error("Network timeout");
      }
      
      if (error.response?.status === 401) {
        handleAuthError();
        throw new Error("Refresh token has expired");
      }
    }
    
    handleAuthError()
    throw error
  } finally {
    console.log("RefreshToken function completed")
  }
}

// Axios Interceptor for automatic token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`
          return axios(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const newAccessToken = await refreshToken()
      processQueue(null, newAccessToken)
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`
      return axios(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      if (refreshError instanceof Error && refreshError.message.includes("Refresh token has expired")) {
        handleAuthError()
      }
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

// Handle authentication errors
export const handleAuthError = () => {
  alert("Session expired. Please log in again.")
  removeAccessToken()
  removeRefreshToken()
  setAuthToken("")
  window.location.href = "/" // Redirect to login page
}

// Login and save tokens to localStorage
export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/user/login/`, { username, password })
    const { access, refresh } = response.data

    // Save tokens to localStorage
    setAccessToken(access)
    setRefreshToken(refresh)

    // Update Authorization header
    setAuthToken(access)
    return { access, refresh }
  } catch (error) {
    throw new Error("Invalid username or password")
  }
}

// Register
export const register = async (
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
): Promise<void> => {
  try {
    const usernameError = await validateUsername(username)
    if (usernameError) throw new Error(usernameError)

    const emailError = await validateEmail(email)
    if (emailError) throw new Error(emailError)

    const passwordError = validatePassword(password)
    if (passwordError) throw new Error(passwordError)

    const confirmPasswordError = validateConfirmPassword(password, confirmPassword)
    if (confirmPasswordError) throw new Error(confirmPasswordError)

    const response = await axios.post(`${API_URL}/user/register/`, {
      username,
      email,
      password,
    })

    if (response.status !== 201) {
      throw new Error("Registration failed. Please try again.")
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Registration failed. Please try again.")
    }
    throw new Error("An unexpected error occurred. Please try again.")
  }
}

// Logout and clear tokens from localStorage
export const logout = () => {
  removeAccessToken()
  removeRefreshToken()
  setAuthToken("")
}

// Fetch user information using the access token
export const fetchUserInfo = async () => {
  try {
    const token = getAccessToken()
    if (!token) throw new Error("No access token available")

    setAuthToken(token)
    const response = await axios.get(`${API_URL}/user/info/`)
    return response.data
  } catch (error: unknown) {
    throw new Error("An unknown error occurred")
  }
}

