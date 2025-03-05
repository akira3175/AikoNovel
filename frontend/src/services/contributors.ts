import axios from "axios"
import { getAccessToken } from "./auth"
import { Author, Team, TeamMember, Role } from "../types/contributors"

const API_URL = process.env.REACT_APP_API_URL



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

export const getTeamsByBookId = async (bookId: number): Promise<Team[]> => {
  try {
    const token = getAccessToken()
    if (!token) throw new Error("No access token available")

    const response = await axios.get(`${API_URL}/book/${bookId}/teams/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching teams for book:", error)
    throw error
  }
}

export const updateTeamForBook = async (bookId: number, teamId: number): Promise<void> => {
  try {
    const token = getAccessToken()
    if (!token) throw new Error("No access token available")

    await axios.put(
      `${API_URL}/book/${bookId}/update-team/`,
      { team_id: teamId },
      { headers: { Authorization: `Bearer ${token}` } },
    )
  } catch (error) {
    console.error("Error updating team for book:", error)
    throw error
  }
}


