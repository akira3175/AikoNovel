import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import {
  Container,
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  CircularProgress,
  Paper,
  IconButton,
  Grid,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import EditIcon from "@mui/icons-material/Edit"
import CameraAltIcon from "@mui/icons-material/CameraAlt"
import { fetchProfile, updateFullName, updateAvatar, updateBackground, type ProfileData } from "../services/profile"
import { useAuth } from "../contexts/AuthContext"
import Groups from "../components/profile/Groups"

const ProfileContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(4),
}))

const ProfileHeader = styled(Paper)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  overflow: "hidden",
}))

const BackgroundImage = styled(Box)<{ $imgUrl?: string }>(({ theme, $imgUrl }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: "150px",
  backgroundImage: $imgUrl ? `url(${$imgUrl})` : "none",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "flex-end",
}))

const ProfileContent = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  paddingTop: "100px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}))

const AvatarContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  marginBottom: theme.spacing(2),
}))

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  border: `4px solid ${theme.palette.background.paper}`,
  marginBottom: theme.spacing(2),
}))

const EditButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  right: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  "&:hover": {
    backgroundColor: theme.palette.background.default,
  },
}))

const ChangeBackgroundButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(1),
  bottom: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "&:hover": {
    backgroundColor: theme.palette.background.default,
  },
  zIndex: 2, // Đảm bảo nút nằm trên các phần tử khác
}));


const ChangeAvatarButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  right: 0,
  backgroundColor: theme.palette.background.paper,
  "&:hover": {
    backgroundColor: theme.palette.background.default,
  },
}))

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>()
  const { user } = useAuth()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const backgroundInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loadProfile = async () => {
      if (username) {
        try {
          setIsLoading(true)
          const data = await fetchProfile(username)
          setProfile(data)
          setEditedName(data.full_name)
          setIsLoading(false)
        } catch (error) {
          console.error("Failed to load profile:", error)
          setError("Failed to load profile. Please try again.")
          setIsLoading(false)
        }
      }
    }
    loadProfile()
  }, [username])

  const handleEditProfile = () => {
    setIsEditing(true)
  }

  const handleSaveProfile = async () => {
    if (profile && username) {
      try {
        setIsLoading(true)
        await updateFullName(editedName)
        const updatedProfile = await fetchProfile(username)
        setProfile(updatedProfile)
        setIsEditing(false)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to update profile:", error)
        setError("Failed to update profile. Please try again.")
        setIsLoading(false)
      }
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "background") => {
    const file = event.target.files?.[0]
    if (file && profile && username) {
      try {
        setIsLoading(true)
        const formData = new FormData()
        formData.append("file", file)
        if (type === "avatar") {
          await updateAvatar(formData)
        } else {
          await updateBackground(formData)
        }
        const updatedProfile = await fetchProfile(username)
        setProfile(updatedProfile)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to upload image:", error)
        setError("Failed to upload image. Please try again.")
        setIsLoading(false)
      }
    }
  }

  const triggerAvatarUpload = () => {
    avatarInputRef.current?.click()
  }

  const triggerBackgroundUpload = () => {
    backgroundInputRef.current?.click()
  }

  if (isLoading) {
    return (
      <ProfileContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </ProfileContainer>
    )
  }

  if (error) {
    return (
      <ProfileContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography color="error">{error}</Typography>
        </Box>
      </ProfileContainer>
    )
  }

  if (!profile) {
    return (
      <ProfileContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography>Profile not found.</Typography>
        </Box>
      </ProfileContainer>
    )
  }

  const isCurrentUser = user?.username === profile.username

  return (
    <ProfileContainer>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ProfileHeader elevation={3}>
            <BackgroundImage $imgUrl={profile.img_background || undefined}>
              {isCurrentUser && (
                <ChangeBackgroundButton onClick={triggerBackgroundUpload} size="small">
                  <CameraAltIcon fontSize="small" />
                </ChangeBackgroundButton>
              )}
            </BackgroundImage>
            <ProfileContent>
              <AvatarContainer>
                <ProfileAvatar src={profile.img_avatar || undefined} alt={profile.full_name}>
                  {profile.full_name.charAt(0)}
                </ProfileAvatar>
                {isCurrentUser && (
                  <ChangeAvatarButton onClick={triggerAvatarUpload} size="small">
                    <CameraAltIcon fontSize="small" />
                  </ChangeAvatarButton>
                )}
              </AvatarContainer>
              {isEditing ? (
                <Box display="flex" alignItems="center">
                  <TextField
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                  <Button onClick={handleSaveProfile} variant="contained" color="primary" sx={{ ml: 1 }}>
                    Save
                  </Button>
                </Box>
              ) : (
                <Box display="flex" alignItems="center">
                  <Typography variant="h5" component="h1">
                    {profile.full_name}
                  </Typography>
                  {isCurrentUser && (
                    <IconButton onClick={handleEditProfile} size="small" sx={{ ml: 1 }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              )}
              <Typography variant="subtitle1" color="text.secondary">
                @{profile.username}
              </Typography>
            </ProfileContent>
            {isCurrentUser && (
              <>
                <input
                  ref={avatarInputRef}
                  accept="image/*"
                  style={{ display: "none" }}
                  id="avatar-upload"
                  type="file"
                  onChange={(e) => handleImageUpload(e, "avatar")}
                />
                <input
                  ref={backgroundInputRef}
                  accept="image/*"
                  style={{ display: "none" }}
                  id="background-upload"
                  type="file"
                  onChange={(e) => handleImageUpload(e, "background")}
                />
              </>
            )}
          </ProfileHeader>
        </Grid>
        <Grid item xs={12} md={3}>
          <Groups username={profile.username} />
        </Grid>
        <Grid item xs={12} md={9}>
          {/* Add more profile content here */}
        </Grid>
      </Grid>
    </ProfileContainer>
  )
}

export default Profile

