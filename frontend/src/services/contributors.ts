import axios from "axios"
import { getAccessToken, refreshToken, setAuthToken } from "./auth"

const API_URL = process.env.REACT_APP_API_URL

export interface Author {
  id: number
  pen_name: string
}

export const registerAuthor = async (pen_name: string): Promise<Author> => {
  try {
    const token = getAccessToken()
    if (!token) throw new Error("No access token available")

    const response = await axios.post(
      `${API_URL}/contributors/register-author/`,
      { pen_name },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    return response.data
  } catch (error) {
    console.error("Error registering author:", error)
    throw error
  }
}

export const getPenName = async (): Promise<string> => {
  try {
    const token = getAccessToken()
    if (!token) throw new Error("No access token available")

    const response = await axios.get(`${API_URL}/contributors/get-pen-name/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data.pen_name
  } catch (error) {
    console.error("Error getting pen name:", error)
    throw error
  }
}

export const updatePenName = async (pen_name: string): Promise<Author> => {
  try {
    const token = getAccessToken()
    if (!token) throw new Error("No access token available")

    const response = await axios.put(
      `${API_URL}/contributors/update-pen-name/`,
      { pen_name },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    return response.data
  } catch (error) {
    console.error("Error updating pen name:", error)
    throw error
  }
}

