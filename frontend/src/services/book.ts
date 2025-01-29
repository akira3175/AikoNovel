import axios from "axios"
import { getAccessToken } from "./auth"

const API_URL = process.env.REACT_APP_API_URL

export interface Author {
  id: number
  pen_name: string
  username: string
}

export interface BookDetails {
  id: number
  authors: Author[]
  title: string | null
  description: string | null
  another_name: string | null
  img: string | null
  artist: string | null
  workerid: number
  note: string | null
  quantity_volome: number
  date_upload: string
  date_update: string
  is_deleted: boolean
  status: number
  categories: any[]
}

export const createBook = async (title: string): Promise<{ id: number; title: string }> => {
  const token = getAccessToken()
  if (!token) throw new Error("No access token available")

  try {
    const response = await axios.post(
      `${API_URL}/book/create-book/author/`,
      { title },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    return response.data
  } catch (error) {
    console.error("Error creating book:", error)
    throw error
  }
}

export const getBookDetails = async (id: number): Promise<BookDetails> => {
  const token = getAccessToken()
  if (!token) throw new Error("No access token available")

  try {
    const response = await axios.get(`${API_URL}/book/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching book details:", error)
    throw error
  }
}

export const getAuthorBooks = async (penName: string): Promise<BookDetails[]> => {
  const token = getAccessToken()
  if (!token) throw new Error("No access token available")

  try {
    const response = await axios.get(`${API_URL}/book/author/pen_name/${penName}/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching author books:", error)
    throw error
  }
}

export const updateBookDetails = async (book: BookDetails): Promise<BookDetails> => {
  const token = getAccessToken()
  if (!token) throw new Error("No access token available")

  try {
    const response = await axios.put(`${API_URL}/book/${book.id}/`, book, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error("Error updating book details:", error)
    throw error
  }
}