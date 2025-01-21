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

// Fetch user profile data
export const fetchProfile = async (username: string): Promise<ProfileData> => {
  try {
    const token = getAccessToken()
    if (!token) throw new Error("No access token available")

    setAuthToken(token)
    const response = await axios.get(`${API_URL}/user/${username}/`)
    return response.data
  } catch (error) {
    console.error("Error fetching profile:", error)
    throw error
  }
}

// Update user full name
export const updateFullName = async (full_name: string): Promise<void> => {
  try {
    const token = getAccessToken()
    if (!token) throw new Error("No access token available")

    const response = await axios.patch(
      `${API_URL}/user/update-fullname/`,
      { full_name },
      { headers: { Authorization: `Bearer ${token}` } },
    )

    console.log("Full name updated successfully:", response.data)
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      try {
        const newAccessToken = await refreshToken()
        setAuthToken(newAccessToken)

        const retryResponse = await axios.patch(
          `${API_URL}/user/update-fullname/`,
          { full_name },
          { headers: { Authorization: `Bearer ${newAccessToken}` } },
        )

        console.log("Full name updated successfully after token refresh:", retryResponse.data)
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError)
        throw refreshError
      }
    } else {
      console.error("Error updating full name:", error)
      throw error
    }
  }
}

// Update user avatar
export const updateAvatar = async (formData: FormData): Promise<void> => {
  try {
    const token = getAccessToken()
    if (!token) throw new Error("No access token available")

    const response = await axios.patch(`${API_URL}/user/update-avatar/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })

    console.log("Avatar updated successfully:", response.data)
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      try {
        const newAccessToken = await refreshToken()
        setAuthToken(newAccessToken)

        const retryResponse = await axios.patch(`${API_URL}/user/update-avatar/`, formData, {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
            "Content-Type": "multipart/form-data",
          },
        })

        console.log("Avatar updated successfully after token refresh:", retryResponse.data)
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError)
        throw refreshError
      }
    } else {
      console.error("Error updating avatar:", error)
      throw error
    }
  }
}

// Update user background
export const updateBackground = async (formData: FormData): Promise<void> => {
  try {
    const token = getAccessToken()
    if (!token) throw new Error("No access token available")

    const response = await axios.patch(`${API_URL}/user/update-background/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })

    console.log("Background updated successfully:", response.data)
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      try {
        const newAccessToken = await refreshToken()
        setAuthToken(newAccessToken)

        const retryResponse = await axios.patch(`${API_URL}/user/update-background/`, formData, {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
            "Content-Type": "multipart/form-data",
          },
        })

        console.log("Background updated successfully after token refresh:", retryResponse.data)
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError)
        throw refreshError
      }
    } else {
      console.error("Error updating background:", error)
      throw error
    }
  }
}

