import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  useMediaQuery,
  useTheme,
  Modal,
  TextField,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import SearchBar from "../components/ui/SearchBar"
import { useAuth } from "../contexts/AuthContext"
import { registerAuthor, getPenName, updatePenName } from "../services/contributors"
import { createBook, getAuthorBooks, type BookDetails } from "../services/book"
import BookManagementDropdown from "../components/work/BookManagementDropdown"

const WorkContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}))

const ContentWrapper = styled(Box)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
})

const Panel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: "auto",
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

const WorksList = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(2),
}))

const WorkItem = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}))

const WorkItemImage = styled("img")({
  width: "106px",
  aspectRatio: "53 / 75",
  objectFit: "cover",
  marginRight: 16,
})

const WorkItemInfo = styled("div")({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
})

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
}

const PenNameSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
}))

const PenNameWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  width: "100%",
}))

const PenNameText = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: "bold",
  textAlign: "center",
  width: "100%",
  paddingRight: theme.spacing(4),
  paddingLeft: theme.spacing(4),
}))

const Work: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [newItemName, setNewItemName] = useState("")
  const [penName, setPenName] = useState("")
  const [isAuthor, setIsAuthor] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [penNameModalOpen, setPenNameModalOpen] = useState(false)
  const [newPenName, setNewPenName] = useState("")
  const [books, setBooks] = useState<BookDetails[]>([])
  const { user, userInfoFetched } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const navigate = useNavigate()
  const [tabValue, setTabValue] = useState(0)

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

  const handleAddClick = () => {
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setNewItemName("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthor) {
      try {
        const result = await registerAuthor(newItemName)
        setPenName(result.pen_name)
        setIsAuthor(true)
      } catch (error) {
        console.error("Error registering author:", error)
      }
    } else {
      try {
        const result = await createBook(newItemName)
        console.log("New book created:", result)
        navigate(`/book/${result.id}`)
      } catch (error) {
        console.error("Error creating book:", error)
      }
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const renderBookList = () => (
    <WorksList>
      {books.map((book) => (
        <WorkItem key={book.id}>
          <WorkItemImage src={book.img || "/placeholder.svg"} alt={book.title || "Book cover"} />
          <WorkItemInfo>
            <Typography variant="h6" component="h3" color="primary" gutterBottom>
              <strong>{book.title}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>{book.quantity_volome} tập</strong>
            </Typography>
          </WorkItemInfo>
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <BookManagementDropdown bookId={book.id} />
          </Box>
        </WorkItem>
      ))}
      {books.length === 0 && <Typography className="no-novel-text">Không có sách nào được tìm thấy.</Typography>}
    </WorksList>
  )

  const renderFragments = () => (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="work tabs">
          <Tab label="Truyện của tôi" {...a11yProps(0)} />
          <Tab label="Nhóm của tôi" {...a11yProps(1)} />
          <Tab label="Nhóm khác" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        {renderBookList()}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        Nội dung nhóm của tôi
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        Nội dung nhóm khác
      </TabPanel>
    </Box>
  )

  const renderAddButton = () => {
    if (tabValue === 0) {
      return (
        <AddButton variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddClick}>
          {isAuthor ? "Tạo truyện" : "Đăng ký tác giả"}
        </AddButton>
      )
    } else {
      return (
        <AddButton variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddClick}>
          Tạo nhóm
        </AddButton>
      )
    }
  }

  return (
    <WorkContainer maxWidth="lg">
      <ContentWrapper>
        <Grid container spacing={3}>
          {isMobile ? (
            <>
              <Grid item xs={12}>
                <Panel>
                  <PenNameSection>
                    <Typography variant="subtitle1" gutterBottom>
                      Bút danh
                    </Typography>
                    <PenNameWrapper>
                      <PenNameText color="primary">{penName || "Chưa đăng ký"}</PenNameText>
                      <IconButton
                        color="primary"
                        onClick={() => setPenNameModalOpen(true)}
                        size="large"
                        sx={{
                          position: "absolute",
                          right: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </PenNameWrapper>
                  </PenNameSection>
                  <Box mb={2}>
                    <Typography variant="subtitle1" gutterBottom>
                      Tìm kiếm
                    </Typography>
                    <SearchBar
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      fullWidth
                      placeholder="Tìm kiếm..."
                    />
                  </Box>
                </Panel>
              </Grid>
              <Grid item xs={12}>
                <Panel>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h5" component="h1">
                      Workspace
                    </Typography>
                    {renderAddButton()}
                  </Box>
                  {renderFragments()}
                </Panel>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12} md={8}>
                <Panel>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h5" component="h1">
                      Workspace
                    </Typography>
                    {renderAddButton()}
                  </Box>
                  {renderFragments()}
                </Panel>
              </Grid>
              <Grid item xs={12} md={4}>
                <Panel>
                  <PenNameSection>
                    <Typography variant="subtitle1" gutterBottom>
                      Bút danh
                    </Typography>
                    <PenNameWrapper>
                      <PenNameText color="primary">{penName || "Chưa đăng ký"}</PenNameText>
                      <IconButton
                        color="primary"
                        onClick={() => setPenNameModalOpen(true)}
                        size="large"
                        sx={{
                          position: "absolute",
                          right: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </PenNameWrapper>
                  </PenNameSection>
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Tìm kiếm
                    </Typography>
                    <SearchBar
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      fullWidth
                      placeholder="Tìm kiếm..."
                    />
                  </Box>
                </Panel>
              </Grid>
            </>
          )}
        </Grid>
      </ContentWrapper>
      <StyledModal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="add-modal-title"
        aria-describedby="add-modal-description"
      >
        <ModalContent>
          <Typography id="add-modal-title" variant="h6" component="h2" gutterBottom>
            {isAuthor ? (tabValue === 0 ? "Tạo truyện mới" : "Tạo nhóm mới") : "Đăng ký tác giả"}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={isAuthor ? (tabValue === 0 ? "Tên truyện" : "Tên nhóm") : "Bút danh"}
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
              {isAuthor ? (tabValue === 0 ? "Tạo truyện" : "Tạo nhóm") : "Đăng ký"}
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

