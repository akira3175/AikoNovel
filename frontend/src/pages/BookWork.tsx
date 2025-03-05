import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Paper,
  Tabs,
  Tab,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SaveIcon from "@mui/icons-material/Save"
import MenuIcon from "@mui/icons-material/Menu"
import InfoIcon from "@mui/icons-material/Info"
import ListIcon from "@mui/icons-material/List"
import NoteIcon from "@mui/icons-material/Note"
import { getBookDetails, updateBook, type BookDetails, type UpdateBookData } from "../services/book"
import BookDetailsComponent from "../components/BookWork/BookDetails"
import TableOfContents from "../components/BookWork/TableOfContents"
import Notes from "../components/BookWork/Notes"

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}))

const ContentContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(10),
  marginBottom: theme.spacing(4),
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
}))

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
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
}

const BookWork: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [book, setBook] = useState<BookDetails | null>(null)
  const [tabValue, setTabValue] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (id) {
        try {
          const details = await getBookDetails(Number.parseInt(id))
          setBook(details)
        } catch (error) {
          console.error("Failed to fetch book details:", error)
        }
      }
    }
    fetchBookDetails()
  }, [id])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleSave = async () => {
    if (book) {
      try {
        const updateData: UpdateBookData = {
          title: book.title ?? undefined,
          description: book.description ?? undefined,
          another_name: book.another_name ?? undefined,
          img: book.img ?? undefined,
          authors: book.authors.map((author) => author.id),
          artist: book.artist ?? undefined,
          status: book.status,
          teams: book.teams.map((team) => team.id),
          note: book.note ?? undefined,
          quantity_volome: book.quantity_volome,
          categories: book.categories.map((category) => category.id),
        }
        const updatedBook = await updateBook(book.id, updateData)
        setBook(updatedBook)
        console.log("Book details saved successfully")
      } catch (error) {
        console.error("Failed to save book details:", error)
      }
    }
  }

  const handleCancel = () => {
    navigate(-1)
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
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        {["Chi tiết", "Mục lục", "Ghi chú"].map((text, index) => (
          <ListItem key={text} onClick={() => setTabValue(index)}>
            <ListItemButton>
              <ListItemIcon>{index === 0 ? <InfoIcon /> : index === 1 ? <ListIcon /> : <NoteIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate(-1)} edge="start">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
            {book?.title || "Chỉnh sửa thông tin truyện"}
          </Typography>
          <Button color="inherit" onClick={handleCancel}>
            Hủy
          </Button>
          <Button color="inherit" onClick={handleSave} startIcon={<SaveIcon />}>
            Lưu
          </Button>
        </Toolbar>
      </StyledAppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
      <ContentContainer maxWidth="lg">
        <StyledPaper>
          <Box sx={{ borderBottom: 1, borderColor: "divider", display: { xs: "none", sm: "block" } }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="book edit tabs">
              <Tab label="Chi tiết" {...a11yProps(0)} />
              <Tab label="Mục lục" {...a11yProps(1)} />
              <Tab label="Ghi chú" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
            {book && <BookDetailsComponent book={book} onUpdate={(updatedBook) => setBook(updatedBook)} />}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <TableOfContents bookId={id} />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Notes bookId={id} />
          </TabPanel>
        </StyledPaper>
      </ContentContainer>
    </>
  )
}

export default BookWork

