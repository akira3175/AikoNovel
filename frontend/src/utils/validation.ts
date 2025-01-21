import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL

export const validateUsername = async (username: string): Promise<string> => {
  if (username.length < 8 || username.length > 32) {
    return "Tên người dùng phải có từ 8 đến 32 ký tự!"
  }
  try {
    const response = await axios.get(`${API_URL}/user/check-username/?username=${username}`)
    if (response.status === 200) {
      return ""
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      return "Tên người dùng đã tồn tại!"
    }
  }
  return "Lỗi kiểm tra tên người dùng. Vui lòng thử lại."
}

export const validateEmail = async (email: string): Promise<string> => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return "Email không hợp lệ!"
  }
  try {
    const response = await axios.get(`${API_URL}/user/check-email/?email=${email}`)
    if (response.status === 200) {
      return ""
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      return "Email đã tồn tại!"
    }
  }
  return "Lỗi kiểm tra email. Vui lòng thử lại."
}

export const validatePassword = (password: string): string => {
  if (password.length < 8) {
    return "Mật khẩu phải chứa ít nhất 8 ký tự!"
  }
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    return "Mật khẩu phải chứa ít nhất một chữ cái và một chữ số!"
  }
  return ""
}

export const validateConfirmPassword = (password: string, confirmPassword: string): string => {
  if (password !== confirmPassword) {
    return "Mật khẩu nhập lại không khớp!"
  }
  return ""
}

