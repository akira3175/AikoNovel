import type React from "react"
import { createContext, useState, useContext, useEffect, type ReactNode } from "react"
import * as authService from "../services/auth"

interface User {
  id: number
  username: string
  email: string
  fullname: string
  img_avatar: string | null
  img_background: string | null
  img_background_position: number
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  fetchUserInfo: () => Promise<void>
  register: (username: string, email: string, password: string, confirmPassword: string) => Promise<void>
  userInfoFetched: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInfoFetched, setUserInfoFetched] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getAccessToken()
      if (token) {
        try {
          await fetchUserInfo()
        } catch (error) {
          console.error("Failed to initialize authentication:", error)
        }
      }
    }

    initAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      await authService.login(username, password)
      await fetchUserInfo()
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setIsAuthenticated(false)
    setUserInfoFetched(false)
  }

  const fetchUserInfo = async () => {
    if (userInfoFetched) return // Nếu đã fetch rồi thì không fetch lại
    try {
      const userInfo = await authService.fetchUserInfo()
      setUser(userInfo)
      setIsAuthenticated(true)
      setUserInfoFetched(true)
    } catch (error) {
      console.error("Failed to fetch user info:", error)
      setUser(null)
      setIsAuthenticated(false)
      throw error
    }
  }

  const register = async (username: string, email: string, password: string, confirmPassword: string) => {
    try {
      await authService.register(username, email, password, confirmPassword)
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, fetchUserInfo, register, userInfoFetched }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

