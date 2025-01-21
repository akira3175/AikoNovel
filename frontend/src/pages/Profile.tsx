import React, { useState, useEffect, useRef } from "react"
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
} from "@mui/material"
import { styled } from "@mui/material/styles"
import EditIcon from "@mui/icons-material/Edit"
import { fetchProfile, updateFullName, updateAvatar, updateBackground, type ProfileData } from "../services/profile"
import { useAuth } from "../contexts/AuthContext"
import Groups from "../components/profile/Groups"

const ProfileContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}))

const BackgroundImage = styled(Box)<{ $imgUrl?: string }>(({ theme, $imgUrl }) => ({
  width: "100%",
  height: "200px",
  backgroundImage: $imgUrl ? `url(${$imgUrl})` : "none",
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    height: "300px",
  },
}))

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  border: `4px solid ${theme.palette.background.paper}`,
  marginTop: theme.spacing(-7),
  marginBottom: theme.spacing(2),
}))

const EditButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  bottom: theme.spacing(1),
  right: theme.spacing(1),
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
      <Paper elevation={3}>
        <BackgroundImage $imgUrl={profile.img_background || undefined}>
          {isCurrentUser && (
            <>
              <input
                ref={backgroundInputRef}
                accept="image/*"
                style={{ display: "none" }}
                id="background-upload"
                type="file"
                onChange={(e) => handleImageUpload(e, "background")}
              />
              <EditButton onClick={triggerBackgroundUpload}>
                <EditIcon />
              </EditButton>
            </>
          )}
        </BackgroundImage>
        <Box display="flex" flexDirection="column" alignItems="center" p={3}>
          <ProfileAvatar src={profile.img_avatar || undefined} alt={profile.full_name}>
            {profile.full_name.charAt(0)}
          </ProfileAvatar>
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
              <Button onClick={triggerAvatarUpload} variant="outlined" size="small" sx={{ mb: 2 }}>
                Change Avatar
              </Button>
            </>
          )}
          {isEditing ? (
            <Box mt={2} display="flex" alignItems="center">
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
            <Box mt={2} display="flex" alignItems="center">
              <Typography variant="h5" component="h1">
                {profile.full_name}
              </Typography>
              {isCurrentUser && (
                <IconButton onClick={handleEditProfile} size="small" sx={{ ml: 1 }}>
                  <EditIcon />
                </IconButton>
              )}
            </Box>
          )}
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            @{profile.username}
          </Typography>
        </Box>
      </Paper>

      <Groups username={profile.username} />
    </ProfileContainer>
  )
}

export default Profile
