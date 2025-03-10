import type React from "react"
import { useState, useEffect } from "react"
import {
  Grid,
  TextField,
  Button,
  Typography,
  Chip,
  Box,
  IconButton,
  Autocomplete,
  MenuItem,
  type SelectChangeEvent,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import CancelIcon from "@mui/icons-material/Cancel"
import CloseIcon from "@mui/icons-material/Close"
import type { BookDetails as BookDetailsType, Category, BookStatus } from "../../types/book"
import { getCategories, getBookStatuses } from "../../services/book"
import ImageUpload from "../common/ImageUpload"

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}))

const CategoryChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: "16px",
  "& .MuiChip-label": {
    padding: "0 12px",
  },
  "& .MuiChip-deleteIcon": {
    color: theme.palette.primary.contrastText,
    "&:hover": {
      color: theme.palette.primary.light,
    },
  },
}))

const CategoryContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}))

const CategoryAutocomplete = styled(Autocomplete<Category, false, false, false>)(({ theme }) => ({
  width: "100%",
  marginRight: theme.spacing(1),
}))

interface BookDetailsProps {
  book: BookDetailsType
  onUpdate: (updatedBook: BookDetailsType) => void
}

const BookDetailsComponent: React.FC<BookDetailsProps> = ({ book, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedBook, setEditedBook] = useState<BookDetailsType>(book)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [bookStatuses, setBookStatuses] = useState<BookStatus[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedCategories, fetchedBookStatuses] = await Promise.all([getCategories(), getBookStatuses()])
        setCategories(fetchedCategories)
        setBookStatuses(fetchedBookStatuses)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    // Update parent component whenever editedBook changes
    if (isEditing) {
      onUpdate(editedBook)
    }
  }, [editedBook, isEditing, onUpdate])

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    if (!isEditing) {
      setEditedBook(book)
    } else {
      // When exiting edit mode, ensure the parent has the latest data
      onUpdate(editedBook)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedBook((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (e: SelectChangeEvent<number>) => {
    setEditedBook((prev) => ({ ...prev, status: e.target.value as number }))
  }

  const handleAddCategory = () => {
    if (selectedCategory && !editedBook.categories.some((cat) => cat.id === selectedCategory.id)) {
      setEditedBook((prev) => ({
        ...prev,
        categories: [...prev.categories, selectedCategory],
      }))
      setSelectedCategory(null)
    }
  }

  const handleRemoveCategory = (categoryId: number) => {
    setEditedBook((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== categoryId),
    }))
  }

  return (
    <StyledBox>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" component="h1">
          {isEditing ? "Chỉnh sửa thông tin truyện" : "Thông tin truyện"}
        </Typography>
        <IconButton onClick={handleEditToggle} color="primary">
          {isEditing ? <CancelIcon /> : <EditIcon />}
        </IconButton>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <ImageUpload
            initialImage={editedBook.img || ""}
            onImageUpload={(imageUrl) => setEditedBook((prev) => ({ ...prev, img: imageUrl }))}
            isEditing={isEditing}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            label="Tiêu đề"
            name="title"
            value={editedBook.title || ""}
            onChange={handleInputChange}
            margin="normal"
            disabled={!isEditing}
          />
          <TextField
            fullWidth
            label="Tác giả"
            value={editedBook.authors.map((author) => author.pen_name).join(", ")}
            disabled
            margin="normal"
          />
          <TextField
            fullWidth
            label="Họa sĩ"
            name="artist"
            value={editedBook.artist || ""}
            onChange={handleInputChange}
            margin="normal"
            disabled={!isEditing}
          />
          {editedBook.teams.map((team, index) => (
            <TextField
              key={index}
              fullWidth
              label={team.type || "Nhóm"}
              name={`team-${index}`}
              value={team.name || ""}
              onChange={(e) => {
                const newTeams = [...editedBook.teams]
                newTeams[index] = { ...newTeams[index], name: e.target.value }
                setEditedBook((prev) => ({ ...prev, teams: newTeams }))
              }}
              margin="normal"
              disabled={!isEditing}
            />
          ))}
          <Box mt={2} mb={2}>
            <Typography variant="subtitle1" gutterBottom>
              Thể loại
            </Typography>
            <CategoryContainer>
              {editedBook.categories.map((category) => (
                <CategoryChip
                  key={category.id}
                  label={category.name}
                  onDelete={isEditing ? () => handleRemoveCategory(category.id) : undefined}
                  deleteIcon={<CloseIcon />}
                />
              ))}
            </CategoryContainer>
            {isEditing && (
              <Box display="flex" alignItems="center" mt={2}>
                <CategoryAutocomplete
                  options={categories}
                  getOptionLabel={(option) => option.name}
                  value={selectedCategory}
                  onChange={(_, newValue) => setSelectedCategory(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Chọn thể loại" variant="outlined" size="small" />
                  )}
                  size="small"
                />
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddCategory}
                  disabled={!selectedCategory}
                  sx={{ ml: 1, height: "40px" }}
                >
                  Thêm
                </Button>
              </Box>
            )}
          </Box>
          <TextField
            fullWidth
            label="Mô tả"
            name="description"
            value={editedBook.description || ""}
            onChange={handleInputChange}
            multiline
            rows={4}
            margin="normal"
            disabled={!isEditing}
          />
          <FormControl fullWidth margin="normal" disabled={!isEditing}>
            <InputLabel id="book-status-label">Trạng thái</InputLabel>
            <Select
              labelId="book-status-label"
              id="book-status"
              value={editedBook.status}
              onChange={handleStatusChange}
              label="Trạng thái"
            >
              {bookStatuses.map((status) => (
                <MenuItem key={status.id} value={status.id}>
                  {status.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="body2" color="textSecondary">
            Thời gian đăng: {new Date(editedBook.date_upload).toLocaleDateString()}
          </Typography>
        </Grid>
      </Grid>
    </StyledBox>
  )
}

export default BookDetailsComponent

