import type React from "react"
import { useState } from "react"
import { Grid, TextField, Button, Typography, Switch, FormControlLabel, Chip, Box } from "@mui/material"
import { styled } from "@mui/material/styles"
import type { BookDetails as BookDetailsType } from "../../services/book"

const ImageUpload = styled("div")(({ theme }) => ({
  width: "256px",
  height: "400px",
  border: `1px dashed ${theme.palette.divider}`,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}))

interface BookDetailsProps {
  book: BookDetailsType
}

const BookDetailsComponent: React.FC<BookDetailsProps> = ({ book }) => {
  const [title, setTitle] = useState(book.title || "")
  const [author] = useState(book.authors[0]?.pen_name || "")
  const [artist, setArtist] = useState(book.artist || "")
  const [description, setDescription] = useState(book.description || "")
  const [isCompleted, setIsCompleted] = useState(book.status === 2)

  const handleImageUpload = () => {
    // Implement image upload logic
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <ImageUpload onClick={handleImageUpload}>
          {book.img ? (
            <img
              src={book.img || "/placeholder.svg"}
              alt="Book cover"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          ) : (
            <Typography>Đăng ảnh</Typography>
          )}
        </ImageUpload>
      </Grid>
      <Grid item xs={12} md={8}>
        <TextField fullWidth label="Tiêu đề" value={title} onChange={(e) => setTitle(e.target.value)} margin="normal" />
        <TextField fullWidth label="Tác giả" value={author} disabled margin="normal" />
        <TextField
          fullWidth
          label="Họa sĩ"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          margin="normal"
        />
        <TextField fullWidth label="Nhóm dịch" value={book.workerid.toString()} disabled margin="normal" />
        <Box mt={2} mb={2}>
          <Typography variant="subtitle1">Thể loại</Typography>
          {book.categories.map((category, index) => (
            <Chip key={index} label={category} onDelete={() => {}} style={{ margin: "0 4px 4px 0" }} />
          ))}
          <Button variant="outlined" size="small">
            Thêm thể loại
          </Button>
        </Box>
        <TextField
          fullWidth
          label="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={4}
          margin="normal"
        />
        <FormControlLabel
          control={
            <Switch
              checked={isCompleted}
              onChange={(e) => setIsCompleted(e.target.checked)}
              name="status"
              color="primary"
            />
          }
          label={isCompleted ? "Đã hoàn thành" : "Đang tiến hành"}
        />
        <Typography variant="body2" color="textSecondary">
          Thời gian đăng: {new Date(book.date_upload).toLocaleDateString()}
        </Typography>
      </Grid>
    </Grid>
  )
}

export default BookDetailsComponent

