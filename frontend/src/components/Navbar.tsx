import type React from "react"
import { useState, useEffect } from "react"
import {
  AppBar,
  Toolbar,
  Container,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Divider,
  Link as MuiLink,
  Skeleton,
} from "@mui/material"
import { styled, useTheme } from "@mui/material/styles"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"
import Logo from "./ui/Logo"
import NavLinks from "./ui/NavLinks"
import SearchBar from "./ui/SearchBar"
import AuthButtons from "./ui/AuthButtons"
import { GradientCircularProgress } from "./ui/GradientCircularProgress"
import LoginModal from "./auth/LoginModal"
import RegisterModal from "./auth/RegisterModal"
import { useAuth } from "../contexts/AuthContext"
import { Link as RouterLink } from "react-router-dom"

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#ffffff",
  boxShadow: "none",
  borderBottom: "1px solid #e0e0e0",
}))

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: "64px",
  padding: "0 !important",
  display: "flex",
  justifyContent: "space-between",
}))

const LeftSection = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
}))

const RightSection = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
}))

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}))

const DrawerContent = styled(Box)(({ theme }) => ({
  width: 250,
  padding: theme.spacing(2),
}))

const StyledNavLink = styled(RouterLink)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
}))

const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: theme.zIndex.modal + 1,
}))

const Navbar: React.FC = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [registerModalOpen, setRegisterModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const { isAuthenticated, user, login, logout, register, fetchUserInfo, userInfoFetched } = useAuth()

  const handleOpenLoginModal = () => {
    setLoginModalOpen(true)
    setDrawerOpen(false)
  }

  const handleOpenRegisterModal = () => {
    setRegisterModalOpen(true)
    setLoginModalOpen(false)
    setDrawerOpen(false)
  }

  const handleCloseLoginModal = () => {
    setLoginModalOpen(false)
  }

  const handleCloseRegisterModal = () => {
    setRegisterModalOpen(false)
  }

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      await login(username, password)
      handleCloseLoginModal()
      return true
    } catch (error) {
      console.error("Login failed:", error)
      return false
    } finally { 
      setIsLoading(false)
    }
  }

  const handleRegister = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      await register(username, email, password, confirmPassword)
      handleCloseRegisterModal()
      return true
    } catch (error) {
      console.log("Register failed: ", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    handleCloseMenu()
    setDrawerOpen(false)
  }

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleSwitch = () => {
    setLoginModalOpen(!loginModalOpen)
    setRegisterModalOpen(!registerModalOpen)
  }

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
    ) {
      return
    }
    setDrawerOpen(open)
  }

  const drawerContent = (
    <DrawerContent>
      <DrawerHeader>
        <IconButton onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Box mt={2} mb={2}>
        <SearchBar />
      </Box>
      <Divider />
      <List>
        {["Trang chủ", "Danh sách", "Hướng dẫn", "Chúng tôi"].map((text, index) => (
          <ListItemButton
            key={text}
            onClick={toggleDrawer(false)}
            component={StyledNavLink}
            to={index === 0 ? "/" : `/${text.toLowerCase().replace(" ", "-")}`}
          >
            <ListItemText primary={text} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      {isAuthenticated ? (
        <List>
          <ListItemButton onClick={handleOpenMenu}>
            <Avatar
              alt={user?.username || "User"}
              src={user?.img_avatar || "/default-avatar.png"}
              sx={{ marginRight: 1 }}
            />
            <ListItemText primary={user?.fullname || user?.username || "User"} />
          </ListItemButton>
          <ListItemButton onClick={toggleDrawer(false)} component={StyledNavLink} to="/library">
            <ListItemText primary="Thư viện" />
          </ListItemButton>
          <ListItemButton onClick={toggleDrawer(false)} component={StyledNavLink} to="/doi-mat-khau">
            <ListItemText primary="Đổi mật khẩu" />
          </ListItemButton>
          <ListItemButton onClick={toggleDrawer(false)} component={StyledNavLink} to="/work">
            <ListItemText primary="Đăng truyện" />
          </ListItemButton>
          <ListItemButton onClick={handleLogout}>
            <ListItemText primary="Đăng xuất" />
          </ListItemButton>
        </List>
      ) : (
        <Box mt={2}>
          <AuthButtons onLoginClick={handleOpenLoginModal} onRegisterClick={handleOpenRegisterModal} />
        </Box>
      )}
    </DrawerContent>
  )

  return (
    <>
      <StyledAppBar position="static">
        <Container maxWidth="lg">
          <StyledToolbar>
            <LeftSection>
              <Logo />
              {!isMobile && <NavLinks />}
            </LeftSection>
            <RightSection>
              {!isMobile && (
                <>
                  <SearchBar />
                  {isAuthenticated ? (
                    <>
                      <IconButton onClick={handleOpenMenu}>
                        <Avatar alt={user?.username || "User"} src={user?.img_avatar || "/default-avatar.png"} />
                      </IconButton>
                      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                        <MenuItem onClick={handleCloseMenu} component={StyledNavLink} to={`/profile/${user?.username}`}>
                          <Avatar
                            alt={user?.username || "User"}
                            src={user?.img_avatar || "/default-avatar.png"}
                            sx={{ marginRight: 1 }}
                          />
                          <ListItemText primary={user?.fullname || user?.username || "User"} />
                        </MenuItem>
                        <MenuItem onClick={handleCloseMenu} component={StyledNavLink} to="/library">
                          Thư viện
                        </MenuItem>
                        <MenuItem onClick={handleCloseMenu} component={StyledNavLink} to="/doi-mat-khau">
                          Đổi mật khẩu
                        </MenuItem>
                        <MenuItem onClick={handleCloseMenu} component={StyledNavLink} to="/work">
                          Đăng truyện
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <AuthButtons onLoginClick={handleOpenLoginModal} onRegisterClick={handleOpenRegisterModal} />
                  )}
                </>
              )}
              {isMobile && (
                <IconButton edge="start" sx={{ color: "#708090" }} aria-label="menu" onClick={toggleDrawer(true)}>
                  <MenuIcon />
                </IconButton>
              )}
            </RightSection>
          </StyledToolbar>
        </Container>
      </StyledAppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
      <LoginModal
        open={loginModalOpen}
        onClose={handleCloseLoginModal}
        onLogin={handleLogin}
        onSwitchToRegister={handleSwitch}
        isLoading={isLoading}
      />
      <RegisterModal
        open={registerModalOpen}
        onClose={handleCloseRegisterModal}
        onRegister={handleRegister}
        onSwitchToLogin={handleSwitch}
        isLoading={isLoading}
      />
      {isLoading && (
        <LoadingOverlay>
          <GradientCircularProgress />
        </LoadingOverlay>
      )}
    </>
  )
}

export default Navbar

