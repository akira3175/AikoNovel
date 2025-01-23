import React from "react"
import { useState, useEffect } from "react"
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
  Card,
  CardContent,
  useMediaQuery,
  type Theme,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import SearchBar from "../components/ui/SearchBar"
import AnimatedTabs from "../components/ui/AnimatedTabs"
import { useAuth } from "../contexts/AuthContext"
import { registerAuthor, getPenName, updatePenName } from "../services/contributors"
import { createBook, getAuthorBooks, type BookDetails } from "../services/book"
import { useNavigate } from "react-router-dom"

const WorkContainer = styled(Container)(({ theme }) => ({
  height: "calc(100vh - 64px)",
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  overflowY: "auto",
}))

const Panel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: "100%",
  display: "flex",
  flexDirection: "column",
}))

const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  width: "400px",
  maxWidth: "90%",
}))

const AddButton = styled(Button)({
  marginLeft: "auto",
})

const PenNameCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  borderRadius: theme.shape.borderRadius,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background: "conic-gradient(transparent, rgba(255,255,255,0.3), transparent 30%)",
    animation: "rotate 4s linear infinite",
  },
  "@keyframes rotate": {
    "100%": {
      transform: "rotate(1turn)",
    },
  },
}))

const PenNameContent = styled(CardContent)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  background: "rgba(255,255,255,0.9)",
  borderRadius: `${theme.shape.borderRadius - 2}px`,
  padding: theme.spacing(2),
}))

const StyledAnimatedTabs = styled(AnimatedTabs)(({ theme }) => ({
  "& .MuiTab-root": {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: theme.palette.text.primary,
    "&.Mui-selected": {
      color: theme.palette.primary.main,
    },
  },
}))

