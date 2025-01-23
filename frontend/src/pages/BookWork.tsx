import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AppBar, Toolbar, Typography, Button, Container, Paper, Tabs, Tab, Box } from "@mui/material"
import { styled } from "@mui/material/styles"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { getBookDetails, type BookDetails } from "../services/book"
import BookDetailsComponent from "../components/book-work/BookDetails"
import TableOfContents from "../components/book-work/TableOfContents"
import Notes from "../components/book-work/Notes"

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

  const handleSave = () => {
    // Implement save functionality
    console.log("Saving book details")
  }

  const handleCancel = () => {
    navigate(-1)
  }

  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar>
          <Button color="inherit" onClick={() => navigate(-1)} startIcon={<ArrowBackIcon />}>
            Trở về
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
            Chỉnh sửa thông tin truyện
          </Typography>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            {book?.title || "Truyện chưa có tên"}
          </Typography>
          <Button color="inherit" onClick={handleCancel}>
            Hủy
          </Button>
          <Button color="primary" variant="contained" onClick={handleSave} sx={{ ml: 1 }}>
            Lưu
          </Button>
        </Toolbar>
      </StyledAppBar>
      <ContentContainer maxWidth="lg">
        <StyledPaper>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="book edit tabs">
            <Tab label="Chi tiết" {...a11yProps(0)} />
            <Tab label="Mục lục" {...a11yProps(1)} />
            <Tab label="Ghi chú" {...a11yProps(2)} />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            {book && <BookDetailsComponent book={book} />}
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

