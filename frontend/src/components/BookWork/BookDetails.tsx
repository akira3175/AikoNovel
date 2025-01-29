import type React from "react"
import { useState } from "react"
import {
  Grid,
  TextField,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  Chip,
  Box,
  Paper,
  IconButton,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import CancelIcon from "@mui/icons-material/Cancel"
import type { BookDetails as BookDetailsType } from "../../services/book"
import ImageUpload from "../common/ImageUpload"

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}))

const CategoryChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}))

interface BookDetailsProps {
  book: BookDetailsType
  onUpdate: (updatedBook: BookDetailsType) => void
}

const BookDetailsComponent: React.FC<BookDetailsProps> = ({ book, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedBook, setEditedBook] = useState<BookDetailsType>(book)

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    if (!isEditing) {
      setEditedBook(book)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedBook((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedBook((prev) => ({ ...prev, status: e.target.checked ? 2 : 1 }))
  }

  const handleSave = () => {
    onUpdate(editedBook)
    setIsEditing(false)
  }

  const handleAddCategory = () => {
    // Implement add category logic
  }

  const handleRemoveCategory = (category: string) => {
    setEditedBook((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== category),
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
            disabled={!isEditing}
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
          <TextField fullWidth label="Tác giả" value={editedBook.authors[0]?.pen_name || ""} disabled margin="normal" />
          <TextField
            fullWidth
            label="Họa sĩ"
            name="artist"
            value={editedBook.artist || ""}
            onChange={handleInputChange}
            margin="normal"
            disabled={!isEditing}
          />
          <TextField fullWidth label="Nhóm dịch" value={editedBook.workerid.toString()} disabled margin="normal" />
          <Box mt={2} mb={2}>
            <Typography variant="subtitle1" gutterBottom>
              Thể loại
            </Typography>
            <Box display="flex" flexWrap="wrap">
              {editedBook.categories.map((category, index) => (
                <CategoryChip
                  key={index}
                  label={category}
                  onDelete={isEditing ? () => handleRemoveCategory(category) : undefined}
                />
              ))}
              {isEditing && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddCategory}
                  style={{ marginLeft: 8 }}
                >
                  Thêm thể loại
                </Button>
              )}
            </Box>
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
          <FormControlLabel
            control={
              <Switch
                checked={editedBook.status === 2}
                onChange={handleStatusChange}
                name="status"
                color="primary"
                disabled={!isEditing}
              />
            }
            label={editedBook.status === 2 ? "Đã hoàn thành" : "Đang tiến hành"}
          />
          <Typography variant="body2" color="textSecondary">
            Thời gian đăng: {new Date(editedBook.date_upload).toLocaleDateString()}
          </Typography>
        </Grid>
      </Grid>
      {isEditing && (
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSave}>
            Lưu thay đổi
          </Button>
        </Box>
      )}
    </StyledBox>
  )
}

export default BookDetailsComponent

