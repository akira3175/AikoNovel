import type React from "react"
import { useState, useEffect } from "react"
import { Modal, Box, Typography, TextField, Button, Link, styled, InputAdornment, IconButton } from "@mui/material"
import { Close as CloseIcon, Visibility, VisibilityOff } from "@mui/icons-material"
import useDebounce from "../../hooks/useDebounce"
import { validateUsername, validateEmail, validatePassword, validateConfirmPassword } from "../../utils/validation"
import SuccessModal from "../ui/SuccessModal"
import FailureModal from "../ui/FailureModal"

const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: "24px",
  boxShadow: "0 12px 32px 4px rgba(0, 0, 0, .04), 0 8px 20px rgba(0, 0, 0, .08)",
  padding: "32px",
  width: "400px",
  maxWidth: "90%",
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    height: "100%",
    borderRadius: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
}))

const Logo = styled("div")(({ theme }) => ({
  backgroundImage: "url(/images/logo/main-logo-1.png)",
  backgroundSize: "cover",
  width: "60px",
  height: "60px",
  margin: "-8px auto 18px auto",
  [theme.breakpoints.down("sm")]: {
    width: "80px",
    height: "80px",
    margin: "0 auto 24px auto",
  },
}))

const CloseButton = styled(CloseIcon)({
  position: "absolute",
  top: "16px",
  right: "16px",
  cursor: "pointer",
})

const StyledTextField = styled(TextField)({
  marginTop: "16px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
  },
})

const StyledButton = styled(Button)({
  width: "100%",
  minHeight: "48px",
  borderRadius: "12px",
  marginTop: "20px",
  marginBottom: "12px",
})

interface RegisterModalProps {
  open: boolean
  onClose: () => void
  onRegister: (username: string, email: string, password: string, confirmPassword: string) => Promise<boolean>
  onSwitchToLogin: () => void
  isLoading: boolean
}

const RegisterModal: React.FC<RegisterModalProps> = ({ open, onClose, onRegister, onSwitchToLogin, isLoading }) => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showFailureModal, setShowFailureModal] = useState(false)

  type ErrorState = {
    username: string
    email: string
    password: string
    confirmPassword: string
    general: string
  }

  const [errors, setErrors] = useState<ErrorState>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  })

  const debouncedUsername = useDebounce(username, 2000)
  const debouncedEmail = useDebounce(email, 2000)
  const debouncedPassword = useDebounce(password, 100)
  const debouncedConfirmPassword = useDebounce(confirmPassword, 100)

  useEffect(() => {
    const validateField = async () => {
      if (debouncedUsername) {
        const usernameError = await validateUsername(debouncedUsername)
        setErrors((prev) => ({ ...prev, username: usernameError }))
      }
    }
    validateField()
  }, [debouncedUsername])

  useEffect(() => {
    const validateField = async () => {
      if (debouncedEmail) {
        const emailError = await validateEmail(debouncedEmail)
        setErrors((prev) => ({ ...prev, email: emailError }))
      }
    }
    validateField()
  }, [debouncedEmail])

  useEffect(() => {
    const validateField = () => {
      if (debouncedPassword) {
        const passwordError = validatePassword(debouncedPassword)
        setErrors((prev) => ({ ...prev, password: passwordError }))
      }
    }
    validateField()
  }, [debouncedPassword])

  useEffect(() => {
    const validateField = () => {
      if (debouncedConfirmPassword) {
        const confirmPasswordError = validateConfirmPassword(password, debouncedConfirmPassword)
        setErrors((prev) => ({ ...prev, confirmPassword: confirmPasswordError }))
      }
    }
    validateField()
  }, [debouncedConfirmPassword, password])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await onRegister(username, email, password, confirmPassword)
    console.log(success)
    if (success) {
      setShowSuccessModal(true)
    } else {
      setShowFailureModal(true)
      setErrors((prev) => ({ ...prev, general: "Registration failed. Please try again." }))
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    onClose()
  }

  const handleFailureModalClose = () => {
    setShowFailureModal(false)
  }

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);
  
  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      general: '',
    });
  };  

  return (
    <>
      <StyledModal open={open} onClose={onClose}>
        <ModalContent>
          <CloseButton onClick={onClose} />
          <Logo />
          <Typography variant="h5" align="center" gutterBottom>
            Đăng ký tài khoản
          </Typography>
          <form onSubmit={handleRegister}>
            <StyledTextField
              fullWidth
              label="Tên người dùng"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              error={!!errors.username}
              helperText={errors.username}
            />
            <StyledTextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              error={!!errors.email}
              helperText={errors.email}
            />
            <StyledTextField
              fullWidth
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <StyledTextField
              fullWidth
              label="Xác nhận mật khẩu"
              type={showConfirmPassword ? "text" : "password"}
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errors.general && (
              <Typography color="error" variant="body2" align="left" sx={{ mt: 1 }}>
                {errors.general}
              </Typography>
            )}
            <StyledButton type="submit" variant="contained" color="primary" disabled={isLoading}>
              Đăng Ký
            </StyledButton>
          </form>
          <Typography variant="body2" align="center" mt={2}>
            Đã có tài khoản?{" "}
            <Link component="button" variant="body2" onClick={onSwitchToLogin}>
              Đăng nhập ngay
            </Link>
          </Typography>
        </ModalContent>
      </StyledModal>
      <SuccessModal open={showSuccessModal} onClose={handleSuccessModalClose} message="Đăng ký tài khoản thành công!" />
      <FailureModal
        open={showFailureModal}
        onClose={handleFailureModalClose}
        message="Đăng ký thất bại. Vui lòng thử lại."
      />
    </>
  )
}

export default RegisterModal