const Work: React.FC = () => {
  const [tabValue, setTabValue] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [newItemName, setNewItemName] = useState("")
  const [penName, setPenName] = useState("")
  const [isAuthor, setIsAuthor] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [penNameModalOpen, setPenNameModalOpen] = useState(false)
  const [newPenName, setNewPenName] = useState("")
  const [books, setBooks] = useState<BookDetails[]>([])
  const { user, userInfoFetched } = useAuth()
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"))
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPenName = async () => {
      try {
        const fetchedPenName = await getPenName()
        setPenName(fetchedPenName)
        setIsAuthor(true)
      } catch (error) {
        console.error("Error fetching pen name:", error)
        setIsAuthor(false)
      }
    }

    if (userInfoFetched) {
      fetchPenName()
    }
  }, [userInfoFetched])

  useEffect(() => {
    const fetchBooks = async () => {
      if (isAuthor && penName) {
        try {
          const fetchedBooks = await getAuthorBooks(penName)
          setBooks(fetchedBooks)
        } catch (error) {
          console.error("Error fetching author's books:", error)
        }
      }
    }

    fetchBooks()
  }, [isAuthor, penName])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (tabValue === 0 && !isAuthor) {
      try {
        const result = await registerAuthor(newItemName)
        setPenName(result.pen_name)
        setIsAuthor(true)
      } catch (error) {
        console.error("Error registering author:", error)
      }
    } else if (tabValue === 0 && isAuthor) {
      try {
        const result = await createBook(newItemName)
        console.log("New book created:", result)
        navigate(`/book/${result.id}`)
      } catch (error) {
        console.error("Error creating book:", error)
      }
    } else {
      // Implement the logic to create a new group here
      console.log(`Creating new group: ${newItemName}`)
    }
    handleCloseModal()
  }

  const handlePenNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isAuthor) {
        await updatePenName(newPenName)
      } else {
        await registerAuthor(newPenName)
        setIsAuthor(true)
      }
      setPenName(newPenName)
      setPenNameModalOpen(false)
      setNewPenName("")
    } catch (error) {
      console.error("Error updating pen name:", error)
    }
  }

  const getAddButtonText = () => {
    if (tabValue === 0 && !isAuthor) {
      return "Đăng ký tác giả"
    }
    switch (tabValue) {
      case 0:
        return "Tạo truyện"
      case 1:
        return "Tạo nhóm"
      default:
        return "Thêm mới"
    }
  }

  const renderBookList = () => (
    <List>
      {books.map((book) => (
        <React.Fragment key={book.id}>
          <ListItem component="button" onClick={() => navigate(`/book/${book.id}`)}>
            <ListItemText
                primary={book.title || "Untitled"}
                secondary={`Tác giả: ${book.authors[0]?.pen_name || "Unknown"}`}
            />
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  )

  const tabContent = [
    {
      label: "Truyện của tôi",
      content: (
        <>
          {isAuthor ? (
            books.length > 0 ? (
              renderBookList()
            ) : (
              <Typography>Bạn chưa có truyện nào. Hãy tạo truyện mới!</Typography>
            )
          ) : (
            <Typography>Bạn cần đăng ký tác giả với bút danh để tạo truyện.</Typography>
          )}
        </>
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

  const renderPenNameCard = () => (
    <PenNameCard>
      <PenNameContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" gutterBottom>
            Bút danh
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={isAuthor ? <EditIcon /> : <AddIcon />}
            onClick={() => setPenNameModalOpen(true)}
          >
            {isAuthor ? "Đổi bút danh" : "Đăng ký"}
          </Button>
        </Box>
        <Typography variant="h5" fontWeight="bold" color="primary">
          {penName || "Chưa đăng ký"}
        </Typography>
      </PenNameContent>
    </PenNameCard>
  )

  return (
    <WorkContainer maxWidth="lg">
      <Grid container spacing={3}>
        {isMobile && (
          <Grid item xs={12}>
            <Panel>{renderPenNameCard()}</Panel>
            <Box mt={2}>
              <Panel>
                <SearchBar
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                  placeholder="Tìm kiếm..."
                />
              </Panel>
            </Box>
          </Grid>
        )}
        <Grid item xs={12} md={8}>
          <Panel>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h5" component="h1">
                Workspace
              </Typography>
              {(isAuthor || tabValue !== 0) && (
                <AddButton variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddClick}>
                  {getAddButtonText()}
                </AddButton>
              )}
            </Box>
            <StyledAnimatedTabs tabs={tabContent} value={tabValue} onChange={handleTabChange} />
            <Box sx={{ flexGrow: 1, overflow: "auto", mt: 2 }}>
              <Fade in={true} timeout={500}>
                <div>{tabContent[tabValue].content}</div>
              </Fade>
            </Box>
          </Panel>
        </Grid>
        {!isMobile && (
          <Grid item xs={12} md={4}>
            <Panel>{renderPenNameCard()}</Panel>
            <Box mt={2}>
              <Panel>
                <SearchBar
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                  placeholder="Tìm kiếm..."
                />
              </Panel>
            </Box>
          </Grid>
        )}
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
              label={tabValue === 0 && !isAuthor ? "Bút danh" : tabValue === 0 ? "Tên truyện" : "Tên nhóm"}
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
      <StyledModal
        open={penNameModalOpen}
        onClose={() => setPenNameModalOpen(false)}
        aria-labelledby="pen-name-modal-title"
        aria-describedby="pen-name-modal-description"
      >
        <ModalContent>
          <Typography id="pen-name-modal-title" variant="h6" component="h2" gutterBottom>
            {isAuthor ? "Đổi bút danh" : "Đăng ký bút danh"}
          </Typography>
          <form onSubmit={handlePenNameSubmit}>
            <TextField
              fullWidth
              label="Bút danh"
              value={newPenName}
              onChange={(e) => setNewPenName(e.target.value)}
              margin="normal"
              required
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={!newPenName.trim()}
              sx={{ mt: 2 }}
            >
              {isAuthor ? "Cập nhật" : "Đăng ký"}
            </Button>
          </form>
        </ModalContent>
      </StyledModal>
    </WorkContainer>
  )
}

export default Work

