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
  Skeleton,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import SearchBar from "../components/ui/SearchBar"
import { useAuth } from "../contexts/AuthContext"
import { registerAuthor, getPenName, updatePenName } from "../services/contributors"
import { createBook, getAuthorBooks } from "../services/book"
import { BookDetails } from "../types/book"
import BookManagementDropdown from "../components/Work/BookManagementDropdown"

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

const GlassWorkItem = styled("div")<{ $imgUrl: string }>(({ theme, $imgUrl }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s ease",
  transform: "translateY(-5px)",
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${$imgUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "blur(5px)",
    zIndex: -2,
  },
  "&:after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    zIndex: -1,
  },
  "&:hover": {
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
  },
}))

const WorkItemImage = styled("img")({
  width: "106px",
  aspectRatio: "53 / 75",
  objectFit: "cover",
  marginRight: 16,
  borderRadius: "4px",
  border: "2px solid white",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
})

const WorkItemInfo = styled("div")({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  backgroundColor: "transparent",
  padding: "8px",
  borderRadius: "4px",
})

const BookTitleTypography = styled(Typography)(({ theme }) => ({
  display: "-webkit-box", 
  WebkitBoxOrient: "vertical", 
  WebkitLineClamp: 2,
  overflow: "hidden", 
  textOverflow: "ellipsis",
  wordBreak: "break-word", 
  textAlign: "left",
}));

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

  const [isLoadingPenName, setIsLoadingPenName] = useState(true)
  const [isLoadingBooks, setIsLoadingBooks] = useState(true)
  const [isLoadingGroups, setIsLoadingGroups] = useState(true)

  useEffect(() => {
    const fetchPenName = async () => {
      setIsLoadingPenName(true)
      try {
        const fetchedPenName = await getPenName()
        setPenName(fetchedPenName)
        setIsAuthor(true)
      } catch (error) {
        console.error("Error fetching pen name:", error)
        setIsAuthor(false)
      } finally {
        setIsLoadingPenName(false)
      }
    }

    if (userInfoFetched) {
      fetchPenName()
    }
  }, [userInfoFetched])

  useEffect(() => {
    const fetchBooks = async () => {
      if (isAuthor && penName) {
        setIsLoadingBooks(true)
        try {
          const fetchedBooks = await getAuthorBooks(penName)
          setBooks(fetchedBooks)
        } catch (error) {
          console.error("Error fetching author's books:", error)
        } finally {
          setIsLoadingBooks(false)
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
      {isLoadingBooks
        ? Array.from(new Array(3)).map((_, index) => (
            <GlassWorkItem key={index} $imgUrl="/placeholder.svg">
              <Skeleton variant="rectangular" width={106} height={150} sx={{ marginRight: 2, borderRadius: "4px" }} />
              <WorkItemInfo>
                <Skeleton variant="text" width="80%" height={28} />
                <Skeleton variant="text" width="40%" height={20} />
              </WorkItemInfo>
              <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: "4px" }} />
            </GlassWorkItem>
          ))
        : books.map((book) => (
            <GlassWorkItem key={book.id} $imgUrl={book.img || "/placeholder.svg"}>
              <WorkItemImage src={book.img || "/placeholder.svg"} alt={book.title || "Book cover"} />
              <WorkItemInfo>
                <BookTitleTypography variant="h6" color="primary" gutterBottom>
                    <strong>{book.title}</strong>
                </BookTitleTypography>
                <Typography variant="body2" color="text.secondary">
                  <strong>{book.quantity_volome} tập</strong>
                </Typography>
              </WorkItemInfo>
              <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
                <BookManagementDropdown bookId={book.id} />
              </Box>
            </GlassWorkItem>
          ))}
      {!isLoadingBooks && books.length === 0 && (
        <Typography className="no-novel-text">Không có sách nào được tìm thấy.</Typography>
      )}
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
        {isLoadingGroups ? (
          <Skeleton variant="rectangular" height={100} />
        ) : (
          <Typography>Nội dung nhóm của tôi</Typography>
        )}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {isLoadingGroups ? (
          <Skeleton variant="rectangular" height={100} />
        ) : (
          <Typography>Nội dung nhóm khác</Typography>
        )}
      </TabPanel>
    </Box>
  )

  const renderAddButton = () => {
    if (isLoadingPenName) {
      return <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: "4px" }} />
    }

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
                      {isLoadingPenName ? (
                        <Skeleton variant="text" width="100%" height={40} />
                      ) : (
                        <>
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
                        </>
                      )}
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
                      {isLoadingPenName ? (
                        <Skeleton variant="text" width="100%" height={40} />
                      ) : (
                        <>
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
                        </>
                      )}
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

