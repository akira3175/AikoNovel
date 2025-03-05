import axios from "axios"
import { getAccessToken } from "./auth"
import type { Team, Author } from "./contributors"

const API_URL = process.env.REACT_APP_API_URL

export interface BookDetails {
  id: number
  authors: Author[]
  categories: Category[]
  teams: Team[]
  title: string | null
  description: string | null
  another_name: string | null
  img: string | null
  artist: string | null
  note: string | null
  quantity_volome: number
  date_upload: string
  date_update: string
  is_deleted: boolean
  status: number
}

export interface Category {
  id: number
  name: string
  description: string
}

export interface BookStatus {
  id: number
  name: string
  code: string
  description: string
}

export interface UpdateBookData {
  title?: string
  description?: string
  another_name?: string
  img?: string
  authors?: number[]
  artist?: string
  status?: number
  teams?: number[]
  note?: string
  quantity_volome?: number
  categories?: number[]
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

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get(`${API_URL}/book/categories/`)
    return response.data
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}

export const getBookStatuses = async (): Promise<BookStatus[]> => {
  const token = getAccessToken()
  if (!token) throw new Error("No access token available")

  try {
    const response = await axios.get(`${API_URL}/book/bookstatus/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching book statuses:", error)
    throw error
  }
}

export const updateBook = async (bookId: number, updateData: UpdateBookData): Promise<BookDetails> => {
  const token = getAccessToken()
  if (!token) throw new Error("No access token available")

    console.log(updateData)
  try {
    const response = await axios.patch(`${API_URL}/book/update-book/${bookId}/`, updateData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error("Error updating book:", error)
    throw error
  }
}

