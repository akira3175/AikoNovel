"use client"

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
  Snackbar,
  Alert,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SaveIcon from "@mui/icons-material/Save"
import MenuIcon from "@mui/icons-material/Menu"
import InfoIcon from "@mui/icons-material/Info"
import ListIcon from "@mui/icons-material/List"
import NoteIcon from "@mui/icons-material/Note"
import { getBookDetails, updateBook } from "../services/book"
import { BookDetails, UpdateBookData } from "../types/book"
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
  const [editedBook, setEditedBook] = useState<BookDetails | null>(null)
  const [bookNote, setBookNote] = useState<string>("")
  const [tabValue, setTabValue] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [notification, setNotification] = useState<{
    open: boolean
    message: string
    severity: "success" | "error"
  }>({
    open: false,
    message: "",
    severity: "success",
  })

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (id) {
        try {
          const details = await getBookDetails(Number.parseInt(id))
          setBook(details)
          setEditedBook(details)
          setBookNote(details.note || "")
        } catch (error) {
          console.error("Failed to fetch book details:", error)
          showNotification("Failed to fetch book details", "error")
        }
      }
    }
    fetchBookDetails()
  }, [id])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleBookUpdate = (updatedBook: BookDetails) => {
    setEditedBook(updatedBook)
  }

  const handleNoteChange = (note: string) => {
    setBookNote(note)
  }

  const showNotification = (message: string, severity: "success" | "error") => {
    setNotification({
      open: true,
      message,
      severity,
    })
  }

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    })
  }

  const handleSave = async () => {
    if (book && editedBook) {
      try {
        const updateData: UpdateBookData = {
          title: editedBook.title || "",
          description: editedBook.description || "",
          another_name: editedBook.another_name || "",
          img: editedBook.img || "",
          authors: editedBook.authors.map((author) => author.id),
          artist: editedBook.artist || "",
          status: editedBook.status,
          teams: editedBook.teams.map((team) => team.id),
          note: bookNote,
          quantity_volome: editedBook.quantity_volome,
          categories: editedBook.categories.map((category) => category.id),
        }

        const updatedBook = await updateBook(book.id, updateData)
        setBook(updatedBook)
        setEditedBook(updatedBook)
        showNotification("Book details saved successfully", "success")
      } catch (error) {
        console.error("Failed to save book details:", error)
        showNotification("Failed to save book details", "error")
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
            {book && editedBook && <BookDetailsComponent book={editedBook} onUpdate={handleBookUpdate} />}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <TableOfContents
              bookId={id}
              book={book}
              onVolumeAdded={(newVolume) => {
                if (book) {
                  setBook({
                    ...book,
                    volumes: [...(book.volumes || []), newVolume],
                  })
                }
              }}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Notes bookId={id} onNoteChange={handleNoteChange} initialNote={book?.note || ""} />
          </TabPanel>
        </StyledPaper>
      </ContentContainer>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default BookWork

