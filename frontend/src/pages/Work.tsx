import type React from "react"
import { useState } from "react"
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Modal,
  Box,
  Fade,
  TextField,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import AddIcon from "@mui/icons-material/Add"
import SearchBar from "../components/ui/SearchBar"
import AnimatedTabs from "../components/ui/AnimatedTabs"
import { useAuth } from "../contexts/AuthContext"

const LeftPanel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: "calc(100vh - 100px)",
  overflowY: "auto",
  position: "relative",
  display: "flex",
  flexDirection: "column",
}))

const RightPanel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: "calc(100vh - 100px)",
  overflowY: "auto",
}))

const WorkContainer = styled(Container)(({ theme }) => ({
  height: "calc(100vh - 64px)",
  paddingTop: theme.spacing(2),
}))

const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: "2px solid #000",
  boxShadow: theme.shadows[24],
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  width: "400px",
  maxWidth: "90%",
}))

const AddButton = styled(Button)({
  marginLeft: "auto",
})

const Work: React.FC = () => {
  const [tabValue, setTabValue] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [newItemName, setNewItemName] = useState("")
  const { user, userInfoFetched } = useAuth()

  const handleTabChange = (newValue: number) => {
    setTabValue(newValue)
  }

  const handleAddClick = () => {
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setNewItemName("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement the logic to create a new story or group here
    console.log(`Creating new ${tabValue === 0 ? "story" : "group"}: ${newItemName}`)
    handleCloseModal()
  }

  const getAddButtonText = () => {
    switch (tabValue) {
      case 0:
        return "Tạo truyện"
      case 1:
        return "Tạo nhóm"
      default:
        return "Thêm mới"
    }
  }

  const tabContent = [
    {
      label: "Truyện của tôi",
      content: (
        <List>
          <ListItem>
            <ListItemText primary="Truyện 1" secondary="Tác giả: Bạn" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Truyện 2" secondary="Tác giả: Bạn" />
          </ListItem>
        </List>
      ),
    },
    {
      label: "Nhóm của tôi",
      content: (
        <List>
          <ListItem>
            <ListItemText primary="Nhóm 1" secondary="Thành viên: 5" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Nhóm 2" secondary="Thành viên: 3" />
          </ListItem>
        </List>
      ),
    },
    {
      label: "Nhóm khác",
      content: (
        <List>
          <ListItem>
            <ListItemText primary="Nhóm A" secondary="Thành viên: 10" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Nhóm B" secondary="Thành viên: 7" />
          </ListItem>
        </List>
      ),
    },
  ]

  return (
    <WorkContainer maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <LeftPanel>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h5" component="h1">
                Workspace
              </Typography>
              <AddButton variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddClick}>
                {getAddButtonText()}
              </AddButton>
            </Box>
            <AnimatedTabs tabs={tabContent} value={tabValue} onChange={handleTabChange} />
            <Box sx={{ flexGrow: 1, overflow: "auto", mt: 2 }}>
              <Fade in={true} timeout={500}>
                <div>{tabContent[tabValue].content}</div>
              </Fade>
            </Box>
          </LeftPanel>
        </Grid>
        <Grid item xs={12} md={4}>
          <RightPanel>
            <Typography variant="h6" gutterBottom>
              Thông tin
            </Typography>
            {/* Add additional information or features here */}
          </RightPanel>
        </Grid>
      </Grid>
      <StyledModal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="add-modal-title"
        aria-describedby="add-modal-description"
      >
        <ModalContent>
          <Typography id="add-modal-title" variant="h6" component="h2" gutterBottom>
            {getAddButtonText()}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={tabValue === 0 ? "Tên truyện" : "Tên nhóm"}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              margin="normal"
              required
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={!newItemName.trim()}
              sx={{ mt: 2 }}
            >
              {getAddButtonText()}
            </Button>
          </form>
        </ModalContent>
      </StyledModal>
    </WorkContainer>
  )
}

export default Work

