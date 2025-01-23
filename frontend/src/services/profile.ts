import axios from "axios"
import { getAccessToken, refreshToken, setAuthToken } from "./auth"

const API_URL = process.env.REACT_APP_API_URL

export interface ProfileData {
  username: string
  full_name: string
  img_avatar: string | null
  img_background: string | null
  img_background_position: number
}

const axiosInstance = axios.create({
  baseURL: API_URL,
})

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getAccessToken()
    if (!token) {
      throw new Error("No access token available")
    }
    config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const newToken = await refreshToken()
        setAuthToken(newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError)
        throw refreshError
      }
    }
    return Promise.reject(error)
  },
)

export const fetchProfile = async (username: string): Promise<ProfileData> => {
  try {
    const response = await axiosInstance.get(`/user/${username}/`)
    return response.data
  } catch (error) {
    console.error("Error fetching profile:", error)
    throw error
  }
}

export const updateFullName = async (full_name: string): Promise<void> => {
  try {
    await axiosInstance.patch("/user/update-fullname/", { full_name })
    console.log("Full name updated successfully")
  } catch (error) {
    console.error("Error updating full name:", error)
    throw error
  }
}

export const updateAvatar = async (formData: FormData): Promise<void> => {
  try {
    await axiosInstance.patch("/user/update-avatar/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    console.log("Avatar updated successfully")
  } catch (error) {
    console.error("Error updating avatar:", error)
    throw error
  }
}

export const updateBackground = async (formData: FormData): Promise<void> => {
  try {
    await axiosInstance.patch("/user/update-background/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    console.log("Background updated successfully")
  } catch (error) {
    console.error("Error updating background:", error)
    throw error
  }
}

